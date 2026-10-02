# 05 — Agentes, Automação e MCP

> Este documento é o **motor do modelo 3** (automação sob medida) e o atalho para o **modelo 6** (micro-SaaS): você automatiza processos manualmente para clientes, descobre o que se repete e transforma em produto.

---

## 1. Diferenças que importam (pare de chamar tudo de "IA")

| Tipo | O que faz | Exemplo | Quando usar |
|---|---|---|---|
| **Automação** | Fluxo determinístico (gatilho → ação) | Novo lead no formulário → cria no CRM → manda e-mail | Processo previsível, sem julgamento |
| **Chatbot com RAG** | Responde com base em documentos | "Qual o prazo do meu contrato?" | Perguntas repetidas sobre conhecimento |
| **Agente** | Decide, usa ferramentas e executa em vários passos | Lê e-mails, classifica, gera proposta, agenda | Processo com exceções e julgamento |
| **Multiagente** | Vários agentes com papéis diferentes | Pesquisador + redator + revisor | Tarefas longas e paralelizáveis |

**Regra de ouro:** comece pela automação, evolua para chatbot, só depois para agente. Agente sem processo definido = caos com API.

---

## 2. Anatomia de um agente que funciona

```
[GATILHO]  cron / webhook / e-mail / planilha / mensagem / clique
    ↓
[CONTEXTO]  dados do cliente + histórico + regras do negócio (RAG)
    ↓
[MODELO]   escolha por custo: 0.6B para classificar, 8-30B para decidir
    ↓
[FERRAMENTAS]  ler/enviar e-mail, consultar banco, gerar PDF, chamar API, navegar
    ↓
[GUARDRAILS]  validação de saída, limites, aprovação humana quando crítico
    ↓
[LOG + MÉTRICA]  o que rodou, quanto custou, acertou ou não (Langfuse)
```

Se faltar **log** e **métrica**, você não tem produto: tem mágica que quebra no cliente e você não sabe por quê.

---

## 3. Seis automações que se vendem sozinhas (e preço)

| # | Automação | Dor do cliente | Stack | Setup | Mensalidade |
|---|---|---|---|---|---|
| 1 | Atendimento no WhatsApp | fila de mensagens, resposta lenta | n8n + whatsapp-mcp/API oficial + RAG (Dify) | R$ 2.500 – 8.000 | R$ 497 – 1.997 |
| 2 | Leitura de documentos → planilha/ERP | digitação manual de NF/contrato | `docling`/`marker`/Qwen3-VL + n8n | R$ 1.500 – 6.000 | R$ 397 – 1.497 |
| 3 | Ata de reunião + follow-up | reuniões sem registro, tarefas perdidas | Whisper + pyannote + LLM + e-mail | R$ 1.200 – 4.000 | R$ 297 – 997 |
| 4 | Prospecção e qualificação de leads | vendedor perde tempo com lead frio | `firecrawl`/`crawl4ai` + LLM + CRM (Twenty) | R$ 2.000 – 7.000 | R$ 497 – 1.997 |
| 5 | Conciliação financeira e relatórios | planilhas frágeis, fechamento lento | n8n + planilhas/ERP + LLM | R$ 2.500 – 9.000 | R$ 597 – 2.497 |
| 6 | Reputação e monitoramento de marca | crise descoberta tarde | Huginn/crawl4ai + LLM + alertas (Novu) | R$ 1.500 – 5.000 | R$ 297 – 997 |

**Como precificar sempre:** `setup = horas estimadas × valor-hora × 1,5` e `mensalidade = 15% a 30% do setup`. Se o cliente travar no setup, cobre em 3 parcelas — nunca dê de graça.

---

## 4. Receitas prontas (copie a arquitetura)

### 4.1 RAG sobre documentos da empresa (a mais pedida)

```
Fontes (Drive, e-mail, PDFs, site)
   → ingestão: docling/marker/MinerU extrai texto e tabelas
   → chunking (500-1.000 tokens, com sobreposição)
   → embeddings: bge-m3 (multilíngue) ou all-MiniLM (barato)
   → vector store: pgvector dentro do Supabase (ou Qdrant)
   → recuperação: top 20 → reranker (ms-marco/bge-reranker-v2-m3) → top 5
   → resposta: LLM com citação da fonte obrigatória
   → interface: Open WebUI, LibreChat, Chatwoot ou o seu app
   → observabilidade: Langfuse (custo, latência, feedback)
```
**Dica de venda:** entregue com "não sei responder" explícito. Cliente prefere "não encontrei" a uma resposta inventada.

### 4.2 Atendimento que escala para humano

```
mensagem → classificação (0.6B/ELECTRA) → RAG tenta responder
   → confiança baixa ou tema sensível → fila humana (Chatwoot)
   → humano resolve → resposta vira exemplo para o próximo treino
```
**Métrica que vende:** % de resolução sem humano e tempo médio de primeira resposta.

### 4.3 Extração de dados em lote

```
PDFs/planilhas enviados → fila → OCR/VLM → validação de schema (JSON)
   → erros vão para revisão humana → dados bons vão para o banco/ERP
```
Use `pydantic` para definir o schema: se o modelo devolver fora do formato, você reprocessa automaticamente.

### 4.4 Outbound assistido (compliance primeiro)

```
lista de empresas-alvo (dados públicos) → enriquecimento → personalização por IA
   → aprovação humana → envio com limite e opt-out → CRM → follow-up automático
```
**Nunca** dispare e-mail em massa sem base legal/opt-out (doc 10 e 14).

---

## 5. MCP (Model Context Protocol) em 5 minutos

**O que é:** um padrão aberto para conectar modelos a ferramentas e dados (em vez de escrever integração para cada caso).
**Repos verificados:** [`modelcontextprotocol/servers`](https://github.com/modelcontextprotocol/servers) (90.959 ⭐) e a lista [`punkpeye/awesome-mcp-servers`](https://github.com/punkpeye/awesome-mcp-servers) (95.768 ⭐).

| MCP que você vai usar | Para que serve |
|---|---|
| Filesystem | o agente ler/escrever arquivos locais com permissão controlada |
| Postgres/Supabase | consultar e atualizar dados do cliente |
| Browser/Playwright | navegar em portais sem API |
| [`lharries/whatsapp-mcp`](https://github.com/lharries/whatsapp-mcp) | ler/enviar WhatsApp (atendimento e follow-up) |
| Slack/Notion/Google Drive | conectar onde a empresa já trabalha |

**Cuidado real:** MCP dá poder ao modelo. Regra: **menor privilégio possível, tudo logado, aprovação humana em ações destrutivas** (apagar, enviar dinheiro, publicar, assinar).

---

## 6. Montando o primeiro agente em 1 dia

**Escolha o caminho:**

- **No-code (recomendado para começar):** n8n (self-host via Docker) ou Dify.
- **Low-code com Python:** LangGraph / CrewAI / pydantic-ai.
- **Pronto para revender:** Suna, Open WebUI, RAGFlow (checar licença antes).

```bash
# n8n em 2 minutos (Docker)
docker run -it -p 5678:5678 -v n8n_dados:/home/node/.n8n docker.n8n.io/n8nio/n8n
# abra http://localhost:5678

# Dify (docker compose)
git clone https://github.com/langgenius/dify && cd dify/docker && docker compose up -d

# Open WebUI (chat com RAG para o cliente)
docker run -d -p 3000:8080 -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main
```

**Passo a passo do primeiro dia:**
1. Escolha um processo chato que você vive (ou do seu primeiro cliente).
2. Desenhe no papel: gatilho → passos → saída → exceções.
3. Monte a versão "feia" no n8n (sem IA onde não precisa).
4. Insira o LLM só nos pontos de julgamento.
5. Crie 20 casos de teste reais e rode (se 18 passarem, entregue).
6. Instrumente: logs, custo por execução, alerta de falha.
7. Documente o "manual da automação" e cobre a mensalidade.

---

## 7. Onde as automações quebram (antídoto antes que o cliente reclame)

| Falha | Causa | Antídoto |
|---|---|---|
| Alucinação | modelo sem contexto/regra | RAG + "não sei" + validação de schema |
| Custo explode | modelo grande para tudo | roteamento por tarefa (0.6B → 8B → frontier) + cache |
| Quebra silenciosa | API mudou sem aviso | monitorar + retry + fallback de provedor (litellm) |
| Lentidão | síncrono e sem fila | fila + status + notificação ao final |
| Vazamento de dado | contexto misturado entre clientes | multi-tenant com RLS + segregação |
| Prompt injection | conteúdo do usuário vira instrução | separar dados de instruções, allowlist de ferramentas |
| Cliente não usa | entrega sem treinamento | onboarding de 1h + vídeo de 3 min + 2 semanas de acompanhamento |

---

## 8. De automação para micro-SaaS (a ponte)

```
1. Você entrega a mesma automação 3 vezes → 3 clientes, 3 preços de setup
2. Identifica o que é sempre igual (80%) e o que é customizado (20%)
3. Constrói o painel: o cliente conecta as fontes e aperta "rodar"
4. Cobra assinatura pelo software + setup opcional de implantação
5. Migra os 3 clientes atuais para o produto (mesmo preço, menos trabalho)
6. A partir daí, cada novo cliente é receita com custo marginal baixo
```

É exatamente esse caminho que o `template/prompts-agente.md.tmpl` e o gerador `scripts/novo_micro_saas.py` formalizam.

---

## 9. Checklist de automação pronta para cobrar

- [ ] Processo desenhado, com exceções mapeadas
- [ ] 20 casos de teste reais passando (≥ 90%)
- [ ] Logs e custo por execução visíveis
- [ ] Fallback de provedor e alerta de falha
- [ ] Aprovação humana nas ações críticas
- [ ] Condições de uso claras (o que a automação NÃO faz)
- [ ] SLA e canal de suporte definidos
- [ ] Cliente treinado e documento de 1 página entregue
- [ ] Métrica de sucesso combinada (horas economizadas, erros reduzidos)

➡️ Próximo: [`06-X-E-REDDIT.md`](06-X-E-REDDIT.md)
