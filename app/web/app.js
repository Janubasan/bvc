// BVC-OS · SPA didática (vanilla, sem build). Todas as chamadas usam URL relativa (/api/...).
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const estadoApp = { projetos: [], slug: '', agentes: null, estado: null, gates: null, artefatos: [], templates: [] };

async function api(caminho, opcoes = {}) {
  const r = await fetch(caminho, { headers: { 'Content-Type': 'application/json' }, ...opcoes, body: opcoes.body ? JSON.stringify(opcoes.body) : undefined });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(json.erro || `Erro ${r.status}`);
  return json;
}

function aviso(msg, tipo = 'ok') {
  const el = document.createElement('div');
  el.className = 'cartao';
  el.style.cssText = `position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);z-index:99;max-width:min(700px,92vw);` +
    `border-color:${tipo === 'erro' ? 'var(--erro)' : 'var(--ok)'};box-shadow:0 10px 30px rgba(0,0,0,.5)`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

// ---------------------------------------------------------------- markdown-lite
function md(texto = '') {
  const blocos = [];
  let t = String(texto).replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, codigo) => {
    blocos.push(`<pre class="codigo">${esc(codigo.trim())}</pre>`);
    return `@@BLOCO${blocos.length - 1}@@`;
  });
  t = esc(t)
    .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');

  const linhas = t.split('\n');
  const saida = [];
  let tabela = null;
  const fimTabela = () => { if (tabela) { saida.push(`<table class="tabela"><thead>${tabela.cab}</thead><tbody>${tabela.corpo}</tbody></table>`); tabela = null; } };
  for (const linha of linhas) {
    const cels = linha.trim();
    if (cels.startsWith('|') && cels.endsWith('|')) {
      const partes = cels.slice(1, -1).split('|').map((c) => c.trim());
      if (partes.every((c) => /^:?-{2,}:?$/.test(c))) continue;
      if (!tabela) tabela = { cab: `<tr>${partes.map((c) => `<th>${c}</th>`).join('')}</tr>`, corpo: '' };
      else tabela.corpo += `<tr>${partes.map((c) => `<td>${c}</td>`).join('')}</tr>`;
      continue;
    }
    fimTabela();
    saida.push(linha);
  }
  fimTabela();
  return saida.join('\n').replace(/@@BLOCO(\d+)@@/g, (_, i) => blocos[Number(i)]);
}

// ---------------------------------------------------------------- abas
$$('#abas button').forEach((b) => b.addEventListener('click', () => {
  $$('#abas button').forEach((x) => x.classList.toggle('ativa', x === b));
  $$('.aba').forEach((s) => s.classList.toggle('ativa', s.id === `aba-${b.dataset.aba}`));
}));

// ---------------------------------------------------------------- inicialização
async function iniciar() {
  const [saude, projetos, agentes, templates] = await Promise.all([
    api('/api/health'), api('/api/projetos'), api('/api/agentes'), api('/api/templates'),
  ]);
  estadoApp.agentes = agentes;
  estadoApp.templates = templates.artefatos;
  estadoApp.projetos = projetos.projetos;

  const badge = $('#modo-badge');
  badge.textContent = saude.modo === 'deterministico' ? 'determinístico (sem chave)' : `LLM: ${saude.modelo}`;
  badge.className = 'badge ' + (saude.modo === 'deterministico' ? 'badge-neutro' : 'badge-ia');
  $('#rodape-info').textContent = `v${saude.versao} · dados em ${saude.dados}`;

  renderSeletor();
  renderAgentes();
  renderPadroes();
  renderChips();
  renderSeletorArtefato();
  if (estadoApp.projetos.length) selecionar(estadoApp.projetos[0].slug);
}

function renderSeletor() {
  const sel = $('#seletor-projeto');
  sel.innerHTML = '<option value="">— selecione um projeto —</option>' +
    estadoApp.projetos.map((p) => `<option value="${esc(p.slug)}">${esc(p.nome)} (${esc(p.percurso || '')})</option>`).join('');
  sel.value = estadoApp.slug;
  sel.onchange = () => selecionar(sel.value);
}

async function recarregarProjetos() {
  estadoApp.projetos = (await api('/api/projetos')).projetos;
  renderSeletor();
}

async function selecionar(slug) {
  estadoApp.slug = slug;
  if (!slug) {
    $('#painel-conteudo').innerHTML = '<div class="vazio">Selecione ou crie um projeto.</div>';
    return;
  }
  estadoApp.estado = await api(`/api/projetos/${slug}/estado`);
  estadoApp.gates = await api(`/api/projetos/${slug}/gates`);
  estadoApp.artefatos = (await api(`/api/projetos/${slug}/artefatos`)).artefatos;
  renderPainel();
  renderPortas();
  renderArtefatos();
}

// ---------------------------------------------------------------- começar
$('#form-projeto').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const dados = Object.fromEntries(new FormData(ev.target));
  try {
    const r = await api('/api/projetos', { method: 'POST', body: dados });
    await recarregarProjetos();
    await selecionar(r.slug);
    alert(`${r.mensagem}\n\nArtefatos gerados: ${r.artefatos.join(', ')}`);
    $$('#abas button').find((b) => b.dataset.aba === 'painel').click();
  } catch (e) { alert('Erro: ' + e.message); }
});

$('#btn-demo').addEventListener('click', async () => {
  const r = await api('/api/demo', { method: 'POST', body: {} });
  await recarregarProjetos();
  await selecionar(r.slug);
  $$('#abas button').find((b) => b.dataset.aba === 'ciclo').click();
  setTimeout(() => executar('/semana'), 200);
});

// ---------------------------------------------------------------- painel
function renderPainel() {
  const e = estadoApp.estado;
  const g = estadoApp.gates;
  const m = e.metricas;
  const campos = [
    ['conversas', 'Conversas de descoberta', 'meta G0: 15'],
    ['mensagens_enviadas', 'Mensagens enviadas', ''],
    ['respostas', 'Respostas recebidas', ''],
    ['clientes_pagos', 'Clientes pagos', 'meta G1: 3'],
    ['clientes_novos', 'Clientes novos (aquisição)', 'para o CAC'],
    ['clientes_por_canal', 'Clientes do canal principal', 'meta G4: 10'],
    ['entregas_medidas', 'Entregas com antes/depois', 'meta G2: 1'],
    ['renovacoes', 'Renovações pagas', 'meta G3: 1'],
    ['mrr', 'MRR (R$)', ''],
    ['receita_recebida', 'Receita recebida (R$)', ''],
    ['custo_ia_mes', 'Custo de IA/infra no mês (R$)', 'meta G5: < 30%'],
    ['horas_trabalhadas', 'Horas trabalhadas no período', ''],
    ['churn_pct', 'Churn mensal (%)', ''],
    ['ativacao_pct', 'Ativação (%)', ''],
  ];
  $('#painel-conteudo').innerHTML = `
    <div class="cartao">
      <h2>${esc(e.nome)} <span class="pill">${esc(e.percurso_atual)} · ${esc(e.etapa)}</span></h2>
      <p><b>Público:</b> ${esc(e.publico)} · <b>Preço:</b> setup ${esc(e.preco.setup)} / mensal ${esc(e.preco.mensal)} · <b>Canal:</b> ${esc(e.canal_principal)}</p>
      <p><b>Dor:</b> ${esc(e.dor)}</p>
      <p><b>Resultado prometido:</b> ${esc(e.resultado_prometido)}</p>
      <p class="dica">Portas: ${esc(g.resumo)} · próximo passo: ${esc(e.proximo_passo || '[SEM DADO]')}</p>
    </div>
    <div class="cartao">
      <h2>Métricas (edite e salve)</h2>
      <form id="form-metricas" class="formulario">
        <div class="grade-2">
          ${campos.map(([chave, rotulo, dica]) => `
            <label>${rotulo}${dica ? ` <small>(${dica})</small>` : ''}
              <input name="${chave}" type="number" step="any" value="${m[chave] ?? ''}" placeholder="[SEM DADO]" />
            </label>`).join('')}
        </div>
        <button class="botao primario" type="submit">Salvar métricas</button>
      </form>
    </div>
    <div class="cartao">
      <h2>Histórico recente</h2>
      <ul class="lista-limpa">${(e.historico || []).slice(-8).reverse().map((h) => `<li>${esc(h.data)} — ${esc(h.resumo)}</li>`).join('') || '<li>sem registros ainda</li>'}</ul>
    </div>`;
  $('#form-metricas').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const bruto = Object.fromEntries(new FormData(ev.target));
    const metricas = {};
    for (const [k, v] of Object.entries(bruto)) if (v !== '') metricas[k] = Number(v);
    await api(`/api/projetos/${estadoApp.slug}/estado`, { method: 'PUT', body: { metricas } });
    await selecionar(estadoApp.slug);
    aviso('Métricas salvas. O sistema já usa esses números na próxima rodada.');
  });
}

// ---------------------------------------------------------------- portas
function renderPortas() {
  const { portas } = estadoApp.gates;
  const cartoes = Object.entries(portas).map(([gate, v]) => `
    <div class="porta ${v.status}">
      <div class="titulo">
        <b>${gate}</b>
        <span class="pill ${v.status === 'aprovada' ? 'ok' : v.status === 'reprovada' ? 'err' : 'warn'}">${v.status}</span>
      </div>
      <div class="medido">${esc(v.medido)}</div>
      ${v.falta.length ? `<ul>${v.falta.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      <div class="linha" style="margin-top:.5rem">
        <button class="botao mini" data-porta="${gate}" data-status="aprovada">Aprovar com evidência</button>
        <button class="botao mini perigo" data-porta="${gate}" data-status="reprovada">Reprovar</button>
        <button class="botao mini" data-porteiro="${gate}">Auditar (${gate})</button>
      </div>
    </div>`).join('');
  $('#portas-conteudo').innerHTML = `<div class="grade-portas">${cartoes}</div>`;

  $$('[data-porta]').forEach((b) => b.addEventListener('click', async () => {
    const evidencia = prompt(`Evidência para ${b.dataset.porta} ${b.dataset.status} (data + fonte + número):`, '');
    if (evidencia === null) return;
    await api(`/api/projetos/${estadoApp.slug}/porta`, { method: 'POST', body: { gate: b.dataset.porta, status: b.dataset.status, evidencia } });
    await selecionar(estadoApp.slug);
    aviso(`${b.dataset.porta} → ${b.dataset.status}`);
  }));
  $$('[data-porteiro]').forEach((b) => b.addEventListener('click', () => {
    $$('#abas button').find((x) => x.dataset.aba === 'ciclo').click();
    $('#entrada-comando').value = `/porteiro ${b.dataset.porteiro}`;
    executar(`/porteiro ${b.dataset.porteiro}`);
  }));
}

// ---------------------------------------------------------------- unidade
$('#btn-unidade').addEventListener('click', async () => {
  if (!estadoApp.slug) return;
  const q = new URLSearchParams({
    horas: $('#u-horas').value, valorHora: $('#u-valor').value, ferramentas: $('#u-ferramentas').value,
    caixa: $('#u-caixa').value, custoFixo: $('#u-fixo').value,
  });
  const u = await api(`/api/projetos/${estadoApp.slug}/unidade?${q}`);
  $('#unidade-conteudo').innerHTML = `
    <div class="kpis">
      ${Object.entries(u.formatado).map(([k, v]) => `<div class="kpi"><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}
    </div>
    <div class="cartao">
      <h3>Alertas</h3>
      ${u.alertas.length ? `<ul class="lista-limpa">${u.alertas.map((a) => `<li>⚠️ ${esc(a)}</li>`).join('')}</ul>` : '<p class="dica">Nenhum alerta (ou dados insuficientes).</p>'}
      <h3>Ações sugeridas</h3>
      ${u.acoes.length ? `<ul class="lista-limpa">${u.acoes.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : '<p class="dica">Registre receita, custo de IA e horas para habilitar o diagnóstico.</p>'}
    </div>`;
});

// ---------------------------------------------------------------- ciclo agêntico
const COMANDOS = ['/status', '/semana', '/proximo', '/porteiro G0', '/validar', '/canal reddit', '/canal outbound', '/entrega', '/caixa', '/preencher oferta', '/preencher prd', '/escalar'];
function renderChips() {
  $('#chips-comandos').innerHTML = COMANDOS.map((c) => `<button data-cmd="${c}">${c}</button>`).join('');
  $$('#chips-comandos button').forEach((b) => b.addEventListener('click', () => { $('#entrada-comando').value = b.dataset.cmd; executar(b.dataset.cmd); }));
}
$('#btn-executar').addEventListener('click', () => executar($('#entrada-comando').value || '/status'));
$('#entrada-comando').addEventListener('keydown', (e) => { if (e.key === 'Enter') executar($('#entrada-comando').value); });

async function executar(comando) {
  if (!estadoApp.slug) return alert('Selecione ou crie um projeto primeiro.');
  const alvo = $('#ciclo-conteudo');
  alvo.innerHTML = '<div class="vazio">executando ciclo agêntico…</div>';
  let r;
  try {
    r = await api(`/api/projetos/${estadoApp.slug}/comando`, { method: 'POST', body: { comando, opcoes: { usarIA: $('#usar-ia').checked } } });
  } catch (e) { alvo.innerHTML = `<div class="vazio" style="border-color:var(--erro)">Erro: ${esc(e.message)}</div>`; return; }

  const b = r.blocos;
  alvo.innerHTML = `
    <div class="cartao">
      <div class="linha" style="justify-content:space-between">
        <h2>⚡ ${esc(r.comando)} · movimento <span class="pill ${r.movimento === 'AVANCAR' ? 'ok' : 'warn'}">${esc(r.movimento)}</span></h2>
        <div class="linha">
          <button class="botao mini" id="copiar-resposta">Copiar resposta</button>
          <button class="botao mini" id="baixar-resposta">Baixar .md</button>
        </div>
      </div>
      <p class="dica">modo: ${esc(r.modo)} · porta em foco: <b>${esc(r.portaFoco || '—')}</b> · custo estimado: ${r.custoEstimado.tempo_h}h + R$ ${r.custoEstimado.ia_brl} · padrões: ${r.padroes.map((p) => `<span class="pill">${esc(p)}</span>`).join(' ')}</p>
      <div class="kpis">
        <div class="kpi"><small>vazamento</small><b>${esc(r.vazamento.vazamento)}</b></div>
        <div class="kpi"><small>alavanca única</small><b>${esc(r.vazamento.alavanca)}</b></div>
        <div class="kpi"><small>agente responsável</small><b>${esc(r.vazamento.agente)}</b></div>
        <div class="kpi"><small>portas</small><b>${esc(r.auditoria.resumo)}</b></div>
      </div>
    </div>

    <div class="blocos">
      <div class="bloco"><h3>1 · Diagnóstico</h3><div>${md(b.diagnostico)}</div></div>
      <div class="bloco"><h3>2 · Decisão da rodada</h3><div>${md(b.decisao)}</div></div>
      <div class="bloco"><h3>3 · Handoffs (quem faz o quê)</h3><div>${md(b.handoffs)}</div></div>
      <div class="bloco"><h3>4 · Artefato</h3><div>${md(b.artefato)}</div></div>
      <div class="bloco"><h3>5 · Ação de hoje (15–60 min)</h3><div>${md(b.acaoHoje)}</div></div>
      <div class="bloco"><h3>6 · Atualização de estado</h3><div>${md(b.atualizacaoEstado)}</div></div>
      <div class="bloco"><h3>7 · Próximo passo</h3><div>${md(b.proximoPasso)}</div></div>
      ${r.respostaIA ? `<div class="bloco" style="border-left-color:var(--roxo)"><h3>🧠 Resposta do LLM (agente)</h3><div>${md(r.respostaIA)}</div></div>` : ''}
    </div>

    <div class="grade-2">
      <div class="cartao">
        <h3>🛡️ Guardrails (L4)</h3>
        <p>${r.guardrails.aprovado ? '<span class="pill ok">aprovado</span>' : '<span class="pill err">reprovado</span>'} ${r.guardrails.codigos.map((c) => `<span class="pill warn">${esc(c)}</span>`).join(' ')}</p>
        ${r.guardrails.bloqueantes.length ? `<ul class="lista-limpa">${r.guardrails.bloqueantes.map((c) => `<li><b>${esc(c.codigo)}</b>: ${esc(c.motivo)}</li>`).join('')}</ul>` : '<p class="dica">Nenhuma violação bloqueante.</p>'}
        ${r.guardrails.avisos.length ? `<ul class="lista-limpa">${r.guardrails.avisos.map((c) => `<li><b>${esc(c.codigo)}</b>: ${esc(c.motivo)}</li>`).join('')}</ul>` : ''}
      </div>
      <div class="cartao">
        <h3>👤 Human-in-the-loop</h3>
        <ul class="lista-limpa">${r.hitl.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        <h3 style="margin-top:.8rem">🔎 Trace do loop (ReAct)</h3>
        <div class="timeline">
          ${r.trace.map((t) => `<div class="passo-trace ${t.tipo} ${t.erro ? 'erro' : ''}">
            <span class="num">${t.passo}</span>
            <span>${t.tipo === 'llm' ? '🧠' : '🛠️'} <b>${esc(t.ferramenta)}</b> — ${esc(t.erro || t.saida || '')}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>`;

  $('#copiar-resposta').onclick = () => navigator.clipboard.writeText(respostaMarkdown(r)).then(() => aviso('Resposta copiada.'));
  $('#baixar-resposta').onclick = () => baixar(`bvc-${r.cmd}-${Date.now()}.md`, respostaMarkdown(r));
  await recarregarProjetos();
  estadoApp.estado = await api(`/api/projetos/${estadoApp.slug}/estado`);
  estadoApp.gates = await api(`/api/projetos/${estadoApp.slug}/gates`);
  renderPortas();
}

function respostaMarkdown(r) {
  const b = r.blocos;
  return `# BVC-OS · ${r.comando}\n\n> movimento: ${r.movimento} · modo: ${r.modo} · porta: ${r.portaFoco || '—'}\n\n## 1. Diagnóstico\n${b.diagnostico}\n\n## 2. Decisão\n${b.decisao}\n\n## 3. Handoffs\n${b.handoffs}\n\n## 4. Artefato\n${b.artefato}\n\n## 5. Ação de hoje\n${b.acaoHoje}\n\n## 6. Atualização de estado\n${b.atualizacaoEstado}\n\n## 7. Próximo passo\n${b.proximoPasso}\n` + (r.respostaIA ? `\n## Resposta do LLM\n${r.respostaIA}\n` : '');
}
function baixar(nome, conteudo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/markdown' }));
  const a = document.createElement('a'); a.href = url; a.download = nome; a.click(); URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------- artefatos
function renderSeletorArtefato() {
  $('#seletor-artefato').innerHTML = estadoApp.templates.map((t) => `<option value="${t.chave}">${esc(t.nome)}</option>`).join('');
}
function renderArtefatos() {
  const lista = estadoApp.artefatos;
  $('#artefato-conteudo').innerHTML = lista.length
    ? `<div class="chips">${lista.map((a) => `<button data-art="${esc(a.nome)}">${esc(a.nome)}</button>`).join('')}</div><div id="art-view"></div>`
    : '<div class="vazio">Nenhum artefato ainda. Escolha um tipo e clique em "Gerar / atualizar".</div>';
  $$('[data-art]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-art]').forEach((x) => x.classList.toggle('ativo', x === b));
    const a = lista.find((x) => x.nome === b.dataset.art);
    $('#art-view').innerHTML = `<div class="bloco"><h3>${esc(a.nome)}</h3><div>${md(a.conteudo)}</div></div>`;
  }));
  if (lista.length) $$('[data-art]')[0].click();
}
$('#btn-gerar-artefato').addEventListener('click', async () => {
  if (!estadoApp.slug) return alert('Selecione um projeto.');
  const chave = $('#seletor-artefato').value;
  try {
    await api(`/api/projetos/${estadoApp.slug}/artefatos`, { method: 'POST', body: { artefato: chave } });
    estadoApp.artefatos = (await api(`/api/projetos/${estadoApp.slug}/artefatos`)).artefatos;
    renderArtefatos();
    aviso(`Artefato "${chave}" gerado.`);
  } catch (e) { alert('Erro: ' + e.message); }
});
$('#btn-baixar-artefato').addEventListener('click', () => {
  const ativo = $('[data-art].ativo')?.dataset.art;
  const a = estadoApp.artefatos.find((x) => x.nome === (ativo || estadoApp.artefatos[0]?.nome));
  if (!a) return alert('Gere um artefato primeiro.');
  baixar(a.nome, a.conteudo);
});

// ---------------------------------------------------------------- agentes + padrões
function renderAgentes() {
  const { L0, L1, L2, guardrails } = estadoApp.agentes;
  const card = (id, nome, emoji, missao, prompt) => `
    <div class="agente">
      <div class="cabeca"><b>${emoji} ${esc(nome)} <span class="pill">${esc(id)}</span></b>
        <button class="botao mini" data-prompt="${esc(id)}">copiar prompt</button></div>
      <p class="dica">${esc(missao)}</p>
      <pre>${esc(prompt)}</pre>
    </div>`;
  $('#agentes-conteudo').innerHTML = `
    <div class="grade-3">
      ${card(L0.id, L0.nome, '🧠', L0.missao, L0.prompt)}
      ${L1.map((a) => card(a.id, a.nome, a.emoji, a.missao, a.prompt)).join('')}
    </div>
    <div class="cartao">
      <h2>Especialistas (L2)</h2>
      <div class="grade-3">${L2.map((a) => card(a.id, a.nome, '🔧', a.saida, a.prompt)).join('')}</div>
    </div>
    <div class="cartao">
      <h2>Guardrails (L4) — códigos de reprovação</h2>
      <table class="tabela"><thead><tr><th>Código</th><th>Motivo</th></tr></thead><tbody>
        ${Object.entries(guardrails.codigos).map(([c, m]) => `<tr><td><code>${esc(c)}</code></td><td>${esc(m)}</td></tr>`).join('')}
      </tbody></table>
      <h3 style="margin-top:.8rem">Exige decisão humana (HITL)</h3>
      <ul class="lista-limpa">${guardrails.hitl.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    </div>`;
  $$('[data-prompt]').forEach((b) => b.addEventListener('click', () => {
    const todos = [estadoApp.agentes.L0, ...estadoApp.agentes.L1, ...estadoApp.agentes.L2];
    const a = todos.find((x) => x.id === b.dataset.prompt);
    navigator.clipboard.writeText(a.prompt).then(() => { b.textContent = 'copiado ✓'; setTimeout(() => (b.textContent = 'copiar prompt'), 1500); });
  }));
}
function renderPadroes() {
  const { padroes } = estadoApp.agentes;
  $('#padroes-conteudo').innerHTML = Object.entries(padroes).map(([id, p]) => `
    <div class="agente">
      <div class="cabeca"><b>${esc(p.nome)}</b><span class="pill">${esc(id)}</span></div>
      <p class="dica">${esc(p.o_que)}</p>
    </div>`).join('');
}

iniciar().catch((e) => {
  document.body.insertAdjacentHTML('afterbegin', `<div class="cartao" style="border-color:var(--erro)">Falha ao iniciar: ${esc(e.message)}</div>`);
});
