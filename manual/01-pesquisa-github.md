# 01 · Pesquisa no GitHub: o que o código aberto revela sobre o que funciona

> Método: consultas à **GitHub Search API** em **12/10/2026** (`topic:affiliate-marketing` → 501
> repositórios públicos; `topic:affiliate` → 334; `topic:affiliate-tracking` → 34; cruzamentos com
> `seo`, `ai-agents`, `marketing`, `referral-platform`, `tiktok shop`, `programmatic seo`, `GEO`,
> `postback`). Estrelas (★) são o proxy de adoção da comunidade; data de *push* indica manutenção.
>
> **Por que isso importa:** o GitHub é o lugar onde afiliados *engenheiros* publicam o que realmente
> rodam em produção. O padrão que se repete nos repositórios mais estrelados **é** o padrão que
> funciona. E o padrão que se repete nos repositórios de 1–20 estrelas revela as armadilhas.

---

## 1. O mapa: 7 clusters que dominam o tema

| Cluster | Repositórios-referência (★) | O que o cluster diz sobre o mercado |
| --- | --- | --- |
| **1. Skills de agente de IA para marketing/SEO** | `coreyhaines31/marketingskills` **54.349** · `AgriciDaniel/claude-seo` **18.780** · `zubair-trabzada/geo-seo-claude` **11.013** · `Ryze-AI-Adgent/open-seo-mcp-skills` **5.138** · `irinabuht12-oss/marketing-skills` **4.356** · `zubair-trabzada/ai-marketing-claude` **2.744** · `AgriciDaniel/claude-blog` **2.370** · `Affitor/affiliate-skills` **709** · `iannuttall/seo` **571** · `inhouseseo/superseo-skills` **353** | A produção de conteúdo de afiliado está sendo **orquestrada por agentes** (Claude Code, Cursor, Codex). O trabalho humano migrou para estratégia, teste de produto e revisão de fatos. |
| **2. GEO/AEO — ser citado por IA** | `zubair-trabzada/geo-seo-claude` 11.013 · `amplifying-ai/awesome-generative-engine-optimization` 520 · `ai-search-guru/getcito` 485 · `elmohq/elmo` 438 · `rubenmarcus/aeo.js` 142 · `luka2chat/awesome-geo` 130 | Cluster **novo** (nasceu 2024–2025) e já gigante: medir e otimizar citações em ChatGPT/Perplexity/AI Overviews é a próxima fronteira do tráfego orgânico. |
| **3. Analytics e rastreamento próprio** | `plausible/analytics` **29.377** · `matomo-org/matomo` **21.949** · `UjjwalSaini07/Affiliate-Postback-Engine` 12 · `iso73-ops/claude-keitaro` 25 · `KeitaroManager/keitaro-mcp` 3 | Quem escala **não confia só no painel da rede**: mede clique no próprio domínio e reconcilia com postback S2S. |
| **4. Plataformas de afiliados self-hosted** (lado anunciante) | `amicalhq/refref` 234 · `Refferq/Refferq` 131 · `Affitor/open-affiliate` 115 · `ZAK123DSFDF/refearnapp` 41 · `usherlabs/usher-referrals` 60 · `getcoherence/openpartner` 11 | Alternativas abertas a Rewardful/FirstPromoter/Tolt/Impact. Útil quando você **vira produtor** (cap. 12) ou quer auditar a atribuição de um programa. |
| **5. APIs de marketplace/produto** | `yoavaviram/python-amazon-simple-product-api` **826** · `sergioteula/python-amazon-paapi` 287 · `sergioteula/python-aliexpress-api` 127 · `bcat95/shopee-aff` 90 · `arifulhb/amazon-pa-api50` 28 | Site de afiliado sério **não digita link na mão**: puxa preço, disponibilidade e imagem via API (evita link quebrado e preço errado — erro que queima confiança e viola política). |
| **6. Social commerce / TikTok Shop** | `Clipcat-ai/clipcat-skill` 250 · `Zeeshanahmad4/TikTok-Shop-Affiliate-Outreach-Bot` 73 · `terrebonnefamoyuhed/tiktok-shop-bot` 65 · `Vanszs/tiktok-viral-factory` 29 · `crevideo/crevideo-reach` 10 | Cluster que mais cresceu em 2025–2026: geração de UGC, replicação de vídeos vencedores, outreach de criadores e automação de lives. 🟡 Alto risco de violar ToS se automatizar em massa (cap. 14). |
| **7. Programmatic SEO** | `agamm/pseo-next` 63 · `savvity/local-business-builder` 47 · `santifer/santifer-irepair` 39 · `codinginflow/nextjs-programmatic-seo` 47 | Geração de milhares de páginas a partir de dados estruturados. Caso citado no próprio repo: **15.500+ páginas únicas** a partir de um Airtable, com tráfego relevante. Funciona **quando o dado é útil e único**; é spam quando é só template + sinônimo. |

---

## 2. Os 20 repositórios mais úteis para um afiliado (com o que fazer com cada um)

| Repositório | ★ | Uso prático no seu negócio |
| --- | --- | --- |
| `coreyhaines31/marketingskills` | 54.349 | Pack de skills de CRO, copywriting, SEO, analytics e growth para agentes. Instale e use como "equipe" de conteúdo. |
| `plausible/analytics` | 29.377 | Analytics cookie-free self-hosted. Base do seu painel de cliques sem depender de GA4 (e sem atrito de consentimento na LGPD/GDPR). |
| `matomo-org/matomo` | 21.949 | Alternativa completa com tag manager e heatmap; bom para sites com muitas páginas. |
| `AgriciDaniel/claude-seo` | 18.780 | 26 sub-skills + 19 sub-agentes: SEO técnico, E-E-A-T, schema, GEO. Auditoria de site em minutos. |
| `zubair-trabzada/geo-seo-claude` | 11.013 | GEO-first: pontuação de **citabilidade** do seu conteúdo por motores de IA. |
| `Ryze-AI-Adgent/open-seo-mcp-skills` | 5.138 | Servidor MCP gratuito: keyword research, auditoria, rank tracking, backlinks e análise de referrals de IA. |
| `irinabuht12-oss/marketing-skills` | 4.356 | 49 skills de marketing (Google Ads, Meta Ads, SEO…) para Claude Code/claude.ai. |
| `zubair-trabzada/ai-marketing-claude` | 2.744 | 15 skills com subagentes paralelos: auditar site, gerar conteúdo, relatório. |
| `AgriciDaniel/claude-blog` | 2.370 | Suite de blog com "contrato de entrega" em 5 gates — bom para padronizar qualidade de post de afiliado. |
| `tsingyuai/growth-lab` | 2.000 | Pipeline fim-a-fim: entender produto, puxar dados, pesquisar mercado, executar. |
| `yoavaviram/python-amazon-simple-product-api` | 826 | Referência histórica de integração com a Product Advertising API (hoje: PA-API 5.0 / Creators). |
| `Affitor/affiliate-skills` | 709 | 50 skills específicas de afiliado: pesquisa de tendência, post com dados, infográfico, landing page, deploy, análise de tráfego e busca de programas. |
| `iannuttall/seo` | 571 | 70+ ferramentas de auditoria SEO em CLI/MCP local, usando suas próprias credenciais. |
| `amplifying-ai/awesome-generative-engine-optimization` | 520 | Lista curada de GEO: guias, ferramentas e papers. |
| `ai-search-guru/getcito` | 485 | Ferramenta open source de AIO/AEO/GEO (visibilidade em respostas de IA). |
| `elmohq/elmo` | 438 | Plataforma AEO/GEO aberta: rastreia como sua marca aparece em motores de IA. |
| `inhouseseo/superseo-skills` | 353 | 11 skills: auditoria de página, link building, redação, E-E-A-T, gap semântico. |
| `Clipcat-ai/clipcat-skill` | 250 | Geração/replicação/análise de vídeo de e-commerce TikTok (UGC) via agente. |
| `amicalhq/refref` | 234 | Plataforma aberta de referência/afiliados (Next.js + Drizzle + MCP). |
| `sergioteula/python-amazon-paapi` | 287 | Wrapper Python da API de Creators/PA-API — para auto-popular preço/disponibilidade. |

### Menções operacionais (menores, mas cirúrgicas)

- `Affitor/open-affiliate` (115 ★) — **registro aberto de programas de afiliados** (349+ programas em
  YAML, API REST pública, CLI `npx openaffiliate`, SDK TypeScript e **servidor MCP**). Tem um
  "Affiliate Score" 0–100 que pondera comissão, cookie, recorrência, verificação e completude de
  dados. É exatamente a lógica que implementamos em `ferramentas/afiliado.py ofertas`.
- `digital-marketing-engineer/software-engineer-affiliate-program-hub` (155 ★) — curadoria de
  programas por categoria (SaaS/dev), com reviews e estratégias.
- `Refferq/Refferq` (131 ★) — portal de afiliados completo (dashboard, comissões, payouts
  NET-15/NET-30, PayPal/Stripe/Wise, e-mails automáticos, bloqueio por país).
- `bcat95/shopee-aff` (90 ★) — documentação da Open API GraphQL da Shopee Affiliate + Data API
  (dados de produto, ofertas, histórico de preço/comissão, TikTok Shop, Lazada).
- `ZAK123DSFDF/refearnapp` (41 ★) — tracking de afiliados em escala (Next.js + Cloudflare Edge).
- `santifer/santifer-irepair` (39 ★) — caso real de programmatic SEO (15.500+ páginas).
- `iso73-ops/claude-keitaro` (25 ★) e `KeitaroManager/keitaro-mcp` (3 ★) — controle de tracker de
  mídia paga por linguagem natural (Admin API + Click API).
- `UjjwalSaini07/Affiliate-Postback-Engine` (12 ★) — MVP de tracking com log de cliques e
  **postback S2S** (Next.js + Express + PostgreSQL): o esqueleto do capítulo 08.
- `getcoherence/openpartner` (11 ★) — parceria com criadores + payouts via Stripe Connect.
- `chukhraiartur/seo-keyword-research-tool` (165 ★) — keyword research sem pagar SaaS:
  Autocomplete + People Also Ask + Related Searches.
- `brandonhimpfen/link-cloaker` (5 ★, npm `link-cloaker`) — padrão limpo de `/go/nome` com
  `rel="sponsored nofollow"`; o README deixa explícito que **não** é para burlar disclosure.
- `affiliatetheme/affiliatetheme` (30 ★) — tema WordPress de afiliado (tabelas comparativas, Amazon).

---

## 3. O lado sombrio do GitHub (e por que você deve reconhecê-lo)

Nos mesmos tópicos aparecem repositórios de práticas que **destroem contas e podem gerar
responsabilidade legal**:

- **Cloakers de tráfego** (`prescience-data/php-cloaker` 27 ★, `KMG-Official/free-cloak-system-client`,
  `cloakings/cloakings-palladium`, `abcloakpro/Cloak-System`, `oandrefelipee/BabyCloaker`): mostram
  página "limpa" para o revisor do Facebook/Google/TikTok e money page para o usuário. 🔴 Viola
  política de anúncios → banimento de conta de anúncio, BM e domínio; em vários países é publicidade
  enganosa.
- **Antidetect/multi-conta** (`axnoller32/AntiDetect-26` 56 ★): fingerprints e proxies para operar
  múltiplas contas. 🔴 Violação direta de ToS das plataformas.
- **Bots de outreach em massa** no TikTok Shop: 🔴 spam + risco de banimento da conta de criador.
- **Downloaders de cursos** (`OpenSelena/omniget` 199 ★, bots de Hotmart 60–76 ★): 🔴 pirataria.
  Estão no resultado de busca de "hotmart" — não confunda popularidade com legitimidade.
- **Pacotes "tudo-em-um" de software de afiliado** (spin de conteúdo, fake ID, e-mail descartável,
  "stealth affiliate links"): 🔴 o retrato do que **não** funciona mais em 2026 — conteúdo girado é
  exatamente o que os updates de spam do Google e a regra de reviews falsos da FTC punem.

**Regra:** se o repositório promete "passar na revisão do anúncio" ou "esconder o link", é sinal de
que o modelo depende de enganar plataforma ou usuário. Isso não escala — ver capítulo 14.

---

## 4. Padrões que se repetem nos repositórios de sucesso (= o que funciona)

1. **Pipeline em estágios explícitos:** `research → content → landing page → deploy → analytics →
   optimize`. O `Affitor/affiliate-skills` documenta exatamente esse flywheel com 6 semanas:
   semana 1 pesquisa, 2 conteúdo, 3 blog, 4 deploy, 5 analytics, 6 otimizar — meta de **primeiro
   clique na semana 2 e primeira comissão na semana 5**.
2. **Dados antes de opinião:** os skills vencedores começam por *scout* (escanear vídeos em alta,
   medir engajamento, achar gap) e *traffic score* de programas, não por "achismo de nicho".
3. **Formato campeão = comparação:** no exemplo documentado do `affiliate-skills`, 45% do conteúdo
   top era comparativo ("X vs Y"), com engajamento médio muito acima de outros formatos.
   Bate com os benchmarks: conteúdo comparativo converte 3–5%.
4. **Comparar programas por 4 campos, sempre:** comissão, **cookie**, recorrência e **tráfego/força
   da marca**. É o que o `open-affiliate` e o dataset do Hugging Face fazem (cap. 02).
5. **Link centralizado em `/go/` ou `/r/`** com `rel="sponsored nofollow"`, robots bloqueando a pasta
   e redirect 302 + `X-Robots-Tag: noindex, nofollow` (padrão Yoast, replicado em dezenas de repos).
   Benefícios reais: troca de destino em 1 lugar, link limpo para o usuário, medição de clique própria.
6. **Medição própria + reconciliação:** log de clique no seu domínio + postback S2S da rede.
   Sem isso você nunca sabe seu EPC verdadeiro por canal/peça.
7. **Schema e estrutura para IA:** repositórios GEO forçam tabela comparativa, prós/contras,
   metodologia, FAQ e `Product`/`Review`/`FAQPage` markup — é o que a IA consegue citar.
8. **Automação com revisão humana:** quase todo skill maduro tem um "gate" de qualidade/fatos antes
   de publicar. Automação sem gate = penalização.

---

## 5. Stack open source recomendado (o que clonar/instalar)

**Nível 1 — grátis total (mês 1–3)**

```bash
# 1) Skills de agente (use com Claude Code / Cursor / Codex)
git clone https://github.com/Affitor/affiliate-skills          # flywheel de afiliado (50 skills)
git clone https://github.com/AgriciDaniel/claude-seo           # auditoria SEO/GEO/E-E-A-T
git clone https://github.com/Ryze-AI-Adgent/open-seo-mcp-skills # MCP de keywords/auditoria/rank

# 2) Registro de programas (dados estruturados + MCP)
git clone https://github.com/Affitor/open-affiliate
npx openaffiliate search "email" --min-commission 20 --type recurring

# 3) Analytics sem cookie
docker run -d -p 8000:8000 ghcr.io/plausible/analytics:latest  # ou use o cloud free tier
```

**Nível 2 — operação (mês 4–8)**

```bash
# Redirect /go/ com log de clique (padrão Yoast/brandonhimpfen + nosso gerador)
python3 ferramentas/afiliado.py links --csv templates/mapa-de-links.csv --saida site-go/

# Postback/click engine (base do cap. 08)
git clone https://github.com/UjjwalSaini07/Affiliate-Postback-Engine

# Programmatic SEO (se você tem dataset próprio)
git clone https://github.com/agamm/pseo-next
```

**Nível 3 — virar anunciante/produtor (mês 9+)**

```bash
git clone https://github.com/Refferq/Refferq        # portal de afiliados completo
git clone https://github.com/amicalhq/refref        # alternativa self-hosted (Next + Drizzle)
git clone https://github.com/getcoherence/openpartner  # payouts via Stripe Connect
```

---

## 6. Sinais de alerta ao avaliar qualquer repositório/ferramenta de afiliado

| 🟢 Bom sinal | 🔴 Mau sinal |
| --- | --- |
| Push recente (< 90 dias), issues respondidas | Abandonado há 2+ anos (ex.: wrapper de API antiga) |
| README com **limitações e não-objetivos** explícitos | Promete "R$ 100/dia garantido", "método secreto" |
| Compliance citado (disclosure, robots, `rel=sponsored`) | Fala em "passar na revisão", "money page oculta" |
| Dados estruturados com **fonte e data** | Números sem origem |
| Licença clara (MIT/Apache) | Sem licença, binário fechado, "chave no Telegram" |
| Você consegue explicar como ganha dinheiro | O ganho vem de recrutar outros afiliados (pirâmide) |

---

### Como reproduzir esta pesquisa

```bash
# top repositórios do tópico
curl -s "https://api.github.com/search/repositories?q=topic:affiliate-marketing&sort=stars&order=desc&per_page=20" \
  | jq -r '.items[] | "\(.stargazers_count)\t\(.full_name)\t\(.description)"'

# clusters adjacentes
for q in "topic:seo+topic:ai-agents" "GEO+ai+search+optimization" "postback+affiliate" "tiktok+shop+affiliate"; do
  curl -s "https://api.github.com/search/repositories?q=$q&sort=stars&order=desc&per_page=8" \
    | jq -r '.items[] | "\(.stargazers_count)\t\(.full_name)"'
done
```

Dados coletados em 12/10/2026. Refaça a cada trimestre: esse ecossistema muda rápido.
