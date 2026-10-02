// BVC-OS · Servidor full-stack (Node puro, sem dependências)
// API JSON + SPA estática. Bind em 0.0.0.0 para funcionar em preview/online.
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { APP_DIR, DATA_DIR, lerJSON, salvarJSON, hoje, slugify, parseSpec, caminhos, rel, listarProjetos } from './core/util.mjs';
import { carregarEstado, salvarEstado, estadoPadrao, atualizarMetricas, aplicarAprovacaoPorta, registrarHistorico } from './core/state.mjs';
import { auditar } from './core/gates.mjs';
import { calcularUnidade } from './core/unit.mjs';
import { buscar } from './core/rag.mjs';
import { L0, L1, L2, PADROES, GUARDRAILS } from './agents/registry.mjs';
import { executar, parseComando } from './agents/engine.mjs';
import { criarLLM } from './agents/llm.mjs';
import { ferramenta_preencher } from './agents/tools.mjs';

const PORTA = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const WEB = join(APP_DIR, 'web');
const llm = criarLLM();
const VERSAO = '1.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.md': 'text/markdown; charset=utf-8',
};

function json(res, dados, status = 200) {
  const corpo = JSON.stringify(dados);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(corpo) });
  res.end(corpo);
}

async function corpo(req) {
  const partes = [];
  for await (const p of req) partes.push(p);
  if (!partes.length) return {};
  try { return JSON.parse(Buffer.concat(partes).toString('utf8')); } catch { return {}; }
}

function exigirProjeto(slug) {
  if (!existsSync(caminhos(slug).estado)) {
    throw Object.assign(new Error(`Projeto "${slug}" não existe. Crie um novo em "Começar".`), { status: 404 });
  }
}

const rotas = {
  'GET /api/health': () => ({ ok: true, versao: VERSAO, modo: llm.disponivel ? 'llm+deterministico' : 'deterministico', modelo: llm.disponivel ? llm.modelo : null, dados: rel(DATA_DIR), data: hoje() }),
  'GET /api/agentes': () => ({ L0, L1, L2, padroes: PADROES, guardrails: GUARDRAILS }),
  'GET /api/projetos': () => ({ projetos: listarProjetos() }),

  'GET /api/templates': () => ({
    artefatos: [
      { chave: 'prd', nome: 'PRD (escopo do MVP)' }, { chave: 'oferta', nome: 'Oferta' },
      { chave: 'landing', nome: 'Landing page' }, { chave: 'preco', nome: 'Preço e planos' },
      { chave: 'proposta', nome: 'Proposta comercial' }, { chave: 'lancamento-x', nome: 'Lançamento no X' },
      { chave: 'lancamento-reddit', nome: 'Lançamento no Reddit' }, { chave: 'cold-email', nome: 'Sequência de contato' },
      { chave: 'prompts-agente', nome: 'Prompts do agente' }, { chave: 'checklist-30-dias', nome: 'Checklist de 30 dias' },
    ],
  }),

  'POST /api/projetos': (dados) => {
    const nome = (dados.nome || '').trim();
    if (!nome) throw Object.assign(new Error('Informe o nome do produto.'), { status: 400 });
    if (!dados.dor || !dados.publico) throw Object.assign(new Error('Informe a dor e o público (a validação começa por eles).'), { status: 400 });
    const slug = slugify(dados.slug || nome);
    const spec = {
      slug, nome, autor: dados.autor || '', email: dados.email || '',
      publico: dados.publico, dor: dados.dor, resultado: dados.resultado || '',
      prazo: dados.prazo || '14 dias', preco_setup: dados.preco_setup || 'R$ 0', preco_mensal: dados.preco_mensal || 'R$ 297',
      garantia: dados.garantia || 'garantia de satisfação em 30 dias', canal: dados.canal || 'X/LinkedIn + comunidades do nicho',
      stack: dados.stack || 'Supabase + Next.js + Stripe + LLM via API',
      diferenciais: dados.diferenciais || '', metrica_sucesso: dados.metrica_sucesso || '',
    };
    salvarJSON(caminhos(slug).spec, spec);
    const estado = estadoPadrao(slug, spec);
    salvarEstado(slug, estado);
    const gerados = [];
    for (const artefato of ['prd', 'oferta', 'landing', 'preco']) {
      try { gerados.push(ferramenta_preencher({ slug, artefato }).saida.arquivo); } catch { /* opcional */ }
    }
    return { slug, spec, artefatos: gerados, mensagem: `Projeto "${nome}" criado. Próximo passo: validar a dor (G0) com 15 conversas.` };
  },

  'GET /api/projetos/:slug/estado': (_d, ctx) => carregarEstado(ctx.slug),
  'PUT /api/projetos/:slug/estado': (dados, ctx) => {
    const { slug } = ctx;
    if (dados.metricas) atualizarMetricas(slug, dados.metricas);
    const e = carregarEstado(slug);
    if (dados.estado) { Object.assign(e, dados.estado); registrarHistorico(e, 'campos do negócio atualizados'); salvarEstado(slug, e); }
    return carregarEstado(slug);
  },
  'GET /api/projetos/:slug/gates': (_d, ctx) => auditar(carregarEstado(ctx.slug)),
  'POST /api/projetos/:slug/porta': (dados, ctx) => {
    const { slug } = ctx;
    const { gate, status, evidencia } = dados;
    if (!['aprovada', 'reprovada', 'pendente'].includes(status)) throw Object.assign(new Error('status deve ser aprovada, reprovada ou pendente'), { status: 400 });
    aplicarAprovacaoPorta(slug, gate, status, evidencia || '');
    return { ok: true, auditoria: auditar(carregarEstado(slug)) };
  },
  'GET /api/projetos/:slug/unidade': (_d, ctx) => calcularUnidade(carregarEstado(ctx.slug), {
    horas: ctx.query.get('horas'), valorHora: ctx.query.get('valorHora'), ferramentas: ctx.query.get('ferramentas'),
    caixa: ctx.query.get('caixa'), custoFixo: ctx.query.get('custoFixo'),
  }),

  'GET /api/projetos/:slug/artefatos': (_d, ctx) => {
    const dir = caminhos(ctx.slug).artefatos;
    if (!existsSync(dir)) return { artefatos: [] };
    return { artefatos: readdirSync(dir).map((nome) => ({ nome, conteudo: readFileSync(join(dir, nome), 'utf8') })) };
  },
  'POST /api/projetos/:slug/artefatos': (dados, ctx) => ferramenta_preencher({ slug: ctx.slug, artefato: dados.artefato || 'oferta' }).saida,

  'GET /api/projetos/:slug/handoffs': (_d, ctx) => {
    const dir = caminhos(ctx.slug).handoffs;
    if (!existsSync(dir)) return { handoffs: [] };
    return { handoffs: readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => lerJSON(join(dir, f))) };
  },

  'POST /api/projetos/:slug/comando': async (dados, ctx) => {
    exigirProjeto(ctx.slug);
    return executar({ slug: ctx.slug, comando: dados.comando || '/status', opcoes: dados.opcoes || {}, llm });
  },
  'POST /api/projetos/:slug/semana': async (dados, ctx) => {
    exigirProjeto(ctx.slug);
    return executar({ slug: ctx.slug, comando: dados.comando || '/semana', opcoes: dados.opcoes || {}, llm });
  },

  'GET /api/buscar': (_d, ctx) => ({ resultados: buscar(ctx.query.get('q') || '', 5) }),

  'POST /api/demo': () => {
    const slug = 'demo-clinicas';
    if (existsSync(caminhos(slug).estado)) return { slug, existente: true };
    const spec = {
      slug, nome: 'AgendaBot para clínicas (demo)', autor: 'Demo BVC', email: 'demo@bvc.local',
      publico: 'clínicas odontológicas com 2 a 5 cadeiras em Goiânia',
      dor: 'recepção perde ~1h/dia confirmando consultas; ~20% dos pacientes faltam',
      resultado: 'reduzir faltas em 40% e devolver 1h/dia para a recepção',
      prazo: '14 dias', preco_setup: 'R$ 1.500', preco_mensal: 'R$ 297',
      garantia: 'se não reduzir as faltas em 30% em 60 dias, devolvo o setup',
      canal: 'WhatsApp de grupos de gestores + Instagram de dentistas',
      stack: 'motor BVC-OS (Node nativo) + API oficial do WhatsApp + SQLite + gpt-oss-20b',
      diferenciais: 'confirmação automática, reagendamento em 1 clique, relatório semanal de faltas',
      metrica_sucesso: 'faltas por semana e tempo da recepção gasto em confirmação',
    };
    salvarJSON(caminhos(slug).spec, spec);
    const e = estadoPadrao(slug, spec);
    // Métricas iniciais de um negócio já em operação, para o primeiro ciclo já mostrar diagnóstico real.
    e.metricas = {
      ...e.metricas, conversas: 19, mensagens_enviadas: 340, respostas: 41,
      clientes_pagos: 4, clientes_novos: 4, clientes_por_canal: 4,
      entregas_medidas: 1, renovacoes: 0, mrr: 1188, receita_recebida: 1485,
      custo_ia_mes: 95, horas_trabalhadas: 46, churn_pct: 4, ativacao_pct: 62,
    };
    e.historico = [
      { data: '2026-09-12', resumo: 'G0 aprovada com 19 conversas de descoberta registradas.' },
      { data: '2026-09-24', resumo: 'G1 aprovada: 4 clientes pagos (R$ 1.485 recebidos).' },
      { data: '2026-09-30', resumo: 'G2 em andamento: 1 entrega medida (faltas caíram 38% em 3 semanas).' },
    ];
    salvarEstado(slug, e);
    for (const artefato of ['prd', 'oferta', 'landing', 'preco', 'checklist-30-dias']) {
      try { ferramenta_preencher({ slug, artefato }); } catch { /* opcional */ }
    }
    return { slug, existente: false };
  },
};

function casarRota(metodo, caminho) {
  const partes = caminho.split('/').filter(Boolean);
  for (const chave of Object.keys(rotas)) {
    const [m, template] = chave.split(' ');
    if (m !== metodo) continue;
    const tPartes = template.split('/').filter(Boolean);
    if (tPartes.length !== partes.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < tPartes.length; i++) {
      if (tPartes[i].startsWith(':')) params[tPartes[i].slice(1)] = decodeURIComponent(partes[i]);
      else if (tPartes[i] !== partes[i]) { ok = false; break; }
    }
    if (ok) return { handler: rotas[chave], params };
  }
  return null;
}

function servirEstatico(req, res, caminho) {
  const alvo = caminho === '/' ? '/index.html' : caminho;
  const arquivo = normalize(join(WEB, alvo));
  if (!arquivo.startsWith(WEB) || !existsSync(arquivo) || !readFileSync) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('not found');
    return;
  }
  const conteudo = readFileSync(arquivo);
  res.writeHead(200, { 'Content-Type': MIME[extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(conteudo);
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  // preview/iframe: nenhuma restrição de origem ou framebusting
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  try {
    if (url.pathname.startsWith('/api/')) {
      const rota = casarRota(req.method, url.pathname);
      if (!rota) return json(res, { erro: 'Rota não encontrada' }, 404);
      const dados = ['POST', 'PUT'].includes(req.method) ? await corpo(req) : {};
      const saida = await rota.handler(dados, { ...rota.params, query: url.searchParams, queryStr: url.search });
      return json(res, saida);
    }
    return servirEstatico(req, res, url.pathname);
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error('[erro]', err);
    return json(res, { erro: err.message || 'erro interno' }, status);
  }
});

servidor.listen(PORTA, HOST, () => {
  console.log(`BVC-OS online em http://${HOST}:${PORTA}`);
  console.log(`modo: ${llm.disponivel ? `LLM (${llm.modelo}) + determinístico` : 'determinístico (sem chave de LLM)'}`);
  console.log(`dados: ${rel(DATA_DIR)}`);
});
