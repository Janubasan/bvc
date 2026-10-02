// BVC-OS · Unidade econômica (AG-CAIXA)
import { num, brl, pct } from './util.mjs';

export const LIMITES = { margem: 70, custoIA: 30, ltvCac: 3, payback: 12, runway: 6, clienteMax: 40 };

export function calcularUnidade(estado, opcoes = {}) {
  const m = estado.metricas || {};
  const ticket = num(estado.preco?.mensal, null);
  const clientes = num(m.clientes_pagos, 0);
  const novos = num(m.clientes_novos, opcoes.clientesNovos ?? (clientes || null));
  const receita = num(m.receita_recebida, 0);
  const custoIA = num(m.custo_ia_mes, 0);
  const churn = num(m.churn_pct, null);
  const horas = num(opcoes.horas, num(m.horas_trabalhadas, null));
  const valorHora = num(opcoes.valorHora, 50) ?? 50;
  const ferramentas = num(opcoes.ferramentas, 0) ?? 0;
  const caixa = num(opcoes.caixa, null);
  const custoFixo = num(opcoes.custoFixo, null);

  const custoAquisicao = horas === null ? null : horas * valorHora + ferramentas;
  const cac = custoAquisicao !== null && novos ? custoAquisicao / novos : null;
  const ltv = ticket && churn ? ticket / (churn / 100) : null;
  const ltvCac = ltv && cac ? ltv / cac : null;
  const margemBruta = receita > 0 ? ((receita - custoIA) / receita) * 100 : null;
  const payback = cac && ticket && margemBruta ? cac / (ticket * (margemBruta / 100)) : null;
  const custoIACliente = clientes > 0 ? custoIA / clientes : null;
  const runway = caixa && custoFixo ? caixa / custoFixo : null;

  const alertas = [];
  if (margemBruta !== null && margemBruta < LIMITES.margem) alertas.push(`Margem bruta ${pct(margemBruta)} abaixo de ${LIMITES.margem}% — reduza custo de IA ou reprecifique.`);
  if (custoIACliente !== null && ticket && custoIACliente > 0.10 * ticket) alertas.push(`Custo de IA por cliente (${brl(custoIACliente)}) acima de 10% do ticket.`);
  if (ltvCac !== null && ltvCac < LIMITES.ltvCac) alertas.push(`LTV/CAC ${ltvCac.toFixed(2)} abaixo de ${LIMITES.ltvCac} — canal não é sustentável.`);
  if (payback !== null && payback > LIMITES.payback) alertas.push(`Payback ${payback.toFixed(1)} meses acima de ${LIMITES.payback} — reforce oferta/ticket.`);
  if (runway !== null && runway < LIMITES.runway) alertas.push(`Runway ${runway.toFixed(1)} meses abaixo de ${LIMITES.runway} — modo P1 (caixa rápido).`);
  if (margemBruta !== null && 100 * (custoIA / (receita || 1)) > LIMITES.custoIA) alertas.push(`Custo de IA = ${pct(100 * custoIA / receita)} da receita (limite ${LIMITES.custoIA}%) — bloqueia G5.`);
  if (churn !== null && churn > 8) alertas.push(`Churn ${pct(churn)} acima de 8% — problema de retenção/onboarding é prioridade antes de escalar.`);

  const acoes = [];
  if (custoIACliente !== null && ticket && custoIACliente > 0.05 * ticket) acoes.push('Rotear tarefas simples para modelo menor e cachear respostas repetidas (docs/04).');
  if (cac !== null && ltvCac !== null && ltvCac < LIMITES.ltvCac) acoes.push('Subir ticket (plano superior/anual) ou reduzir horas por cliente com automação.');
  if (churn !== null && churn > 5) acoes.push('Onboarding de 7 dias + ritual mensal de valor para reduzir cancelamento.');
  if (receita > 0) acoes.push('Provisionar 10-15% da receita para impostos e revisar preço a cada 10 clientes.');

  return {
    painel: {
      ticketMensal: ticket, clientes, mrr: num(m.mrr, 0), receitaRecebida: receita,
      cac, ltv, ltvCac, paybackMeses: payback, margemBrutaPct: margemBruta,
      custoIAMes: custoIA, custoIAPorCliente: custoIACliente, runwayMeses: runway,
      horasPeriodo: horas, custoAquisicao,
    },
    alertas, acoes,
    formatado: {
      'ticket mensal': brl(ticket), clientes: String(clientes), MRR: brl(num(m.mrr, 0)),
      'receita recebida': brl(receita), CAC: brl(cac), LTV: brl(ltv),
      'LTV / CAC': ltvCac === null ? '[SEM DADO]' : ltvCac.toFixed(2),
      payback: payback === null ? '[SEM DADO]' : `${payback.toFixed(2)} meses`,
      'margem bruta': margemBruta === null ? '[SEM DADO]' : pct(margemBruta),
      'custo de IA / mês': brl(custoIA), 'custo de IA / cliente': brl(custoIACliente),
      runway: runway === null ? '[SEM DADO]' : `${runway.toFixed(2)} meses`,
    },
  };
}
