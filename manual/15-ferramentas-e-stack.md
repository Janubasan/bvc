# 15 · Ferramentas e stack por orçamento

> Critério de escolha desta lista: **adoção pública** (estrelas no GitHub / downloads no Hugging Face),
> manutenção recente e custo. Nada aqui é obrigatório — o stack mínimo é domínio + editor + analytics.

---

## 1. Stack por faixa de orçamento

### 🟢 Nível 0 — R$ 0 a R$ 60/mês (validação, meses 1–3)

| Função | Ferramenta | Custo |
| --- | --- | --- |
| Site | Cloudflare Pages / Vercel (Astro ou Next estático) | grátis |
| Domínio | Registro.br (.com.br) ou Namecheap/Cloudflare (.com) | ~R$ 40/ano |
| CMS | Markdown no repositório + Astro/Next · ou WordPress grátis em hospedagem barata | 0–R$ 25 |
| Analytics | Cloudflare Web Analytics **ou** Plausible self-host **ou** Matomo | grátis |
| E-mail | Brevo/MailerLite/Beehiiv free tier (até ~500–2.500 contatos) · Listmonk self-host | grátis |
| Keyword research | `chukhraiartur/seo-keyword-research-tool` (autocomplete + PAA + related) | grátis |
| SEO/GEO | `AgriciDaniel/claude-seo`, `zubair-trabzada/geo-seo-claude`, `Ryze-AI-Adgent/open-seo-mcp-skills` (MCP) | grátis (requer agente) |
| Conteúdo | Assistente de IA que você já usa + skills (`Affitor/affiliate-skills`, `marketingskills`) | 0–R$ 120 |
| Ofertas | Hugging Face `bestaffiliateprograms/affiliate-programs` + `Affitor/open-affiliate` (API/CLI/MCP) | grátis |
| Link/`/go/` | `ferramentas/afiliado.py links` (deste repositório) | grátis |
| Arte/thumbnail | Canva free · HTML→PNG com agente · `Clipcat-ai/clipcat-skill` para vídeo | grátis |
| Gestão | Google Sheets/Notion free + `templates/` deste repo | grátis |
| Financeiro | Planilha `templates/financeiro-mensal.csv` | grátis |

### 🟡 Nível 1 — R$ 150 a R$ 500/mês (tração, meses 4–8)

Adicione:
- Hospedagem paga com suporte (ou VPS para Plausible/Matomo/listmonk).
- Ferramenta de SEO paga **ou** API de dados (Ahrefs/Semrush/Se Ranking + DataForSEO API).
- E-mail pago com automação (MailerLite/Brevo/Omnisend/Kit).
- IA paga de qualidade (assistente + modelo de imagem).
- Editor de vídeo (CapCut Pro/DaVinci gratuito + editor freelancer por peça).
- Verificação de preço/histórico (Keepa para Amazon, câmeras de preço para marketplaces BR).
- Monitor de menções/rank (Search Console + rank tracker barato).

### 🔴 Nível 2 — R$ 1.000 a R$ 5.000/mês (escala, mês 9+)

Adicione:
- Tracker de afiliado (Voluum/Keitaro/RedTrack) **ou** engine próprio de postback S2S (cap. 08 §3).
- Verba de tráfego pago com break-even calculado (cap. 04 §2.3).
- Plataforma de afiliados própria se você virar produtor (`Refferq`, `refearnapp`, `openpartner`,
  Rewardful, FirstPromoter).
- Contador + PJ (Simples Nacional) no Brasil; formação de LLC + EIN se operar forte nos EUA.
- Freelancers: redator, editor de vídeo, VA (cap. 12 §5).
- Ferramenta de GEO/AEO dedicada (`getcito`, `elmo`, ou SaaS comerciais).
- Compliance: CMP de consentimento (Cookiebot/Usercentrics/Osano) para tráfego UE/UK.

---

## 2. Ferramentas deste repositório (`ferramentas/afiliado.py`)

CLI **sem dependências externas** (Python 3.8+, só biblioteca padrão):

| Comando | O que faz |
| --- | --- |
| `epc` | Calcula EPC, CR, RPV e receita por visita a partir de cliques/receita |
| `projecao` | Projeta receita mensal (visitas × CTR × CR × AOV × comissão) com cenário conservador/base/otimista |
| `break-even` | CPC máximo, CPA máximo e ROAS necessário para uma oferta |
| `ofertas` | Lê `templates/planilha-ofertas.csv`, calcula **EPC esperado** e **Affiliate Score 0–100** (comissão, cookie, recorrência, valor por indicação, confiança) e ordena o ranking |
| `utm` | Monta links UTM padronizados + sufixo de sub-id |
| `links` | Gera pasta `/go/`: `redirects.csv`, `index.php` (302 + `X-Robots-Tag` + log), `.htaccess`, trecho de `robots.txt` e um relatório de checagem (`--check`) |
| `kpi` | Resume `templates/kpi-semanal.csv`: totais, EPC por canal, variação semanal |
| `scorecard` | Calcula a nota 0–100 de um nicho a partir dos pesos do cap. 05 §2 |

```bash
python3 ferramentas/afiliado.py --help
python3 ferramentas/afiliado.py epc --clicks 4200 --receita 318.90
python3 ferramentas/afiliado.py ofertas --csv templates/planilha-ofertas.csv --top 15
python3 ferramentas/afiliado.py links --csv templates/mapa-de-links.csv --saida site-go/ --check
```

---

## 3. Agentes de IA: o "time" gratuito

Padrão de instalação (Claude Code / Cursor / Codex / qualquer agente com skills):

```bash
git clone https://github.com/Affitor/affiliate-skills       # 50 skills: scout, brief, post, infográfico, landing, deploy, analytics
git clone https://github.com/coreyhaines31/marketingskills  # 54k★ CRO, copy, SEO, analytics, growth
git clone https://github.com/AgriciDaniel/claude-seo        # 18k★ auditoria SEO/E-E-A-T/schema/GEO
git clone https://github.com/Ryze-AI-Adgent/open-seo-mcp-skills  # MCP: keywords, auditoria, rank, backlinks
git clone https://github.com/Affitor/open-affiliate         # registro de programas + MCP
```

Servidor MCP do registro de programas (para perguntar em linguagem natural):

```json
{ "mcpServers": { "openaffiliate": { "url": "https://openaffiliate.dev/mcp" } } }
```

Perguntas úteis ao agente:
- "Quais programas de e-mail marketing pagam ≥ 25% recorrente com cookie ≥ 60 dias?"
- "Compare HeyGen, Synthesia e D-ID por comissão, cookie, recorrência e tráfego do site."
- "Audite minha money page quanto a citabilidade por IA (GEO) e schema."
- "Gere outline de comparativo com metodologia e FAQ, marcando [VERIFICAR] onde faltar dado."

---

## 4. Modelos e datasets (Hugging Face) para o seu stack

| Uso | Recurso |
| --- | --- |
| Banco de ofertas (2.578 programas com fonte e data) | `datasets/bestaffiliateprograms/affiliate-programs` |
| Sinais de produto TikTok Shop | `datasets/Karmane/tiktok-shop-affiliate-product-signals` |
| Prompts de marketing (4.643, sendo 20 de afiliados) | `datasets/MuratcanKoylan/MarketingStructuralPrompts` |
| Copy de e-mail (16,4 mil) | `datasets/marketeam/Marketing-Emails` |
| Corpus de marketing (495 mil docs) | `datasets/marketeam/FineWeb-Marketing` |
| Criativos de anúncio (9.003 imagens + texto) | `datasets/PeterBrendan/AdImageNet` |
| LLM de marketing (8B, MIT, base Qwen3) | `marketeam/Qwen-Marketing` |
| Raciocínio de SEO (GRPO + ontologia) | `cyberandy/SEOcrate-4B_grpo_new_01` |
| Embeddings multilíngues PT/EN (cluster de keywords) | `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` |
| Modelos PT-BR (buscar por idioma no Hub) | filtre: `https://huggingface.co/models?language=language:pt&sort=downloads` |

---

## 5. O que **não** comprar (lista de economia)

- 🔴 "Robô/método" de afiliado com promessa de renda.
- 🔴 Cloaker, antidetect, pacote de proxies residenciais para multi-conta.
- 🔴 Lista de e-mail/telefone comprada.
- 🔴 Curso de afiliado de quem só vende curso (verifique painel real).
- 🔴 Ferramenta de "IA que publica 100 posts por dia" sem gate de qualidade.
- 🔴 Grupo VIP de sinais de oferta.
- 🟡 SaaS caro de SEO antes do mês 4 (comece com autocomplete + Search Console + skill gratuita).
- 🟡 Tema WordPress premium de afiliado antes de ter 20 peças (o conteúdo importa mais).

**Regra de compra de ferramenta:** só assine quando você puder apontar **qual métrica do cap. 08 ela
melhora** e tiver um processo (SOP) que a use toda semana.
