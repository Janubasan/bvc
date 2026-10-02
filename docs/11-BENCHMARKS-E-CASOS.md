# 11 — Benchmarks, Casos Reais e o que Falhou

> Todos os números abaixo são **de terceiros, com fonte e data**. Valores de outras pessoas servem para calibrar expectativa — não como promessa nem como comparação (o jogo de cada um tem contexto diferente).

---

## 1. Casos públicos verificáveis

| Pessoa | Produto(s) | Número citado | Fonte/data |
|---|---|---|---|
| **Pieter Levels** (@levelsio) | Nomad List, Remote OK, PhotoAI, Interior AI | Negócios de **US$ 2,5M+/ano**, construídos em público; ~936 mil seguidores | [The Indie Press](https://theindiepress.news/register), [Teract](https://www.teract.ai/resources/twitter-strategy-indie-hackers-2026) (2026) |
| **Marc Lou** (@marclou) | ShipFast, TrustMRR, DataFast, ShipOrDie | **US$ 2,96 mi** acumulados em 17 produtos; TrustMRR ~US$ 44 mil/mês; DataFast ~US$ 26 mil; ShipOrDie ~US$ 13 mil; ShipFast ~US$ 4 mil | [The Indie Press](https://theindiepress.news/register) (24/08/2026) |
| **Tony Dinh** (@tdinh_me) | TypingMind, DevUtils, Xnapper | Produtos solo com receita consistente; referência de "vários pequenos ativos" | [The Indie Press](https://theindiepress.news/register) (2026) |
| **Danny Postma** (@dannypostma) | Headlime (vendido), Postcrafts | IA aplicada + design; construiu e vendeu | [The Indie Press](https://theindiepress.news/register) (2026) |
| **Arvid Kahl** (@arvidkahl) | FeedbackPanda (vendido) | Saída de SaaS bootstrapped; hoje ensina retenção e posicionamento | [Teract](https://www.teract.ai/resources/twitter-strategy-indie-hackers-2026) (2026) |
| **Cory Zue** (@czue) | SaaS Pegasus | Boilerplate como negócio: vender "tempo economizado" funciona | [Wisp](https://www.wisp.blog/blog/top-indie-hackers-to-follow-on-twitter-in-2024) |

⚠️ **Aviso da própria fonte:** vários artigos "top indie hackers" citam números até 2× desatualizados e handles antigos (`@marc_louvion`, `@dannypostmaa` e `@damengchen` não resolvem mais). Sempre confirme na fonte primária antes de citar.

---

## 2. O que os casos têm em comum (o padrão que se repete)

1. **Lançam muito mais do que você imagina.** Marc Lou: 17 produtos — e vários fracassos públicos (VirallyBot, HabitsGarden).
2. **Um problema chato e específico**, não "IA revolucionária".
3. **Distribuição construída antes do produto** (audiência, lista, comunidade).
4. **Preço em dólar, público global** quando o produto é digital.
5. **Transparência como marketing** (números públicos geram confiança e tráfego).
6. **Velocidade**: MVP em dias/semanas, não meses.
7. **Recorrência e portfólio**: poucos produtos pagam a conta, o resto é aprendizado.

---

## 3. Benchmarks para calibrar expectativa (micro-SaaS e serviço)

| Indicador | Faixa realista | Observação |
|---|---|---|
| Tempo até o 1º cliente (serviço) | 3 – 30 dias | depende de lista e oferta |
| Tempo até R$ 1.000 MRR (produto) | 1 – 6 meses | maioria esmagadora fica no caminho por falta de canal |
| Tempo até R$ 5.000 MRR | 3 – 18 meses | 34 clientes a R$ 149 ou 17 a R$ 297 |
| Churn mensal aceitável (B2B pequeno) | 2 – 5% | > 8% = produto não virou rotina |
| Ativação (1º valor em 7 dias) | 40 – 60% | abaixo de 25% é problema de onboarding |
| Conversão visita → cadastro | 2 – 10% | abaixo de 1% = promessa/tráfego errado |
| Taxa de resposta de outbound bem segmentado | 3 – 10% | 200 contatos → 5-15 conversas |
| Margem bruta de software com IA | 70 – 90% | se < 60%, reprecifique ou otimize modelos |
| Múltiplo de venda (micro-SaaS) | 2 – 4× receita anual | varia com churn, dependência do fundador e margem |

**Leitura honesta:** a maioria dos micro-SaaS **não chega a R$ 5 mil/mês**. Os que chegam têm três coisas: nicho estreito, canal consistente e tempo (12-24 meses). Quem promete "R$ 30 mil em 30 dias" está vendendo curso, não experiência.

---

## 4. O que costuma falhar (com nome e motivo)

| Padrão de falha | Por que falha | Antídoto |
|---|---|---|
| "SaaS que serve todo mundo" | não tem canal nem promessa | nichar até doer (doc 13) |
| Construir 6 meses antes de vender | o mercado responde no dia 1, não no dia 180 | pré-venda/concierge (doc 02) |
| Depender de 1 canal pago | CAC sobe e o negócio morre | 1 canal orgânico dominado primeiro |
| Modelo caro para tarefa simples | margem negativa escondida | roteamento por tarefa (doc 04) |
| Cliente grande = 70% da receita | um cancelamento apaga o mês | nenhum cliente > 40% |
| Funcionalidade pedida por 1 cliente | roadmap virou colcha de retalhos | filtre por "quantos clientes pedem?" |
| Grátis ilimitado | custo cresce, receita não | limite sempre; grátis com prova de valor |
| Ignorar suporte | churn sobe em silêncio | SLA + onboarding ativo |
| Brigar com a plataforma | conta banida, negócio zerado | respeite regras (doc 06) e tenha lista própria |
| Não medir nada | você não sabe o que consertar | painel de 5 números (doc 08) |

---

## 5. Oportunidades específicas do Brasil (onde a concorrência é menor)

| Oportunidade | Por quê | Como começar |
|---|---|---|
| **Automação de WhatsApp para PMEs** | é o canal de comunicação do país | n8n + API oficial + RAG (doc 05) |
| **Documentos fiscais brasileiros** (NF-e, NFS-e, boletos, conciliação) | complexidade local afasta gringo | OCR + regras + integração (doc 04) |
| **Pix como produto** (cobrança recorrente, conciliação) | Pix é ubíquo e ainda mal resolvido em PMEs | gateway + automação de conciliação |
| **Português de verdade** (não tradução) | conteúdo e suporte em PT-BR nativo | copy + base de conhecimento próprios |
| **Setores regulados** (saúde, contábil, jurídico, imobiliário) | dor alta, verba definida, pouca oferta boa | vertical + LGPD bem-feita |
| **MEI/pequeno negócio formalizado** | 15+ milhões de CNPJs; ferramentas caras | preço acessível + onboarding simples |
| **Educação e concursos** | volume enorme de conteúdo | IA + comunidade (modelos 9-10) |

**Teste rápido de oportunidade local:** procure no Google `"[tarefa] + planilha"` com `site:.com.br`. Se aparecem fóruns pedindo ajuda e nenhum SaaS nacional bom, é sinal verde.

---

## 6. Regras de benchmark que evitam ilusão

1. **Compare-se com você mesmo há 90 dias**, não com o MRR de quem tem 10 anos de estrada.
2. **Cuidado com "receita" versus "lucro"**: US$ 44 mil/mês bruto pode ser US$ 15 mil de lucro.
3. **Números públicos são marketing**: mesmo quando verdadeiros, mostram o topo da distribuição.
4. **O único benchmark que importa:** você consegue pagar as contas, aprender e continuar?
5. **Use os casos como mapa de estratégia**, nunca como cronograma.

➡️ Próximo: [`12-PROMPTS.md`](12-PROMPTS.md)
