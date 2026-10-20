import { NextResponse } from "next/server";

// Mock API — simula ciclo agêntico real (Apify + Scout + HF)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { construtoras = ["MRV"], keyword = "mcmv aparecida" } = body;

  // Simula latência de scraping
  await new Promise((r) => setTimeout(r, 600));

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    fontes: {
      instagram: { perfis: 38, comentarios: 127, bios_com_tel: 31, bios_com_email: 22 },
      google_maps: { imobiliarias: 14, com_telefone: 9 },
      intent: { keyword, grupos_fb: 3, simulacoes_caixa: 7 },
    },
    leads: [
      { nome: "Teste Lead API", telefone: "62990000000", score: 84, bairro: "Alto da Boa Vista", origem: "instagram", construtora: construtoras[0] },
    ],
    sheets: {
      spreadsheet: "Leads MCMV GO 2026",
      aba: "Aparecida",
      linhas_adicionadas: 9,
      url: "https://docs.google.com/spreadsheets/d/mock",
    },
    docs: {
      gerados: 2,
      pasta: "BVC • Aparecida",
    },
    mensagem: "Ciclo agêntico concluído. 9 leads adicionados ao Sheets. 3 aguardando aprovação humana.",
  });
}

export async function GET() {
  return NextResponse.json({ status: "BVC Prospector API • MCMV GO • harness ativo", version: "1.0.0", endpoints: ["POST /api/prospect"] });
}
