# 05 · Nicho e seleção de oferta (com scorecard e due diligence)

> Sequência correta: **nicho → oferta → canal → conteúdo**. Quem escolhe canal primeiro
> ("vou fazer TikTok") acaba promovendo qualquer coisa e tem EPC baixo.

---

## 1. Os 4 filtros de nicho (do vídeo-base + dados)

1. **Conhecimento** — você sabe mais que a média ou consegue aprender rápido e testar de verdade.
2. **Interesse sustentável** — você falaria disso num jantar por 2 horas? Vai produzir 100+ peças.
3. **Economia do nicho** — existe oferta com EPC alto? (bounty, recorrência, ticket alto, comissão %)
4. **Acessibilidade de tráfego** — dá para chegar no público sem brigar com gigantes? Existe demanda
   em busca/vídeo com concorrência média?

> "Dá para ganhar dinheiro em qualquer nicho. Pode ser um nicho de comissão baixa, mas você ganha
> bem se virar **o especialista** daquele campo." — vídeo-base (cap. 03 §4)

---

## 2. Scorecard de nicho (0–100)

Preencha `templates/scorecard-nicho.md` para 3 candidatos e escolha o de maior pontuação.

| Critério | Peso | Como pontuar (0–5) |
| --- | --- | --- |
| Conhecimento/experiência própria | 20% | 0 = nada · 5 = trabalho com isso |
| Interesse por 12 meses | 15% | 0 = tédio · 5 = obsessão |
| EPC do nicho (melhor oferta disponível) | 25% | 0 = <R$0,30 · 5 = >R$5 / >US$1 |
| Recorrência disponível (assinatura/SaaS) | 10% | 0 = nenhuma · 5 = várias |
| Competição de conteúdo | 10% | 0 = dominado por grandes players · 5 = fragmentado |
| Disponibilidade de produto para testar | 10% | 0 = impossível · 5 = barato/fácil de testar |
| Risco regulatório | 10% | 0 = saúde/finanças com regra pesada · 5 = livre |
| **Total** | 100% | ≥ 70 = vá · 55–69 = ajustável · < 55 = troque |

### 12 nichos com economia comprovada (EPC típico e onde promover)

| Nicho | Por que paga bem | Programas típicos | EPC típico |
| --- | --- | --- | --- |
| **Finanças pessoais / cartão / investimento** | Bounty alto por aprovação | Corretoras, cartões, fintechs (US$ 50–200/lead), consórcio no BR | US$ 1–8 |
| **SaaS / ferramentas de IA** | 20–30% **recorrente**, cookie 90 dias | PartnerStack (15–30%, cookie 90d), Impact, programas in-house | US$ 0,3–3 (LTV US$ 3–30) |
| **Hospedagem / domínio / infra** | Bounty US$ 50–150 | Hostinger, Bluehost, Kinsta, Cloudways | US$ 1–4 |
| **VPN / segurança** | Bounty + recorrência | NordVPN, Surfshark, ExpressVPN | US$ 2–12 |
| **Saúde / suplementos** | Ticket alto + recompra | Monetizze, Braip, Eduzz, ClickBank/Digistore24 | R$ 2–15 ⚠️ regra ANVISA/CONAR |
| **Colchões / móveis / casa** | Comissão alta por unidade (relato: ~US$ 500/colchão) | Marcas diretas, Awin, Impact, Magalu, ML | US$ 2–50 |
| **Energia solar / home improvement** | CPA altíssimo | Empresas locais + redes | US$ 20–200/lead |
| **Pet** | Recompra + volume | Amazon BR (11% pet), Shopee, pet shops | R$ 0,5–3 |
| **Beleza / skincare** | Comissão alta na Amazon BR (13%) + TikTok Shop | Amazon, Shopee, TikTok Shop, marcas DTC | R$ 0,9–4 |
| **Educação / concursos / idiomas** | Infoproduto 50–80% + recorrência | Hotmart, Kiwify, Eduzz | R$ 2–20 |
| **Viagem** | Booking/seguro/aluguel de carro, comissão por reserva | Booking, Seguros, Travelpayouts, Expedia | US$ 1–10 |
| **E-commerce / empreendedorismo** | Ferramentas com recorrência | Shopify, plataformas, ERPs | US$ 2–58 (Shopify paga bounty por loja) |

⚠️ Nichos de **risco elevado** (saúde, finanças, emagrecimento, apostas): pagam mais e exigem mais
compliance. No BR: ANVISA (suplementos), CONAR (publicidade), regras da CVM (investimento), e
**proibição** de promover apostas sem operador autorizado. Leia o cap. 14 antes de entrar.

---

## 3. Validação de demanda em 90 minutos (sem pagar SaaS)

1. **Autocomplete + People Also Ask + Related** — repositório
   `chukhraiartur/seo-keyword-research-tool` (165 ★) faz isso sem custo; ou use
   `Ryze-AI-Adgent/open-seo-mcp-skills` (5.138 ★) via MCP.
2. **Teste de concorrência no Google/YouTube:** busque 5 termos comerciais ("melhor X para Y",
   "X vs Y", "X vale a pena"). Se o top 10 é só marketplace gigante → difícil. Se há blog pequeno/
   canal médio ranqueando → **janela aberta**.
3. **Prova de dinheiro:** no YouTube, procure review do produto e veja se há link de afiliado na
   descrição e comentário fixado. Se vários criadores monetizam, existe EPC real.
4. **Sinal de IA:** pergunte a 2–3 assistentes de IA "qual o melhor X para Y" e anote **quais fontes
   eles citam**. Se citam sites pequenos → GEO funciona no seu nicho (cap. 06 §2).
5. **Volume social:** TikTok/Instagram — quantos vídeos com o produto nos últimos 30 dias e qual
   engajamento médio (o skill `trending-content-scout` do `Affitor/affiliate-skills` automatiza isso).

Saída esperada: **1 pilar + 8–15 termos comerciais** e **3 ofertas candidatas**.

---

## 4. Due diligence de oferta (14 pontos antes de promover)

Preencha uma linha em `templates/planilha-ofertas.csv` para cada candidata:

| # | Item | Onde conferir | 🔴 Sinal de alerta |
| --- | --- | --- | --- |
| 1 | **Comissão** (% ou bounty) e se há tier | Página oficial do programa | Só aparece "até 80%" sem regra |
| 2 | **Cookie / janela** e regra de clique (last/first/multi) | Termos | "unknown" ou 14 h |
| 3 | **Recorrência** (meses ou vitalícia) | Termos | Recorrente "até 12 meses" sem aviso |
| 4 | **AOV real** (não o anunciado) | Painel/relatos | Preço inflado com desconto eterno |
| 5 | **Página de vendas** (VSL, depoimentos, checkout) | Visite em aba anônima | Checkout quebrado, upsell agressivo |
| 6 | **Reembolso/garantia e taxa de reversal** | Termos + suporte | Garantia de 30 dias sem dado de reembolso |
| 7 | **Prazo de pagamento e mínimo** | Termos | Sem prazo publicado |
| 8 | **Restrições de tráfego** (brand bidding, cupom, e-mail, incentivos) | Termos | Proíbe o canal que você usa |
| 9 | **Geo permitido** | Termos | Só US/EU (bloqueia BR) |
| 10 | **Materiais para afiliado** (criativos, dados, cupom exclusivo) | Painel | Nenhum suporte |
| 11 | **Reputação do produtor/marca** | Reclame Aqui, Trustpilot, Reddit | Dezenas de reclamações de não entrega |
| 12 | **Compliance do produto** (ANVISA, CVM, CONAR, FTC claims) | Rótulo/site | Promessa de cura/renda garantida |
| 13 | **EPC da rede** (quando publicado) e reviews de outros afiliados | Painel da rede | EPC publicado < US$ 0,10 |
| 14 | **Sub-id/postback disponível** | Docs técnicas | Sem tracking granular → você fica cego |

### 4.1 Onde achar ofertas (ordem de eficiência)

1. **Direto no produto que você já usa** (maior autenticidade e melhor conversão).
2. **Registro aberto:** `Affitor/open-affiliate` (349+ programas, com Affiliate Score, API REST, CLI e
   servidor MCP — dá para perguntar ao seu agente "quais programas de e-mail pagam ≥20% recorrente?").
3. **Dataset HF `bestaffiliateprograms/affiliate-programs`** (2.578 programas, com fonte e data — cap. 02).
4. **Redes:** Impact, PartnerStack, CJ, Awin, Rakuten, ShareASale, FlexOffers (global);
   Awin BR, Lomadee, Admitad, Indoleads (nacional).
5. **Plataformas BR de infoproduto/varejo:** Hotmart, Kiwify, Eduzz, Monetizze, Braip, Amazon
   Associados, Shopee, Magalu, Mercado Livre, Americanas, AliExpress, TikTok Shop (cap. 09).
6. **Página "Affiliates"/"Parceiros" no rodapé do site da marca** — programas in-house costumam pagar
   mais que rede e dão cupom exclusivo.

---

## 5. Negociação de taxa (o bloco "Operating Your Business" do vídeo-base)

Você **consegue** comissão maior. Como:

1. **Gere prova primeiro:** 30–90 dias de cliques e conversões medidos (print do painel + seu log).
2. **Escreva para o gerente de afiliados** (não o suporte geral) com números:
   cliques, CR, EPC, AOV, conteúdo publicado, plano dos próximos 90 dias.
3. **Peça 3 coisas nesta ordem:** (a) taxa maior ou tier, (b) **cupom exclusivo** (aumenta CR e
   permite atribuição sem cookie), (c) acesso antecipado a promoções/lançamentos.
4. **Ofereça contrapartida mensurável:** exclusividade de posição ("não promovo concorrente por
   90 dias"), volume mínimo de peças, dados de audiência.
5. **Se negarem:** peça programa de bonus por performance (ex.: +5% acima de X vendas/mês) ou
   migre para concorrente com EPC maior — e informe o gerente (muitos revertem).

Modelo pronto: `templates/email-negociacao-comissao.md` (versões PT e EN).

**Quando você tem alavanca:** quando traz **incrementalidade** (conteúdo/criador: 78–82% — cap. 00 §5)
e quando o anunciante vê que seu tráfego não é brand bidding nem cupom.

---

## 6. Portfólio de ofertas (regra 3-2-1)

- **3 ofertas principais** do mesmo nicho (para comparativos: "A vs B", "melhor dos 3").
- **2 ofertas de rede diferente** (se uma rede atrasar pagamento ou banir, você não para).
- **1 oferta recorrente ou de bounty alto** (é a que paga o custo fixo).
- **1 reserva:** oferta própria ou parceria direta em construção (cap. 12).

🔴 Nunca deixe **um único programa** representar mais de 60% da receita por mais de 2 trimestres.
Alteração de taxa (a Amazon fez isso várias vezes, inclusive no Brasil em 2026) ou mudança de regra
de cookie pode cortar metade da sua renda em um dia.

---

## 7. Exemplo completo aplicado (nicho "home office / ergonomia")

1. **Scorecard:** conhecimento 4, interesse 5, EPC 4 (colchões/cadeiras pagam bem), recorrência 2,
   competição 3, testabilidade 3, risco 5 → **nota 78** ✅
2. **Ofertas:** cadeira ergonômica (marca direta, bounty R$ 120), mesa ajustável (Magalu 6–12%),
   monitor (Amazon BR 3–8%), SaaS de produtividade (recorrente US$ 0,30 EPC / LTV US$ 3).
3. **EPC teórico ponderado:** ~R$ 3,10 por clique.
4. **Pilar de conteúdo:** "Melhor cadeira ergonômica para quem trabalha 8h sentado" + 6 comparativos
   + 4 guias de setup + review em vídeo com medidas reais.
5. **Canais:** YouTube (review com demonstração) + site (comparativo com tabela) + Pinterest
   (setup de escritório) + newsletter semanal "setup da semana".
6. **Meta mês 3:** 400 cliques × R$ 3,10 = **R$ 1.240/mês**.
