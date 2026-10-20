// Disparo engine — 8 prédios MRV, 1 lead teste por prédio, mensagem validada + 420x FGTS
import { MRV_EMPREENDIMENTOS } from "./data-mrv";
import { LEADS_MOCK, Lead } from "./data";

export type DisparoLead = Lead & {
  empreendimentoId: string;
  empreendimentoNome: string;
  mensagemValidada: string;
  sheetRow: any[];
  disparoStatus: "fila" | "enviado" | "erro" | "aprovacao";
};

export function gerarMensagemMRV(emp: typeof MRV_EMPREENDIMENTOS[0], nome = "{{nome}}") {
  // Abertura validada que você forneceu + financiamento 420x
  return `Oi ${nome}! 👋 MRV ${emp.nome} (${emp.cidade} — ${emp.bairro}) — ${emp.metragemTexto} ${emp.varanda.toLowerCase()}, entrega ${emp.entrega}. Financie em até 420 meses, use seu FGTS, menores taxas, seu 1º apê! Posso te mandar a planta ${emp.metragemTexto} e a simulação 420x com FGTS em 1 min?`;
}

export function gerarDisparoTeste(numeroTeste?: string): DisparoLead[] {
  const nomes = ["Ana Paula", "Carlos Eduardo", "Juliana", "Roberto", "Fernanda", "Marcos", "Patrícia", "Diego"];
  return MRV_EMPREENDIMENTOS.map((emp, idx) => {
    const base = LEADS_MOCK[idx % LEADS_MOCK.length];
    const nome = nomes[idx];
    const lead: DisparoLead = {
      ...base,
      id: `DISP-${emp.id}-${Date.now().toString().slice(-4)}`,
      nome,
      telefone: numeroTeste ? numeroTeste.replace(/\D/g,"") : `6299${String(10000000 + idx*11111111).slice(0,8)}`,
      bairroInteresse: emp.nome,
      cidade: emp.cidade,
      interesse: `${emp.nome} ${emp.metragemTexto} ${emp.varanda} entrega ${emp.entrega}`,
      construtoraAlvo: "MRV Engenharia",
      faixa: emp.faixa[0] as any,
      empreendimentoId: emp.id,
      empreendimentoNome: emp.nome,
      mensagemValidada: gerarMensagemMRV(emp, nome),
      sheetRow: [],
      disparoStatus: "fila",
      score: 82 + idx,
    };
    // row para Sheets/XLSX
    lead.sheetRow = [
      lead.nome, lead.telefone, lead.email || "", lead.instagram || "",
      emp.nome, emp.entrega, emp.metragemTexto, emp.varanda,
      emp.bairro, emp.cidade, lead.faixa, lead.rendaEstimada, "instagram-mrv", lead.score, "fila", lead.intentSignals.join(" | "), new Date().toISOString(), "420 meses • FGTS • menores taxas"
    ];
    return lead;
  });
}

export const DISPARO_PASSOS = [
  { id: "apify", titulo: "1. Apify Instagram MRV", desc: "Actor apify/instagram-scraper → directUrls @mrv_engenha → posts 'Gran Porto valor?' → comments", api: "POST /api/apify", tempo: "~45s por prédio" },
  { id: "filtro", titulo: "2. Filtro MRV + Faixa", desc: "Regex nome prédio + entrega + metragem + varanda → score ≥75", tempo: "0.3s" },
  { id: "enrich", titulo: "3. Enriquecimento", desc: "Bio → tel/email → SMTP verify (Scout) → score", tempo: "1.2s" },
  { id: "sheets", titulo: "4. Google Sheets 8 abas", desc: "gsheeter: sheet.matrix = rows → batchUpdate 8 tabs MRV + Consolidado", api: "POST /api/export", tempo: "~2s" },
  { id: "xlsx", titulo: "5. XLSX Backup", desc: "exceljs 8 sheets formatados + autoFilter + dropdown Status", api: "GET /api/export?target=xlsx", tempo: "~1s" },
  { id: "evolution", titulo: "6. Evolution WhatsApp", desc: "POST /message/sendText/{instance} → delay 2-5min + opt-out SAIR", api: "POST /api/evolution", tempo: "1.5s/msg" },
  { id: "log", titulo: "7. Log + Retenção", desc: "Sheets log + Drive backup Apps Script diário 06:00", tempo: "auto" },
];
