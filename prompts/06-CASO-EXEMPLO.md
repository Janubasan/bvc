# 06 — Caso-exemplo completo: um ciclo inteiro do BVC-OS

> Exemplo real de uso, ponta a ponta, com o formato de resposta obrigatório. Use como gabarito: quando você rodar `/semana` ou `/proximo`, sua saída deve ficar parecida com isto (mudando os dados).
> **Cenário fictício e ilustrativo** — os números são hipóteses etiquetadas, não resultados prometidos.

---

## Contexto de entrada (o que o usuário colou)

```json
{
  "slug": "atendimento-clinicas",
  "percurso_atual": "P1",
  "etapa": "validacao",
  "publico": "clínicas odontológicas com 2-5 cadeiras em Goiânia",
  "dor": "recepção perde ~1h/dia confirmando consultas; ~20% dos pacientes faltam",
  "preco": { "setup": "R$ 1.500", "mensal": "R$ 297" },
  "canal_principal": "WhatsApp de grupos de gestores + Instagram",
  "metricas": { "conversas": 6, "testes": 0, "clientes_pagos": 0, "mrr": 0, "custo_ia_mes": 0 },
  "portas": { "G0": "pendente", "G1": "pendente" }
}
```

**Comando do usuário:** `/semana`

---

## Resposta do BVC-OS

### 1. Diagnóstico (o que os dados dizem)

- 6 conversas registradas, meta da G0 é 15 (**faltam 9**).
- Ainda não há evidência de que ≥ 5 clínicas já gastam dinheiro/tempo no problema: das 6 conversas, **2** declararam custo (uma citou "1h/dia da recepção" e outra "liga 3 lembretes por paciente"). `[SEM DADO]` para as outras 4.
- Não há registro de tentativa anterior de solução → risco de a dor ser tolerada, não paga.
- MRR = 0, caixa gasto = 0 → percurso correto é **P1**.

### 2. Decisão da rodada

**MEDIR** — não avançar. Antes de escrever qualquer linha de código, completar G0 (conversas + custo) e desenhar o teste de sinal de dinheiro (G1).
Porta envolvida: **G0 — em auditoria** | **G1 — pendente**

### 3. Handoffs (quem faz o quê)

| # | Agente | Objetivo | Entrada | Saída esperada | Critério de aceitação | Prazo |
|---|---|---|---|---|---|---|
| 1 | **AG-CANAL** → `sdr` | Conseguir 9 novas conversas de descoberta | dor, público, 6 conversas já feitas | 20 abordagens personalizadas + lista de 30 clínicas-alvo (fonte e gancho) | 20 mensagens ≤ 90 palavras; referência real por clínica; 1 pergunta; opt-out | +3 dias |
| 2 | **AG-VALIDA** → `entrevistador` | Extrair custo e tentativa anterior das 6 conversas | transcrições/notas | tabela com dor citada (frase literal), custo declarado, sinal (DOR PAGA/LATENTE/NÃO É DOR) | toda dor com citação; todo sinal classificado em 1 linha | hoje |
| 3 | **AG-OFERTA** | Preparar a oferta de fundador para testar preço na conversa 15 | hipóteses atuais de preço | oferta em 1 frase + 2 planos + garantia + 3 objeções prontas | preço ancorado em custo citado; garantia verificável | +2 dias |
| 4 | **L4 auditoria** | Revisar as 20 abordagens antes do envio | saída do handoff 1 | aprovado/reprovado por critério | nenhum código E-FMT/E-DADO/E-PROMESSA | +3 dias |

Custo estimado total: 2,5 h de execução + ~R$ 3 de IA.

### 4. Artefato (amostra do handoff 1 — 3 das 20 mensagens)

> 1. "Dr. [nome], vi que a Clínica [X] publica os horários no Instagram e pede confirmação por telefone. Quanto tempo a recepção gasta confirmando consulta por dia? Tenho uma forma de automatizar isso — mas antes quero entender o tamanho do problema. Se preferir não receber mensagem minha, só avisar."
> 2. "Oi [nome], vi que vocês atendem 4 especialidades na [clínica]. Hoje, quem confirma as consultas do dia seguinte? Pergunto porque 1 em cada 5 pacientes falta em média, e isso costuma ser confirmável. Sem compromisso."
> 3. "…" *(as outras 17 seguem o mesmo esqueleto, com gancho específico por clínica)*

*(O artefato completo é gerado pelo especialista `copywriter` com a voz do usuário.)*

### 5. Ação de hoje (15-60 min)

Enviar as 20 mensagens em 2 blocos (10 agora, 10 em 3 horas), registrar cada envio em `estado.json` → `metricas.conversas` e marcar as respostas.
**Sucesso = ≥ 2 respostas hoje.** Se 0 respostas, o problema é a lista (não o texto) → revisar referências.

### 6. Atualização de estado

```json
{
  "metricas": { "conversas": 6, "mensagens_enviadas": 20, "respostas": 0 },
  "experimentos": [
    { "id": "exp-001", "hipotese": "clinicas respondem a abordagem por WhatsApp com referencia especifica", "amostra": 20, "criterio_aprovacao": ">= 6 respostas", "criterio_morte": "<= 2 respostas", "resultado": "pendente" }
  ],
  "riscos": ["dor pode ser tolerada, nao paga: ainda sem evidencia de gasto em 4 das 6 conversas"],
  "proximo_passo": "coletar 9 conversas e 5 evidencias de custo; auditar G0 em 3 dias"
}
```

### 7. Próximo passo

- **Se funcionar (≥ 6 respostas, ≥ 5 com custo declarado):** aprovar **G0**, ir para oferta de fundador e testar **G1** com 3 pré-vendas de R$ 297/mês (setup R$ 1.500).
- **Se falhar (≤ 2 respostas):** trocar a lista (fonte, cargo) e não o texto; repetir com 20 novos contatos. Se duas rodadas falharem, trocar de público (não de produto).

---

## Segunda rodada (3 dias depois): auditoria de porta

**Comando:** `/porteiro G0`

### Saída esperada

| Evidência exigida | Situação | Aceita? |
|---|---|---|
| ≥ 15 conversas registradas | 19 conversas | ✅ |
| ≥ 5 com gasto declarado (dinheiro ou tempo com valor) | 7 (2 com valor em R$/mês, 5 com tempo/semana) | ✅ |
| Citação literal por dor | 14 de 19 têm citação | ⚠️ completar 5 |
| Dores com dono do orçamento identificado | 11 de 19 | ⚠️ |

**Veredito:** G0 **aprovada com ressalvas** → pode construir oferta e pré-vender; **não** pode construir produto (isso exige G1).
**Menor caminho para G1:** pré-venda de fundador com 3 clínicas (link de pagamento + contrato de 30 dias, garantia de devolução do setup).

---

## Terceira rodada: quando o dinheiro entra

**Comando:** `/semana` (com 3 pré-pagos)

- **Diagnóstico:** 3 pré-pagos, MRR contratado R$ 891; zero entregas medidas ainda.
- **Decisão:** AVANÇAR para **P2** (entrega + recorrência), mantendo P1 ativo para mais 2 clientes.
- **Handoffs:** AG-ENTREGA (plano de 14 dias + medição antes/depois) · AG-CAIXA (configurar cobrança recorrente + reserva de imposto) · AG-CANAL (estudo de caso no 30º dia).
- **Risco principal:** entregar sem medir → G2 não aprova e a indicação não acontece.
- **Ação de hoje:** criar a planilha de medição antes/depois e combinar o número com cada cliente por escrito.

---

## Por que este exemplo é o modelo

1. **Nenhum número foi inventado** — onde faltou dado, apareceu `[SEM DADO]`.
2. **Nada avançou sem porta** — o sistema disse "MEDIR", não "construa o MVP".
3. **Toda tarefa tem dono, prazo e critério binário.**
4. **A ação de hoje cabe em 1 hora.**
5. **O estado evoluiu** e ficou registrado (experimento, risco, próximo passo).
6. **A decisão de parar existe** (critério de morte do experimento).

---

## Variações de uso (o mesmo sistema, outros comandos)

| Comando | O que muda | Exemplo de saída |
|---|---|---|
| `/validar [hipótese]` | foco em desenho de teste | hipótese + amostra + critério de aprovação/morte + prazo |
| `/preencher proposta` | foco em artefato | proposta de 1 página preenchida com hipóteses marcadas |
| `/canal reddit` | foco em distribuição | 5 posts + 1 longo + cronograma de 7 dias + regras do sub |
| `/entrega [processo]` | foco em produto/automação | arquitetura + stack (docs/03/04) + custo + MVP em 5 dias |
| `/caixa` | foco em margem | painel de 8 números + 3 ações + alerta de risco |
| `/escalar produto` | foco em P5 | white-label/parceria + margem alvo + riscos |

➡️ Voltar ao índice dos prompts: [`README`](README.md) · Implementação: [`05-IMPLANTACAO.md`](05-IMPLANTACAO.md)
