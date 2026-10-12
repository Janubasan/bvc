# 00 · O que realmente funciona em affiliate marketing (pesquisa 2025–2026)

> Objetivo deste capítulo: **matar a fantasia e instalar o modelo mental correto** antes de você
> gastar um real ou uma hora. Tudo aqui vem de dados públicos coletados em 12/10/2026
> (GitHub API, Hugging Face, relatórios setoriais e benchmarks de canais). Fontes no capítulo 16.

---

## 1. O tamanho do jogo (para você saber onde está se metendo)

| Indicador | Valor | Fonte/ano |
| --- | --- | --- |
| Gasto global com afiliados (footprint do canal) | ~US$ 19,4 bi, +13,5% a/a | relatórios setoriais 2026 |
| Gasto de anunciantes nos EUA | ~US$ 13,8 bi previstos em 2026 (~US$ 12 bi em 2025, +12%) | 2026 |
| Vendas de e-commerce atribuídas a afiliados nos EUA | ~US$ 241 bi | 2026 |
| Participação de criadores no spend de afiliados | 24% em 2026 (era 11% em 2022), +47% a/a | 2026 |
| Conteúdo de comércio (roundups, guias de presente, deals) | +34% a/a; já é 28% da receita de afiliados | 2026 |
| Vídeo "shoppable" (TikTok Shop, YouTube Shopping, IG Shopping) | +71% a/a; ~US$ 4,8 bi em 2026 → projeção US$ 7,4 bi em 2027 | 2026 |
| TikTok Shop (receita atribuída a afiliados) | ~US$ 2,1 bi, +89% a/a | 2026 |
| YouTube Shopping (receita atribuída) | ~US$ 1,6 bi, +54% a/a | 2026 |

**Leitura prática:** o canal não está morrendo — está **migrando de banner/link solto para conteúdo
comercial e vídeo comprável**. Quem entra em 2026 entrando por "blog genérico + link da Amazon"
está competindo no segmento que mais perdeu valor.

---

## 2. Benchmarks de conversão por canal (o número que decide seu nicho)

| Canal | Conversão típica | Observação operacional |
| --- | --- | --- |
| **E-mail / lista própria (morna)** | **3,2% – 8,5%** | O canal que mais converte. É o ativo que ninguém pode desligar. |
| **TikTok Shop (nativo, compra dentro do app)** | **3% – 8%** (média 4,7%) | Alvo (Targeted Collab) chega a 8–12%. Sem atrito de sair do app. |
| **Paid search (Google Ads)** | 2,1% – 5,8% | CPC médio ~US$ 4,22 → só fecha conta com oferta de ticket/CPA alto. |
| **YouTube (link de afiliado)** | 1,4% – 3,6% (média 3,2%; review 4,1%; review de IA/software 4,4%) | Maior valor por clique: ~US$ 1,48/clique e ~US$ 4,70 por 1.000 views. |
| **SEO orgânico (conteúdo comercial)** | 3% – 5% em review/comparação; média geral do canal 0,5% – 1% | Consulta transacional/comparativa converte até 5x mais que informacional. |
| **Orgânico social "puro" (IG, Facebook)** | 0,3% – 1,8% | Instagram rende ~US$ 0,97/clique vs US$ 1,48 do YouTube. |
| **Tráfego vindo de IA (ChatGPT, Perplexity, AI Overviews)** | ~1,66% para sign-up vs 0,15% da busca tradicional (**≈11x**) | Volume pequeno (0,5%–0,7% da web, +66% em 2025) e crescendo rápido. |

**Leitura prática:** você não escolhe "canal", escolhe **combinação**: conteúdo que atrai (SEO/YouTube/
TikTok) → ativo que retém (e-mail/WhatsApp/comunidade) → oferta que paga (EPC alto).
Quem tem 3+ canais tem ~4x mais chance de manter a renda depois de um update de algoritmo.

---

## 3. A métrica única: EPC (e por que "comissão de 80%" é propaganda)

`EPC = receita de comissão ÷ cliques enviados`

Comparação clássica que aparece em todo material sério:

| Oferta | Comissão | Preço | CR | EPC |
| --- | --- | --- | --- | --- |
| E-book barato | 50% | US$ 20 | 0,5% | **US$ 0,05** |
| Produto físico premium | 10% | US$ 500 | 2,0% | **US$ 1,00** |

Mesmo tráfego, **20x mais receita** na oferta de "comissão baixa". E no mundo real ainda entram:
cookie (24 h vs 180 dias), recorrência (SaaS 20–30% recorrente), ticket médio, taxa de reembolso/
chargeback e **incrementalidade** (parte das vendas teria acontecido sem você — ver §5).

Use `ferramentas/afiliado.py ofertas --csv templates/planilha-ofertas.csv`: ele calcula
**EPC esperado** e **Affiliate Score** (0–100) para cada oferta e ordena o ranking.

---

## 4. O que mudou em 2025–2026 (e como se posicionar)

1. **IA generativa virou padrão de produção:** ~80% dos afiliados já usam IA para conteúdo
   (≈96% entre criadores). O diferencial deixou de ser "escrever" e passou a ser **dados próprios,
   teste real de produto e distribuição**.
2. **GEO/AEO (otimização para motores de IA) saiu do nicho:** no GitHub, os repositórios de
   SEO/GEO para agentes explodiram — `marketingskills` (54,3 mil ★), `claude-seo` (18,8 mil ★),
   `geo-seo-claude` (11 mil ★), `open-seo-mcp-skills` (5,1 mil ★), `getcito` (485 ★), `elmo` (438 ★).
   Sinal claro: conteúdo precisa ser **citável** (tabelas, metodologia, prós/contras, dados originais,
   schema) para ser recomendado por ChatGPT/Perplexity/AI Overviews.
3. **Vídeo comprável é o formato que mais cresce:** TikTok Shop converte ~4,7% e ainda gera
   **30–50% de receita incremental em outros canais** (halo: sobe busca pela marca, tráfego do site,
   views no YouTube). Quem posta 5+ vezes/semana vê ~3,2x mais GMV do que quem posta 2x.
4. **Amazon cortou o "halo":** a atualização de políticas de abril/2026 reduziu a comissão sobre itens
   não linkados para ~1–2% (antes 3–4% em várias categorias) e mexeu na janela de qualificação.
   Ou seja: o modelo "linkar qualquer coisa e ganhar pelo carrinho inteiro" ficou mais fraco.
5. **Cookies curtos punem o afiliado de topo de funil:** Amazon BR/US e Mercado Livre operam com
   sessão de ~24 h; Shopee 7 dias; Hotmart 60–180 dias (configurável pelo produtor). Estratégia:
   **capturar o clique o mais perto possível da decisão de compra** (comparativos, "melhor X para Y",
   cupom/checkout) e **construir lista** para reativar.
6. **Compliance virou métrica de performance, não custo:** disclosure verbal no YouTube converte
   4,1% vs 2,9% sem disclosure; 39% dos espectadores confiam mais quando há transparência;
   só 32% dos criadores têm disclosure compatível com a FTC e 3,1% dos vídeos monetizados com link
   de afiliado foram sinalizados/desmonetizados por disclosure ausente ou obscuro.
7. **Incrementalidade virou moeda de negociação:** testes de holdout mostram que 18–24% das
   conversões atribuídas **não são incrementais**. Conteúdo editorial (78%) e criador (82%) são os
   mais incrementais; cupom/cashback (29–34%) e brand bidding (21%) são os menos — e é por isso que
   anunciantes estão cortando esses parceiros. Fique do lado incremental da mesa.

---

## 5. Tabela de incrementalidade (qual tipo de afiliado o mercado quer pagar)

| Tipo de parceiro | Incrementalidade | Não incremental | O que o anunciante faz |
| --- | --- | --- | --- |
| Criador / influenciador | 82% | 18% | Expande |
| Conteúdo editorial (review, comparativo) | 78% | 22% | Mantém/expande |
| E-mail / newsletter | 71% | 29% | Mantém |
| Sub-redes de afiliados | 55% | 45% | Audita e poda |
| Cashback / fidelidade | 34% | 66% | Renegocia ou limita |
| Cupom / deals | 29% | 71% | Renegocia ou descredita |
| Afiliado de brand keyword (busca paga no nome da marca) | 21% | 79% | Restringe ou pausa |

**Conclusão estratégica:** construa **conteúdo + criador + lista própria**. É o tripé que o mercado
paga melhor, é o mais resistente a updates e é o que menos risco jurídico/ético carrega.

---

## 6. Expectativa de receita honesta

Do criador do vídeo-base (10+ anos de negócio, marcas que faturam milhões):

- Ano 1 dele, postando 3x/semana no YouTube: **US$ 2–3 mil no ano inteiro**.
- Marcas novas que ele lança hoje: **alguns milhares de dólares por mês no primeiro ano**;
  depois US$ 20–30 mil/mês; teto real de US$ 20–30 **milhões/ano** para operações maduras
  (com sorte, skill e muito tempo).
- Meta realista sugerida por ele: **US$ 1.000/mês no mês 6**.
- Ele é explícito: "muita gente tenta e falha; você provavelmente não vai fazer US$ 10 milhões
  no ano que vem".

Curva típica de um site de conteúdo novo (relatos agregados de Amazon Associates):

| Período | Esforço | Receita típica |
| --- | --- | --- |
| Mês 1–3 | 10–20 artigos/pilotos, base técnica | US$ 0–20 |
| Mês 4–6 | Primeiros rankings, primeiras comissões | US$ 50–200/mês |
| Mês 6–12 | Tráfego compõe | US$ 200–800/mês |
| Ano 2 | 50+ peças, autoridade topical | US$ 800–3.000/mês |

🔴 **Fuga imediata de:** "R$ 100/dia no primeiro mês sem aparecer", "método secreto",
"robô de vendas", grupos de "compra de curso com reembolso". O custo desses atalhos é conta
banida, domínio queimado e, no limite, processo (ver capítulo 14).

---

## 7. As 10 leis do afiliado (memorize)

1. **EPC > comissão.** Sempre compare por clique enviado, nunca por percentual anunciado.
2. **Intenção > volume.** 1.000 visitas de "melhor X para Y" valem mais que 50.000 de "o que é X".
3. **Você precisa de um ativo próprio.** Site + lista de e-mail/WhatsApp. Aluguel de audiência
   (algoritmo) pode sumir num update.
4. **Um nicho, um público, 12 meses.** Trocar de nicho a cada 6 semanas é a causa nº 1 de fracasso.
5. **Teste o produto.** Conteúdo com experiência real é o que ranqueia, é o que a IA cita e é o
   único que sobrevive à regra de reviews falsos (FTC, em vigor desde o fim de 2024).
6. **Disclosure é alavanca de conversão.** Diga que é link de afiliado, no início, em linguagem clara.
7. **Diversifique 3 canais e 3 ofertas.** Nenhuma plataforma pode ser 100% da sua renda.
8. **Meça por clique, não por like.** UTM + painel + relatório semanal (capítulo 08).
9. **Escale o que já converte.** Não invente: dobre a aposta nas 2–3 peças vencedoras.
10. **Formalize cedo.** PJ/LLC, contabilidade, contrato de uso de imagem/marca, seguro de domínio.
    Barato no início, caro depois.

---

## 8. Checklist rápido de decisão (antes de começar)

- [ ] Tenho um nicho onde tenho conhecimento **e** interesse para 12 meses? (cap. 05)
- [ ] Existe oferta com **EPC esperado ≥ US$ 0,30 / R$ 1,50** nesse nicho? (cap. 04/05)
- [ ] Escolhi **1 canal primário + 1 ativo de retenção** (ex.: YouTube + e-mail)? (cap. 06)
- [ ] Tenho R$/US$ 100–300/mês de custo operacional e 6 meses de runway? (cap. 15)
- [ ] Sei como vou **provar** que o conteúdo é experiência real (fotos, testes, dados)? (cap. 06/14)
- [ ] Sei qual regime fiscal usarei a partir do primeiro R$ 2 mil/mês? (cap. 09 §impostos / cap. 10 §impostos)
- [ ] Li o capítulo 14 e sei o que **não** fazer (cloaking malicioso, brand bidding, reviews falsos)?

🟢 Se marcou 6 ou mais: vá para o **capítulo 11 (Roadmap 90 dias)**.

---

### Fontes deste capítulo (resumo)

Benchmarks de canal e conversão: compilações setoriais 2026 (2POINT Agency, SoloAdsGuide,
DigitalApplied "130+ data points", Analyze AI, PostAffiliatePro, Zebracat "100+ YouTube affiliate
statistics", ShortFormNation "TikTok Shop 2026", Hamster Garage, EarnifyHub). Políticas Amazon:
atualização de abril/2026 (Affiliyo, EcomChief, EarnifyHub). Dados do vídeo-base: transcript
Santrel Media (24/07/2026). Links completos em [16-fontes-e-referencias](16-fontes-e-referencias.md).
