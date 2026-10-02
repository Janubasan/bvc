# 13 — Atlas de 50 Micro-SaaS Viáveis

> 50 ideias com dor real, cliente que paga, preço sugerido, canal e stack. **Nenhuma é "original"** — isso é uma vantagem: mercado existe, você só precisa executar melhor em um nicho. Escolha 1, valide (doc 02) e ignore as outras 49.

---

## Como escolher (pontue de 0 a 3 em cada critério)

| Critério | Pergunta |
|---|---|
| Acesso | Consigo falar com 30 desses clientes esta semana? |
| Dor | Eles já pagam (ou perdem) dinheiro por isso hoje? |
| Simplicidade | Dá para entregar o primeiro valor em menos de 5 minutos? |
| Recorrência | O problema acontece todo mês? |
| Repetição | O fluxo é o mesmo para todos os clientes do nicho? |
| Seu interesse | Você aguenta falar disso por 2 anos? |

**Some 12+ pontos → comece.** Menos que isso → próximo da lista.

---

## 1. Saúde e clínicas

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 1 | Agenda inteligente com confirmação por WhatsApp | Clínicas pequenas | faltas e remarcações manuais | R$ 297-697 | grupos de gestores, indicação | n8n + `cal.diy` + WhatsApp API |
| 2 | Prontuário/evolução por voz | Fisioterapeutas, psicólogos | escrever evolução consome a sessão | R$ 197-497 | Instagram do nicho, conselhos regionais | Whisper + LLM + Qwen3 (doc 04) |
| 3 | Leitor de laudos e exames → resumo para o paciente | Clínicas de imagem | explicar laudo consome tempo | R$ 297-997 | parcerias com laboratórios | Qwen3-VL + templates |
| 4 | Faturamento de convênios (conferência de guias) | Clínicas médias | glosas e erros de cobrança | R$ 697-2.497 | contadores do setor | OCR + regras + n8n |
| 5 | Follow-up pós-consulta automatizado | Dentistas, dermatologistas | paciente some depois do procedimento | R$ 197-597 | Instagram + indicação | n8n + Chatwoot/Novu |

## 2. Jurídico e contábil

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 6 | Prazos e acompanhamento processual no WhatsApp | Advogados solo | perder prazo = catástrofe | R$ 197-697 | grupos de OAB, LinkedIn | crawler + `listmonk`/Novu |
| 7 | Geração de contratos a partir de respostas | Pequenos escritórios | redigir peça/contrato repetitivo | R$ 297-997 | LinkedIn, indicação | LLM + templates + `documenso` |
| 8 | Organização de documentos do cliente (due diligence) | Escritórios e contadores | 300 PDFs bagunçados | R$ 497-1.997 | parceria com contadores | `docling`/`MinerU` + RAG |
| 9 | Conciliação e fechamento mensal para escritórios | Contabilidades | fechar no prazo com equipe enxuta | R$ 697-2.997 | associações contábeis | n8n + planilhas + LLM |
| 10 | Resumo de mudanças legislativas do nicho | Escritórios especializados | acompanhar diário oficial | R$ 297-997 | LinkedIn/newsletter | Huginn/crawl4ai + LLM |

## 3. Comércio local e e-commerce

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 11 | Fotos de produto com IA (fundo, modelo, variações) | Lojas online pequenas | ensaio fotográfico caro | R$ 197-697 | Instagram, Shopify BR | Z-Image/SDXL + ComfyUI |
| 12 | Geração de descrições e fichas técnicas | Vendedores de marketplace | 200 produtos para cadastrar | R$ 197-597 | grupos de sellers | LLM + planilha/`teable` |
| 13 | Provador virtual | Lojas de moda | devolução por tamanho/expectativa | R$ 497-1.997 | agências de moda | Kolors-Virtual-Try-On (HF) |
| 14 | Atendimento e pós-venda automatizado | Comércios locais | WhatsApp lotado | R$ 297-997 | associações comerciais | n8n + RAG + Chatwoot |
| 15 | Relatório de vendas multi-canal | Quem vende em 3+ canais | planilhas desencontradas | R$ 297-897 | grupos, consultores | airbyte/API + Metabase |

## 4. Imobiliário e construção

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 16 | Anúncio com fotos tratadas + texto padrão | Corretores autônomos | cada anúncio consome 1h | R$ 147-497 | imobiliárias, Instagram | rembg/GFPGAN + LLM |
| 17 | Qualificação de leads por WhatsApp | Imobiliárias | corretor perde tempo com curioso | R$ 497-1.497 | CRECI, grupos | n8n + LLM + CRM (`twenty`) |
| 18 | Orçamento de obra a partir de planta/quantitativos | Construtoras pequenas | orçamento lento e impreciso | R$ 697-2.997 | engenheiros civis | Qwen3-VL + regras + planilha |
| 19 | Vistoria com checklist + laudo automático | Imobiliárias, síndicos | laudo manual de 2h | R$ 297-997 | sindicatos, grupos | app + LLM + PDF (`gotenberg`) |
| 20 | Controle de manutenção predial com alertas | Administradoras de imóveis | manutenção reativa | R$ 497-1.497 | LinkedIn, associações | n8n + dashboard |

## 5. Educação e criadores

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 21 | Correção de redações com rubrica | Cursinhos, professores | corrigir 200 redações | R$ 297-1.497 | escolas, professores influencers | LLM + rubrica + Langfuse |
| 22 | Aulas viram materiais (transcrição + resumo + quiz) | Professores, infoprodutores | reaproveitar conteúdo | R$ 197-597 | YouTube/Instagram educadores | Whisper + LLM |
| 23 | Narração e dublagem de aulas | Criadores de curso | gravar é cansativo | R$ 197-697 | plataformas de curso | Kokoro/Chatterbox + FFmpeg |
| 24 | Comunidade + trilha de estudo automatizada | Professores independentes | engajamento baixo | R$ 297-997 (+% da receita) | Discord/grupos | Discourse/Answer + n8n |
| 25 | Banco de questões gerado a partir do material | Concursos, escolas | criar questões demora | R$ 297-997 | grupos de concurseiros | LLM + embeddings + revisão |

## 6. Indústria, logística e agro

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 26 | Previsão de demanda para pequeno varejo/indústria | Donos de operação | falta/sobra de estoque | R$ 497-2.497 | consultores, SEBRAE | chronos-2 (HF) + dashboard |
| 27 | Leitura de documentos fiscais/romaneio | Transportadoras | digitação de centenas de docs | R$ 697-2.997 | associações de transporte | OCR + Qwen3-VL |
| 28 | Ocorrências e manutenção de frota por WhatsApp | Frotas pequenas | controle em caderno | R$ 297-997 | grupos de frotistas | n8n + bot + planilha/DB |
| 29 | Relatórios técnicos de campo por voz | Agrônomos, técnicos | escrever relatório no fim do dia | R$ 297-997 | cooperativas | Whisper + LLM + PDF |
| 30 | Monitor de preços de insumos para compradores | Cooperativas, agroindústria | comprar no pior preço | R$ 497-1.997 | LinkedIn, feiras | crawlers + LLM + Metabase |

## 7. Agências, marketing e freelancers

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 31 | Relatório de resultado com marca da agência | Agências pequenas | 3h por cliente/mês | R$ 297-997 (ou white-label 1.997) | LinkedIn, grupos de agências | APIs + `gotenberg` + white-label |
| 32 | Fábrica de criativos em lote | Social medias | 30 peças/mês no manual | R$ 497-1.997 | Instagram, X | ComfyUI + LTX/MiniMax + Remotion |
| 33 | Briefing → conteúdo aprovado (workflow) | Agências de conteúdo | vai e volta de aprovação | R$ 297-997 | grupos de marketing | n8n + LLM + Notion/Teable |
| 34 | SEO programático em escala | Afiliados, agências de SEO | centenas de páginas | R$ 497-2.497 | comunidades de SEO | LLM + sites estáticos |
| 35 | Cubo de métricas multi-cliente | Gestores de tráfego | 10 dashboards manuais | R$ 497-1.497 | grupos, LinkedIn | APIs + Metabase/Superset |

## 8. RH, recrutamento e treinamento

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 36 | Triagem de currículos com critérios | PMEs contratando | 400 currículos, 3 vagas | R$ 297-997 | LinkedIn, grupos de RH | embeddings + LLM |
| 37 | Onboarding de funcionário (trilha + documentos) | PMEs com rotatividade | repetir o mesmo treinamento | R$ 297-997 | consultorias de RH | n8n + vídeo/docs |
| 38 | Pesquisa de clima automatizada e análise | Empresas de 30-300 pessoas | medir engajamento custa caro | R$ 397-1.497 | LinkedIn RH | formbricks + LLM + Metabase |
| 39 | Descrição de vaga + plano de entrevista | Startups pequenas | contratar mal custa caro | R$ 197-697 | comunidades de founders | LLM + templates |
| 40 | Biblioteca de treinamento sob demanda (RAG interno) | Indústrias, redes | conhecimento preso em pessoas | R$ 997-4.997 | diretores de operação | RAG + Open WebUI/LibreChat |

## 9. Finanças das PMEs

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 41 | Cobrança recorrente + recuperação de inadimplentes | Prestadores de serviço | receber é mais difícil que vender | R$ 197-997 | contadores, grupos | gateway + n8n + dunning |
| 42 | Fluxo de caixa preditivo | PMEs | decidir no escuro | R$ 297-997 | contadores | chronos-2 + Metabase |
| 43 | Conciliação bancária automática | Contabilidades e PMEs | horas conferindo extrato | R$ 397-1.497 | contadores | open finance/OFX + LLM |
| 44 | Precificação por margem real | Comércio e indústria | vender no prejuízo sem saber | R$ 297-997 | SEBRAE, consultores | planilha + LLM + SaaS |
| 45 | Compras e cotação com 3 fornecedores automatizada | PMEs com compras recorrentes | cotação por telefone | R$ 397-1.497 | grupos de compras | n8n + e-mail + LLM |

## 10. Nichos computacionais (dev, dados, mídia)

| # | Micro-SaaS | Quem paga | Dor | Preço/mês | Canal | Stack |
|---|---|---|---|---|---|---|
| 46 | OCR de documentos brasileiros como API | Devs e ERPs | construir OCR é caro | US$ 29-299 | GitHub, HN, X | PaddleOCR/marker + vLLM |
| 47 | Transcrição + ata + ação para equipes | Agências, consultorias | reuniões sem registro | R$ 197-697 | LinkedIn, X | Whisper + pyannote + LLM |
| 48 | Monitor de mudanças em sites/concorrentes | Jurídico, e-commerce | descobrir mudança tarde | R$ 297-1.497 | LinkedIn, comunidades | crawl4ai/Steel + LLM + alertas |
| 49 | Ambiente de agente de código hospedado | Devs/pequenos times | rodar agente com segurança | US$ 19-99 | GitHub, X, HN | e2b/E2B + opencode/cline |
| 50 | Metadados e organização de acervo de mídia | Produtoras, editoras | achar arquivo perdido | R$ 297-1.497 | associações do setor | CLIP + bge-m3 + Qdrant |

---

## Como gerar mais 100 ideias (fórmula)

```
[TAREFA REPETIDA] × [SETOR] × [DOCUMENTO OU CANAL] = ideia

Tarefas: agendar, cobrar, responder, resumir, extrair, classificar, traduzir, revisar, publicar, monitorar, orçar, conciliar.
Setores: os 40+ do doc 06 (r/[nicho]) + os do seu bairro/cidade.
Documentos/canais: WhatsApp, e-mail, PDF, planilha, áudio, foto, XML fiscal, site, portal do governo.

Exemplo: "conciliação (tarefa) para clínicas de odontologia (setor) de extratos de convênio (documento)".
```

**Depois de gerar 100:** aplique a rubrica de 6 critérios, escolha as 3 melhores e valide cada uma com **3 conversas** na mesma semana. Fique com a que gerar sinal de dinheiro.

➡️ Próximo: [`14-ANTI-BURRO.md`](14-ANTI-BURRO.md)
