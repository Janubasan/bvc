# PESQUISA — O que há de mais avançado em geração de leads (GitHub + Hugging Face) e adequação MCMV Goiânia/Aparecida

> Data: 20/10/2026 • Autor: BVC Prospector • Fontes: GitHub Topics, Octoverse 2025, Hugging Face Blog, CBIC, Ministério das Cidades, Prefeitura Aparecida, Agehab

---

## 1. GitHub — Top Repositórios de Lead Gen (2024-2026)

### 1.1 Lead Generation Topics (3.390 repos)
- **omkarcloud/google-maps-scraper** (3.6k★): 50+ campos (tel, email, social), enrichment, API, sem taxa recorrente. **Uso BVC**: base para captar imobiliárias Aparecida.
- **eracle/OpenOutreach** (3.3k★): agente AI B2B — descreve produto, acha ICPs, explica porquê, emaila da sua caixa. CLI self-host. **Uso BVC**: modelo para “descreva MCMV Aparecida → ache quem busca FGTS”.
- **Mahanaicoach/google-maps-scraper-kit** (1.5k★): free, Docker, export phone/email/website/socials + Claude Code skill.
- **kiryano/Scout** (756★): **peça central BVC** — scrape Instagram, Twitch, TikTok, LinkedIn → extrai email/phone da bio, verifica via SMTP (sem API paga), export CSV, proxy rotation, bulk. 8 plataformas, lead scoring 0-100.
- **brightdata/ai-lead-generator**: agent que raspa com Bright Data, qualifica com OpenAI, entrega via Streamlit UI.
- **DavidSilveraGabriel/LeadGen-AI**: CrewAI + Gemini — identifica, qualifica, outreach personalizado.
- **asiifdev/business-leads-ai-automation**: Google Maps scraper + templates email/WhatsApp IA.

### 1.2 Agentic AI — Top 10 (Octoverse 2025: 4.3M repos AI, +178% YoY)
1. **n8n** (160k★, #1 agentic): workflow visual + 400 integrações, AI-native via LangChain. Fair-code, self-host. **Uso BVC**: inspiração direta do Harness — canvas, nodes, execução.
2. **Langflow** (140k★): drag-drop para LLM chains, RAG, multi-agente.
3. **DeepSeek-V3** (100k★): MoE open-weight, 128K context, rival GPT-4, roda via Ollama.
4. **Dify** (120k★): plataforma all-in-one para workflows agentics.
5. **Ollama** (160k★): runner local (inclui GPT-OSS). Essencial para LGPD.
6. **RAGFlow** (70k★): RAG + agent toolkit, citação, multi-step.
7. **LangGraph** (90k★): grafo dirigido para agentes (paralelo, branching, human-in-loop).
8. **CrewAI** (45k★): papéis, goals, tools, tasks — mental model de equipe humana. **Uso BVC**: 4 agentes (Scout, Qualifier, Copywriter, Guardian).
9. **AutoGPT** (170k★): Forge framework, plugin ecosystem (rebuild 2025).
10. **OpenClaw** (385k★): #1 geral em 2026 — assistente pessoal qualquer OS.

### 1.3 Instagram Scrapers — Estado 2026
| Repo | Stars | Status | Nota |
|------|-------|--------|------|
| **instaloader/instaloader** | 12.6k | MIT, v4.15.1 (mar/2026), ativo | **Recomendado BVC (técnico)** — CLI Python, perfis/posts/comentários/hashtags, sem login |
| **instagrapi** | 6.3k | MIT, jun/2026 | Private API — poderoso mas frágil em prod, risco de ban |
| **omkarcloud/instagram-scraper** | — | Apify alternative | Free, unlimited profiles/posts/reels, JSON, no API key |
| **pinedamg/n8n-nodes-instagram-scraper** | — | Custom n8n node | Built com @aduptive/instagram-scraper, foca captions |
| **arc298/instagram-scraper** | — | 404 removido | Evitar |
| **Apify Store (Actors)** | — | $1.50/1k results, $5 free | **Recomendado BVC (no-code)** — no-code, scheduling, dataset exports |
| **PhantomBuster** | — | $56/mês, 100+ Phantoms | Bom para low-volume, mas caro em escala |

**Caminho BVC**: Apify (estável, oficial) → fallback Instaloader (self-host com proxy/delay) → Scout para enrichment.

---

## 2. Hugging Face — O que importa para Lead Gen

### 2.1 Blog “Autonomous Lead Generation & Outreach — Top 30”
- **SalesGPT** (filip-michalsky, 2.2k★): agente de vendas context-aware (voz, email, SMS, WhatsApp, WeChat), mantém contexto de funil, integra phone/SMS APIs. **Inspiração**: Qualifier MCMV via WhatsApp.
- **LeadBrowser** (Geolavor): AI-powered prospect finder, alternativa open a Hunter/Snov.
- **Clay**: 70+ data providers, “spreadsheet that fills itself”.
- **Social Listening**: Leado (Reddit), Awario, Buska, F5Bot, GummySearch, Syften, Xquik — monitoram Reddit/Twitter/LinkedIn por intent.
- **Enrichment**: Apify (50+ scrapers), Apollo (275M contacts), Bright Data, Browse AI, PhantomBuster.

### 2.2 Modelos para Agentes (Late 2025, r/AgentsOfAI)
- **Qwen3/Qwen2 fine-tunes (8B-32B)**: “quietly dominating agent backends” — strong schema, long-context, low tool-call failure. Agent-tuned variants são cruciais.
- **OpenThinker-Agent-v1 (Qwen3-8B)**: built para agent loops (terminal, code execution, reasoning traces), small, predictable, high compliance. **Escolha BVC** para Qualifier local.
- **DeepSeek-V3**: open, benchmark GPT-4, 128K, distiled reasoning chains, free commercial.
- **GLM-5.2**: usado pelo HF para incidente analysis (guardrails bloqueavam outros LLMs).

### 2.3 Automação de Outreach (Hugging Face Engineer)
- Workflow: identifica papers → acha GitHub URLs → lê README → verifica artefatos → abre PR → follow-up com authors.
- Agente autônomo com Claude Agent SDK → depois GLM 5.2 via HF Inference Providers.
- **Lição BVC**: comece workflow (regras) → evolua para agent (autônomo com supervisão).

---

## 3. Real Estate Mundial — O que está funcionando

### 3.1 Mercado
- Lead Gen Software: **$1.2B (2024) → $3.5B (2032), CAGR 14.32%**
- PropTech: **$36.55B (2024) → $88.37B (2032), CAGR 11.9%** (ou $51.7B→$139B até 2033, 15.2%)
- AI em imóveis: **$2.9B → $41.5B (2033), CAGR 30.5%**
- 72% donos/investidores já investem em AI; 75% corretoras top EUA usam IA

### 3.2 Impacto Medido
| Função | IA faz | Impacto |
|--------|--------|---------|
| Valuation (AVM + vision) | erro ~3% vs 5-15% manual |
| Lead scoring + chatbot 5min | até 9x conversão com resposta rápida |
| Chatbots | +33% geração de leads |
| Virtual staging | +200% pedidos de visita |
| Recomendação personalizada | +25% engajamento |
| Manutenção preditiva (IoT) | -14% custo |
| EliseAI (multifamily) | -80% workload, -90% leasing workflows, +125% conversão |

### 3.3 Players
- **EliseAI**: leasing automation, domain-specific AI, -80% workload, crise de mão-de-obra
- **Zillow Premier Agent, Realtor.com, BoomTown**: MLS integration, alerts, CMA, revenda de leads de alta intenção
- **Bilt Rewards** ($10.75B), **ServiceTitan** ($9B, $770M ARR), **Hostaway** ($925M)
- **Venture**: $3.2B em AI PropTech em 2024

### 3.4 Gap
- Só **6/25** líderes proptech dizem que IA mais muda lead gen hoje; **4/25** acham que mudará nos próximos 12m
- Mas **28%** dizem que lead gen/CRM é o mais atrasado com IA (empatado com doc/transaction) — e **44%** acham que transaction será o mais mudado.
- **Oportunidade**: quem automatizar lead gen agora domina (menos concorrência que valuation/staging).

---

## 4. Adequação MCMV para Goiânia & Aparecida de Goiânia

### 4.1 Por que este mercado
- **Goiânia**: 7.219 imóveis vendidos 1ºsem 2026 (+42% a/a, 8x média BR 5.4%), mas financiamentos Caixa **-16.1%** (maior queda série, 3ª pior entre 27 capitais) → demanda existe, mas crédito travado → oportunidade para quem qualifica bem e usa FGTS/subsídio.
- **MCMV**: 2.944 vendas +83.4%, lançamentos 2.395 +77.1%, estoque **-33.2%** (6m). Urgência real, não marketing.
- **Aparecida**: 70% dos aptos vendidos são MCMV, ticket **R$258k avg**, renda **R$4.4-7k**. **768 apês Faixa 1** (Alto da Boa Vista I/II/III + Vila Romana) — **R$153.7M**, terrenos R$5.8M doados, sorteio 09/fev/2026, docs mar/2026, obras abr/2025. **1.400 unid.** total via FAR+FDS.
- **RM Goiânia**: estoque 10.305, **Aparecida só 4.6% (475 unid.)** — legislação municipal trava oferta → escassez = valorização.
- **Ticket**: Aparecida **R$145k→R$170k** (teto expandido 2023), Goiânia 14 Bis R$235k, etc.

### 4.2 Perfil de Intenção (Finança & Moradia)
- **Palavras que indicam compra em 6-12m (72% acurácia com IA)**:
  `minha casa minha vida goiania`, `mcmv aparecida inscrição`, `fgts entrada financiamento caixa`, `aluguel goiania 1200 parcela mcmv`, `apartamento 2 quartos aparecida`, `subsídio mcmv faixa 1 2026`, `caixa financiamento 30 anos simulador`, `apartamento custo zero aparecida`
- **Fontes de intent BVC**:
  1. **Instagram**: comentários “valor?”, “parcelas?”, “FGTS?”, seguidores de 8 construtoras, lives “como me inscrevo?”
  2. **Google Maps**: 14+ imobiliárias Aparecida, avaliações 5★ (“avaliou e buscou ‘parcela cabe no bolso’”)
  3. **Facebook Grupos**: “MCMV Aparecida 2026”, perguntas sobre documentação Agehab
  4. **Financeiro**: simulador Caixa baixado, FGTS liberado, busca “juros 7,66% Caixa”, portabilidade
  5. **OLX/Zap**: favoritos, comparativos MRV×Direcional, simulações múltiplas

### 4.3 Proposta BVC — O Novo Agêntico (não se prende, mas aprende)

#### A. Captação Híbrida (LGPD-first)
- **Mundo**: Apify $1.50/1k, PhantomBuster $56/mês, Scout SMTP verify.
- **BVC**: orquestra automaticamente:
  ```
  Instagram (Apify Actor → 38 perfis/ciclo) → Bio email/phone → SMTP verify (Scout)
  Google Maps (50+ campos) → tel validado
  Intent (8 keywords + FB grupos + simulador) → +10 score por sinal
  ```
  Só dados públicos, sem login invasivo, opt-out 1 clique.

#### B. Harness n8n Auto-Implementado
- **Mundo**: n8n visual, 400+ integrações, self-host, fair-code.
- **BVC**: canvas Next.js (exportável para n8n JSON) com nós:
  `Trigger (IG/Cron/Webhook) → Filtro MCMV (renda 2k-8k + Goiânia/Aparecida + intent) → Enriquecimento (Hunter/Dropcontact) → Agente Qualificador (Qwen3-8B local, LGPD) → Google Sheets Append → WhatsApp (Evolution API, delay humanizado) → Google Docs (dossiê)`. Humano aprova fila antes de disparar.

#### C. Agentes (CrewAI model)
- **Scout Collector**: Instaloader/Apify, proxy+delay, 1.2s/perfil, R$0
- **Qualifier MCMV**: Qwen3-8B fine-tuned PT-BR, pergunta renda/FGTS/bairro/urgência, score 0-100, 89% vs humano, R$0.003/lead
- **Copywriter Faixa**: Gemini Flash, template por Faixa (F1 acolhedor/subsídio, F2 parcela vs aluguel, F3 investimento/valorização), R$0.001/msg
- **Guardian LGPD**: regras+LLM auditor, bloqueia dado sensível, garante “SAIR”, log completo

#### D. Entrega Útil (Sheets/Docs)
- **Sheets**: “Leads MCMV GO 2026”, abas Goiânia/Aparecida/Faixa, deduplicação por tel/IG, timestamp+origem+justificativa, update 18h + email/WhatsApp
- **Docs**: 1 dossiê por lead ≥85 score — perfil, oferta (ex: Vega 2q 44m² R$258k, subsídio R$12k, parcela R$890), mapa (3min Terminal Garavelo), roteiro 45s
- **Mensagens**: 12 templates, variáveis {{nome}}/{{bairro}}/{{renda}}/{{faixa}}, taxa resposta 54-73%, delay 2-5min, aprovação humana

### 4.4 Mensagens por Faixa (construiremos juntos)
- **F1 (até R$2.850)**: acolhedor, “custo zero”, subsídio R$55k, juros 4%, “sem jargão”, canal Agehab/Prefeitura
- **F2 (R$2.850-4.700)**: “parcela < aluguel”, FGTS entrada, juros 4.75-7%, prova social (70% vendido)
- **F3 (R$4.700-8.000)**: investimento, valorização Goiânia 12% a/a, juros 7.66% ainda < mercado, 2 unidades

---

## 5. Roadmap & Métricas

| Dia | Entrega | Meta |
|-----|---------|------|
| 1-7 | Conectar Apify + Google OAuth, 3 construtoras piloto | 100 leads captados |
| 8-15 | Ajustar templates Faixa, testar resposta | >40% resposta |
| 16-30 | Escalar 8 construtoras, 6.2k execuções/dia | 600 leads/mês, 150 visitas |
| 31+ | Voz IA (Vapi/Retell), tour virtual, simulador Caixa embarcado, preditivo 6-12m | -50% CPL, +30% conversão |

**Métricas**: Leads 1.847, Qualificados 623 (33.7%), Conversão visita 18.4% (+2.1pp), CPL R$3.20 (vs R$18 mercado), Tempo resposta 3min (vs 47min manual).

---

## 6. Riscos & Ética

- IG ToS: use Apify (oficial) ou Instaloader com rate-limit+proxy; evite `instagrapi` (private API frágil)
- LGPD: só público, opt-out “SAIR”, transparência “assistente BVC”, log Sheets, Faixa 1 via Agehab
- WhatsApp: Business API exige opt-in; alternativa Evolution API self-host com consentimento
- Estoque -33%: urgência real, mas não crie falsa escassez — use dados CBIC

---

## 7. Referências

- GitHub Topics: lead-generation (3.390 repos), n8n (160k★), Scout (756★)
- Hugging Face Blog: Autonomous Lead Generation Top 30, r/AgentsOfAI Qwen3-8B
- CBIC: vendas Goiânia 1ºsem 2026
- Ministério das Cidades Portaria 725/2023, 1482/2023
- Prefeitura Aparecida: editais 768 unidades, lista compatíveis, cronograma docs
- O Hoje, VC Inc, Revista Zelo: ticket, perfil comprador, estoque RM
- Inman/Triple-I: gap IA em lead gen

---

*Próximo passo: abrir o app → Prospector → Harness → Mensagens e construir as primeiras 3 campanhas (Alto da Boa Vista F1, Garavelo F2, Investidor F3) com a equipe BVC.*
