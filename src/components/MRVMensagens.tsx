"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MRV_MENSAGENS_VALIDADAS, MRV_EMPREENDIMENTOS } from "@/lib/data-mrv";
import { MessageSquare, Copy, Send, Sparkles, Check, Clock, Copy as CopyIcon, Building2, Calendar, Ruler, Home } from "lucide-react";
import { useState } from "react";

export function MRVMensagens() {
  const [selectedId, setSelectedId] = useState(MRV_MENSAGENS_VALIDADAS[0].id);
  const [copied, setCopied] = useState<string | null>(null);
  const selected = MRV_MENSAGENS_VALIDADAS.find((m) => m.id === selectedId)!;
  const emp = MRV_EMPREENDIMENTOS.find((e) => e.nome === selected.empreendimento)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Sora" }}>
          <MessageSquare className="h-5 w-5 text-green-600" /> Mensagens MRV — 8 Aberturas Validadas (Entrega + Metragem + Varanda)
        </h2>
        <p className="text-sm text-slate-500">Cada prédio tem abertura única validada com <b>Empreendimento + Entrega Mês/Ano + Metragem + Varanda</b> + financiamento 420x FGTS. Não misture — copie a do prédio que o lead demonstrou interesse.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">8 aberturas validadas — escolha o prédio</CardTitle>
            <p className="text-xs text-slate-500">Toque no prédio para ver a abertura exata que já está validada para disparo.</p>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[680px] overflow-auto">
            {MRV_EMPREENDIMENTOS.map((e) => {
              const msg = MRV_MENSAGENS_VALIDADAS.find((m) => m.empreendimento === e.nome)!;
              const active = msg.id === selectedId;
              return (
                <button key={e.id} onClick={() => setSelectedId(msg.id)} className={`w-full text-left p-3 rounded-xl border ${active ? "bg-green-50 border-green-300" : "bg-white hover:bg-slate-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{e.nome}</span>
                    <Badge variant="outline" className="text-[10px]">{e.cidade === "Aparecida de Goiânia" ? "Aparecida" : "Goiânia"}</Badge>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.entrega}</span>
                    <span className="flex items-center gap-1"><Ruler className="h-3 w-3" /> {e.metragemTexto}</span>
                    <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {e.varanda.slice(0, 22)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-green-600 font-semibold">{msg.taxaResposta} resposta</span>
                    <span className={`h-2 w-2 rounded-full ${e.cor}`} />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-600" /> {selected.empreendimento} • {emp.cidade} • {emp.entrega} • {emp.metragemTexto}
            </CardTitle>
            <Badge className={`${emp.cor} text-white text-[11px]`}>{emp.varanda.slice(0, 20)}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cards de validação */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 border rounded-xl p-2.5 text-center">
                <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1"><Calendar className="h-3 w-3" /> Entrega</div>
                <div className="text-sm font-extrabold">{emp.entrega}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-center">
                <div className="text-[11px] text-green-700 flex items-center justify-center gap-1"><Ruler className="h-3 w-3" /> Metragem</div>
                <div className="text-sm font-extrabold text-green-700">{emp.metragemTexto}</div>
              </div>
              <div className="bg-slate-50 border rounded-xl p-2.5 text-center">
                <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1"><Home className="h-3 w-3" /> Varanda</div>
                <div className="text-xs font-bold leading-tight">{emp.varanda}</div>
              </div>
            </div>

            {/* Abertura validada */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <div className="text-xs font-bold text-yellow-800 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Abertura validada (copie exatamente — inclui empreendimento + entrega + metragem + varanda)</div>
              <div className="mt-2 text-sm bg-white border rounded-xl p-3 leading-relaxed">{selected.aberturaValidada}</div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(selected.aberturaValidada); setCopied(selected.id); setTimeout(() => setCopied(null), 2000); }}>
                  {copied === selected.id ? <><Check className="h-4 w-4 mr-1 text-green-600" /> Copiado!</> : <><CopyIcon className="h-4 w-4 mr-1" /> Copiar abertura</>}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(selected.aberturaValidada.replaceAll("{{nome}}", "Ana"))}>Testar com nome Ana</Button>
              </div>
            </div>

            {/* Bolha WhatsApp */}
            <div className="bg-slate-50 rounded-2xl p-4 border">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Template completo • delay 2-5min • Evolution API • opt-out SAIR</span>
                <Badge variant="outline">WhatsApp</Badge>
              </div>
              <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm border max-w-[85%] relative">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{selected.texto}</div>
                <div className="text-[11px] text-slate-400 mt-2">14:42 ✓✓ • {emp.nomeCurto} • {emp.entrega}</div>
                <div className="absolute -right-1 top-4 h-3 w-3 bg-white border-r border-t rotate-45" />
              </div>
              <div className="mt-2 text-xs text-slate-500">Variáveis: <code className="bg-white border px-1 rounded">{"{{nome}}"}</code> + auto preenchido: {emp.nome}, {emp.entrega}, {emp.metragemTexto}, {emp.varanda}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => { navigator.clipboard.writeText(selected.texto); setCopied("full-" + selected.id); setTimeout(() => setCopied(null), 2000); }} variant="outline">
                  {copied === "full-" + selected.id ? <><Check className="h-4 w-4 mr-1 text-green-600" /> Copiado!</> : <><Copy className="h-4 w-4 mr-1" /> Copiar mensagem completa</>}
                </Button>
                <Button size="sm" variant="accent"><Send className="h-4 w-4 mr-1" /> Enviar teste p/ meu WhatsApp</Button>
              </div>
            </div>

            {/* Rodapé técnico */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white border rounded-xl p-2.5"><b>Por que validada?</b><div className="text-slate-500 mt-1">Inclui 4 dados que MRV exige: nome prédio + mês/ano + metragem + varanda. Sem inventar.</div></div>
              <div className="bg-white border rounded-xl p-2.5"><b>Financiamento fixo</b><div className="text-slate-500 mt-1">Sempre: 420 meses + FGTS + menores taxas + “Seu 1º apê”. Diferencia MRV.</div></div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-2.5"><b>Próximo passo c/ você</b><div className="text-green-700 mt-1">Vamos revisar tom por prédio (Gran Porto 2027 = urgência; Safira 2029 = planejamento).</div></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
