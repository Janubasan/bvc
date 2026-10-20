"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShieldCheck, Phone, Download, Upload, Check, AlertTriangle, Smartphone, Zap, FileSpreadsheet, Copy, Filter, MapPin, ClipboardCheck } from "lucide-react";
import { ESTRATEGIAS_VALIDADAS, CHECKLIST_LEAD_QUENTE } from "@/lib/validation";

export function Validador() {
  const [input, setInput] = useState("(62) 99902-3474\n62991234567\n(62) 99123-4567\n62123456789");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  const validar = async () => {
    setLoading(true);
    const numeros = input.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);
    const r = await fetch("/api/validate", { method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ numeros })});
    const j = await r.json();
    setRes(j);
    setLoading(false);
  };

  const copiar = async (txt: string, id: string) => {
    await navigator.clipboard.writeText(txt);
    setCopiado(id);
    setTimeout(()=>setCopiado(null), 1500);
  };

  const baixarCSV = () => {
    if (!res?.export?.csv) return;
    const blob = new Blob([res.export.csv], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `validados-DDD62-${res.resumo.validados}-numeros-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const totalInput = input.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-green-900 to-emerald-800 text-white p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="flex flex-col lg:flex-row gap-6 relative">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white text-green-800 rounded-full px-3 py-1 text-xs font-bold"><ShieldCheck className="h-4 w-4" /> VALIDADOR 62 • 6 MOTORES • MÉTRICAS REAIS CORRIGIDAS</div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold" style={{fontFamily:"Sora"}}>Cole e valide. <span className="text-emerald-200">Baixe só os prontos pro Zap.</span></h1>
            <p className="mt-2 text-sm text-emerald-50 leading-relaxed">Métricas corrigidas: cada linha é 1 coluna (não mais grudado). Cole sua base com opt-in (1 por linha) → validamos DDD 62 + móvel 9 dígitos + WhatsApp → <b>copia e cola</b> ou <b>baixa CSV/XLSX</b> já rodado.</p>
          </div>
          <div className="w-full lg:w-[420px] bg-white text-slate-900 rounded-2xl p-4">
            <div className="text-xs font-bold flex items-center justify-between">Cole números aqui (1 por linha) <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">{totalInput} números</span></div>
            <textarea value={input} onChange={e=>setInput(e.target.value)} rows={8} className="w-full mt-2 p-2.5 rounded-xl border text-sm font-mono bg-slate-50" placeholder="(62) 99902-3474&#10;62991234567" />
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={validar} disabled={loading || totalInput===0}><Zap className="h-4 w-4 mr-1" /> {loading ? "Validando..." : `Validar ${totalInput} números`}</Button>
              <Button size="sm" variant="outline" onClick={()=>setInput("(62) 99902-3474\n62991234567\n(62) 99123-4567")}>Limpar</Button>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">DDD 62 = Goiânia/Aparecida. Fixo = inválido. DDD fora 62 = duvidoso.</div>
          </div>
        </div>
      </div>

      {res && (
        <Card className={res.resumo?.validados ? "border-green-200" : "border-amber-200"}>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-green-600" /> Métricas corrigidas — {res.resumo.validados} validados de {res.resumo.total}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-600">{res.resumo.prontosParaZap} prontos Zap</Badge>
                <Badge variant="outline">{res.resumo.ddd62} DDD 62</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Métricas em cards separados - corrigido */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-3 border"><div className="text-xl font-extrabold">{res.resumo.total}</div><div className="text-[11px] text-slate-500">Total enviados</div></div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3"><div className="text-xl font-extrabold text-green-700">{res.resumo.validados}</div><div className="text-[11px] font-semibold">Validados ✓</div></div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><div className="text-xl font-extrabold">{res.resumo.duvidosos}</div><div className="text-[11px]">Duvidosos</div></div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3"><div className="text-xl font-extrabold text-red-600">{res.resumo.invalidos}</div><div className="text-[11px]">Inválidos</div></div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3"><div className="text-xl font-extrabold text-teal-700">{res.resumo.ddd62}</div><div className="text-[11px]">DDD 62</div></div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-3"><div className="text-xl font-extrabold text-violet-700">{res.resumo.whatsapp}</div><div className="text-[11px]">WhatsApp</div></div>
            </div>

            {res.validados?.length >0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold">✅ Validados — já rodados, prontos para copiar/baixar:</div>
                  <span className="text-[11px] bg-green-100 text-green-800 px-2 py-1 rounded-full">{res.validados.length} linhas</span>
                </div>
                
                {/* Tabela corrigida - colunas separadas */}
                <div className="border rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-xs min-w-[620px]">
                    <thead className="bg-slate-900 text-white"><tr><th className="p-2 text-left">#</th><th className="p-2 text-left">Nome/Original</th><th className="p-2 text-left">Nacional</th><th className="p-2 text-left">E164</th><th className="p-2 text-left">Operadora</th><th className="p-2 text-center">Zap</th></tr></thead>
                    <tbody>
                      {res.validados.map((r:any)=>(
                      <tr key={`${r.e164}-${r.idx}`} className="border-t hover:bg-green-50/50">
                        <td className="p-2 text-slate-400">{r.idx}</td>
                        <td className="p-2 font-mono text-[11px]">{r.original}</td>
                        <td className="p-2 font-medium">{r.nacional}</td>
                        <td className="p-2 font-mono text-green-700 font-semibold">{r.e164}</td>
                        <td className="p-2">{r.operadora}</td>
                        <td className="p-2 text-center">{r.whatsapp ? "✓" : "-"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>

                {/* Botões de ação - copiar/baixar já rodado */}
                <div className="grid md:grid-cols-3 gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>copiar(res.export.listaE164, "e164")}><Copy className="h-4 w-4 mr-1" /> {copiado==="e164" ? "Copiado!" : "Copiar E164 (1 por linha)"}</Button>
                  <Button size="sm" variant="outline" onClick={()=>copiar(res.export.listaNacional, "nacional")}><Copy className="h-4 w-4 mr-1" /> {copiado==="nacional" ? "Copiado!" : "Copiar Nacional"}</Button>
                  <Button size="sm" variant="outline" onClick={()=>copiar(res.export.listaWhatsApp, "zap")}><Phone className="h-4 w-4 mr-1" /> {copiado==="zap" ? "Copiado!" : "Copiar só WhatsApp"}</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="bg-slate-900 text-white" onClick={baixarCSV}><Download className="h-4 w-4 mr-1" /> Baixar CSV validados ({res.resumo.validados})</Button>
                  <Button size="sm" variant="outline" onClick={()=>copiar(res.export.csv, "csv")}><FileSpreadsheet className="h-4 w-4 mr-1" /> {copiado==="csv" ? "CSV copiado!" : "Copiar CSV completo"}</Button>
                  <a href="/api/validate?template=csv"><Button size="sm" variant="ghost"><Download className="h-4 w-4 mr-1" /> Baixar template vazio</Button></a>
                </div>
                <div className="text-[11px] bg-green-50 border border-green-200 rounded-lg p-2 text-green-800">Pronto para colar no Sheets/Excel ou importar no Evolution. Formato: E164 com +55. LGPD: use apenas com opt-in.</div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-sm">
                <AlertTriangle className="h-6 w-6 mx-auto text-amber-600 mb-2" />
                Nenhum validado neste lote. Verifique formato (ex: (62) 99902-3474) e DDD 62.
              </div>
            )}

            {(res.duvidosos?.length>0 || res.invalidos?.length>0) && (
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                {res.duvidosos?.length>0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><b className="text-amber-800">Duvidosos ({res.duvidosos.length}):</b><div className="mt-1 text-amber-700">{res.duvidosos.map((d:any)=>d.nacional || d.original).join(" • ")}</div><div className="text-[11px] mt-1">Motivo: fora DDD 62</div></div>}
                {res.invalidos?.length>0 && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><b className="text-red-800">Inválidos ({res.invalidos.length}):</b><div className="mt-1 text-red-700">{res.invalidos.map((d:any)=>d.original).join(" • ")}</div><div className="text-[11px] mt-1">Motivo: fixo ou formato errado</div></div>}
              </div>
            )}
            {res.avisoLGPD && <div className="text-[11px] bg-slate-900 text-white rounded-lg p-2.5">{res.avisoLGPD}</div>}
          </CardContent>
        </Card>
      )}

      {/* Instrução clara - não mais listas fake */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Como ter telefones reais validados (não fornecemos base pronta)</CardTitle></CardHeader>
        <CardContent className="text-xs leading-relaxed text-slate-700">
          Por LGPD não entregamos lista pronta com nome+telefone real. O fluxo correto é: <b>você capta com opt-in</b> (Meta Lead Ads + OTP, QR no plantão, landing com consentimento) → cola aqui no Validador → baixa só validados DDD 62. <a href="/api/validate?template=csv" className="text-green-700 underline">Baixe o template CSV vazio</a> para preencher com seus leads ou use a área acima para validar.
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Upload className="h-4 w-4 text-teal-600" /> 6 estratégias que geram telefone validado (use para captar)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ESTRATEGIAS_VALIDADAS.map(e=>(
            <div key={e.id} className="border rounded-xl p-3 bg-white">
              <div className="text-sm font-bold">{e.nome}</div>
              <div className="text-xs text-slate-500 mt-1">{e.desc}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-[11px]">{e.validacao}</Badge>
                <Badge className="bg-green-600 text-[11px]">{e.taxaValido} válido</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Filter className="h-4 w-4" /> Arraste CSV com sua base opt-in → valida na hora</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-xl p-6 text-center bg-slate-50">
            <Smartphone className="h-8 w-8 mx-auto text-slate-400" />
            <div className="text-sm font-semibold mt-2">Cole ou arraste CSV com coluna telefone</div>
            <div className="text-xs text-slate-500 mt-1">Aceita: telefone, Telefone_E164, numero, zap • Separador , ;</div>
            <div className="flex gap-2 justify-center mt-3">
              <label className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm cursor-pointer"><Upload className="h-4 w-4" /> Escolher CSV
                <input type="file" accept=".csv" className="hidden" onChange={async (e)=>{
                  const f = e.target.files?.[0];
                  if(!f) return;
                  const txt = await f.text();
                  const lines = txt.split(/\r?\n/).filter(Boolean);
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
          </div>
          <div className="mt-3 bg-slate-900 text-white rounded-xl p-3 text-xs">
            <div className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" /> O que conta como validado DDD 62</div>
            <ul className="list-disc list-inside mt-1 text-slate-300 space-y-0.5">
              {CHECKLIST_LEAD_QUENTE.map(c=> <li key={c}>{c}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
