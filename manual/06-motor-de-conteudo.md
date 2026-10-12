# 06 · Motor de conteúdo (a parte que o vídeo-base chama de mais importante)

> O modelo: **1 pilar de conteúdo → 4 canais → 1 ativo próprio → oferta**.
> Benchmarks usados aqui estão no cap. 00 §2. Cadência e formatos abaixo são o que os dados e os
> repositórios mais adotados do GitHub indicam como padrão vencedor em 2026.

---

## 1. Arquitetura do motor

```
                    ┌───────────────────────────┐
                    │   PILAR (1 tema, 1 público)│
                    │  ex.: "home office saudável"│
                    └──────────────┬────────────┘
      ┌───────────────┬───────────┴──────────┬────────────────┐
      ▼               ▼                      ▼                ▼
  SEO + GEO        YOUTUBE              TIKTOK/REELS       PINTEREST
 (dinheiro lento,  (confiança,          (descoberta,        (visual,
  composto)        US$1,48/clique)      compra nativa)      tráfego frio)
      └───────────────┴──────────┬──────────┴────────────────┘
                                 ▼
                    ATIVO PRÓPRIO: site + e-mail/WhatsApp
                    (converte 3,2–8,5% vs 0,3–1,8% do social)
                                 ▼
                     OFERTA (link de afiliado + própria)
```

**Regra do reaproveitamento (1 → 8):** cada peça-mãe gera 8 derivados.

| Peça-mãe | Derivados |
| --- | --- |
| Review em vídeo (10–12 min) | 1 artigo com transcript editado · 3 Shorts/Reels · 2 TikToks · 1 pin/carrossel · 1 e-mail · 1 thread/post · 1 FAQ para schema |

---

## 2. SEO + GEO: dinheiro lento que compõe

### 2.1 O que ainda funciona em SEO para afiliado

| 🟢 Funciona | 🔴 Não funciona mais |
| --- | --- |
| Intenção **comercial/transacional**: "melhor X para Y", "X vs Y", "X vale a pena", "preço X", "cupom X" | "O que é X" informacional em nicho competitivo |
| Cluster topical: 1 money page + 8–15 artigos de suporte interligados | 300 artigos rasos em 20 categorias |
| **Experiência real**: fotos próprias, medidas, testes, tempo de uso, comparação lado a lado | Texto de IA sem dado próprio (alvo de updates de spam) |
| Tabela comparativa + prós/contras + metodologia + FAQ | Review sem nota, sem critério, sem data |
| Velocidade (Core Web Vitals verdes) e mobile-first | Site pesado com 15 scripts de rede |
| Link interno denso e schema `Product`/`Review`/`FAQPage` | Página órfã sem link interno |
| Autoria real (página "sobre", autor, contato, CNPJ/endereço) | Autor inventado, sem foto, sem histórico |

### 2.2 GEO/AEO — ser citado por IA (a fronteira de 2026)

Por que investir: tráfego de IA ainda é 0,5–0,7% da web, mas cresceu ~66% em 2025 e **converte
~1,66% para sign-up contra 0,15% da busca tradicional (≈11x)**. Perplexity responde por 15–20% dos
referrals de IA e **sempre traz citação com link**.

Checklist de citabilidade (baseado nos repositórios `geo-seo-claude` 11.013 ★, `getcito` 485 ★,
`elmo` 438 ★, `aeo.js` 142 ★):

- [ ] **Resposta direta nos primeiros 40–60 palavras** (parágrafo que responde a pergunta sem enrolação).
- [ ] **Tabelas** comparativas (IA extrai tabela melhor que prosa).
- [ ] **Listas numeradas** de critérios e de recomendações ("melhor para X: Y, porque Z").
- [ ] **Números com unidade, data e fonte** ("preço medido em 10/2026: R$ 1.299").
- [ ] **Seção de metodologia** ("como testamos") — aumenta E-E-A-T e citabilidade.
- [ ] **FAQ com perguntas reais** (People Also Ask + perguntas que você faz à IA).
- [ ] **Schema.org**: `Product`, `Review`, `AggregateRating` (só se tiver avaliações reais),
      `FAQPage`, `ItemList`, `Organization` + `Person` (autor).
- [ ] **Entidade consistente**: mesmo nome de marca/autor em site, YouTube, LinkedIn, Wikidata.
- [ ] **Conteúdo original citável**: estatística própria, benchmark, foto original.
- [ ] `llms.txt` / página "para assistentes de IA" com resumo estruturado do que você recomenda.
- [ ] Medir: referrers `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`,
      `claude.ai` separados no analytics (cap. 08).

### 2.3 Estrutura de money page de afiliado (template)

```
H1  Melhor [produto] para [uso/público] em [ano]
    → parágrafo-resposta de 40 palavras (o "TL;DR" que a IA cita)
    → caixa de disclosure ("links de afiliado; ganho comissão sem custo extra")
    → TABELA: 3–5 produtos | nota | melhor para | preço | onde comprar (botão /go/x)
    → COMO TESTAMOS (metodologia, tempo, critérios, fotos)
    → Reviews individuais: prós / contras / para quem é / para quem não é / preço medido
    → Guia de compra (critérios: 5–7 fatores explicados)
    → Comparativo direto (A vs B) — pode ser página separada
    → FAQ (6–10 perguntas com schema)
    → CTA de captura ("receba a tabela atualizada por e-mail")
    → Autor + data da última atualização (visível)
```

Cadência SEO: **2–4 peças/semana** nos primeiros 90 dias; atualização das money pages a cada 90 dias
(preço muda; conteúdo desatualizado perde posição e citação).

---

## 3. YouTube: o canal de maior valor por clique

Números que definem a tática (100+ estatísticas compiladas em 2026):

| Alavanca | Efeito medido |
| --- | --- |
| Valor por clique | **US$ 1,48** (vs US$ 0,97 no Instagram) |
| Receita por 1.000 views | **US$ 4,70** (vs US$ 2,90 no TikTok) |
| Conversão média de link | **3,2%** · review **4,1%** · review de IA/software **4,4%** |
| Link em **comentário fixado** | CTR **6,3%** vs 3,8% na descrição vs 2,1% em end screen (**1,7x**) |
| Menção **verbal nos primeiros 90 s** | **2,2x** mais cliques |
| Link citado nos **primeiros 30 s** | **+62%** de cliques |
| **Timestamps** com link de produto | **+38%** de CTR |
| Combinar comentário fixado + descrição | **+34%** de receita por vídeo |
| **Disclosure verbal** | conversão **4,1%** vs 2,9% sem disclosure |
| Uploads semanais consistentes | **2,3x** mais receita de afiliado que 2 uploads/mês |
| Vídeos > 10 min | US$ 0,014/view vs US$ 0,006 em vídeos < 8 min |
| CTR por duração | 4,6% em vídeos < 12 min vs 2,8% em vídeos > 15 min |
| Review de produto vs conteúdo geral | **+67%** de receita de afiliado |

### Playbook de vídeo de afiliado (10–12 min)

1. **Hook (0–20 s):** resultado ou dor específica + promessa ("testei 5 cadeiras por 60 dias").
2. **Disclosure verbal curto (até 30 s):** "os links são de afiliado, isso apoia o canal e não muda
   seu preço" — converte mais, não menos.
3. **Demo/autoridade (30 s–2 min):** você usando o produto, com medida/erro/problema real.
4. **Estrutura de comparação (2–8 min):** critérios fixos + nota por critério (tabela na tela).
5. **Veredito segmentado (8–10 min):** "para X escolha A; para Y escolha B; não compre C se…".
6. **CTA duplo:** comentário fixado (link `/go/`) + descrição com timestamps linkados + isca de captura.
7. **Descrição:** disclosure no topo, links nos 3 primeiros lugares, timestamps, ferramentas citadas.

Formatos que mais rendem: **comparativo (X vs Y)**, **"melhores X de [ano]"**, **review honesto com
defeitos**, **tutorial que usa o produto**, **"não compre X antes de ver isso"**.
No estudo de conteúdo em alta citado no `Affitor/affiliate-skills`, **45% do conteúdo top era
comparativo** — o formato campeão.

Nicho por receita média mensal (canais que vivem disso): finanças ~US$ 6.300/mês;
home improvement ~US$ 4.700/mês. Canais de review de IA/software convertem 4,4% e ganham ~US$ 8,60
por signup em programas SaaS recorrentes.

---

## 4. TikTok Shop / Shorts / Reels: descoberta + compra nativa

**Dados 2026:** TikTok Shop ~US$ 23,4 bi de GMV nos EUA; conversão média **4,7%** (vs 2–4% do
e-commerce tradicional); Open Collaboration 2–4% e **Targeted 8–12%**; criadores que postam **5+/semana
geram ~3,2x mais GMV**; comissão típica de criador nos EUA ~**13%** (faixa 10–50%); e o **halo**:
conteúdo de TikTok Shop gera **30–50% de receita incremental** em outros canais (Amazon, site próprio,
YouTube). Beleza é 22,5% do GMV; creators de beleza/skincare em Shorts geram 2,3x mais cliques por view.

### Playbook de social commerce

1. **Produto primeiro, roteiro depois:** escolha itens com demo visual em ≤ 10 s
   (transformação, antes/depois, "não sabia que existia").
2. **Hook nos 2 primeiros segundos** com o resultado, não com a marca.
3. **Estrutura:** Hook → Dor → Demo → Resultado → CTA (é o padrão do skill `tiktok-script-writer`).
4. **Link nativo** sempre que existir (TikTok Shop/Shopee); link externo perde 30–50% por atrito.
5. **Cadência 5–7 posts/semana** — consistência > viralização.
6. **Escale só o vencedor:** publique 20–30 orgânicos, identifique os 2–3 com melhor CR/EPC e
   coloque **todo** o orçamento de anúncio (Spark Ads) neles.
7. **Live commerce:** no BR o GMV de lives cresceu 161x em 1 ano e o nº de criadores afiliados ativos
   cresceu 46x (dados TikTok, out/2026). Live semanal com 3–5 produtos + cupom = melhor EPC do nicho.
8. **Captura:** bio → página de captura → e-mail/WhatsApp (transforme aluguel em ativo).

🟡 Regras de elegibilidade BR: 18+, mínimo de seguidores (o piso aparece no app; relatado em 1.000+),
conteúdo original. Comissão definida pelo lojista (faixa típica 8–15%, podendo ir de 5% a 30%).
Detalhes no cap. 09 §tiktok-shop.

---

## 5. Pinterest: tráfego frio que envelhece bem

- Funciona em: casa/decor, organização, receitas, moda, casamento, jardinagem, DIY, finanças pessoais
  ("printables"), viagens.
- Pin é **busca visual**: título e descrição com keyword; 1 pin → 1 URL do seu site (nunca link direto
  de afiliado em rede que proíbe — verifique os termos; na dúvida, mande para seu artigo).
- Cadência: 5–15 pins/dia (a maioria reaproveitada do mesmo artigo em 3–5 artes diferentes).
- Vídeo-pin curto (6–15 s) tem mais alcance que estático em 2026.
- Ferramenta: `templates/pin-map.csv` + gerador de arte (Canva/HTML→PNG com agente).

---

## 6. E-mail / newsletter: o canal que mais converte (3,2–8,5%)

**Estrutura mínima que funciona:**

1. **Isca** ligada ao pilar (tabela comparativa em PDF/Página, checklist, calculadora, cupom exclusivo).
2. **Página de captura** com 1 campo (e-mail) — 1 página por isca, 3–5 iscas por nicho.
3. **Sequência de boas-vindas (5 e-mails em 7 dias):** história/autoridade → melhor conteúdo →
   comparativo → review com oferta → FAQ + escassez legítima.
4. **Newsletter recorrente (1–2x/semana):** 1 recomendação principal + 2–3 links + 1 conteúdo próprio.
   Densidade de link alta **não** derruba conversão se o conteúdo for útil.
5. **Segmentação por clique:** quem clicou em "cadeira" entra no fluxo de cadeira.
6. **Higiene:** double opt-in (LGPD/GDPR), link de descadastro visível, limpeza de inativos a cada 90 dias,
   aquecimento de domínio, SPF/DKIM/DMARC configurados.

Ferramentas citadas no vídeo-base: **Omnisend** (e-commerce) e **Beehiiv** (newsletter). Alternativas:
MailerLite/Brevo (grátis no início), Listmonk (self-hosted, open source), Kit (ConvertKit).
Dataset útil para treinar copy de e-mail: `marketeam/Marketing-Emails` (16,4 mil exemplos).

---

## 7. WhatsApp / Telegram / DM automation (específico do BR e de creator commerce)

- **Grupo/canal de ofertas** (WhatsApp ou Telegram): 1–3 ofertas/dia com contexto ("por que isso é
  bom, para quem é, até quando"). Alto EPC porque é público quente.
- **Comentário → DM (ManyChat e similares):** no Instagram/TikTok, peça "comente QUERO" e envie o link
  por DM. Aumenta CTR e mantém o link fora do alcance do algoritmo (que penaliza link externo).
  🟡 Respeite limite de plataforma e opt-in: envio em massa não solicitado viola ToS e LGPD.
- **Status/Stories com link:** para produto de decisão rápida (deal, cupom).
- **Comunidade paga/free tier:** embrião de oferta própria (cap. 12).

---

## 8. Calendário de 90 dias (cadência mínima sustentável — 8 a 12 h/semana)

| Semana | SEO/site | YouTube | TikTok/Shorts | Lista | Meta |
| --- | --- | --- | --- | --- | --- |
| 1 | Pilar + 3 artigos | 1 review | 3 cortes | Isca + página | Primeira comissão |
| 2 | +2 artigos, 1 comparativo | 1 comparativo | 3 cortes | Sequência 5 e-mails | EPC medido |
| 3 | +2 artigos | 1 tutorial | 4 cortes | Newsletter 1x/sem | 100 contatos |
| 4 | Atualizar money page | 1 "melhores X" | 4 cortes | Segmentar por clique | Relatório mensal |
| 5–8 | 8 artigos + 2 comparativos | 4 vídeos | 16 cortes | 4 newsletters | 1.000 visitas/mês |
| 9–12 | 8 artigos + GEO/schema | 4 vídeos + 1 live | 16 cortes + 1 live/semana | 300–500 contatos | R$ 1–5 mil/mês |

**Regra de corte:** se em 90 dias uma peça não gerou ≥ 30 cliques, reescreva título/intenção ou
substitua. Não acumule conteúdo morto.

---

## 9. Uso de IA no motor (prompts que funcionam)

Use os blocos abaixo com seu modelo preferido (cap. 02). **Nunca** publique sem gate de fatos.

```
[OUTLINE COMPARATIVO]
Você é editor de conteúdo de afiliado. Crie o outline de "Melhor {produto} para {público} em {ano}".
Regras: 5 critérios de avaliação com peso; 4 produtos; para cada um: prós, contras, para quem é,
para quem não é; seção "como testamos"; FAQ com 8 perguntas reais; TL;DR de 40 palavras no topo.
Não invente preço, spec ou resultado de teste: marque [VERIFICAR] onde faltar dado.

[GEO/CITABILIDADE]
Reescreva o trecho abaixo para ser citável por assistentes de IA: resposta direta em 1 frase,
depois 3 bullets com número+unidade+data, depois tabela comparativa. Mantenha linguagem neutra.

[MINERAÇÃO DE DOR]
Aqui estão 40 comentários/reviews de clientes do produto {X}. Liste: 10 dores recorrentes com
frequência, 5 objeções de compra, 5 comparações espontâneas com concorrentes, 3 ângulos de
conteúdo inéditos que ninguém está cobrindo.

[TÍTULO/HOOK]
Gere 12 títulos para "{tema}" em 4 estilos: (a) resultado+número, (b) erro a evitar,
(c) comparativo, (d) pergunta do público. Sem clickbait falso, sem promessa de resultado financeiro.

[SCRIPT TIKTOK 30s]
Estrutura Hook(2s) → Dor(5s) → Demo(12s) → Resultado(6s) → CTA(5s). Inclua fala e indicação de corte.
```

**Gate de qualidade (5 pontos, obrigatório antes de publicar):**
1. Fatos verificados (preço, spec, taxa, data) · 2. Links testados em aba anônima ·
3. Disclosure presente e visível · 4. Há dado/experiência original · 5. Leitura humana em voz alta.
