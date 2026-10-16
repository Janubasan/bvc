# BVC-OS — Sistema multiagente (Prompts)

> O **Prompt Master** e os módulos de agentes que transformam a bíblia em um sistema operacional que decide, delega, valida e cobra execução até o lucro.

## Como usar em 60 segundos

```text
1. Abra seu modelo principal (o mais forte que você tiver).
2. Cole TODO o conteúdo de 00-MASTER-PROMPT.md.
3. Responda as 3 perguntas (dor, público, preço inicial).
4. Cole o estado do projeto (projetos/<slug>/estado.json).
5. Use os comandos: /status, /proximo, /semana, /porteiro G0, /preencher oferta…
```

No repositório, o mesmo fluxo com scripts:

```bash
python3 scripts/novo_micro_saas.py --spec templates/spec.exemplo.yaml   # cria o projeto
python3 scripts/master_orchestrator.py init --slug atendimento-clinicas # cria o estado
python3 scripts/master_orchestrator.py next --slug atendimento-clinicas --comando "/semana"
```

## Arquivos

| Arquivo | Para que serve |
|---|---|
| [`00-MASTER-PROMPT.md`](00-MASTER-PROMPT.md) | **Prompt Master completo**: identidade, invariantes, estado, arquitetura de camadas, contrato de handoff, ciclo de lucro, portas G0-G6, percursos P1-P5, 13 comandos, formato obrigatório de resposta |
| [`01-ORQUESTRADOR.md`](01-ORQUESTRADOR.md) | Prompt do L0 (cérebro) + tabela de roteamento + contrato JSON + como plugar em n8n/LangGraph/CrewAI/Dify |
| [`02-AGENTES-L1.md`](02-AGENTES-L1.md) | Os 5 agentes de domínio (VALIDA, OFERTA, CANAL, ENTREGA, CAIXA) com system prompts, entregáveis, portas e KPIs |
| [`03-AGENTES-L2.md`](03-AGENTES-L2.md) | Os 9 especialistas (pesquisador, entrevistador, copywriter, SDR, engenheiro, QA, analista, LGPD, financeiro) com handoff de exemplo |
| [`04-CONTRATOS-E-PORTAS.md`](04-CONTRATOS-E-PORTAS.md) | Protocolo de handoff, códigos de reprovação, critérios completos de cada porta, unidade econômica e critérios de **parar** |
| [`05-IMPLANTACAO.md`](05-IMPLANTACAO.md) | Três caminhos (manual, repositório, automação) + política de custos, segurança e adoção em 4 semanas |
| [`06-CASO-EXEMPLO.md`](06-CASO-EXEMPLO.md) | Um ciclo inteiro rodado, do `/semana` à auditoria de porta, com o formato de resposta de gabarito |
| [`agentes.json`](agentes.json) | A arquitetura legível por máquina: camadas, agentes, portas, percursos, contrato, guardrails, comandos |

## Arquitetura em uma imagem

```
L0 ORQUESTRADOR ── decide · roteia · cobra portas · mantém estado
   │
   ├── L1 AG-VALIDA ── dor e sinal de dinheiro ................ G0 · G1
   ├── L1 AG-OFERTA ── oferta, preço, proposta ................ G1
   ├── L1 AG-CANAL  ── conversas todos os dias ................ G4
   ├── L1 AG-ENTREGA── resultado medido → produto ............. G2 · G3
   └── L1 AG-CAIXA  ── margem, caixa, cobrança ................ G5 · G6
        │
        └── L2 especialistas (chamados por handoff, contexto mínimo)
             └── L4 GUARDRAILS (formato · dado · licença · LGPD · custo · promessa)
```

## Modos de operação

| Modo | O que o sistema pode fazer | Quando usar |
|---|---|---|
| `DRY-RUN` | só monta plano, prompt e handoffs | validando a ideia, sem caixa |
| `ASSISTIDO` | executa artefatos; você aprova cada envio/gasto | primeiros clientes |
| `AUTO` | roda ciclos e relatórios sozinho, escalando o que é crítico | 3+ clientes e custo de IA medido |

## Regras que fazem o sistema funcionar

1. Sem **evidência**, a porta não abre — e sem porta, nada avança.
2. Sempre `[SEM DADO]` em vez de número inventado.
3. Um canal, uma alavanca e uma ação de 15-60 min por dia.
4. Todo artefato sai pronto para usar (não é rascunho para rascunhar).
5. Custo estimado em cada handoff; modelo mais barato que resolve.
6. Preço, contrato, dado sensível e ação irreversível: sempre humano decide.

➡️ Comece por [`00-MASTER-PROMPT.md`](00-MASTER-PROMPT.md) · Fundamentos: [`../docs/00-COMECE-AQUI.md`](../docs/00-COMECE-AQUI.md)
