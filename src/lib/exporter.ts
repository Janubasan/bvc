// Exporter central — Google Sheets (gsheeter) + XLSX (exceljs) + CSV
// Suporta 8 prédios MRV sistematizados, cada um em aba/sheet própria

import { MRV_EMPREENDIMENTOS } from "./data-mrv";
import { Lead, LEADS_MOCK } from "./data";

export const MRV_HEADERS = [
  "Nome",
  "Telefone",
  "Email",
  "Instagram",
  "Interesse (Prédio)",
  "Entrega (Mês/Ano)",
  "Metragem",
  "Varanda",
  "Bairro",
  "Cidade",
  "Faixa",
  "Renda Estimada",
  "Origem",
  "Score",
  "Status",
  "Intent Signals",
  "Criado em",
  "Financiamento",
];

export function leadToRow(lead: Lead, emp?: any): any[] {
  return [
    lead.nome,
    lead.telefone,
    lead.email || "",
    lead.instagram || "",
    lead.interesse || emp?.nome || lead.bairroInteresse,
    emp?.entrega || "",
    emp?.metragemTexto || "",
    emp?.varanda || "",
    lead.bairroInteresse,
    lead.cidade,
    lead.faixa,
    lead.rendaEstimada,
    lead.origem,
    lead.score,
    lead.status,
    (lead.intentSignals || []).join(" | "),
    new Date(lead.createdAt).toLocaleString("pt-BR"),
    emp?.financiamento || "420 meses • FGTS • menores taxas",
  ];
}

export function buildMRVMatrix(leads: Lead[] = LEADS_MOCK) {
  // Agrupa leads por prédio (bairroInteresse contém nome do prédio)
  const byPredio: Record<string, Lead[]> = {};
  MRV_EMPREENDIMENTOS.forEach((emp) => (byPredio[emp.nome] = []));
  // fallback: distribui mock leads por prédio round-robin
  leads.forEach((lead, idx) => {
    // tenta match por nome do prédio no interesse
    const matched = MRV_EMPREENDIMENTOS.find((e) => lead.bairroInteresse.includes(e.nome) || lead.interesse.includes(e.nome) || lead.bairroInteresse.includes(e.nomeCurto));
    const target = matched ? matched.nome : MRV_EMPREENDIMENTOS[idx % MRV_EMPREENDIMENTOS.length].nome;
    byPredio[target].push(lead);
  });

  const matrices: Record<string, any[][]> = {};
  MRV_EMPREENDIMENTOS.forEach((emp) => {
    const rows = [MRV_HEADERS, ...byPredio[emp.nome].map((lead) => leadToRow(lead, emp))];
    matrices[emp.nome] = rows;
    matrices[emp.nomeCurto] = rows; // alias curto para nome da aba
  });

  // Matriz consolidada (todos)
  const allRows = [MRV_HEADERS, ...leads.map((l) => {
    const emp = MRV_EMPREENDIMENTOS.find((e) => l.bairroInteresse.includes(e.nome) || l.interesse.includes(e.nome));
    return leadToRow(l, emp);
  })];
  matrices["Consolidado"] = allRows;

  return matrices;
}

// Gera XLSX via exceljs (Node) — streaming
export async function generateXLSX(leads: Lead[] = LEADS_MOCK, predios: string[] = ["all"]): Promise<Buffer> {
  const ExcelJS = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "BVC Prospector MRV";
  wb.created = new Date();

  const matrices = buildMRVMatrix(leads);
  const targets = predios.includes("all") || predios.length === 0
    ? MRV_EMPREENDIMENTOS.map((e) => e.nome).concat(["Consolidado"])
    : predios;

  for (const name of targets) {
    const matrix = matrices[name];
    if (!matrix) continue;
    const emp = MRV_EMPREENDIMENTOS.find((e) => e.nome === name || e.nomeCurto === name);
    const ws = wb.addWorksheet(name.slice(0, 31), {
      properties: { tabColor: { argb: emp ? emp.cor.replace("bg-", "").replace("#","") : "22C55E" } },
    });

    matrix.forEach((row, idx) => {
      const r = ws.addRow(row);
      if (idx === 0) {
        r.font = { bold: true, color: { argb: "FFFFFFFF" } };
        r.fill = { type: "pattern", pattern: "solid", fgColor: { argb: emp ? "FF16A34A" : "FF16A34A" } } as any;
        r.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        ws.views = [{ state: "frozen", ySplit: 1 }];
      } else {
        r.alignment = { vertical: "middle" };
        // score color
        const score = Number(row[13]);
        if (score >= 85) r.getCell(14).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } } as any;
        // status validation dropdown
        // exceljs dataValidation per cell
        r.getCell(15).dataValidation = {
          type: "list",
          formulae: ['"novo,qualificado,contatado,agendado,convertido,descartado"'],
        } as any;
      }
    });

    // Auto filter + columns
    ws.autoFilter = `A1:${String.fromCharCode(64 + MRV_HEADERS.length)}1`;
    ws.columns = MRV_HEADERS.map((h) => ({ header: h, width: h.length < 10 ? 14 : h.length > 18 ? 22 : 16 }));
    ws.getRow(1).height = 18;
  }

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer as any);
}

export function generateCSV(leads: Lead[] = LEADS_MOCK): string {
  const matrices = buildMRVMatrix(leads);
  const rows = matrices["Consolidado"];
  // simples CSV com aspas
  return rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}
