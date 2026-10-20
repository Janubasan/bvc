"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useStore } from "@/lib/store";
import { WORKFLOW_NODES_MOCK } from "@/lib/data";
import { GitBranch, Play, Pause, Plus, Settings2, Sparkles, Clock, CheckCircle2, AlertTriangle, Copy, ExternalLink, Zap, Bot, Sheet, FileText, MessageSquare, Filter } from "lucide-react";

const iconMap: Record<string, any> = {
  trigger: Sparkles,
  filter: Filter,
  enrich: Zap,
  agent: Bot,
  action: {
    "Google Sheets": Sheet,
    "WhatsApp Mensagem": MessageSquare,
    "Google Docs Relatório": FileText,
  },
};

function NodeCard({ node }: { node: any }) {
  let Icon = Sparkles;
  if (node.type === "trigger") Icon = Sparkles;
  else if (node.type === "filter") Icon = Filter;
  else if (node.type === "enrich") Icon = Zap;
  else if (node.type === "agent") Icon = Bot;
  else if (node.type === "action") {
    const map = iconMap.action as any;
    Icon = map[node.label] || Settings2;
  }

  return (
    <div className="min-w-[210px] bg-white rounded-2xl border shadow-sm p-3 relative">
      <div className="flex items-start justify-between gap-2">
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-white shrink-0 ${node.status === "ativo" ? "bg-teal-600" : "bg-slate-300"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <Badge variant={node.status === "ativo" ? "success" : "secondary"} className="text-[10px]">{node.status}</Badge>
      </div>
      <div className="mt-2 text-sm font-semibold leading-tight">{node.label}</div>
      <div className="text-xs text-slate-500 leading-relaxed mt-1">{node.desc}</div>
      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
        <Clock className="h-3 w-3" /> {node.type === "trigger" ? "a cada 6h" : "on success → next"}
      </div>
      {/* connectors */}
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-3 w-3 bg-slate-300 rounded-full border-2 border-white hidden lg:block" />
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-3 w-3 bg-white border-2 border-slate-300 rounded-full hidden lg:block" />
    </div>
  );
}

export function Harness() {
  const { workflowRunning, setWorkflowRunning } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Sora" }}><GitBranch className="h-5 w-5 text-teal-600" /> Harness Agêntico — estilo n8n, auto-hospedado</h2>
          <p className="text-sm text-slate-500">Arraste nós, conecte gatilhos, defina regras de Faixa. Clone do n8n (160k★) + Apify + Google. 100% auditável.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={workflowRunning ? "secondary" : "accent"} onClick={() => setWorkflowRunning(!workflowRunning)}>
            {workflowRunning ? <><Pause className="h-4 w-4 mr-2" /> Pausar</> : <><Play className="h-4 w-4 mr-2" /> Ativar</>}
          </Button>
          <Button variant="outline"><Copy className="h-4 w-4 mr-2" /> Duplicar workflow</Button>
          <Button variant="ghost"><ExternalLink className="h-4 w-4 mr-2" /> Exportar JSON n8n</Button>
        </div>
      </div>

      {/* Canvas */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Workflow: MCMV Aparecida — Instagram → Sheets → WhatsApp
            <Badge variant="secondary" className="ml-2">v1.4 • 6.2k execuções/dia</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Adicionar nó</Button>
            <Button size="sm" variant="ghost"><Settings2 className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="canvas-grid p-6 overflow-x-auto">
            <div className="flex items-center gap-3 min-w-max py-4">
              {WORKFLOW_NODES_MOCK.map((n, idx) => (
                <div key={n.id} className="flex items-center gap-3">
                  <NodeCard node={n} />
                  {idx < WORKFLOW_NODES_MOCK.length - 1 && <div className="h-0.5 w-6 bg-slate-300 hidden lg:block" />}
                </div>
              ))}
              <div className="h-12 w-12 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 ml-2">
                <Plus className="h-5 w-5" />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-3 mt-6">
              <div className="bg-white rounded-xl border p-3">
                <div className="text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Última execução</div>
                <div className="text-xs text-slate-500 mt-1">Há 18 min • 38 leads capturados • 11 qualificados • 9 enviados ao Sheets</div>
                <div className="mt-2 text-xs font-mono bg-slate-900 text-emerald-300 p-2 rounded-lg">✓ Append Sheets: 9 rows em “Leads MCMV GO 2026” • 142ms</div>
              </div>
              <div className="bg-white rounded-xl border p-3">
                <div className="text-xs font-semibold flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-amber-500" /> Fila de aprovação humana</div>
                <div className="text-xs text-slate-500 mt-1">3 mensagens aguardando revisão (LGPD • tom agressivo detectado)</div>
                <Button size="sm" variant="outline" className="mt-2 w-full">Revisar fila →</Button>
              </div>
              <div className="bg-teal-600 rounded-xl p-3 text-white">
                <div className="text-xs font-semibold">Agente Qualificador (Qwen3-8B local)</div>
                <div className="text-xs opacity-90 mt-1">Pergunta: renda, FGTS, bairro, urgência. Se &gt;75 score, dispara WhatsApp humanizado (delay 2-5min).</div>
                <div className="mt-2 text-[11px] bg-white/20 rounded-full px-2 py-1 inline-flex">🧠 89% acurácia vs humano • custo R$0.003/lead</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Como montar seu primeiro workflow (3 minutos)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li><b>Trigger:</b> escolha Instagram (Apify) ou Cron “todo dia 08h” ou Webhook (lead do site).</li>
              <li><b>Filtro MCMV:</b> renda R$2.000–8.000 + cidade Goiânia/Aparecida + comentário com “valor, parcela, FGTS”.</li>
              <li><b>Enriquecimento:</b> extrai telefone/email da bio → valida SMTP (Scout) → score IA 0–100.</li>
              <li><b>Agente IA:</b> qualifica via WhatsApp (LLM local, LGPD) — sem disparar spam.</li>
              <li><b>Ação:</b> salva no Google Sheets + gera Docs para corretor + envia mensagem preparada.</li>
            </ol>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
              <b>LGPD:</b> só dados públicos + opt-in implícito (comentário público). Mensagem sempre com “responda SAIR para não receber”.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Nós disponíveis (inspirados no n8n 160k★ & CrewAI)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-xs">
            {[
              "Instagram Scraper (Apify)",
              "Google Maps Scraper",
              "HTTP Request (VivaReal)",
              "Filtro Faixa 1/2/3",
              "Enriquecer Email/Phone",
              "Agente Qualificador (LLM)",
              "Google Sheets Append",
              "Google Docs Create",
              "WhatsApp (Evolution API)",
              "Delay humanizado",
              "Aprovação humana",
              "Score & Roteamento",
            ].map((n) => (
              <div key={n} className="border rounded-xl px-3 py-2 bg-white flex items-center gap-2">
                <div className="h-2 w-2 bg-teal-500 rounded-full" /> {n}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
