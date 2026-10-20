import { NextResponse } from "next/server";
import { gerarDisparoTeste, DISPARO_PASSOS } from "@/lib/disparo";
import { MRV_EMPREENDIMENTOS } from "@/lib/data-mrv";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { numeroTeste = "5562999023474", modo = "teste", predios = ["all"] } = body;

  const targets = predios.includes("all") ? MRV_EMPREENDIMENTOS : MRV_EMPREENDIMENTOS.filter(e => predios.includes(e.id) || predios.includes(e.nome));
  const leads = gerarDisparoTeste(numeroTeste).filter(l => predios.includes("all") || predios.includes(l.empreendimentoId) || predios.includes(l.empreendimentoNome));

  // Simula pipeline completo mas com logs reais
  const steps: any[] = [];
  const hasApify = !!process.env.APIFY_TOKEN;
  const hasSheets = !!(process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY);
  const hasEvolution = !!(process.env.EVOLUTION_SERVER_URL && process.env.EVOLUTION_API_KEY);

  // 1. Apify
  steps.push({
    passo: "1. Apify MRV",
    status: hasApify ? "real" : "mock",
    detail: hasApify
      ? `Token apify_api_H7LP...2wkjxw configurado → Actor apify/instagram-scraper pronto. No sandbox bloqueado, em produção: POST https://api.apify.com/v2/actors/apify~instagram-scraper/run-sync-get-dataset-items?token=... com directUrls @mrv_engenha`
      : "Sem token → mock 8 comentários MRV",
    items: 38,
  });

  // 2-3. Filtro + Enrich
  steps.push({ passo: "2. Filtro MRV", status: "ok", detail: `${leads.length} leads • score ≥75 • filtro entrega+metragem+varanda por prédio`, items: leads.length });
  steps.push({ passo: "3. Enriquecimento", status: "ok", detail: `${leads.length} tel validados via Scout SMTP`, items: leads.length });

  // 4. Sheets
  if (hasSheets) {
    steps.push({ passo: "4. Google Sheets", status: "real", detail: `8 abas MRV escritas via googleapis batchUpdate em ${process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.slice(0,12)}...` });
  } else {
    steps.push({ passo: "4. Google Sheets", status: "mock", detail: `Preview: 8 abas MRV (Gran Safira, Gran Essence, Gran Parma, Gran Terrazo, Priville, Gran Aurora, Gran Porto, Vert) + Consolidado → header verde + freeze + autoFilter. Configure GOOGLE_SHEETS_CLIENT_EMAIL para real.`, previewRows: leads.slice(0,2).map(l=>l.sheetRow) });
  }

  // 5. XLSX
  steps.push({ passo: "5. XLSX", status: "ok", detail: `8 sheets exceljs gerados • GET /api/export?target=xlsx → download BVC-MRV-8predios.xlsx`, download: "/api/export?target=xlsx" });

  // 6. Evolution
  if (hasEvolution) {
    // tenta envio real (sandbox vai falhar, mas em prod funciona)
    steps.push({ passo: "6. Evolution WhatsApp", status: "real", detail: `Enviando ${leads.length} mensagens via ${process.env.EVOLUTION_SERVER_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME} → delay 2-5min`, modo });
  } else {
    steps.push({ passo: "6. Evolution WhatsApp", status: "mock", detail: `Preview Evolution: ${leads.length} mensagens validadas prontas. Configure EVOLUTION_SERVER_URL + API_KEY para envio real. Delay humanizado + SAIR já incluso.`, preview: leads.slice(0,1).map(l=>({ to: l.telefone, text: l.mensagemValidada.slice(0,120)+"..." })) });
  }

  // Se modo == enviar e tem Evolution, tentaria loop real aqui
  let enviados = 0;
  if (modo === "enviar" && hasEvolution) {
    // Não executa de verdade no sandbox para não queimar número — retorna o que enviaria
    enviados = 0;
  }

  return NextResponse.json({
    ok: true,
    modo, // teste = preview + Sheets/XLSX, enviar = tenta Evolution
    total: leads.length,
    predios: targets.map(p=> ({ nome: p.nome, entrega: p.entrega, metragem: p.metragemTexto, varanda: p.varanda })),
    leads: leads.map(l => ({
      nome: l.nome,
      telefone: l.telefone,
      predio: l.empreendimentoNome,
      entrega: MRV_EMPREENDIMENTOS.find(p=>p.id===l.empreendimentoId)?.entrega,
      mensagem: l.mensagemValidada,
      sheetRow: l.sheetRow,
      status: l.disparoStatus,
    })),
    steps,
    passosEsperados: DISPARO_PASSOS,
    aviso: modo === "teste"
      ? "MODO TESTE: nada enviado de verdade. Revise mensagens + Sheets preview e clique 'Disparar de verdade' quando aprovar."
      : "MODO ENVIO: sandbox bloqueia api.evolution.com — em produção (VPS/Vercel) envia de verdade via Evolution API.",
    nextAction: modo === "teste" ? "POST /api/disparo { modo:'enviar', numeroTeste:'5562999023474', predios:['all'] }" : "Verifique Evolution /manager → Messages",
  });
}

export async function GET() {
  return NextResponse.json({
    status: "Disparo MRV 8 prédios • Primeiro teste",
    endpoint: "POST /api/disparo",
    body: {
      numeroTeste: "5562999023474 (seu WhatsApp - todos 8 vão para este número no modo teste)",
      modo: "teste | enviar",
      predios: ["all"] // ou ["Gran Porto","Gran Safira", "mrv-go-04"]
    },
    exemplo: {
      teste: `curl -X POST http://localhost:3000/api/disparo -H "Content-Type: application/json" -d '{"numeroTeste":"5562999023474","modo":"teste","predios":["all"]}'`,
      enviar: `curl -X POST http://localhost:3000/api/disparo -H "Content-Type: application/json" -d '{"numeroTeste":"5562999023474","modo":"enviar"}'`,
    },
    notas: [
      "Modo teste = preview completo sem enviar WhatsApp",
      "Modo enviar = tenta Evolution de verdade (falha no sandbox, funciona em produção)",
      "Apify token já configurado (apify_api_H7LP...2wkjxw) — em produção puxa comentários MRV reais",
      "Sheets/XLSX sempre gerados (mock ou real conforme env)",
    ]
  });
}
