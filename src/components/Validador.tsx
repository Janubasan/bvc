"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShieldCheck, Phone, Download, Upload, Check, AlertTriangle, Smartphone, Zap, FileSpreadsheet, Copy, ExternalLink, Filter, MapPin } from "lucide-react";
import { ESTRATEGIAS_VALIDADAS, CHECKLIST_LEAD_QUENTE } from "@/lib/validation";
import { LISTAS_MODELO } from "@/lib/listas-validadas";

export function Validador() {
  const [input, setInput] = useState("(62) 99902-3474\n62991234567\n(62) 99123-4567\n+55 62 99902-3474\n62900001111\n(11) 98888-7777");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const validar = async () => {
    setLoading(true);
    const numeros = input.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);
    const r = await fetch("/api/validate", { method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ numeros })});
    const j = await r.json();
    setRes(j);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-green-900 to-emerald-800 text-white p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="flex flex-col lg:flex-row gap-6 relative">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white text-green-800 rounded-full px-3 py-1 text-xs font-bold"><ShieldCheck className="h-4 w-4" /> NÚMEROS VALIDADOS • DDD 62 GOIÂNIA/APARECIDA</div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold" style={{fontFamily:"Sora"}}>Números validados na frente. <span className="text-emerald-200">Sem validação, não há venda.</span></h1>
            <p className="mt-2 text-sm text-emerald-50 leading-relaxed">6 motores: formato BR + DDD 62 + tipo móvel + operadora + WhatsApp probable + score quente FGTS/420x. <b>Site lindo mantido</b> — abaixo você <b>valida qualquer lista</b> e baixa só os prontos pro Zap. Listas modelo já validadas nos 8 prédios MRV prontas pra baixar.</p>
          </div>
          <div className="w-full lg:w-[380px] bg-white text-slate-900 rounded-2xl p-4">
            <div className="text-xs font-bold">Sua validação em 5s (cole 1 por linha)</div>
            <textarea value={input} onChange={e=>setInput(e.target.value)} rows={6} className="w-full mt-2 p-2.5 rounded-xl border text-sm font-mono" placeholder="(62) 99902-3474" />
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={validar} disabled={loading}><Zap className="h-4 w-4 mr-1" /> {loading ? "..." : `Validar ${input.split(/[\n,]+/).filter(Boolean).length} números`}</Button>
              <Button size="sm" variant="outline" onClick={()=>setInput("(62) 99902-3474\n62991234567\n(62) 99123-4567")}>Exemplo</Button>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">DDD 62 = Goiânia/Aparecida. Fora de 62 = duvidoso. + Evolution checkExists em produção.</div>
          </div>
        </div>
      </div>

      {res && (
        <Card className={res.resumo?.validados ? "border-green-200" : "border-amber-200"}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Resultado — {res.resumo.validados} validados de {res.resumo.total} • {res.resumo.whatsapp} WhatsApp • {res.resumo.ddd62} DDD 62</CardTitle>
            <Badge className="bg-green-600">{res.resumo.prontosParaZap} prontos pro Zap</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-2"><div className="text-lg font-extrabold">{res.resumo.total}</div><div className="text-[11px] text-slate-500">Total</div></div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-2"><div className="text-lg font-extrabold text-green-700">{res.resumo.validados}</div><div className="text-[11px]">Validados</div></div>
              <div className="bg-amber-50 rounded-xl p-2"><div className="text-lg font-extrabold">{res.resumo.duvidosos}</div><div className="text-[11px]">Duvidosos</div></div>
              <div className="bg-red-50 rounded-xl p-2"><div className="text-lg font-extrabold text-red-600">{res.resumo.invalidos}</div><div className="text-[11px]">Inválidos</div></div>
              <div className="bg-teal-50 rounded-xl p-2"><div className="text-lg font-extrabold text-teal-700">{res.resumo.ddd62}</div><div className="text-[11px]">DDD 62</div></div>
              <div className="bg-violet-50 rounded-xl p-2"><div className="text-lg font-extrabold text-violet-700">{res.resumo.whatsapp}</div><div className="text-[11px]">WhatsApp</div></div>
            </div>

            {res.validados?.length >0 && (
              <div>
                <div className="text-xs font-bold">Validados → prontos pro Zap (com E164):</div>
                <div className="mt-2 border rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50"><tr><th className="p-2 text-left">Original</th><th className="p-2">Nacional</th><th className="p-2">E164</th><th className="p-2">Operadora</th><th className="p-2">Score</th></tr></thead>
                    <tbody>{res.validados.slice(0,10).map((r:any)=>(
                      <tr key={r.original} className="border-t hover:bg-slate-50"><td className="p-2 font-mono">{r.original}</td><td className="p-2">{r.nacional}</td><td className="p-2 font-mono text-green-700">{r.e164}</td><td className="p-2">{r.operadora}</td><td className="p-2">{r.scoreQuente}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={()=>navigator.clipboard.writeText(res.validados.map((r:any)=>r.e164).join("\n"))}><Copy className="h-4 w-4 mr-1" /> Copiar E164</Button>
                  <Button size="sm" variant="outline" onClick={()=>navigator.clipboard.writeText(res.export.csv)}><FileSpreadsheet className="h-4 w-4 mr-1" /> Copiar CSV</Button>
                  <a href={`/api/validate?lista=todos-8-validados&format=csv`}><Button size="sm" className="bg-green-600">Baixar XLSX modelo</Button></a>
                </div>
              </div>
            )}
            {(res.duvidosos?.length>0 || res.invalidos?.length>0) && (
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                {res.duvidosos.length>0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-2"><b>Duvidosos:</b> {res.duvidosos.map((d:any)=>`${d.original} (${d.motivo})`).join(" • ")}</div>}
                {res.invalidos.length>0 && <div className="bg-red-50 border border-red-200 rounded-xl p-2"><b>Inválidos:</b> {res.invalidos.map((d:any)=>`${d.original}`).join(" • ")}</div>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Download className="h-4 w-4 text-green-600" /> Listas pré-validadas prontas pra baixar — MRV 8 prédios (DEMO formato válido)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {LISTAS_MODELO.map(l=>(
            <div key={l.id} className="border rounded-xl p-3 bg-white hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">{l.nome}</div>
                <Badge className="bg-green-600">{l.validados} validados</Badge>
              </div>
              <div className="text-xs text-slate-500 mt-1">{l.cidade} • {l.estrategia} • {l.taxaValido} válido • {l.validados}/{l.total}</div>
              <div className="text-[11px] font-mono bg-slate-50 rounded-lg p-1.5 mt-2 truncate">{l.preview.map(p=>p.telefone).join(" • ")}</div>
              <div className="flex gap-2 mt-2">
                <a href={l.download+"&format=csv"}><Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" /> {l.arquivo}</Button></a>
                <a href={`/api/validate?lista=${l.id}`}><Button size="sm" variant="ghost"><ExternalLink className="h-4 w-4 mr-1" /> JSON</Button></a>
              </div>
              <div className="text-[11px] text-amber-600 mt-1">⚠️ DEMO: formato válido DDD 62, não são pessoas reais. Produção: importe seu CSV abaixo.</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Upload className="h-4 w-4 text-teal-600" /> Como ter listas reais validadas (6 estratégias que geram telefone quente)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ESTRATEGIAS_VALIDADAS.map(e=>(
            <div key={e.id} className="border rounded-xl p-3 bg-white">
              <div className="text-sm font-bold">{e.nome}</div>
              <div className="text-xs text-slate-500 mt-1">{e.desc}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-[11px]">{e.validacao}</Badge>
                <Badge className="bg-green-600 text-[11px]">{e.taxaValido} válido</Badge>
                <Badge variant="secondary" className="text-[11px]">{e.custo}</Badge>
              </div>
              <div className="text-xs mt-1">{e.quente}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Filter className="h-4 w-4" /> Arraste seu CSV aqui → validação instantânea (6 motores)</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-xl p-6 text-center bg-slate-50">
            <Smartphone className="h-8 w-8 mx-auto text-slate-400" />
            <div className="text-sm font-semibold mt-2">Cole ou arraste CSV com coluna telefone</div>
            <div className="text-xs text-slate-500 mt-1">Aceita: telefone, Telefone_E164, numero, zap, whatsapp • Separador , ;  • 1ª linha header opcional</div>
            <div className="flex gap-2 justify-center mt-3">
              <label className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm cursor-pointer"><Upload className="h-4 w-4" /> Escolher CSV
                <input type="file" accept=".csv" className="hidden" onChange={async (e)=>{
                  const f = e.target.files?.[0];
                  if(!f) return;
                  const txt = await f.text();
                  const lines = txt.split(/\r?\n/).filter(Boolean);
                  // pega coluna telefone
                  const header = lines[0].toLowerCase();
                  let idx = 0;
                  if(header.includes("telefone") || header.includes("phone") || header.includes("numero") || header.includes("zap")) {
                    const cols = lines[0].split(/[,;]/);
                    idx = cols.findIndex(c=>/telefone|phone|numero|zap|whatsapp/i.test(c));
                    if(idx===-1) idx = 0;
                    lines.shift();
                  }
                  const nums = lines.map(l=> l.split(/[,;]/)[idx]?.trim()).filter(Boolean).slice(0,5000);
                  setInput(nums.join("\n"));
                }} />
              </label>
              <Button size="sm" variant="outline" onClick={validar}>Validar lote</Button>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Máx 5.000/lote • 6 motores • export só validados DDD 62 + WhatsApp • LGPD: só números com opt-in</div>
          </div>
          <div className="mt-3 bg-slate-900 text-white rounded-xl p-3 text-xs">
            <div className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" /> Checklist validação DDD 62 (o que conta como “validado”)</div>
            <ul className="list-disc list-inside mt-1 text-slate-300 space-y-0.5">
              {CHECKLIST_LEAD_QUENTE.map(c=> <li key={c}>{c}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
