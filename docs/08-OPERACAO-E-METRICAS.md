# 08 — Operação, Métricas e a Semana Perfeita

> O que não é medido não é negócio. Este documento instala o painel, a rotina e os rituais para você operar sozinho (ou com IA) sem caos.

---

## 1. O painel mínimo (5 números, atualizados toda sexta)

| Métrica | Fórmula | Meta saudável (micro-SaaS) |
|---|---|---|
| **MRR** | soma das assinaturas ativas no mês | crescente por 3 meses seguidos |
| **Churn de clientes** | cancelamentos ÷ clientes ativos | < 5% ao mês (B2B pequeno) |
| **Ativação** | novos que atingem o primeiro valor ÷ novos | ≥ 40% em 7 dias |
| **LTV/CAC** | (ticket ÷ churn) ÷ custo de aquisição | ≥ 3 |
| **Payback** | CAC ÷ (ticket × margem) | < 6 meses (ideal), < 12 aceitável |

Secundárias: NRR (recompras/upgrades), ticket médio, uso semanal do produto, tickets de suporte por cliente, custo de IA por cliente.

**Onde medir sem gastar:** PostHog (produto), Umami/Plausible (site), Metabase (BI), Langfuse (custo/qualidade de LLM), planilha (vendas).

---

## 2. Funil completo e onde ele vaza

```
IMPRESSÃO → VISITA → CADASTRO → ATIVAÇÃO → PAGO → RETIDO → INDICA
  1000      100       30          12        5       4        1
```
Referências de mercado para orientar (não são garantias): visita→cadastro 20-40%, cadastro→ativação 40-60%, ativação→pago 15-30%, retenção mensal 90-95%.

**Diagnóstico rápido:**
| Sintoma | Provável vazamento | Ação |
|---|---|---|
| Muita visita, pouco cadastro | promessa/landing confusa | reescreva o título e o CTA (doc 06) |
| Cadastro, pouca ativação | onboarding longo | leve ao primeiro valor em < 5 min |
| Ativação boa, pouca conversão | preço/valor percebido | teste 3 planos e garanta resultado |
| Pagantes cancelando | produto não entra na rotina | onboarding ativo + suporte em 24h |

---

## 3. Onboarding que reduz churn (a alavanca mais barata)

Sequência de 7 dias para cada novo cliente:
1. **Minuto 0:** e-mail de boas-vindas com 1 vídeo de 90 s e o link do primeiro passo.
2. **Dia 1:** mensagem humana ("conseguiu criar o primeiro [X]? posso ajudar?").
3. **Dia 2:** dica de uso avançado específica do caso dele.
4. **Dia 4:** check-in — *"o resultado saiu como esperado? o que está travando?"*
5. **Dia 7:** relatório simples do que ele já economizou/ganhou.
6. **Dia 14:** pedido de depoimento + convite para programa de indicação.
7. **Dia 30:** revisão de resultado + oferta de upgrade (se fizer sentido).

**Métricas de onboarding:** tempo até primeiro valor (< 5 min), % que completa o passo 1, suporte por cliente na 1ª semana.

---

## 4. Suporte que escala sem contratar

| Camada | Ferramenta | Regra |
|---|---|---|
| Autoatendimento | base de conhecimento + vídeos curtos | 40% dos tickets morrem aqui |
| Chat/ticket | Chatwoot, Freescout, Zammad | resposta < 24h em dias úteis |
| IA de 1ª linha | RAG da sua documentação (doc 05) | responde e escala com 1 clique |
| Você | o que sobra | agrupe e resolva em blocos, não em tempo real |

**Rituais de suporte (30 min/dia):** responder 2× ao dia (10h e 16h), marcar bugs, transformar 3 dúvidas repetidas em artigo.

**SLA público simples:** "resposta em até 1 dia útil; incidente crítico em até 4 horas". Cumpra — SLA quebrado queima reputação mais rápido que bug.

---

## 5. Churn: prevenir > reverter

**Sinais de risco:** login caiu > 50%, não usou a função principal em 14 dias, abriu ticket de cancelamento, pagamento falhou 2×.
**Ações automáticas:** e-mail "sentimos sua falta" com caso de uso, oferta de sessão de 15 min, desconto de 1 mês no plano anual, pausa em vez de cancelamento (salva 20-30% dos casos).

**Pesquisa de cancelamento (obrigatória, 4 perguntas):**
1. Qual o principal motivo? (preço / não usei / faltou função / mudei de ferramenta)
2. O que faltou para continuar?
3. Você recomendaria para alguém mesmo assim? (0-10)
4. Posso te chamar para entender melhor?

**Regra de ouro:** entreviste quem **não** comprou e quem **cancelou** — é lá que estão as respostas que os clientes fiéis não têm coragem de dar.

---

## 6. A semana perfeita do fundo solo (20h)

| Dia | Bloco 1 (manhã) | Bloco 2 (tarde) |
|---|---|---|
| **Seg** | Métricas + prioridades da semana (30 min) | Construir 1 melhoria que reduz churn |
| **Ter** | 20 contatos de venda | 2 conversas de descoberta |
| **Qua** | Construir (produto/automação) | Conteúdo: 3 posts agendados (X/LinkedIn) |
| **Qui** | 20 contatos + follow-ups | 4 conversas / demos |
| **Sex** | Publicar 1 conteúdo didático (Reddit/YouTube) | Fechar semana: métricas, aprendizados, próxima semana |
| **Sáb** | Aprender (1h) — doc 03/04, um curso | Descansar (sério: burnout quebra mais negócio que concorrência) |

**Regra dos 3 blocos:** todo dia tem (1) venda, (2) construção, (3) conteúdo. Se um dia só tem construção, você está construindo um monumento à esperança.

---

## 7. Finanças: o que fazer com o dinheiro que entra

1. **Separe 3 contas:** PJ (receber/pagar), reserva (impostos e 6 meses de custos), pessoal (pró-labore fixo).
2. **Pró-labore desde o primeiro mês** (nem que seja R$ 1.000): mistura de contas é o erro que mais destrói controle.
3. **Reserva de impostos:** 10-15% de cada entrada (conforme regime, doc 10).
4. **Reinvista em 3 coisas, nesta ordem:** produto (o que reduz churn), aquisição (o que traz cliente), automação (o que devolve tempo).
5. **Nunca** use o MRR como renda: MRR é estoque, não fluxo.
6. **Margem:** mantenha custo de infra + IA abaixo de 30% da receita; acima disso, reprecifique ou otimize modelos.

---

## 8. Rituais de gestão

| Ritual | Frequência | Duração | Pergunta-chave |
|---|---|---|---|
| Painel de métricas | Sexta | 20 min | O que cresceu e o que vazou? |
| Prioridade única | Segunda | 10 min | Qual a **única** coisa que move o MRR esta semana? |
| Revisão de cliente | Mensal | 60 min | Quem está em risco e por quê? |
| Auditoria de custos | Mensal | 30 min | Qual assinatura de ferramenta eu não uso mais? |
| Retrospectiva pessoal | Mensal | 30 min | Estou trabalhando no que paga ou no que é confortável? |
| Revisão de preço | Trimestral | 60 min | Faz sentido aumentar? Qual plano ninguém compra? |

---

## 9. Automação da operação (o que automatizar primeiro)

| Tarefa | Automatize com | Ganho |
|---|---|---|
| Relatório semanal ao cliente | n8n + Metabase/planilha | 1-3h/semana |
| Cobrança e dunning | gateway + webhooks + e-mail | reduz churn involuntário |
| Onboarding | e-mails sequenciais (Novu/Resend) | +ativação |
| Atendimento 1ª linha | RAG + Chatwoot | -40% tickets |
| Conteúdo | prompt + agendador (doc 12) | 5-7 posts/semana em 1h |
| Contabilidade | planilha padronizada + contador | evita multa |

---

## 10. Checklist mensal de operação

- [ ] MRR, churn, ativação, LTV/CAC e payback atualizados
- [ ] 3 entrevistas (1 cliente, 1 cancelado, 1 não-cliente)
- [ ] Custos de infra/IA auditados (margem > 70%)
- [ ] 1 automação nova na operação
- [ ] Backups testados (banco + arquivos)
- [ ] Documentação de produto e suporte atualizada
- [ ] Reserva de impostos separada
- [ ] 1 melhoria de segurança (senha, 2FA, permissões)
- [ ] Próximo mês planejado com 1 objetivo principal

➡️ Próximo: [`09-ROADMAP-90-DIAS.md`](09-ROADMAP-90-DIAS.md)
