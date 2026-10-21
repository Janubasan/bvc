"use client";
import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// B2C - Pessoas físicas MCMV renda 3k-10k - baseado no HTML AvantoFind lindo fornecido
// Mantém todos motores validadores existentes, apenas nova view focada em CPF/renda/parcela

const PRIMEIROS = ["Maria","João","Ana","Pedro","Carla","Lucas","Fernanda","Rafael","Juliana","Bruno","Patrícia","Diego","Camila","Thiago","Larissa","Marcelo","Aline","Rodrigo","Gabriela","Felipe","Letícia","André","Tatiane","Gustavo","Vanessa"];
const SOBRENOMES = ["Silva","Santos","Oliveira","Souza","Lima","Pereira","Costa","Ferreira","Almeida","Rodrigues","Gomes","Martins","Araújo","Barbosa","Ribeiro","Cardoso","Nascimento","Moreira","Carvalho","Rocha"];
const PROFISSOES: Record<string,string[]> = {
  "CLT": ["Vendedor(a)","Auxiliar Administrativo","Motorista","Professor(a)","Enfermeiro(a)","Técnico(a)","Operador(a) de Caixa","Recepcionista"],
  "Autônomo": ["Motorista de App","Eletricista","Pedreiro","Cabeleireiro(a)","Manicure","Pintor"],
  "MEI": ["Comerciante","Dono(a) de Salão","Prestador(a) de Serviço","Microempreendedor(a)"],
  "Servidor": ["Professor(a) Municipal","Aux. Enfermagem","Téc. Administrativo","Agente de Saúde"]
};
const DOMINIOS = ["gmail.com","outlook.com","hotmail.com","yahoo.com.br","icloud.com"];
const DOMINIOS_DISP = ["mailinator.com","tempmail.com","10minutemail.com"];
const DDDS_FORA = ["11","61","63","64","65","31"];

const rand = (a:any[])=> a[Math.floor(Math.random()*a.length)];
const randInt = (a:number,b:number)=> Math.floor(Math.random()*(b-a+1))+a;
const brl = (n:number)=> n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});

function slugNome(nome:string){ return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'.').slice(0,20); }
function mockCPF(){ const n=Array.from({length:11},()=>randInt(0,9)); return `${n[0]}${n[1]}${n[2]}.${n[3]}${n[4]}${n[5]}.${n[6]}${n[7]}${n[8]}-${n[9]}${n[10]}`; }
function maskCPF(cpf:string){ return cpf.slice(0,3)+'.***.***-'+cpf.slice(-2); }
function rendaPonderada(){
  const r=Math.random();
  if(r<0.25) return Math.round(randInt(3000,4500)/50)*50;
  if(r<0.60) return Math.round(randInt(4500,6000)/50)*50;
  if(r<0.85) return Math.round(randInt(6000,8000)/50)*50;
  return Math.round(randInt(8000,10000)/50)*50;
}
function creditScore(){
  const r=Math.random();
  if(r<0.15) return randInt(280,399);
  if(r<0.55) return randInt(400,599);
  if(r<0.85) return randInt(600,799);
  return randInt(800,950);
}
function faixaDe(renda:number){
  if(renda>=3000 && renda<4700) return {label:'Faixa 2', cls:'bg-emerald-50 text-emerald-700 border-emerald-200'};
  if(renda>=4700 && renda<=8600) return {label:'Faixa 3', cls:'bg-sky-50 text-sky-700 border-sky-200'};
  if(renda>8600 && renda<=10000) return {label:'Faixa 3+', cls:'bg-amber-50 text-amber-700 border-amber-200'};
  return {label:'Fora MCMV', cls:'bg-slate-100 text-slate-600'};
}

type B2CLead = {
  id:number; nome:string; cpf:string; idade:number; vinculo:string; profissao:string;
  renda:number; ddd:string; telefone:string; email:string; temImovel:boolean; credit:number;
  mxValid:boolean; disposable:boolean; status:'approved'|'human_review'|'blocked'; reason:string; score:number;
};

function generateRawLead(uid:number): B2CLead{
  const nome = `${rand(PRIMEIROS)} ${rand(SOBRENOMES)} ${rand(SOBRENOMES)}`;
  const idade = randInt(20,55);
  const vinculo = rand(["CLT","CLT","CLT","Autônomo","MEI","Servidor"]);
  const profissao = rand(PROFISSOES[vinculo]);
  let renda = Math.random()<0.08 ? (Math.random()<0.5 ? randInt(1500,2999) : randInt(10001,15000)) : rendaPonderada();
  const ddd = Math.random()<0.82 ? "62" : rand(DDDS_FORA);
  const telefone = `(${ddd}) 9${randInt(1000,9999)}-${randInt(1000,9999)}`;
  const temImovel = Math.random()<0.07;
  const credit = creditScore();
  const mxValid = Math.random()<0.87;
  const disposable = Math.random()<0.08;
  const domain = disposable ? rand(DOMINIOS_DISP) : rand(DOMINIOS);
  const email = `${slugNome(nome)}${randInt(1,999)}@${domain}`;
  const cpf = mockCPF();
  return { id:uid, nome, cpf, idade, vinculo, profissao, renda, ddd, telefone, email, temImovel, credit, mxValid, disposable, status:'approved', reason:'', score:0 };
}
function calcScore(l:B2CLead){
  if(l.status==='blocked') return randInt(15,45);
  const credit = Math.min(100,l.credit/10);
  const vinculo = ({Servidor:100,CLT:85,MEI:72,"Autônomo":68} as any)[l.vinculo];
  const income = l.renda>=3000 && l.renda<=10000 ? 100:40;
  const contact = (l.mxValid?50:0)+(l.ddd==='62'?50:0);
  return Math.round(credit*.35 + vinculo*.20 + income*.25 + contact*.20);
}
function finalizeLead(l:B2CLead){
  if(l.renda<3000 || l.renda>10000){ l.status='blocked'; l.reason=`renda ${brl(l.renda)} fora da faixa MCMV (3k–10k)`; }
  else if(l.temImovel){ l.status='blocked'; l.reason='já possui imóvel próprio — inelegível MCMV'; }
  else if(l.idade<18){ l.status='blocked'; l.reason='menor de idade'; }
  else if(!l.mxValid){ l.status='blocked'; l.reason='email MX inválido'; }
  else if(l.disposable){ l.status='blocked'; l.reason='email descartável'; }
  else if(l.ddd!=='62'){ l.status='human_review'; l.reason=`DDD ${l.ddd} fora de Goiânia (62)`; }
  else if(l.credit<400){ l.status='human_review'; l.reason=`score de crédito baixo (${l.credit})`; }
  else { l.status='approved'; l.reason=`apto MCMV ${faixaDe(l.renda).label} — renda ${brl(l.renda)}`; }
  l.score = calcScore(l);
  return l;
}

export function B2CCandidatos(){
  const [leads,setLeads]=useState<B2CLead[]>(()=>{
    // inicial: 6 já rodados para planilha pronta
    let uid=0; return Array.from({length:6},()=>{ uid++; return finalizeLead(generateRawLead(uid)); });
  });
  const [filter,setFilter]=useState<'all'|'approved'|'human_review'|'blocked'>('all');
  const [scanning,setScanning]=useState(false);
  const [cycle,setCycle]=useState(1);
  const [log,setLog]=useState<{time:string,msg:string,type:string}[]>([
    {time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg:'Sistema pronto · Foco: pessoas físicas MCMV renda R$3k–R$10k', type:'info'},
    {time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg:'6 candidatos iniciais já carregados — planilha pronta para baixar', type:'success'},
  ]);
  const [toast,setToast]=useState<string|null>(null);
  const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(null),2000);};

  const stats = useMemo(()=>{
    const t=leads.length, aptos=leads.filter(l=>l.status==='approved'), r=leads.filter(l=>l.status==='human_review').length, b=leads.filter(l=>l.status==='blocked').length;
    const avg = aptos.length ? Math.round(aptos.reduce((s,l)=>s+l.renda,0)/aptos.length) : 0;
    return {t, aptos:aptos.length, r, b, avg};
  },[leads]);

  const filtered = leads.filter(l=> filter==='all' || l.status===filter);

  const addLog=(msg:string,type='info')=>{
    setLog(prev=> [...prev.slice(-80), {time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg, type}]);
  };

  async function runScan(){
    if(scanning) return;
    setScanning(true); addLog('Harness iniciado — buscando pessoas físicas DDD 62…','info');
    await new Promise(r=>setTimeout(r,300));
    addLog('Extração: 5 perfis capturados (instagram + web + maps)','info');
    await new Promise(r=>setTimeout(r,350));
    addLog('Enriquecimento: renda, vínculo, CPF e crédito (BrasilAPI + Serasa mock)','info');
    await new Promise(r=>setTimeout(r,300));
    addLog('Jev Gate MCMV: validando renda, imóvel, idade e contato','info'); await new Promise(r=>setTimeout(r,300));
    
    const baseId = leads.length+1;
    const batch = Array.from({length:5},(_,i)=> finalizeLead(generateRawLead(baseId+i)));
    batch.forEach(l=>{
      setLeads(prev=>[l, ...prev]);
      const icon = l.status==='approved' ? '✓' : l.status==='human_review' ? '⚠' : '✗';
      addLog(`${icon} ${l.nome} — ${l.reason}`, l.status==='approved' ? 'success' : l.status==='blocked' ? 'danger' : 'warn');
    });
    await new Promise(r=>setTimeout(r,400));
    addLog(`Varredura #${cycle} concluída — ${batch.filter(l=>l.status==='approved').length}/${batch.length} aptos para MCMV`,'success');
    setCycle(c=>c+1);
    setScanning(false);
  }

  function clearAll(){
    setLeads([]); setLog([{time:new Date().toLocaleTimeString('pt-BR',{hour12:false}), msg:'Base limpa. Pronto para nova varredura.', type:'info'}]);
  }

  // Exporters B2C - usam API corrigida b2c-csv / b2c-txt
  async function exportCSV(){
    if(leads.length===0) { addLog('Nada para exportar ainda.','warn'); return; }
    const res = await fetch("/api/export",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({target:"b2c-csv", b2cLeads: leads})});
    if(!res.ok){ const j=await res.json(); addLog(j.error,'danger'); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`AvantoFind_MCMV_B2C_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    addLog(`Exportados ${leads.length} candidatos para CSV (planilha)`, 'success');
    showToast(`CSV baixado: ${leads.length} linhas`);
  }

  async function exportTXT(){
    if(leads.length===0) { addLog('Nada para exportar ainda.','warn'); return; }
    const res = await fetch("/api/export",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({target:"b2c-txt", b2cLeads: leads})});
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`AvantoFind_MCMV_B2C_${new Date().toISOString().slice(0,10)}.txt`; a.click();
    URL.revokeObjectURL(url);
    addLog(`Exportados ${leads.length} candidatos para TXT (tab-separated)`, 'success');
    showToast(`TXT baixado: ${leads.length} linhas`);
  }

  async function copyTXT(){
    const res = await fetch("/api/export",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({target:"b2c-txt", b2cLeads: filtered})});
    const txt = await res.text();
    await navigator.clipboard.writeText(txt);
    showToast(`Copiado ${filtered.length} linhas para área de transferência`);
    addLog(`Copiados ${filtered.length} candidatos (filtro: ${filter}) para colar no Sheets`, 'success');
  }

  async function copyCSV(){
    const res = await fetch("/api/export",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({target:"b2c-csv", b2cLeads: filtered})});
    const txt = await res.text();
    await navigator.clipboard.writeText(txt);
    showToast(`CSV copiado: ${filtered.length} linhas`);
  }

  const pipeline = cycle>1 ? 6 : leads.length>0 ? 6 : 0;

  return (
    <div className="max-w-[1220px] mx-auto space-y-4" style={{fontFamily:'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif'}}>
      {/* TOP STATS - B2C lindo */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white border rounded-[14px] p-4 shadow-sm"><div className="text-xs text-slate-500 font-medium">Candidatos</div><div className="text-2xl font-bold tracking-tight mt-1">{stats.t}</div></div>
        <div className="bg-white border rounded-[14px] p-4 shadow-sm"><div className="text-xs text-slate-500 font-medium">Aptos MCMV</div><div className="text-2xl font-bold tracking-tight mt-1 text-emerald-600">{stats.aptos}</div></div>
        <div className="bg-white border rounded-[14px] p-4 shadow-sm"><div className="text-xs text-slate-500 font-medium">Em revisão</div><div className="text-2xl font-bold tracking-tight mt-1 text-amber-600">{stats.r}</div></div>
        <div className="bg-white border rounded-[14px] p-4 shadow-sm"><div className="text-xs text-slate-500 font-medium">Bloqueados</div><div className="text-2xl font-bold tracking-tight mt-1 text-red-600">{stats.b}</div></div>
        <div className="bg-white border rounded-[14px] p-4 shadow-sm"><div className="text-xs text-slate-500 font-medium">Renda média (aptos)</div><div className="text-2xl font-bold tracking-tight mt-1 text-blue-600">{brl(stats.avg)}</div></div>
      </div>

      {/* PIPELINE */}
      <div className="bg-white border rounded-[14px] p-5 shadow-sm">
        <div className="h-[5px] bg-slate-100 rounded-full overflow-hidden mb-3"><div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{width: `${pipeline/6*100}%`}} /></div>
        <div className="flex justify-between gap-1">
          {["Descoberta","Extração de perfil","Enriquecimento","Gates MCMV","Scoring de crédito","CRM"].map((s,i)=>(
            <span key={s} className={`text-[11px] text-center flex-1 ${i<pipeline ? 'text-emerald-600 font-bold' : i===pipeline ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{s}</span>
          ))}
        </div>
      </div>

      {/* LEADS CARD - B2C */}
      <div className="bg-white border rounded-[14px] p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="font-bold text-[15px] flex items-center gap-2">Candidatos <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border">{filtered.length}</span></div>
          <div className="flex gap-1.5 flex-wrap">
            {[
              {id:'all', label:'Todos'},
              {id:'approved', label:'Aptos'},
              {id:'human_review', label:'Revisão'},
              {id:'blocked', label:'Bloqueados'},
            ].map(c=>(
              <button key={c.id} onClick={()=>setFilter(c.id as any)} className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${filter===c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{c.label}</button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll}>Limpar</Button>
            <Button variant="outline" size="sm" onClick={copyCSV}>Copiar CSV</Button>
            <Button variant="outline" size="sm" onClick={copyTXT}>Copiar TXT</Button>
            <Button variant="outline" size="sm" onClick={exportTXT}>Baixar TXT</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={exportCSV}>Exportar CSV</Button>
            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" onClick={runScan} disabled={scanning}>{scanning ? 'Varrendo…' : '▶ Nova varredura'}</Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[10px] border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left p-3">Candidato</th>
                <th className="text-left p-3">Renda / Faixa MCMV</th>
                <th className="text-left p-3">Contato</th>
                <th className="text-left p-3">Score</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={5}><div className="p-8 text-center text-slate-500 text-sm">Nenhum candidato nesta visão. Rode uma varredura para começar.</div></td></tr>
              ) : filtered.map(l=>{
                const f=faixaDe(l.renda); const parcela=Math.round(l.renda*0.30); const scoreCls = l.status==='blocked' ? 'text-red-600' : l.score>=75 ? 'text-emerald-600' : 'text-amber-600';
                return (
                  <tr key={l.id} className="hover:bg-slate-50 border-t">
                    <td className="p-3">
                      <div className="font-semibold flex items-center gap-2 flex-wrap">{l.nome} <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border font-mono">{maskCPF(l.cpf)}</span></div>
                      <div className="text-xs text-slate-500 mt-1">{l.idade} anos · {l.vinculo} · {l.profissao}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[14px]">{brl(l.renda)} <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${f.cls}`}>{f.label}</span></div>
                      <div className="text-xs text-slate-500 mt-1">parcela até <b className="text-slate-900">{brl(parcela)}</b></div>
                    </td>
                    <td className="p-3"><div className="font-mono text-xs">{l.telefone}</div><div className="text-xs text-slate-500">{l.email}</div></td>
                    <td className="p-3"><span className={`font-bold text-[15px] font-mono ${scoreCls}`}>{l.score}</span></td>
                    <td className="p-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${l.status==='approved' ? 'bg-emerald-50 text-emerald-700' : l.status==='human_review' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`} title={l.reason}>
                        {l.status==='approved' ? 'Apto' : l.status==='human_review' ? 'Revisão' : 'Bloqueado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-600 bg-slate-50 border rounded-lg p-3">
          <span>📋 Planilha pronta: <b>{leads.length} linhas</b> com Nome, CPF mascarado, Idade, Vínculo, Profissão, Renda, Faixa, Parcela 30%, Telefone, Email, Score crédito, Score final, Status, Motivo.</span>
          <span className="ml-auto flex gap-2">
            <button onClick={copyCSV} className="underline font-semibold">Copiar CSV</button> · <button onClick={copyTXT} className="underline font-semibold">Copiar TXT</button> · <button onClick={exportCSV} className="underline font-semibold">Baixar CSV</button>
          </span>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-[14px] p-4 text-slate-300">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Live log</div>
          <div className="h-[240px] overflow-y-auto font-mono text-xs leading-6">
            {log.map((l,i)=>(
              <div key={i} className="flex gap-2">
                <span className="text-slate-500 shrink-0">[{l.time}]</span>
                <span className={l.type==='success' ? 'text-green-400' : l.type==='danger' ? 'text-red-400' : l.type==='warn' ? 'text-amber-400' : 'text-slate-400'}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border rounded-[14px] p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Jev Router</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-2 py-2 border-b border-dashed"><span className="font-mono">perfil social</span><span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">jev-max · R$0,18</span></div>
              <div className="flex justify-between gap-2 py-2 border-b border-dashed"><span className="font-mono">web estática</span><span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">httpx · R$0,002</span></div>
              <div className="flex justify-between gap-2 py-2"><span className="font-mono">enriquec. CPF/renda</span><span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">brasilapi · R$0</span></div>
            </div>
          </div>
          <div className="bg-white border rounded-[14px] p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Jev Gate · MCMV</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-dashed"><span className="font-mono text-slate-500">renda fora 3k–10k</span><span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded">BLOCK</span></div>
              <div className="flex justify-between py-1.5 border-b border-dashed"><span className="font-mono text-slate-500">já possui imóvel</span><span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded">BLOCK</span></div>
              <div className="flex justify-between py-1.5 border-b border-dashed"><span className="font-mono text-slate-500">idade &lt; 18</span><span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded">BLOCK</span></div>
              <div className="flex justify-between py-1.5 border-b border-dashed"><span className="font-mono text-slate-500">MX inválido / descartável</span><span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded">BLOCK</span></div>
              <div className="flex justify-between py-1.5 border-b border-dashed"><span className="font-mono text-slate-500">DDD != 62</span><span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded">HUMAN</span></div>
              <div className="flex justify-between py-1.5"><span className="font-mono text-slate-500">score crédito &lt; 400</span><span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded">HUMAN</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 py-3">AvantoFind MCMV B2C · <b className="text-slate-900">Harness orquestra, Jev decide</b> · Enriquecimento via BrasilAPI · Enriquecido DDD 62 Goiânia/Aparecida</div>

      {toast && <div className="fixed bottom-4 right-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-full shadow-lg">{toast}</div>}
    </div>
  );
}
