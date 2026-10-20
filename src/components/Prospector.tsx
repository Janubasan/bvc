"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useStore } from "@/lib/store";
import { INTENT_KEYWORDS, Lead } from "@/lib/data";
import { MRV_EMPREENDIMENTOS } from "@/lib/data-mrv";
import { Instagram, Search, MapPin, Phone, Mail, Sparkles, Play, Pause, CheckCircle2, AlertCircle, Zap, Globe, MessageCircle, Clock, Download, Eye, RefreshCw, Building2 } from "lucide-react";

export function Prospector() {
  const { prospectingRunning, setProspectingRunning, addLead } = useStore();
  const [selectedConstrutoras, setSelectedConstrutoras] = useState<string[]>(["mrv-go-04", "mrv-ap-01", "mrv-ap-03"]);
  const [log, setLog] = useState<string[]>([
    "10:42:12 — MRV Scout iniciando varredura @mrv_engenha (48k seguidores) • filtro 'Gran Porto valor?'",
    "10:42:14 — Capturados 38 perfis que comentaram 'valor?' em Gran Porto + Gran Safira (7 dias)",
    "10:42:16 — Enriquecimento: 22 emails da bio + 31 telefones + FGTS intent",
    "10:42:18 — Score IA: 11 leads Faixa 2 p/ Gran Porto (37,28-49,35m², varanda 49m²) • entrega Set/2027",
    "10:42:20 — Google Maps: 14 imobiliárias Goiânia/Aparecida MRV parceiras — 9 com telefone validado",
  ]);

  const toggleProspect = () => {
    const next = !prospectingRunning;
    setProspectingRunning(next);
    if (next) {
      const emp = MRV_EMPREENDIMENTOS.find(e => e.id === selectedConstrutoras[0]);
      setLog((l) => [...l, `10:42:${22 + Math.floor(Math.random()*10)} — Ciclo MRV ativo: buscando "${emp?.nome} ${emp?.metragemTexto}" + FGTS 420x em IG/FB...`]);
      const newLead: Lead = {
        id: `L-${Date.now().toString().slice(-4)}`,
        nome: "Nova Lead MRV",
        telefone: `6299${Math.floor(10000000 + Math.random()*90000000)}`,
        instagram: "@novalead.mrv",
        origem: "instagram",
        score: Math.floor(70 + Math.random()*25),
        faixa: "Faixa 2",
        rendaEstimada: 3500,
        bairroInteresse: emp?.nome || "Gran Porto",
        cidade: (emp?.cidade as any) || "Goiânia",
        interesse: `Interesse ${emp?.nome} ${emp?.metragemTexto} ${emp?.varanda} • entrega ${emp?.entrega}`,
        status: "novo",
        avatar: "NL",
        createdAt: new Date().toISOString(),
        intentSignals: [`comentou 'valor ${emp?.nomeCurto}?'`, `MRV`],
        construtoraAlvo: "MRV Engenharia"
      };
      setTimeout(()=>addLead(newLead), 800);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Sora" }}>Prospector MRV — 8 Prédios Exclusivos</h2>
          <p className="text-sm text-slate-500">Selecione os prédios MRV, ative o harness e receba leads em Google Sheets por prédio (aba dedicada) em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={prospectingRunning ? "secondary" : "accent"} onClick={toggleProspect}>
            {prospectingRunning ? <><Pause className="h-4 w-4 mr-2" /> Pausar MRV</> : <><Play className="h-4 w-4 mr-2" /> Iniciar varredura MRV</>}
          </Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Exportar últimos 100</Button>
        </div>
      </div>

      {/* Fontes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "ig", title: "Instagram MRV", desc: "Apify Actor @mrv_engenha • comentários 'Gran Porto valor?' • bio", icon: Instagram, color: "from-green-600 to-emerald-600", active: true, count: "@mrv_engenha • 48k seguidores" },
          { id: "maps", title: "Google Maps MRV", desc: "Parceiros MRV Goiânia/Aparecida • 50+ campos", icon: MapPin, color: "from-emerald-500 to-teal-500", active: true, count: "14 imobiliárias MRV" },
          { id: "financa", title: "Intenção FGTS 420x", desc: "Keywords 'FGTS entrada', '420 meses', 'menores taxas' • FB grupos", icon: Search, color: "from-orange-500 to-amber-500", active: true, count: "8 keywords MRV" },
          { id: "olx", title: "OLX / Zap MRV", desc: "Favoritos MRV, simulações 420x • sinal compra", icon: Globe, color: "from-blue-500 to-indigo-500", active: true, count: "Ativo" },
        ].map((f) => (
          <Card key={f.id} className={f.active ? "ring-2 ring-green-500/20 border-green-200" : "opacity-60"}>
            <CardHeader className="pb-2">
              <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white`}>
                <f.icon className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm mt-2">{f.title}</CardTitle>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs font-medium">{f.count}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                {f.active ? <><CheckCircle2 className="h-3 w-3" /> Ativo</> : <><Clock className="h-3 w-3" /> Pausado</>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4 text-green-600" /> Selecione os prédios MRV para monitorar (8 exclusivos)</CardTitle>
            <Badge variant="secondary">{selectedConstrutoras.length} selecionados</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {MRV_EMPREENDIMENTOS.map((c) => {
                const selected = selectedConstrutoras.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConstrutoras((prev) => selected ? prev.filter((x) => x !== c.id) : [...prev, c.id])}
                    className={`text-left p-3 rounded-xl border flex items-center gap-3 transition ${selected ? "bg-green-50 border-green-300" : "bg-white hover:bg-slate-50"}`}
                  >
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs ${c.cor}`}>MRV</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold leading-none">{c.nome} • {c.cidade.includes("Aparecida") ? "Aparecida" : "Goiânia"}</div>
                      <div className="text-xs text-slate-500">{c.entrega} • {c.metragemTexto} • {c.varanda.slice(0, 26)}</div>
                      <div className="text-[11px] text-green-700 font-medium">R${(c.ticketDesde/1000).toFixed(0)}k • 420x FGTS</div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected ? "bg-green-600 border-green-600 text-white" : "border-slate-300"}`}>
                      {selected && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div className="text-sm">
                <div className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-green-400" /> Captação MRV LGPD-first</div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">Só dados públicos MRV: comentários em posts MRV, bio com tel, link WhatsApp. Cada lead vai para aba Sheets do prédio (ex: “Gran Porto”) + Docs dossiê 420x.</div>
              </div>
              <Eye className="h-5 w-5 text-slate-400 hidden md:block" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="accent"><Zap className="h-4 w-4 mr-1" /> Rodar Scraper MRV (Apify)</Button>
              <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-1" /> Testar filtro MRV</Button>
              <Button size="sm" variant="ghost">Ver código MRV →</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Log MRV em tempo real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-emerald-300 rounded-xl p-3 font-mono text-xs leading-relaxed h-[320px] overflow-auto">
              {log.map((l, i) => (
                <div key={i} className="opacity-90">› {l}</div>
              ))}
              {prospectingRunning && <div className="text-green-300 animate-pulse">▌ varrendo MRV próximo lote…</div>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 rounded-xl p-2"><div className="font-bold">38</div><div className="text-slate-500">perfis / ciclo</div></div>
              <div className="bg-slate-50 rounded-xl p-2"><div className="font-bold">22</div><div className="text-slate-500">emails MRV</div></div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-2"><div className="font-bold text-green-700">+11 leads</div><div className="text-green-700">score ≥75</div></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Por que só MRV (e por prédio)?</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl border bg-white">
            <div className="font-semibold">Apify MRV direto</div>
            <p className="text-xs text-slate-500 mt-1">@mrv_engenha → directUrls p/ cada prédio. Sem misturar Vega/Direcional. Filtro “Gran Porto” etc.</p>
            <Badge variant="success" className="mt-2">MRV exclusivo</Badge>
          </div>
          <div className="p-3 rounded-xl border bg-white">
            <div className="font-semibold">Aba Sheets por prédio</div>
            <p className="text-xs text-slate-500 mt-1">Leads Gran Porto vão só p/ aba “Gran Porto”, Gran Safira só p/ “Gran Safira”. Sem confusão.</p>
            <Badge variant="secondary" className="mt-2">8 abas</Badge>
          </div>
          <div className="p-3 rounded-xl border bg-green-50 border-green-200">
            <div className="font-semibold text-green-800">Mensagem validada</div>
            <p className="text-xs text-green-700 mt-1">Abertura inclui Entrega + Metragem + Varanda do prédio. Ex: “Gran Porto Set/2027 37,28-49,35m² c/ varanda até 49,35”.</p>
            <Badge variant="outline" className="mt-2">Validada MRV</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
