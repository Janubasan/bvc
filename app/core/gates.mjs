// BVC-OS · Camada L4 — Portas de decisão (guardrails de avanço)
import { num, pct, brl } from './util.mjs';

export const DEFINICOES = {
  G0: {
    nome: 'Dor real', libera: 'construir',
    criterio: '≥ 15 conversas e ≥ 5 com gasto em dinheiro/tempo (declarado pelo cliente)',
    evidenciaAceitavel: 'data + pessoa + citação literal + valor/tempo gasto',
    planoB: 'Faltam conversas → AG-CANAL gera lista e abordagens. Dor errada → troque o público, não o produto.',
  },
  G1: {
    nome: 'Sinal de dinheiro', libera: 'investir em produto',
    criterio: '≥ 3 pagos, pré-pagos ou cartas de intenção assinadas',
    evidenciaAceitavel: 'comprovante de pagamento, link pago, documento assinado',
    planoB: 'Reprovada → reescrever oferta (AG-OFERTA) e mudar a abordagem do canal (AG-CANAL).',
  },
  G2: {
    nome: 'Entrega', libera: 'escalar venda',
    criterio: '1 cliente com métrica antes/depois + depoimento + processo registrado',
    evidenciaAceitavel: 'print/planilha do cliente com números + depoimento autorizado',
    planoB: 'Reprovada → reduzir escopo até o primeiro valor, prazo de 7 dias.',
  },
  G3: {
    nome: 'Recorrência', libera: 'virar produto',
    criterio: '≥ 3 mensalidades ativas + 1 renovação sem desconto temporário',
    evidenciaAceitavel: 'extrato do gateway (2º ciclo pago)',
    planoB: 'Reprovada → criar ritual mensal de valor (relatório + sessão) antes de aumentar preço.',
  },
  G4: {
    nome: 'Canal', libera: 'abrir 2º canal',
    criterio: '≥ 10 clientes originados do mesmo canal + CAC conhecido',
    evidenciaAceitavel: 'origem registrada por cliente + horas e custos do período',
    planoB: 'Reprovada → aumentar volume no canal atual. Resposta < 3% → troque a lista, não a plataforma.',
  },
  G5: {
    nome: 'Margem', libera: 'escalar volume',
    criterio: 'custo de IA + infra < 30% da receita por 2 meses',
    evidenciaAceitavel: 'faturas de API/infra + custo por cliente',
    planoB: 'Reprovada → roteamento por modelo, cache, quantização, cotas — nessa ordem.',
  },
  G6: {
    nome: 'Sistema', libera: 'portfólio / 2º produto',
    criterio: '4 semanas sem intervenção manual crítica + runbooks escritos',
    evidenciaAceitavel: 'lista de tarefas recorrentes com dono (você ou automação)',
    planoB: 'Reprovada → automatizar a tarefa que mais consome tempo antes de abrir novo produto.',
  },
};

/** Auditoria determinística das portas: devolve status + o que falta + menor caminho. */
export function auditar(estado) {
  const m = estado.metricas || {};
  const conversas = num(m.conversas, 0);
  const pagos = num(m.clientes_pagos, 0);
  const receita = num(m.receita_recebida, 0);
  const custoIA = num(m.custo_ia_mes, 0);
  const porCanal = num(m.clientes_por_canal, 0);
  const entregas = num(m.entregas_medidas, 0);
  const renovacoes = num(m.renovacoes, 0);
  const churn = num(m.churn_pct, null);
  const margemIA = receita > 0 ? (100 * custoIA) / receita : null;

  const r = {};
  r.G0 = {
    status: conversas >= 15 ? 'aprovada' : 'pendente',
    medido: `${conversas}/15 conversas`,
    falta: conversas >= 15 ? [] : [`${15 - conversas} conversas de descoberta`, 'registro do gasto atual (R$ ou horas) por cliente'],
  };
  r.G1 = {
    status: pagos >= 3 ? 'aprovada' : 'pendente',
    medido: `${pagos}/3 pagos ou pré-pagos`,
    falta: pagos >= 3 ? [] : [`${3 - pagos} sinais de dinheiro (pagamento, pré-venda ou carta assinada)`],
  };
  r.G2 = {
    status: entregas >= 1 ? 'aprovada' : 'pendente',
    medido: `${entregas} entrega(s) com métrica antes/depois`,
    falta: entregas >= 1 ? [] : ['medir antes/depois com 1 cliente', 'depoimento autorizado por escrito'],
  };
  r.G3 = {
    status: pagos >= 3 && renovacoes >= 1 ? 'aprovada' : 'pendente',
    medido: `${pagos} mensalidade(s) ativa(s), ${renovacoes} renovação(ões)`,
    falta: [pagos < 3 ? `${3 - pagos} mensalidade(s) ativa(s)` : null, renovacoes < 1 ? '1 renovação sem desconto' : null].filter(Boolean),
  };
  r.G4 = {
    status: porCanal >= 10 ? 'aprovada' : 'pendente',
    medido: `${porCanal}/10 clientes do mesmo canal`,
    falta: [porCanal < 10 ? `${10 - porCanal} clientes originados do mesmo canal` : null, 'CAC calculado com horas e custos reais'].filter(Boolean),
  };
  r.G5 = {
    status: margemIA === null ? 'pendente' : margemIA < 30 ? 'aprovada' : 'reprovada',
    medido: margemIA === null ? '[SEM DADO] receita ainda zero' : `custo de IA = ${pct(margemIA)} da receita (limite 30%)`,
    falta: margemIA === null ? ['receita recebida e custo de IA registrados'] : margemIA >= 30 ? ['reduzir custo de IA (roteamento/cache/cotas)'] : [],
  };
  r.G6 = {
    status: 'pendente',
    medido: 'depende de 4 semanas de operação estável',
    falta: ['rodar 4 semanas sem intervenção manual crítica', 'escrever runbooks das rotinas'],
  };

  // Decisão humana registrada com evidência (aba Portas) sobrepõe a leitura automática.
  const manuais = estado.portas || {};
  for (const [g, st] of Object.entries(manuais)) {
    if (!r[g] || !['aprovada', 'reprovada'].includes(st)) continue;
    if (st === r[g].status) continue;
    const evidencias = (estado.evidencias?.[g] || []).slice(-1)[0];
    r[g] = {
      ...r[g],
      status: st,
      manual: true,
      medido: r[g].medido + (evidencias ? ` · decisão humana: ${evidencias.texto}` : ' · decisão humana sem evidência'),
      falta: st === 'aprovada' ? [] : r[g].falta,
    };
  }

  const aprovadas = Object.entries(r).filter(([, v]) => v.status === 'aprovada').map(([k]) => k);
  const reprovadas = Object.entries(r).filter(([, v]) => v.status === 'reprovada').map(([k]) => k);
  return {
    portas: r,
    aprovadas,
    reprovadas,
    resumo: `${aprovadas.length}/7 aprovadas${reprovadas.length ? ' · reprovadas: ' + reprovadas.join(', ') : ''}`,
    unidade: {
      ticket: num(estado.preco?.mensal, null),
      receita, custoIA, margemIA, churn,
      custoPorCliente: pagos > 0 ? custoIA / pagos : null,
    },
  };
}

export function proximaPortaBloqueante(auditoria, percurso = 'P1') {
  const ordem = { P1: ['G0', 'G1', 'G2'], P2: ['G3'], P3: ['G3'], P4: ['G4'], P5: ['G5', 'G6'] }[percurso] || ['G0'];
  const doPercurso = ordem.find((g) => auditoria.portas[g].status !== 'aprovada');
  if (doPercurso) return doPercurso;
  const global = ['G0', 'G1', 'G2', 'G3', 'G4', 'G5'];
  return global.find((g) => auditoria.portas[g].status !== 'aprovada') || null;
}

export function linhaPortuguesa(auditoria) {
  return Object.entries(auditoria.portas)
    .map(([g, v]) => `${g} ${v.status === 'aprovada' ? '✅' : v.status === 'reprovada' ? '❌' : '⏳'} (${v.medido})`)
    .join(' · ');
}

export { brl };
