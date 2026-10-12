# 02 · Pesquisa no Hugging Face: modelos e datasets que o afiliado pode usar hoje

> Método: consultas à **API pública do Hugging Face** (`/api/models`, `/api/datasets`) e leitura das
> fichas dos datasets, em **12/10/2026**. Diferente do GitHub (código/ferramentas), o HF entrega
> **pesos de modelo e dados estruturados** — ou seja: (a) um banco de ofertas com comissão, cookie,
> requisitos e fontes; (b) LLMs afinados em marketing; (c) datasets de copy/criativo para treinar
> seu próprio gerador.

---

## 1. O achado mais valioso: um banco de 2.578 programas de afiliados

**`bestaffiliateprograms/affiliate-programs`** (dataset, licença `other`, atualizado 06/10/2026)
— 2.578 linhas, uma por programa, **cada número com URL de origem e data de verificação**.

### Schema real (o que você recebe em cada linha)

| Campo | Tipo | Uso |
| --- | --- | --- |
| `slug`, `name`, `homepage`, `applyUrl` | string | Identificação + link de cadastro |
| `category`, `categoryLabel` | 19 classes | Filtro por vertical (marketplace, SaaS, VPN, finanças…) |
| `network`, `networkRaw` | 34 classes / 283 valores | Em qual rede o programa roda (Awin, Impact, Involve Asia, In-house…) |
| `commission` | string | Texto publicado da comissão (faixas, tetos, tiers) |
| `cookie` | 195 valores distintos | Janela de atribuição (24 h, 5 dias, 30 dias, 90 dias…) |
| `recurring` | bool | Comissão recorrente (assinatura) |
| `howEarned` | string | Como a comissão é ganha (CPS, CPA, CPL, tier, cap por pedido) |
| `requirements` | string | O que exigem para aprovar (site ativo, depósito, geo, tráfego mínimo) |
| `confidence` | `confirmed` \| `network` | Se o dado veio da página oficial do programa ou de listing de rede |
| `modelledValuePerReferralUsd` | int (1–2.000) | **Valor modelado por indicação** — o número que aproxima o EPC |
| `lastVerified` | timestamp (17/08/2026 → 06/10/2026) | Frescor do dado |
| `sources` | lista (1–5 URLs) | Rastreabilidade |

### Amostra de linhas (dados públicos do próprio dataset)

| Programa | Rede | Comissão publicada | Cookie | Valor modelado/indicação |
| --- | --- | --- | --- | --- |
| **Hotmart** | In-house | até 80% (definida pelo produtor; tipicamente 30–80%) | 30 dias | US$ 20 |
| **Mercado Livre Afiliados (BR)** | Programa próprio | até 16% por categoria (Moda/Beleza 14–16%, Casa 12–14%, Eletrônicos 9–11%, Ferramentas 8–10%) | ~24 h (não oficial) | US$ 4 |
| **Mercado Libre (MX)** | In-house | até 20% direto / 10% indireto (eletrônicos ~10%/5%; alimentos 0%) | desconhecido | US$ 3 |
| **Shopee** | Involve Asia / programa próprio | 7–12% novo comprador; ~2,5% recorrente | 7 dias | US$ 1 |
| **Americanas (BR)** | Indoleads / DGMAX | 10% (Indoleads); por categoria (DGMAX) | 14 h (Indoleads) | — |
| **bol.com (NL)** | Awin | 2,5%–7% por tier (Platinum 7%, Gold 6%, Silver 4%, Bronze 2,5%) | 5 dias | US$ 3 |
| **Cdiscount (FR)** | Awin | até 6–8% (high-tech ~2–3%, casa ~2,5–3,5%, lazer ~3–4%, moda ~4–5%) | 7 dias | US$ 4 |
| **Lazada (SEA)** | Involve Asia | CPS por categoria; tiers de criador até 12,75% (direto), 8,5% ou 3,4% cross-store, com cap por pedido | 7 dias | US$ 1 |
| **Noon (MENA)** | In-house / ArabClicks | até 8% (~4% base); CPA fixo em algumas redes; ArabClicks é coupon-only | 7 dias (link) | US$ 5 |

> ⚠️ O dataset é **fotografia de dados publicados**, com `confidence` e `sources` por linha.
> Trate como *shortlist*: confirme sempre na página oficial antes de construir conteúdo em cima.

### Como carregar

```python
# pip install datasets
from datasets import load_dataset
ds = load_dataset("bestaffiliateprograms/affiliate-programs", split="train")
df = ds.to_pandas()

# Shortlist: recorrente OU alto valor por indicação, com cookie >= 30 dias
import re
def cookie_days(s):
    m = re.search(r"(\d+)\s*(day|d)", str(s).lower())
    return int(m.group(1)) if m else 0
df["cookie_d"] = df["cookie"].map(cookie_days)
short = df[(df["cookie_d"] >= 30) | df["recurring"]].sort_values(
    "modelledValuePerReferralUsd", ascending=False).head(40)
print(short[["name","network","commission","cookie","recurring","modelledValuePerReferralUsd","applyUrl"]])
```

```bash
# sem instalar nada (HTTP): primeiras linhas e estatísticas
curl -s "https://datasets-server.huggingface.co/rows?dataset=bestaffiliateprograms/affiliate-programs&config=default&split=train&offset=0&length=20" | jq '.rows[0].row'
curl -s "https://datasets-server.huggingface.co/filter?dataset=bestaffiliateprograms/affiliate-programs&config=default&split=train&where=%22recurring%22%3Dtrue&orderby=%22modelledValuePerReferralUsd%22%20desc&length=25" | jq '.rows[].row | [.name,.commission,.cookie,.modelledValuePerReferralUsd]'
```

**Fluxo que recomendamos:** dataset HF (2.578) + registro `Affitor/open-affiliate` (349+, YAML/MCP)
→ consolide em `templates/planilha-ofertas.csv` → rode
`python3 ferramentas/afiliado.py ofertas --csv ...` → ranking por **EPC esperado + Affiliate Score**.

---

## 2. Outros datasets úteis

| Dataset | Tamanho | Para que serve |
| --- | --- | --- |
| `MuratcanKoylan/MarketingStructuralPrompts` | 4.643 prompts (MIT), sendo **20 específicos de afiliados** + blocos de ROAS, CPC, CPL, CPM, programmatic, remarketing, YouTube Ads, Instagram Ads | Biblioteca de prompts pronta para briefs, copy e análise de campanha |
| `marketeam/FineWeb-Marketing` | ~495 mil documentos | Corpus de marketing para continuar pré-treino/avaliação de modelo próprio |
| `marketeam/Marketing-Emails` | ~16,4 mil | Treinar/avaliar e-mail marketing (o canal de maior conversão: 3,2–8,5%) |
| `marketeam/marketing_user_prompts_unfiltered` | ~360 mil | Entender o que usuários pedem a LLMs de marketing (ideação de conteúdo) |
| `PeterBrendan/AdImageNet` | 9.003 criativos + texto extraído | Fine-tune de gerador de criativo display/banners por formato |
| `PeterBrendan/Ads_Creative_Text_Programmatic` | 1.000 amostras, 8 tamanhos de anúncio | Copy programática por dimensão de creative |
| `Karmane/tiktok-shop-affiliate-product-signals` | < 1 mil produtos (MIT, parquet) | Sinais de produto TikTok Shop: preço, linguagem de venda, benchmark de comissão, ângulos de conteúdo, frete, categoria |
| `AI-AIMS/25_Articles-Affiliate-Marketing` | 25 artigos (CC0) | Seed de estilo/estrutura para posts de afiliado |
| `emailmarketingdataset/open-email-marketing-dataset` | 1.000 pares Q&A (MIT, JSONL) | FAQ/schema, cold e-mail, gaps de conteúdo |

---

## 3. Modelos: LLMs afinados em marketing

| Modelo | Base | Notas | Uso recomendado |
| --- | --- | --- | --- |
| `marketeam/Qwen-Marketing` | Qwen3-8B (MIT) | ~76 mil downloads, 57 likes — o mais usado da família | Rascunho de copy PT/EN, briefs, respostas de marketing com raciocínio |
| `marketeam/LLa-Marketing` | LLaMA-3-8B | Pré-treino contínuo em **43 bi de tokens** de marketing (blogs, landing pages, e-mails, anúncios, reviews) | Domínio de vocabulário de marketing |
| `marketeam/Gemma-4-Marketing`, `Gem-Marketing` (3B), `Phi-Marketing` (4B) | Gemma/Gem/Phi | Pequenos → rodam local/barato | Geração em volume com custo baixo |
| `marketeam/Fineweb-Classifier-Marketing` | classificador 0.3B | Classifica se um texto é "marketing" | Filtrar corpus/curadoria |
| `cyberandy/SEOcrate-4B_grpo_new_01` | Gemma-3-4B-it | **RL (GRPO)** guiado por ontologia de SEO (schema.org + SEOntology/`seovoc`), ~960 exemplos sintéticos, 500 steps | Raciocínio de SEO: otimizar title/meta, intenção, canonical, robots, E-E-A-T, schema de produto |
| `PeterBrendan/AdsGPT2` | GPT-2 | Treinado em 10 mil+ criativos programáticos | Inspiração de headline de anúncio (não publicar sem editar) |

```python
# Inferência local (GPU) — copy de afiliado
import transformers, torch
pipe = transformers.pipeline(
    "text-generation",
    model="marketeam/Qwen-Marketing",
    model_kwargs={"torch_dtype": torch.bfloat16},
    device_map="auto",
)
print(pipe("Write an honest comparison outline: best budget standing desk 2026, "
           "with methodology, pros/cons and a disclosure line."))
```

Sem GPU: use os **Inference Providers** do próprio HF (página do modelo → "Deploy"), ou um modelo
grande via API e mantenha o modelo pequeno apenas para classificação/embeddings.

---

## 4. Três pipelines prontos para afiliados (com código)

### 4.1 Descoberta de ofertas → ranking por EPC esperado

```python
from datasets import load_dataset
import pandas as pd
df = load_dataset("bestaffiliateprograms/affiliate-programs", split="train").to_pandas()
df = df[df["category"].isin(["marketplace","saas","finance","vpn","hosting"])]
df["score"] = (
    df["modelledValuePerReferralUsd"].clip(upper=200) / 200 * 45   # valor por indicação
  + df["recurring"].astype(int) * 25                               # recorrência
  + (df["confidence"] == "confirmed").astype(int) * 15             # dado confirmado na fonte
  + df["cookie"].str.contains("30|60|90|180|day", na=False) * 15   # janela longa
)
df.sort_values("score", ascending=False).head(30).to_csv("shortlist-ofertas.csv", index=False)
```

### 4.2 Cluster de intenção de busca (keywords → clusters de conteúdo)

```python
# pip install sentence-transformers pandas
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.cluster import AgglomerativeClustering

kw = pd.read_csv("keywords.csv")            # coluna: keyword
emb = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")  # multilíngue (PT+EN)
X = emb.encode(kw["keyword"].tolist(), show_progress_bar=True)
kw["cluster"] = AgglomerativeClustering(n_clusters=12, linkage="ward").fit_predict(X)
kw.groupby("cluster")["keyword"].apply(lambda s: ", ".join(s.head(8))).to_markdown("clusters.md")
```
Saída: 8–15 clusters que viram **pilares de conteúdo** (cap. 06) — cada cluster = 1 pilar,
1 money page + 5–10 artigos/vídeos de suporte.

### 4.3 Classificador de intenção (informacional vs comercial vs transacional)

```python
from transformers import pipeline
clf = pipeline("text-classification", model="cyberandy/SEOcrate-4B_grpo_new_01")  # ou zero-shot com BART
print(clf("Classify search intent: melhor notebook para editar video 4k"))
# Priorize comercial/transacional: converte até 5x mais que informacional
```

---

## 5. O que **não** fazer com IA no Hugging Face

| 🔴 Erro | Por quê | 🟢 Correto |
| --- | --- | --- |
| Publicar copy gerada sem checar preço/spec | Preço errado quebra confiança e viola política de marketplaces (Amazon/Shopee) | Puxar dado **via API** (PA-API, Shopee Open API) e deixar a IA só na estrutura do texto |
| Gerar "review" de produto que você não testou | Regra da FTC contra reviews falsos/enganosos (em vigor desde fim de 2024) + risco jurídico no CDC/CONAR | IA faz outline; você insere teste real, fotos, medidas |
| Ignorar licença do dataset/modelo | Vários são `other`/não-comerciais | Ler o card (`license:`) antes de monetizar |
| Usar modelo de 3–8B como autoridade factual | Alucinação em números, datas, políticas | Modelo pequeno para **formato**; fatos vêm de fontes verificadas |
| Traduzir conteúdo EN→PT e publicar em massa | Conteúdo duplicado/traduzido sem valor é alvo de updates de spam | Localização real: preços em R$, lojas BR, exemplos BR, normas BR |
| Automação sem gate de qualidade | Volume sem revisão = penalização | Gate em 5 pontos: fato, link, disclosure, originalidade, leitura humana |

---

## 6. Checklist de adoção de IA (afiliado)

- [ ] Tenho um **corpus próprio** (meus testes, minhas métricas, meus prints) para alimentar o modelo.
- [ ] Rodo **pesquisa de ofertas** com dados estruturados (HF + open-affiliate), não com "achismo".
- [ ] Uso IA para: outline, estrutura de comparação, FAQ, schema, títulos alternativos, resumo de
      comentários (mineração de dor), tradução técnica revisada.
- [ ] **Não** uso IA para: inventar experiência, inventar número, criar review de produto não testado,
      girar texto de terceiros.
- [ ] Todo post passa por gate: fato → link → disclosure → originalidade → revisão humana.
- [ ] Meço o efeito: tráfego de IA (referrer `chatgpt.com`, `perplexity.ai`, `gemini.google.com`,
      `copilot.microsoft.com`) separado no analytics — hoje converte ~11x mais que busca tradicional.

---

### Fontes deste capítulo

Hugging Face: `bestaffiliateprograms/affiliate-programs` (ficha + viewer, consultado em 12/10/2026);
organização `marketeam` (Qwen-Marketing, LLa-Marketing, Gem/Phi/Gemma-Marketing, Fineweb-Classifier,
FineWeb-Marketing, Marketing-Emails, marketing_user_prompts_unfiltered);
`MuratcanKoylan/MarketingStructuralPrompts`; `PeterBrendan/AdsGPT2`, `AdImageNet`,
`Ads_Creative_Text_Programmatic`; `cyberandy/SEOcrate-4B_grpo_new_01`;
`Karmane/tiktok-shop-affiliate-product-signals`; `AI-AIMS/25_Articles-Affiliate-Marketing`;
`emailmarketingdataset/open-email-marketing-dataset`. Links completos no capítulo 16.
