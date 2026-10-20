"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MRV_EMPREENDIMENTOS } from "@/lib/data-mrv";
import { Download, Sheet, FileSpreadsheet, Database, Cloud, Copy, ExternalLink, Check, FileText, Play, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function Exportador() {
  const [loading, setLoading] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [predio, setPredio] = useState<string>("all");
  const [msg, setMsg] = useState<any>(null);

  const downloadXLSX = async () => {
    setLoading("xlsx");
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "xlsx", predios: predio === "all" ? ["all"] : [predio] }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BVC-MRV-${predio === "all" ? "8predios" : predio}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg({ ok: true, text: "XLSX baixado com 8 abas formatadas + filtros" });
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    }
    setLoading(null);
  };

  const downloadCSV = async () => {
    setLoading("csv");
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "csv" }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BVC-MRV-consolidado-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(null);
  };

  const pushSheets = async () => {
    if (!spreadsheetId.trim()) {
      setMsg({ ok: false, text: "Cole o ID da planilha (ex: 1BxiMVs0XRA5nFMd...)" });
      return;
    }
    setLoading("sheets");
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "googleSheets", spreadsheetId, predios: predio === "all" ? ["all"] : [predio] }),
    });
    const data = await res.json();
    setMsg(data);
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Sora" }}>
          <FileSpreadsheet className="h-5 w-5 text-green-600" /> Exportador de Planilhas — MRV 8 Prédios
        </h2>
        <p className="text-sm text-slate-500">Escolha o prédio, clique e baixe. Google Sheets = 8 abas MRV em 1 batch (gsheeter). XLSX = 8 sheets formatados com dropdowns (exceljs streaming). CSV e backup auto inclusos.</p>
      </div>

      {/* Seletor prédio */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Database className="h-4 w-4" /> Filtrar por prédio</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button onClick={() => setPredio("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${predio === "all" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-700"}`}>
            Todos (8 prédios + Consolidado)
          </button>
          {MRV_EMPREENDIMENTOS.map((e) => (
            <button key={e.id} onClick={() => setPredio(e.nome)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${predio === e.nome ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}>
              {e.nomeCurto} • {e.entrega}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Google Sheets */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Sheet className="h-4 w-4 text-green-600" /> Google Sheets (gsheeter — escrita automática)</CardTitle>
            <p className="text-xs text-slate-500">1 batch escreve 8 abas MRV (Gran Safira, Gran Essence, Gran Parma, Gran Terrazo, Priville, Gran Aurora, Gran Porto, Vert) + Consolidado. Header colorido, freeze, filtro.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <input value={spreadsheetId} onChange={(e) => setSpreadsheetId(e.target.value)} placeholder="ID_DA_PLANILHA (1BxiMVs0XRA5...)" className="w-full h-9 px-3 rounded-xl border text-sm" />
            <div className="bg-slate-50 rounded-xl p-2 text-xs font-mono overflow-auto">
              <div className="font-semibold">Python equivalente (gsheeter):</div>
              <pre className="text-[11px] mt-1 whitespace-pre-wrap">{`import gsheeter
gsheeter.service_account("service-account.json")
spreadsheet = Drive.get_spreadsheet("${spreadsheetId.slice(0, 12) || "ID_DA_PLANILHA"}")
sheet = spreadsheet.get_sheet("Gran Porto")
sheet.matrix = [["Nome","Tel","Entrega","Metragem","Varanda"], ["Ana","6299...", "Set/2027","37,28-49,35m²","c/ varanda"]] `}</pre>
            </div>
            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={pushSheets} disabled={loading === "sheets"}>
              {loading === "sheets" ? "Escrevendo..." : <><Cloud className="h-4 w-4 mr-2" /> Escrever 8 abas no Sheets</>}
            </Button>
            <div className="text-xs text-slate-500 flex items-center gap-1"><Check className="h-3 w-3 text-green-600" /> Wrapper em <code>src/lib/gsheeter.ts</code> imita <code>sheet.matrix = data</code></div>
          </CardContent>
        </Card>

        {/* XLSX Local */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-blue-600" /> XLSX Local (exceljs + opensheet-core)</CardTitle>
            <p className="text-xs text-slate-500">Gera .xlsx formatado local com 8 sheets, header bold, freeze, autoFilter, dropdown Status, tabColor por prédio. Streaming (memória constante).</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2"><div className="font-bold">exceljs</div><div className="text-slate-500">Node</div></div>
              <div className="bg-slate-50 border rounded-xl p-2"><div className="font-bold">openpyxl</div><div className="text-slate-500">Python</div></div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-2"><div className="font-bold">opensheet-core</div><div className="text-slate-500">Rust 1.6x</div></div>
            </div>
            <div className="bg-slate-50 rounded-xl p-2 text-xs">
              <div className="font-semibold">Alternativa Python (milhões linhas):</div>
              <pre className="text-[11px] mt-1 whitespace-pre-wrap">{`from opensheet_core import XlsxWriter
with XlsxWriter("output.xlsx") as w:
    ws = w.add_worksheet()
    for i,row in enumerate(dados):
        ws.write_row(i,0,row)`}</pre>
            </div>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" onClick={downloadXLSX} disabled={loading === "xlsx"}>
              {loading === "xlsx" ? "Gerando..." : <><Download className="h-4 w-4 mr-2" /> Baixar XLSX {predio === "all" ? "8 prédios" : predio}</>}
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={downloadCSV} disabled={loading === "csv"}>
                <FileText className="h-4 w-4 mr-1" /> CSV
              </Button>
              <a href="/api/export?target=xlsx" className="flex-1"><Button size="sm" variant="ghost" className="w-full text-xs">GET direto →</Button></a>
            </div>
          </CardContent>
        </Card>

        {/* Backup Auto */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-amber-600" /> Backup Auto (Apps Script + Python)</CardTitle>
            <p className="text-xs text-slate-500">Projeto prPedr/dowloadPlanhasGoogle adaptado BVC: Apps Script exporta .xlsx p/ Drive + Python baixa via cron.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2.5">
              <div className="font-semibold">1. Apps Script (gatilho diário 06:00):</div>
              <div className="mt-1">Cole <code>scripts/apps_script_backup.gs</code> em script.google.com → Acionadores → backupMRV diário</div>
              <div className="font-semibold mt-2">2. Python cron:</div>
              <div className="mt-1"><code>0 7 * * * python python/download_backups.py</code> → baixa último BVC-MRV-*.xlsx em <code>backups/</code></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open("https://script.google.com", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-1" /> Abrir Apps Script
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(`0 7 * * * python python/download_backups.py`)}>
                <Copy className="h-4 w-4 mr-1" /> Copiar cron
              </Button>
            </div>
            <div className="text-xs text-slate-500">Arquivos: <code>python/gsheeter_export.py</code> • <code>python/opensheet_export.py</code> • <code>scripts/apps_script_backup.gs</code></div>
          </CardContent>
        </Card>
      </div>

      {msg && (
        <Card className={msg.ok === false ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardContent className="p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              {msg.ok === false ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <Check className="h-4 w-4 text-green-600" />}
              {msg.ok === false ? "Erro" : "Sucesso"} — {msg.text || msg.message || JSON.stringify(msg).slice(0, 300)}
            </div>
            {msg.url && <a href={msg.url} target="_blank" className="text-xs text-blue-600 underline flex items-center gap-1 mt-1"><ExternalLink className="h-3 w-3" /> Abrir planilha no Google Sheets</a>}
            {msg.preview && (
              <div className="mt-2 text-xs bg-white border p-2 rounded-xl overflow-auto">
                <div>Preview (primeiras abas):</div>
                <pre className="text-[11px] mt-1">{JSON.stringify(msg.preview, null, 2).slice(0, 1000)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900 text-white">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-green-400" /> Melhor solução BVC (híbrida)</div>
            <div className="text-sm text-slate-300 mt-1">Use <b>Google Sheets (gsheeter)</b> para equipe acompanhar em tempo real + <b>XLSX (exceljs)</b> para enviar para corretores offline + <b>Backup Auto</b> para nunca perder histórico. 8 prédios MRV sempre sincronizados.</div>
          </div>
          <Badge className="bg-green-600 text-white">Recomendado BVC</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
