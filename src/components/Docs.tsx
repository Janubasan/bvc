"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileText, Sheet, Download, ExternalLink, CheckCircle, Clock, Copy, Sparkles } from "lucide-react";

export function Docs() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "Sora" }}>Entrega • Google Sheets & Docs</h2>
        <p className="text-sm text-slate-500">O harness escreve sozinho. Você só aprova. Tudo pronto para o corretor usar no celular.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sheet className="h-5 w-5 text-green-600" /> Google Sheets — Leads MCMV GO 2026</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border overflow-hidden">
              <div className="bg-green-600 text-white px-3 py-2 text-xs font-semibold flex items-center justify-between">
                <span>Leads MCMV GO 2026 • 1.847 linhas • atualizado há 2 min</span>
                <ExternalLink className="h-4 w-4" />
              </div>
              <div className="p-0 overflow-auto max-h-[220px] text-xs">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr><th className="p-2 text-left">Nome</th><th className="p-2">Tel</th><th className="p-2">Bairro</th><th className="p-2">Faixa</th><th className="p-2">Score</th><th className="p-2">Status</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      ["Ana Paula Souza", "62 99123-4567", "Alto Boa Vista", "Faixa 2", "92", "qualificado"],
                      ["Carlos Lima", "62 99234-5678", "Vila Romana", "Faixa 1", "87", "novo"],
                      ["Juliana Martins", "62 99345-6789", "Garavelo", "Faixa 2", "78", "contatado"],
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50"><td className="p-2 font-medium">{r[0]}</td><td className="p-2">{r[1]}</td><td className="p-2">{r[2]}</td><td className="p-2">{r[3]}</td><td className="p-2">{r[4]}</td><td className="p-2"><Badge variant="secondary">{r[5]}</Badge></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border rounded-xl p-2.5 bg-white">
                <div className="font-semibold">Abas automáticas</div>
                <div className="text-slate-500">Goiânia / Aparecida / Faixa 1 / Faixa 2-3 / Descartados</div>
              </div>
              <div className="border rounded-xl p-2.5 bg-white">
                <div className="font-semibold">Deduplicação</div>
                <div className="text-slate-500">Por telefone + Instagram • mantém maior score</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700"><ExternalLink className="h-4 w-4 mr-2" /> Abrir no Google Sheets</Button>
              <Button size="sm" variant="outline"><Copy className="h-4 w-4 mr-1" /> Copiar template</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /> Google Docs — Dossiê do Corretor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border overflow-hidden bg-white">
              <div className="bg-blue-600 text-white px-3 py-2 text-xs font-semibold">Dossiê • Ana Paula Souza • Alto da Boa Vista • 19/10/2026</div>
              <div className="p-4 space-y-2 text-xs leading-relaxed">
                <div><b>Perfil:</b> Faixa 2, renda R$3.800, FGTS liberado, quer parcela &lt; R$1.000. Comentou “valores?” no MRV.</div>
                <div><b>Oferta:</b> Vega Aparecida • 2q 44m² c/ varanda • R$258k • subsídio R$12k • parcela R$890 (Caixa 30a, 5.5%).</div>
                <div><b>Mapa:</b> 3 min do Terminal Garavelo, escola + UBS a 400m.</div>
                <div><b>Roteiro de ligação (45s):</b> “Oi Ana, aqui é do BVC — vi seu interesse no Alto da Boa Vista. Separei 2 unidades com parcela menor que aluguel. Tem 2 min?”</div>
                <div className="flex gap-2 pt-1"><Badge variant="success">Pronto para visita</Badge><Badge variant="outline">LGPD ok</Badge></div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700"><FileText className="h-4 w-4 mr-2" /> Gerar Docs</Button>
              <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" /> PDF</Button>
            </div>
            <div className="text-xs text-slate-500">Gerado automaticamente quando lead ≥85 score. 1 doc por lead, salvo na pasta Drive “BVC • Aparecida”.</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 text-white">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-400" /> Como conectar seu Google (1 clique)</div>
            <div className="text-sm text-slate-300 mt-1">OAuth Google Workspace → autoriza Sheets + Docs + Drive. Sem senha. Revogável a qualquer momento.</div>
          </div>
          <Button variant="accent">Conectar Google Workspace →</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Checklist de entrega diária (automática)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /><div><b>Planilha atualizada até 18h</b><div className="text-xs text-slate-500">Disparo no seu e-mail + WhatsApp</div></div></div>
          <div className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /><div><b>Docs dos top 10 leads</b><div className="text-xs text-slate-500">Pronto para imprimir/levar ao plantão</div></div></div>
          <div className="flex gap-2"><Clock className="h-5 w-5 text-amber-500 shrink-0" /><div><b>Fila de aprovação</b><div className="text-xs text-slate-500">3 mensagens aguardando seu “OK”</div></div></div>
        </CardContent>
      </Card>
    </div>
  );
}
