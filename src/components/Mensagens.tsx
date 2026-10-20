"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MENSAGENS_TEMPLATE } from "@/lib/data";
import { MessageSquare, Copy, Send, Sparkles, Edit3, Clock, TrendingUp, Check } from "lucide-react";
import { useState } from "react";

export function Mensagens() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState(MENSAGENS_TEMPLATE[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Sora" }}>Mensagens Preparadas • MCMV</h2>
          <p className="text-sm text-slate-500">Templates por Faixa, objeção e gatilho. Personalização via variáveis + IA. Aprovação humana antes de disparar.</p>
        </div>
        <Button variant="accent"><Sparkles className="h-4 w-4 mr-2" /> Gerar nova com IA</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Biblioteca (12 templates)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MENSAGENS_TEMPLATE.map((m) => (
              <button key={m.id} onClick={() => setSelected(m)} className={`w-full text-left p-3 rounded-xl border ${selected.id === m.id ? "bg-teal-50 border-teal-300" : "bg-white hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold leading-tight">{m.nome}</span>
                  <Badge variant="secondary" className="text-[11px]">{m.canal}</Badge>
                </div>
                <div className="text-xs text-slate-500 mt-1">Gatilho: {m.gatilho}</div>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium"><TrendingUp className="h-3 w-3" /> {m.taxaResposta}</span>
                  <span className="text-slate-400">{m.uso} envios</span>
                </div>
              </button>
            ))}
            <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
              <b>Dica:</b> mensagens com nome + bairro + valor exato têm 68% resposta vs 22% genéricas. Use sempre {"{{nome}}"} e {"{{bairro}}"}.
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-teal-600" /> {selected.nome}</CardTitle>
            <Badge variant="success">Aprovado LGPD</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Delay humanizado: 2-5 min • Envio via Evolution API</span>
                <Badge variant="outline">{selected.canal}</Badge>
              </div>
              <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm border relative max-w-[85%]">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{selected.texto}</div>
                <div className="text-[11px] text-slate-400 mt-2">14:42 ✓✓</div>
                {/* bubble tail */}
                <div className="absolute -right-1 top-4 h-3 w-3 bg-white border-r border-t rotate-45" />
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Variáveis: <code className="bg-white border px-1 rounded">{"{{nome}}"}</code> <code className="bg-white border px-1 rounded">{"{{bairro}}"}</code> <code className="bg-white border px-1 rounded">{"{{renda}}"}</code> <code className="bg-white border px-1 rounded">{"{{faixa}}"}</code> <code className="bg-white border px-1 rounded">{"{{empreendimento}}"}</code>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { navigator.clipboard.writeText(selected.texto); setCopied(selected.id); setTimeout(()=>setCopied(null), 2000); }} variant="outline">
                {copied === selected.id ? <><Check className="h-4 w-4 mr-1 text-emerald-600" /> Copiado!</> : <><Copy className="h-4 w-4 mr-1" /> Copiar</>}
              </Button>
              <Button size="sm" variant="secondary"><Edit3 className="h-4 w-4 mr-1" /> Editar</Button>
              <Button size="sm" variant="accent"><Send className="h-4 w-4 mr-1" /> Enviar teste p/ meu WhatsApp</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white border rounded-xl p-3">
                <div className="font-semibold">Faixa 1 (até R$2.850)</div>
                <div className="text-slate-500 mt-1">Tom: acolhedor, explica subsídio até R$55k + “custo zero”. Evita jargão.</div>
              </div>
              <div className="bg-white border rounded-xl p-3">
                <div className="font-semibold">Faixa 2 (R$2.850-4.700)</div>
                <div className="text-slate-500 mt-1">Tom: parcela vs aluguel, FGTS entrada, juros 4,75-7%. Prova social.</div>
              </div>
              <div className="bg-white border rounded-xl p-3">
                <div className="font-semibold">Faixa 3 (R$4.700-8.000)</div>
                <div className="text-slate-500 mt-1">Tom: investimento, valorização Goiânia 12% a/a, juros 7,66% ainda abaixo mercado.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm">
            <div className="font-semibold">Próximo passo: construir mensagens com a equipe</div>
            <div className="text-xs text-slate-500">Deixe as mensagens em rascunho — o harness só dispara após sua aprovação (fila humana).</div>
          </div>
          <Button variant="outline">Criar pasta “Campanha Alto da Boa Vista”</Button>
        </CardContent>
      </Card>
    </div>
  );
}
