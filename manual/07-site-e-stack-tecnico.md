# 07 · Site, links e stack técnico

> O site é o **ativo**: ele concentra autoridade (SEO/GEO), abriga o link de afiliado de forma
> controlada (`/go/`), captura o contato e é o que você consegue **vender** no futuro (cap. 12).
> O vídeo-base dedica 7 minutos a isso (18:17 → 25:28) usando hospedagem paga; aqui mostramos também
> o caminho **custo zero**.

---

## 1. Escolha de stack (3 caminhos)

| Caminho | Custo | Para quem | Prós / Contras |
| --- | --- | --- | --- |
| **A. WordPress + tema de afiliado** | US$ 3–10/mês hospedagem | Iniciante que quer plugins prontos (tabelas, comparativos, Amazon) | ✅ ecossistema (`affiliatetheme` 30 ★, AAWP, Lasso) · ❌ manutenção/segurança/velocidade |
| **B. Astro ou Next.js estático + CMS headless** | US$ 0 (Cloudflare Pages/Vercel free) | Quem quer velocidade máxima, GEO e controle | ✅ Core Web Vitals verdes, programmatic SEO fácil (`pseo-next` 63 ★) · ❌ exige noção de código |
| **C. Sem site no início** (canal + link na bio + plataforma de criador) | US$ 0 | Criador de TikTok/YouTube que quer validar rápido | ✅ velocidade de teste · ❌ sem autoridade, sem SEO, sem ativo vendável |

🟢 Recomendação: **B** se você aceita 4 h de setup; **A** se quer publicar hoje. **C** apenas nos
primeiros 30 dias e sempre migrando para A/B depois.

**Domínio:** `.com` para global, `.com.br` para nacional (ou os dois com redirect). Nome = marca
curta, pronunciável, sem keyword exata ("melhorcadeira.com.br" envelhece mal e é fraco como entidade).

---

## 2. Estrutura de URLs e arquitetura

```
/                                   → home: promessa + 3 melhores recomendações + captura
/melhores/{categoria}/              → money pages ("melhor X para Y")
/review/{produto}/                  → review individual (com dados de teste)
/comparativo/{a}-vs-{b}/            → comparativos (alto EPC)
/guia/{tema}/                       → suporte informacional com link interno para money pages
/go/{slug}                          → redirect de afiliado (NUNCA indexado)
/recomenda/{slug}                   → alternativa "bonita" para redes/bio
/sobre/  /metodologia/  /contato/  /divulgacao-de-afiliados/  /privacidade/
```

**Arquitetura de autoridade topical:** cada money page recebe 5–15 links internos de guias/reviews
relacionados; cada review linka para a money page da categoria. Nada de página órfã.

---

## 3. Páginas obrigatórias (compliance + confiança + E-E-A-T)

| Página | Conteúdo mínimo |
| --- | --- |
| `/divulgacao-de-afiliados/` | Explica que links são de afiliado, que você recebe comissão sem custo extra, e lista os programas |
| `/metodologia/` | Como você testa/avalia, critérios, pesos, quem paga o produto, quando atualiza |
| `/sobre/` | Autor real (nome, foto, credencial, histórico, contato, redes) |
| `/privacidade/` | Cookies, analytics usado, base legal (LGPD art. 7º/GDPR), como exercer direitos |
| `/contato/` | E-mail + formulário (obrigatório para aprovação em várias redes: Awin, Impact, CJ) |
| `/termos/` | Uso do site, isenção de responsabilidade, marca de terceiros |

🔴 Sem `/sobre/`, `/contato/` e `/divulgacao-de-afiliados/` você é **reprovado** na maioria das redes
globais (Awin exige "site promocional ativo"; Impact/CJ idem) e perde E-E-A-T no Google.

---

## 4. Links de afiliado: o padrão `/go/` (cloaking **ético**)

O que é aceitável e o que é proibido:

| 🟢 Cloaking ético (gestão de link) | 🔴 Cloaking malicioso |
| --- | --- |
| `/go/nome` → destino de afiliado, 302 | Mostrar página diferente para revisor de anúncio e para usuário |
| `rel="sponsored nofollow"` em todo link de afiliado | Esconder que é link de afiliado |
| `/go/` bloqueado em `robots.txt` + `X-Robots-Tag: noindex, nofollow` | Redirecionar para oferta diferente da anunciada |
| Log de clique (data, referrer, geo, dispositivo, sub-id) | Filtrar bots para burlar antifraude da rede |
| Trocar destino em 1 lugar sem editar 200 posts | Rotação de oferta por IP/dispositivo para enganar plataforma |

Padrão de implementação (Yoast/`brandonhimpfen/link-cloaker` + nosso gerador):

```
site/
├── go/index.php          # lê redirects.csv, faz 302 + X-Robots-Tag: noindex,nofollow + log
├── go/redirects.csv      # slug,destino,programa,sub_id_padrao,ativo
└── .htaccess             # reescrita: /go/nome → go/index.php?k=nome
robots.txt                # Disallow: /go/
```

Gere tudo com:

```bash
python3 ferramentas/afiliado.py links --csv templates/mapa-de-links.csv --saida site-go/
```

### 4.1 Boas práticas de inserção de link (bloco 25:28 do vídeo-base)

- **Botão > texto inline** em decisão de compra ("Ver preço na Amazon") — mas mantenha também link
  contextual no texto (aumenta CTR total).
- **Tabela comparativa** com botão por linha = maior CTR por visita da página inteira.
- **Um destino por slug** (`/go/cadeira-x`) e **sub-id por posição** (`?sid=tbl-top`, `?sid=cta-fim`)
  para saber qual bloco converte.
- **Nunca** prometa preço/desconto no texto: preço muda. Use API do marketplace para exibir preço
  atualizado ou escreva "confira o preço" (Amazon proíbe exibir preço desatualizado/estático em
  vários casos — verifique a política vigente).
- **Teste todo link em aba anônima** antes de publicar e uma vez por mês (SOP-A3, cap. 13).
- `target="_blank"` + `rel="sponsored nofollow noopener"`.

---

## 5. Disclosure na página (o que colocar e onde)

**Padrão mínimo (site BR):**

> **Divulgação:** este site participa de programas de afiliados. Alguns links abaixo são links de
> afiliado — se você comprar por eles, recebemos uma comissão **sem custo adicional para você**.
> Só recomendamos o que testamos ou pesquisamos a fundo. Veja nossa [metodologia](/metodologia/).

**Padrão mínimo (site global/EN, Amazon):**

> As an Amazon Associate I earn from qualifying purchases. Some links on this page are affiliate
> links: we may earn a commission at no extra cost to you. [How we test](/methodology/)

Regras que valem nos dois mercados (FTC + CONAR + política das plataformas):

1. **Antes** do link, não no rodapé; visível sem rolagem excessiva.
2. Linguagem clara e local ("ganho comissão" — não "parceria", "colab", "sp").
3. Em vídeo: **verbal + on-screen** (conversão 4,1% vs 2,9% sem disclosure).
4. Em redes: `#publi` / `#ad` no início da legenda + ferramenta nativa de "parceria paga".
5. Disclosure específico por programa quando exigido (Amazon exige a frase exata).
6. Nada de comprar/vender/gerar review falso (regra da FTC em vigor desde o fim de 2024; no Brasil
   configura publicidade enganosa — CDC art. 37 e CONAR).

Snippets prontos: `templates/disclosure-site-pt.md`, `templates/disclosure-site-en.md`,
`templates/disclosure-social.txt`.

---

## 6. Performance técnica (Core Web Vitals)

| Meta | Valor |
| --- | --- |
| LCP | < 2,5 s |
| INP | < 200 ms |
| CLS | < 0,1 |
| Peso da página | < 1,5 MB |
| Scripts de terceiros | ≤ 3 (analytics + consent + 1 rede) |

- Imagens WebP/AVIF, `loading="lazy"`, dimensões fixas (evita CLS).
- Fonte local (sem Google Fonts remoto) ou `font-display: swap`.
- Sem widget de rede de afiliado em toda página (carrega script pesado e derruba INP).
- CDN (Cloudflare grátis) + cache de página + HTTPS/HSTS.
- Sites de review com PageSpeed 95+ são citados como vantagem competitiva em repositórios de
  "affiliate review system" — velocidade é fator de conversão, não só de SEO.

---

## 7. Consentimento, cookies e privacidade (LGPD/GDPR)

- **Brasil (LGPD):** cookie de marketing/terceiro exige **base legal** — normalmente consentimento
  (art. 7º, I) ou legítimo interesse documentado. Mantenha banner de consentimento com recusa tão
  fácil quanto a aceitação, política de privacidade legível e registro de consentimento.
- **UE/UK (GDPR + ePrivacy):** idem, com multas pesadas; use CMP (Cookiebot, Usercentrics, Osano) ou
  Consent Mode v2 do Google.
- **Estratégia que reduz o problema:** analytics **sem cookie** (Plausible 29.377 ★ / Matomo 21.949 ★
  self-hosted) + medição server-side/postback (cap. 08). Menos cookie de terceiro = menos atrito
  jurídico e menos perda de dado com bloqueadores (20–40% dos usuários).

---

## 8. Automação e integração com dados de produto

```python
# Exemplo: sincronizar preço/disponibilidade via API oficial (não raspar HTML)
# Amazon PA-API 5.0 / Creators  →  wrapper: sergioteula/python-amazon-paapi (287 ★)
# Shopee Affiliate Open API (GraphQL) → docs: bcat95/shopee-aff (90 ★)
# AliExpress → sergioteula/python-aliexpress-api (127 ★)
# Regra: respeitar rate limit, cache (ex.: 6 h), e a política de exibição de preço de cada programa.
```

⚠️ Muitos programas (Amazon inclusive) exigem que você seja aprovado para uso de API com volume
mínimo de vendas; e **proíbem** scraping do site. Sempre leia a política de uso de dados/marca.

---

## 9. Checklist de lançamento do site (30 itens resumidos)

- [ ] Domínio + SSL + CDN · [ ] Sitemap XML + robots (com `Disallow: /go/`)
- [ ] `/sobre/`, `/contato/`, `/metodologia/`, `/divulgacao-de-afiliados/`, `/privacidade/`, `/termos/`
- [ ] 1 money page + 3 reviews + 2 comparativos + 4 guias publicados antes de divulgar
- [ ] `/go/` funcionando com log e sub-id · [ ] `rel="sponsored nofollow"` em todos os links externos
- [ ] Schema `Product`/`Review`/`FAQPage`/`Organization`/`Person` validado (Rich Results Test)
- [ ] Core Web Vitals verdes no mobile · [ ] Analytics próprio instalado + eventos de clique em `/go/`
- [ ] Banner de consentimento + registro · [ ] Backup automático + 2FA em tudo (domínio, hospedagem, e-mail)
- [ ] Google Search Console + Bing Webmaster + IndexNow · [ ] Página "llms.txt" ou seção para IA
- [ ] E-mail transacional com SPF/DKIM/DMARC · [ ] Página de captura + isca funcionando
