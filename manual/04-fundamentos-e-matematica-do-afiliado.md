# 04 · Fundamentos e a matemática do afiliado

> Se você ler só um capítulo técnico, leia este. Toda decisão (nicho, oferta, canal, orçamento de
> anúncio, negociação de taxa) sai das 8 fórmulas abaixo.

---

## 1. Glossário mínimo (o vocabulário das redes)

| Termo | Significado | Por que importa |
| --- | --- | --- |
| **CPS** (cost per sale) | Você recebe % da venda | Modelo dominante no varejo e infoproduto |
| **CPA / CPL / CPI** | Valor fixo por ação/lead/instalação | Comum em finanças, seguros, apps, VPN — paga mais por conversão |
| **Bounty** | Valor fixo por evento (ex.: assinatura Prime, conta aberta) | Amazon e fintechs usam; ótimo EPC |
| **Cookie / janela de atribuição** | Tempo entre clique e compra que ainda gera comissão | 24 h (Amazon, ML) vs 7 dias (Shopee) vs 30–90 (Awin, redes SaaS) vs 180 (Hotmart configurável) |
| **Last click / first click / multi-touch** | Regra de quem leva a comissão | Last click é o padrão; por isso cupom "rouba" a venda do criador |
| **EPC** | Receita ÷ cliques | **A métrica.** Comparar ofertas sem EPC é chute |
| **CR** (conversion rate) | Vendas ÷ cliques | Depende de oferta, página, preço e qualidade do tráfego |
| **AOV** (ticket médio) | Valor médio do pedido | Multiplica a comissão |
| **LTV** | Receita recorrente total por cliente | SaaS/assinatura: comissão recorrente muda tudo |
| **Reversal / chargeback / reembolso** | Comissão cancelada | Infoproduto BR tem reembolso de 7–30 dias; suplemento tem chargeback |
| **Hold / aprovação** | Período até a comissão virar "aprovada" | Afeta fluxo de caixa (Amazon ~60 dias; Hotmart 15–30; ML até 60) |
| **Sub-id / click id** | Seu identificador no clique | Permite saber qual peça gerou a venda |
| **Postback S2S** | A rede avisa seu servidor da conversão | Única forma confiável de medir sem cookie |
| **Incrementalidade** | % das vendas que **não** teriam acontecido sem você | Cap. 00 §5 — define seu poder de negociação |
| **GEO/AEO** | Otimização para respostas de IA (ChatGPT, Perplexity, AI Overviews) | Tráfego pequeno, conversão ~11x maior |

---

## 2. As 8 fórmulas

```
1) EPC                = receita de comissão / cliques
2) Receita esperada   = visitas × CTR_link × CR × AOV × %comissão
3) EPC teórico        = CR × AOV × %comissão
4) Receita por visita (RPV) = CTR_link × EPC
5) Break-even CPC     = EPC                      (tráfego pago: pague menos que o EPC)
6) Break-even CPA     = AOV × %comissão × CR     (quanto você pode pagar por lead/venda)
7) ROAS necessário    = 1 / (%comissão × margem-alvo)
8) LTV recorrente     = comissão_mensal × (1 / churn)
```

### 2.1 EPC teórico — comparando ofertas na ponta do lápis

| Oferta | CR | AOV | Comissão | EPC teórico |
| --- | --- | --- | --- | --- |
| E-book Hotmart R$ 97 | 3,0% | R$ 97 | 60% | **R$ 1,75** |
| Curso Hotmart R$ 997 | 1,2% | R$ 997 | 50% | **R$ 5,98** |
| Colchão/Eletro Magalu R$ 1.800 | 1,5% | R$ 1.800 | 6% | **R$ 1,62** |
| Amazon BR beleza R$ 120 | 6,0% | R$ 120 | 13% | **R$ 0,94** |
| Amazon BR eletrônico R$ 2.500 | 2,0% | R$ 2.500 | 3% | **R$ 1,50** |
| SaaS US$ 49/mês recorrente 30% (churn 5%/mês) | 2,0% | US$ 49 | 30% | mês 1: **US$ 0,29** · LTV: **US$ 2,94** |
| Cartão de crédito US (bounty) | 1,5% | US$ 150 fixo | — | **US$ 2,25** |
| Hospedagem (bounty US$ 65) | 2,5% | US$ 65 | — | **US$ 1,63** |

**Conclusões que mudam decisão:**

- Curso de ticket alto com CR baixa **ganha** de e-book barato com CR alta (R$ 5,98 vs R$ 1,75).
- **Recorrência** transforma EPC ruim em LTV ótimo (US$ 0,29 → US$ 2,94). Por isso SaaS é o nicho
  favorito de quem dolariza.
- Amazon "ganha" em **beleza/saúde/alimentos (13% no BR)** e perde em eletrônicos (1–3%).
- **Bounty** (cartão, seguro, hospedagem, VPN) é o que dá EPC alto com tráfego pequeno — foi o que
  o criador do vídeo-base citou (US$ 100–200 por cartão aprovado).

### 2.2 Receita esperada — três cenários (20.000 visitas/mês)

Fórmula 2 com CTR de link 3,5% (típico em página de review bem construída):

| Cenário | CR | AOV | Comissão | Cliques | Vendas | Receita/mês |
| --- | --- | --- | --- | --- | --- | --- |
| Amazon BR (beleza) | 6,0% | R$ 150 | 13% | 700 | 42 | **R$ 819** |
| Magalu (eletro) | 2,0% | R$ 900 | 7% | 700 | 14 | **R$ 882** |
| Hotmart (curso R$ 997) | 1,2% | R$ 997 | 50% | 700 | 8,4 | **R$ 4.187** |

Mesma audiência: **5x mais receita** só trocando a oferta. É por isso que a ordem correta é
**nicho → oferta com EPC alto → conteúdo**, e não o contrário.

### 2.3 Break-even de tráfego pago (quando vale anunciar)

```
EPC = R$ 5,98  →  você pode pagar até R$ 5,98 por clique e ainda empatar.
Meta de ROAS 2x → CPC-alvo = EPC / 2 = R$ 2,99
CPC real Meta Ads BR (nicho quente) ≈ R$ 0,60–2,50  →  viável.
CPC real Google Ads BR (termo comercial) ≈ R$ 1,50–8,00 →  só com oferta de EPC alto.
```

Nos EUA o CPC médio de paid search é ~US$ 4,22 → **só ofertas com EPC ≥ US$ 8 fecham conta**
(finanças, seguros, SaaS B2B, hospedagem, energia solar). Isso explica por que afiliado iniciante
em mercado global deve começar por **orgânico** e só depois pagar tráfego.

### 2.4 Regra dos 3 números (para não se perder em vanity metrics)

Meça **sempre** estes três, por peça e por canal:

1. **Cliques** (seu `/go/` log ou painel da rede)
2. **EPC** (receita ÷ cliques)
3. **RPV** (receita ÷ visitas ou ÷ views)

Views, likes, seguidores e impressões **não pagam boleto**. Um vídeo com 3.000 views e RPV de
R$ 1,20 vale mais que um vídeo com 300.000 views e RPV de R$ 0,02 (é literalmente o caso do
colchão citado no vídeo-base: poucos milhares de views × ~US$ 500 de comissão por venda).

---

## 3. Modelos de negócio do afiliado (escolha 1 para começar)

| Modelo | Descrição | Prazo até 1ª comissão | Custo | Teto | Risco |
| --- | --- | --- | --- | --- | --- |
| **A. Autoridade de nicho (site + SEO/GEO)** | 50–200 peças comerciais em um nicho | 3–6 meses | Baixo | Alto (ativo vendável) | Update de algoritmo/IA |
| **B. Criador (YouTube/TikTok/Instagram)** | Review e demonstração em vídeo | 2–8 semanas | Baixo | Muito alto | Depende de plataforma |
| **C. Lista (newsletter/WhatsApp/Telegram)** | Oferta diária/semanal para base opt-in | 2–6 semanas | Baixo | Alto | Deliverability/banimento |
| **D. Tráfego pago direto (media buying)** | Anúncio → pré-sell → oferta | 3–14 dias | Médio/alto | Médio | Bloqueio de conta, margem apertada |
| **E. Social commerce (TikTok Shop/Shopee Live)** | Vídeo/live com produto nativo | 1–4 semanas | Baixo | Alto e crescendo | Regras da plataforma, comissão definida pelo lojista |
| **F. Arbitragem de cupom/deal/cashback** | Site de cupons | Rápido | Baixo | Baixo | 🔴 Incrementalidade 29–34% → anunciantes cortando |
| **G. Produtor + afiliados (vira anunciante)** | Cria oferta e recruta afiliados | 2–4 meses | Médio | Muito alto | Execução de produto/suporte |

🟢 Recomendação deste manual para 2026: **B + A + C** (criador como motor de descoberta, site como
base de autoridade e SEO/GEO, lista como ativo de retenção), adicionando **E** se seu nicho é produto
físico de demonstração rápida, e **G** depois do mês 9 (cap. 12).

---

## 4. Ciclo de caixa: o detalhe que quebra iniciante

Comissão aprovada ≠ dinheiro na conta. Monte o calendário com os prazos reais:

| Programa | Aprovação / hold | Pagamento |
| --- | --- | --- |
| Amazon BR | ~60 dias após o fim do mês | mínimo R$ 30 |
| Mercado Livre | até 60 dias após fechamento do mês | via Mercado Pago |
| Magalu | quinzenal (dias 3–7 e 19–22) | mínimo R$ 50 |
| Shopee | PF até dia 10 (carteira digital); PJ até dia 30 com NF enviada até dia 5 | mínimo R$ 10 |
| Hotmart | 15–30 dias (após garantia do produto) | mínimo baixo (R$ 20 citado; saque via conta BR) |
| Kiwify | conforme garantia | mínimo R$ 5 |
| Awin | processamento dias 1 e 15 | mínimo US$ 20 (BACS) |
| Impact/PartnerStack (global) | 30–90 dias | US$ 5–25 típico |

**Regra:** nos primeiros 90 dias, não conte com caixa de afiliados para viver. Reserve 3–6 meses de
custo de vida ou mantenha renda paralela. (Cap. 11 tem o orçamento semana a semana.)

---

## 5. Metas numéricas por fase (use como painel)

| Fase | Métrica-alvo | Ferramenta |
| --- | --- | --- |
| Fundação (semana 1–4) | 1 nicho, 3 ofertas com EPC teórico ≥ R$ 1,50 / US$ 0,30, site no ar, 10 peças publicadas | `ferramentas/afiliado.py ofertas` |
| Tração (mês 2–3) | 1.000 visitas/mês · CTR de link ≥ 3% · 100 cliques/mês · 1ª comissão | analytics próprio |
| Validação (mês 4–6) | 5.000 visitas/mês · EPC ≥ R$ 1,00 · R$ 1.000–5.000/mês · 300 contatos na lista | dashboard semanal |
| Escala (mês 7–12) | 20.000+ visitas/mês · 2 canais ≥ 30% da receita cada · ROAS ≥ 2 em paga · PJ aberta | cap. 12 |
| Ativo (ano 2) | 3 ofertas próprias/parcerias diretas · 30–50% da receita recorrente · documentação/SOPs · valuation | cap. 12 §saída |

---

## 6. Erros de matemática mais comuns

1. **Comparar comissão sem CR e AOV** → escolhe 80% de um produto que ninguém compra.
2. **Ignorar cookie** → faz topo de funil para programa de 24 h (o clique "morre" antes da compra).
3. **Ignorar reembolso/chargeback** → fatura R$ 10 mil e vê R$ 3 mil sumirem no mês seguinte.
4. **Ignorar imposto** → 27,5% na pessoa física vs ~6% inicial no Simples (cap. 09 §impostos).
5. **Calcular ROAS sobre receita bruta** e não sobre **comissão líquida**.
6. **Escalar anúncio antes de ter EPC medido organicamente** → paga CPC sem saber o break-even.
7. **Trocar de nicho antes de 100 peças** → reinicia a curva de aprendizado a cada 6 semanas.

---

## 7. Planilha viva

`templates/planilha-ofertas.csv` + `templates/kpi-semanal.csv` são a base. Rode:

```bash
python3 ferramentas/afiliado.py ofertas  --csv templates/planilha-ofertas.csv   # ranking por EPC/score
python3 ferramentas/afiliado.py projecao --visitas 20000 --ctr .035 --cr .012 --aov 997 --comissao .5
python3 ferramentas/afiliado.py break-even --comissao-media 598 --cr 0.012      # CPC máximo
python3 ferramentas/afiliado.py kpi --csv templates/kpi-semanal.csv             # resumo semanal
```
