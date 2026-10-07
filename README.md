# HARNESS v2 — JEV-LAYA

**O Copiloto de Lucro do afiliado.** Não é mais um gerador de texto: é o sistema que diz
**qual produto escalar hoje, qual pausar agora e por quê** — com a conta do CPC máximo feita,
o veredito automático e o criativo pronto, tudo auditável.

> Transforma o MVP offline (score + gerador de roteiros) em um produto de decisão com
> automação de dados e escala. Este repositório entrega: a **pesquisa fundamentada**, o
> **motor de decisão validado por testes**, o **prompt master** e a **bíblia operacional**.

---

## 🗂️ O que tem aqui

| Caminho | O que é |
|---|---|
| `docs/01_PESQUISA_PROVAS_MONETARIAS.md` | Fundamentação com provas: GitHub, Hugging Face, Reddit e mercado (links auditados) |
| `docs/02_BIBLIA_AFILIADOS.md` | A bíblia: 8 playbooks, unit economics, protocolo de testes, plano 30/60/90 |
| `prompts/PROMPT_MASTER.md` | Prompt mestre orquestrador JEV-LAYA (cole em Claude/GPT/Gemini) |
| `prompts/produtos/` | 6 produtos com `{{ENTRADA}}` preenchida + estratégia (inclui 1 caso de DESCARTE) |
| `jevlaya/` | Motor de decisão em Python (só stdlib) — score, CPC máximo, preditores JEV, veredito, A/B, criativos |
| `harness_cli.py` | Demo completa que roda offline: radar + fluxo + A/B + veredito |
| `testes/test_harness.py` | **35 testes** que provam a correção da lógica |

---

## 🧠 O método JEV-LAYA

```
L1 COLETA    sinais do produto (Shopee Open API · ML Linkbuilder · PA-API · Trends · Reddit)
L2 PREDIÇÃO  J Janela de Demanda · E Evidência Social · V Viabilidade de Valor   (0..1, auditável)
L3 DECISÃO   Score HARNESS · CPC máximo · ROAS break-even · VIAS · VEREDITO
L4 AÇÃO      30 criativos (5 ganchos × 6 ângulos) · gate de compliance · alerta WhatsApp
```

**As contas que decidem tudo** (implementadas em `jevlaya/score.py`):

```
comissão_por_venda = ticket × comissão%
CPC_MAXIMO         = comissão_por_venda × CVR_esperada × 0,8
ROAS_break_even    = 1,0 (em comissão)   |   ROAS_plataforma = 1/comissão%
VEREDITO           = ESCALAR · OTIMIZAR · AGUARDAR · PAUSAR
```

**Nenhuma decisão é caixa-preta:** cada execução registra a trilha L1→L4. O suporte responde
"por que o app mandou pausar?" em 30 segundos. Isso é argumento de venda.

---

## ▶️ Rodar agora (sem instalar nada)

```bash
# demo completa: radar + fluxo LAYA + teste A/B + vereditos
python3 harness_cli.py

# demo do radar de oportunidades (top 5)
python3 harness_cli.py --radar

# fluxo de um produto específico
python3 harness_cli.py --produto luminaria-galaxia

# validar a lógica (35 testes)
python3 -m pytest testes/ -v
```

Usa só a biblioteca padrão do Python ≥ 3.10. Para o ecossistema estendido (FastAPI, APIs reais,
Claude) veja `requirements.txt`.

---

## 🧪 Estrutura validada

- **35 testes** cobrindo: fórmula do score, CPC máximo, ROAS break-even, os 3 preditores JEV,
  as 5 regras de veredito, o teste A/B (amostra mínima + significância), a matriz de 30 criativos
  e o gate de compliance. Rode `pytest` em CI a cada mudança.
- **Compliance determinístico:** promessas proibidas (renda, cura, emagrecimento numérico,
  "garantido") são bloqueadas em TODO texto antes de sair. A IA preenche; o gate decide.
- **Dados por API oficial:** scraper de página viola ToS e derruba IP; Shopee Open API,
  ML Linkbuilder e PA-API 5.0 são o caminho seguro (fundamentado na pesquisa).

---

## 🚀 Do código ao SaaS

1. **Alpha** (20 afiliados) → **Beta pago R$ 19,90** → **PRO R$ 97/mês** → **AGENCY R$ 297/mês**.
2. Migração: Next.js + FastAPI + Postgres (`users`, `products`, `link_events`, `results`) +
   Redis no redirecionador `harness.link/r/{id}` com UTMs + postback das plataformas.
3. **Lock-in:** histórico de resultados + testes A/B acumulados. Cancelar = jogar fora aprendizado pago.
4. Métrica-norte: **lucro adicional atribuído por usuário/mês.**

Detalhe completo em `docs/02_BIBLIA_AFILIADOS.md` (§8) e no plano original.

---

*Documento vivo: cada teste concluído com significância vira evidência e recalibra os pesos JEV.*
