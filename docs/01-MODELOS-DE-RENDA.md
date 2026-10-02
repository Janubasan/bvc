# 01 — Os 12 Modelos de Renda com IA

> Números aqui são **faixas de mercado** (Brasil, 2026), não promessas. Use como régua de decisão e ajuste ao seu nicho.

## Tabela-resumo

| # | Modelo | Investimento inicial | Margem típica | 1º R$ em | Teto mensal (1 pessoa) | Escalável? |
|---|---|---|---|---|---|---|
| 1 | Freelance aumentado por IA | R$ 0 | 80-95% | 3-7 dias | R$ 8 - 25 mil | Baixo |
| 2 | Serviço produtizado | R$ 0-300 | 70-90% | 1-2 semanas | R$ 15 - 40 mil | Médio |
| 3 | Automação/agente sob medida | R$ 0-500 | 75-90% | 1-3 semanas | R$ 20 - 60 mil | Médio |
| 4 | Agência de 1 pessoa com IA | R$ 300-2.000 | 60-85% | 2-6 semanas | R$ 30 - 100 mil | Médio-alto |
| 5 | Fábrica de criativos/conteúdo | R$ 0-500 | 70-90% | 1-3 semanas | R$ 10 - 40 mil | Médio |
| 6 | **Micro-SaaS vertical** | R$ 100-2.000 | 85-95% | 1-3 meses | R$ 20 - 200 mil | **Alto** |
| 7 | API/infra de IA para devs | R$ 100-1.000 | 70-90% | 1-3 meses | R$ 10 - 100 mil | Alto |
| 8 | Copiloto white-label p/ agências | R$ 500-3.000 | 80-92% | 1-2 meses | R$ 30 - 150 mil | Alto |
| 9 | Infoproduto (templates, cursos) | R$ 0-500 | 90-98% | 1-4 semanas | R$ 10 - 150 mil | Alto |
| 10 | Comunidade/assinatura de nicho | R$ 0-300 | 80-95% | 2-8 semanas | R$ 10 - 80 mil | Alto |
| 11 | Dados e leads (marketplace) | R$ 100-1.000 | 60-85% | 1-2 meses | R$ 10 - 60 mil | Alto |
| 12 | Comprar e melhorar micro-SaaS | R$ 5 - 100 mil | 80-95% | imediato | depende do ativo | Alto |

**Como ler:** margem alta + teto alto + escalável = modelo 6. Caixa rápido = modelos 1-3. Combine: **serviço paga a conta, produto constrói o patrimônio.**

---

## Modelo 1 — Freelance aumentado por IA (o mais rápido)

**O que é:** você vende um serviço tradicional (redação, tradução, edição de vídeo, planilhas, atendimento, design) e usa IA para entregar 3-10× mais rápido, mantendo o preço de mercado.

**Por que funciona:** o cliente compra resultado, não processo. Sua margem explode porque seu custo é tempo.

**Preço:** por projeto ou por hora. Nunca cobre "por palavra" quando a IA faz em 5 minutos.

**Stack mínima:** 1 LLM de chat + 1 de API + Whisper (transcrição) + Canva/Remotion.
**Repos:** `openai/whisper`, `SYSTRAN/faster-whisper`, `remotion-dev/remotion` (doc 03).

**Primeiros 3 passos:**
1. Escolha o serviço que você **já sabe entregar** (não aprenda duas coisas ao mesmo tempo).
2. Crie 3 amostras de altíssima qualidade do seu próprio nicho (portfólio).
3. Mande 20 mensagens para quem já reclama publicamente desse problema (Reddit/LinkedIn/grupos).

**Risco:** você fica preso no "eu faço tudo". Solução: doc 09 (produtizar em 30 dias).

---

## Modelo 2 — Serviço produtizado (escopo fixo, preço fixo)

**O que é:** a mesma entrega, sempre, com prazo e preço fixos. Ex.: *"Site de captura + 10 páginas + integração de agendamento por R$ 1.500 em 5 dias"*.

**Por que funciona:** você para de negociar orçamento e começa a vender **um produto com nome**.

**Preço (faixas comuns):**
- Auditoria/consultoria rápida: R$ 300 – R$ 1.500
- Entrega "tudo pronto" para PME: R$ 1.000 – R$ 5.000
- Recorrente de manutenção: R$ 297 – R$ 997/mês

**Stack mínima:** landing + formulário + pagamento + entrega padronizada (templates do repo).
**Repos:** `calcom/cal.com` (agenda), `formbricks/formbricks` (formulários), `documenso/documenso` (assinatura).

**Primeiros 3 passos:**
1. Escreva a oferta em **1 frase + 3 bullets de entregáveis + prazo**.
2. Faça uma página de 1 tela (use `templates/landing.md.tmpl`).
3. Venda 3 unidades com **preço de lançamento** e suba o preço após cada cliente.

**Risco:** escopo elástico. Solução: contrato com "o que NÃO está incluso".

---

## Modelo 3 — Automação e agentes sob medida (o mais subestimado)

**O que é:** você mapeia um processo chato, automatiza com n8n/Dify/agente + LLM, cobra **setup** + **mensalidade de manutenção**.

**Por que funciona:** empresa que gasta 40h/mês de equipe em planilha paga sem pensar por algo que corta 80% disso.

**Preço:** setup R$ 1.500 – R$ 15.000 + R$ 297 – R$ 1.500/mês de operação/ajustes.

**Exemplos que vendem em qualquer cidade:**
- Atendimento no WhatsApp com base de conhecimento própria
- Leitura de notas fiscais/PDFs → planilha/ERP
- Conciliação financeira e relatórios automáticos
- Resumo de reuniões + follow-up automático
- Captação e qualificação de leads

**Stack mínima:** n8n (grátis self-host) + LLM via API + Supabase + 1 canal (WhatsApp/e-mail).
**Repos:** `n8n-io/n8n`, `langgenius/dify`, `FlowiseAI/Flowise`, `activepieces/activepieces`, `browser-use/browser-use`.

**Primeiros 3 passos:**
1. Faça um **diagnóstico gratuito de 30 min** com 5 empresas do mesmo setor.
2. Automatize **um** processo da primeira que topar pagar.
3. Transforme o que você fez em template reutilizável (mesmo processo → mesmo preço).

**Risco:** virar "menino do conserto". Solução: só vender automação com **mensalidade** e SLA.

---

## Modelo 4 — Agência de 1 pessoa com IA

**O que é:** você coordena tudo (vende, estrategiza, revisa) e a execução é feita por IA + freelas pontuais. Você é o cérebro, não a mão.

**Por que funciona:** agência tradicional tem 60-70% do custo em execução; com IA esse custo cai para 10-20%.

**Preço:** retainer R$ 2.000 – R$ 12.000/mês por cliente; 3-8 clientes = negócio saudável.

**Stack mínima:** CRM simples + gerenciador de tarefas + IA para produção + 2-3 freelas de confiança.
**Repos:** `twentyhq/twenty` (CRM), `chatwoot/chatwoot` (atendimento), `papermark/papermark` (proposta), `novuhq/novu` (notificações).

**Primeiros 3 passos:**
1. Escolha **um** serviço-mãe (ex.: social media, SEO local, tráfego pago).
2. Monte o "kit de entrega" em notação: briefing → IA → revisão → publicação.
3. Feche 2 clientes com preço de fundador em troca de depoimento e estudo de caso.

**Risco:** você fica refém de cliente grande. Solução: nenhum cliente > 40% da receita.

---

## Modelo 5 — Fábrica de criativos e conteúdo

**O que é:** produção em volume de peças (imagens, vídeos curtos, legendas, roteiros) para marcas, agências e criadores — com pipeline automatizado.

**Por que funciona:** demanda infinita por volume; o gargalo do cliente é produção, não ideia.

**Preço:** pacote de 30 peças R$ 700 – R$ 3.000; assinatura mensal R$ 1.000 – R$ 5.000.

**Stack mínima:** LLM para roteiro + geração de imagem/vídeo + editor automático + agendador.
**Repos:** `harry0703/MoneyPrinterTurbo`, `remotion-dev/remotion`, `Comfy-Org/ComfyUI`, `Sanster/IOPaint`.
**HF:** `Tongyi-MAI/Z-Image-Turbo`, `Lightricks/LTX-2.5`, `hexgrad/Kokoro-82M`, `ResembleAI/chatterbox` (doc 04).

**Primeiros 3 passos:**
1. Escolha **1 formato** (ex.: 30 reels/mês para clínicas).
2. Produza 5 peças de amostra para 3 negócios reais da sua cidade (grátis, como prova).
3. Transforme em assinatura mensal com fila de aprovação do cliente.

**Risco:** commoditização. Solução: nichar em um setor e dominar o "padrão que converte" daquele setor.

---

## Modelo 6 — Micro-SaaS vertical (o patrimônio)

**O que é:** um software pequeno, com assinatura, resolvendo **uma dor específica de um público específico**. Não é "o próximo ChatGPT": é "o sistema de orçamento para gráficas rápidas".

**Por que é o melhor modelo de longo prazo:** receita recorrente, custo marginal quase zero, roda sem você e pode ser vendido como ativo (múltiplos de 2-4× a receita anual são comuns em micro-SaaS).

**Preço:** R$ 49 – R$ 497/mês (B2B pequeno), US$ 19 – US$ 199 (internacional).
**Custo de operação:** R$ 50 – R$ 800/mês (hospedagem + APIs) até ~200 clientes.

**Stack recomendada:**
- **Auth + banco + storage:** Supabase / Appwrite / PocketBase
- **Pagamento:** Stripe / Paddle / Mercado Pago (Pix)
- **IA:** API de LLM + (opcional) modelo aberto do doc 04
- **Front:** Next.js + shadcn/ui + Tailwind
- **Base de código pronta:** `wasp-lang/open-saas`, `leerob/next-saas-starter`, `ixartz/SaaS-Boilerplate` (doc 03)

**Primeiros 3 passos:**
1. Escolha **1 vertical** no doc 13 (Atlas de 50 micro-SaaS).
2. Valide com 10 clientes pagantes do serviço (modelo 3) antes de escrever código novo.
3. Construa só o "caminho do primeiro valor": cadastrar → gerar resultado → pagar.

**Risco:** construir por 6 meses sem vender. Solução: **venda antes** com o "compromisso de fundador".

---

## Modelo 7 — API e infraestrutura de IA para outros devs

**O que é:** você vende a "picareta" da corrida do ouro: endpoints prontos (OCR, transcrição, resumo, embeddings), wrappers com SLA, filas de GPU, cache de LLM.

**Por que funciona:** devs odeiam montar infraestrutura; empresas odeiam variação de custo de tokens.

**Preço:** por uso (créditos) US$ 9 – US$ 199/mês ou por requisição; planos de volume.

**Stack mínima:** FastAPI/Node + fila + 1 GPU alugada (ou serverless) + medição de uso.
**Repos:** `vllm-project/vllm`, `ggml-org/llama.cpp`, `BerriAI/litellm` (roteamento e cache de LLM), `huggingface/text-generation-inference` (arquivado — use vLLM/TGI alternativo), `unkeyed/unkey` (API keys e rate limit).

**Primeiros 3 passos:**
1. Ache uma tarefa cara e chata (ex.: OCR de documentos fiscais brasileiros).
2. Ofereça como API com 1.000 requisições grátis e documentação impecável.
3. Cobre por volume; publique um exemplo open-source que gera leads.

**Risco:** competir com provedores gigantes. Solução: nichar (idioma, documento, compliance, latência local).

---

## Modelo 8 — Copiloto white-label para agências

**O que é:** você constrói **uma vez** um copiloto vertical (ex.: "gerador de relatório de SEO com IA") e o revende com a marca de agências e consultorias, que aplicam em seus clientes.

**Por que funciona:** você tem **distribuição emprestada**: cada agência já tem 10-50 clientes.

**Preço:** R$ 497 – R$ 2.997/mês por agência (licença) + taxa de setup.
**Vantagem:** churn baixo (a agência embute no serviço dela) e CAC quase zero (venda B2B direta).

**Stack mínima:** a mesma do modelo 6 + multiusuário/multitenant + marca personalizável (white-label).
**Repos:** `wasp-lang/open-saas` (multi-tenant), `saleor/saleor`, `medusajs/medusa` (se houver catálogo/pedido), `supabase/supabase` (multi-tenant com RLS).

**Primeiros 3 passos:**
1. Escolha um serviço que agências vendem mas odeiam executar.
2. Faça o piloto com 1 agência em troca de feedback semanal.
3. Empacote: painel da agência, sub-contas, relatório com a marca delas.

**Risco:** uma agência grande pedir exclusividade. Solução: precifique exclusividade por região.

---

## Modelo 9 — Infoproduto: templates, packs e cursos

**O que é:** você empacota o que aprendeu (prompts, planilhas, automações, mini-curso) e vende em escala.

**Por que funciona:** custo marginal zero e valida audiência para os modelos 6-8.

**Preço:** R$ 27 – R$ 197 (templates/packs), R$ 297 – R$ 1.997 (cursos), R$ 9,90 – R$ 49/mês (assinatura de atualizações).

**Stack mínima:** Hotmart/Kiwify/Gumroad + área de membros simples + 1 canal de aquisição.
**Repos:** `TryGhost/Ghost` (blog/newsletter), `knadh/listmonk` (e-mails em massa), `documenso` (contratos/termos).

**Primeiros 3 passos:**
1. Valide a dor publicando conteúdo gratuito sobre ela por 2 semanas.
2. Pré-venda: *"se eu montar X, você compra por R$ Y?"* — só produza com 10 "sim".
3. Entregue em 7 dias, colete depoimentos, suba o preço.

**Risco:** mercado saturado de "curso de IA". Solução: nichar e mostrar **resultado verificável**.

---

## Modelo 10 — Comunidade de nicho por assinatura

**O que é:** comunidade paga (Discord/WhatsApp/Circle) em torno de um interesse específico, com curadoria + encontros + biblioteca.

**Por que funciona:** as pessoas pagam por **pertencimento e atalho**, não por conteúdo bruto.

**Preço:** R$ 29 – R$ 149/mês; 100 membros a R$ 49 = R$ 4.900/mês.

**Repos:** `discourse/discourse`, `NodeBB/NodeBB`, `apache/answer` (fóruns), `novuhq/novu` (notificações).

**Primeiros 3 passos:**
1. Abra um núcleo gratuito e seja obcecado por ele por 30 dias.
2. Crie um benefício exclusivo (encontro semanal, banco de prompts, revisão de projeto).
3. Migre 20% dos mais ativos para o plano pago.

**Risco:** comunidade morre quando você some. Solução: rituais fixos + membros-âncora.

---

## Modelo 11 — Dados e leads (o modelo "invisível")

**O que é:** você monta um pipeline que coleta, limpa e entrega dados que geram dinheiro: listas qualificadas, preços de concorrentes, licitações, imóveis, vagas, editais, tendências.

**Por que funciona:** informação organizada = decisão = dinheiro. Empresas pagam por lead qualificado.

**Preço:** R$ 0,50 – R$ 20 por lead qualificado; assinatura R$ 197 – R$ 1.997/mês pelo painel.

**Stack mínima:** crawler + LLM para extrair/classificar + painel de consulta.
**Repos:** `firecrawl/firecrawl`, `apify/crawlee`, `scrapy/scrapy`, `unclecode/crawl4ai`, `steel-dev/steel-browser`, `browser-use/browser-use`.
**HF:** `sentence-transformers/all-MiniLM-L6-v2`, `BAAI/bge-m3` (deduplicação e busca semântica).

**Primeiros 3 passos:**
1. Escolha um dado que alguém já paga caro para ter (ex.: concorrência de preços de um setor).
2. ColetE 1.000 registros, limpe e mostre uma amostra grátis.
3. Venda o acesso (assinatura) ou entregue como serviço mensal.

**Risco:** LGPD e termos de uso. Solução: só dados públicos, respeite robots.txt, minimize dados pessoais (doc 10).

---

## Modelo 12 — Comprar e melhorar micro-SaaS (aquisição)

**O que é:** em vez de começar do zero, você compra um SaaS pequeno e esquecido (R$ 5 - 100 mil), arruma o funil, adiciona IA e multiplica a receita.

**Por que funciona:** você compra **tempo de mercado** já provado, e a IA melhora margem e produto.

**Onde procurar:** Acquire.com, Flippa, Microns, grupos de indie hackers, "SaaS for sale".

**Due diligence mínima:** receita verificada (Stripe), churn, dependência de 1 cliente, dívida técnica, suporte e custo de infra.

**Primeiros 3 passos:**
1. Juntar o capital e definir o critério (ex.: MRR R$ 3-10 mil, churn < 5%, nicho que você entende).
2. Auditar 10 ativos com checklist de due diligence.
3. Negociar earn-out (parte do preço atrelada a resultado pós-compra).

**Risco:** comprar passivo escondido. Solução: advogado + auditoria de dados + período de transição obrigatório do vendedor.

---

## Como combinar (o caminho canônico da BVC)

```
SEMANA 1-4   : modelo 1 ou 2  → caixa rápido e aprendizado de venda
MÊS 2-3      : modelo 3 ou 4  → recorrência (mensalidade) e processo
MÊS 3-6      : modelo 6       → transforma o processo que você repete em software
MÊS 6-12     : modelo 8 ou 9  → escala via parceiros/audiência
MÊS 12+      : modelo 12      → compra de ativos com lucro acumulado
```

**Teste do "1 cliente":** todo serviço que você entregar 3 vezes para 3 clientes diferentes deve virar software. Se você não consegue listar as tarefas repetidas, ainda não chegou a hora de programar.

---

➡️ Próximo: [`02-PRODUTO-E-VALIDACAO.md`](02-PRODUTO-E-VALIDACAO.md) · Índice: [`../README.md`](../README.md)
