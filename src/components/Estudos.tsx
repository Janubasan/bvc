"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { FONTES_TECNICAS, CONSTRUTORAS_MCMV_GO } from "@/lib/data";
import { BookOpen, Github, Sparkles, TrendingUp, MapPin, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";

export function Estudos() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Sora" }}><BookOpen className="h-5 w-5 text-teal-600" /> Dossiê de Pesquisa — Estado da Arte Global Adaptado para MCMV GO</h2>
        <p className="text-sm text-slate-500">Síntese do que há de mais avançado em geração de leads no GitHub & Hugging Face + adaptação imobiliária para Goiânia/Aparecida.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Github className="h-4 w-4" /> Top repositórios & harness mundiais (o que usamos)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {FONTES_TECNICAS.map((f) => (
              <div key={f.nome} className="flex items-center justify-between p-2.5 rounded-xl border bg-white">
                <div>
                  <div className="text-sm font-semibold">{f.nome} <span className="text-xs text-slate-500">• {f.stars}★ • {f.licenca}</span></div>
                  <div className="text-xs text-slate-500">{f.uso}</div>
                </div>
                <Badge variant="secondary">adaptado</Badge>
              </div>
            ))}
            <div className="text-xs text-slate-500 p-2 bg-slate-50 rounded-xl border">
              <b>Também mapeados:</b> BrightData AI Lead Gen (scrape+OpenAI+Streamlit), SalesGPT 2.2k★ (agente voz/email), Clay 70+ providers, PhantomBuster 100+ Phantoms, n8n 160k★ AI-native, Langflow 140k★, Dify 120k★, RAGFlow 70k★.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-600" /> O que o Real Estate mundial está fazendo</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <b>Mercado Lead Gen Imobiliário:</b> USD 1.2B (2024) → USD 3.5B (2032), CAGR 14.3%. PropTech global $36.5B → $88.3B (2032).
            </div>
            <p><b>78% das corretoras top EUA</b> já usam IA: chatbots 33% mais leads, resposta em 3min (vs 47min manual) = 9x conversão. AVMs com erro 3% vs 15% manual.</p>
            <p><b>EliseAI:</b> -80% workload leasing, +125% conversão. <b>BoomTown/Zillow:</b> MLS + alertas automáticos + CMA. <b>72% donos</b> já investem em IA.</p>
            <p><b>Next 24m:</b> Generative AI para descrições/relatórios vira commodity. Agentes superam chatbots (tour virtual, qualificação, aplicação).</p>
            <p className="p-2 bg-amber-50 border border-amber-200 rounded-xl"><b>Gap:</b> só 6/25 líderes de proptech dizem que IA já muda lead gen — mas 44% acham que será a maior mudança nos próximos 12m. Oportunidade gigante.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-orange-600" /> MCMV em Goiânia & Aparecida — por que é a hora</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="space-y-2">
            <p><b>Explosão MCMV:</b> +83.4% vendas 1ºsem 2026 (2.944 unid.), lançamentos +77.1%. Goiânia vendeu 7.219 imóveis (+42% a/a, 8x média BR).</p>
            <p><b>Estoque em queda:</b> -33% em 6 meses. Aparecida tem só 475 unid. em estoque (4,6% RM). Urgência real.</p>
            <p><b>Perfil comprador Aparecida:</b> 70% MCMV, ticket R$258k avg, renda R$4.4-7k, parcela ~R$750-1.100 &lt; aluguel R$1.200.</p>
          </div>
          <div className="space-y-2">
            <p><b>768 Apês a Custo Zero:</b> Alto da Boa Vista I/II/III + Vila Romana. FAR + Agehab + Caixa. Sorteio fev/2026, entrega docs mar/2026, obras já iniciadas abr/2025 (R$153.7M).</p>
            <p><b>Faixas MCMV 2026:</b> F1 até R$2.850 (subsídio R$55k, juros 4%), F2 R$2.850-4.700 (4.75-7%), F3 R$4.700-8.000 (7.66-8.16%). Financiamento 35 anos, FGTS como entrada.</p>
            <p><b>Contratações:</b> Águas Lindas 25.1/mil hab. vs Goiânia só 224 unid. FAR — interior bombando. Foco no Entorno + Aparecida.</p>
          </div>
          <div className="space-y-2">
            <p><b>Fontes:</b> CBIC, Ministério das Cidades Portaria 725/23, Prefeitura Aparecida, Agehab, O Hoje, VC Inc, Revista Zelo.</p>
            <p className="p-2 bg-teal-50 border border-teal-200 rounded-xl"><b>Tese BVC:</b> “Trocar aluguel por parcela” é a mensagem #1. Alto da Boa Vista tem prova social (70% vendido) + urgência estoque + localização (Terminal Garavelo). Combine no harness.</p>
            <Button size="sm" variant="outline" className="w-full mt-1" onClick={()=>window.open("https://www.gov.br/cidades/pt-br/assuntos/noticias-1/aparecida-de-goiania-e-rio-verde-em-goias-receberao-1-232-novas-moradias-pelo-minha-casa-minha-vida","_blank")}>Ver portaria oficial →</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-900">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-600" /> Adequação BVC — o novo agente (não se prende ao existente, mas aprende com ele)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-50 border">
            <div className="font-bold">1. Captação híbrida (IG + Maps + Intent)</div>
            <p className="text-slate-600 mt-1">Mundo: Apify $1.50/1k, PhantomBuster, Scout SMTP. <b>BVC:</b> escolhe automaticamente Construtora → comentários → bio email/phone → Google Maps imobiliárias → FB grupos “MCMV Aparecida”. Tudo LGPD-first.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border">
            <div className="font-bold">2. Harness n8n auto-implementado</div>
            <p className="text-slate-600 mt-1">Mundo: n8n visual + 400 integrações. <b>BVC:</b> canvas próprio em Next.js, mas exportável para n8n JSON. Nodes: trigger, filtro Faixa, enriquecimento, agente LLM, Sheets, Docs, WhatsApp. Humano aprova antes de disparar.</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
            <div className="font-bold text-teal-800">3. Agêntico + entrega útil (Sheets/Docs)</div>
            <p className="text-teal-700 mt-1">Mundo: SalesGPT voz, CrewAI multi-agente. <b>BVC:</b> 4 agentes (Scout, Qualifier Qwen3-8B, Copywriter, Guardian). Entrega não é dashboard vazio: é planilha pronta + dossiê + mensagem personalizada que o corretor envia em 1 clique.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-amber-600" /> Riscos, limites e próximos passos</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Instagram pode bloquear sem proxy/delay — use Apify (oficial) ou Instaloader com rotação.</li>
            <li>Não compre lista; só prospecte quem demonstrou interesse público (comentário, avaliação, grupo).</li>
            <li>Faixa 1 é vulnerável: priorize canal Agehab/Prefeitura e indique corretor parceiro.</li>
            <li>WhatsApp Business API exige opt-in; alternativa: Evolution API self-host com consentimento.</li>
          </ul>
          <div className="space-y-2">
            <p><b>Roadmap 30 dias:</b> (1) conectar Apify + Google OAuth, (2) 3 construtoras piloto, (3) 100 leads teste, (4) ajustar templates Faixa, (5) medir resposta &gt;40%.</p>
            <p><b>Depois:</b> voz IA (Vapi/Retell), tour virtual, simulador Caixa embarcado, scoring preditivo 6-12m.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
