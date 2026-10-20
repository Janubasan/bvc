"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MRV_EMPREENDIMENTOS } from "@/lib/data-mrv";
import { Send, Play, Check, Eye, AlertTriangle, ExternalLink, Download, Clock, MessageSquare, Sheet, FileSpreadsheet, Bug, Sparkles, Rocket } from "lucide-react";
import { USER_CONFIG } from "@/lib/config";

export function PrimeiroDisparo() {
  const [numero, setNumero] = useState<string>(USER_CONFIG.zap);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [modo, setModo] = useState<"teste"|"enviar">("teste");

  const disparar = async (m: "teste"|"enviar") => {
    setModo(m);
    setLoading(true);
    try {
      const res = await fetch("/api/disparo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroTeste: numero, modo: m, predios: ["all"] }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e:any) {
      setResult({ ok: false, error: e.message });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 text-white p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="flex flex-col lg:flex-row gap-6 relative">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white text-green-800 rounded-full px-3 py-1 text-xs font-bold"><Rocket className="h-4 w-4" /> PRIMEIRO DISPARO — 8 PRÉDIOS MRV</div>
            <h1 className="mt-3 text-2xl font-extrabold" style={{ fontFamily: "Sora" }}>Teste com 8 leads (1 por prédio) + mensagem validada</h1>
            <p className="text-sm text-emerald-50 mt-2 leading-relaxed">Modo <b>teste</b> = preview completo sem enviar. <b>Enviar</b> = Evolution de verdade (precisa Evolution configurado; sandbox bloqueia, produção funciona). Apify token já configurado <code className="bg-white/20 px-1 rounded">apify_api_H7LP...2wkjxw</code>.</p>
          </div>
          <div className="w-full lg:w-[380px] shrink-0 bg-white text-slate-900 rounded-2xl p-4">
            <div className="text-xs font-bold">Número de teste (seu WhatsApp)</div>
            <div className="flex gap-2 mt-2">
              <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="5562912345678" className="flex-1 h-9 px-3 rounded-xl border text-sm" />
              <Badge className={numero.length >= 13 ? "bg-green-600" : "bg-amber-500"}>{numero.length >= 13 ? "válido" : "11 dígitos + 55"}</Badge>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Use seu número pessoal p/ receber os 8 testes (1 de cada prédio). Depois trocamos por base real.</div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => disparar("teste")} disabled={loading}><Eye className="h-4 w-4 mr-1" /> {loading && modo==="teste" ? "..." : "Prévia teste (8)"}</Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => disparar("enviar")} disabled={loading}><Send className="h-4 w-4 mr-1" /> {loading && modo==="enviar" ? "..." : "Disparar de verdade"}</Button>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Teste não envia. Enviar usa Evolution API (precisa server em produção).</div>
          </div>
        </div>
      </div>

      {/* Checklist 8 prédios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-green-600" /> 8 prédios no disparo (1 lead cada)</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-2">
          {MRV_EMPREENDIMENTOS.map((e) => (
            <div key={e.id} className="border rounded-xl p-2.5 flex items-center gap-2 bg-white">
              <div className={`h-2 w-2 rounded-full ${e.cor}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-none">{e.nome}</div>
                <div className="text-[11px] text-slate-500">{e.entrega} • {e.metragemTexto}</div>
              </div>
              <Badge variant="outline" className="text-[10px]">1 lead</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resultado */}
      {result && (
        <Card className={result.ok === false ? "border-red-200" : "border-green-200"}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {result.ok === false ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <Check className="h-4 w-4 text-green-600" />}
              Resultado — {result.modo} • {result.total} leads • {result.leads?.length} mensagens
            </CardTitle>
            <Badge className={modo==="teste" ? "bg-amber-500" : "bg-green-600"}>{modo}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.aviso && (
              <div className={`p-3 rounded-xl text-sm ${modo==="teste" ? "bg-amber-50 border border-amber-200 text-amber-800" : "bg-blue-50 border border-blue-200 text-blue-800"}`}>
                {result.aviso}
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs font-bold">Steps executados:</div>
              {result.steps?.map((s:any) => (
                <div key={s.passo} className="flex items-start gap-2 p-2.5 rounded-xl border bg-white">
                  <Badge variant={s.status==="real" ? "success" : s.status==="mock" ? "secondary" : "outline"} className="text-[11px] shrink-0">{s.status}</Badge>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{s.passo}</div>
                    <div className="text-xs text-slate-500">{s.detail}</div>
                    {s.preview && <pre className="mt-2 text-[11px] bg-slate-900 text-green-300 p-2 rounded-lg overflow-auto max-h-[120px]">{JSON.stringify(s.preview, null,2).slice(0,600)}</pre>}
                  </div>
                  {s.download && <a href={s.download} className="text-xs text-blue-600 flex items-center gap-1"><Download className="h-3 w-3" /> Baixar</a>}
                </div>
              ))}
            </div>

            {result.leads && (
              <div>
                <div className="text-xs font-bold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Mensagens validadas (preview 2 primeiras):</div>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {result.leads.slice(0,2).map((l:any) => (
                    <div key={l.nome+l.predio} className="bg-white border rounded-xl p-3">
                      <div className="text-xs font-bold">{l.predio} → {l.nome} ({l.telefone})</div>
                      <div className="text-xs text-slate-600 mt-1 leading-relaxed bg-green-50 border border-green-200 p-2 rounded-lg">{l.mensagem}</div>
                      <div className="text-[11px] text-slate-400 mt-1">Entrega {l.entrega} • SheetRow: {l.sheetRow.slice(0,5).join(" | ")}...</div>
                    </div>
                  ))}
                </div>
                <details className="mt-3">
                  <summary className="text-xs cursor-pointer">Ver todos {result.leads.length} leads + sheetRows</summary>
                  <pre className="text-[11px] bg-slate-950 text-green-300 p-2 rounded-xl mt-2 overflow-auto max-h-[300px]">{JSON.stringify(result.leads, null,2).slice(0,4000)}</pre>
                </details>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <a href="/api/export?target=xlsx"><Button size="sm" variant="outline"><FileSpreadsheet className="h-4 w-4 mr-1" /> Baixar XLSX 8 prédios</Button></a>
              <a href={result.leads?.[0] ? `https://docs.google.com/spreadsheets/d/` : "#"}><Button size="sm" variant="ghost"><Sheet className="h-4 w-4 mr-1" /> Abrir Sheets</Button></a>
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null,2))}>Copiar JSON</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!result && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center text-sm text-slate-500">
            <Clock className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            Clique em <b>Prévia teste (8)</b> acima para gerar o primeiro disparo (sem enviar). Revise as 8 mensagens + Sheets preview, depois clique <b>Disparar de verdade</b>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
