import { NextResponse } from "next/server";

// Google Sheets + Docs integration - real via googleapis if credentials exist, else mock with instructions
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { action = "appendSheet", spreadsheetId, range = "Leads!A:H", values, documentTitle, documentBody } = body;

  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || "";
  const privateKey = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const hasCreds = !!(clientEmail && privateKey && spreadsheetId);

  // Se não tem credenciais, retorna instruções + mock
  if (!hasCreds && action === "appendSheet") {
    return NextResponse.json({
      mode: "mock",
      message: "Sem credenciais Google — mock. Configure Service Account para append real.",
      received: { spreadsheetId: spreadsheetId || "(vazio)", range, values: values?.slice?.(0, 2) || values },
      setup: {
        "1. Crie projeto": "https://console.cloud.google.com → Novo Projeto → BVC-MCMV-GO",
        "2. Ative APIs": "APIs & Services → Library → Google Sheets API + Google Docs API + Google Drive API → Enable",
        "3. Service Account": "IAM & Admin → Service Accounts → Create → Editor → Keys → JSON → baixe",
        "4. Env vars": "GOOGLE_SHEETS_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com\nGOOGLE_SHEETS_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\nMII...\\n-----END PRIVATE KEY-----\\n\"\nGOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBD...",
        "5. Compartilhe planilha": "Abra a planilha → Compartilhar → cole o client_email → Editor",
        "6. Teste": "POST /api/google { action:'appendSheet', spreadsheetId:'SUA_ID', range:'Aparecida!A:H', values:[['Nome','Tel','Bairro','Faixa','Score','Origem','Data','Status']] }",
      },
      mockResult: {
        spreadsheetId: spreadsheetId || "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        updatedRange: `${range}`,
        updatedRows: values?.length || 1,
        sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId || "MOCK"}/edit`,
      },
      docsTip: "Para Docs: POST { action:'createDoc', documentTitle:'Dossiê Ana Paula - Alto Boa Vista', documentBody:'Perfil Faixa 2...' } → cria Doc + retorna documentId + url",
    });
  }

  if (action === "createDoc") {
    if (!hasCreds) {
      return NextResponse.json({
        mode: "mock",
        documentId: "MOCK_DOC_ID_195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE",
        documentUrl: `https://docs.google.com/document/d/MOCK_DOC_ID/edit`,
        title: documentTitle || "Dossiê MCMV - Mock",
        message: "Mock — configure credenciais para criar Docs de verdade. Mesmo fluxo do Sheets.",
      });
    }
    try {
      const { google } = await import("googleapis");
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive.file"],
      });
      const docs = google.docs({ version: "v1", auth });
      const created = await docs.documents.create({ requestBody: { title: documentTitle || "Dossiê BVC MCMV" } as any });
      const documentId = created.data.documentId!;
      if (documentBody) {
        await docs.documents.batchUpdate({
          documentId,
          requestBody: {
            requests: [{ insertText: { location: { index: 1 }, text: documentBody } }],
          } as any,
        });
      }
      return NextResponse.json({ ok: true, mode: "real", documentId, documentUrl: `https://docs.google.com/document/d/${documentId}/edit`, title: documentTitle });
    } catch (e: any) {
      return NextResponse.json({ ok: false, mode: "real", error: e.message }, { status: 500 });
    }
  }

  // action === appendSheet com credenciais reais
  try {
    const { google } = await import("googleapis");
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: values || [["Teste", "62999999999", "Alto da Boa Vista", "Faixa 2", "92", "instagram", new Date().toISOString(), "novo"]] },
    } as any);
    return NextResponse.json({
      ok: true,
      mode: "real",
      spreadsheetId,
      updatedRange: res.data.updates?.updatedRange,
      updatedRows: res.data.updates?.updatedRows,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, mode: "real", error: e.message?.slice(0, 1200) }, { status: 500 });
  }
}

export async function GET() {
  const hasEnv = !!(process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY);
  return NextResponse.json({
    status: "Google Integration • BVC Prospector (Sheets + Docs + Drive)",
    hasCredentials: hasEnv,
    endpoints: [
      "POST /api/google { action:'appendSheet', spreadsheetId, range, values: [[...], [...]] }",
      "POST /api/google { action:'createDoc', documentTitle, documentBody }",
      "POST /api/google { action:'readSheet', spreadsheetId, range } (em breve)",
    ],
    envVars: ["GOOGLE_SHEETS_CLIENT_EMAIL", "GOOGLE_SHEETS_PRIVATE_KEY", "GOOGLE_SHEETS_SPREADSHEET_ID"],
    docs: "https://developers.google.com/workspace/sheets/api/quickstart/nodejs",
  });
}
