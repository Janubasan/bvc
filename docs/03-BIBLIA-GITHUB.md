# 03 — Bíblia dos Repositórios (GitHub)

> **231 repositórios curados**, todos com link direto, estrelas e licença. Estrelas são um retrato do dia **2026-10-02**: servem para você julgar maturidade, não como placar.

## Como usar este documento

1. **Não clone tudo.** Cada categoria responde a uma pergunta diferente. Vá direto à sua (Ctrl+F pelo nome da seção).
2. **Uma decisão de stack por vez.** Escolha o boilerplate (ou o backend), depois o pagamento, depois o resto.
3. **Confira a licença antes de embutir em produto fechado.** A coluna "Licença" e a seção final evitam dor de cabeça.
4. **O número da coluna "Modelo"** aponta para o modelo de renda do [`docs/01`](01-MODELOS-DE-RENDA.md) que aquele repo viabiliza.

### As 6 decisões de stack que importam

| Decisão | Opção segura para micro-SaaS | Quando fugir |
|---|---|---|
| Backend/DB | Supabase ou PocketBase | Precisa de multi-tenant pesado → Appwrite/Nhost |
| Front | Next.js + shadcn/ui + Tailwind | Time pequeno e sem JS → SvelteKit |
| Pagamento | Stripe (global) / Mercado Pago + Pix (BR) | Vender para devs → Paddle/Lemon Squeezy (MoR) |
| IA | API de LLM + RAG com pgvector | Dados sensíveis/on-premise → llama.cpp/Ollama/vLLM |
| Automação | n8n (self-host) | Time dev → Windmill/Trigger.dev |
| Observabilidade de negócio | PostHog + Metabase + Langfuse | Vai cobrar por uso → OpenMeter/Lago |


## Bases prontas de SaaS (boilerplates)

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [wasp-lang/open-saas](https://github.com/wasp-lang/open-saas) | 16.044 | MIT | Starter completo (React+Node): auth, billing, admin, blog, multi-tenant. O mais completo e gratuito. | 6/8 |
| [nextjs/saas-starter](https://github.com/nextjs/saas-starter) | 16.157 | MIT | Next.js + Postgres + Stripe + shadcn: o padrao minimalista para lancar em dias. | 6 |
| [vercel/nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments) ⚠️arquivado | 7.721 | MIT | Referencia oficial de assinaturas com Stripe + Supabase (ARQUIVADO em 2026 - use como estudo; base nova: nextjs/saas-starter). | 6 |
| [mickasmt/next-saas-stripe-starter](https://github.com/mickasmt/next-saas-stripe-starter) | 3.002 | MIT | Next.js 14 + Auth.js + Prisma + Resend, com painel admin. | 6 |
| [ixartz/SaaS-Boilerplate](https://github.com/ixartz/SaaS-Boilerplate) | 7.440 | MIT | Next.js + Clerk + Drizzle: multi-tenancy, i18n, testes e landing. | 6/8 |
| [scosman/CMSaasStarter](https://github.com/scosman/CMSaasStarter) | 2.367 | MIT | SvelteKit + Supabase: leve, otimo para produto simples e rapido. | 6 |
| [nextify-limited/saasfly](https://github.com/nextify-limited/saasfly) | 2.899 | MIT | Next.js + NextAuth + Prisma, com foco enterprise. | 6 |
| [async-labs/saas](https://github.com/async-labs/saas) | 4.517 | MIT | Monorepo (Next+Express+Mongo): bom para estudar arquitetura de SaaS. | 6 |
| [alifarooq9/launchmvpfast](https://github.com/alifarooq9/launchmvpfast) | 620 | MIT | Componentes e blocos de UI para acelerar MVP. | 6 |
| [KolbySisk/next-supabase-stripe-starter](https://github.com/KolbySisk/next-supabase-stripe-starter) | 814 | MIT | Base enxuta Next+Supabase+Stripe. | 6 |
| [d-ivashchuk/cascade](https://github.com/d-ivashchuk/cascade) | 657 | ver LICENSE | Boilerplate simples e extensivel. | 6 |
| [openstarterkit/nextjs-saas-starter-kit](https://github.com/openstarterkit/nextjs-saas-starter-kit) | 12 | MIT | Minimalista: Better Auth + Stripe + Prisma sem framework extra. | 6 |


## Backend, banco de dados, auth e storage

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [supabase/supabase](https://github.com/supabase/supabase) | 111.019 | Apache-2.0 | Postgres + auth + storage + realtime + RLS. A base mais popular para micro-SaaS. | 6/8 |
| [appwrite/appwrite](https://github.com/appwrite/appwrite) | 57.546 | BSD-3-Clause | Backend-as-a-service self-hosted (auth, DB, storage, functions). | 6 |
| [pocketbase/pocketbase](https://github.com/pocketbase/pocketbase) | 61.249 | MIT | 1 binario Go com SQLite, auth, realtime e admin. Imbatível para MVP solo. | 6 |
| [nhost/nhost](https://github.com/nhost/nhost) | 9.330 | MIT | Postgres + GraphQL + auth, open source. | 6 |
| [hasura/graphql-engine](https://github.com/hasura/graphql-engine) | 32.131 | Apache-2.0 | GraphQL instantaneo sobre Postgres. | 6/7 |
| [directus/directus](https://github.com/directus/directus) | 38.006 | NOASSERTION | CMS/dados headless: vira painel de gestao do cliente em horas. | 3/6 |
| [payloadcms/payload](https://github.com/payloadcms/payload) | 45.063 | MIT | CMS em TypeScript, code-first, com admin excelente. | 3/6 |
| [strapi/strapi](https://github.com/strapi/strapi) | 73.271 | NOASSERTION | CMS headless tradicional, ecossistema grande. | 3/6 |
| [better-auth/better-auth](https://github.com/better-auth/better-auth) | 30.153 | MIT | Auth completa em TypeScript (OAuth, passkeys, organizacoes). | 6 |
| [supertokens/supertokens-core](https://github.com/supertokens/supertokens-core) | 15.328 | NOASSERTION | Auth com sessao, roles e multi-tenancy. | 6/8 |
| [ory/kratos](https://github.com/ory/kratos) | 13.904 | Apache-2.0 | Identidade e login self-hosted, nivel enterprise. | 6/8 |
| [unkeyed/unkey](https://github.com/unkeyed/unkey) | 5.456 | NOASSERTION | API keys, rate limit e medicao de uso (ideal para modelo 7). | 7 |
| [pgvector/pgvector](https://github.com/pgvector/pgvector) | 23.222 | NOASSERTION | Busca vetorial dentro do Postgres: RAG sem banco novo. | 6/8 |
| [meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) | 59.468 | NOASSERTION | Busca instantanea, otima UX de busca interna. | 6 |
| [typesense/typesense](https://github.com/typesense/typesense) | 26.624 | GPL-3.0 | Busca tolerante a erros, alternativa ao Algolia. | 6 |


## Pagamento, billing e financeiro

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [juspay/hyperswitch](https://github.com/juspay/hyperswitch) | 45.271 | Apache-2.0 | Orquestrador de pagamentos (multiplas adquirentes, roteamento, retry). | 6/7 |
| [getlago/lago](https://github.com/getlago/lago) | 10.650 | AGPL-3.0 | Billing por uso/assinatura open source (alternativa ao Chargebee). | 6/7 |
| [openmeterio/openmeter](https://github.com/openmeterio/openmeter) | 2.363 | Apache-2.0 | Medicao de uso e faturamento por consumo (APIs de IA). | 7 |
| [invoiceninja/invoiceninja](https://github.com/invoiceninja/invoiceninja) | 10.205 | NOASSERTION | Faturas, cobranca e portal do cliente. | 3/6 |
| [solidtime-io/solidtime](https://github.com/solidtime-io/solidtime) | 8.954 | AGPL-3.0 | Controle de horas (base para cobrar por hora/projeto). | 2/4 |
| [kimai/kimai](https://github.com/kimai/kimai) | 5.055 | AGPL-3.0 | Timesheet e relatorios de horas por cliente. | 2/4 |


## CRM, atendimento e comunicacao com cliente

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [twentyhq/twenty](https://github.com/twentyhq/twenty) | 57.833 | NOASSERTION | CRM moderno open source: pipeline, leads, atividades. | 3/4 |
| [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) | 37.441 | NOASSERTION | Atendimento multicanal (WhatsApp, e-mail, chat). Substitui Zendesk/Intercom. | 3/6 |
| [zammad/zammad](https://github.com/zammad/zammad) | 5.974 | AGPL-3.0 | Help desk completo com SLA e automacoes. | 3/6 |
| [freescout-help-desk/freescout](https://github.com/freescout-help-desk/freescout) | 4.583 | AGPL-3.0 | Help desk leve com shared inbox. | 3/6 |
| [knadh/listmonk](https://github.com/knadh/listmonk) | 23.664 | AGPL-3.0 | Newsletter e listas de e-mail de alta performance (self-host). | 5/9/10 |
| [novuhq/novu](https://github.com/novuhq/novu) | 40.103 | NOASSERTION | Infra de notificacoes (e-mail, SMS, push, in-app) para o seu produto. | 6/7 |
| [formbricks/formbricks](https://github.com/formbricks/formbricks) | 13.051 | NOASSERTION | Formularios, NPS e pesquisa in-app. | 6 |
| [documenso/documenso](https://github.com/documenso/documenso) | 15.301 | AGPL-3.0 | Assinatura digital de contratos (substitui Docusign em PMEs). | 2/3 |
| [papermark/papermark](https://github.com/papermark/papermark) | 9.234 | NOASSERTION | Compartilhamento de documentos com analytics (proposta comercial). | 2/4 |
| [heyform/heyform](https://github.com/heyform/heyform) | 8.993 | AGPL-3.0 | Construtor de formularios e quizzes. | 9/10 |
| [baptisteArno/typebot.io](https://github.com/baptisteArno/typebot.io) | 10.467 | NOASSERTION | Chatbot visual para captura de leads e qualificacao. | 3/4 |
| [calcom/cal.diy](https://github.com/calcom/cal.diy) | 48.824 | MIT | Agendamento (substitui Calendly) - self-host e white-label. | 2/3/5 |
| [dubinc/dub](https://github.com/dubinc/dub) | 24.860 | NOASSERTION | Encurtador de links com analytics e conversao. | 6 |
| [resend/react-email](https://github.com/resend/react-email) | 19.802 | MIT | E-mails transacionais em React (onboarding, cobranca, alertas). | 6 |


## Analytics, growth, observabilidade e qualidade

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [PostHog/posthog](https://github.com/PostHog/posthog) | 40.111 | NOASSERTION | Product analytics + session replay + feature flags + experimentos. | 6/8 |
| [plausible/analytics](https://github.com/plausible/analytics) | 29.284 | AGPL-3.0 | Analytics de site simples e privado (LGPD-friendly). | 6 |
| [umami-software/umami](https://github.com/umami-software/umami) | 39.129 | MIT | Analytics self-hosted leve. | 6 |
| [growthbook/growthbook](https://github.com/growthbook/growthbook) | 8.466 | NOASSERTION | Testes A/B e feature flags. | 6/8 |
| [highlight/highlight](https://github.com/highlight/highlight) | 9.383 | NOASSERTION | Session replay e monitoramento de sessao. | 6 |
| [openreplay/openreplay](https://github.com/openreplay/openreplay) | 12.936 | NOASSERTION | Gravacao de sessao self-hosted. | 6 |
| [metabase/metabase](https://github.com/metabase/metabase) | 49.515 | NOASSERTION | BI simples: dashboards para o cliente sem escrever SQL. | 3/11 |
| [apache/superset](https://github.com/apache/superset) | 75.012 | Apache-2.0 | BI avancado para dados grandes. | 11 |
| [streamlit/streamlit](https://github.com/streamlit/streamlit) | 45.873 | Apache-2.0 | Apps de dados em Python em minutos (ferramenta interna paga). | 3/11 |
| [gradio-app/gradio](https://github.com/gradio-app/gradio) | 43.655 | Apache-2.0 | Demo e app web de modelo em 20 linhas (prova de conceito e Spaces). | 3/4/5 |
| [marimo-team/marimo](https://github.com/marimo-team/marimo) | 22.993 | Apache-2.0 | Notebook reativo em Python para analises compartilhaveis. | 3/11 |
| [grafana/grafana](https://github.com/grafana/grafana) | 77.041 | AGPL-3.0 | Dashboards de infraestrutura e metricas de operacao. | 6/8 |
| [getsentry/sentry](https://github.com/getsentry/sentry) | 45.024 | NOASSERTION | Monitoramento de erros da sua aplicacao. | 6 |
| [SigNoz/signoz](https://github.com/SigNoz/signoz) | 32.266 | NOASSERTION | APM e logs open source (alternativa ao Datadog). | 6/8 |
| [langfuse/langfuse](https://github.com/langfuse/langfuse) | 35.324 | NOASSERTION | Observabilidade de LLM: rastreie prompts, custos e qualidade. | 3/6/8 |
| [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | 25.654 | MIT | Testes e avaliacao de prompts/modelos (qualidade antes de vender). | 3/6/8 |
| [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma) | 92.068 | MIT | Monitor de disponibilidade para voce e para clientes. | 3/6 |


## Agentes, orquestracao e RAG (codigo)

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | 147.388 | MIT | Ecossistema base para LLM: tools, RAG, chains, integracoes. | 3/6 |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | 42.632 | MIT | Agentes com estado, ciclos e human-in-the-loop (producao). | 3/6 |
| [microsoft/autogen](https://github.com/microsoft/autogen) | 61.248 | CC-BY-4.0 | Multiagentes conversacionais da Microsoft. | 3/6 |
| [microsoft/agent-framework](https://github.com/microsoft/agent-framework) | 13.912 | MIT | Framework oficial para orquestrar agentes em .NET/Python. | 3/6 |
| [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) | 59.291 | MIT | Times de agentes com papeis: ideal para entregar servico automatizado. | 3/4 |
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | 52.385 | MIT | RAG e indexacao de documentos (o mais maduro para dados proprios). | 3/6 |
| [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) | 38.473 | MIT | Programar prompts com otimizacao automatica (qualidade + custo). | 6/7 |
| [huggingface/smolagents](https://github.com/huggingface/smolagents) | 29.653 | Apache-2.0 | Agentes enxutos com foco em codigo. | 3/6 |
| [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) | 20.363 | MIT | Agentes tipados em Python, bom para producao. | 6 |
| [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | 29.810 | MIT | SDK oficial de agentes da OpenAI (handoffs, guardrails). | 3/6 |
| [camel-ai/camel](https://github.com/camel-ai/camel) | 17.803 | Apache-2.0 | Pesquisa e frameworks de agentes escalaveis. | 7 |
| [FoundationAgents/MetaGPT](https://github.com/FoundationAgents/MetaGPT) | 70.718 | MIT | Time de agentes que simula uma empresa de software. | 9 |
| [letta-ai/letta](https://github.com/letta-ai/letta) | 25.007 | Apache-2.0 | Memoria de longo prazo para agentes (antes MemGPT). | 6/8 |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | 66.489 | Apache-2.0 | Camada de memoria para assistentes personalizados. | 6/8 |
| [getzep/graphiti](https://github.com/getzep/graphiti) | 31.387 | Apache-2.0 | Memoria temporal em grafo (relacionamentos e historico). | 6/8 |
| [agent0ai/agent-zero](https://github.com/agent0ai/agent-zero) | 19.361 | NOASSERTION | Agente autonomo com interface, facil de demonstrar a cliente. | 3 |
| [kortix-ai/suna](https://github.com/kortix-ai/suna) | 20.241 | NOASSERTION | Agente generalista com UI (produto pronto para revender/white-label). | 3/8 |
| [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | 89.822 | MIT | Agente de codigo autonomo (resolve issues, abre PR). | 6/7 |
| [Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | 187.637 | NOASSERTION | Plataforma de agentes com builder visual. | 3/9 |
| [deepset-ai/haystack](https://github.com/deepset-ai/haystack) | 26.645 | Apache-2.0 | Pipelines de NLP/RAG com foco em producao. | 6 |
| [chroma-core/chroma](https://github.com/chroma-core/chroma) | 29.425 | Apache-2.0 | Banco vetorial leve para prototipos e RAG. | 6 |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | 34.905 | Apache-2.0 | Banco vetorial de producao, rapido e com filtros. | 6/7 |
| [weaviate/weaviate](https://github.com/weaviate/weaviate) | 16.859 | NOASSERTION | Banco vetorial com busca hibrida. | 6/7 |
| [e2b-dev/E2B](https://github.com/e2b-dev/E2B) | 14.120 | Apache-2.0 | Sandbox de execucao de codigo para agentes (seguranca). | 7 |


## Plataformas no-code/low-code de IA e automacao

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | 206.518 | NOASSERTION | Automacao visual com 400+ integracoes + nos de IA. O cavalo de batalha do modelo 3. | 3/4 |
| [activepieces/activepieces](https://github.com/activepieces/activepieces) | 24.858 | NOASSERTION | Alternativa MIT ao Zapier, self-host ilimitado. | 3 |
| [windmill-labs/windmill](https://github.com/windmill-labs/windmill) | 18.089 | NOASSERTION | Scripts Python/TS como workflows (dev-friendly). | 3/7 |
| [kestra-io/kestra](https://github.com/kestra-io/kestra) | 28.833 | Apache-2.0 | Orquestracao declarativa (YAML) para pipelines e jobs. | 3/7 |
| [huginn/huginn](https://github.com/huginn/huginn) | 50.016 | MIT | Agentes de vigilancia web (monitorar preco, site, edital). | 11 |
| [triggerdotdev/trigger.dev](https://github.com/triggerdotdev/trigger.dev) | 16.457 | Apache-2.0 | Jobs em background e filas para o seu SaaS. | 6 |
| [temporalio/temporal](https://github.com/temporalio/temporal) | 23.426 | MIT | Workflows duraveis para processos longos e confiaveis. | 6/8 |
| [langgenius/dify](https://github.com/langgenius/dify) | 157.730 | NOASSERTION | Plataforma de apps de LLM: RAG, agente, workflow, API. | 3/6 |
| [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise) ⚠️arquivado | 55.483 | NOASSERTION | Construtor visual de fluxos de LLM e agentes (ARQUIVADO em 2026 - substitutos: Dify ou RAGFlow). | 3 |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | 91.609 | Apache-2.0 | RAG de documentos com interface e citacoes. | 3/6 |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | 153.810 | NOASSERTION | Chat estilo ChatGPT para a empresa, com RAG e usuarios. | 3/8 |
| [LibreChat-AI/LibreChat](https://github.com/LibreChat-AI/LibreChat) | 45.203 | MIT | Chat multi-modelo com plugins, agentes e multiusuario. | 3/8 |
| [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | 66.670 | MIT | Chat com seus documentos, desktop e servidor. | 3/6 |
| [onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx) | 32.314 | NOASSERTION | Busca e assistente corporativo sobre fontes internas. | 3/8 |
| [khoj-ai/khoj](https://github.com/khoj-ai/khoj) | 37.555 | AGPL-3.0 | Assistente pessoal sobre seus arquivos (segundo cerebro). | 9/10 |
| [appsmithorg/appsmith](https://github.com/appsmithorg/appsmith) | 40.992 | Apache-2.0 | Painel interno low-code (entregar ferramenta ao cliente rapido). | 3 |
| [ToolJet/ToolJet](https://github.com/ToolJet/ToolJet) | 41.027 | AGPL-3.0 | Alternativa ao Retool, self-host. | 3/6 |
| [Budibase/budibase](https://github.com/Budibase/budibase) | 28.331 | NOASSERTION | Apps internos e automacoes com banco proprio. | 3 |
| [baserow/baserow](https://github.com/baserow/baserow) | 6.068 | NOASSERTION | Airtable open source (base do back-office do cliente). | 3/11 |
| [teableio/teable](https://github.com/teableio/teable) | 21.856 | NOASSERTION | Planilha-database colaborativa e rapida. | 3/11 |
| [nocodb/nocodb](https://github.com/nocodb/nocodb) | 65.163 | NOASSERTION | Airtable open source: transforma planilha em app. | 3/11 |
| [enescingoz/awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) | 25.704 | NOASSERTION | 280+ templates de n8n prontos (copie e adapte por setor). | 3/5 |
| [Zie619/n8n-workflows](https://github.com/Zie619/n8n-workflows) | 56.867 | MIT | 2.000+ workflows automaticos coletados do site do n8n. | 3/5 |


## Codigo: assistentes, agentes e MCP

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [anomalyco/opencode](https://github.com/anomalyco/opencode) | 211.496 | MIT | Agente de codigo no terminal (ex-sst/opencode), open source. | 6/7 |
| [openai/codex](https://github.com/openai/codex) | 127.637 | Apache-2.0 | Agente de codigo oficial da OpenAI (CLI). | 6/7 |
| [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | 107.213 | Apache-2.0 | Agente de codigo no terminal com Gemini. | 6/7 |
| [cline/cline](https://github.com/cline/cline) | 69.734 | Apache-2.0 | Agente dentro do VS Code que edita e executa. | 6 |
| [RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code) ⚠️arquivado | 24.289 | Apache-2.0 | Suite de agentes de codigo no editor (ARQUIVADO em 2026 - substitutos: Cline ou opencode). | 6 |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | 49.338 | Apache-2.0 | Programacao por pares no terminal com git. | 6 |
| [aaif-goose/goose](https://github.com/aaif-goose/goose) | 54.877 | Apache-2.0 | Agente local extensivel (ex-block/goose). | 6 |
| [continuedev/continue](https://github.com/continuedev/continue) | 36.088 | Apache-2.0 | Autocomplete e chat de codigo com seus modelos. | 6 |
| [SWE-agent/SWE-agent](https://github.com/SWE-agent/SWE-agent) | 20.467 | MIT | Agente que resolve issues do GitHub (pesquisa + pratica). | 6/7 |
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | 90.959 | NOASSERTION | Servidores MCP de referencia (conecte modelos a ferramentas). | 5/6 |
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | 95.768 | MIT | Lista gigante de servidores MCP existentes. | 5/6 |
| [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp) | 6.377 | MIT | MCP de WhatsApp: atendimento e follow-up automatizado. | 3/4 |
| [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks) | 53.145 | MIT | Receitas oficiais da Anthropic (RAG, tools, agentes). | 3/6 |
| [openai/openai-cookbook](https://github.com/openai/openai-cookbook) | 76.319 | MIT | Receitas oficiais da OpenAI (do basico ao avancado). | 3/6 |
| [e2b-dev/awesome-ai-agents](https://github.com/e2b-dev/awesome-ai-agents) | 30.248 | NOASSERTION | Mapa de frameworks de agentes por caso de uso. | 3/6/7 |


## Navegacao, scraping e documentos

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | 117.007 | MIT | Agente que opera navegador como humano (formularios, portais, ERP web). | 3/11 |
| [browserbase/stagehand](https://github.com/browserbase/stagehand) | 25.517 | MIT | Automacao de navegador com IA, foco em producao. | 3/11 |
| [Skyvern-AI/skyvern](https://github.com/Skyvern-AI/skyvern) | 23.126 | AGPL-3.0 | Automacao de processos web por visao+LLM (licenca AGPL: cuidado). | 3/11 |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | 187.930 | AGPL-3.0 | Crawler que entrega markdown limpo para LLM (AGPL: use como servico). | 3/11 |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | 84.651 | Apache-2.0 | Crawler leve e gratuito para pipelines de IA. | 11 |
| [scrapy/scrapy](https://github.com/scrapy/scrapy) | 64.554 | BSD-3-Clause | Crawler classico, robusto e escalavel. | 11 |
| [apify/crawlee](https://github.com/apify/crawlee) | 25.969 | Apache-2.0 | Framework de scraping com anti-bloqueio e proxy. | 11 |
| [daijro/camoufox](https://github.com/daijro/camoufox) | 12.280 | MPL-2.0 | Navegador anti-deteccao para coleta dificil. | 11 |
| [steel-dev/steel-browser](https://github.com/steel-dev/steel-browser) | 7.727 | Apache-2.0 | Navegador headless como API para agentes. | 7/11 |
| [microsoft/markitdown](https://github.com/microsoft/markitdown) | 188.017 | MIT | Converte PDF/Office/HTML em markdown para LLM. | 3/6 |
| [docling-project/docling](https://github.com/docling-project/docling) | 68.313 | MIT | Parsing de documentos complexos (tabelas, layout). | 3/6 |
| [opendatalab/MinerU](https://github.com/opendatalab/MinerU) | 80.997 | NOASSERTION | PDF cientifico/complexo para markdown estruturado. | 3/11 |
| [datalab-to/marker](https://github.com/datalab-to/marker) | 40.171 | Apache-2.0 | PDF -> markdown de altissima qualidade (notas, contratos). | 3/11 |
| [datalab-to/surya](https://github.com/datalab-to/surya) | 21.447 | Apache-2.0 | OCR e analise de layout multilingue. | 3/11 |
| [PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | 90.519 | Apache-2.0 | OCR industrial multilingue e de tabelas. | 3/11 |
| [Unstructured-IO/unstructured](https://github.com/Unstructured-IO/unstructured) | 15.523 | Apache-2.0 | ETL de documentos para RAG. | 3/11 |
| [Stirling-Tools/Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF) | 93.453 | NOASSERTION | Kit de ferramentas de PDF self-hosted (assinar, dividir, OCR). | 3/6 |
| [gotenberg/gotenberg](https://github.com/gotenberg/gotenberg) | 13.214 | MIT | API de conversao PDF/Office/HTML (gera relatorios). | 6/8 |


## Midia: audio, imagem, video

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [openai/whisper](https://github.com/openai/whisper) | 109.884 | MIT | Transcricao de audio e video (99 idiomas). Base de atas e legendas. | 2/5 |
| [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) | 25.676 | MIT | Whisper 4x mais rapido (CTranslate2) - ideal para volume. | 2/5 |
| [m-bain/whisperX](https://github.com/m-bain/whisperX) | 24.335 | BSD-2-Clause | Transcricao + alinhamento + diarizacao (quem falou o que). | 2/5 |
| [k2-fsa/sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) | 15.082 | Apache-2.0 | ASR/TTS on-device (sua app sem custo de API). | 6 |
| [Vaibhavs10/insanely-fast-whisper](https://github.com/Vaibhavs10/insanely-fast-whisper) | 13.061 | Apache-2.0 | Transcricao com maxima velocidade em GPU. | 2/5 |
| [collabora/WhisperLive](https://github.com/collabora/WhisperLive) | 4.305 | MIT | Transcricao em tempo real (legendas ao vivo). | 5 |
| [myshell-ai/MeloTTS](https://github.com/myshell-ai/MeloTTS) | 7.651 | MIT | TTS multilingue rapido (inclui PT). | 5/6 |
| [rhasspy/piper](https://github.com/rhasspy/piper) ⚠️arquivado | 11.296 | MIT | TTS local leve (ARQUIVADO em 2026 - substitutos: Kokoro-82M ou MeloTTS). | 6 |
| [fishaudio/fish-speech](https://github.com/fishaudio/fish-speech) | 32.921 | NOASSERTION | TTS com clonagem de voz. | 5 |
| [SWivid/F5-TTS](https://github.com/SWivid/F5-TTS) | 15.323 | MIT | TTS de alta qualidade por poucos segundos de audio. | 5 |
| [myshell-ai/OpenVoice](https://github.com/myshell-ai/OpenVoice) | 37.749 | MIT | Clonagem de voz e conversao de tom. | 5 |
| [facebookresearch/demucs](https://github.com/facebookresearch/demucs) ⚠️arquivado | 10.363 | MIT | Separacao de faixas (ARQUIVADO em 2026 - alternativa: separacao via ComfyUI/audio.cpp). | 5 |
| [Comfy-Org/ComfyUI](https://github.com/Comfy-Org/ComfyUI) | 135.886 | GPL-3.0 | Estudio node-based de geracao de imagem/video local. Coracao da fabrica de criativos. | 5 |
| [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) | 165.182 | AGPL-3.0 | UI classica de Stable Diffusion (ecossistema de extensoes). | 5 |
| [invoke-ai/InvokeAI](https://github.com/invoke-ai/InvokeAI) | 28.332 | Apache-2.0 | Estudio de imagem com controle profissional. | 5 |
| [Sanster/IOPaint](https://github.com/Sanster/IOPaint) ⚠️arquivado | 23.310 | Apache-2.0 | Remocao de objetos e inpainting local (ARQUIVADO em 2026 - alternativa: inpainting no ComfyUI). | 5 |
| [danielgatis/rembg](https://github.com/danielgatis/rembg) | 24.949 | MIT | Remove fundo de imagens em lote. | 5 |
| [TencentARC/GFPGAN](https://github.com/TencentARC/GFPGAN) | 37.684 | NOASSERTION | Restauracao de rostos em fotos antigas. | 5 |
| [Tongyi-MAI/Z-Image](https://github.com/Tongyi-MAI/Z-Image) | 12.058 | Apache-2.0 | Geracao de imagem rapida e aberta (repo oficial do modelo). | 5/6 |
| [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2) | 17.698 | Apache-2.0 | Geracao de video aberta (texto/imagem para video). | 5 |
| [hpcaitech/Open-Sora](https://github.com/hpcaitech/Open-Sora) | 29.854 | Apache-2.0 | Video generation open source. | 5 |
| [zai-org/CogVideo](https://github.com/zai-org/CogVideo) | 13.051 | Apache-2.0 | Video generation com boa qualidade. | 5 |
| [facefusion/facefusion](https://github.com/facefusion/facefusion) | 30.104 | NOASSERTION | Troca de rosto e edicao facial (exige cuidado etico/legal). | 5 |
| [deepinsight/insightface](https://github.com/deepinsight/insightface) | 29.882 | ver LICENSE | Reconhecimento e analise facial (controle de acesso, moderacao). | 6/11 |
| [tencent-ailab/V-Express](https://github.com/tencent-ailab/V-Express) | 2.357 | ver LICENSE | Animacao de retrato por audio (avatares falantes). | 5 |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | 128.082 | MIT | Gera video curto completo a partir de um tema (roteiro+voz+legendas). | 5 |
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | 61.579 | NOASSERTION | Video programatico em React (renderiza em escala). | 5 |
| [huggingface/diffusers](https://github.com/huggingface/diffusers) | 34.641 | Apache-2.0 | Biblioteca de difusao (SD, FLUX, video) para pipelines proprios. | 5/7 |
| [FFmpeg/FFmpeg](https://github.com/FFmpeg/FFmpeg) | 64.707 | NOASSERTION | Conversao e edicao de midia em linha de comando (a base de tudo). | 5 |


## Treinar, ajustar e servir modelos

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [huggingface/transformers](https://github.com/huggingface/transformers) | 166.905 | Apache-2.0 | A biblioteca padrao para usar/treinar milhares de modelos. | 6/7 |
| [huggingface/trl](https://github.com/huggingface/trl) | 19.439 | Apache-2.0 | Fine-tuning com RLHF/DPO (especializar modelo em um nicho). | 7 |
| [huggingface/peft](https://github.com/huggingface/peft) | 21.749 | Apache-2.0 | Fine-tuning eficiente (LoRA/QLoRA) com pouca VRAM. | 7 |
| [unslothai/unsloth](https://github.com/unslothai/unsloth) | 77.141 | Apache-2.0 | Treino 2x mais rapido e 70% menos VRAM (fine-tune barato). | 7 |
| [hiyouga/LlamaFactory](https://github.com/hiyouga/LlamaFactory) | 75.280 | Apache-2.0 | Fine-tuning de 100+ modelos sem escrever codigo. | 7 |
| [axolotl-ai-cloud/axolotl](https://github.com/axolotl-ai-cloud/axolotl) | 12.512 | Apache-2.0 | Treino e fine-tune com arquivos de configuracao. | 7 |
| [artidoro/qlora](https://github.com/artidoro/qlora) | 11.030 | MIT | QLoRA original (referencia tecnica de treino em 1 GPU). | 7 |
| [unslothai/notebooks](https://github.com/unslothai/notebooks) | 5.708 | LGPL-3.0 | Notebooks prontos de fine-tune por modelo (copie e rode). | 7 |
| [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | 130.164 | MIT | Roda modelos GGUF localmente em CPU/GPU do cliente (on-premise). | 6/7 |
| [ollama/ollama](https://github.com/ollama/ollama) | 182.066 | MIT | Modelos locais em 1 comando: prototipos e demos offline. | 3/6 |
| [vllm-project/vllm](https://github.com/vllm-project/vllm) | 93.080 | Apache-2.0 | Servidor de inferencia de alta vazao (base do modelo 7). | 7 |
| [huggingface/text-generation-inference](https://github.com/huggingface/text-generation-inference) ⚠️arquivado | 10.884 | Apache-2.0 | Servidor TGI (repositorio ARQUIVADO; migre para vLLM/TGI da HF). | 7 |
| [BerriAI/litellm](https://github.com/BerriAI/litellm) | 60.061 | NOASSERTION | Gateway unico para 100+ provedores: cache, fallback e cotas por cliente. | 6/7 |
| [mistralai/mistral-inference](https://github.com/mistralai/mistral-inference) ⚠️arquivado | 10.822 | Apache-2.0 | Inferencia Mistral (repositorio ARQUIVADO; use vLLM/transformers). | 7 |


## Verticais: e-commerce, comunidades e conteudo

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [medusajs/medusa](https://github.com/medusajs/medusa) | 36.552 | NOASSERTION | Commerce headless (lojas, assinaturas, marketplaces). | 6/8 |
| [saleor/saleor](https://github.com/saleor/saleor) | 23.399 | BSD-3-Clause | Plataforma de e-commerce GraphQL de nivel enterprise. | 8 |
| [vendurehq/vendure](https://github.com/vendurehq/vendure) | 8.495 | NOASSERTION | E-commerce TypeScript extensivel. | 8 |
| [woocommerce/woocommerce](https://github.com/woocommerce/woocommerce) | 10.536 | NOASSERTION | E-commerce WordPress (99% das PMEs que voce vai atender). | 3/6 |
| [bagisto/bagisto](https://github.com/bagisto/bagisto) | 28.200 | MIT | Loja completa Laravel. | 8 |
| [spree/spree](https://github.com/spree/spree) | 15.738 | BSD-3-Clause | E-commerce Ruby maduro. | 8 |
| [TryGhost/Ghost](https://github.com/TryGhost/Ghost) | 55.471 | MIT | Blog + newsletter + membros pagos (infoproduto com assinatura). | 9/10 |
| [discourse/discourse](https://github.com/discourse/discourse) | 47.929 | GPL-2.0 | Forum/comunidade completa (modelo 10). | 10 |
| [NodeBB/NodeBB](https://github.com/NodeBB/NodeBB) | 15.230 | GPL-3.0 | Forum moderno e leve. | 10 |
| [apache/answer](https://github.com/apache/answer) | 15.688 | Apache-2.0 | Q&A estilo Stack Overflow para uma comunidade de nicho. | 10 |


## Dados, financas e verticais especializadas

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [openbq-org/OpenBB](https://github.com/openbq-org/OpenBB) | 73.763 | NOASSERTION | Plataforma de dados financeiros (base para terminal de nicho). | 11 |
| [freqtrade/freqtrade](https://github.com/freqtrade/freqtrade) | 54.972 | GPL-3.0 | Bot de trading com backtesting (automatizar estrategia propria). | 11 |
| [hummingbot/hummingbot](https://github.com/hummingbot/hummingbot) | 20.291 | Apache-2.0 | Market making e execucao em exchanges. | 11 |
| [jesse-ai/jesse](https://github.com/jesse-ai/jesse) | 8.605 | MIT | Framework de research e backtest de cripto. | 11 |
| [microsoft/qlib](https://github.com/microsoft/qlib) | 49.101 | MIT | Plataforma de investimento com IA (quant research). | 11 |
| [airbytehq/airbyte](https://github.com/airbytehq/airbyte) | 22.159 | NOASSERTION | Centenas de conectores de dados (ETL para o seu produto). | 7/11 |
| [dbt-labs/dbt](https://github.com/dbt-labs/dbt) | 13.959 | Apache-2.0 | Transformacao de dados em SQL (analytics confiavel). | 11 |
| [BrasilAPI/BrasilAPI](https://github.com/BrasilAPI/BrasilAPI) | 11.234 | MIT | APIs publicas brasileiras (CEP, CNPJ, bancos, feriados). | 6/11 |
| [guibranco/BancosBrasileiros](https://github.com/guibranco/BancosBrasileiros) | 552 | Unlicense | Lista oficial de bancos brasileiros (validacao de dados). | 6/11 |


## Front-end, ferramentas de dev e produtividade

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 124.998 | MIT | Componentes copia-e-cola que definem o padrao visual de SaaS em 2026. | 6 |
| [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | 97.751 | MIT | CSS utilitario: prototipe telas em horas. | 6 |
| [honojs/hono](https://github.com/honojs/hono) | 32.400 | MIT | Framework web ultraleve (APIs e edge functions). | 6/7 |
| [trpc/trpc](https://github.com/trpc/trpc) | 40.683 | MIT | Type-safety de ponta a ponta entre front e back. | 6 |
| [TanStack/query](https://github.com/TanStack/query) | 50.392 | MIT | Cache e estado de dados no front (UX de app). | 6 |
| [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) | 35.938 | Apache-2.0 | ORM TypeScript leve e tipado. | 6 |
| [prisma/orm](https://github.com/prisma/orm) | 47.688 | Apache-2.0 | ORM com migracoes e DX excelente. | 6 |
| [vercel/ai](https://github.com/vercel/ai) | 27.088 | NOASSERTION | AI SDK: streaming, tools e UI de chat em Next.js. | 6 |
| [vercel/chatbot](https://github.com/vercel/chatbot) | 20.982 | NOASSERTION | Chatbot completo de referencia (Next.js + AI SDK). | 6/8 |
| [anomalyco/sst](https://github.com/anomalyco/sst) | 26.326 | MIT | Infra como codigo: deploy em AWS com pouca cerimonia. | 6/7 |
| [steven-tey/novel](https://github.com/steven-tey/novel) | 16.449 | Apache-2.0 | Editor de texto com IA (base para editor vertical). | 6 |
| [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) | 133.406 | MIT | Quadro branco virtual (vender como whiteboard com IA). | 6/9 |
| [tldraw/tldraw](https://github.com/tldraw/tldraw) | 50.715 | NOASSERTION | Canvas infinito SDK (produtos visuais e colaborativos). | 6 |
| [microsoft/playwright](https://github.com/microsoft/playwright) | 97.015 | Apache-2.0 | Testes e automacao de navegador confiaveis. | 3/11 |
| [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer) | 95.643 | Apache-2.0 | Automacao de Chrome (scraping e rotinas). | 11 |


## Aprender, listas e descoberta

| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |
|---|---:|---|---|---|
| [sindresorhus/awesome](https://github.com/sindresorhus/awesome) | 513.721 | CC0-1.0 | A lista das listas: comece por ela e siga o topico que precisa. | - |
| [awesome-selfhosted/awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) | 323.436 | NOASSERTION | Tudo que pode ser self-hosted (corte de custo e privacidade). | - |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 140.556 | Apache-2.0 | Apps de LLM com codigo (copie, adapte, venda). | - |
| [f/prompts.chat](https://github.com/f/prompts.chat) | 171.870 | NOASSERTION | Maior colecao de prompts da internet (inclui PT-BR). | 9/12 |
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | 78.791 | MIT | Guia tecnico de prompts (nivel profesional). | - |
| [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners) | 120.952 | MIT | Curso oficial de IA generativa em 21 licoes (gratis). | - |
| [microsoft/AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners) | 69.387 | MIT | Curso de IA em 12 semanas (fundamentos). | - |
| [huggingface/agents-course](https://github.com/huggingface/agents-course) | 33.132 | Apache-2.0 | Curso de agentes da Hugging Face (com certificado). | - |
| [kyrolabs/awesome-langchain](https://github.com/kyrolabs/awesome-langchain) | 9.554 | CC0-1.0 | Mapa do ecossistema LangChain. | - |
| [mezod/awesome-indie](https://github.com/mezod/awesome-indie) | 11.836 | NOASSERTION | Recursos de negocio indie: precificacao, marketing, distribuicao. | - |


## Licenças: leia antes de clonar

| Licença | O que significa na prática |
|---|---|
| **MIT / Apache-2.0 / BSD** | Uso comercial livre, inclusive em produto fechado. Prefira estas. |
| **AGPL-3.0** | Se você oferecer o software como serviço pela rede, precisa liberar as modificações. Use como serviço isolado (ex.: crawler separado) ou troque. |
| **GPL-2.0 / GPL-3.0** | Obra derivada precisa ser GPL. Ferramenta interna ok; embutir em SaaS fechado, não. |
| **Fair-code (n8n)** | Livre para uso interno; restrições para revender como serviço de automação concorrente. Leia os termos. |
| **NOASSERTION / "other"** | O GitHub não reconheceu a licença. Abra o arquivo LICENSE: pode ser non-commercial, dual ou proprietária. |
| **CC-BY-4.0 em código** | Incomum e problemático para software; trate como documentação, não como biblioteca. |

### Armadilhas comuns (e a saída)

- **AGPL em produto fechado:** `firecrawl`, `Skyvern`, `documenso`, `plausible`, `grafana`(AGPL), `getlago`, `khoj`, `ToolJet`, `heyform`, `zammad`, `solidtime`, `kimai`.
  → Saída: rodar como serviço separado via API (comunicação por rede, não linkagem), ou usar alternativa MIT/Apache (ex.: `crawl4ai` no lugar do Firecrawl; `umami` no lugar do Plausible).
- **Repositórios arquivados / descontinuados:** `huggingface/text-generation-inference`, `mistralai/mistral-inference`, `s0md3v/roop`, `FlowiseAI/Flowise`, `RooCodeInc/Roo-Code`, `rhasspy/piper`, `facebookresearch/demucs`, `Sanster/IOPaint`, `vercel/nextjs-subscription-payments`.
  → Saída: use os substitutos citados na descrição de cada linha (vLLM/transformers, Dify/RAGFlow, Cline/opencode, Kokoro/MeloTTS, ComfyUI, nextjs/saas-starter).
- **Nome trocado/redirect:** `nextjs/saas-starter` (ex-leerob), `anomalyco/opencode` (ex-sst), `aaif-goose/goose` (ex-block), `LibreChat-AI/LibreChat` (ex-danny-avila), `prisma/orm` (ex-prisma/prisma), `calcom/cal.diy`, `openbq-org/OpenBB`, `hiyouga/LlamaFactory`, `dbt-labs/dbt`.
  → Sempre use o nome canônico acima para não pegar fork abandonado.
- **Modelos com licença não comercial:** vários modelos de imagem/vídeo no HF (ex.: FLUX.1-dev). Para uso comercial, cheque a licença ou use a variante Apache-2.0 (`FLUX.1-schnell`, `Z-Image-Turbo`).

## Como minerar mais repositórios sozinho (a parte didática)

```text
# 1) Por tópico, ordenado por estrelas
github.com/topics/micro-saas | /saas-boilerplate | /ai-agents | /rag | /mcp-server | /self-hosted

# 2) Busca avançada dentro do GitHub
stars:>1000 topic:saas-boilerplate pushed:>2026-01-01 language:TypeScript
"micro saas" in:name,description,readme stars:>100
topic:mcp-server stars:>200
path:docker-compose.yml "supabase" stars:>500

# 3) Descobrir o que está crescendo (não só o que é famoso)
github.com/trending?since=weekly          -> acesse semanalmente e anote 3 projetos
github.com/explore                      -> recomendações por tema que você segue
awesome-lists (linha "Aprender" acima)  -> navegue do índice para o nicho
```

**Regra de escolha:** estrelas medem atenção, não manutenção. Antes de adotar, verifique: último commit (< 90 dias), issues abertas com resposta, releases recentes, tamanho da comunidade (Discord/forum) e se existe empresa/indivíduo mantenedor.

## Checklist antes de adotar um repositório

- [ ] Licença compatível com uso comercial (MIT/Apache/BSD = sim; AGPL/GPL = dependendo)
- [ ] Último commit há menos de 90 dias (ou manutenção claramente estável)
- [ ] Issues recentes respondidas por mantenedores
- [ ] Você entende como pedir ajuda (Discord, Discussions, Issues)
- [ ] Existe caminho de saída (trocar a peça sem reescrever o produto)
- [ ] Não depende de um único mantenedor pago/blocked
- [ ] Custo de infra em produção estimado (antes de escalar clientes)
- [ ] Você consegue explicar, em 1 frase, o que ele faz no seu produto

> Estrelas mudam. Para revalidar tudo em um comando: `python3 scripts/verificar_links.py --atualizar && python3 scripts/gerar_biblia_github.py`

➡️ Próximo: [`04-BIBLIA-HUGGINGFACE.md`](04-BIBLIA-HUGGINGFACE.md)

