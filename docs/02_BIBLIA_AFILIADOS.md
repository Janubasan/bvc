# A BÍBLIA DO AFILIADO — HARNESS/JEV-LAYA

> Tudo que pode ser feito como afiliado, o que produzir, como produzir, com estrutura validada.
> Companion docs: [`01_PESQUISA_PROVAS_MONETARIAS.md`](./01_PESQUISA_PROVAS_MONETARIAS.md) (provas e fontes),
> [`prompts/PROMPT_MASTER.md`](../prompts/PROMPT_MASTER.md) (prompt mestre), `jevlaya/` (código validado por 35 testes).

---

## ÍNDICE

1. [Os 3 axiomas](#1-os-3-axiomas)
2. [Unit economics — as contas que decidem tudo](#2-unit-economics)
3. [O fluxo JEV-LAYA](#3-o-fluxo-jev-laya)
4. [Os 8 playbooks — o que produzir e como](#4-os-8-playbooks)
5. [Protocolo de testes e A/B](#5-protocolo-de-testes)
6. [Estrutura validada (o harness de qualidade)](#6-estrutura-validada)
7. [Compliance e riscos](#7-compliance-e-riscos)
8. [O produto SaaS: de MVP a máquina de receita](#8-o-produto-saas)
9. [Plano 30/60/90 dias](#9-plano-306090)
10. [Checklist diário/semanal](#10-checklist)

---

## 1. OS 3 AXIOMAS

Toda decisão do sistema deriva de três verdades medidas na pesquisa:

**AXIOMA 1 — Margem manda.** A maioria dos produtos físicos paga 3-14% de comissão
(Shopee ~3% base + bônus até 25-30% em campanha). Com CVR de mercado de 0,5-1%, um CPC de
R$ 0,30 já destrói quase tudo. Infoprodutos pagam 30-60% e mudam o jogo. **Nunca anuncie sem
calcular o CPC máximo** (`jevlaya/score.py → cpc_maximo()`).

**AXIOMA 2 — Prova social é o melhor preditor de conversão.** Produtos com milhares de reviews
4,5+ e UGC disponível convertem 2-3x mais que produto frio. O preditor **E** do HARNESS quantifica
isso; o criativo SEMPRE usa o número real (nada inventado — além de ético, é exigência das plataformas).

**AXIOMA 3 — Iteração vence intuição.** Fadiga de criativo chega em semanas; o funil com captura
(email/WhatsApp) rende mais que link direto; testes A/B com amostra mínima evitam matar criativo bom.
Quem mede e itera fica com o dinheiro; quem "acha" financia plataforma de anúncio.

---

## 2. UNIT ECONOMICS

As 4 contas que o HARNESS automatiza (e que todo afiliado deveria saber de cor):

```
comissão_por_venda = ticket × comissão%
CPC_MAXIMO         = comissão_por_venda × CVR_esperada × margem_segurança(0,8)
ROAS_break_even    = 1,0  (em comissão: cada R$1 gasto precisa voltar ≥ R$1 em comissão)
ROAS_plataforma    = 1/comissão%  (o número que Meta/Google exibem; 10% comissão → ROAS 10)
lucro_por_venda    = comissão_por_venda − CPC_real/CVR_real
```

**Exemplo real Shopee:** Air Fryer R$ 219,90, comissão efetiva 14% (base 6% + extra 8%),
CVR esperada 2,5% → comissão/venda R$ 30,79 → **CPC máximo R$ 0,61**. Se seu clique custa R$ 0,90,
cada venda te custa R$ 36 de anúncio e devolve R$ 30,79: prejuízo garantido no volume.
É esse número, por produto, por canal, que o HARNESS entrega — e o motivo de o afiliado pagar por ele.

**Regra de bolso por modelo de comissão:**

| Comissão efetiva | Tráfego pago viável? | Via principal |
|---|---|---|
| 3-8% (físico sem bônus) | ❌ raramente | Orgânico: grupos de oferta, TikTok orgânico |
| 9-20% (físico com bônus/ticket alto) | ✅ se CPC < R$ 0,30 | Kwai/TikTok Ads + grupo de oferta |
| 30-60% (infoproduto) | ✅✅ | Meta/TikTok Ads + advertorial de pré-venda |

---

## 3. O FLUXO JEV-LAYA

Implementado em `jevlaya/` (Python, stdlib, 35 testes). Nenhuma decisão sai sem trilha de auditoria.

```
L1 COLETA    → sinais do produto (APIs oficiais: Shopee Open API, ML Linkbuilder, PA-API,
               Google Trends, Reddit/TikTok Creative Center)          [dados.py]
L2 PREDIÇÃO  → 3 preditores 0..1 com evidência auditável:            [previsores_jev.py]
               J Janela de Demanda  = tendência + sazonalidade + momentum
               E Evidência Social   = reviews + rating + buzz + UGC
               V Viabilidade Valor  = comissão efetiva + ticket-doce + paridade de preço − devoluções
L3 DECISÃO   → Score HARNESS (0-100), CPC máximo, ROAS break-even,    [score.py, veredito.py]
               VIAS (canais recomendados) e VEREDITO da campanha:
               ESCALAR | OTIMIZAR | AGUARDAR | PAUSAR
L4 AÇÃO      → 30 criativos (5 ganchos × 6 ângulos) por canal,        [criativos.py]
               gate de compliance, alerta WhatsApp pronto
```

**VIAS** = por onde escoar o produto. O orquestrador escolhe com regras transparentes
(comissão ≥25% → pago; UGC+buzz → TikTok orgânico; ticket baixo com desconto → grupo de oferta;
ticket ≥150 → review comparativo). Regras visíveis no código, ajustáveis por vertical.

**VEREDITO** = decisão automática com regra pública:
1. cliques < mínimo (100) → **AGUARDAR** (amostra pequena não decide);
2. CPC real > CPC máximo → **PAUSAR**;
3. zero vendas após 3× a amostra mínima → **PAUSAR**;
4. ROAS-comissão ≥ 1,2 e ≥ 3 vendas → **ESCALAR** (+20-30% de orçamento por vez);
5. ROAS entre 0,8 e 1,2 → **OTIMIZAR** (trocar criativo, refinar público).

Rode você mesmo: `python3 harness_cli.py` (demo completa) · `python3 -m pytest testes/ -v` (validação).

---

## 4. OS 8 PLAYBOOKS

> Cada um: o que é, o que produzir, SOP semanal, métrica-alvo e encaixe no JEV-LAYA.
> Todos validáveis com a estrutura deste repo (matriz de criativos + veredito).

### PB-1 · Canal de ofertas no TikTok/Kwai (orgânico)
- **Produto-alvo:** J ≥ 0,6 e E ≥ 0,6 (produto com buzz e UGC para modelar), ticket R$ 40-300.
- **Produção:** 3-5 vídeos/dia de 15-30s. Estrutura: gancho visual (2s) → demonstração → preço
  riscado → CTA "link na bio". Modele os 3 vídeos mais virais do nicho (preditor E garante que existem).
- **SOP semanal:** 2ª escolha de produtos no Radar · 3ª-6ª gravação em lote · diário: postar + responder.
- **Métrica-alvo:** 1 vídeo >10k views/semana; CVR do link 1-3%; comissões R$ 500-5.000/mês (faixa observada na pesquisa BR).
- **JEV-LAYA:** via sugerida automaticamente quando `ugc_modelavel=True` e buzz alto.

### PB-2 · Grupo/canal de ofertas Telegram + WhatsApp
- **Produto-alvo:** V com bom `paridade_preco`, desconto real verificável.
- **Produção:** 5-15 posts/dia (foto + preço de/por + botão). Os bots abertos provam o formato
  (`rlucio01/bot-ofertas-telegram`, `SaulloGabryel/BlueBot`). Diferencial HARNESS: só posta produto
  que passou no score — grupo sem curadoria vira spam e morre.
- **Crescimento:** tráfego cruzado dos vídeos (PB-1) → isca "grupo VIP de achados".
- **Métrica-alvo:** 1.000 membros em 90 dias; CTR 3-8% por post; grupo de 5k membros ≈ R$ 1-4k/mês em comissões Shopee/ML.

### PB-3 · Tráfego pago para infoproduto (30-60% de comissão)
- **Produto-alvo:** V ≥ 0,6 por comissão; página de vendas com prova (depoimentos reais).
- **Produção:** advertorial/landing de pré-venda + 30 criativos da matriz; teste 5 ganchos com
  R$ 10-20/dia cada; corte por CPC máximo e veredito.
- **Conta:** break-even de comissão ROAS = 1,0; se o produto paga 40%, cada R$ 1 em ads precisa virar ≥ R$ 1 de comissão — viável com CVR 2-4% em página quente.
- **Métrica-alvo:** CPA < 50% da comissão; ROAS-comissão ≥ 1,5 em D7; escala +20-30% a cada 48h estáveis.

### PB-4 · Site de review/SEO (o clássico, com lições do caso US$ 21k/mês)
- **Produto-alvo:** J estável por 12 meses (evergreen), comissão ≥ 8% ou recorrente.
- **Produção:** guias de compra 2.500+ palavras, comparativos "X vs Y", tabelas de preço atualizadas.
  O caso Reddit (585 guias → US$ 21k/mês) mostra o teto — e a queda pós-update mostra o risco de canal único.
- **Regra HARNESS:** site de SEO é UMA via, nunca a única; cada artigo carrega o link curto rastreado do sistema.
- **Métrica-alvo:** 20 artigos/mês; 3-6 meses p/ tráfego; diversificar em ≥ 2 programas de afiliado.

### PB-5 · Pinterest (tráfego frio barato, subestimado no BR)
- **Produto-alvo:** casa, moda, beleza, organização; ticket R$ 30-200; pin vertical 1000×1500.
- **Produção:** 10-20 pins/dia reaproveitando a matriz de criativos (formato `pinterest` já sai do HARNESS).
- **Métrica-alvo:** pins com vida útil de meses; CTR 0,5-1,5%; composto: o pin de hoje vende daqui a 6 meses.

### PB-6 · Recorrência SaaS (o caminho dos US$ 7k/mês)
- **Produto-alvo:** ferramentas que você usa; comissão recorrente 20-40%.
- **Produção:** conteúdo de caso de uso real ("como economizei X com a ferramenta Y") + tutorial no YouTube.
  Evidência da pesquisa: SaaS converte até 45% com tráfego de alta intenção.
- **Métrica-alvo:** MRR de comissões; churn do programa; 12 meses de recorrência = anuidade paga.

### PB-7 · Funil com captura (email/WhatsApp)
- **Produção:** isca digital por nicho → sequência de 5-7 mensagens → ofertas escalonadas.
  Caso real: 15% clique→cadastro, US$ 3.220/mês crescendo 18% a.m.
- **Regra HARNESS:** cada oferta do funil passa pelo mesmo score/veredito — o funil vira um portfólio medido.

### PB-8 · Negociação de comissão (dinheiro grátis)
- Pedir aumento direto ao gerente do programa funcionou em caso documentado
  (US$ 40→52 por lead; US$ 140→145 por assinatura). Tabela de argumentos: seu volume mensal,
  CVR comprovada pelo painel, sazonalidade que você cobre. 1 reunião = +10-30% de margem permanente.

---

## 5. PROTOCOLO DE TESTES

1. **Hipótese escrita antes do teste** (ex.: "gancho de escassez converte +20% vs oferta direta neste nicho").
2. **Amostra mínima:** 200 cliques por variante antes de qualquer conclusão
   (`jevlaya/ab_teste.py` bloqueia decisão prematura automaticamente).
3. **Significância:** teste z de 2 proporções, p < 0,05 **e** lift mínimo de 15% (diferença estatística
   sem diferença prática não muda nada).
4. **Uma variável por teste.** Gancho OU ângulo OU canal — nunca os três juntos.
5. **Registro:** todo teste gera linha de auditoria (produto, variante, período, resultado, decisão).
   O histórico É o lock-in do SaaS: o afiliado não cancela porque perderia a base aprendida.
6. **Cadência:** 30 criativos novos por produto/mês (a matriz completa); aposentadoria do perdedor,
   2 filhos do vencedor (mutação do gancho vencedor).

---

## 6. ESTRUTURA VALIDADA

O "quality gate" que transforma ferramenta em produto confiável:

- **35 testes automatizados** cobrindo score, CPC máximo, preditores JEV, veredito, A/B e compliance
  (`testes/test_harness.py`). Rodar em CI a cada mudança.
- **Compliance determinístico:** lista de promessas proibidas checada em TODO texto antes de sair
  (renda garantida, cura, emagrecimento numérico, "100% garantido"…). IA preenche, o gate decide.
- **Auditabilidade total:** cada decisão carrega a trilha L1→L4 — suporte responde "por que o app
  mandou pausar?" em 30 segundos. Argumento de venda direto.
- **Dados por API oficial:** scraper de página viola ToS e derruba IP (documentado no repo
  `guilhermeal/affiliate-scraper`); Shopee Open API, ML Linkbuilder e PA-API 5.0 são o caminho seguro.

---

## 7. COMPLIANCE E RISCOS

| Risco | Mitigação |
|---|---|
| Promessa proibida derruba anúncio/conta | Gate de compliance L4 + tom de voz sem superlativos médicos/financeiros |
| Transparência (CONAR/CFT): divulgação de vínculo | Sufixo `#publi #afiliado` obrigatório em todo criativo (já está nos templates) |
| Scraping bloqueado / banimento | Somente APIs oficiais; respeitar rate limits |
| Corte de comissão pela plataforma | Multi-plataforma: ≥ 2 lojas por produto no radar |
| Dependência de 1 canal (lição do caso US$ 21k→7k) | Mínimo 3 VIAS ativas por produto |
| Imposto (PF: 11% INSS + IR até 27,5%; saque ShopeePay até R$ 3.000) | Documentar no onboarding do produto; sugerir MEI a partir de R$ 2k/mês |
| Review falso/inflado | Preditor E usa volume+rating+UGC cruzados; nunca inventar número em criativo |

---

## 8. O PRODUTO SAAS

**Posicionamento:** "Copiloto de Lucro" — não é gerador de texto; é o sistema que diz **o que escalar,
o que pausar e por quê**, com a conta do CPC máximo feita.

**Esteira (do plano original, mantida):**
1. Landing page com a promessa + espera de 500 e-mails; 10 entrevistas com afiliados R$ 5k-50k/mês.
2. Alpha: 20 afiliados, meta 3 usos/semana.
3. Beta pago R$ 19,90 (validar disposição a pagar) → PRO R$ 97/mês (Radar automático + IA + rastreamento)
   → AGENCY R$ 297/mês (multiusuário) → anual R$ 497.
4. Migração técnica: Next.js + FastAPI + Postgres (`users`, `products`, `link_events`, `results`) +
   Redis para o redirecionador `harness.link/r/{id}` com UTMs + postback das plataformas.

**Retenção (lock-in):** histórico de resultados + testes A/B acumulados + radar calibrado pelo
histórico do usuário. Cancelar = jogar fora o aprendizado pago.

**KPIs do produto:** ativação = primeiro veredito recebido em < 48h; retenção D30 ≥ 55%;
NPS ≥ 50; métrica-norte = **lucro adicional atribuído** por usuário/mês.

---

## 9. PLANO 30/60/90

**Dias 1-30 (fundação):** contas nas 3 plataformas de afiliado; nicho único; Radar manual com o
`harness_cli.py`; PB-1 + PB-2 ativos; 30 criativos do produto nº 1; primeiros 100 cliques medidos.
**Dias 31-60 (validação):** primeiro A/B concluído com significância; produto nº 2; isca de captura
(PB-7); pedido de comissão extra em campanha ativa (PB-8); meta R$ 300-1.500 em comissões.
**Dias 61-90 (sistematização):** PB-3 ou PB-5 conforme perfil; rotina semanal travada (§10);
meta R$ 1.500-5.000 em comissões e/ou decisão go/no-go do SaaS com os dados reais colhidos.

---

## 10. CHECKLIST OPERACIONAL

**Diário (30 min):** olhar vereditos recebidos → pausar o que estourou CPC → postar lote de criativos
do dia → responder comentários (prova social gera prova social).
**Semanal (2 h):** rodar o Radar → escolher 1 produto novo → gerar 30 criativos → revisar A/B em curso
(sem decisão antes da amostra mínima) → 1 post de bastidor/autoridade.
**Mensal:** revisar matriz produto × via (matar via fria, dobrar na quente) · pedir comissão extra das
campanhas do mês seguinte · backup/export do histórico (seu ativo).

---

*Esta bíblia é um documento vivo: cada teste concluído com significância vira linha de evidência
e atualiza os pesos do JEV. A estrutura existe para ser desafiada — com dados, nunca com achismo.*
