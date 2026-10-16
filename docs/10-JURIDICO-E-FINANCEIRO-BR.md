# 10 — Jurídico e Financeiro (Brasil, 2026)

> ⚠️ **Este documento é um mapa, não é consultoria jurídica ou contábil.** Confirme cada decisão com um contador e, quando o valor for relevante, com um advogado. Regras mudam — links e datas estão citados.

---

## 1. Escolha do regime: MEI, ME (Simples) ou MEI no exterior

| Regime | Limite anual | Tributo aproximado | Quando faz sentido |
|---|---|---|---|
| **MEI** | **R$ 81.000** (teto vigente em 2026) | DAS mensal ≈ R$ 187 (12% do salário mínimo + R$ 1 de ICMS ou R$ 5 de ISS) — confirme o valor vigente | Começo de operação, serviços digitais, um só dono, sem sócios |
| **ME (Simples Nacional)** | R$ 360.000 (ME) / R$ 4,8 mi (EPP) | Anexo III (~6% inicial) ou Anexo V (15,5% inicial) — depende do **Fator R** | Quando ultrapassar o MEI ou precisar de sócios/mais estrutura |
| **MEI caminhoneiro** | R$ 251.600 | tabela própria | transporte de cargas |

**Fatos verificados (2026):**
- O teto do MEI **continua R$ 81.000/ano** (média de R$ 6.750/mês), sem teto mensal fixo. Fonte: [Agilize](https://agilize.com.br/blog/abrir-sua-empresa/faturamento-do-mei/), [Loggi](https://www.loggi.com/conteudos/empreendedorismo/limite-faturamento-mei/), [EmpresaPro](https://www.empresapro.com.br/blog/10-administracao/novo-limite-mei-2026/).
- Quem abre no meio do ano tem limite **proporcional**: `(81.000 ÷ 12) × meses ativos`.
- Ultrapassar **até 20%** (até R$ 97.200) permite continuar no regime com **DAS complementar**; acima disso há desenquadramento (retroativo a janeiro, na forma da regra).
- Está em tramitação no Congresso o aumento para **R$ 130 mil** (PLP 108/2021 — a Câmara aprovou urgência em 17/03/2026, sem acordo de mérito; relator sugeriu R$ 144,9 mil) e outras propostas (R$ 140 mil e R$ 150 mil). Fontes: [Valor](https://valor.globo.com/politica/noticia/2026/03/17/cmara-aprova-urgncia-para-pl-que-eleva-limite-do-mei-para-r-130-mil-por-ano.ghtml), [EmpresaPro](https://www.empresapro.com.br/blog/10-administracao/novo-limite-mei-2026/).
- **Regra prática:** ignore manchetes. Só vale o que for **sancionado e publicado**. Confirme no [Portal do Empreendedor](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor).

**Decisão em 3 perguntas:**
1. Vai faturar mais de R$ 81 mil/ano? → ME no Simples.
2. Precisa de sócio ou de mais de 1 empregado? → ME/EPP.
3. Vai receber do exterior com frequência? → MEI consegue, mas confirme a forma de recebimento e a tributação com o contador (e considere ME com contabilidade organizada quando o volume crescer).

---

## 2. Abrindo o MEI (passo a passo)

1. Acesse o [Portal do Empreendedor](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor) com sua conta gov.br.
2. Escolha a **ocupação** correta (exemplos comuns para este negócio: programador/desenvolvedor de software, analista de marketing, professor/consultor, designer). Ocupações fora da lista exigem ME.
3. Informe nome empresarial, endereço e atividade; o CNPJ sai na hora.
4. Emita o **CCMEI** (certificado) e faça a inscrição municipal quando exigida (ISS).
5. Pague o DAS em dia (mensal). O atraso gera multa e juros.
6. Todo ano faça a **DASN-SIMEI** (declaração anual) — mesmo sem faturar.
7. Se contratar: hoje é permitido **1 empregado**; o PLP 108/2021 propõe permitir 2 (ainda não sancionado).

**Obrigações de MEI (o básico):** pagar DAS, entregar a declaração anual, emitir nota fiscal quando o cliente exigir, manter um mínimo de controle de entradas (planilha serve).

---

## 3. Impostos e organização financeira

- **MEI:** valor fixo mensal (DAS) dentro do limite — sem imposto de renda sobre o lucro dentro da faixa de isenção; a declaração anual é obrigatória.
- **ME/Simples:** DAS calculado sobre o faturamento pelo anexo (serviços: III ou V, conforme **Fator R** = folha ÷ receita nos últimos 12 meses; acima de 28% costuma ir ao Anexo III).
- **Vender para o exterior:** ISS não incide na exportação de serviços na forma da lei, mas há obrigações acessórias; receba por meio regular e registre tudo.
- **Separe contas**: PJ ≠ PF. Retire **pró-labore** fixo e mantenha reserva para impostos (10-15% de cada entrada em ME).
- **Guarde por 5 anos:** notas emitidas, notas recebidas, extratos, contratos e comprovantes de despesa.
- **Contador:** a partir do ME, é praticamente obrigatório. Um bom contador digital custa menos que uma multa.

---

## 4. Contratos: o mínimo que protege você

Um contrato de prestação de serviços/assinatura deve conter:

| Cláusula | O que proteger |
|---|---|
| Objeto e escopo | o que está incluído e **o que não está** (evita escopo elástico) |
| Prazo e marcos | datas de entrega e dependências do cliente |
| Preço e reajuste | valor, forma de pagamento, multa por atraso, reajuste anual (IPCA) |
| Propriedade intelectual | o que é seu (código, método, prompts) e o que é do cliente (dados, marca) |
| Dados e LGPD | papéis (você é operador?), finalidade, segurança, subprocessadores |
| Confidencialidade | informação do cliente e a sua |
| Suporte e SLA | horário de atendimento, prazos de resposta, o que é "incidente crítico" |
| Rescisão | como cada parte sai, aviso prévio, devolução de dados |
| Limitação de responsabilidade | teto do valor pago (evita prejuízo catastrófico) |

**Ferramentas:** modelo próprio + assinatura digital com [`documenso`](https://github.com/documenso/documenso) (AGPL, self-host) ou plataformas de assinatura. Guarde a versão assinada e o comprovante.

**Para SaaS (termos de uso + política de privacidade):** publique em página própria, com aceite no cadastro, versão datada e histórico de alterações.

---

## 5. LGPD na prática (para produtos com dados de terceiros)

1. **Mapeie dados:** o que você coleta, por quê, onde guarda, com quem compartilha, por quanto tempo.
2. **Base legal:** quase sempre execução de contrato ou legítimo interesse — documente a escolha.
3. **Minimize:** não colete o que não usa. Dado que não existe não vaza.
4. **Segurança:** 2FA, senhas com hash, criptografia em trânsito, backup testado, acessos por menor privilégio, logs.
5. **Direitos do titular:** canal de contato para acesso/correção/exclusão; responda em prazo razoável.
6. **Terceiros/IA:** seu contrato deve dizer se dados podem ir para provedores de IA (e quais países); prefira variantes que não treinam com seus dados; para dados sensíveis, modelos locais (doc 04).
7. **Incidentes:** plano de resposta, registro e comunicação à ANPD/titulares quando houver risco relevante.
8. **Sanções:** a ANPD pode aplicar advertência, multa de até 2% do faturamento (limitada a R$ 50 milhões por infração), publicização e bloqueio de dados. Multa é o menor dos problemas: a reputação é o ativo que você não recupera. Fonte: [Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).

---

## 6. IA: direitos autorais, licenças e regulação

- **Licença do modelo primeiro:** Apache/MIT = uso comercial tranquilo; "other/non-commercial" = só com permissão (doc 04).
- **Conteúdo gerado:** a proteção autoral de obras 100% geradas por IA é incerta no Brasil e no mundo. Se o ativo é importante, garanta **contribuição humana criativa** documentada (edição, curadoria, direção).
- **Voz e imagem:** clonar voz/rosto de terceiros sem consentimento é ilegal em várias frentes (personalidade, imagem, dados sensíveis). Tenha contrato de autorização específico.
- **Dados de treino:** não treine com dados de cliente sem cláusula que permita.
- **Regulação:** o PL 2338/2023 (marco legal da IA) tramita no Congresso. Acompanhe e ajuste seu produto conforme o texto final; hoje, princípios de transparência e responsabilidade já valem como boa prática.
- **UE (se vender para lá):** o AI Act impõe obrigações por nível de risco. Produtos de risco alto exigem avaliação — evite esse território sem suporte jurídico.

---

## 7. Programa de sócios, freelancers e comissões

- **Contrato de freelancer:** escopo, prazo, valor, propriedade da entrega, confidencialidade, dados.
- **Comissão por indicação:** 10-20% recorrente, com contrato e regra de "cliente ativo por 3 meses".
- **Sócio:** acordo de sócios com vesting (tempo para "ganhar" as cotas), o que acontece se alguém sair, quem decide o quê.
- **Estagiário/CLT:** só quando a rotina for estável e a margem suportar.

---

## 8. Checklist de formalização (faça na ordem)

- [ ] Definição do regime (MEI/ME) com apoio de contador
- [ ] CNPJ + CCMEI + inscrição municipal (se exigida)
- [ ] Conta bancária PJ e cartão PJ
- [ ] Gateway de pagamento configurado (Pix + cartão) e testado
- [ ] Emissão de nota fiscal homologada
- [ ] Contrato-modelo + termos de uso + política de privacidade publicados
- [ ] Planilha de entradas/saídas + reserva de impostos automatizada
- [ ] Rotina de backup (banco + arquivos) e 2FA em todas as contas
- [ ] Registro de clientes, contratos e consentimentos (LGPD)
- [ ] Calendário de obrigações: DAS mensal, DASN-SIMEI anual, declarações do contador
- [ ] Revisão semestral do regime (o teto pode ter mudado)

➡️ Próximo: [`11-BENCHMARKS-E-CASOS.md`](11-BENCHMARKS-E-CASOS.md)
