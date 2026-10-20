"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { KPIS, BAIRROS_FOCO, CONSTRUTORAS_MCMV_GO, INTENT_KEYWORDS } from "@/lib/data";
import { MRV_EMPREENDIMENTOS, MRV_KPIS, MRV_FINANCIAMENTO } from "@/lib/data-mrv";
import { useStore } from "@/lib/store";
import { ArrowUpRight, TrendingUp, Users, Target, Wallet, Home, Instagram, MapPin, Sparkles, Play, Download, ExternalLink, AlertTriangle, Clock, Filter, Calendar, Building2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const chartData = [
  { name: "Seg", leads: 42, qualificados: 18 },
  { name: "Ter", leads: 58, qualificados: 24 },
  { name: "Qua", leads: 71, qualificados: 31 },
  { name: "Qui", leads: 64, qualificados: 29 },
  { name: "Sex", leads: 83, qualificados: 38 },
  { name: "Sáb", leads: 112, qualificados: 51 },
  { name: "Dom", leads: 95, qualificados: 44 },
];

const funil = [
  { etapa: "Captados (IG + Maps)", valor: 1847, pct: 100 },
  { etapa: "Enriquecidos", valor: 1234, pct: 67 },
  { etapa: "Qualificados IA", valor: 623, pct: 34 },
  { etapa: "Contatados", valor: 412, pct: 22 },
  { etapa: "Visitas agendadas", valor: 147, pct: 8 },
];

export function Dashboard() {
  const { setActiveTab, setProspectingRunning } = useStore();
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-[20px] bg-gradient-to-br from-green-800 via-emerald-800 to-teal-900 text-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white text-green-800 rounded-full px-3 py-1 text-xs font-bold">
              <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse" /> MRV ENGENHARIA • 8 PRÉDIOS EXCLUSIVOS • SISTEMA AO VIVO
            </div>
            <h1 className="mt-4 text-2xl md:text-3xl font-extrabold leading-tight" style={{ fontFamily: "Sora" }}>
              Só MRV. 8 prédios validados. <span className="text-emerald-200">Aberturas prontas p/ disparar.</span>
            </h1>
            <p className="mt-3 text-sm text-emerald-50 max-w-2xl leading-relaxed">
              Sistematizado <b>exclusivamente nos 8 MRV</b>: Aparecida (Gran Safira Ago/2029 41-45m², Gran Essence Out/2028 41,35-43,86m², Gran Parma Jun/2029 41,35-47,60m² c/ varanda ampla) + Goiânia (Gran Terrazo Set/2029 39m², Priville Dez/2028 39,30-43,05m², Gran Aurora Jan/2029 39,30m², Gran Porto Set/2027 37,28-49,35m², Vert Mar/2029 38,38-45,19m²). Instagram MRV + intent FGTS/420x → qualificação IA → Sheets/Docs por prédio + mensagem validada.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="accent" onClick={() => { setActiveTab("goiania"); }}>
                <Home className="h-4 w-4 mr-2" /> Ver 8 prédios MRV
              </Button>
              <Button variant="outline" className="bg-white text-green-800 hover:bg-emerald-50" onClick={() => { setActiveTab("mensagens"); }}>
                <Calendar className="h-4 w-4 mr-2" /> Aberturas validadas
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/20" onClick={() => setActiveTab("integracoes")}>
                Conectar APIs →
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Radar Estoque MCMV</span>
                <Badge variant="warning"><AlertTriangle className="h-3 w-3 mr-1" /> Estoque -33% em 6 meses</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500">Vendas 1ºsem 2026</div>
                  <div className="text-lg font-extrabold">2.944</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">+83,4% a/a</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500">Estoque GO</div>
                  <div className="text-lg font-extrabold">{KPIS.estoqueMCMV}</div>
                  <div className="text-[11px] text-slate-500">aparecida 4,6%</div>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                  <div className="text-xs text-teal-700">Ticket médio</div>
                  <div className="text-lg font-extrabold text-teal-700">R$258k</div>
                  <div className="text-[11px] text-teal-700">Vega Aparecida</div>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Alto da Boa Vista I, II, III + Vila Romana • Entrega 2026-27
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Leads captados", value: "1.847", sub: "+212 esta semana", icon: Users, color: "bg-teal-500" },
          { label: "Qualificados IA", value: "623", sub: "33,7% do total", icon: Target, color: "bg-orange-500" },
          { label: "Conversão visita", value: "18,4%", sub: "↑ 2,1pp vs mês passado", icon: TrendingUp, color: "bg-emerald-500" },
          { label: "Custo por lead", value: "R$3,20", sub: "vs R$18 mercado", icon: Wallet, color: "bg-slate-900" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`h-8 w-8 rounded-xl ${k.color} flex items-center justify-center text-white`}>
                  <k.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-3 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">{k.label}</div>
              <div className="text-2xl font-extrabold">{k.value}</div>
              <div className="text-xs text-emerald-600 font-medium">{k.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-600" /> Leads captados por dia (últimos 7 dias)</CardTitle>
            <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Atualizado há 2 min</Badge>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="#14b8a6" fill="#ccfbf1" strokeWidth={2} />
                <Area type="monotone" dataKey="qualificados" stroke="#f97316" fill="#ffedd5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-teal-500 rounded-full" /> Captados</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-orange-500 rounded-full" /> Qualificados IA</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-700" /> Funil MCMV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funil.map((f) => (
              <div key={f.etapa} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{f.etapa}</span>
                  <span className="text-slate-500">{f.valor} • {f.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-2 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1"><Download className="h-4 w-4 mr-1" /> Exportar CSV</Button>
              <Button size="sm" className="flex-1 bg-teal-600">Ver leads →</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4 text-green-600" /> 8 Prédios MRV — Entrega + Metragem + Varanda</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setActiveTab("goiania")}>Ver detalhes →</Button>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {MRV_EMPREENDIMENTOS.slice(0, 4).map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-xl border bg-white hover:bg-slate-50">
              <div>
                <div className="text-sm font-bold">{e.nome} • {e.cidade.includes("Aparecida") ? "Aparecida" : "Goiânia"}</div>
                <div className="text-xs text-slate-500">{e.entrega} • {e.metragemTexto} • {e.varanda.slice(0, 28)}</div>
                <div className="text-[11px] text-green-700 font-medium">{e.financiamento}</div>
              </div>
              <Badge className={`${e.cor} text-white`}>{e.estoquePct}%</Badge>
            </div>
          ))}
          <div className="md:col-span-2 text-xs text-slate-500 bg-green-50 border border-green-200 rounded-xl p-2.5 flex items-center justify-between">
            <span><b>MRV exclusivo:</b> Gran Porto é o mais próximo (Set/2027, 37,28-49,35m² c/ varanda até 49,35) — foque nele p/ quem quer morar logo.</span>
            <Badge variant="success">+4 prédios →</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-600" /> Sinais de intenção (finança & moradia) rastreados pelos agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INTENT_KEYWORDS.map((k) => (
              <span key={k} className="text-xs bg-white border px-2.5 py-1.5 rounded-full font-medium text-slate-700">{k}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Os agentes varrem Instagram comentários, Google Busca, Facebook Grupos “MCMV Aparecida 2026”, OLX favoritos, e simuladores Caixa. Cada sinal soma +10 no lead score.</p>
        </CardContent>
      </Card>
    </div>
  );
}
