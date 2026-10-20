import { NextResponse } from "next/server";
import { validarLote, ESTRATEGIAS_VALIDADAS, CHECKLIST_LEAD_QUENTE } from "@/lib/validation";
import { LISTAS_MODELO, getListaRows } from "@/lib/listas-validadas";

export async function POST(req: Request) {
  const body = await req.json().catch(()=> ({}));
  const { numeros = [], intentScores = [], modo = "validar" } = body as { numeros:string[], intentScores?:number[], modo?:string };

  if (!numeros.length) return NextResponse.json({ ok:false, error:"Envie { numeros: ['629999023474', '(62) 99234-5678', ...] }"}, {status:400});

  const res = validarLote(numeros, { intentScores });
  const validados = res.resultados.filter(r=>r.status==="validado");
  const prontosParaZap = validados.filter(r=>r.whatsappProbable);

  return NextResponse.json({
    ok: true,
    modo,
    resumo: { total: res.total, validados: res.validados, duvidosos: res.duvidosos, invalidos: res.invalidos, ddd62: res.ddd62, whatsapp: res.whatsapp, prontosParaZap: prontosParaZap.length },
    validados: validados.map(r=> ({ original:r.original, e164:r.e164, nacional:r.nacional, operadora:r.operadora, scoreQuente:r.scoreQuente, status:r.status })),
    duvidosos: res.resultados.filter(r=>r.status==="duvidoso").map(r=> ({ original:r.original, motivo:r.motivo, nacional:r.nacional })),
    invalidos: res.resultados.filter(r=>r.status==="invalido").map(r=> ({ original:r.original, motivo:r.motivo })),
    export: { csv: validados.map(r=> `${r.nacional},${r.e164},${r.operadora},${r.scoreQuente}`).join("\n"), xlsxVia: "POST /api/export com validados", whatsappPayload: prontosParaZap.slice(0,5).map(r=> ({ number:r.e164?.replace("+",""), text:`Oi {{nome}}! MRV entrega + FGTS 420x — posso te mandar simulação? Responda SAIR para não receber.` })) },
    estrategias: ESTRATEGIAS_VALIDADAS.slice(0,2),
    checklist: CHECKLIST_LEAD_QUENTE,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lista = searchParams.get("lista");
  const format = searchParams.get("format") || "json";

  if (lista) {
    const modelo = LISTAS_MODELO.find(l=>l.id===lista);
    const rows = getListaRows(lista);
    if (!modelo || !rows) return NextResponse.json({ ok:false, error:"lista não encontrada", disponiveis: LISTAS_MODELO.map(l=>l.id)}, {status:404});
    if (format === "csv") {
      const headers = Object.keys(rows[0]).join(",");
      const body = rows.map(r=> Object.values(r).map(v=> `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
      return new NextResponse(headers+"\n"+body, { headers: { "Content-Type":"text/csv; charset=utf-8", "Content-Disposition": `attachment; filename=${modelo.arquivo}` }});
    }
    return NextResponse.json({ ok:true, lista: modelo, rows: rows.slice(0,20), aviso:"DEMO — números sintéticos válidos formato BR, não são pessoas reais. Produção: importe seu CSV real em POST /api/validate", downloadCSV: `/api/validate?lista=${lista}&format=csv` });
  }

  return NextResponse.json({
    ok: true,
    titulo: "Validador BVC — DDD 62 Goiânia/Aparecida — 6 motores",
    motores: ["formato BR (libphonenumber-js)", "DDD 62/64/61", "tipo MOBILE", "operadora", "WhatsApp probable", "HLR Twilio (checkHLR=true)", "score quente intent"],
    listasModelo: LISTAS_MODELO.map(l=> ({ id:l.id, nome:l.nome, validados:l.validados, taxa:l.taxaValido, preview:l.preview.slice(0,2), download:`/api/validate?lista=${l.id}&format=csv`, json:`/api/validate?lista=${l.id}` })),
    estrategias: ESTRATEGIAS_VALIDADAS,
    checklist: CHECKLIST_LEAD_QUENTE,
    uso: { validar: "POST /api/validate { numeros: ['62999902347', '(62) 99902-3474'] }", baixarLista: "GET /api/validate?lista=gran-porto-quentes&format=csv" },
  });
}
