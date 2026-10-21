// Exporter central — Google Sheets (gsheeter) + XLSX (exceljs) + CSV + TXT
// Suporta 8 prédios MRV sistematizados, cada um em aba/sheet própria
// B2C focado: renda 3k-10k, Faixa MCMV, parcela 30%, CPF, Gates

import { MRV_EMPREENDIMENTOS } from "./data-mrv";
import { Lead, LEADS_MOCK } from "./data";

export const MRV_HEADERS = [
  "Nome",
  "CPF",
  "Idade",
  "Vínculo",
  "Profissão",
  "Renda Estimada",
  "Faixa MCMV",
  "Parcela Máx (30%)",
  "Telefone",
  "Email",
  "Instagram",
  "Interesse (Prédio)",
  "Entrega (Mês/Ano)",
  "Metragem",
  "Varanda",
  "Bairro",
  "Cidade",
  "Origem",
  "Score Crédito",
  "Score Final",
  "Status",
  "Motivo",
  "Financiamento",
];

export function leadToRow(lead: Lead, emp?: any): any[] {
  const faixa = faixaDe(lead.rendaEstimada);
  const parcela = Math.round(lead.rendaEstimada * 0.30);
  // CPF mock se não tiver
  const cpf = (lead as any).cpf || mockCPForLead(lead.id);
  return [
    lead.nome,
    cpf,
    (lead as any).idade || 28,
    (lead as any).vinculo || "CLT",
    (lead as any).profissao || "Vendedor(a)",
    `R$ ${lead.rendaEstimada.toLocaleString("pt-BR")}`,
    faixa.label,
    `R$ ${parcela.toLocaleString("pt-BR")}`,
    lead.telefone,
    lead.email || "",
    lead.instagram || "",
    lead.interesse || emp?.nome || lead.bairroInteresse,
    emp?.entrega || "",
    emp?.metragemTexto || "",
    emp?.varanda || "",
    lead.bairroInteresse,
    lead.cidade,
    lead.origem,
    (lead as any).credit || 650,
    lead.score,
    lead.status === "qualificado" ? "approved" : lead.status === "novo" ? "human_review" : lead.status,
    (lead as any).reason || lead.interesse,
    emp?.financiamento || "420 meses • FGTS • menores taxas",
  ];
}

function faixaDe(renda: number){
  if (renda >= 3000 && renda < 4700) return { label:'Faixa 2', cls:'f2' };
  if (renda >= 4700 && renda <= 8600) return { label:'Faixa 3', cls:'f3' };
  if (renda > 8600 && renda <= 10000) return { label:'Faixa 3+', cls:'f3p' };
  return { label:'Fora MCMV', cls:'' };
}

function mockCPForLead(id: string){
  // CPF determinístico por ID para visual
  let h = 0; for(let i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) & 0xffffffff;
  const a = String(Math.abs(h)%1000).padStart(3,'0');
  const b = String((Math.abs(h>>8)%1000)).padStart(3,'0');
  const c = String((Math.abs(h>>16)%1000)).padStart(3,'0');
  const d = String((Math.abs(h>>20)%100)).padStart(2,'0');
  return `${a}.${b}.${c}-${d}`;
}

export function buildMRVMatrix(leads: Lead[] = LEADS_MOCK) {
  const byPredio: Record<string, Lead[]> = {};
  MRV_EMPREENDIMENTOS.forEach((emp) => (byPredio[emp.nome] = []));
  leads.forEach((lead, idx) => {
    const matched = MRV_EMPREENDIMENTOS.find((e) => lead.bairroInteresse.includes(e.nome) || lead.interesse.includes(e.nome) || lead.bairroInteresse.includes(e.nomeCurto));
    const target = matched ? matched.nome : MRV_EMPREENDIMENTOS[idx % MRV_EMPREENDIMENTOS.length].nome;
    byPredio[target].push(lead);
  });

  const matrices: Record<string, any[][]> = {};
  MRV_EMPREENDIMENTOS.forEach((emp) => {
    const rows = [MRV_HEADERS, ...byPredio[emp.nome].map((lead) => leadToRow(lead, emp))];
    matrices[emp.nome] = rows;
    matrices[emp.nomeCurto] = rows;
  });

  const allRows = [MRV_HEADERS, ...leads.map((l) => {
    const emp = MRV_EMPREENDIMENTOS.find((e) => l.bairroInteresse.includes(e.nome) || l.interesse.includes(e.nome));
    return leadToRow(l, emp);
  })];
  matrices["Consolidado"] = allRows;
  return matrices;
}

// Gera XLSX via exceljs
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
      properties: { tabColor: { argb: "FF16A34A" } },
    });

    matrix.forEach((row, idx) => {
      const r = ws.addRow(row);
      if (idx === 0) {
        r.font = { bold: true, color: { argb: "FFFFFFFF" } };
        r.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A7D5A" } } as any;
        r.alignment = { vertical: "middle", horizontal: "center", wrapText: true } as any;
        ws.views = [{ state: "frozen", ySplit: 1 }];
        r.height = 22;
      } else {
        r.alignment = { vertical: "middle" } as any;
        const faixa = String(row[6]);
        if (faixa.includes("Faixa 2")) r.getCell(7).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F5EF" } } as any;
        if (faixa.includes("Faixa 3+")) r.getCell(7).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF8E5" } } as any;
        const status = String(row[20]);
        if (status === "approved") r.getCell(21).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F5EF" } } as any;
        if (status === "blocked") r.getCell(21).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDECEB" } } as any;
      }
    });

    ws.autoFilter = `A1:${String.fromCharCode(64 + Math.min(26, MRV_HEADERS.length))}1`;
    ws.columns = MRV_HEADERS.map((h) => ({ header: h, width: h.length < 12 ? 15 : h.length > 20 ? 24 : 18, key: h }));
    ws.getRow(1).height = 22;
  }

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer as any);
}

export function generateCSV(leads: Lead[] = LEADS_MOCK): string {
  const matrices = buildMRVMatrix(leads);
  const rows = matrices["Consolidado"];
  // BOM + aspas corretas para Excel
  return "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function generateTXT(leads: Lead[] = LEADS_MOCK): string {
  const matrices = buildMRVMatrix(leads);
  const rows = matrices["Consolidado"];
  if (rows.length === 0) return "";
  const header = rows[0] as string[];
  // TXT tab-separated com BOM para Excel, ou para colar no Sheets
  const lines = [header.join("\t")];
  for (let i=1;i<rows.length;i++){
    const r = rows[i] as any[];
    // limpa quebras de linha internas
    lines.push(r.map(c => String(c??"").replace(/\t/g," ").replace(/\r?\n/g," ")).join("\t"));
  }
  return lines.join("\n");
}

export function generateTXTWhatsapp(leads: Lead[] = LEADS_MOCK): string {
  // Formato limpo para disparo: Nome | Telefone limpo | Parcela | Faixa
  return leads.map(l => {
    const tel = l.telefone.replace(/\D/g,"");
    const faixa = faixaDe(l.rendaEstimada).label;
    const parcela = Math.round(l.rendaEstimada*0.30);
    return `${l.nome} | ${tel} | ${faixa} | parcela R$ ${parcela} | ${l.bairroInteresse}`;
  }).join("\n");
}

export function generateB2CRows(leads: any[]): any[][] {
  const headers = ["Nome","CPF","Idade","Vínculo","Profissão","Renda","Faixa MCMV","Parcela máx. (30%)","Telefone","Email","Score crédito","Score final","Status","Motivo"];
  const rows = leads.map(l => {
    const f = faixaDe(l.renda);
    return [
      l.nome, l.cpf || mockCPForLead(l.id), l.idade, l.vinculo, l.profissao,
      l.renda, f.label, Math.round(l.renda*0.30),
      l.telefone, l.email, l.credit, l.score,
      l.status, l.reason
    ];
  });
  return [headers, ...rows];
}

export function generateB2CCSV(leads: any[]): string {
  const rows = generateB2CRows(leads);
  return "\uFEFF" + rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
}

export function generateB2CTXT(leads: any[]): string {
  const rows = generateB2CRows(leads);
  return rows.map(r => r.join("\t")).join("\n");
}
