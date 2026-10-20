"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { EMPREENDIMENTOS_GOIANIA, EMPREENDIMENTOS_APARECIDA, Lead } from "@/lib/data";
import { MapPin, Building2, TrendingUp, Users, Clock, ExternalLink, Zap, Filter, Play, Pause, Settings2, ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";

export function GoianiaSistematizada() {
  const { setActiveTab } = useStore();
  const [city, setCity] = useState<"Goiânia" | "Aparecida de Goiânia">("Goiânia");
  const list = city === "Goiânia" ? EMPREENDIMENTOS_GOIANIA : EMPREENDIMENTOS_APARECIDA;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Sora" }}>
            <Building2 className="h-5 w-5 text-teal-600" /> Sistematização MCMV — 6 Opções Goiânia + 2 Aparecida
          </h2>
          <p className="text-sm text-slate-500">Cada empreendimento = pipeline dedicado no harness (IG → Filtro Faixa → Sheets aba própria → WhatsApp template). Operação paralela, sem misturar leads.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-full text-sm">
            <button onClick={() => setCity("Goiânia")} className={`px-4 py-1.5 rounded-full font-medium ${city === "Goiânia" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Goiânia (6)</button>
            <button onClick={() => setCity("Aparecida de Goiânia")} className={`px-4 py-1.5 rounded-full font-medium ${city === "Aparecida de Goiânia" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Aparecida (2)</button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("harness")}><Settings2 className="h-4 w-4 mr-1" /> Ver harness</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((e) => (
          <Card key={e.id} className="overflow-hidden hover:shadow-lg transition group">
            <div className={`h-1.5 ${e.cor}`} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm leading-tight">{e.nome}</CardTitle>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {e.bairro} • {e.regiao} • {e.cidade}
                  </div>
                </div>
                <Badge variant={e.status === "lançamento" ? "success" : e.status === "venda" ? "warning" : "secondary"} className="text-[10px] capitalize">{e.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{e.construtora} <span className="text-slate-400">{e.instagram}</span></span>
                <span className="flex gap-1">{e.faixa.map(f => <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 rounded-xl p-2">
                <div><div className="font-extrabold">{e.unidades}</div><div className="text-slate-500 text-[11px]">unidades</div></div>
                <div><div className="font-extrabold">R${(e.ticketDesde/1000).toFixed(0)}k</div><div className="text-slate-500 text-[11px]">desde</div></div>
                <div><div className="font-extrabold">{e.tipologia.split("•")[0].trim()}</div><div className="text-slate-500 text-[11px]">tipologia</div></div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white border rounded-xl px-2.5 py-2">{e.destaque} • {e.entrega}</p>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Vendido</span>
                  <span className="font-semibold">{e.estoquePct}% • {e.leads} leads • {e.conversao}% conv.</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${e.cor}`} style={{ width: `${e.estoquePct}%` }} />
                </div>
              </div>

              <div className="flex gap-1.5">
                <Button size="sm" variant="accent" className="flex-1 text-xs"><Play className="h-3 w-3 mr-1" /> Ativar captação</Button>
                <Button size="sm" variant="outline" className="text-xs"><Filter className="h-3 w-3 mr-1" /> Filtro</Button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Zap className="h-3 w-3 text-teal-500" /> Harness: aba Sheets “{e.bairro}” • template WhatsApp {e.faixa[0]} • score mínimo 75
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 text-white overflow-hidden">
        <CardContent className="p-5 grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="text-sm font-bold flex items-center gap-2"><Zap className="h-4 w-4 text-teal-400" /> Como sistematizamos Goiânia (sem misturar)</div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Cada uma das 6 opções tem <b>pipeline independente no harness</b>: Instagram da construtora específica → filtro de bairro + Faixa → aba própria no Sheets (ex: “Goiá”, “Parque Amazônia”, “Gran Vitória”) → mensagem template com nome/bairro/preço exato → Docs dossiê. Leads não se misturam, corretor sabe exatamente qual empreendimento o lead quer.
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="accent" onClick={() => setActiveTab("prospectar")}>Ir para Prospector →</Button>
              <Button size="sm" variant="ghost" className="text-white border border-white/20" onClick={() => setActiveTab("harness")}>Ver harness p/ cada empreendimento</Button>
            </div>
          </div>
          <div className="bg-white text-slate-900 rounded-xl p-3">
            <div className="text-xs font-semibold">Pipeline Goiânia (6 paralelos)</div>
            <ol className="text-xs mt-2 space-y-1 list-decimal list-inside text-slate-600">
              <li>Apify Actor por empreendimento (directUrls específico)</li>
              <li>Filtro Faixa + bairro + intent “mcmv goiania”</li>
              <li>Enriquecimento + score</li>
              <li>Sheets aba “{`{bairro}` }” + Docs</li>
              <li>WhatsApp template Faixa 2/3/4 (até R$600k)</li>
            </ol>
          </div>
          <div className="bg-teal-600 rounded-xl p-3 text-white">
            <div className="text-xs font-semibold">Aparecida ≠ Goiânia</div>
            <p className="text-xs opacity-90 mt-1">Aparecida: Faixa 1 FAR, ticket R$185k, parcela R$750. Goiânia: Faixa 2-4, R$270-495k, pronto/lançamento. Tom da mensagem muda. Harness separa automaticamente.</p>
            <div className="mt-2 text-[11px] bg-white/20 rounded-full px-2 py-1 inline-flex">Faixa 4 (novo): até R$13k renda, R$600k imóvel — incluso</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Canais de captação por empreendimento (Goiânia)</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3 text-xs">
          <div className="border rounded-xl p-3 bg-white">
            <div className="font-semibold">FR Viva Goiá + 14 Bis (Noroeste/Sudoeste)</div>
            <div className="text-slate-500 mt-1">IG @frincorporadora + @planoeplanogo • FB grupos “MCMV Bairro Goiá” • Google Maps “imobiliária Goiá” • keyword “faixa 2 goiá”</div>
          </div>
          <div className="border rounded-xl p-3 bg-white">
            <div className="font-semibold">Parque Amazônia (Casamérica + Now Laguna)</div>
            <div className="text-slate-500 mt-1">IG @cmoconstrutora + @ebmgoiania • OLX “Parque Amazônia MCMV” • VivaReal favoritos • “parque amazonia 335 mil”</div>
          </div>
          <div className="border rounded-xl p-3 bg-teal-50 border-teal-200">
            <div className="font-semibold text-teal-800">Gran Vitória + Eldorado (Leste/Sudoeste)</div>
            <div className="text-slate-500 mt-1">IG @mrvmrv_goiania (388 aptos!) • comentários “Gran Paradiso valor?” → tel • Faixa 3/4 • investidor</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
