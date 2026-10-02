# 05 — Implantação: do prompt ao sistema rodando

> Três caminhos: **A) Manual** (hoje, 10 minutos, sem instalar nada), **B) Repositório local** (scripts + git, execução assistida) e **C) Automação** (n8n/LangGraph/Dify + APIs). Comece por A. Só vá para C quando tiver cliente pagando.

---

## A) Caminho manual (hoje, 10 minutos)

1. Abra seu modelo principal (o mais forte que tiver).
2. Cole **todo** o conteúdo de [`00-MASTER-PROMPT.md`](00-MASTER-PROMPT.md) como primeira mensagem.
3. Responda as 3 perguntas que ele faz (dor, público, preço inicial).
4. Cole o resultado de `/iniciar` em `projetos/<slug>/estado.json` (ou copie o do seu projeto gerado).
5. Use `/proximo` todos os dias e `/semana` toda segunda e sexta.
6. Guarde cada artefato gerado no projeto (`PRD.md`, `OFERTA.md`, etc.).

**Custo:** apenas a assinatura do chat. **Quando migrar:** quando você tiver 3+ clientes e o volume de handoffs passar de 10/semana.

---

## B) Caminho do repositório (scripts, 30 minutos)

```bash
# 1. gerar o projeto a partir do seu spec
python3 scripts/novo_micro_saas.py --spec templates/spec.exemplo.yaml

# 2. ligar o estado ao sistema de agentes
python3 scripts/master_orchestrator.py init --slug atendimento-clinicas

# 3. ver o comando pronto para colar no seu chat/modelo
python3 scripts/master_orchestrator.py next --slug atendimento-clinicas

# 4. calcular a unidade econômica e as portas
python3 scripts/calcular_unidade.py --slug atendimento-clinicas
python3 scripts/master_orchestrator.py gates --slug atendimento-clinicas

# 5. (opcional) executar de verdade com API — só depois de ler a política de custos
export BVC_LLM_API_KEY="..."          # NUNCA comite esta chave
export BVC_LLM_MODEL="gpt-4.1-mini"
python3 scripts/master_orchestrator.py run --slug atendimento-clinicas --comando "proximo"
```

`master_orchestrator.py` funciona em **dry-run por padrão**: sem chave de API, ele não chama nada — apenas monta o prompt final (orquestrador + estado + comando) e imprime para você colar. É o modo mais seguro para começar.

**Arquivos em jogo:**

```text
projetos/<slug>/
├── estado.json          # memória: etapas, portas, métricas, decisões
├── PRD.md, OFERTA.md…   # artefatos gerados (templates/)
└── logs/                # execuções e custos (gerado pelos scripts)
prompts/
├── 00-MASTER-PROMPT.md  # system prompt completo
├── agentes.json         # arquitetura (contrato + prompts por agente)
└── 01..06               # módulos
```

---

## C) Caminho automatizado (quando houver cliente pagando)

### C.1 n8n (mais rápido para não-devs)

```
[Schedule: segunda 8h] ─► [Ler estado.json (Supabase/S3)] ─► [AI Agent: orquestrador]
        └─► [Switch por movimento] ─► [Sub-workflow por agente L1] ─► [LLM (modelo por tarefa)]
                     └─► [Validador de schema] ─► [E-mail/Slack: plano da semana]
                                 └─► [Postgres: registrar handoffs, custos e evidências]
```

- Um workflow por agente L1; o orquestrador chama via `Execute Workflow`.
- Use `prompts/agentes.json` para gerar os nós (prompts + critérios).
- **Guardrail obrigatório:** nó de validação que rejeita saída sem critérios preenchidos.
- Telemetria: registrar `tokens`, `custo`, `duração` por handoff (base para o G5).

### C.2 LangGraph (mais controle, para devs)

```python
# pseudo-código
grafo = StateGraph(EstadoNegocio)          # estado = estado.json
grafo.add_node("orquestrador", L0)
for agente in ["valida", "oferta", "canal", "entrega", "caixa"]:
    grafo.add_node(agente, worker_L1[agente])
grafo.add_node("auditor", L4)
grafo.add_conditional_edges("orquestrador", rotear_por_movimento)   # AVANCAR/CONSERTAR/MEDIR/PARAR
grafo.add_conditional_edges("auditor", aprovar_ou_devolver)         # E-FMT/E-DADO/E-LIC/E-LGPD
grafo.set_entry_point("orquestrador")
```

- Estado persistido (checkpointer) = `estado.json` versionado.
- Portas = arestas condicionadas (`G0..G6`); sem evidência, o grafo não avança.
- Modelos diferentes por nó (barato nos workers, forte no orquestrador e no copy).

### C.3 Dify (produto para cliente)

- Workflow com variáveis = estado do cliente; agentes = nós de LLM com os prompts dos módulos.
- Publique como API e chame do seu SaaS; cada cliente com seu próprio `estado.json` (multi-tenant).

### C.4 CrewAI (times de agentes)

- `manager` = orquestrador (`allow_delegation=True`); L1 = agentes com `role/goal/backstory` derivados do `agentes.json`; L2 = tasks.
- Ótimo para pesquisa e conteúdo em lote; cuidado com custo em loops abertos (defina `max_iter` e orçamento).

---

## Política de custos (obrigatória antes do modo `AUTO`)

| Camada | Modelo recomendado | Por quê |
|---|---|---|
| L0 orquestrador | modelo forte | decide e roteia; erro aqui custa caro |
| L1 domínio | modelo médio-forte | artefatos que vão para o cliente |
| L2 workers (classificar, extrair, formatar) | modelo pequeno/local | volume alto, tarefa estreita |
| L4 auditor | modelo médio | checagem objetiva |

- **Orçamento por execução:** defina um teto (ex.: R$ 5). Estourou → o orquestrador para e escala para humano.
- **Cache:** templates, políticas, perguntas de FAQ e resultados de pesquisa não se recalculam.
- **Log obrigatório:** `projetos/<slug>/logs/` com data, comando, tokens, custo, resultado.
- **Sem chave no git:** use variáveis de ambiente; `.env` já está no `.gitignore`.

---

## Segurança e conformidade

- [ ] Nenhuma chave de API em arquivo versionado
- [ ] Dados de cliente não saem do provedor acordado em contrato (LGPD — docs/10)
- [ ] Modelos com licença não comercial fora de produção (docs/04)
- [ ] Ações irreversíveis (cobrar, publicar, apagar, assinar) sempre com aprovação humana
- [ ] Logs de handoff guardados por 6 meses (evidência de portas e de decisão)
- [ ] Backups de `estado.json` e dos artefatos (é a memória do seu negócio)

---

## Roteiro de adoção em 4 semanas

| Semana | Objetivo | Entregável |
|---|---|---|
| 1 | Manual (caminho A): rodar `/iniciar`, `/proximo` e `/semana` | estado inicial + 5 ações executadas |
| 2 | Caminho B: scripts, unidade econômica e portas | painel de 8 números + G0 auditada |
| 3 | 1 automação de verdade (ex.: relatório semanal automático) | handoff rodando sozinho |
| 4 | Caminho C parcial: n8n/LangGraph para o agente que mais consome tempo | 1 agente automatizado + telemetria de custo |

**Regra de escala:** automatize o agente que você mais aciona. Não automatize o que você ainda não sabe fazer manualmente.

➡️ Próximo: [`06-CASO-EXEMPLO.md`](06-CASO-EXEMPLO.md)
