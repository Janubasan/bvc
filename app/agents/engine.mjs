// BVC-OS · Motor agêntico
// Padrões: plan-and-execute (planejar) → react-tool-loop (ferramentas) → reflexion (autocrítica)
//          → handoff (delegação tipada) → guardrails + HITL (L4). LLM é opcional: sem chave,
//          o motor produz tudo de forma determinística com os dados reais do estado.
import { carregarEstado, salvarEstado, registrarHistorico } from '../core/state.mjs';
import { auditar, proximaPortaBloqueante, DEFINICOES } from '../core/gates.mjs';
import { calcularUnidade } from '../core/unit.mjs';
import { brl, pct, num } from '../core/util.mjs';
import { executarFerramenta } from './tools.mjs';
import { L0, L1, L2, PADROES } from './registry.mjs';

// ---------------------------------------------------------------- planejamento
export function parseComando(comando = '/status') {
  const limpo = String(comando).trim();
  const [cmdRaw, ...resto] = limpo.split(/\s+/);
  const cmd = cmdRaw.replace(/^\//, '').toLowerCase() || 'status';
  return { cmd, arg: resto.join(' ').trim(), bruto: limpo };
}

export function detectarVazamento(estado, portas, unidade) {
  const m = estado.metricas || {};
  const churn = num(m.churn_pct, null);
  const margem = unidade?.painel?.margemBrutaPct ?? null;
  const clientes = num(m.clientes_pagos, 0);

  if (num(m.conversas, 0) < 15) return { vazamento: 'aquisição — dados insuficientes (G0)', alavanca: 'completar 15 conversas de descoberta, registrando o gasto atual de cada uma', agente: 'AG-VALIDA' };
  if (clientes < 3) return { vazamento: 'conversão — dor provada, dinheiro não', alavanca: 'pré-venda de fundador para 3 clientes (link de pagamento + garantia)', agente: 'AG-OFERTA' };
  if (num(m.entregas_medidas, 0) < 1) return { vazamento: 'entrega/ativação — sem resultado medido', alavanca: 'medir antes/depois com o primeiro cliente e capturar depoimento', agente: 'AG-ENTREGA' };
  if (churn !== null && churn > 8) return { vazamento: 'retenção — churn acima de 8%', alavanca: 'onboarding de 7 dias + ritual mensal de valor', agente: 'AG-CAIXA' };
  if (num(m.renovacoes, 0) < 1) return { vazamento: 'recorrência — primeira renovação não aconteceu', alavanca: 'empacotar mensalidade e entregar relatório de valor mensal', agente: 'AG-CAIXA' };
  if (margem !== null && margem < 70) return { vazamento: 'margem — custo de IA/infra alto', alavanca: 'roteamento por modelo + cache + cotas por plano', agente: 'AG-CAIXA' };
  if (num(m.clientes_por_canal, 0) < 10) return { vazamento: 'escala de canal — poucos clientes por canal', alavanca: '90 dias de conteúdo/outbound no canal principal até 10 clientes', agente: 'AG-CANAL' };
  return { vazamento: 'sistema — operação ainda manual', alavanca: 'automatizar rotinas críticas e escrever runbooks (G6)', agente: 'AG-ENTREGA' };
}

function movimentosDisponiveis(estado, portas) {
  if ((portas.reprovadas || []).length) return 'CONSERTAR';          // porta reprovada = consertar antes de tudo
  const bloqueante = proximaPortaBloqueante(portas, estado.percurso_atual);
  if (!bloqueante) return 'AVANCAR';                                  // percurso livre: avançar
  const m = estado.metricas || {};
  const temDados = num(m.conversas, 0) >= 15 || num(m.receita_recebida, 0) > 0;
  return temDados ? 'CONSERTAR' : 'MEDIR';                           // sem dados: medir; com dados: consertar o gargalo
}

// ---------------------------------------------------------------- handoffs
function planejarHandoffs({ estado, portas, vazamento, cmd, arg }) {
  const base = { custo: { tempo_h: 0.5, ia_brl: 1 } };
  const H = [];
  const C = (texto) => texto;

  if (vazamento.agente === 'AG-VALIDA') {
    H.push({ de: 'AG-CANAL', para: 'sdr', objetivo: 'conseguir novas conversas de descoberta', saida_esperada: '20 abordagens personalizadas + lista de 30 contatos qualificados', criterios: [C('cada mensagem com referência real (nada genérico)'), C('1 pergunta por mensagem'), C('opt-out presente'), C('≤ 90 palavras')], prazo: '+3 dias', custo: { tempo_h: 1.5, ia_brl: 2 } });
    H.push({ de: 'AG-VALIDA', para: 'entrevistador', objetivo: 'extrair custo atual e tentativa anterior das conversas', saida_esperada: 'tabela com citação literal, custo declarado e classificação DOR PAGA/LATENTE/NÃO É DOR', criterios: [C('toda dor com citação'), C('todo sinal classificado em 1 linha')], prazo: 'hoje', custo: { tempo_h: 0.7, ia_brl: 1 } });
  } else if (vazamento.agente === 'AG-OFERTA') {
    H.push({ de: 'AG-OFERTA', para: 'copywriter', objetivo: 'oferta de fundador pronta para pré-venda', saida_esperada: 'oferta em 1 frase + 3 planos + garantia + 10 objeções com resposta', criterios: [C('preço ancorado no custo citado pelo cliente'), C('garantia verificável'), C('sem promessa de renda')], prazo: '+2 dias', custo: { tempo_h: 1, ia_brl: 1.5 } });
    H.push({ de: 'AG-CANAL', para: 'sdr', objetivo: 'abrir 20 conversas com a oferta nova', saida_esperada: '20 abordagens + cadência de 14 dias', criterios: [C('mensagem ≤ 90 palavras'), C('1 CTA único')], prazo: '+3 dias', custo: { tempo_h: 1.5, ia_brl: 2 } });
  } else if (vazamento.agente === 'AG-ENTREGA') {
    H.push({ de: 'AG-ENTREGA', para: 'engenheiro-de-produto', objetivo: 'plano de entrega com marcos e medição antes/depois', saida_esperada: 'marcos + stack com custo em 100 clientes + MVP 5 dias + QA de 20 casos', criterios: [C('primeiro valor em < 5 minutos'), C('logs, cotas e fallback definidos'), C('licenças compatíveis (docs/03 e docs/04)')], prazo: '+2 dias', custo: { tempo_h: 2, ia_brl: 3 } });
    H.push({ de: 'AG-ENTREGA', para: 'qa-avaliador', objetivo: 'validar a entrega contra critérios antes do go-live', saida_esperada: 'aprovado/reprovado por critério + 3 casos que quebram', criterios: [C('1 critério não atendido = reprovado'), C('correção acionável por reprovação')], prazo: '+4 dias', custo: { tempo_h: 0.8, ia_brl: 1 } });
  } else if (vazamento.agente === 'AG-CAIXA') {
    H.push({ de: 'AG-CAIXA', para: 'financeiro', objetivo: 'painel de 8 números + fluxo de 90 dias', saida_esperada: 'fluxo em 3 cenários + provisão de impostos + margem por plano', criterios: [C('números conferem com o estado'), C('toda recomendação com efeito em R$')], prazo: '+1 dia', custo: { tempo_h: 1, ia_brl: 1 } });
    H.push({ de: 'AG-CAIXA', para: 'analista-de-dados', objetivo: 'encontrar o ponto de vazamento do funil', saida_esperada: 'funil com números + vazamento + experimento mais barato', criterios: [C('impacto em R$/mês'), C('hipótese testável em 7 dias')], prazo: 'hoje', custo: { tempo_h: 0.7, ia_brl: 1 } });
  } else {
    H.push({ de: 'AG-CANAL', para: 'copywriter', objetivo: 'produzir a semana de conteúdo e abordagens do canal principal', saida_esperada: '5 peças (40/30/20/10) + 10 abordagens + 1 post longo', criterios: [C('um único canal'), C('CTA único por peça'), C('prova com número real')], prazo: '+2 dias', custo: { tempo_h: 2, ia_brl: 2 } });
    H.push({ de: 'AG-ENTREGA', para: 'engenheiro-de-produto', objetivo: 'automatizar a tarefa mais repetida da semana', saida_esperada: 'automação com gatilho, guardrails e log + checklist de QA', criterios: [C('roda sem intervenção manual'), C('custo por execução medido'), C('aprovação humana em ação crítica')], prazo: '+5 dias', custo: { tempo_h: 3, ia_brl: 4 } });
  }

  if (cmd === 'canal') H.push({ de: 'AG-CANAL', para: 'analista-de-dados', objetivo: `medir o canal ${arg || estado.canal_principal}`, saida_esperada: 'contatos, respostas, conversas, clientes e CAC do canal', criterios: [C('CAC com horas e custos reais'), C('taxa de resposta por lote')], prazo: '+7 dias', custo: { tempo_h: 0.5, ia_brl: 0.5 } });
  if (cmd === 'entrega') H.push({ de: 'L0', para: 'guardiao-lgpd', objetivo: 'revisar dados, licenças e consentimentos da entrega', saida_esperada: 'tabela de riscos + correções priorizadas', criterios: [C('dado pessoal com base legal'), C('licença compatível com uso comercial')], prazo: '+1 dia', custo: { tempo_h: 0.5, ia_brl: 0.5 } });
  return H;
}

// ---------------------------------------------------------------- artefatos determinísticos
function tabela(cabecalhos, linhas) {
  return [`| ${cabecalhos.join(' | ')} |`, `|${cabecalhos.map(() => '---').join('|')}|`, ...linhas.map((l) => `| ${l.join(' | ')} |`)].join('\n');
}

function artefatoStatus(estado, portas, unidade) {
  const linhas = Object.entries(portas.portas).map(([g, v]) => [g, DEFINICOES[g].nome, v.status === 'aprovada' ? '✅ aprovada' : v.status === 'reprovada' ? '❌ reprovada' : '⏳ pendente', v.medido]);
  return `### Portas de decisão\n\n${tabela(['Porta', 'Nome', 'Status', 'Medido'], linhas)}\n\n### Unidade econômica\n\n${tabela(['Indicador', 'Valor'], Object.entries(unidade.formatado).map(([k, v]) => [k, v]))}`;
}

const PLAYBOOKS = {
  x: { nome: 'X (Twitter)', regras: ['1 canal, cadência diária: 1 post principal + 2 curtos', '20 respostas com valor por dia em contas maiores do nicho', 'Rodízio 40% didático / 30% construção / 20% prova / 10% oferta', 'Threads 1-2 por semana com CTA único'], cronograma: ['D1 teaser da dor', 'D2 demo em vídeo de 60s', 'D3 prova do 1º resultado', 'D4 objeção respondida', 'D5 bastidores/erro', 'D6 oferta clara (10 vagas)', 'D7 resultado público'] },
  reddit: { nome: 'Reddit', regras: ['Conta com 30+ dias e 50+ karma antes de promover', 'Comentar 20× com valor antes de postar com link', 'Post = história + dados + passo a passo replicável', 'Responder TODOS os comentários nas 3 primeiras horas'], cronograma: ['S1 só comentários úteis', 'S2 post de história sem produto', 'S3 post "como resolvi" com números', 'S4 post de resultado + pedido de feedback'] },
  linkedin: { nome: 'LinkedIn', regras: ['4 posts/semana + 10 DMs úteis/dia', 'Post de 5-8 linhas com 1 ideia e 1 pergunta', 'Estudo de caso com número no título', 'DM sempre com contexto real da empresa'], cronograma: ['Seg insight do setor', 'Ter caso com números', 'Qua bastidor/erro', 'Qui oferta suave', 'Sex resumo + pergunta'] },
  outbound: { nome: 'Outbound (e-mail + DM)', regras: ['Lista segmentada de 30-100 contatos/semana', 'Referência específica real na 1ª linha', 'Máx 90 palavras, 1 pergunta, opt-out', 'Cadência: D1, D3, D5, D8, D10, D14'], cronograma: ['D1 e-mail 1 (referência)', 'D3 DM', 'D5 e-mail 2 (caso)', 'D8 engajamento público', 'D10 e-mail 3 (pergunta única)', 'D14 encerramento educado'] },
  seo: { nome: 'SEO programático', regras: ['1 página por combinação [produto] × [tipo de negócio]', 'Cada página com dado próprio (não texto genérico)', 'Publicar 30-100 páginas por ciclo', 'Medir por página: impressões → cliques → conversas'], cronograma: ['D1 pesquisa de 100 combinações', 'D2-3 template + 20 páginas', 'D4-5 publicar + indexar', 'D6 medir e podar', 'D7 planejar próximo lote'] },
};

function artefatoCanal(estado, arg) {
  const chave = (arg || '').toLowerCase().split(/\s+/)[0];
  const p = PLAYBOOKS[chave] || PLAYBOOKS.x;
  const oferta = `ajudar ${estado.publico} a ${estado.resultado_prometido}`;
  return `## Playbook — ${p.nome}\n\n**Oferta em uso:** ${oferta}\n**Preço:** setup ${estado.preco?.setup} · mensal ${estado.preco?.mensal}\n\n### Regras do canal\n${p.regras.map((r) => `- ${r}`).join('\n')}\n\n### Cronograma de 7 dias\n${p.cronograma.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n### 5 peças da semana (esqueleto pronto)\n${tabela(['#', 'Tipo', 'Hook', 'CTA'], [
    ['1', 'didático', `Como ${estado.publico} resolve ${estado.dor} hoje (e o custo escondido)`, 'seguir para o próximo passo'],
    ['2', 'construção', 'O que eu aprendi construindo isso nesta semana (com números)', 'comentar o que você faria'],
    ['3', 'prova', 'Antes: [número do cliente] · Depois: [número]', 'ver o estudo de caso'],
    ['4', 'didático', '3 erros que custam caro em [setor]', 'salvar para depois'],
    ['5', 'oferta', '10 vagas de fundador: [resultado] em [prazo]', 'pedir acesso'],
  ])}\n\n### Métricas a coletar\n- contatos · respostas · conversas · clientes · custo (horas × valor-hora + ferramentas) · CAC\n\n> Aviso de plataforma: respeite as regras de cada comunidade (self-promotion, link, frequência). Lista própria > audiência alugada.`;
}

function artefatoEntrega(estado, arg) {
  const processo = arg || estado.dor;
  return `## Desenho de entrega/automação\n\n**Processo:** ${processo}\n**Stack atual do projeto:** ${estado.stack}\n\n### Arquitetura em camadas\n${[
    'Gatilho (cron, webhook, e-mail, mensagem, clique)',
    'Contexto (dados do cliente + regras + RAG sobre documentos)',
    'Modelo (barato para classificar; forte para decidir/escrever)',
    'Ferramentas (API, banco, PDF, notificação, navegador)',
    'Guardrails (validação de schema, cotas, aprovação humana)',
    'Log & custo (Langfuse/planilha: tokens, R$, latência)',
  ].map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n### Stack recomendada com custo em 100 clientes\n${tabela(['Camada', 'Escolha', 'Custo estimado'], [
    ['Backend/DB', 'Supabase ou PocketBase', 'US$ 0-25/mês'],
    ['Front', 'Next.js + shadcn/ui', 'US$ 0-20/mês (Vercel)'],
    ['IA', 'API de LLM + cache + fallback (litellm)', 'R$ 50-500/mês conforme volume'],
    ['Modelo local (opcional)', 'llama.cpp/Ollama com GGUF (docs/04)', 'GPU alugada US$ 0,10-0,70/h'],
    ['Observabilidade', 'PostHog + Langfuse (self-host)', 'US$ 0-30/mês'],
  ])}\n\n### MVP em 5 dias\n${['D1: schema + caminho do primeiro valor', 'D2: integração de IA com cache e cotas', 'D3: cobrança (Stripe/Mercado Pago) + planos', 'D4: onboarding + telemetria de custo', 'D5: QA de 20 casos + deploy'].map((d) => `- ${d}`).join('\n')}\n\n### Riscos e mitigação\n- **Alucinação** → RAG + "não sei" explícito + validação de schema\n- **Custo** → roteamento por tarefa + cache + cota por plano (alerta em 70%)\n- **Licença** → conferir docs/03 e docs/04 antes de embutir em produto fechado\n- **LGPD** → base legal, minimização e retenção definidas (docs/10)`;
}

function artefatoValidar(estado, arg) {
  const hipotese = arg || `${estado.publico} paga ${estado.preco?.mensal} por ${estado.resultado_prometido} porque hoje perde ${estado.dor}`;
  return `## Teste de 7 dias\n\n**Hipótese:** ${hipotese}\n\n${tabela(['Dia', 'Ação', 'Critério de avanço'], [
    ['1', '20 conversas (DM/e-mail/telefone)', '≥ 8 respostas'],
    ['2', '20 conversas novas + pergunta de dinheiro', '≥ 5 já gastam algo'],
    ['3', 'página de 1 tela + coleta de e-mail', '≥ 10 e-mails'],
    ['4', 'pré-venda: preço + prazo + garantia', '≥ 3 pagos/assinados'],
    ['5', '5 concorrentes e preços', 'faixa de preço conhecida'],
    ['6', '3 entrevistas de 30 min', 'trabalho a ser feito claro'],
    ['7', 'decisão', 'seguir / ajustar / matar'],
  ])}\n\n**Critério de aprovação:** ≥ 3 sinais de dinheiro. **Critério de morte:** 0 sinais após 60 contatos com oferta revisada.\n\n> Sem sinal de dinheiro, o problema é a promessa ou o público — não a tecnologia.`;
}

function artefatoCaixa(estado, unidade) {
  const p = unidade.painel;
  return `## Painel de caixa\n\n${tabela(['Indicador', 'Valor'], Object.entries(unidade.formatado).map(([k, v]) => [k, v]))}\n\n### Alertas\n${unidade.alertas.length ? unidade.alertas.map((a) => `- ⚠️ ${a}`).join('\n') : '- nenhum (ou dados insuficientes)'}\n\n### 3 ações para melhorar margem\n${unidade.acoes.length ? unidade.acoes.slice(0, 3).map((a) => `- ${a}`).join('\n') : '- registrar receita, custo de IA e horas para habilitar o diagnóstico'}\n\n### Regras de proteção\n- Custo de IA + infra < 30% da receita\n- Nenhum cliente > 40% da receita\n- Reserva de impostos de 10-15% de cada entrada\n- MRR não é caixa: pró-labore fixo e reserva separados\n${p.runwayMeses !== null ? `\n**Runway:** ${p.runwayMeses.toFixed(1)} meses` : ''}`;
}

function artefatoPorteiro(auditoria, gate) {
  const g = auditoria.portas[gate];
  const d = DEFINICOES[gate];
  return `## Auditoria da porta ${gate} — ${d.nome}\n\n**Status:** ${g.status} · **Medido:** ${g.medido}\n\n**Critério oficial:** ${d.criterio}\n\n**Evidência aceitável:** ${d.evidenciaAceitavel}\n\n### O que falta\n${g.falta.length ? g.falta.map((f) => `- ${f}`).join('\n') : '- nada: porta aprovada ✅'}\n\n### Menor caminho para aprovar\n${g.falta.length ? `1. Gerar a evidência que falta (ver lista acima) com 1 handoff para o agente responsável.\n2. Registrar a evidência no estado (data + fonte + número).\n3. Reauditar: \`/porteiro ${gate}\`.` : '- manter a evidência registrada e avançar para a próxima porta.'}\n\n**Se reprovada:** ${d.planoB}\n\n**Libera:** ${d.libera}`;
}

function artefatoEscalar(estado, portas) {
  const bloqueante = proximaPortaBloqueante(portas, estado.percurso_atual);
  return `## Caminho de escala\n\n**Porta bloqueante agora:** ${bloqueante || 'nenhuma'} · **Percurso:** ${estado.percurso_atual}\n\n${tabela(['Frente', 'Próximo módulo', 'Gatilho para começar', 'Risco'], [
    ['Produto', '2ª vertical vendendo para a mesma base', 'churn < 4% e margem > 70% por 2 meses', 'diluir foco'],
    ['Distribuição', 'parceiros/white-label com comissão recorrente', 'G4 aprovada (10 clientes/canal, CAC conhecido)', 'dependência de parceiro'],
    ['Operação', 'automação do onboarding, cobrança e suporte (G6)', '4 semanas com rotina manual repetida', 'automatizar processo ruim'],
    ['Agentes', 'novo agente L1 (ex.: AG-PARCEIROS) com prompt + critérios', 'tarefa repetida 3× por semana', 'agente sem dono de decisão'],
    ['Capital', 'comprar micro-SaaS (modelo 12 do docs/01)', 'MRR próprio > R$ 20 mil e caixa de 6 meses', 'passivo escondido'],
  ])}\n\n> Escalar = adicionar módulo, nunca reescrever. Um módulo novo entra como prompt + entrada no registro de agentes + critérios de aceitação.`;
}

function acaoDeHoje(estado, vazamento, portas) {
  const m = estado.metricas || {};
  if (num(m.conversas, 0) < 15) return `Enviar 10 abordagens personalizadas (use \`/canal ${estado.canal_principal && estado.canal_principal !== '[SEM DADO]' ? 'outbound' : 'x'}\`) e registrar cada resposta no painel. Sucesso = ≥ 2 respostas hoje.`;
  if (num(m.clientes_pagos, 0) < 3) return 'Fazer 2 diagnósticos de 30 min e enviar proposta no mesmo dia (com link de pagamento). Sucesso = 1 proposta enviada com preço e prazo.';
  if (num(m.entregas_medidas, 0) < 1) return 'Combinar por escrito o número do antes/depois com o cliente e criar a planilha de medição. Sucesso = métrica-base registrada hoje.';
  if (vazamento.vazamento.startsWith('retenção')) return 'Ligar para os 3 clientes mais recentes e mapear onde o produto não entrou na rotina. Sucesso = 3 conversas e 1 melhoria agendada.';
  return `Executar a alavanca da semana: ${vazamento.alavanca}. Sucesso = evidência registrada no estado até o fim do dia.`;
}

// ---------------------------------------------------------------- reflexion (autocrítica)
export function reflexion({ blocos, estado, portas, handoffs }) {
  const criticas = [];
  const texto = Object.values(blocos).join('\n');
  for (const proibido of [/garantimos? (renda|lucro)/i, /lucro garantido/i, /enriquecimento garantido/i, /renda garantida/i]) {
    if (proibido.test(texto)) criticas.push({ codigo: 'E-PROMESSA', gravidade: 'bloqueante', motivo: 'promessa de renda/lucro detectada no texto' });
  }
  if (!handoffs?.length) criticas.push({ codigo: 'E-ESCOPO', gravidade: 'aviso', motivo: 'nenhum handoff definido: a ação ficará sem dono' });
  for (const h of handoffs || []) {
    const criterios = h.criterios_aceitacao || h.criterios || [];
    if (!criterios.length) criticas.push({ codigo: 'E-FMT', gravidade: 'bloqueante', motivo: `handoff ${h.de} → ${h.para} sem critério de aceitação` });
    if (!h.saida_esperada) criticas.push({ codigo: 'E-FMT', gravidade: 'bloqueante', motivo: `handoff ${h.de} → ${h.para} sem saída esperada` });
  }
  const semDado = (estado.publico === '[SEM DADO]' || estado.dor === '[SEM DADO]');
  if (semDado && /margem bruta \d/.test(texto)) criticas.push({ codigo: 'E-DADO', gravidade: 'aviso', motivo: 'cálculo apresentado com campos essenciais [SEM DADO]' });
  const canais = new Set((texto.match(/reddit|linkedin|outbound|programático/gi) || []).map((s) => s.toLowerCase()));
  if (canais.size > 2) criticas.push({ codigo: 'E-ESCOPO', gravidade: 'aviso', motivo: 'mais de 2 canais citados: lembre a regra de 1 canal por 90 dias' });
  return criticas;
}

export function guardrails(criticas) {
  return {
    aprovado: !criticas.some((c) => c.gravidade === 'bloqueante'),
    bloqueantes: criticas.filter((c) => c.gravidade === 'bloqueante'),
    avisos: criticas.filter((c) => c.gravidade === 'aviso'),
    codigos: [...new Set(criticas.map((c) => c.codigo))],
  };
}

export function exigenciasHITL(cmd, estado, handoffs) {
  const itens = [];
  if (/oferta|preco|preço|preencher/.test(cmd)) itens.push('Preço e promessa: confirme manualmente antes de enviar ao cliente.');
  if (cmd === 'canal') itens.push('Disparo/abordagem: revise a lista e respeite as regras da plataforma (sem disparo em massa).');
  if (cmd === 'entrega') itens.push('Contrato, dados do cliente e licenças: aprovação humana obrigatória antes do go-live.');
  if (cmd === 'escalar') itens.push('Gasto acima de 10% do caixa ou ação irreversível: decisão humana.');
  if (!itens.length) itens.push('Nenhuma ação irreversível nesta rodada — siga com validação de rotina.');
  return itens;
}

// ---------------------------------------------------------------- execução
export async function executar({ slug, comando = '/semana', opcoes = {}, llm = null }) {
  const trace = [];
  const estado = carregarEstado(slug);
  const portas = executarFerramenta('portas', { slug }, trace);
  const unidade = executarFerramenta('unidade', { slug, opcoes }, trace);
  const { cmd, arg, bruto } = parseComando(comando);

  const vazamento = detectarVazamento(estado, portas, unidade);
  const movimento = movimentosDisponiveis(estado, portas);
  const portaFoco = proximaPortaBloqueante(portas, estado.percurso_atual);
  const handoffsPlanejados = planejarHandoffs({ estado, portas, vazamento, cmd, arg });
  const handoffs = [];

  // handoffs são criados de verdade (arquivos) para os comandos que executam ação
  const criar = ['semana', 'proximo', 'status', 'iniciar', 'canal', 'entrega'].includes(cmd);
  if (criar) {
    for (const h of handoffsPlanejados.slice(0, 3)) {
      handoffs.push(executarFerramenta('handoff', { slug, ...h }, trace));
    }
  }

  // artefato conforme o comando
  let artefato = '';
  let artefatoArquivo = null;
  if (cmd === 'preencher') {
    const r = executarFerramenta('preencher', { slug, artefato: arg || 'oferta' }, trace);
    artefato = r.conteudo; artefatoArquivo = r.arquivo;
  } else if (cmd === 'canal') artefato = artefatoCanal(estado, arg);
  else if (cmd === 'entrega') artefato = artefatoEntrega(estado, arg);
  else if (cmd === 'validar') artefato = artefatoValidar(estado, arg);
  else if (cmd === 'caixa') artefato = artefatoCaixa(estado, unidade);
  else if (cmd === 'porteiro') artefato = artefatoPorteiro(portas, (arg || portaFoco || 'G0').toUpperCase());
  else if (cmd === 'escalar') artefato = artefatoEscalar(estado, portas);
  else artefato = artefatoStatus(estado, portas, unidade);

  const diagnostico =
    `${portas.resumo}\n\n` +
    `Percurso **${estado.percurso_atual}** · etapa **${estado.etapa}** · vazamento principal: **${vazamento.vazamento}**\n\n` +
    `Métricas-chave: ${estado.metricas.conversas} conversas · ${estado.metricas.clientes_pagos} pagos · MRR ${brl(num(estado.metricas.mrr, 0))} · ` +
    `receita ${brl(num(estado.metricas.receita_recebida, 0))} · custo de IA ${brl(num(estado.metricas.custo_ia_mes, 0))}` +
    (unidade.painel.margemBrutaPct !== null ? ` · margem ${pct(unidade.painel.margemBrutaPct)}` : ' · margem [SEM DADO]');

  const decisao =
    `**${movimento}** — ${movimento === 'MEDIR' ? 'faltam dados para decidir; a próxima ação é coletar, não construir.'
      : movimento === 'AVANCAR' ? `a porta ${portaFoco || 'do percurso'} está satisfeita: avance para o próximo passo do percurso ${estado.percurso_atual}.`
        : movimento === 'CONSERTAR' ? `corrija o vazamento "${vazamento.vazamento}" antes de escalar.`
          : 'critério de parada atingido: registre o aprendizado e reavalie o público.'}\n\n` +
    `Alavanca única da rodada: **${vazamento.alavanca}** · agente responsável: **${vazamento.agente}** · porta em foco: **${portaFoco || '—'}**`;

  const blocos = {
    diagnostico, decisao,
    handoffs: handoffs.length ? tabela(['#', 'De → Para', 'Objetivo', 'Saída esperada', 'Critérios', 'Prazo', 'Custo'],
      handoffs.map((h, i) => [i + 1, `${h.de} → ${h.para}`, h.objetivo, h.saida_esperada, h.criterios_aceitacao.length + ' critério(s)', h.prazo, `${h.custo_estimado.tempo_h}h / ${brl(h.custo_estimado.ia_brl)}`])) : '_nenhum handoff nesta rodada_',
    artefato,
    acaoHoje: acaoDeHoje(estado, vazamento, portas),
    atualizacaoEstado: '```json\n' + JSON.stringify({
      metricas: { conversas: estado.metricas.conversas, clientes_pagos: estado.metricas.clientes_pagos, mrr: estado.metricas.mrr, custo_ia_mes: estado.metricas.custo_ia_mes },
      portas: Object.fromEntries(Object.entries(portas.portas).map(([g, v]) => [g, v.status])),
      proximo_passo: `${vazamento.alavanca} (${vazamento.agente}, porta ${portaFoco || '—'})`,
    }, null, 2) + '\n```',
    proximoPasso: `Se a ação de hoje funcionar: ${portaFoco ? `gere a evidência e aprove ${portaFoco} (\`/porteiro ${portaFoco}\`).` : 'avance para o próximo percurso (P5: portfólio/escala).'} Se não funcionar: repita a coleta com lista/canal diferentes antes de mudar o produto.`,
  };

  const criticas = reflexion({ blocos, estado, portas, handoffs });
  const gr = guardrails(criticas);
  const hitl = exigenciasHITL(cmd, estado, handoffs);

  // LLM opcional (padrão: desligado quando não há chave)
  let respostaIA = null;
  if (llm?.disponivel && opcoes.usarIA !== false) {
    const agente = L1.find((a) => a.id === vazamento.agente);
    const prompt = [
      llm.masterPrompt || '',
      `\n\n## REGISTRO DE AGENTES\nOrquestrador: ${L0.prompt}\n\nAgente responsável (${agente?.id}): ${agente?.prompt || ''}\n`,
      `\n\n## ESTADO DO NEGÓCIO\n\`\`\`json\n${JSON.stringify(estado, null, 2)}\n\`\`\``,
      `\n\n## AUDITORIA DE PORTAS (calculada pelas ferramentas)\n\`\`\`json\n${JSON.stringify(portas.portas, null, 2)}\n\`\`\``,
      `\n\n## COMANDO\n${bruto}\n\nResponda nos 7 blocos obrigatórios do BVC-OS, usando os números calculados acima e [SEM DADO] onde faltar informação.`,
    ].join('');
    try {
      const texto = await llm.completar(prompt);
      respostaIA = texto;
      trace.push({ passo: trace.length + 1, tipo: 'llm', ferramenta: llm.modelo, entrada: bruto, saida: `${texto.length} caracteres`, erro: null });
    } catch (err) {
      trace.push({ passo: trace.length + 1, tipo: 'llm', ferramenta: llm.modelo, entrada: bruto, saida: null, erro: err.message });
    }
  }

  const custoTotal = handoffs.reduce((s, h) => s + (h.custo_estimado?.ia_brl || 0), 0) + (respostaIA ? 0.4 : 0);
  const resultado = {
    slug, comando: bruto, cmd, arg,
    modo: respostaIA ? 'llm+deterministico' : 'deterministico',
    padroes: ['plan-and-execute', 'react-tool-loop', 'reflexion', 'handoff', 'guardrails', 'hitl', ...(respostaIA ? ['cache'] : [])],
    movimento, vazamento, portaFoco,
    blocos, handoffs, artefatoArquivo, respostaIA,
    auditoria: portas, unidade,
    trace, guardrails: gr, hitl,
    custoEstimado: { tempo_h: handoffs.reduce((s, h) => s + (h.custo_estimado?.tempo_h || 0), 0), ia_brl: Number(custoTotal.toFixed(2)) },
    geradoEm: new Date().toISOString(),
  };

  // registra no estado (histórico) — o ciclo é a memória do negócio
  estado.proximo_passo = `${vazamento.alavanca} (${vazamento.agente}, porta ${portaFoco || '—'})`;
  registrarHistorico(estado, `${bruto} · ${movimento} · ${vazamento.vazamento}`);
  salvarEstado(slug, estado);

  return resultado;
}
