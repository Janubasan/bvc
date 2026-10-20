"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MRV_EMPREENDIMENTOS, MRV_POR_CIDADE, MRV_FINANCIAMENTO, MRV_KPIS } from "@/lib/data-mrv";
import { Building2, MapPin, Calendar, Ruler, Home, Clock, Zap, Filter, Play, Copy, CheckCircle2, TrendingUp, Wallet, Timer } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";

export function MRVSystem() {
  const { setActiveTab } = useStore();
  const [city, setCity] = useState<"Goiânia" | "Aparecida de Goiânia" | "Todos">("Todos");
  const list = city === "Todos" ? MRV_EMPREENDIMENTOS : MRV_EMPREENDIMENTOS.filter((e) => e.cidade === city);

  return (
    <div className="space-y-6">
      {/* Header MRV */}
      <div className="rounded-[20px] bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 text-white p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white text-green-800 rounded-full px-3 py-1 text-xs font-bold">
              <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse" /> MRV ENGENHARIA • 8 PRÉDIOS SISTEMATIZADOS • ABERTURAS VALIDADAS
            </div>
            <h1 className="mt-3 text-2xl md:text-[28px] font-extrabold leading-tight" style={{ fontFamily: "Sora" }}>
              Só MRV. 8 prédios validados. <span className="text-emerald-200">Pronto para disparar.</span>
            </h1>
            <p className="mt-2 text-sm text-emerald-50 leading-relaxed max-w-2xl">
              <b>Aparecida (3):</b> Gran Safira Ago/2029 41-45m², Gran Essence Out/2028 41,35-43,86m², Gran Parma Jun/2029 41,35-47,60m² c/ varanda ampla — <b>Goiânia (5):</b> Gran Terrazo Set/2029 39m², Priville Dez/2028 39,30-43,05m², Gran Aurora Jan/2029 39,30m², Gran Porto Set/2027 37,28-49,35m², Vert Parque Amazônia Mar/2029 38,38-45,19m² (varanda até 50,41m²). <b>{MRV_FINANCIAMENTO.frase}</b>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="bg-white text-green-800 hover:bg-emerald-50" onClick={() => setActiveTab("mensagens")}>
                <Wallet className="h-4 w-4 mr-1" /> Ver aberturas validadas →
              </Button>
              <Button size="sm" variant="ghost" className="text-white border border-white/30 hover:bg-white/10" onClick={() => setActiveTab("integracoes")}>
                Ativar captação MRV
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-4 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">KPIs MRV Exclusivo</span>
              <Badge className="bg-green-600 text-white text-[11px]">8 prédios • 1.5k leads</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-2.5">
                <div className="text-[11px] text-slate-500">Unidades MRV</div>
                <div className="text-lg font-extrabold">{MRV_KPIS.totalUnidades.toLocaleString("pt-BR")}</div>
                <div className="text-[11px] text-slate-500">8 prédios</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-2.5">
                <div className="text-[11px] text-green-700">Leads MRV</div>
                <div className="text-lg font-extrabold text-green-700">{MRV_KPIS.leadsCaptados.toLocaleString("pt-BR")}</div>
                <div className="text-[11px] text-green-700">Aparecida {MRV_KPIS.aparecidaLeads} • Goiânia {MRV_KPIS.goianiaLeads}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                <div className="text-[11px] text-amber-700">Entrega mais próxima</div>
                <div className="text-xs font-extrabold text-amber-800 leading-tight">Gran Porto<br />Set/2027</div>
                <div className="text-[11px] text-amber-700">37-49m² c/ varanda</div>
              </div>
            </div>
            <div className="mt-2 text-[11px] bg-slate-900 text-white rounded-full px-3 py-1.5 text-center font-medium">
              {MRV_FINANCIAMENTO.frase}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros cidade */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-full text-sm">
          {[
            { id: "Todos", label: "Todos (8)", count: 8 },
            { id: "Aparecida de Goiânia", label: "Aparecida (3)", count: 3 },
            { id: "Goiânia", label: "Goiânia (5)", count: 5 },
          ].map((f) => (
            <button key={f.id} onClick={() => setCity(f.id as any)} className={`px-4 py-1.5 rounded-full font-medium text-xs ${city === f.id ? "bg-slate-900 text-white" : "text-slate-600"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 bg-green-600 rounded-full" /> 420 meses</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 bg-emerald-500 rounded-full" /> FGTS</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 bg-teal-600 rounded-full" /> Menores taxas</span>
        </div>
      </div>

      {/* Grid 8 prédios */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((emp) => (
          <Card key={emp.id} className="overflow-hidden hover:shadow-lg transition group border-t-0">
            <div className={`h-1.5 ${emp.cor}`} />
            <CardHeader className="pb-2 pt-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm leading-none flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-700" /> {emp.nome}
                  </CardTitle>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {emp.bairro} • {emp.cidade}
                  </div>
                </div>
                <Badge variant={emp.status === "venda" ? "warning" : emp.status === "em obras" ? "success" : "secondary"} className="text-[10px] capitalize shrink-0">
                  {emp.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1"><Calendar className="h-3 w-3" /> Entrega</div>
                  <div className="text-xs font-extrabold leading-tight">{emp.entrega}</div>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-2">
                  <div className="text-[11px] text-teal-700 flex items-center justify-center gap-1"><Ruler className="h-3 w-3" /> Metragem</div>
                  <div className="text-xs font-extrabold text-teal-800 leading-tight">{emp.metragemTexto}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1"><Home className="h-3 w-3" /> Varanda</div>
                  <div className="text-[10px] font-bold leading-tight">{emp.varanda.includes("sem") ? "C/ e s/ varanda" : emp.varanda.slice(0, 18)}</div>
                </div>
              </div>

              <div className="text-xs bg-white border rounded-xl px-2.5 py-2 leading-relaxed">
                <div className="font-semibold text-slate-800">{emp.varandaDetalhe}</div>
                <div className="text-slate-500 mt-1">{emp.tipologia} • R${(emp.ticketDesde / 1000).toFixed(0)}k a R${(emp.ticketAte / 1000).toFixed(0)}k • {emp.financiamento}</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Vendido</span>
                  <span className="font-semibold">{emp.estoquePct}% • {emp.leads} leads • {emp.conversao}% conv</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${emp.cor}`} style={{ width: `${emp.estoquePct}%` }} />
                </div>
              </div>

              <div className="flex gap-1.5">
                <Button size="sm" className={`flex-1 text-xs text-white ${emp.cor} hover:opacity-90`}>
                  <Play className="h-3 w-3 mr-1" /> Captar
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => setActiveTab("mensagens")}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Zap className="h-3 w-3 text-green-600" /> Aba Sheets “{emp.nomeCurto}” • template validado • score ≥75
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financiamento sistematizado */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Wallet className="h-4 w-4 text-green-600" /> Financiamento MRV sistematizado — 420 meses • FGTS • Menores taxas</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-3">
          {MRV_FINANCIAMENTO.parcelasExemplo.map((p) => (
            <div key={p.empreendimento} className="bg-white border rounded-xl p-3 text-center">
              <div className="text-xs font-bold">{p.empreendimento}</div>
              <div className="text-[11px] text-slate-500">{p.metragem}</div>
              <div className="text-sm font-extrabold text-green-700 mt-1">{p.parcela}</div>
              <div className="text-[11px] text-slate-500">renda {p.renda}</div>
            </div>
          ))}
          <div className="md:col-span-4 text-xs text-slate-600 bg-white border rounded-xl p-2.5 flex flex-col md:flex-row items-center justify-between gap-2">
            <span>💡 <b>Mensagem validada inclui:</b> nome do prédio + entrega Mês/Ano + metragem exata + varanda (c/ ou s/) + financiamento 420x FGTS. Testado p/ cada um dos 8 prédios — não misture aberturas.</span>
            <Button size="sm" variant="accent" onClick={() => setActiveTab("mensagens")}>Ver 8 aberturas →</Button>
          </div>
        </CardContent>
      </Card>

      {/* Harness por prédio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Timer className="h-4 w-4 text-slate-700" /> Harness MRV — 8 pipelines (1 por prédio) • sem misturar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-2 text-xs">
            {MRV_EMPREENDIMENTOS.slice(0, 4).map((e) => (
              <div key={e.id} className="border rounded-xl p-2.5 bg-white">
                <div className="font-semibold">{e.nome}</div>
                <div className="text-slate-500">IG @mrv_engenha → filtro “{e.nomeCurto}” + {e.metragemTexto} → aba Sheets “{e.nomeCurto}” → template validado</div>
                <div className={`h-1 rounded-full mt-2 ${e.cor}`} />
              </div>
            ))}
            <div className="bg-slate-900 text-white rounded-xl p-2.5 flex flex-col justify-center">
              <div className="font-semibold text-xs">Mais 4 pipelines idem</div>
              <div className="text-xs opacity-80">Vert, Gran Porto, Gran Aurora, Priville — mesma lógica, outra aba/template</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setActiveTab("harness")}>Ver canvas n8n (8 fluxos)</Button>
            <Button size="sm" variant="ghost" onClick={() => setActiveTab("prospectar")}>Ir p/ Prospector MRV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
