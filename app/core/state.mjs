// BVC-OS · estado do negócio (a memória do sistema)
import { existsSync } from 'node:fs';
import { caminhos, lerJSON, salvarJSON, hoje } from './util.mjs';

export const PORTAS = ['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

export function estadoPadrao(slug, spec = {}) {
  return {
    slug,
    nome: spec.nome || slug,
    percurso_atual: 'P1',
    etapa: 'validacao',
    publico: spec.publico || '[SEM DADO]',
    dor: spec.dor || '[SEM DADO]',
    resultado_prometido: spec.resultado || '[SEM DADO]',
    preco: { setup: spec.preco_setup || '[SEM DADO]', mensal: spec.preco_mensal || '[SEM DADO]' },
    canal_principal: spec.canal || '[SEM DADO]',
    stack: spec.stack || '[SEM DADO]',
    metricas: {
      conversas: 0, mensagens_enviadas: 0, respostas: 0, testes: 0,
      clientes_pagos: 0, clientes_novos: 0, clientes_por_canal: 0,
      mrr: 0, receita_recebida: 0, caixa_usado: 0, horas_trabalhadas: 0,
      churn_pct: null, ativacao_pct: null, custo_ia_mes: 0,
      entregas_medidas: 0, renovacoes: 0,
    },
    portas: Object.fromEntries(PORTAS.map((g) => [g, 'pendente'])),
    evidencias: Object.fromEntries(PORTAS.map((g) => [g, []])),
    experimentos: [], riscos: [], decisoes: [], historico: [],
    proximo_passo: 'Rodar /iniciar e validar a dor (G0): 15 conversas, 5 com gasto declarado.',
    ultima_atualizacao: hoje(),
  };
}

export function carregarEstado(slug) {
  const { estado } = caminhos(slug);
  if (!existsSync(estado)) throw Object.assign(new Error(`Projeto "${slug}" não encontrado. Crie em "Começar".`), { status: 404 });
  const e = lerJSON(estado, null);
  // migração defensiva: garante campos novos
  const base = estadoPadrao(slug);
  e.metricas = { ...base.metricas, ...(e.metricas || {}) };
  e.portas = { ...base.portas, ...(e.portas || {}) };
  e.evidencias = { ...base.evidencias, ...(e.evidencias || {}) };
  return e;
}

export function salvarEstado(slug, estado) {
  estado.ultima_atualizacao = hoje();
  salvarJSON(caminhos(slug).estado, estado);
  return estado;
}

export function atualizarMetricas(slug, patch = {}) {
  const e = carregarEstado(slug);
  for (const [k, v] of Object.entries(patch)) {
    if (v === '' || v === undefined) continue;
    e.metricas[k] = v;
  }
  registrarHistorico(e, `métricas atualizadas: ${Object.keys(patch).join(', ')}`);
  return salvarEstado(slug, e);
}

export function registrarHistorico(estado, resumo) {
  estado.historico = estado.historico || [];
  estado.historico.push({ data: hoje(), resumo });
  if (estado.historico.length > 200) estado.historico = estado.historico.slice(-200);
}

export function registrarDecisao(slug, decisao) {
  const e = carregarEstado(slug);
  e.decisoes = e.decisoes || [];
  e.decisoes.push({ data: hoje(), ...decisao });
  return salvarEstado(slug, e);
}

export function aplicarAprovacaoPorta(slug, gate, status, evidencia = '') {
  if (!PORTAS.includes(gate)) throw Object.assign(new Error(`Porta inválida: ${gate}`), { status: 400 });
  const e = carregarEstado(slug);
  e.portas[gate] = status;
  if (evidencia) {
    e.evidencias[gate] = e.evidencias[gate] || [];
    e.evidencias[gate].push({ data: hoje(), texto: evidencia });
  }
  e.decisoes.push({ data: hoje(), tipo: 'porta', resumo: `${gate} ${status}: ${evidencia || 'sem evidência textual'}` });
  return salvarEstado(slug, e);
}
