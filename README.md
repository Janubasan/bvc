# BVC — A Bíblia da Renda com IA

> **Do zero ao primeiro cliente pagante em 30 dias e à recorrência de R$ 5.000+/mês em 12 meses — com trabalho real, repositórios reais (GitHub + Hugging Face), canais reais (X, Reddit, LinkedIn, comunidades) e um gerador de micro-SaaS auto-preenchível.**

Este repositório não é um curso motivacional. É um **sistema operacional de negócio**: mapas, tabelas, números, links verificados, prompts prontos, templates e código que gera o seu projeto preenchido a partir de um arquivo de 20 linhas.

---

## O que tem aqui dentro

| Arquivo | O que resolve |
|---|---|
| **[`app/`](app/server.mjs)** | **O BVC-OS rodando: app full stack com motor agêntico próprio, painel, portas, unidade, agentes e artefatos — `node app/server.mjs`** |
| [`docs/00-COMECE-AQUI.md`](docs/00-COMECE-AQUI.md) | O mapa completo, as regras de ouro e como usar a bíblia hoje |
| [`docs/01-MODELOS-DE-RENDA.md`](docs/01-MODELOS-DE-RENDA.md) | 12 modelos de renda com IA: custo, margem, tempo até o 1º real, teto e qual escolher pelo seu perfil |
| [`docs/02-PRODUTO-E-VALIDACAO.md`](docs/02-PRODUTO-E-VALIDACAO.md) | Como achar dor real, validar em 7 dias, escrever o PRD e precificar |
| [`docs/03-BIBLIA-GITHUB.md`](docs/03-BIBLIA-GITHUB.md) | **Todos os repositórios do GitHub que importam** (~250 verificados por API, com stars, licença e para que servem) |
| [`docs/04-BIBLIA-HUGGINGFACE.md`](docs/04-BIBLIA-HUGGINGFACE.md) | **Modelos, datasets e Spaces do Hugging Face** — o que usar, quanto custa rodar e qual micro-SaaS cada um viabiliza |
| [`docs/05-AGENTES-E-AUTOMACAO.md`](docs/05-AGENTES-E-AUTOMACAO.md) | n8n, Dify, CrewAI, browser-use, MCP: arquiteturas prontas de agentes que entregam serviço |
| [`docs/06-X-E-REDDIT.md`](docs/06-X-E-REDDIT.md) | Playbook de X (Twitter) e Reddit: o que postar, quando, contas para seguir, regras para não ser banido |
| [`docs/07-VENDAS-PRECO-E-PAGAMENTO.md`](docs/07-VENDAS-PRECO-E-PAGAMENTO.md) | Oferta, outbound, cold e-mail, checkout (Stripe/Paddle/Pix), dunning e cobrança |
| [`docs/08-OPERACAO-E-METRICAS.md`](docs/08-OPERACAO-E-METRICAS.md) | MRR, churn, LTV/CAC, funil, suporte, dashboards e a semana padrão de 1 pessoa |
| [`docs/09-ROADMAP-90-DIAS.md`](docs/09-ROADMAP-90-DIAS.md) | O plano dia a dia: 30 → 90 → 365 dias, com portas de decisão e escala |
| [`docs/10-JURIDICO-E-FINANCEIRO-BR.md`](docs/10-JURIDICO-E-FINANCEIRO-BR.md) | MEI x Simples, impostos, MEI no exterior (Stripe/PayPal), contratos, LGPD, contabilidade |
| [`docs/11-BENCHMARKS-E-CASOS.md`](docs/11-BENCHMARKS-E-CASOS.md) | Casos reais com números públicos, benchmarks de preço e o que falhou |
| [`docs/12-PROMPTS.md`](docs/12-PROMPTS.md) | Banco de prompts (venda, conteúdo, suporte, código, pesquisa, agente) para copiar e colar |
| [`docs/13-ATLAS-50-MICRO-SAAS.md`](docs/13-ATLAS-50-MICRO-SAAS.md) | 50 micro-SaaS viáveis hoje: dor, público, preço, canal e qual modelo/repo usar |
| [`docs/14-ANTI-BURRO.md`](docs/14-ANTI-BURRO.md) | As 40 armadilhas que quebram quem começa (e como sair delas) |
| **[`prompts/`](prompts/README.md)** | **BVC-OS: Prompt Master + sistema multiagente em camadas** (orquestrador, 5 agentes de domínio, 9 especialistas, contratos de handoff e portas G0-G6) |
| [`templates/`](templates/) | Templates auto-preenchíveis: PRD, oferta, landing, preço, lançamento em X/Reddit, cold e-mail |
| [`scripts/novo_micro_saas.py`](scripts/novo_micro_saas.py) | Gera um projeto completo (docs + prompts + .env + checklist) a partir de um `spec.yaml` |
| [`scripts/master_orchestrator.py`](scripts/master_orchestrator.py) | Orquestrador local do BVC-OS: estado, auditoria de portas, handoffs e montagem do prompt (dry-run) |
| [`scripts/calcular_unidade.py`](scripts/calcular_unidade.py) | Unidade econômica: ticket, CAC, LTV, payback, margem, custo de IA por cliente e runway |
| [`Makefile`](Makefile) | Atalhos: `make semana`, `make gates`, `make unidade`, `make prompt` |
| [`scripts/verificar_links.py`](scripts/verificar_links.py) | Revalida todos os repositórios e modelos citados (auditoria de link morto) |
| [`dados/`](dados/) | Datasets usados na bíblia: repositórios e modelos verificados via API |

---

## Como usar em 5 minutos

```bash
git clone https://github.com/Janubasan/bvc.git && cd bvc

# 0) O caminho mais rápido: o app full stack (sem instalar nada)
node app/server.mjs
# -> http://localhost:8080 · botão "gerar projeto demo" roda o ciclo agêntico inteiro

# 1) Leia o mapa
less docs/00-COMECE-AQUI.md

# 2) Descubra seu modelo de renda
less docs/01-MODELOS-DE-RENDA.md

# 3) Gere o seu micro-SaaS já preenchido (troque pelos seus dados)
python3 scripts/novo_micro_saas.py --exemplo > meu.spec.yaml
python3 scripts/novo_micro_saas.py --spec meu.spec.yaml
# -> cria projetos/<seu-slug>/ com PRD, oferta, preço, landing,
#    plano de lançamento em X e Reddit, cold e-mails e .env de exemplo

# 4) Ligue o sistema multiagente (BVC-OS) no seu projeto
python3 scripts/master_orchestrator.py init --slug <seu-slug>
python3 scripts/master_orchestrator.py gates --slug <seu-slug>     # auditoria das portas G0-G6
python3 scripts/calcular_unidade.py --slug <seu-slug>              # ticket, CAC, LTV, margem, runway
make semana SLUG=<seu-slug>                                        # ciclo completo -> prompt para o modelo
# ou simplesmente cole prompts/00-MASTER-PROMPT.md no seu chat e use /status, /proximo, /semana
```

Depois siga `docs/09-ROADMAP-90-DIAS.md` **literalmente**, sem pular para o dia 8 antes de fechar o dia 3.

---

## 🚀 O app BVC-OS (full stack, offline, zero dependências)

Todo o sistema — estado, portas, unidade econômica, agentes, contratos e artefatos — também roda como **aplicação web própria**: motor agêntico em Node puro (sem `npm install`, sem build, sem n8n), interface didática em PT-BR e dados gravados em arquivos JSON que você pode abrir e editar.

```bash
node app/server.mjs              # abre em http://localhost:8080
PORT=3000 node app/server.mjs    # outra porta
BVC_DATA_DIR=~/meus-negocios node app/server.mjs   # outra pasta de dados
```

**Opcional — ligar um LLM de verdade** (a chave fica só no servidor, nunca no navegador):

```bash
export BVC_LLM_API_KEY="sua-chave"                 # OpenAI, Groq, OpenRouter, Together…
export BVC_LLM_BASE_URL="https://api.openai.com/v1" # qualquer endpoint compatível com OpenAI
export BVC_LLM_MODEL="gpt-4o-mini"
node app/server.mjs
```

Sem chave o app roda **100% determinístico**: as mesmas portas, o mesmo diagnóstico e os mesmos artefatos — a única diferença é que os textos vêm das regras do BVC-OS em vez de um modelo. A barra superior mostra o modo ativo (*determinístico* ou *LLM: modelo*).

### As 8 abas da interface

| Aba | O que você faz |
|---|---|
| **Começar** | cria um projeto (nome, público, dor, promessa, preço, canal) já com 5–10 artefatos preenchidos; ou gera o **projeto demo** em 1 clique e roda `/semana` |
| **Painel** | vê e edita os 14 números do negócio (conversas, pagos, MRR, custo de IA, churn…); tudo que o motor decide sai daqui |
| **Portas** | audita G0–G6, aprova/reprova **com evidência** e vê o que falta em cada porta (a decisão humana fica registrada no estado) |
| **Unidade** | ticket, CAC, LTV, LTV/CAC, payback, margem, custo de IA por cliente, runway + alertas e ações sugeridas |
| **Ciclo agêntico** | digita ou clica um comando (`/semana`, `/validar`, `/canal reddit`, `/entrega`, `/caixa`, `/preencher oferta`, `/porteiro G3`…) e recebe a resposta nos **7 blocos** + trace do loop, guardrails L4 e itens de HITL |
| **Agentes** | L0 orquestrador + 5 agentes L1 + 9 especialistas L2, cada um com prompt copiável; tabela de códigos de guardrail |
| **Artefatos** | lista, gera e baixa os arquivos do projeto (`oferta.md`, `prd.md`, `preco.md`, `landing.md`, `checklist-30-dias.md`…) |
| **Como funciona** | explicação curta de cada padrão agêntico usado e por que ele é diferente de um fluxo visual |

### Padrões agênticos implementados (não é n8n)

| Padrão | Onde está no código | O que resolve |
|---|---|---|
| **Plan-and-execute** | `app/agents/engine.mjs` → `planejarHandoffs()` | decompõe o objetivo da rodada em 1–3 handoffs com prazo e custo |
| **ReAct tool-loop** | `app/agents/tools.mjs` + `executarFerramenta()` | o agente decide e **chama ferramentas de verdade** (portas, unidade, RAG, preencher, handoff, estado) |
| **Reflexion** | `refletir()` em `engine.mjs` | o próprio resultado é criticado antes de sair (critério ausente, artefato vazio, número sem fonte) |
| **Handoff tipado** | `prompts/04-CONTRATOS-E-PORTAS.md` + `ferramenta_handoff` | todo repasse entre agentes é um arquivo JSON com objetivo, saída, critérios e custo |
| **Guardrails L4** | `app/core/gates.mjs` + `verificarGuardrails()` | 7 códigos (E-FMT, E-DADO, E-LIC, E-LGPD, E-CUSTO, E-PROMESSA, E-ESCOPO) **reprovam** a resposta antes de você agir |
| **HITL** | `exigenciasHITL()` | preço, dados de cliente e gasto relevante exigem decisão humana explícita |
| **RAG local** | `app/core/rag.mjs` | busca por palavra-chave sobre os 15 docs da bíblia + prompts + templates, sem vetor e sem serviço externo |
| **Cache de contexto** | `app/agents/llm.mjs` | reaproveita respostas do LLM para economizar tokens quando há chave |

### API (para automatizar depois)

| Método | Rota | Para que serve |
|---|---|---|
| GET | `/api/health` | versão, modo (determinístico/LLM) e pasta de dados |
| GET/POST | `/api/projetos` | listar e criar projetos |
| POST | `/api/demo` | criar o projeto demo com histórico e métricas |
| GET | `/api/projetos/:slug/estado` | ler o estado completo do negócio |
| PUT | `/api/projetos/:slug/estado` | atualizar métricas (`{"metricas":{"conversas":19}}`) |
| GET | `/api/projetos/:slug/gates` | auditoria G0–G6 com o que falta |
| POST | `/api/projetos/:slug/porta` | registrar decisão humana: `{gate,status,evidencia}` |
| GET | `/api/projetos/:slug/unidade` | unidade econômica (`?horas=&valorHora=&ferramentas=&caixa=&custoFixo=`) |
| GET/POST | `/api/projetos/:slug/artefatos` | ler e gerar artefatos a partir dos templates |
| GET | `/api/projetos/:slug/handoffs` | handoffs tipados gravados em disco |
| POST | `/api/projetos/:slug/comando` | **executar o ciclo agêntico**: `{"comando":"/semana","opcoes":{"usarIA":true}}` |
| GET | `/api/agentes` · `/api/templates` · `/api/buscar?q=` | arquitetura de agentes, templates e busca RAG |

> Os mesmos dados continuam acessíveis pelos scripts (`make semana SLUG=...`, `python3 scripts/calcular_unidade.py`): o app escreve em `projetos/<slug>/estado.json`, exatamente onde os scripts leem.

---

## A matemática honesta (decore estes números)

| Métrica | Conta | Resultado |
|---|---|---|
| 1 cliente | R$ 97/mês × 12 | **R$ 1.164/ano** |
| 50 clientes | R$ 97/mês × 50 | **R$ 4.850/mês** = R$ 58.200/ano |
| R$ 5.000/mês com ticket R$ 149 | 5.000 ÷ 149 | **34 clientes** |
| R$ 10.000/mês com ticket R$ 297 | 10.000 ÷ 297 | **34 clientes** |
| LTV com churn de 5%/mês | ticket × 20 meses | **20× o ticket** |
| Regra saudável | LTV ÷ CAC | **≥ 3** |
| Para onde vai o dinheiro | 1 serviço (R$) × nº de clientes | sem milagre, sem alavanca mágica |

> **A alavanca real não é “achar o prompt perfeito”.** É: **1 dor específica × 1 produto simples × 1 canal dominado × 100 conversas.** O resto é vaidade.

---

## As 10 regras de ouro da BVC

1. **Venda antes de construir.** Se ninguém paga por uma promessa, ninguém paga pelo software.
2. **Um produto, um público, uma promessa.** Micro-SaaS que serve todos não vende para ninguém.
3. **Cobre desde o primeiro dia.** Grátis traz usuário; preço traz cliente.
4. **Escolha 1 canal e domine-o por 90 dias.** X ou Reddit ou LinkedIn ou outbound — nunca os quatro.
5. **Fale com 5 clientes por dia.** 100 conversas valem mais que 1.000 linhas de código.
6. **Automatize somente o que já funciona no manual.** Automação de processo ruim multiplica o caos.
7. **Open-source é superpoder.** Você não precisa construir auth, billing, chat, CRM: clone.
8. **Meça tudo.** Sem métrica você não tem negócio, tem hobby caro.
9. **Nunca hipoteque o essencial.** Comece com capital que você pode perder.
10. **Trate dados e pessoas com respeito (LGPD).** Reputação é o único ativo que não se recompra.

---

## O que foi verificado (e como)

"Não existe lista com *todos* os repositórios do GitHub" (são centenas de milhões). Existe a lista dos que **resolvem problemas reais** — e um método para minerar o resto (doc 03, seção final).

- **239 repositórios** consultados individualmente na API oficial do GitHub — 226 ativos, 9 arquivados (marcados com ⚠️) e 4 inexistentes (substituídos). Datasets: [`dados/repos.csv`](dados/repos.csv) e [`dados/extras.csv`](dados/extras.csv).
- **231 repositórios curados** entram na bíblia (`docs/03`), cada um com estrelas, licença e uso prático — gerados a partir de [`dados/catalogo.py`](dados/catalogo.py) por [`scripts/gerar_biblia_github.py`](scripts/gerar_biblia_github.py).
- **35 modelos do Hugging Face** consultados na API pública do Hub (likes, downloads, licença) — [`dados/hf-modelos.csv`](dados/hf-modelos.csv); o doc 04 traz ainda Spaces, datasets e custos de GPU com fontes de 2026.
- **Dados de terceiros citados com fonte e data** (limite do MEI, preços de GPU, regras de subreddit, casos públicos).
- Data da varredura: **2026-10-02**. Estrelas e downloads mudam: rode `python3 scripts/verificar_links.py --atualizar` e depois `python3 scripts/gerar_biblia_github.py` para revalidar tudo.

## Estrutura do repositório

```text
bvc/
├── README.md                  ← você está aqui (índice + matemática + regras)
├── docs/                      ← a bíblia (00 a 14)
├── app/                       ← BVC-OS em app full stack (Node puro, sem dependências)
│   ├── server.mjs             ← API + serve a interface (node app/server.mjs)
│   ├── core/                  ← estado, portas G0–G6, unidade econômica, RAG, utilitários
│   ├── agents/                ← motor (plan-and-execute, ReAct, reflexion), ferramentas e LLM opcional
│   └── web/                   ← interface didática em 8 abas (HTML/CSS/JS, sem build)
├── prompts/                   ← BVC-OS: prompt master + arquitetura multiagente
│   ├── 00-MASTER-PROMPT.md    ← cole isto no seu modelo
│   ├── 01..06                 ← orquestrador, L1, L2, contratos/portas, implantação, exemplo
│   └── agentes.json           ← arquitetura legível por máquina
├── templates/                 ← 10 templates auto-preenchíveis + spec.exemplo.yaml
├── scripts/
│   ├── novo_micro_saas.py     ← gera projetos/<slug>/ pronto a partir do seu spec
│   ├── master_orchestrator.py ← estado, portas, handoffs e prompt final (dry-run)
│   ├── calcular_unidade.py    ← ticket, CAC, LTV, payback, margem, runway
│   ├── verificar_links.py     ← revalida repositórios e modelos citados
│   └── gerar_biblia_github.py ← regenera o docs/03 a partir dos dados verificados
├── dados/                     ← catálogo curado + CSVs verificados
├── Makefile                   ← atalhos (make semana, gates, unidade)
└── projetos/                  ← sua saída (não versionada; criada pelo gerador)
```

---

## O que este repositório NÃO é

- Não é promessa de renda. **Nenhum número aqui é garantia.**
- Não é “ganhe dinheiro sem trabalhar”. É um mapa para trabalhar **no que paga**.
- Não é consultoria jurídica, contábil ou de investimento. Confirme tributos com um contador e leia `docs/10`.
- Não é uma lista de “mais 50 ferramentas”. É uma lista de **decisões**: o que clonar, o que cobrar, para quem vender, quando escalar.

---

**Autor do projeto:** Philipe Reis · **Licença do conteúdo:** CC BY 4.0 · **Código:** MIT
Sinta-se livre para clonar, adaptar e vender o que construir com isto. Só não venda o mapa como se fosse o território.
