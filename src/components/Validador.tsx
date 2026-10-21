"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShieldCheck, Phone, Download, Upload, AlertTriangle, Smartphone, Zap, FileSpreadsheet, Copy, Filter, MapPin, ClipboardCheck, FileText, CheckCircle2 } from "lucide-react";
import { ESTRATEGIAS_VALIDADAS, CHECKLIST_LEAD_QUENTE } from "@/lib/validation";
import { LISTAS_MODELO } from "@/lib/listas-validadas";

export function Validador() {
  const [input, setInput] = useState("(62) 99902-3474\n62991234567\n(62) 99123-4567\n62123456789");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [formatoBox, setFormatoBox] = useState<"e164"|"nacional"|"whatsapp">("e164");

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
    setTimeout(()=>setCopiado(null), 2000);
  };

  const baixar = (conteudo: string, nome: string, tipo: string) => {
    const blob = new Blob(["\uFEFF" + conteudo], {type: tipo});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = nome;
    a.click(); URL.revokeObjectURL(url);
  };
  const baixarCSV = () => {
    if (!res?.export?.csv) return;
    baixar(res.export.csv, `validados-DDD62-${res.resumo.validados}-numeros-${new Date().toISOString().slice(0,10)}.csv`, "text/csv;charset=utf-8;");
  };
  const baixarTXT = (qual: "e164"|"nacional"|"whatsapp") => {
    if (!res?.export) return;
    const map = { e164: res.export.listaE164, nacional: res.export.listaNacional, whatsapp: res.export.listaWhatsApp } as any;
    const txt = map[qual];
    if (!txt) return;
    baixar(txt, `validados-DDD62-${qual}-${res.resumo.validados}-${new Date().toISOString().slice(0,10)}.txt`, "text/plain;charset=utf-8;");
  };

  const totalInput = input.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean).length;
  const listaAtual = res?.export ? (formatoBox==="e164" ? res.export.listaE164 : formatoBox==="nacional" ? res.export.listaNacional : res.export.listaWhatsApp) : "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-green-900 to-emerald-800 text-white p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="flex flex-col lg:flex-row gap-6 relative">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white text-green-800 rounded-full px-3 py-1 text-xs font-bold"><ShieldCheck className="h-4 w-4" /> VALIDADOR 62 • 6 MOTORES • DDD62 EXCLUSIVO</div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold" style={{fontFamily:"Sora"}}>Cole e valide. <span className="text-emerald-200">Baixe só os prontos pro Zap.</span></h1>
            <p className="mt-2 text-sm text-emerald-50 leading-relaxed">Cada linha = 1 coluna separada (corrigido). Cole sua base com opt-in (1 por linha) → validamos <b>DDD 62</b> + móvel 9 dígitos + WhatsApp → <b>copia e cola</b> ou <b>baixa CSV/TXT</b> pronto.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="bg-white/15 px-3 py-1.5 rounded-full">✓ DDD 62 = validado</span>
              <span className="bg-white/15 px-3 py-1.5 rounded-full">✓ 9 dígitos móvel</span>
              <span className="bg-white/15 px-3 py-1.5 rounded-full">✓ WhatsApp</span>
              <span className="bg-white/15 px-3 py-1.5 rounded-full">DDD ≠62 = duvidoso</span>
            </div>
          </div>
          <div className="w-full lg:w-[420px] bg-white text-slate-900 rounded-2xl p-4 shadow-xl">
            <div className="text-xs font-bold flex items-center justify-between">Cole números aqui (1 por linha) <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">{totalInput} números</span></div>
            <textarea value={input} onChange={e=>setInput(e.target.value)} rows={8} className="w-full mt-2 p-2.5 rounded-xl border text-sm font-mono bg-slate-50 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder={"(62) 99902-3474\n62991234567"} />
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={validar} disabled={loading || totalInput===0}><Zap className="h-4 w-4 mr-1" /> {loading ? "Validando..." : `Validar ${totalInput} números`}</Button>
              <Button size="sm" variant="outline" onClick={()=>setInput("")}>Limpar</Button>
            </div>
            <div className="flex gap-1 mt-2">
              <button onClick={()=>setInput("(62) 99902-3474\n62991234567\n(62) 99123-4567")} className="text-[11px] text-green-700 underline">Carregar exemplo 62</button>
              <span className="text-[11px] text-slate-300">•</span>
              <button onClick={()=>setInput("(62) 91234-5678\n(62) 98765-4321\n(62) 99999-1111\n(62) 90000-0000")} className="text-[11px] text-slate-600 underline">Exemplo 4 números</button>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1"><MapPin className="h-3 w-3"/> DDD 62 = Goiânia/Aparecida. Fixo = inválido. DDD fora 62 = duvidoso.</div>
          </div>
        </div>
      </div>

      {res && (
        <Card className={res.resumo?.validados ? "border-green-300 shadow-lg" : "border-amber-200"}>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-green-600" /> Resultado — {res.resumo.validados} validados de {res.resumo.total}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-600">{res.resumo.prontosParaZap} prontos Zap</Badge>
                <Badge variant="outline">{res.resumo.ddd62} DDD 62</Badge>
                <Badge variant="outline">{res.resumo.whatsapp} WhatsApp</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Métricas em cards separados */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-3 border"><div className="text-xl font-extrabold">{res.resumo.total}</div><div className="text-[11px] text-slate-500">Total enviados</div></div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3"><div className="text-xl font-extrabold text-green-700">{res.resumo.validados}</div><div className="text-[11px] font-semibold">Validados ✓</div></div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><div className="text-xl font-extrabold">{res.resumo.duvidosos}</div><div className="text-[11px]">Duvidosos</div></div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3"><div className="text-xl font-extrabold text-red-600">{res.resumo.invalidos}</div><div className="text-[11px]">Inválidos</div></div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3"><div className="text-xl font-extrabold text-teal-700">{res.resumo.ddd62}</div><div className="text-[11px]">DDD 62</div></div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-3"><div className="text-xl font-extrabold text-violet-700">{res.resumo.whatsapp}</div><div className="text-[11px]">WhatsApp</div></div>
            </div>

            {res.validados?.length >0 ? (
              <div className="space-y-4">
                {/* BOX CTRL+C CTRL+V - DESTAQUE PRINCIPAL */}
                <div className="rounded-2xl bg-slate-900 p-4 border-2 border-green-400 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-white font-extrabold text-sm"><Copy className="h-4 w-4 text-emerald-400"/> BOX PARA COPIAR — Ctrl+C / Ctrl+V</div>
                    <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-bold">{res.validados.length} números prontos</span>
                  </div>

                  {/* Tabs formato */}
                  <div className="flex gap-1 mb-2">
                    <button onClick={()=>setFormatoBox("e164")} className={`px-3 py-1.5 rounded-full text-xs font-bold ${formatoBox==="e164" ? "bg-green-600 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}>E164 (+55)</button>
                    <button onClick={()=>setFormatoBox("nacional")} className={`px-3 py-1.5 rounded-full text-xs font-bold ${formatoBox==="nacional" ? "bg-green-600 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}>Nacional</button>
                    <button onClick={()=>setFormatoBox("whatsapp")} className={`px-3 py-1.5 rounded-full text-xs font-bold ${formatoBox==="whatsapp" ? "bg-green-600 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}>Só WhatsApp</button>
                    <span className="ml-auto text-[11px] text-emerald-200 hidden sm:inline">clique no box → Ctrl+A → Ctrl+C</span>
                  </div>

                  <textarea
                    readOnly
                    value={listaAtual}
                    rows={Math.min(14, Math.max(4, res.validados.length + 1))}
                    className="w-full p-3 rounded-xl font-mono text-sm bg-white text-slate-900 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onFocus={e=>e.target.select()}
                    onClick={e=> (e.target as HTMLTextAreaElement).select()}
                    placeholder="Números validados aparecerão aqui..."
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>copiar(listaAtual, "box")}><Copy className="h-4 w-4 mr-1"/>{copiado==="box" ? "Copiado! ✓" : `Copiar ${formatoBox.toUpperCase()} (${res.validados.length})`}</Button>
                    <Button size="sm" variant="outline" className="bg-white text-slate-900 hover:bg-slate-100" onClick={()=>baixarTXT(formatoBox)}><Download className="h-4 w-4 mr-1"/>Baixar TXT {formatoBox.toUpperCase()}</Button>
                    <Button size="sm" variant="outline" className="bg-white text-slate-900 hover:bg-slate-100" onClick={baixarCSV}><FileSpreadsheet className="h-4 w-4 mr-1"/>Baixar CSV</Button>
                  </div>
                  <div className="text-[11px] text-emerald-200 mt-2">💡 Dica: clique no box → <b>Ctrl+A</b> → <b>Ctrl+C</b> → cole no WhatsApp/Evolution/Sheets. Formato {formatoBox==="e164" ? "E164 +55 correto para API" : formatoBox==="nacional" ? "nacional (55) com DDD" : "só números com WhatsApp"}.</div>
                </div>

                {/* Tabela */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold">✅ Validados — prontos para copiar/baixar:</div>
                    <span className="text-[11px] bg-green-100 text-green-800 px-2 py-1 rounded-full">{res.validados.length} linhas</span>
                  </div>
                  <div className="border rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-xs min-w-[620px]">
                      <thead className="bg-slate-900 text-white"><tr><th className="p-2 text-left">#</th><th className="p-2 text-left">Original</th><th className="p-2 text-left">Nacional</th><th className="p-2 text-left">E164</th><th className="p-2 text-left">Operadora</th><th className="p-2 text-center">Zap</th></tr></thead>
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
                </div>

                {/* Botões extras copiar/baixar */}
                <div className="grid md:grid-cols-3 gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>copiar(res.export.listaE164, "e164")}><Copy className="h-4 w-4 mr-1" /> {copiado==="e164" ? "Copiado! ✓" : "Copiar E164"}</Button>
                  <Button size="sm" variant="outline" onClick={()=>copiar(res.export.listaNacional, "nacional")}><Copy className="h-4 w-4 mr-1" /> {copiado==="nacional" ? "Copiado! ✓" : "Copiar Nacional"}</Button>
                  <Button size="sm" variant="outline" onClick={()=>copiar(res.export.listaWhatsApp, "zap")}><Phone className="h-4 w-4 mr-1" /> {copiado==="zap" ? "Copiado! ✓" : "Copiar só WhatsApp"}</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="bg-slate-900 text-white" onClick={baixarCSV}><Download className="h-4 w-4 mr-1" /> Baixar CSV validados ({res.resumo.validados})</Button>
                  <Button size="sm" variant="outline" onClick={()=>baixarTXT("e164")}><FileText className="h-4 w-4 mr-1"/> Baixar TXT E164</Button>
                  <Button size="sm" variant="outline" onClick={()=>baixarTXT("nacional")}><FileText className="h-4 w-4 mr-1"/> Baixar TXT Nacional</Button>
                  <Button size="sm" variant="outline" onClick={()=>baixarTXT("whatsapp")}><Phone className="h-4 w-4 mr-1"/> Baixar TXT WhatsApp</Button>
                  <a href="/api/validate?template=csv"><Button size="sm" variant="ghost"><Download className="h-4 w-4 mr-1" /> Template vazio</Button></a>
                </div>
                <div className="text-[11px] bg-green-50 border border-green-200 rounded-lg p-2 text-green-800 flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Pronto para colar no Sheets/Excel ou importar no Evolution. Formato E164 com +55. LGPD: use apenas com opt-in.</div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-sm">
                <AlertTriangle className="h-6 w-6 mx-auto text-amber-600 mb-2" />
                Nenhum validado neste lote. Verifique formato (ex: (62) 99902-3474) e DDD 62.
              </div>
            )}

            {(res.duvidosos?.length>0 || res.invalidos?.length>0) && (
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                {res.duvidosos?.length>0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><b className="text-amber-800">Duvidosos ({res.duvidosos.length}):</b><div className="mt-1 text-amber-700 break-words">{res.duvidosos.map((d:any)=>d.nacional || d.original).join(" • ")}</div><div className="text-[11px] mt-1">Motivo: fora DDD 62</div></div>}
                {res.invalidos?.length>0 && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><b className="text-red-800">Inválidos ({res.invalidos.length}):</b><div className="mt-1 text-red-700 break-words">{res.invalidos.map((d:any)=>d.original).join(" • ")}</div><div className="text-[11px] mt-1">Motivo: fixo ou formato errado</div></div>}
              </div>
            )}
            {res.avisoLGPD && <div className="text-[11px] bg-slate-900 text-white rounded-lg p-2.5">{res.avisoLGPD}</div>}
          </CardContent>
        </Card>
      )}

      {/* LISTAS PRONTAS PARA BAIXAR - DEMO DDD62 */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Download className="h-4 w-4 text-green-600"/> Listas demo DDD62 prontas para baixar (sintético — teste o fluxo)</CardTitle>
        <p className="text-xs text-slate-600">Números DEMO sintéticos no formato válido DDD62 para testar download/Ctrl+C antes de usar sua base real. Todos passam nos 6 motores.</p></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {LISTAS_MODELO.map(l=>(
            <div key={l.id} className="border rounded-xl p-3 bg-white">
              <div className="text-sm font-bold">{l.nome}</div>
              <div className="text-xs text-slate-500">{l.cidade} • {l.estrategia} • {l.validados} validados • {l.taxaValido} taxa</div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-[11px]">{l.validados} DDD62</Badge>
                <Badge className="bg-green-600 text-[11px]">{l.whatsapp} Zap</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={l.download}><Button size="sm" className="bg-slate-900 text-white"><FileSpreadsheet className="h-4 w-4 mr-1"/>Baixar CSV</Button></a>
                <a href={`${l.download}&formato=txt`}><Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-1"/>Baixar TXT E164</Button></a>
                <a href={`${l.download}&formato=nacional`}><Button size="sm" variant="ghost" className="text-xs">TXT Nacional</Button></a>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">Preview: {l.preview.map(p=>p.e164).join(" • ")}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Como ter telefones reais validados (não fornecemos base pronta real)</CardTitle></CardHeader>
        <CardContent className="text-xs leading-relaxed text-slate-700">
          Por LGPD não entregamos lista pronta com nome+telefone real. O fluxo correto é: <b>você capta com opt-in</b> (Meta Lead Ads + OTP, QR no plantão, landing com consentimento) → cola aqui no Validador → baixa só validados DDD 62 via BOX Ctrl+C ou CSV/TXT. <a href="/api/validate?template=csv" className="text-green-700 underline">Baixe o template CSV vazio</a> para preencher com seus leads ou use a área acima para validar.
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
