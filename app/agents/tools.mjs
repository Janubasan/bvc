// BVC-OS · Ferramentas que os agentes podem chamar (o "act" do loop ReAct)
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { TEMPLATES_DIR, lerTexto, salvarTexto, renderTemplate, hoje, caminhos, lerJSON, slugify, listarProjetos } from '../core/util.mjs';
import { carregarEstado, salvarEstado, registrarHistorico } from '../core/state.mjs';
import { auditar, proximaPortaBloqueante } from '../core/gates.mjs';
import { calcularUnidade } from '../core/unit.mjs';
import { contextoRAG } from '../core/rag.mjs';

export const MAPA_ARTEFATOS = {
  prd: 'prd.md.tmpl', oferta: 'oferta.md.tmpl', landing: 'landing.md.tmpl', preco: 'preco.md.tmpl',
  proposta: 'proposta.md.tmpl', 'lancamento-x': 'lancamento-x.md.tmpl', 'lancamento-reddit': 'lancamento-reddit.md.tmpl',
  'cold-email': 'cold-email.md.tmpl', 'prompts-agente': 'prompts-agente.md.tmpl', 'checklist-30-dias': 'checklist-30-dias.md.tmpl',
};

export function ferramenta_portas({ slug }) {
  const e = carregarEstado(slug);
  const a = auditar(e);
  return { saida: a, resumo: `${a.resumo} · próxima porta bloqueante: ${proximaPortaBloqueante(a, e.percurso_atual) || 'nenhuma'}` };
}

export function ferramenta_unidade({ slug, opcoes = {} }) {
  const e = carregarEstado(slug);
  const u = calcularUnidade(e, opcoes);
  return { saida: u, resumo: `margem ${u.formatado['margem bruta']} · LTV/CAC ${u.formatado['LTV / CAC']} · alertas: ${u.alertas.length}` };
}

export function ferramenta_rag({ consulta, limite = 3 }) {
  const trechos = contextoRAG(consulta, limite);
  return { saida: trechos, resumo: trechos ? `${trechos.split('---').length} trecho(s) da base BVC` : 'nada encontrado na base' };
}

export function ferramenta_preencher({ slug, artefato }) {
  const chave = String(artefato || '').toLowerCase().trim();
  const tmpl = MAPA_ARTEFATOS[chave];
  if (!tmpl) throw Object.assign(new Error(`Artefato desconhecido: "${artefato}". Disponíveis: ${Object.keys(MAPA_ARTEFATOS).join(', ')}`), { status: 400 });
  const e = carregarEstado(slug);
  const spec = lerJSON(caminhos(slug).spec, {}) || {};
  const ctx = {
    nome: e.nome, autor: spec.autor || '[SEM DADO]', email: spec.email || '[SEM DADO]',
    publico: e.publico, dor: e.dor, resultado: e.resultado_prometido,
    prazo: spec.prazo || '14 dias', preco_setup: e.preco?.setup, preco_mensal: e.preco?.mensal,
    garantia: spec.garantia || 'garantia de satisfação em 30 dias', canal: e.canal_principal,
    stack: e.stack, diferenciais: spec.diferenciais || '[SEM DADO]',
    metrica_sucesso: spec.metrica_sucesso || '[SEM DADO]', data: hoje(),
  };
  const conteudo = renderTemplate(lerTexto(join(TEMPLATES_DIR, tmpl)), ctx);
  const destino = join(caminhos(slug).artefatos, `${chave}.md`);
  salvarTexto(destino, conteudo);
  return { saida: { arquivo: `${chave}.md`, conteudo }, resumo: `artefato "${chave}" gerado (${conteudo.split('\n').length} linhas)` };
}

export function ferramenta_handoff({ slug, de, para, objetivo, saida_esperada, criterios = [], prazo = 'hoje', custo = { tempo_h: 0.5, ia_brl: 1 } }) {
  const dir = caminhos(slug).handoffs;
  const existentes = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).length : 0;
  const handoff = {
    id: `h-${String(existentes + 1).padStart(3, '0')}`, de, para, objetivo, saida_esperada,
    criterios_aceitacao: criterios, prazo, custo_estimado: custo, status: 'pendente',
    criado_em: hoje(), resultado: null, evidencia: [],
  };
  salvarTexto(join(dir, `${handoff.id}.json`), JSON.stringify(handoff, null, 2));
  return { saida: handoff, resumo: `${handoff.id}: ${de} → ${para} (${objetivo})` };
}

export function ferramenta_atualizarEstado({ slug, patch = {}, resumo = '' }) {
  const e = carregarEstado(slug);
  Object.assign(e.metricas, patch.metricas || {});
  Object.assign(e, patch.estado || {});
  if (resumo) registrarHistorico(e, resumo);
  salvarEstado(slug, e);
  return { saida: { ok: true }, resumo: resumo || 'estado atualizado' };
}

export function ferramenta_listarProjetos({}) {
  const projetos = listarProjetos();
  return { saida: projetos, resumo: `${projetos.length} projeto(s) em disco` };
}

export const FERRAMENTAS = {
  portas: ferramenta_portas,
  unidade: ferramenta_unidade,
  rag: ferramenta_rag,
  preencher: ferramenta_preencher,
  handoff: ferramenta_handoff,
  atualizarEstado: ferramenta_atualizarEstado,
  listarProjetos: ferramenta_listarProjetos,
};

/** Executa uma ferramenta registrando no trace (usado pelo loop ReAct). */
export function executarFerramenta(nome, args, trace) {
  const f = FERRAMENTAS[nome];
  const passo = { passo: trace.length + 1, tipo: 'tool', ferramenta: nome, entrada: args, saida: null, erro: null };
  try {
    const r = f(args);
    passo.saida = r.resumo;
    trace.push(passo);
    return r.saida;
  } catch (err) {
    passo.erro = err.message;
    trace.push(passo);
    throw err;
  }
}

export { slugify };
