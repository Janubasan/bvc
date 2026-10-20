"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useStore } from "@/lib/store";
import { CONSTRUTORAS_MCMV_GO, INTENT_KEYWORDS, Lead } from "@/lib/data";
import { Instagram, Search, MapPin, Phone, Mail, Sparkles, Play, Pause, CheckCircle2, AlertCircle, Zap, Globe, MessageCircle, Clock, Download, Eye, RefreshCw } from "lucide-react";

export function Prospector() {
  const { prospectingRunning, setProspectingRunning, addLead } = useStore();
  const [selectedConstrutoras, setSelectedConstrutoras] = useState<string[]>(["1", "2", "3"]);
  const [log, setLog] = useState<string[]>([
    "10:42:12 — Agente Scout iniciando varredura Instagram @mrvmrv_goiania (4.2k seguidores)",
    "10:42:14 — Capturados 38 perfis que comentaram 'valor?' nos últimos 7 dias",
    "10:42:16 — Enriquecimento: 22 emails extraídos da bio + 31 telefones (padrão WhatsApp)",
    "10:42:18 — Score IA: 11 leads Faixa 2 com intent 'FGTS entrada' detectado",
    "10:42:20 — Google Maps: 14 imobiliárias em Aparecida — 9 com telefone validado",
  ]);

  const toggleProspect = () => {
    const next = !prospectingRunning;
    setProspectingRunning(next);
    if (next) {
      setLog((l) => [...l, `10:42:${22 + Math.floor(Math.random()*10)} — Ciclo agêntico ativo — buscando "${INTENT_KEYWORDS[0]}" em Facebook Grupos...`]);
      // simulate adding a lead
      const newLead: Lead = {
        id: `L-${Date.now().toString().slice(-4)}`,
        nome: "Nova Lead Instagram",
        telefone: `6299${Math.floor(10000000 + Math.random()*90000000)}`,
        instagram: "@novalead.go",
        origem: "instagram",
        score: Math.floor(70 + Math.random()*25),
        faixa: "Faixa 2",
        rendaEstimada: 3500,
        bairroInteresse: "Alto da Boa Vista",
        cidade: "Aparecida de Goiânia",
        interesse: "Comentou em post Vega • FGTS",
        status: "novo",
        avatar: "NL",
        createdAt: new Date().toISOString(),
        intentSignals: ["comentou 'parcelas?'", "segue 3 construtoras"],
        construtoraAlvo: CONSTRUTORAS_MCMV_GO.find(c=>c.id===selectedConstrutoras[0])?.nome
      };
      setTimeout(()=>addLead(newLead), 800);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Sora" }}>Prospector Agêntico MCMV</h2>
          <p className="text-sm text-slate-500">Escolha as fontes, ative o harness e receba leads em Google Sheets em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={prospectingRunning ? "secondary" : "accent"} onClick={toggleProspect}>
            {prospectingRunning ? <><Pause className="h-4 w-4 mr-2" /> Pausar prospecção</> : <><Play className="h-4 w-4 mr-2" /> Iniciar varredura</>}
          </Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Exportar últimos 100</Button>
        </div>
      </div>

      {/* Fontes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "ig", title: "Instagram Construtoras", desc: "Apify Actor + Instaloader (12.6k★) • comentários, seguidores, bio", icon: Instagram, color: "from-pink-500 to-purple-500", active: true, count: "8 perfis • 127k seguidores" },
          { id: "maps", title: "Google Maps Leads", desc: "omkarcloud/google-maps-scraper 3.6k★ • 50+ campos • tel/email", icon: MapPin, color: "from-emerald-500 to-teal-500", active: true, count: "14 imobiliárias Aparecida" },
          { id: "financa", title: "Intenção Finança & Moradia", desc: "Palavras-chave FGTS, subsídio, 'chega de aluguel' • FB grupos", icon: Search, color: "from-orange-500 to-amber-500", active: true, count: "8 keywords rastreadas" },
          { id: "olx", title: "OLX / Zap / VivaReal", desc: "Favoritos, simulações, comparativos • sinal de compra", icon: Globe, color: "from-blue-500 to-indigo-500", active: false, count: "Em breve" },
        ].map((f) => (
          <Card key={f.id} className={f.active ? "ring-2 ring-teal-500/20 border-teal-200" : "opacity-60"}>
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
            <CardTitle className="flex items-center gap-2"><Instagram className="h-4 w-4 text-pink-500" /> Selecione construtoras para monitorar</CardTitle>
            <Badge variant="secondary">{selectedConstrutoras.length} selecionadas</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {CONSTRUTORAS_MCMV_GO.map((c) => {
                const selected = selectedConstrutoras.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConstrutoras((prev) => selected ? prev.filter((x) => x !== c.id) : [...prev, c.id])}
                    className={`text-left p-3 rounded-xl border flex items-center gap-3 transition ${selected ? "bg-teal-50 border-teal-300" : "bg-white hover:bg-slate-50"}`}
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center">{c.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold leading-none">{c.nome}</div>
                      <div className="text-xs text-slate-500">{c.instagram} • {(c.seguidores/1000).toFixed(1)}k</div>
                      <div className="text-[11px] text-teal-700 font-medium">{c.foco}</div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300"}`}>
                      {selected && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div className="text-sm">
                <div className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-400" /> Como captamos contatos (LGPD-first)</div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">Apenas dados públicos: bio, comentários, link WhatsApp. Sem login invasivo. E-mail SMTP verify (Scout). Telefone só se exposto publicamente. Opt-out em 1 clique.</div>
              </div>
              <Eye className="h-5 w-5 text-slate-400 hidden md:block" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="accent"><Zap className="h-4 w-4 mr-1" /> Rodar Scraper Apify agora</Button>
              <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-1" /> Testar Instaloader local</Button>
              <Button size="sm" variant="ghost">Ver código Scout →</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Log agêntico em tempo real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-emerald-300 rounded-xl p-3 font-mono text-xs leading-relaxed h-[320px] overflow-auto">
              {log.map((l, i) => (
                <div key={i} className="opacity-90">› {l}</div>
              ))}
              {prospectingRunning && <div className="text-teal-300 animate-pulse">▌ processando próximo lote…</div>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 rounded-xl p-2"><div className="font-bold">38</div><div className="text-slate-500">perfis / ciclo</div></div>
              <div className="bg-slate-50 rounded-xl p-2"><div className="font-bold">22</div><div className="text-slate-500">emails válidos</div></div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-2"><div className="font-bold text-teal-700">+11 leads</div><div className="text-teal-700">score &gt;75</div></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhe técnico — Instagram (caminho recomendado 2026)</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl border bg-white">
            <div className="font-semibold">Opção A • Apify Store (no-code)</div>
            <p className="text-xs text-slate-500 mt-1">Actor “Instagram Scraper” + Apify Node no n8n → Google Sheets. $1.50/1k results, 5$ free. Melhor custo/estabilidade.</p>
            <Badge variant="success" className="mt-2">Recomendado BVC</Badge>
          </div>
          <div className="p-3 rounded-xl border bg-white">
            <div className="font-semibold">Opção B • Instaloader (self-host)</div>
            <p className="text-xs text-slate-500 mt-1">MIT, 12.6k★, v4.15.1. CLI Python para perfis públicos, hashtags, comentários. Sem login. Use com proxy + delay.</p>
            <Badge variant="secondary" className="mt-2">Grátis • técnico</Badge>
          </div>
          <div className="p-3 rounded-xl border bg-white">
            <div className="font-semibold">Opção C • Scout CLI (all-in-one)</div>
            <p className="text-xs text-slate-500 mt-1">756★ — scrape IG/TikTok/LinkedIn + extrai email/phone da bio + SMTP verify + CSV. Ideal para SDRs.</p>
            <Badge variant="outline" className="mt-2">Open source</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
