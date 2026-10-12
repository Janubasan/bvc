# 08 · Rastreamento, dados e decisão

> Sem medição própria você não sabe seu EPC real, não consegue negociar taxa (cap. 05 §5) e não sabe
> o que escalar (cap. 12). Este capítulo monta o sistema mínimo em 1 dia de trabalho.

---

## 1. Os 4 níveis de medição

| Nível | O que mede | Ferramenta |
| --- | --- | --- |
| **1. Audiência** | visitas, views, origem, dispositivo | Plausible/Matomo/GA4, YouTube Studio, TikTok Analytics |
| **2. Clique** | cliques em `/go/`, por slug e sub-id, referrer, geo | seu redirect com log (cap. 07 §4) |
| **3. Conversão** | vendas/leads atribuídos, receita, EPC | painel da rede + **postback S2S** |
| **4. Econômico** | custo (ferramentas, anúncios, imposto) × receita líquida | planilha/Dashboard (cap. 04) |

**Regra:** o nível 2 é seu (independe de cookie da rede). O nível 3 vem da rede; reconcilie os dois
todo mês (SOP-A5).

---

## 2. Padrão de UTM (nomenclatura única, sem exceção)

```
utm_source   = plataforma            (youtube | google | tiktok | instagram | pinterest | email | whatsapp | chatgpt | perplexity)
utm_medium   = tipo                  (organic | paid | social | email | referral | ai)
utm_campaign = campanha/tema         (bf2026 | review-cadeira-x | newsletter-42)
utm_content  = peça/posição          (video-12min-desc | video-12min-pinned | art-tbl-top | story-3)
utm_term     = palavra-chave (paga)  (melhor+cadeira+ergonomica)
```

Exemplo gerado pela CLI:

```bash
python3 ferramentas/afiliado.py utm \
  --destino "https://meusite.com.br/review/cadeira-x" \
  --source youtube --medium organic --campaign review-cadeira-x \
  --content video-12min-pinned
```

**Sub-id no link de afiliado:** toda rede permite um parâmetro próprio (`subid`, `aff_sub`, `clickref`,
`tag`, `sid`). Use o **mesmo valor** do `utm_content` para casar clique ↔ venda:

```
/go/cadeira-x?sid=yt-pinned-042  →  https://loja.com/?tag=meusite-20&subid=yt-pinned-042
```

Assim, quando a rede reportar a venda com `subid=yt-pinned-042`, você sabe **exatamente** qual vídeo e
qual posição gerou.

---

## 3. Postback S2S (server-to-server) — o padrão pós-cookie

Fluxo:

```
usuário clica /go/x  →  seu servidor grava click_id (uuid) + meta (referrer, geo, device, sid)
                     →  redireciona para a oferta com subid=click_id
rede registra clique e, na conversão, chama seu endpoint:
   POST https://seusite.com/postback?click_id=...&payout=...&status=approved
                     →  você grava a conversão e calcula EPC por peça/canal
```

- Base pronta para estudar: `UjjwalSaini07/Affiliate-Postback-Engine` (12 ★, Next.js + Express +
  PostgreSQL) e `35sonu/affiliate-postback-system` (Node + Next).
- Trackers comerciais de mídia paga (Voluum, Keitaro, Binom, RedTrack) fazem isso nativamente;
  para controlar por agente, existem `iso73-ops/claude-keitaro` (25 ★) e `KeitaroManager/keitaro-mcp`.
- Sem postback disponível (Amazon, Shopee etc.): reconcile manualmente exportando o relatório de
  ordens (que traz seu `tag`/`subid`) e juntando com seu log de cliques.

**Schema mínimo de banco (2 tabelas):**

```sql
CREATE TABLE clicks (
  click_id   TEXT PRIMARY KEY,
  slug       TEXT NOT NULL,          -- /go/cadeira-x
  sid        TEXT,                   -- posição/peça
  program    TEXT,                   -- amazon-br, hotmart, impact:stripe
  referrer   TEXT,
  source     TEXT, medium TEXT, campaign TEXT, content TEXT,
  country    TEXT, device TEXT,
  ts         TIMESTAMP DEFAULT now()
);
CREATE TABLE conversions (
  click_id   TEXT REFERENCES clicks(click_id),
  order_id   TEXT, payout NUMERIC, currency TEXT,
  status     TEXT,                   -- pending | approved | reversed
  ts         TIMESTAMP DEFAULT now()
);
```

Consulta que responde 90% das perguntas:

```sql
SELECT c.source, c.campaign,
       count(DISTINCT c.click_id)                AS clicks,
       count(v.click_id)                          AS conversions,
       round(count(v.click_id)::numeric / nullif(count(DISTINCT c.click_id),0), 4) AS cr,
       coalesce(sum(v.payout), 0)                 AS receita,
       round(coalesce(sum(v.payout),0) / nullif(count(DISTINCT c.click_id),0), 2) AS epc
FROM clicks c LEFT JOIN conversions v USING (click_id)
WHERE c.ts > now() - interval '30 days'
GROUP BY 1,2 ORDER BY epc DESC;
```

---

## 4. Analytics: qual usar

| Opção | Custo | Prós | Contras |
| --- | --- | --- | --- |
| **Plausible** (29.377 ★, self-host ou cloud) | grátis self-host / US$ 9+ cloud | Sem cookie, leve, LGPD/GDPR simples, API | Menos granular que GA4 |
| **Matomo** (21.949 ★) | grátis self-host | Completo (tag manager, heatmap), on-premise | Mais pesado de manter |
| **GA4 + Consent Mode v2** | grátis | Integra com Google Ads/Search Console | Cookie, configuração chata, amostragem |
| **Cloudflare Web Analytics** | grátis | Zero script pesado | Métricas básicas |
| **YouTube Studio / TikTok Analytics / Pinterest** | grátis | Métricas nativas de retenção/CTR | Não vê clique de afiliado |

🟢 Combinação recomendada: **Plausible (ou Matomo) + evento de clique em `/go/` + painel da rede +
Search Console**. GA4 só se você vai rodar Google Ads.

**Evento essencial:** `affiliate_click` com propriedades `slug`, `sid`, `program`. Sem ele, você mede
visita mas não clique.

---

## 5. Dashboard semanal (o que olhar toda segunda-feira, 20 min)

| Bloco | Métricas | Decisão que sai daí |
| --- | --- | --- |
| Tráfego | visitas por canal, novas vs recorrentes, top 10 páginas | Onde dobrar conteúdo |
| Clique | cliques `/go/`, CTR por página (cliques ÷ visitas) | Reescrever CTA/tabela onde CTR < 2% |
| Receita | comissão por programa, EPC por canal, AOV | Trocar oferta com EPC baixo |
| Conversão | CR por oferta, reversals/chargebacks | Cortar oferta com reversal > 10% |
| IA/GEO | visitas de `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot` | Priorizar citabilidade |
| Lista | novos contatos, taxa de abertura, receita por e-mail enviado | Ajustar isca/cadência |
| Custo | ferramentas, anúncios, impostos → **lucro líquido** | Cortar ferramenta sem uso |

Modelos: `templates/kpi-semanal.csv`, `templates/relatorio-mensal.md`.
Comando: `python3 ferramentas/afiliado.py kpi --csv templates/kpi-semanal.csv`

---

## 6. Testes que realmente movem receita (ordem de impacto)

1. **Posição do link** (tabela no topo vs CTA no fim vs comentário fixado no YouTube): diferenças de
   1,7x–2,2x medidas em vídeo (cap. 06 §3). Teste primeiro — é grátis.
2. **Troca de oferta** na mesma página (A/B por período ou por slug `/go/x-a` e `/go/x-b`).
3. **Título/intenção** da money page ("melhor X para Y" vs "X: guia completo").
4. **Isca de captura** (tabela em PDF vs calculadora vs cupom exclusivo).
5. **Preço/ângulo do criativo** em anúncio (só depois de ter EPC orgânico conhecido).
6. **Disclosure**: mantenha sempre — além de obrigatório, mediu-se **mais** conversão com disclosure
   verbal (4,1% vs 2,9%).

**Como testar sem ferramenta cara:** divida por slug/sub-id e alterne por semana (ou 50/50 com
Cloudflare Workers/A-B do seu CMS). Anote no `templates/testes-ab.csv`: hipótese, variável, período,
amostra mínima (≥ 300 cliques por variação), resultado, decisão.

⚠️ Com menos de ~300 cliques por variação você está lendo ruído. Não mude nada baseado em 20 cliques.

---

## 7. Reconciliação e antifraude (protegendo sua conta)

- Compare mensalmente: **seus cliques** vs **cliques reportados pela rede** vs **vendas aprovadas**.
  Divergência > 15% → abra ticket com a rede.
- Nunca compre tráfego "barato" de origem desconhecida: **invalid traffic** derruba sua conta
  (o setor reportou redução de ~31% de tráfego inválido a/a justamente porque redes apertaram).
- Não faça brand bidding (anunciar no nome da marca) se o programa proíbe — é a causa nº 1 de
  comissão revertida e expulsão.
- Não incentive clique ("clique aqui para me ajudar") nem use popup/redirect forçado.
- Mantenha **prints/PDF** dos relatórios mensais (prova em disputa e para declaração fiscal).

---

## 8. Privacidade de dados pessoais (o mínimo que você precisa fazer)

| Obrigação | Como cumprir |
| --- | --- |
| Base legal para cookie/marketing | Banner de consentimento com recusa equivalente à aceitação |
| Transparência | Política de privacidade listando: dados coletados, finalidade, terceiros (redes, analytics), prazo |
| Direitos do titular | Canal para acessar/corrigir/excluir (e-mail dedicado) |
| Minimização | Coletar só e-mail na captura; não pedir CPF/telefone sem necessidade |
| Segurança | 2FA, senhas fortes, backup criptografado, acesso restrito |
| Registro | Manter log de consentimento e de processamento (LGPD art. 37 / GDPR art. 30) |
| Transferência internacional | Ao usar rede/EUA, informar transferência e garantias |

🔴 Vender/compartilhar lista de e-mail ou WhatsApp com terceiros sem consentimento específico viola
LGPD/GDPR e destrói o ativo.
