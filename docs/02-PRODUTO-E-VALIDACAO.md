# 02 — Produto, Validação e Preço

> Objetivo deste documento: você sair daqui com **uma dor validada, um PRD de 1 página e um preço**. Sem código, sem logo, sem nome bonito.

---

## 1. Onde a dor real se esconde

Dor boa tem 4 sinais: **frequente** (acontece toda semana), **urgente** (dói agora), **caro** (já se paga para resolver) e **acessível** (você consegue falar com quem sente).

| Fonte | Como minerar | O que procurar |
|---|---|---|
| Reddit | Busca `site:reddit.com "how do you" + [tema]`, ordene por "Top do ano" | Frases: *"I hate that…"*, *"is there a tool that…"*, *"I still do this manually"* |
| Avaliações 1-2 estrelas | G2, Capterra, App Store, Google Play dos líderes | Reclamações repetidas = roadmap do seu produto |
| LinkedIn / Indeed | Vagas abertas do cargo que você substitui | Toda vaga repetida é um processo caro e manual |
| Grupos (WhatsApp/Facebook/Telegram/Discord) | As mesmas 5 perguntas aparecem todo mês | Perguntas repetidas = produto ou serviço |
| Licitações e editais | Portais públicos do seu setor | Obrigação legal = dor paga com verba |
| Instagram/TikTok de nicho | Comentários "como você fez?", "onde acho?" | Demanda não atendida, com prova pública |
| Planilhas de clientes | Peça a planilha "feia" que controla o negócio | Toda planilha crítica é um SaaS esperando nascer |

**Teste da planilha:** se a pessoa mantém o processo em planilha e reclama dela, há dor. Se ela usa um sistema e reclama, há **troca** (mais difícil). Prefira substituir planilhas.

---

## 2. Os 4 filtros antes de investir 1 hora

1. **Frequência:** acontece ao menos 1×/semana? (diário é melhor)
2. **Custo atual:** quanto dinheiro/hora se perde hoje?
3. **Poder de compra:** quem sente a dor controla orçamento?
4. **Acesso:** você consegue 30 dessas pessoas em uma semana?

Se falhar em 2 dos 4 → descarte e escolha outra dor. Não se apaixone por ideia.

---

## 3. Validação em 7 dias (porteira de entrada)

| Dia | Ação | Critério de avanço |
|---|---|---|
| 1 | 20 conversas (DM, e-mail, telefone) com o público | ≥ 8 respondem |
| 2 | 20 conversas novas + pergunta de dinheiro: *"quanto custa hoje resolver isso?"* | ≥ 5 já pagam algo (mesmo que planilha + hora de alguém) |
| 3 | Página de 1 tela com a promessa + botão "quero acesso" | ≥ 10 e-mails coletados |
| 4 | Pré-venda: *"R$ X/mês, entrego em 30 dias, 50% agora"* | ≥ 3 pagam ou assinam carta de intenção |
| 5 | Pesquisa de concorrência e preço (5 concorrentes) | Existe 1 concorrente? Ótimo (mercado validado). Nenhum? Suspeite. |
| 6 | Entrevista de 30 min com 3 dos interessados | Descobrir o "trabalho a ser feito" e a métrica de sucesso deles |
| 7 | Decisão: seguir, ajustar ou matar | **Só siga com ≥ 3 sinais de dinheiro (pagou, pré-pagou, assinou ou deu carta)** |

**Se ninguém paga na pré-venda, o problema não é o produto — é a promessa ou o público.** Troque a promessa, não a tecnologia.

### Técnicas de validação que funcionam sem produto

- **Concierge:** você entrega na mão (planilha + IA) para 3 clientes. É a forma mais honesta de descobrir o que automatizar.
- **Smoke test:** landing + botão de compra; mede intenção real (mas exige tráfego).
- **Pré-venda com desconto de fundador:** financía o desenvolvimento e filtra curiosos.
- **Serviço → produto:** venda o serviço, cronometre o que você repete, e só então escreva código.

---

## 4. Pesquisa de concorrência em 30 minutos

```text
1. Google:      "[termo] + software"     | "[termo] + planilha" | "[termo] + app"
2. Reddit:      site:reddit.com "[termo]" — leia os 5 melhores posts do ano
3. G2/Capterra: leia as avaliações 1★ e 2★ dos 3 líderes
4. SimilarWeb/Google Trends: o tráfego está subindo ou caindo?
5. Preço:       monte uma tabela com plano, preço, limite e o que falta em cada um
6. Vagas:       LinkedIn "[termo]" — quantas vagas? Qual a descrição da rotina?
```

Entregável: **1 página** com "onde o mercado cobra caro e entrega pouco". É aí que você entra.

---

## 5. PRD de 1 página (o único documento que importa)

```markdown
# [Produto] — PRD v0.1

## Problema
[Quem] perde [quanto tempo/dinheiro] por [frequência] porque [causa raiz].

## Usuário e comprador
- Usuário: [cargo/pessoa que usa]
- Comprador: [quem paga] — é a mesma pessoa? [sim/não]
- Contexto de uso: [onde, quando, em que dispositivo]

## Resultado prometido (1 frase)
"[Produto] gera [resultado mensurável] em [prazo] sem [dor atual]."

## Caminho do primeiro valor (PVF)
1. [Ação mais curta]  2. [Gerar resultado]  3. [Ver valor]  → meta: < 5 minutos

## Escopo do MVP (vender já)
- [ ] Feature 1 (indispensável)
- [ ] Feature 2 (indispensável)
- [ ] Pagamento + login (indispensável)

## Fora do escopo (v1.1+)
- [Ideia 1] [Ideia 2] [Integração 1]  ← proteger o prazo

## Métrica de sucesso
- [ ] 10 pagantes em 30 dias   - [ ] ativação ≥ 40%   - [ ] churn < 8%/mês

## Preço
- Básico R$ __/mês · Pro R$ __/mês · Anual com 2 meses grátis
- Fundadores: [desconto] por [prazo] em troca de depoimento

## Riscos
1. [Risco técnico] 2. [Risco de distribuição] 3. [Risco de confiança/dados]
```

Template preenchível: [`../templates/prd.md.tmpl`](../templates/prd.md.tmpl)

---

## 6. Preço: a decisão que mais muda o negócio

**Regra de ouro:** preço não é custo + margem. É *fração do valor que você gera*.

| Situação | Preço de partida |
|---|---|
| Substitui 1 hora/semana de um profissional de R$ 50/h | R$ 97 – R$ 197/mês |
| Substitui 8h/mês de um profissional de R$ 80/h | R$ 397 – R$ 697/mês |
| Substitui um cargo de R$ 3.000/mês | R$ 997 – R$ 2.497/mês |
| Mercado internacional (EUA/Europa) | US$ 29 – US$ 199/mês |

**Táticas que funcionam:**
- **3 planos** (ancoragem): Básico / Pro (recomendado) / Escala.
- **Anual com 2 meses grátis** — melhora o caixa e reduz churn.
- **Cobrança em USD** para público global (evita câmbio e aumenta o ticket ~3-5×).
- **Preço de fundador** com prazo e contrapartida (depoimento, estudo de caso).
- **Aumente o preço a cada 10 clientes** até começar a perder negócios — o preço certo é o que dói um pouco.

**Erros caros:** cobrar R$ 9,90/mês "para começar", dar grátis ilimitado, esconder preço, cobrar por "usuário" quando o cliente pensa por "resultado".

---

## 7. Fluxo de monetização (escolha um)

```
Opção A — Assinatura mensal (recorrência)     → melhor para software
Opção B — Pagamento único + upgrades          → melhor para templates e packs
Opção C — Setup + mensalidade                 → melhor para automação/serviço
Opção D — Por uso/créditos                    → melhor para API/infra
```

**Pagamentos no Brasil:** Pix (instantâneo, taxas baixas), cartão recorrente (churn involuntário exige dunning), boleto (ainda relevante em B2B). **No exterior:** Stripe (cartão), Paddle/Lemon Squeezy (Merchant of Record — eles cuidam de imposto sobre venda). Detalhes em `docs/07`.

---

## 8. Do serviço ao SaaS: a migração canônica

1. Venda o serviço e faça **manualmente** (camada 1).
2. Grave o processo: cada clique, planilha, prompt e decisão.
3. Encontre as **3 tarefas que se repetem em todo cliente**.
4. Automatize 1 delas e cobre o mesmo (margem sobe).
5. Transforme as 3 em produto, com login, plano e cobrança.
6. Ofereça aos clientes atuais: *"mesmo preço, agora você mesmo faz, mais rápido"*.
7. Suba o preço para novos clientes e mantenha os antigos como "fundadores".

---

## 9. Checklist de pronto-para-construir

- [ ] Tenho 3 sinais de dinheiro (pagou/pré-pagou/carta de intenção)
- [ ] Sei o custo atual e a frequência do problema (em número)
- [ ] Falei com ≥ 15 pessoas do público
- [ ] Tenho o PRD de 1 página preenchido
- [ ] Sei a primeira ação do usuário (PVF < 5 min)
- [ ] Definí preço, plano e forma de cobrança
- [ ] Escolhi a licença e a stack (doc 03)
- [ ] Sei por qual canal vou falar com 1.000 pessoas desse público
- [ ] Tenho um plano para os 30 dias (doc 09) e um teto de gastos

➡️ Próximo: [`03-BIBLIA-GITHUB.md`](03-BIBLIA-GITHUB.md)
