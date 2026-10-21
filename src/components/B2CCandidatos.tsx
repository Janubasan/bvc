"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users2, CheckCircle2, Clock3, ShieldX, Wallet, TrendingUp, Zap, Download, Copy, FileSpreadsheet, Search, Filter, Sparkles, Activity, ShieldCheck, CreditCard, Building2, FileText, ArrowUpRight, Eye } from "lucide-react";

const PRIMEIROS = ["Maria","João","Ana","Pedro","Carla","Lucas","Fernanda","Rafael","Juliana","Bruno","Patrícia","Diego","Camila","Thiago","Larissa","Marcelo","Aline","Rodrigo","Gabriela","Felipe","Letícia","André","Tatiane","Gustavo","Vanessa"];
const SOBRENOMES = ["Silva","Santos","Oliveira","Souza","Lima","Pereira","Costa","Ferreira","Almeida","Rodrigues","Gomes","Martins","Araújo","Barbosa","Ribeiro","Cardoso","Nascimento","Moreira","Carvalho","Rocha"];
const PROFISSOES: Record<string,string[]> = {
  "CLT": ["Vendedor(a)","Auxiliar Administrativo","Motorista","Professor(a)","Enfermeiro(a)","Técnico(a)","Operador(a) de Caixa"],
  "Autônomo": ["Motorista de App","Eletricista","Pedreiro","Cabeleireiro(a)","Pintor","Mecânico"],
  "MEI": ["Comerciante","Dono(a) de Salão","Prestador(a) de Serviço","Microempreendedor(a)"],
  "Servidor": ["Professor(a) Municipal","Aux. Enfermagem","Téc. Administrativo","Agente de Saúde"]
};
const DOMINIOS = ["gmail.com","outlook.com","hotmail.com","yahoo.com.br","icloud.com"];
const DOMINIOS_DISP = ["mailinator.com","tempmail.com"];
const DDDS_FORA = ["11","61","63","64","65","31"];

const rand = (a:any[])=> a[Math.floor(Math.random()*a.length)];
const randInt = (a:number,b:number)=> Math.floor(Math.random()*(b-a+1))+a;
const brl = (n:number)=> n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const slugNome = (nome:string)=> nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'.').slice(0,20);
const mockCPF = ()=>{ const n=Array.from({length:11},()=>randInt(0,9)); return `${n[0]}${n[1]}${n[2]}.${n[3]}${n[4]}${n[5]}.${n[6]}${n[7]}${n[8]}-${n[9]}${n[10]}`; };
const maskCPF = (cpf:string)=> cpf.slice(0,3)+'.***.***-'+cpf.slice(-2);
const rendaPonderada = ()=>{ const r=Math.random(); if(r<0.25) return Math.round(randInt(3000,4500)/50)*50; if(r<0.60) return Math.round(randInt(4500,6000)/50)*50; if(r<0.85) return Math.round(randInt(6000,8000)/50)*50; return Math.round(randInt(8000,10000)/50)*50; };
const creditScoreVal = ()=>{ const r=Math.random(); if(r<0.15) return randInt(280,399); if(r<0.55) return randInt(400,599); if(r<0.85) return randInt(600,799); return randInt(800,950); };
const faixaDe = (renda:number)=>{ if(renda>=3000 && renda<4700) return {label:'Faixa 2', cls:'bg-emerald-50 text-emerald-700 border-emerald-200', dot:'bg-emerald-500'}; if(renda>=4700 && renda<=8600) return {label:'Faixa 3', cls:'bg-sky-50 text-sky-700 border-sky-200', dot:'bg-sky-500'}; if(renda>8600 && renda<=10000) return {label:'Faixa 3+', cls:'bg-amber-50 text-amber-700 border-amber-200', dot:'bg-amber-500'}; return {label:'Fora MCMV', cls:'bg-slate-100 text-slate-600 border-slate-200', dot:'bg-slate-400'}; };

type B2CLead = { id:number; nome:string; cpf:string; idade:number; vinculo:string; profissao:string; renda:number; ddd:string; telefone:string; email:string; temImovel:boolean; credit:number; mxValid:boolean; disposable:boolean; status:'approved'|'human_review'|'blocked'; reason:string; score:number; avatar:string; };

function generateRawLead(uid:number): B2CLead{
  const nome = `${rand(PRIMEIROS)} ${rand(SOBRENOMES)} ${rand(SOBRENOMES)}`;
  const idade = randInt(20,55);
  const vinculo = rand(["CLT","CLT","CLT","Autônomo","MEI","Servidor"]);
  const profissao = rand(PROFISSOES[vinculo]);
  let renda = Math.random()<0.08 ? (Math.random()<0.5 ? randInt(1500,2999) : randInt(10001,15000)) : rendaPonderada();
  const ddd = Math.random()<0.82 ? "62" : rand(DDDS_FORA);
  const telefone = `(${ddd}) 9${randInt(1000,9999)}-${randInt(1000,9999)}`;
  const temImovel = Math.random()<0.07;
  const credit = creditScoreVal();
  const mxValid = Math.random()<0.87;
  const disposable = Math.random()<0.08;
  const domain = disposable ? rand(DOMINIOS_DISP) : rand(DOMINIOS);
  const email = `${slugNome(nome)}${randInt(1,999)}@${domain}`;
  const cpf = mockCPF();
  const avatar = nome.split(' ').map(n=>n[0]).slice(0,2).join('');
  return { id:uid, nome, cpf, idade, vinculo, profissao, renda, ddd, telefone, email, temImovel, credit, mxValid, disposable, status:'approved', reason:'', score:0, avatar };
}
function calcScore(l:B2CLead){ if(l.status==='blocked') return randInt(15,45); const credit=Math.min(100,l.credit/10); const vinculo=({Servidor:100,CLT:85,MEI:72,"Autônomo":68} as any)[l.vinculo]; const income=l.renda>=3000&&l.renda<=10000?100:40; const contact=(l.mxValid?50:0)+(l.ddd==='62'?50:0); return Math.round(credit*.35+vinculo*.20+income*.25+contact*.20); }
function finalizeLead(l:B2CLead){ if(l.renda<3000||l.renda>10000){ l.status='blocked'; l.reason=`renda ${brl(l.renda)} fora da faixa MCMV (3k–10k)`; } else if(l.temImovel){ l.status='blocked'; l.reason='já possui imóvel próprio — inelegível MCMV'; } else if(l.idade<18){ l.status='blocked'; l.reason='menor de idade'; } else if(!l.mxValid){ l.status='blocked'; l.reason='email MX inválido'; } else if(l.disposable){ l.status='blocked'; l.reason='email descartável'; } else if(l.ddd!=='62'){ l.status='human_review'; l.reason=`DDD ${l.ddd} fora de Goiânia (62)`; } else if(l.credit<400){ l.status='human_review'; l.reason=`score de crédito baixo (${l.credit})`; } else { l.status='approved'; l.reason=`apto MCMV ${faixaDe(l.renda).label} — renda ${brl(l.renda)}`; } l.score=calcScore(l); return l; }

export function B2CCandidatos(){
  const [leads,setLeads]=useState<B2CLead[]>(()=>{ let uid=0; return Array.from({length:6},()=>{ uid++; return finalizeLead(generateRawLead(uid)); }); });
  const [filter,setFilter]=useState<'all'|'approved'|'human_review'|'blocked'>('all');
  const [scanning,setScanning]=useState(false);
  const [cycle,setCycle]=useState(1);
  const [pulseStep,setPulseStep]=useState(6);
  const [log,setLog]=useState<{time:string,msg:string,type:string}[]>([
    {time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg:'Sistema pronto · Foco: pessoas físicas MCMV renda R$3k–R$10k', type:'info'},
    {time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg:'6 candidatos iniciais já carregados — planilha pronta para baixar', type:'success'},
  ]);
  const [toast,setToast]=useState<string|null>(null);
  const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(null),2500);};

  const stats = useMemo(()=>{
    const t=leads.length, aptos=leads.filter(l=>l.status==='approved'), r=leads.filter(l=>l.status==='human_review').length, b=leads.filter(l=>l.status==='blocked').length;
    const avg = aptos.length ? Math.round(aptos.reduce((s,l)=>s+l.renda,0)/aptos.length) : 0;
    return {t, aptos:aptos.length, r, b, avg};
  },[leads]);

  const filtered = leads.filter(l=> filter==='all' || l.status===filter);
  const addLog=(msg:string,type='info')=> setLog(prev=> [...prev.slice(-60), {time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg, type}]);

  useEffect(()=>{ if(!scanning) setPulseStep(6); },[scanning]);

  async function runScan(){
    if(scanning) return; setScanning(true); setPulseStep(0); addLog('Harness iniciado — buscando pessoas físicas DDD 62…','info'); await new Promise(r=>setTimeout(r,400)); setPulseStep(1);
    addLog('Extração: 5 perfis capturados (instagram + web + maps)','info'); await new Promise(r=>setTimeout(r,350)); setPulseStep(2);
    addLog('Enriquecimento: renda, vínculo, CPF e crédito (BrasilAPI + Serasa mock)','info'); await new Promise(r=>setTimeout(r,350)); setPulseStep(3);
    addLog('Jev Gate MCMV: validando renda, imóvel, idade e contato','info'); await new Promise(r=>setTimeout(r,350)); setPulseStep(4);
    const baseId = leads.length+1; const batch = Array.from({length:5},(_,i)=> finalizeLead(generateRawLead(baseId+i)));
    batch.forEach(l=>{ setLeads(prev=>[l, ...prev]); const icon=l.status==='approved'?'✓':l.status==='human_review'?'⚠':'✗'; addLog(`${icon} ${l.nome} — ${l.reason}`, l.status==='approved'?'success':l.status==='blocked'?'danger':'warn'); });
    await new Promise(r=>setTimeout(r,500)); setPulseStep(5);
    addLog(`Sincronizando candidatos aptos com CRM / Vitrine…`, 'info'); await new Promise(r=>setTimeout(r,300)); setPulseStep(6);
    addLog(`Varredura #${cycle} concluída — ${batch.filter(l=>l.status==='approved').length}/${batch.length} aptos para MCMV`,'success');
    setCycle(c=>c+1); setScanning(false);
  }
  function clearAll(){ setLeads([]); setLog([{time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg:'Base limpa. Pronto para nova varredura.', type:'info'}]); setPulseStep(0); }

  async function exportCSV(){ if(leads.length===0){addLog('Nada para exportar','warn');return;} const res=await fetch("/api/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({target:"b2c-csv",b2cLeads:leads})}); if(!res.ok){const j=await res.json();addLog(j.error,'danger');return;} const blob=await res.blob(); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`AvantoFind_MCMV_B2C_${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);addLog(`Exportados ${leads.length} candidatos para CSV (planilha)`,'success');showToast(`✓ CSV baixado: ${leads.length} linhas`); }
  async function exportTXT(){ if(leads.length===0){addLog('Nada para exportar','warn');return;} const res=await fetch("/api/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({target:"b2c-txt",b2cLeads:leads})}); const blob=await res.blob(); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`AvantoFind_MCMV_B2C_${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);addLog(`Exportados ${leads.length} para TXT`,'success');showToast(`✓ TXT baixado`); }
  async function copyTXT(){ const res=await fetch("/api/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({target:"b2c-txt",b2cLeads:filtered})}); const txt=await res.text(); await navigator.clipboard.writeText(txt); showToast(`✓ Copiado ${filtered.length} linhas (TXT)`); addLog(`Copiados ${filtered.length} candidatos para colar no Sheets`,'success'); }
  async function copyCSV(){ const res=await fetch("/api/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({target:"b2c-csv",b2cLeads:filtered})}); const txt=await res.text(); await navigator.clipboard.writeText(txt); showToast(`✓ CSV copiado: ${filtered.length} linhas`); }

  return (
    <div className="space-y-5 max-w-[1280px] mx-auto">
      {/* HERO TOPBAR LINDO - inspirado AvantoFind mas BVC */}
      <div className="rounded-[20px] bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800 p-[1px] shadow-xl">
        <div className="rounded-[19px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 md:p-7 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                <span className="font-black text-emerald-700 text-lg tracking-tight">AF</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-white font-extrabold text-[22px] tracking-tight" style={{fontFamily:'Sora,sans-serif'}}>AvantoFind</h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold bg-white text-emerald-700 px-3 py-1 rounded-full">↓ 64% custo/lead</span>
                </div>
                <p className="text-emerald-100/80 text-xs mt-1">Candidatos MCMV · Renda 3k–10k · <b className="text-white">Goiânia & Aparecida</b> · DDD 62</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-white text-xs font-semibold">Sistema ativo</span>
                <span className="text-emerald-200 text-xs">• {stats.t} candidatos</span>
              </div>
              <Button onClick={runScan} disabled={scanning} className="bg-white text-slate-900 hover:bg-emerald-50 font-bold shadow-lg rounded-full px-6">
                <Zap className="w-4 h-4 mr-2 text-emerald-600" /> {scanning ? 'Varrendo…' : 'Nova varredura'}
              </Button>
            </div>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-2 text-[11px]">
            <span className="bg-white/10 border border-white/15 text-white px-3 py-1.5 rounded-full backdrop-blur">✓ Renda validada 3k–10k</span>
            <span className="bg-white/10 border border-white/15 text-white px-3 py-1.5 rounded-full backdrop-blur">✓ Parcela 30% calculada</span>
            <span className="bg-white/10 border border-white/15 text-white px-3 py-1.5 rounded-full backdrop-blur">✓ Gates MCMV reais</span>
            <span className="bg-emerald-400 text-slate-900 font-bold px-3 py-1.5 rounded-full">Planilha pronta ↓</span>
          </div>
        </div>
      </div>

      {/* STATS CARDS LINDOS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {[
          {label:'Candidatos', value: stats.t, icon: Users2, color:'bg-slate-900', sub:'total na base', trend: `+${Math.max(0,stats.t-6)} hoje`},
          {label:'Aptos MCMV', value: stats.aptos, icon: CheckCircle2, color:'bg-emerald-600', sub:'prontos p/ crédito', trend: stats.aptos>0?`${Math.round(stats.aptos/stats.t*100)}% conversão`:''},
          {label:'Em revisão', value: stats.r, icon: Clock3, color:'bg-amber-500', sub:'DDD ou score', trend: stats.r>0?'humano decide':''},
          {label:'Bloqueados', value: stats.b, icon: ShieldX, color:'bg-red-500', sub:'fora MCMV', trend:''},
          {label:'Renda média (aptos)', value: brl(stats.avg), icon: Wallet, color:'bg-sky-600', sub:'dos aptos', trend:'Faixa 2-3', isCurrency:true},
        ].map(s=>(
          <div key={s.label} className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04] group-hover:opacity-[0.08] transition">
              <s.icon className="w-full h-full" />
            </div>
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white shadow-sm`}>
                <s.icon className="w-4 h-4" />
              </div>
              {s.trend && <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full">{s.trend}</span>}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-3">{s.label}</div>
            <div className="text-[22px] font-extrabold tracking-tight mt-1" style={{fontFamily:'Sora'}}>{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* PIPELINE LINDO */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Pipeline — Harness orquestra, Jev decide</h3>
          <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">{pulseStep}/6 ativo</span>
        </div>
        <div className="relative">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-700 ease-out" style={{width: `${(pulseStep/6)*100}%`}} />
          </div>
          <div className="grid grid-cols-6 gap-1 mt-3">
            {["Descoberta","Extração","Enriquecimento","Gates MCMV","Scoring","CRM"].map((s,i)=>(
              <div key={s} className={`text-center py-2 rounded-xl border text-[11px] font-semibold transition-all ${i < pulseStep ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : i===pulseStep ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <div className="hidden sm:block">{s}</div><div className="sm:hidden">{s.slice(0,4)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LEADS CARD LINDO */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center"><Building2 className="w-4 h-4 text-white" /></div>
              <div>
                <h2 className="font-extrabold text-[15px]" style={{fontFamily:'Sora'}}>Candidatos</h2>
                <p className="text-xs text-slate-500">{filtered.length} nesta visão · {leads.length} total</p>
              </div>
              <Badge variant="outline" className="bg-white">{filtered.length} linhas</Badge>
            </div>
            <div className="flex gap-1.5 ml-2 flex-wrap">
              {[
                {id:'all', label:`Todos ${stats.t}`},
                {id:'approved', label:`Aptos ${stats.aptos}`},
                {id:'human_review', label:`Revisão ${stats.r}`},
                {id:'blocked', label:`Bloqueados ${stats.b}`},
              ].map(c=>(
                <button key={c.id} onClick={()=>setFilter(c.id as any)} className={`text-xs font-bold px-3.5 py-2 rounded-full border transition ${filter===c.id ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{c.label}</button>
              ))}
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={clearAll}>Limpar</Button>
              <Button variant="outline" size="sm" className="rounded-full hidden sm:flex" onClick={copyCSV}><Copy className="w-3.5 h-3.5 mr-1.5" />Copiar CSV</Button>
              <Button variant="outline" size="sm" className="rounded-full hidden sm:flex" onClick={copyTXT}><FileText className="w-3.5 h-3.5 mr-1.5" />Copiar TXT</Button>
              <Button variant="outline" size="sm" className="rounded-full" onClick={exportTXT}><Download className="w-3.5 h-3.5 mr-1.5" />TXT</Button>
              <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow" onClick={exportCSV}><FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />Baixar CSV</Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b">
                <th className="text-left p-3.5 pl-5">Candidato</th>
                <th className="text-left p-3.5">Renda / Faixa MCMV</th>
                <th className="text-left p-3.5">Contato</th>
                <th className="text-center p-3.5">Score</th>
                <th className="text-left p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length===0 ? (
                <tr><td colSpan={5}><div className="p-12 text-center"><div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3"><Search className="w-5 h-5 text-slate-400" /></div><p className="text-sm font-semibold text-slate-600">Nenhum candidato nesta visão</p><p className="text-xs text-slate-400 mt-1">Rode uma nova varredura para começar</p><Button size="sm" className="mt-4 rounded-full bg-emerald-600" onClick={runScan}>▶ Nova varredura</Button></div></td></tr>
              ) : filtered.map(l=>{
                const f=faixaDe(l.renda); const parcela=Math.round(l.renda*0.30); const scoreColor = l.status==='blocked' ? 'text-red-600 bg-red-50 border-red-200' : l.score>=75 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200';
                return (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition group">
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-105 transition">{l.avatar}</div>
                        <div>
                          <div className="font-bold text-[13px] flex items-center gap-2">{l.nome} <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border">{maskCPF(l.cpf)}</span></div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5"><span className="w-1 h-1 bg-slate-300 rounded-full" />{l.idade} anos · {l.vinculo} · {l.profissao}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2"><span className="font-extrabold text-[14px]">{brl(l.renda)}</span> <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 ${f.cls}`}><span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />{f.label}</span></div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Wallet className="w-3 h-3" /> parcela até <b className="text-slate-900">{brl(parcela)}</b> <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">30%</span></div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-xs font-semibold flex items-center gap-1.5"><PhoneIcon /> {l.telefone}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[180px]">{l.email}</div>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border font-extrabold text-sm ${scoreColor}`}>{l.score}</div>
                    </td>
                    <td className="p-3.5 pr-5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-full border whitespace-nowrap ${l.status==='approved' ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : l.status==='human_review' ? 'bg-amber-400 text-slate-900 border-amber-400' : 'bg-white text-red-600 border-red-200'}`} title={l.reason}>
                        {l.status==='approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : l.status==='human_review' ? <Eye className="w-3.5 h-3.5" /> : <ShieldX className="w-3.5 h-3.5" />}
                        {l.status==='approved' ? 'Apto' : l.status==='human_review' ? 'Revisão' : 'Bloqueado'}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1 truncate max-w-[160px]">{l.reason}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center"><FileSpreadsheet className="w-4 h-4 text-white" /></div>
            <div>
              <div className="font-bold text-sm">Planilha pronta: {leads.length} linhas</div>
              <div className="text-xs text-slate-600">Nome, CPF, Idade, Vínculo, Profissão, Renda, Faixa, Parcela 30%, Telefone, Email, Score crédito, Status</div>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="rounded-full bg-white" onClick={copyCSV}><Copy className="w-3.5 h-3.5 mr-1" /> Copiar CSV</Button>
            <Button size="sm" variant="outline" className="rounded-full bg-white" onClick={copyTXT}><FileText className="w-3.5 h-3.5 mr-1" /> Copiar TXT</Button>
            <Button size="sm" className="rounded-full bg-slate-900 text-white" onClick={exportCSV}><Download className="w-3.5 h-3.5 mr-1" /> Baixar CSV</Button>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID LINDO */}
      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live log</h3>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">{log.length} eventos</span>
          </div>
          <div className="h-[260px] overflow-y-auto p-4 font-mono text-xs leading-7 bg-slate-950">
            {log.map((l,i)=>(
              <div key={i} className="flex gap-3 animate-[fadeIn_0.3s_ease]">
                <span className="text-slate-600 shrink-0">[{l.time}]</span>
                <span className={`${l.type==='success' ? 'text-emerald-400' : l.type==='danger' ? 'text-red-400' : l.type==='warn' ? 'text-amber-400' : 'text-slate-400'}`}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4"><Zap className="w-3.5 h-3.5 text-amber-500" /> Jev Router</h3>
            <div className="space-y-3">
              {[
                {k:'perfil social', v:'jev-max · R$0,18', color:'bg-violet-500'},
                {k:'web estática', v:'httpx · R$0,002', color:'bg-sky-500'},
                {k:'enriquec. CPF/renda', v:'brasilapi · R$0', color:'bg-emerald-500'},
              ].map(r=>(
                <div key={r.k} className="flex items-center justify-between py-2.5 border-b border-dashed border-slate-100 last:border-0">
                  <span className="font-mono text-xs text-slate-600">{r.k}</span>
                  <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${r.color}`}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Jev Gate · MCMV</h3>
            <div className="space-y-1">
              {[
                ['renda fora 3k–10k','BLOCK','danger'],
                ['já possui imóvel','BLOCK','danger'],
                ['idade < 18','BLOCK','danger'],
                ['MX inválido / descartável','BLOCK','danger'],
                ['DDD != 62','HUMAN','warn'],
                ['score crédito < 400','HUMAN','warn'],
              ].map(([k,v,c])=>(
                <div key={k} className="flex items-center justify-between py-2 border-b border-dashed border-slate-100 last:border-0">
                  <span className="font-mono text-xs text-slate-500">{k}</span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${c==='danger' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600">Scoring 280–950 · <b className="text-slate-900">Parcela 30% renda</b></span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-slate-400">AvantoFind MCMV B2C · <b className="text-slate-600">Harness orquestra, Jev decide</b> · Enriquecimento BrasilAPI · 8 prédios MRV · DDD 62 Goiânia/Aparecida</p>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" />{toast}</div>}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function PhoneIcon(){ return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
