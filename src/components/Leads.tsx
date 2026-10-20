"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Phone, Mail, Instagram, MapPin, Search, Download, Filter, MoreHorizontal, MessageSquare, Star, ExternalLink, CheckCircle, Clock, Sheet } from "lucide-react";
import { useState } from "react";

export function Leads() {
  const { leads, updateLeadStatus, setSelectedLead } = useStore();
  const [filter, setFilter] = useState<string>("todos");

  const filtered = leads.filter(l => filter==="todos" ? true : l.status===filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Sora" }}>Leads & CRM • {leads.length} contatos</h2>
          <p className="text-sm text-slate-500">Tudo sincronizado com Google Sheets “Leads MCMV GO 2026” • atualização em tempo real</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input placeholder="Buscar por nome, bairro, origem..." className="h-9 pl-9 pr-3 rounded-xl border bg-white text-sm w-[240px]" />
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Exportar Sheets</Button>
          <Button variant="accent" onClick={()=>window.open("https://docs.google.com/spreadsheets", "_blank")}><Sheet className="h-4 w-4 mr-2" /> Abrir Sheets</Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: "todos", label: "Todos", count: leads.length },
          { id: "novo", label: "Novos", count: leads.filter(l=>l.status==="novo").length },
          { id: "qualificado", label: "Qualificados", count: leads.filter(l=>l.status==="qualificado").length },
          { id: "contatado", label: "Contatados", count: leads.filter(l=>l.status==="contatado").length },
          { id: "agendado", label: "Agendados", count: leads.filter(l=>l.status==="agendado").length },
        ].map(f => (
          <button key={f.id} onClick={()=>setFilter(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${filter===f.id ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}>
            {f.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${filter===f.id ? "bg-white text-slate-900" : "bg-slate-100"}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left p-3 font-medium">Lead</th>
                <th className="text-left p-3 font-medium">Origem & Score</th>
                <th className="text-left p-3 font-medium">Faixa • Renda</th>
                <th className="text-left p-3 font-medium">Bairro / Cidade</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">{l.avatar}</div>
                      <div>
                        <div className="font-semibold leading-none">{l.nome}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {l.telefone}</span>
                          {l.instagram && <span className="flex items-center gap-1"><Instagram className="h-3 w-3" /> {l.instagram}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="capitalize">{l.origem.replace("_"," ")}</Badge>
                    <div className="flex items-center gap-1 mt-1 text-xs font-semibold">
                      <Star className={`h-3 w-3 ${l.score>80 ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} /> Score {l.score}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[180px]">{l.intentSignals[0]}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{l.faixa}</div>
                    <div className="text-xs text-slate-500">{formatCurrency(l.rendaEstimada)} / mês</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 font-medium"><MapPin className="h-3 w-3" /> {l.bairroInteresse}</div>
                    <div className="text-xs text-slate-500">{l.cidade}</div>
                  </td>
                  <td className="p-3">
                    <select value={l.status} onChange={(e)=>updateLeadStatus(l.id, e.target.value as any)} className="text-xs border rounded-full px-2 py-1 bg-white">
                      <option value="novo">novo</option>
                      <option value="qualificado">qualificado</option>
                      <option value="contatado">contatado</option>
                      <option value="agendado">agendado</option>
                      <option value="convertido">convertido</option>
                      <option value="descartado">descartado</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={()=>setSelectedLead(l)}><MessageSquare className="h-3 w-3 mr-1" /> Mensagem</Button>
                      <Button size="sm" variant="ghost"><ExternalLink className="h-3 w-3" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4 text-xs">
        <Card className="p-4 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /><div><div className="font-semibold">Entrega Google Sheets</div><div className="text-slate-500">Append automático • deduplicação por telefone • abas por cidade</div></div></Card>
        <Card className="p-4 flex items-center gap-3"><Clock className="h-5 w-5 text-teal-600" /><div><div className="font-semibold">Tempo de resposta 3min</div><div className="text-slate-500">vs 47min manual • 9x mais conversão com resposta em 5min</div></div></Card>
        <Card className="p-4 flex items-center gap-3"><Sheet className="h-5 w-5 text-green-600" /><div><div className="font-semibold">Google Docs dossiê corretor</div><div className="text-slate-500">Gera 1 doc por lead com roteiro de ligação + mapa + simulação</div></div></Card>
      </div>
    </div>
  );
}
