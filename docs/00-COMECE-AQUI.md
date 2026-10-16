# 00 — Comece Aqui

Se você só pode ler um arquivo hoje, leia este. Ele contém o modelo mental, as decisões e a ordem exata das ações. Todo o resto da bíblia é detalhamento.

---

## 1. A única equação que importa

```
RENDA = (Nº de clientes) × (Ticket médio) × (Meses que cada cliente fica)
```

Todo o resto — IA, automação, stack, repositório open-source — só serve para mexer em **um** desses três termos:

| Termo | Como a IA ajuda | Onde dói |
|---|---|---|
| **Nº de clientes** | Produção de conteúdo, outbound, SEO, demo, suporte mais rápido | Ninguém compra de quem não aparece; canal é o gargalo real |
| **Ticket** | Entregar algo que substitui custo grande (ex.: um cargo de R$ 3.000/mês) | Se você não mede o custo que elimina, você compete por preço |
| **Retenção** | Onboarding, automações que entram na rotina, suporte em minutos | Produto “nice to have” é cancelado no 2º mês |

**Regra:** se a sua ação da semana não aumenta clientes, ticket ou retenção, ela não é prioridade — é procrastinação sofisticada.

---

## 2. As três camadas do negócio (construa de baixo para cima)

```
        ┌─────────────────────────────────────────────┐
   3º   │  ESCALA: portfólio, equipe-IA, white-label  │  ← mês 6+
        ├─────────────────────────────────────────────┤
   2º   │  PRODUTO: micro-SaaS, assinatura, autoatend.│  ← mês 2-6
        ├─────────────────────────────────────────────┤
   1º   │  OFERTA: serviço/produto “feito para você”  │  ← semana 1-4 (CAIXA JÁ)
        └─────────────────────────────────────────────┘
```

**O erro fatal do iniciante:** começar pela camada 2 (produto) sem nunca ter vendido a camada 1. Você gasta 3 meses construindo algo que ninguém comprou. **A camada 1 paga as contas e ensina o que construir.**

---

## 3. O que a IA realmente substitui (e quanto isso vale)

Use esta tabela para achar seu preço. Os valores à esquerda são **faixas de mercado** para contratação humana no Brasil/EUA (variação enorme por região e senioridade) — servem para você dimensionar a oferta, não como promessa.

| Trabalho | Custo humano típico/mês | O que substitui | Seu preço justo |
|---|---|---|---|
| Atendimento ao cliente (SAC) | R$ 1.800 – R$ 4.000 | Base de conhecimento + respostas com IA + macros | R$ 197 – R$ 697/mês |
| Redação e conteúdo | R$ 2.000 – R$ 6.000 | Pipeline de briefing → rascunho → revisão humana | R$ 397 – R$ 1.200/mês |
| Pesquisa e análise | R$ 1.500 – R$ 5.000 | RAG sobre documentos + relatório automático | R$ 297 – R$ 900/mês |
| Social media | R$ 1.500 – R$ 4.000 | 1 ideia → 10 posts + agendamento | R$ 297 – R$ 800/mês |
| Administrativo / agenda | R$ 2.000 – R$ 5.000 | Agentes de e-mail, ata, follow-up | R$ 297 – R$ 900/mês |
| Financeiro / conciliação | R$ 1.200 – R$ 3.500 | Classificação, conciliação e relatório | R$ 247 – R$ 800/mês |
| Suporte técnico nível 1 | R$ 2.500 – R$ 6.000 | RAG na documentação + escalonamento | R$ 497 – R$ 1.500/mês |
| Transcrição / atas | R$ 800 – R$ 2.500 | Whisper + diarização + resumo | R$ 147 – R$ 500/mês |
| Design de peças simples | R$ 1.500 – R$ 4.000 | Templates + geração de imagem | R$ 297 – R$ 900/mês |

**Você não vende “IA”. Você vende o desaparecimento de um custo.** É por isso que a conversa de venda começa com *“quanto você gasta hoje com X e quanto tempo demora?”* e nunca com *“eu uso GPT-5 com RAG e agents”.*

---

## 4. Escolha seu trilho em 2 minutos

Responda honestamente e siga o número:

| Se você é… | Tempo/semana | Capital | Comece por |
|---|---|---|---|
| Dev (ou sabe programar) | 10h+ | < R$ 300 | **Serviço produtizado** com automação (doc 01, modelo 3) → depois micro-SaaS (modelo 6) |
| Dev | 20h+ | R$ 500 – R$ 2.000 | **Micro-SaaS vertical** (doc 13) usando boilerplates do doc 03 |
| Não-dev | 10h+ | < R$ 300 | **Serviço com IA + no-code** (n8n/Dify — doc 05) e **infoproduto** (modelo 9) |
| Não-dev | 5h | R$ 0 | **Freelance aumentado por IA** (modelo 1) — venda entrega, terceirize construção com IA |
| Designer / criativo | 10h+ | < R$ 500 | **Fábrica de criativos** (modelo 5) e **template/pack** (modelo 10) |
| Vendedor / conhece um nicho | 15h+ | R$ 0 | **Agência de 1 pessoa com IA** (modelo 4) — o ativo é a sua agenda, não o código |
| Já tem audiência | 5h+ | R$ 0 | **Infoproduto + comunidade** (modelos 9 e 11) e depois software próprio |

> Se você marcou **“não-dev sem tempo”**: seu primeiro passo é vender um serviço que você entrega com ferramentas prontas (doc 05) e só depois pensar em software.

---

## 5. A primeira semana (7 dias, ~90 minutos por dia)

| Dia | Tarefa | Entrega concreta |
|---|---|---|
| 1 | Ler docs 00, 01 e 13. Escolher **1** nicho e **1** modelo de renda | Uma frase: *“Eu ajudo [quem] a [resultado] em [prazo] com [entrega]”* |
| 2 | Listar 30 pessoas/empresas do nicho (LinkedIn, Instagram, grupos, Reddit) | Planilha com nome, contato, dor provável |
| 3 | Falar com 5 delas. Só perguntar: *“como você resolve X hoje? quanto custa? o que te irrita?”* | 5 conversas reais anotadas |
| 4 | Escrever a oferta (template em `templates/oferta.md.tmpl`) e o preço de entrada | Página de 1 tela + preço |
| 5 | Montar a entrega mínima usando os repos da `docs/03` e o gerador (`scripts/novo_micro_saas.py`) | Entrega funcionando para 1 cliente |
| 6 | Falar com 10 pessoas novas e mandar 10 e-mails/DMs com a oferta (doc 07) | 10 conversas iniciadas |
| 7 | Fechar o primeiro pagamento (Pix na hora, se preciso) e documentar o processo | **1º R$ no caixa** + processo escrito |

**Meta do dia 7:** R$ 1.000 – R$ 3.000 de **serviço** (não de “ideia”). Depois você transforma o processo em produto.

---

## 6. Ambiente de trabalho (instale uma vez)

```bash
# essencial
python3 --version      # 3.11+
git --version
node --version         # 20+ (para boilerplates em Next.js)
docker --version       # para rodar n8n, Dify, Supabase, Ollama localmente

# opcional (GPU forte)
# ollama  -> modelos locais em 1 comando
# LM Studio -> interface gráfica para GGUF
```

Checklist de contas (todas com plano gratuito no início):

- [ ] Conta GitHub + chave SSH
- [ ] Conta Hugging Face (para Spaces e Inference Endpoints)
- [ ] Conta Stripe **ou** Paddle **ou** Mercado Pago (assinaturas + Pix)
- [ ] Um provedor de LLM pago (API) **e** um plano de chat (para não depender de um só)
- [ ] Domínio próprio (R$ 40/ano) e e-mail profissional
- [ ] Conta em 1 plataforma de comunidade onde seu público já vive (X, Reddit, LinkedIn, Discord)
- [ ] Ferramenta de suporte/CRM simples (Issues + Notion ou Chatwoot — doc 03)

---

## 7. Glossário essencial

| Termo | Significado prático |
|---|---|
| **MRR** | Receita recorrente mensal. É a métrica do negócio. |
| **ARR** | MRR × 12. |
| **CAC** | Custo para adquirir 1 cliente (dinheiro + tempo seu, contado a preço de mercado). |
| **LTV** | Ticket × tempo médio de vida (1 ÷ churn). |
| **Churn** | % de clientes que cancela por mês. 5% = vida média de 20 meses. |
| **Ticket médio** | Receita ÷ clientes. Subir ticket é mais rápido que dobrar clientes. |
| **RAG** | Buscar dados reais (PDF, base, site) e entregar ao modelo antes dele responder. É o que faz o chatbot não inventar. |
| **Agente** | LLM + ferramentas + memória + gatilho (cron, e-mail, webhook) que executa tarefas sozinho. |
| **MCP** | Protocolo que conecta o modelo a ferramentas/dados (padrão de 2025-2026). |
| **Inferência** | Rodar o modelo. Local = você paga GPU; API = você paga por token. |
| **Boilerplate** | Projeto base open-source com auth, billing e dashboard prontos. |
| **Produtizado** | Serviço empacotado com escopo, prazo e preço fixos. |

---

## 8. As portas de decisão (quando avançar)

```
R$ 0 → R$ 1.000/mês   : serviço. Você é o produto. Objetivo: aprender a vender.
R$ 1.000 → R$ 5.000   : produtize. Escopo fixo, entrega padronizada, 1 canal.
R$ 5.000 → R$ 20.000  : software. O que você faz de novo a cada cliente vira feature.
R$ 20.000 → R$ 50.000 : time-IA + produto. Contrate humano só para o que a IA não faz.
R$ 50.000+            : portfólio (2-3 produtos), parcerias, white-label, eventual exit.
```

**Porta de saída (quando algo vai mal):** se em 90 dias você não tem 3 pagantes, mude de **canal** antes de mudar de produto. Se em 180 dias não tem 10 pagantes, mude de **público** antes de mudar de tecnologia.

---

## 9. Como navegar esta bíblia por objetivo

| Sua situação | Caminho de leitura |
|---|---|
| Quero caixa essa semana | `docs/01` (modelos 1-4) → `docs/07` → `docs/12` |
| Quero construir software | `docs/03` → `docs/04` → `docs/13` → `scripts/novo_micro_saas.py` |
| Quero audiência em X/Reddit | `docs/06` → `docs/12` → `docs/08` |
| Quero automatizar entregas | `docs/05` → `docs/03` (categoria agentes) → `templates/prompts-agente.md.tmpl` |
| Quero escalar o que já vende | `docs/08` → `docs/09` (fase 3) → `docs/11` |
| Estou travado/errando muito | `docs/14-ANTI-BURRO.md` → `docs/02` (validação) |
| Preciso formalizar/precificar | `docs/10` → `docs/07` |

---

## 10. Regra final

Você não precisa de mais informação. Você precisa **falar com um cliente hoje** e **entregar algo até sexta**. Todo o resto desta bíblia é combustível — o motor é você executando.

➡️ Próximo: [`01-MODELOS-DE-RENDA.md`](01-MODELOS-DE-RENDA.md)
