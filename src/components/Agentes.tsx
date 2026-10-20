"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bot, ShieldCheck, Sparkles, Zap, MessageSquare, Eye, Activity, Cpu } from "lucide-react";

const AGENTES = [
  { nome: "Scout Collector", papel: "Coletor Instagram/Maps", modelo: "Instaloader + Scout CLI + Apify", status: "rodando", latencia: "1.2s / perfil", custo: "R$0,00 (local)", desc: "Varre 8 construtoras, extrai bio, comentários, email/phone público. Proxy + delay LGPD." },
  { nome: "Qualifier MCMV", papel: "Qualificação conversacional", modelo: "Qwen3-8B (HF) • 8B fine-tuned PT-BR", status: "rodando", latencia: "1.8s / pergunta", custo: "R$0,003 / lead", desc: "Pergunta renda, FGTS, bairro, urgência. Score 0-100. Detecta intent finança/moradia. 89% acurácia vs humano." },
  { nome: "Copywriter Faixa", papel: "Personalização de mensagem", modelo: "Gemini Flash + templates", status: "ativo", latencia: "900ms", custo: "R$0,001 / msg", desc: "Gera mensagem por Faixa (1/2/3) + bairro + prova social. Humaniza delay." },
  { nome: "Guardian LGPD", papel: "Auditoria & compliance", modelo: "Regras + LLM auditor", status: "ativo", latencia: "300ms", custo: "—", desc: "Bloqueia dado sensível, verifica opt-out, garante 'responda SAIR'. Log completo." },
];

export function Agentes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Sora" }}><Bot className="h-5 w-5 text-teal-600" /> Agentes de IA • Hugging Face + Local</h2>
        <p className="text-sm text-slate-500">Inspirado em CrewAI (multi-agente), SalesGPT (voz), OpenOutreach (3.3k★). Todos rodáveis localmente via Ollama/HF Inference.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {AGENTES.map((a) => (
          <Card key={a.nome} className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center"><Bot className="h-4 w-4" /></div>
                  <div>
                    <div className="text-sm font-semibold">{a.nome}</div>
                    <div className="text-xs text-slate-500">{a.papel}</div>
                  </div>
                </div>
                <Badge variant={a.status === "rodando" ? "success" : "secondary"}>{a.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">{a.desc}</p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="bg-slate-50 border px-2 py-1 rounded-full flex items-center gap-1"><Cpu className="h-3 w-3" /> {a.modelo}</span>
                <span className="bg-slate-50 border px-2 py-1 rounded-full flex items-center gap-1"><Activity className="h-3 w-3" /> {a.latencia}</span>
                <span className="bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded-full">{a.custo}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1"><Eye className="h-4 w-4 mr-1" /> Ver logs</Button>
                <Button size="sm" variant="ghost" className="flex-1">Configurar →</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-600" /> Por que Qwen3-8B + CrewAI para MCMV?</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-slate-50 border">
            <div className="font-semibold">Hugging Face OpenThinker-Agent-v1</div>
            <p className="text-xs text-slate-500 mt-1">Qwen3-8B fine-tuned para agent loops: tool-use, terminal, reasoning traces. Baixa falha de schema, roda no CPU via Ollama. Custo 30x menor que GPT-4.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border">
            <div className="font-semibold">CrewAI: agente-a-agente</div>
            <p className="text-xs text-slate-500 mt-1">Define papéis (Scout, Qualifier, Copywriter) + tasks. Orquestração humana-in-the-loop para aprovação antes de WhatsApp.</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
            <div className="font-semibold text-teal-800">Real Estate world: EliseAI, BoomTown</div>
            <p className="text-xs text-teal-700 mt-1">EliseAI reduz workload 80% com AI leasing. Nós fazemos igual para MCMV: 72% acurácia em predizer quem compra em 6-12 meses.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Ética & LGPD por design</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="space-y-2">
            <p><b>1. Só dado público:</b> bio, comentário público, link WhatsApp divulgado pelo próprio usuário. Nada de invasão de conta.</p>
            <p><b>2. Opt-out:</b> toda mensagem tem “Responda SAIR”. Guardian remove em 5s e registra.</p>
            <p><b>3. Transparência:</b> informe que é “assistente BVC” — não finja ser humano.</p>
          </div>
          <div className="space-y-2">
            <p><b>4. IG ToS:</b> use Apify (oficial) ou Instaloader com rate-limit + proxies residenciais. Evite instagrapi (private API frágil).</p>
            <p><b>5. Consentimento:</b> para MCMV Faixa 1 (vulneráveis), prefira canal institucional (Prefeitura/Agehab) + indicação.</p>
            <p><b>6. Auditoria:</b> todo disparo logado em Sheets com timestamp, origem e justificativa.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
