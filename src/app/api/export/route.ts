import { NextResponse } from "next/server";
import { LEADS_MOCK } from "@/lib/data";
import { MRV_EMPREENDIMENTOS } from "@/lib/data-mrv";
import { buildMRVMatrix, generateXLSX, generateCSV } from "@/lib/exporter";

// POST { target: "googleSheets"|"xlsx"|"csv"|"all", spreadsheetId?, predios?: ["all"]|["Gran Porto"], leads?: Lead[] }
// GET ?target=xlsx retorna exemplo
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { target = "xlsx", spreadsheetId, predios = ["all"], leads = LEADS_MOCK } = body;

  // XLSX / CSV são sempre possíveis (exceljs)
  if (target === "xlsx" || target === "all") {
    // Para 'all', não retorna binary aqui — instrui usar /api/export/xlsx
    if (target === "xlsx") {
      try {
        const buffer = await generateXLSX(leads, predios);
        return new NextResponse(buffer as any, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="BVC-MRV-${new Date().toISOString().slice(0,10)}.xlsx"`,
            "Content-Length": String(buffer.length),
          },
        });
      } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
      }
    }
  }

  if (target === "csv") {
    const csv = generateCSV(leads);
    return new NextResponse(csv as any, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="BVC-MRV-${new Date().toISOString().slice(0,10)}.csv"`,
      },
    });
  }

  if (target === "googleSheets" || target === "all") {
    const matrices = buildMRVMatrix(leads);
    const id = spreadsheetId || process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";

    // Sem credenciais → retorna preview + instruções
    const hasCreds = !!(process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY);
    if (!hasCreds || !id) {
      const preview = Object.entries(matrices).slice(0, 3).map(([name, rows]) => ({
        sheet: name,
        header: rows[0],
        sampleRow: rows[1],
        totalRows: rows.length,
      }));
      return NextResponse.json({
        mode: "mock",
        message: hasCreds ? "Sem spreadsheetId — cole o ID da planilha" : "Sem credenciais Google — configure .env",
        preview,
        totalPredios: MRV_EMPREENDIMENTOS.length,
        matricesInfo: MRV_EMPREENDIMENTOS.map((e) => ({ nome: e.nome, aba: e.nomeCurto, entrega: e.entrega, metragem: e.metragemTexto, varanda: e.varanda })),
        nextSteps: [
          "1. Crie planilha: https://sheets.google.com → BVC-MRV-2026",
          "2. Copie ID da URL: .../spreadsheets/d/ID/edit",
          "3. Compartilhe com service account email (Editor)",
          "4. POST /api/export { target:'googleSheets', spreadsheetId:'ID', predios:['all'] } → escreve 8 abas + Consolidado em batch",
          "5. Alternativa: use /src/lib/gsheeter.ts → sheet.matrix = data; await sheet.save()",
        ],
        gsheeterExample: `
import gsheeter from "@/lib/gsheeter";
const gs = await gsheeter.authServiceAccount();
const ss = await gs.getSpreadsheet("ID_DA_PLANILHA");
await ss.ensureSheets(["Gran Safira","Gran Essence","Gran Parma","Gran Terrazo","Priville","Gran Aurora","Gran Porto","Vert Parque Amazônia","Consolidado"]);
for (const emp of MRV_EMPREENDIMENTOS) {
  const sheet = ss.getSheet(emp.nomeCurto);
  sheet.matrix = matrices[emp.nome]; // header + rows
  await sheet.save({ headerColor: "#16a34a" });
}
        `.trim(),
      });
    }

    // Real: usa gsheeter-like batch
    try {
      const { GSheet } = await import("@/lib/gsheeter");
      const gs = await GSheet.authServiceAccount();
      const ss = await gs.getSpreadsheet(id);
      const titles = (predios.includes("all") ? MRV_EMPREENDIMENTOS.map((e) => e.nomeCurto) : predios).concat(["Consolidado"]);
      await ss.ensureSheets(titles);
      for (const title of titles) {
        const key = MRV_EMPREENDIMENTOS.find((e) => e.nomeCurto === title)?.nome || title;
        const matrix = (matrices as any)[key] || matrices[title];
        if (!matrix) continue;
        const sheet = ss.getSheet(title);
        sheet.matrix = matrix;
        await sheet.save({ headerColor: "#16a34a", freezeRow: true, autoFilter: true });
      }
      return NextResponse.json({
        ok: true,
        mode: "real",
        spreadsheetId: id,
        sheetsWritten: titles.length,
        url: `https://docs.google.com/spreadsheets/d/${id}/edit`,
        message: `${titles.length} abas escritas com sucesso`,
      });
    } catch (e: any) {
      return NextResponse.json({ ok: false, mode: "real", error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: false, error: "target inválido: use googleSheets | xlsx | csv | all" }, { status: 400 });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("target") || "info";
  if (target === "xlsx") {
    // stream xlsx direto
    const buf = await generateXLSX(LEADS_MOCK, ["all"]);
    return new NextResponse(buf as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="BVC-MRV-${new Date().toISOString().slice(0,10)}.xlsx"`,
      },
    });
  }
  if (target === "csv") {
    const csv = generateCSV(LEADS_MOCK);
    return new NextResponse(csv as any, { headers: { "Content-Type": "text/csv" } });
  }
  return NextResponse.json({
    status: "Exportador BVC MRV • 8 prédios",
    endpoints: [
      "POST /api/export { target:'googleSheets', spreadsheetId, predios:['all'] } → 8 abas MRV",
      "POST /api/export { target:'xlsx', predios:['Gran Porto'] } → binary XLSX",
      "GET /api/export?target=xlsx → download direto",
      "POST /api/export { target:'csv' } → csv",
    ],
    wrapper: "src/lib/gsheeter.ts → GSheet.authServiceAccount() → ss.getSheet(name).matrix = rows; await save()",
    pythonFallback: "python/gsheeter_export.py (gsheeter) + python/opensheet_export.py (opensheet-core Rust)",
  });
}
