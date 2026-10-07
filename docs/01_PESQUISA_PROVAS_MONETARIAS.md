# PESQUISA — Fundamentação e Provas Monetárias para o HARNESS

> **Objetivo:** fundamentar, com fontes públicas (GitHub, Hugging Face, Reddit e dados de mercado),
> a lógica de produção de resultados para afiliados que o HARNESS automatiza.
> **Data da pesquisa:** 2026-10-07. Links auditados via busca web no momento da escrita.

---

## 0. Aviso de método (leia antes de citar números)

1. **Números de Reddit/Medium são autorreportados.** Servem como *prova de existência* do resultado
   (o modelo de negócio funciona para alguém real), não como média esperada. O HARNESS existe
   exatamente para transformar esses casos isolados em processo replicável.
2. **Viés de sobrevivência é forte:** quem fatura posta; quem perde dinheiro some. Por isso este
   relatório sempre traz o contraexemplo junto (ver §2.5).
3. Estimativas de mercado variam por metodologia (ver §1 — US$ 17 bi vs US$ 29,9 bi). Usamos faixas,
   nunca ponto único.

---

## 1. Tamanho do mercado (por que vale a pena construir isso)

| Métrica | Valor | Fonte |
|---|---|---|
| Mercado global de afiliados 2025 | **US$ 18,44 bi** (projeção 2026: US$ 20,07 bi; 2033: US$ 35,43 bi) | Cognitive Market Research via Wix [1](https://www.wix.com/blog/affiliate-marketing-statistics) |
| Estimativa alternativa 2025→2034 | US$ 29,9 bi → **US$ 62,3 bi** (CAGR 8,5%) | Dataintelo [2](https://dataintelo.com/report/affiliate-marketing-programs-software-market) |
| Gasto de anunciantes EUA com afiliados 2026 | **US$ 13,81 bi** (+11,3% a.a.) | eMarketer via Wix [1](https://www.wix.com/blog/affiliate-marketing-statistics) |
| Share do e-commerce via afiliados | **16%** das vendas; 81% das marcas têm programa | Cropink [3](https://cropink.com/affiliate-marketing-statistics) |
| Conversão média de afiliado | **0,5%–1%** (baseline p/ calibrar CVR esperada do HARNESS) | Cropink [3](https://cropink.com/affiliate-marketing-statistics) |

**Leitura para o produto:** mercado bilionário crescendo ~8-11% ao ano, com a dor central do
afiliado (CVR baixa + escolha errada de produto) quantificada. Ferramenta que eleva CVR ou evita
produto ruim captura valor direto.

---

## 2. Provas monetárias (Reddit e fontes abertas)

### 2.1 Caso Amazon Associates — site de conteúdo (AMA com screenshot)
- **US$ 21.029,49/mês** em abril/2020 (screenshot do painel publicado no post) [4](https://www.reddit.com/r/Affiliatemarketing/comments/iv2pmk/made_24000mo_with_amazon_affiliate_in_april_2020/)
- Método: 585 guias de compra (3.000+ palavras), 100+ posts com ≥3 backlinks cada (custo US$ 30-120/backlink).
- **Contraexemplo embutido no próprio relato:** update do Google + corte de comissões derrubaram de US$ 21k para US$ 7k/mês. Site vendido por ~US$ 200k (líquido ~US$ 175k) em 30 dias — múltiplo ~35x o faturamento mensal da época.
- **Lição para o HARNESS:** renda de conteúdo é real mas dependente de canal único; diversificação de vias (o conceito de VIAS do LAYA) é proteção.

### 2.2 Caso SaaS recorrente — microescala com CVR anômala
- 47 cliques → 20 conversões (**CVR ~45%** vs benchmark SaaS de 5-10%), US$ 100 de comissão recorrente nos 2 primeiros meses [5](https://www.reddit.com/r/Affiliatemarketing/comments/1k7cj14/proof_that_in_affiliate_marketing_youll_always/)
- **Lição:** tráfego com intenção cirúrgica vence volume. O preditor **E** (evidência social/intenção) do HARNESS existe para achar esses bolsões.

### 2.3 Caso funil com captura de e-mail
- Funil simples + retargeting: **15% conversão clique→cadastro**, **US$ 3.220/mês**, +18% m/m [6](https://www.reddit.com/r/Affiliatemarketing/comments/1qi6hda/spent_a_year_trying_to_crack_affiliate_income/)
- Outro relato no mesmo thread: oferta paga no Facebook fadiga após 2-3 meses ("offer too familiar") → precisa trocar criativo. **É o caso de uso exato do veredito OTIMIZAR + matriz de 30 criativos.**

### 2.4 Faixa de resultados recorrentes (r/Affiliatemarketing, 2026)
- ~**US$ 7k/mês** com comissões recorrentes de SaaS (Amazon, Canva, Shopify, Vista Social) [7](https://www.reddit.com/r/Affiliatemarketing/comments/1r1vhjt/people_who_actually_make_money_with_affiliate/)
- Relato de US$ 500 → US$ 2k+/mês após automatizar páginas e promoções [7](https://www.reddit.com/r/Affiliatemarketing/comments/1r1vhjt/people_who_actually_make_money_with_affiliate/)

### 2.5 O contraexemplo obrigatório (baseline realista)
- 1.500 visitantes/mês → **US$ 12/mês** (3 vendas) [7](https://www.reddit.com/r/Affiliatemarketing/comments/1r1vhjt/people_who_actually_make_money_with_affiliate/)
- **Leitura:** a mediana do afiliado sem sistema é próxima de zero. O pitch do HARNESS se escreve sozinho:
  a diferença entre os casos acima e o baseline é **seleção de produto + matemática de CPC + iteração de criativo** — as três camadas L3 do produto.

### 2.6 Casos r/juststart (compra/otimização de sites de afiliado)
- Site comprado por **US$ 37k** faturando US$ 800-1.000/mês → **US$ 8.150 de receita e US$ 5.036 de lucro** no mês 6 após injeção de conteúdo [8](https://www.reddit.com/r/juststart/comments/bzvap3/case_study_growing_a_purchased_affiliate_site/) [9](https://www.reddit.com/r/juststart/comments/dv1anc/case_study_growing_a_purchased_affiliate_site/)
- **Negociação direta de comissão:** US$ 40→52 por lead mobile e US$ 140→145 por assinatura, só pedindo ao gerente da plataforma [8](https://www.reddit.com/r/juststart/comments/bzvap3/case_study_growing_a_purchased_affiliate_site/)
- Site de US$ 2k → +300% tráfego e +100% receita em 3 meses [10](https://www.reddit.com/r/juststart/comments/jr4n81/case_study_1_buying_and_rebuilding_an_old/)

### 2.7 Brasil — Afiliados Shopee (provas em R$)
- Afiliada: **R$ 5.000/mês** começando em abril do mesmo ano; outra: R$ 200 no 1º mês → **R$ 1.900 em 9 dias** no mês seguinte (com bônus de campanha de 25-30% além dos ~3% base) [11](https://www.reddit.com/r/empreendedorismo/comments/1meakga/does_being_a_shopee_affiliate_actually_make_money/)
- Faixa oficial/imprensa: comissões de **1% a 14%+**; top KOLs BR acima de **R$ 20 mil/mês**; média citada p/ iniciantes estruturados ~R$ 4.500; teto citado de até R$ 50 mil [12](https://www.idinheiro.com.br/ganhar-dinheiro/afiliados/programa-de-afiliados-shopee-saiba-como-ganhar-dinheiro/) [13](https://www.remessaonline.com.br/blog/shopee-afiliado/)
- Regras de pagamento 2025: mínimo R$ 30, saque via ShopeePay até R$ 3.000, PF desconta 11% INSS + IR [14](https://tactus.com.br/como-sacar-dinheiro-da-shopee-afiliado/) [13](https://www.remessaonline.com.br/blog/shopee-afiliado/)

---

## 3. Evidência no GitHub — blocos de construção já existem (e validam a arquitetura)

> Conclusão estratégica: **ninguém juntou as peças** (descoberta + copy IA + decisão automática).
> O HARNESS não compete com esses repos; ele orquestra esse tipo de capacidade com camada de decisão.

| Repositório | O que prova | Link |
|---|---|---|
| `amirulskulker/social-commerce-intel` | "Product research machine" TikTok Shop/Shopee MY: fee math, **breakeven calculators, 132-product scorer, trend-wave model** — a lógica JEV do HARNESS tem precedente funcional | [15](https://github.com/amirulskulker/social-commerce-intel) |
| `rlucio01/bot-ofertas-telegram` | Bot 24/7 que garimpa ML/Shopee/Amazon **usando as APIs oficiais de afiliado** (Linkbuilder, Shopee Open API GraphQL) e posta com link comissionado — prova de viabilidade técnica da L1 sem scraper arriscado | [16](https://github.com/rlucio01/bot-ofertas-telegram) |
| `SaulloGabryel/BlueBot` | Monitor de grupos → gera link de afiliado (ML/Shopee/AliExpress) → Telegram/WhatsApp: validação do canal "grupo de ofertas" como via de distribuição | [17](https://github.com/SaulloGabryel/BlueBot) |
| `internick2017/shopee-affiliate-bot` | Bot que **verifica o desconto contra o anúncio ao vivo** antes de postar — mesmo princípio de quality gate do HARNESS | [18](https://github.com/internick2017/shopee-affiliate-bot) |
| `murilo813/Bot-Afiliado-Telegram` | Conversão automática de link comum → link comissionado em 6 lojas BR | [19](https://github.com/murilo813/Bot-Afiliado-Telegram) |
| `guilhermeal/affiliate-scraper` | Contrato JSON único p/ 5 marketplaces + **aviso honesto**: coleta automatizada é restrita nos ToS; APIs oficiais são o caminho de menor risco — fundamento da decisão de usar só APIs oficiais | [20](https://github.com/guilhermeal/affiliate-scraper) |
| `akherlan/onlineshop` | Coleta leve na API pública v4 da Shopee criada *para atividade de afiliado pessoal* — prova de que a API sustenta o caso de uso | [21](https://github.com/akherlan/onlineshop) |
| `mpl1018/Automated-Amazon-Affiliate-Store` | Loja de afiliado 100% automatizada (cron + scraper + Firebase), comissões até 10% | [22](https://github.com/mpl1018/Automated-Amazon-Affiliate-Store) |
| `johnmenke1/openadkit-open-source-ai-marketing-tool` | Alternativa open-source a Jasper: 18 geradores, 11 otimizadores, frameworks PAS/AIDA/BAB/4U's/Schwartz + benchmarks CTR/CPC/CVR/ROAS por vertical — **valida a demanda por ferramenta de copy grátis/aberta** | [23](https://github.com/johnmenke1/openadkit-open-source-ai-marketing-tool) |
| `AgriciDaniel/claude-ads` | Skill de paid-media p/ 12 plataformas com **scoring determinístico e auditoria** — mesma filosofia de decisão auditável do LAYA | [24](https://github.com/AgriciDaniel/claude-ads) |
| `eracle/OpenOutreach` | 3,1k stars: agente de lead-gen open-source — sinal de apetite do mercado por agentes de marketing self-hosted | [25](https://github.com/eracle/OpenOutreach) |
| Tópico `shopee` (Python) | 58 repositórios públicos (scrapers, price trackers, research) — ecossistema ativo | [26](https://github.com/topics/shopee?l=python&o=desc&s=updated) |

---

## 4. Evidência no Hugging Face — modelos e datasets para as camadas de IA

| Recurso | O que prova | Link |
|---|---|---|
| `criteo/CriteoClickLogs` | **4,37 bilhões de linhas** de logs reais de cliques em anúncios (276 GB) — o benchmark mundial de predição de CTR existe e é aberto | [27](https://huggingface.co/datasets/criteo/CriteoClickLogs) |
| Benchmark acadêmico CTR (Criteo/Avazu) | Modelos abertos atingem **AUC 0,80-0,81** prevendo clique; Criteo tem ~46M instâncias e 26% de positivos — base científica p/ o futuro preditor de CTR do HARNESS | [28](https://arxiv.org/pdf/2009.05794) |
| `akwin123/copywriter-gemma4-31b` | Fine-tune de copywriting: **Elo 1657 vs 1367 do modelo base**, vence 24/30 briefs reais — prova de que fine-tuning de copy gera ganho mensurável | [29](https://huggingface.co/akwin123/copywriter-gemma4-31b) |
| `PeterBrendan/llama-2-7b-Ads` + `Ads_Creative_Ad_Copy_Programmatic` (7.097 criativos) + `AdImageNet` (9.003 criativos) | Datasets abertos de criativos de anúncio reais p/ treinar/avaliar geração | [30](https://huggingface.co/PeterBrendan/llama-2-7b-Ads) |
| `marketeam/GemMarketing` | Modelo de 2B params fine-tuned em **43B tokens de corpus de marketing** — geração de copy como commodity aberta | [31](https://aimarketingnow.substack.com/p/leveraging-hugging-face-for-marketing) |

**Decisão de arquitetura derivada:** o HARNESS v2 usa templates determinísticos + checagem de
compliance (já implementados em `jevlaya/criativos.py`) e deixa a IA como preenchimento opcional
via endpoint `/generate-content` — porque a prova acima mostra que IA gera copy boa, mas o gate de
qualidade/compliance tem que ser determinístico (o modelo alucina promessas proibidas).

---

## 5. Da evidência para a lógica do produto (como cada prova vira feature)

| Evidência | Feature correspondente no HARNESS |
|---|---|
| CPC alto mata margem (casos §2.1, §2.5) | `cpc_maximo()` + regra PAUSAR quando CPC real estoura o teto (`veredito.py`) |
| CVR baseline 0,5-1% [3](https://cropink.com/affiliate-marketing-statistics) | CVR esperada calibrada por prova social: `0.01 + 0.02*E` (`orquestrador_laya.py`) |
| Comissão Shopee 3% base + bônus 25-30% [11](https://www.reddit.com/r/empreendedorismo/comments/1meakga/does_being_a_shopee_affiliate_actually_make_money/) | Preditor **V** soma base+extra e classifica se "fecha no pago" ou "só no orgânico" |
| Fadiga de criativo em 2-3 meses [6](https://www.reddit.com/r/Affiliatemarketing/comments/1qi6hda/spent_a_year_trying_to_crack_affiliate_income/) | Matriz 30 variações + veredito OTIMIZAR + teste A/B com amostra mínima |
| Intenção > volume (CVR 45% no nicho certo) [5](https://www.reddit.com/r/Affiliatemarketing/comments/1k7cj14/proof_that_in_affiliate_marketing_youll_always/) | Preditor **J** (janela de demanda) + vias segmentadas por intenção |
| API oficial > scraper (risco de ToS) [20](https://github.com/guilhermeal/affiliate-scraper) | L1 projetada para plugar Shopee Open API / ML Linkbuilder / PA-API, contrato estável |
| Decisão auditável vende [24](https://github.com/AgriciDaniel/claude-ads) | Trilha de auditoria por camada em toda execução LAYA |
| Funil + captura > link direto [6](https://www.reddit.com/r/Affiliatemarketing/comments/1qi6hda/spent_a_year_trying_to_crack_affiliate_income/) | Via "advertorial/pré-venda" sugerida automaticamente p/ infoproduto |

---

## 6. Referências completas

**Reddit:** [4](https://www.reddit.com/r/Affiliatemarketing/comments/iv2pmk/made_24000mo_with_amazon_affiliate_in_april_2020/) · [5](https://www.reddit.com/r/Affiliatemarketing/comments/1k7cj14/proof_that_in_affiliate_marketing_youll_always/) · [6](https://www.reddit.com/r/Affiliatemarketing/comments/1qi6hda/spent_a_year_trying_to_crack_affiliate_income/) · [7](https://www.reddit.com/r/Affiliatemarketing/comments/1r1vhjt/people_who_actually_make_money_with_affiliate/) · [8](https://www.reddit.com/r/juststart/comments/bzvap3/case_study_growing_a_purchased_affiliate_site/) · [9](https://www.reddit.com/r/juststart/comments/dv1anc/case_study_growing_a_purchased_affiliate_site/) · [10](https://www.reddit.com/r/juststart/comments/jr4n81/case_study_1_buying_and_rebuilding_an_old/) · [11](https://www.reddit.com/r/empreendedorismo/comments/1meakga/does_being_a_shopee_affiliate_actually_make_money/)
**GitHub:** [15](https://github.com/amirulskulker/social-commerce-intel) · [16](https://github.com/rlucio01/bot-ofertas-telegram) · [17](https://github.com/SaulloGabryel/BlueBot) · [18](https://github.com/internick2017/shopee-affiliate-bot) · [19](https://github.com/murilo813/Bot-Afiliado-Telegram) · [20](https://github.com/guilhermeal/affiliate-scraper) · [21](https://github.com/akherlan/onlineshop) · [22](https://github.com/mpl1018/Automated-Amazon-Affiliate-Store) · [23](https://github.com/johnmenke1/openadkit-open-source-ai-marketing-tool) · [24](https://github.com/AgriciDaniel/claude-ads) · [25](https://github.com/eracle/OpenOutreach) · [26](https://github.com/topics/shopee?l=python&o=desc&s=updated)
**Hugging Face / academia:** [27](https://huggingface.co/datasets/criteo/CriteoClickLogs) · [28](https://arxiv.org/pdf/2009.05794) · [29](https://huggingface.co/akwin123/copywriter-gemma4-31b) · [30](https://huggingface.co/PeterBrendan/llama-2-7b-Ads) · [31](https://aimarketingnow.substack.com/p/leveraging-hugging-face-for-marketing)
**Mercado/BR:** [1](https://www.wix.com/blog/affiliate-marketing-statistics) · [2](https://dataintelo.com/report/affiliate-marketing-programs-software-market) · [3](https://cropink.com/affiliate-marketing-statistics) · [12](https://www.idinheiro.com.br/ganhar-dinheiro/afiliados/programa-de-afiliados-shopee-saiba-como-ganhar-dinheiro/) · [13](https://www.remessaonline.com.br/blog/shopee-afiliado/) · [14](https://tactus.com.br/como-sacar-dinheiro-da-shopee-afiliado/)
