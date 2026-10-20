import { NextResponse } from "next/server";
import { validarLote, ESTRATEGIAS_VALIDADAS, CHECKLIST_LEAD_QUENTE } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(()=> ({}));
  const { numeros = [], intentScores = [], modo = "validar" } = body as { numeros:string[], intentScores?:number[], modo?:string };

  if (!numeros.length) return NextResponse.json({ ok:false, error:"Envie { numeros: ['629999023474', '(62) 99234-5678', ...] }"}, {status:400});

  const res = validarLote(numeros, { intentScores });
  const validados = res.resultados.filter(r=>r.status==="validado");

  // CSV com header real - pronto para copiar/baixar
  const header = "Telefone_Nacional,Telefone_E164,DDD,Operadora,Score_Quente,StatusWhatsApp";
  const csvBody = validados.map(r=> `"${r.nacional}","${r.e164}","${r.ddd}","${r.operadora}",${r.scoreQuente},"${r.whatsappProbable ? 'SIM' : 'NAO'}"`).join("\n");
  const csvCompleto = header + "\n" + csvBody;

  // Listas separadas para copiar fácil
  const listaE164 = validados.map(r=> r.e164).join("\n");
  const listaNacional = validados.map(r=> r.nacional).join("\n");
  const listaWhatsApp = validados.filter(r=>r.whatsappProbable).map(r=> r.e164?.replace("+","")).join("\n");

  return NextResponse.json({
    ok: true,
    modo,
    resumo: { total: res.total, validados: res.validados, duvidosos: res.duvidosos, invalidos: res.invalidos, ddd62: res.ddd62, whatsapp: res.whatsapp, prontosParaZap: validados.filter(r=>r.whatsappProbable).length },
    validados: validados.map((r,i)=> ({ idx: i+1, original:r.original, nacional: r.nacional, e164:r.e164, ddd: r.ddd, operadora:r.operadora, scoreQuente:r.scoreQuente, whatsapp: r.whatsappProbable })),
    duvidosos: res.resultados.filter(r=>r.status==="duvidoso").map(r=> ({ original:r.original, motivo:r.motivo, nacional:r.nacional })),
    invalidos: res.resultados.filter(r=>r.status==="invalido").map(r=> ({ original:r.original, motivo:r.motivo })),
    export: { 
      header,
      csv: csvCompleto, 
      listaE164,
      listaNacional,
      listaWhatsApp,
      count: validados.length
    },
    avisoLGPD: "Só use números com opt-in (Meta OTP, QR plantão, landing com consentimento). Números sem permissão = bloqueio Evolution + LGPD.",
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template");

  if (template === "csv") {
    const header = "Nome,Telefone_Nacional,Telefone_E164,Predio_MRV,Score_Quente,Origem_OptIn\n";
    const exemplo = `"João Silva","(62) 9XXXX-XXXX","+55629XXXXXXX","GRAN PORTO",85,"Meta OTP - substitua por seus leads reais"\n`;
    const body = header + exemplo + `"Maria Souza","(62) 9XXXX-XXXX","+55629XXXXXXX","GRAN SAFIRA",78,"QR Plantão - substitua"\n`;
    return new NextResponse(body, { headers: { "Content-Type":"text/csv; charset=utf-8", "Content-Disposition": `attachment; filename=template-validador-BVC-62.csv` }});
  }

  return NextResponse.json({
    ok: true,
    titulo: "Validador BVC — DDD 62 Goiânia/Aparecida — 6 motores",
    motores: ["formato BR (libphonenumber-js)", "DDD 62/64/61", "tipo MOBILE 9 dígitos", "operadora", "WhatsApp probable", "HLR/Evolution checkExists (em produção)", "score quente FGTS/420x"],
    uso: { 
      validar: "POST /api/validate { numeros: ['629999023474', '(62) 99902-3474'] }", 
      template: "GET /api/validate?template=csv — baixa modelo vazio para preencher",
      copiaECola: "Cole 1 número por linha no Validador 62 > Validar > Copiar E164 / Baixar CSV" 
    },
    checklist: CHECKLIST_LEAD_QUENTE,
    estrategias: ESTRATEGIAS_VALIDADAS,
    importante: "Não fornecemos números reais. Validador só processa sua base com opt-in (LGPD). Use Meta Lead Ads + OTP ou QR plantão para captar.",
  });
}
