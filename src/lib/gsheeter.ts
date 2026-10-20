// Wrapper gsheeter-like para Next.js — compatível com Python gsheeter.service_account + sheet.matrix
// Uso: const gs = await GSheet.authServiceAccount(); const ss = await gs.getSpreadsheet(id); ss.getSheet("Gran Porto").matrix = data; await ss.save();
import { google } from "googleapis";

export type GSheeterConfig = {
  clientEmail?: string;
  privateKey?: string;
  spreadsheetId?: string;
};

export class GSheetMatrix {
  name: string;
  matrix: any[][] = [];
  spreadsheetId: string;
  private auth: any;

  constructor(name: string, spreadsheetId: string, auth: any) {
    this.name = name;
    this.spreadsheetId = spreadsheetId;
    this.auth = auth;
  }

  async save(opts?: { headerColor?: string; freezeRow?: boolean; autoFilter?: boolean }) {
    const sheets = google.sheets({ version: "v4", auth: this.auth });
    if (!this.matrix.length) return { updated: 0 };

    // 1. Write values
    const range = `${this.name}!A1`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: this.matrix },
    } as any);

    // 2. Format header (optional)
    try {
      const ss = await sheets.spreadsheets.get({ spreadsheetId: this.spreadsheetId });
      const sheetId = (ss.data.sheets || []).find((s: any) => s.properties?.title === this.name)?.properties?.sheetId;
      if (sheetId != null) {
        const requests: any[] = [];
        if (opts?.freezeRow !== false) {
          requests.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } });
        }
        // Header fill
        if (opts?.headerColor) {
          const rgb = hexToRgb(opts.headerColor);
          requests.push({
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: { userEnteredFormat: { backgroundColor: rgb, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } } } },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          });
        }
        if (opts?.autoFilter !== false) {
          const colCount = this.matrix[0]?.length || 1;
          requests.push({ setBasicFilter: { filter: { range: { sheetId, startRowIndex: 0, endRowIndex: this.matrix.length, startColumnIndex: 0, endColumnIndex: colCount } } } });
        }
        if (requests.length) await sheets.spreadsheets.batchUpdate({ spreadsheetId: this.spreadsheetId, requestBody: { requests } } as any);
      }
    } catch {}
    return { updated: this.matrix.length };
  }
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return { red: r, green: g, blue: b };
}

export class GSheetSpreadsheet {
  id: string;
  private auth: any;
  private sheets: Map<string, GSheetMatrix> = new Map();

  constructor(id: string, auth: any) {
    this.id = id;
    this.auth = auth;
  }

  getSheet(name: string): GSheetMatrix {
    if (!this.sheets.has(name)) {
      this.sheets.set(name, new GSheetMatrix(name, this.id, this.auth));
    }
    return this.sheets.get(name)!;
  }

  // Escreve todas as abas em batch (1 hit p/ valores + 1 hit p/ formatos)
  async saveAll() {
    const results: any[] = [];
    for (const sheet of Array.from(this.sheets.values())) {
      if (sheet.matrix.length) results.push(await sheet.save());
    }
    return results;
  }

  async ensureSheets(titles: string[]) {
    const sheets = google.sheets({ version: "v4", auth: this.auth });
    const ss = await sheets.spreadsheets.get({ spreadsheetId: this.id });
    const existing = (ss.data.sheets || []).map((s: any) => s.properties.title);
    const missing = titles.filter((t) => !existing.includes(t));
    if (missing.length) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.id,
        requestBody: { requests: missing.map((title) => ({ addSheet: { properties: { title } } })) },
      } as any);
    }
  }
}

export class GSheet {
  private auth: any;
  constructor(auth: any) { this.auth = auth; }

  static async authServiceAccount(config?: GSheeterConfig) {
    const clientEmail = config?.clientEmail || process.env.GOOGLE_SHEETS_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || "";
    const privateKey = (config?.privateKey || process.env.GOOGLE_SHEETS_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
    if (!clientEmail || !privateKey) throw new Error("GSheeter: faltam GOOGLE_SHEETS_CLIENT_EMAIL / PRIVATE_KEY no .env");
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
    });
    return new GSheet(auth);
  }

  async getSpreadsheet(spreadsheetId: string) {
    const id = spreadsheetId || process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
    if (!id) throw new Error("SpreadsheetId vazio");
    return new GSheetSpreadsheet(id, this.auth);
  }

  // Atalho compatível com Python: Drive.get_spreadsheet
  static Drive = {
    get_spreadsheet: async (id: string, config?: GSheeterConfig) => {
      const gs = await GSheet.authServiceAccount(config);
      return gs.getSpreadsheet(id);
    },
  };
}
