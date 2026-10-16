# 04 — Contratos de Handoff e Portas de Decisão

> Este é o **protocolo** do BVC-OS. Sem protocolo, multiagente vira conversa bonita; com protocolo, vira sistema. Use este arquivo como documentação de referência e como validador (`prompts/agentes.json` + `scripts/master_orchestrator.py`).

---

## 1. Contrato de handoff (v1)

Toda tarefa delegada entre camadas usa este objeto. Campos obrigatórios estão marcados com **(O)**.

| Campo | Tipo | Regra |
|---|---|---|
| `id` (O) | string | `h-NNN` ou uuid curto |
| `de` (O) | enum | `L0`, `AG-VALIDA`, `AG-OFERTA`, `AG-CANAL`, `AG-ENTREGA`, `AG-CAIXA`, `L4`, `humano` |
| `para` (O) | enum | agente L1, especialista L2 ou `humano` |
| `objetivo` (O) | string | 1 frase, com resultado esperado (não a atividade) |
| `contexto` | string | recorte mínimo do estado + trechos da base; nunca o histórico inteiro |
| `entrada` | objeto | dados concretos (links, listas, textos) |
| `saida_esperada` (O) | string | formato exato (schema, tabela, nº de itens) |
| `criterios_aceitacao` (O) | array | cada item binário e verificável |
| `prazo` (O) | data | `AAAA-MM-DD` ou `hoje` |
| `custo_estimado` | objeto | `{ tempo_h, ia_brl }` |
| `status` (O) | enum | `pendente`, `em_curso`, `bloqueado`, `pronto`, `reprovado` |
| `resultado` | objeto | artefato entregue |
| `evidencia` | array | links, prints, números, datas |
| `aprendizado` | string | o que deve ser reaproveitado (cache/reuso) |

### 1.1 Validador manual (antes de enviar)

- [ ] Objetivo é **resultado**, não atividade ("gerar 10 mensagens" ✅, "trabalhar no marketing" ❌)
- [ ] Todo critério de aceitação pode ser checado com **sim/não**
- [ ] O prazo é **hoje ou ≤ 7 dias** (handoff longo = escopo grande demais: quebre)
- [ ] Custo estimado preenchido
- [ ] Nenhum dado pessoal desnecessário no `contexto`
- [ ] Existe um responsável claro (`para`)

### 1.2 Motivos de reprovação automática (L4)

| Código | Motivo | Ação |
|---|---|---|
| `E-FMT` | saída fora do formato pedido | devolver ao L1 de origem |
| `E-DADO` | número sem fonte ou inventado | marcar `[SEM DADO]`, devolver |
| `E-LIC` | licença incompatível (AGPL/GPL/não comercial) | trocar componente ou isolar serviço |
| `E-LGPD` | dado pessoal sem base legal/minimização | cortar dado ou ajustar contrato |
| `E-CUSTO` | custo estimado > 30% da receita do cliente/plano | otimizar modelo/cota |
| `E-PROMESSA` | promessa de renda/garantia não controlável | reescrever |
| `E-ESCOPO` | tarefa mistura 2 responsabilidades | quebrar em 2 handoffs |

---

## 2. Portas de decisão (critérios completos)

Cada porta tem: **evidência exigida**, **como auditar** e **plano B** se reprovada.

### G0 — Dor real
- **Evidência:** ≥ 15 conversas registradas (data, pessoa, citação) + ≥ 5 que já gastam dinheiro ou tempo no problema (com valor aproximado).
- **Auditar:** conte as conversas no estado; confira se há citação literal; confira se o "gasto atual" foi dito pelo cliente (não inferido).
- **Se reprovada:** faltam conversas → AG-CANAL gera lista e abordagens; dor errada → trocar público, não produto.

### G1 — Sinal de dinheiro
- **Evidência:** ≥ 3 pagos, pré-pagos ou cartas de intenção **assinadas**; OU ≥ 1 pagante + 2 com data de início combinada.
- **Auditar:** comprovante de pagamento ou documento; conferir se o preço praticado é o mesmo da oferta.
- **Se reprovada:** reescrever oferta (AG-OFERTA) e mudar canal de abordagem (AG-CANAL).

### G2 — Entrega
- **Evidência:** 1 cliente com métrica antes/depois + depoimento (texto, áudio ou vídeo) + registro do processo.
- **Auditar:** números do antes/depois têm fonte (planilha/print do cliente); depoimento tem permissão de uso.
- **Se reprovada:** AG-ENTREGA reduz escopo até o primeiro valor, com prazo de 7 dias.

### G3 — Recorrência
- **Evidência:** ≥ 3 mensalidades ativas + ≥ 1 renovação (2º ciclo pago) sem desconto temporário.
- **Auditar:** extrato do gateway; churn < 8% no período.
- **Se reprovada:** o valor não é percebido como contínuo → criar ritual mensal de valor (relatório + sessão) antes de aumentar preço.

### G4 — Canal
- **Evidência:** ≥ 10 clientes originados do mesmo canal + CAC calculado (horas × valor-hora + ferramentas ÷ clientes) + taxa de resposta média.
- **Auditar:** cada cliente tem origem registrada; CAC < 12 meses de ticket.
- **Se reprovada:** aumentar volume antes de abrir segundo canal; se resposta < 3%, trocar a lista (não a plataforma).

### G5 — Margem
- **Evidência:** custo de IA + infra < 30% da receita por 2 meses consecutivos; margem bruta > 70%.
- **Auditar:** faturas de API/hospedagem; custo por cliente calculado; cotas por plano implementadas.
- **Se reprovada:** roteamento por modelo, cache, quantização, cotas — nessa ordem.

### G6 — Sistema
- **Evidência:** 4 semanas operando sem intervenção manual crítica (onboarding, cobrança, entrega e suporte rodando com automação/documentação) + runbooks escritos.
- **Auditar:** lista de tarefas recorrentes com dono (você ou automação); teste de ausência de 1 semana.
- **Se reprovada:** automatizar a tarefa que mais consome tempo antes de abrir novo produto.

---

## 3. Máquina de estados do negócio

```
        G0 aprovada            G1 aprovada            G2 aprovada
IDEIA ──────────────► DOR PROVADA ──────► OFERTA VENDIDA ──────► ENTREGA PROVADA
                                                                       │
                                          G3 aprovada                  │
                    PRODUTO/RECORRÊNCIA ◄─────────────────────────────┘
                              │
                    G4 + G5 aprovadas
                              ▼
                    ESCALA (canal + margem)
                              │
                         G6 aprovada
                              ▼
                    SISTEMA / PORTFÓLIO
```

**Estados terminais legítimos:** `MORTO` (critério de morte atingido — registre o aprendizado) e `PAUSADO` (caixa insuficiente — volte em P1 quando houver caixa).

---

## 4. Unidade econômica (obrigatória em toda decisão)

| Métrica | Fórmula | Limite de decisão |
|---|---|---|
| Ticket médio | receita ÷ clientes | subir é mais rápido que dobrar clientes |
| CAC | (horas × valor-hora + ferramentas) ÷ clientes novos | < 12× ticket |
| LTV | ticket ÷ churn mensal | ≥ 3× CAC |
| Payback | CAC ÷ (ticket × margem) | < 6 meses ideal, < 12 aceitável |
| Margem bruta | (receita − custos diretos) ÷ receita | > 70% |
| Custo de IA/cliente | custo total de IA ÷ clientes ativos | < 10% do ticket |
| Runway | caixa ÷ custo fixo mensal | > 6 meses |

Use `scripts/calcular_unidade.py` para gerar o painel e `calc:unidade` do `Makefile` para o atalho.

---

## 5. Critérios de PARAR (o sistema também sabe encerrar)

1. 90 dias sem nenhum sinal de dinheiro **e** 100+ contatos feitos com oferta revisada → matar a ideia ou trocar de público.
2. CAC > 12 meses de ticket por 2 meses seguidos → parar de investir no canal.
3. Churn > 10%/mês após onboarding corrigido → matar o produto (não é "ajuste de marketing").
4. Custo de IA > 50% da receita sem plano de redução → parar de vender até corrigir.
5. Você sem energia/prazer por 30 dias seguidos → pausar com data de retorno escrita.

**Ao parar, registre:** hipótese, evidência, custo gasto, o que reaproveitar (código, lista, aprendizado). Nada de "sumir" do projeto.

---

## 6. Cadência do sistema

| Ritual | Frequência | Quem roda | Saída |
|---|---|---|---|
| Ciclo de Lucro | semanal (seg/sex) | L0 | plano da semana + estado atualizado |
| Auditoria de entrega | por entrega | L4 | aprovado/reprovado + correções |
| Auditoria de porta | antes de avançar | L0 + L4 | evidência aceita ou pendência |
| Unidade econômica | semanal | AG-CAIXA | painel de 8 números |
| Entrevistas (cliente/cancelado/não-cliente) | mensal | AG-VALIDA | dores, objeções, motivos de churn |
| Revisão de preço e custos | trimestral | AG-OFERTA + AG-CAIXA | nova tabela de preços/planos |
| Revisão de arquitetura de agentes | trimestral | L0 | novos módulos, agentes obsoletos removidos |

➡️ Próximo: [`05-IMPLANTACAO.md`](05-IMPLANTACAO.md)
