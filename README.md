# 🏠 MCMV Sem Dúvidas — Site Isca Completo

> **Tagline:** *Do aluguel à chave: descubra se você pode ter sua casa — e o que fazer primeiro.*

Implementação completa do projeto: site estático de captura de leads para o **Minha Casa Minha Vida**, com as 4 portas de conversão (PDF, tirador de dúvidas, quiz e vitrine de empreendimentos), fluxo de lead com A/B test entre os dois corretores, rastreamento de eventos, SEO com Schema Markup e o **Guia Completo em PDF** gerado por script.

---

## ✅ O que já está pronto

| Item | Status |
|---|---|
| Home com as 10 seções do wireframe (hero, 6 dúvidas, guia, quiz, como funciona, vitrine, depoimentos, FAQ, CTA final, rodapé) | ✅ |
| Landing do PDF `/guia-minha-casa-minha-vida/` com formulário de captura | ✅ |
| Hub do tirador de dúvidas `/duvidas/` com **busca em tempo real** | ✅ |
| 10 páginas de dúvida (renda, FGTS, entrada, parcelas, nome sujo, score…) com mini-diagnóstico Sim/Não | ✅ |
| `/documentos/` — checklist interativo e imprimível (Ctrl+P) | ✅ |
| `/passo-a-passo/` — timeline dos 7 passos com tempo médio e "o que pode travar" | ✅ |
| `/quiz/` — diagnóstico com 8 perguntas, pontuação, formulário antes do resultado e 4 faixas de resultado | ✅ |
| `/empreendimentos/` + 3 páginas de empreendimento (dados de **exemplo**) | ✅ |
| `/sobre/`, `/contato/`, `/obrigado/` (com download direto do PDF) | ✅ |
| `/blog/` + 3 artigos completos + pauta dos 17 próximos | ✅ |
| Política de Privacidade (LGPD) e Termos de Uso | ✅ |
| Botão flutuante de WhatsApp com os **2 corretores** | ✅ |
| Exit intent (desktop + mobile após 25s) oferecendo o guia | ✅ |
| Barra de urgência verídica no topo | ✅ |
| A/B test 50/50 entre Corretor 1 e Corretor 2 (Regra C do plano) | ✅ |
| Eventos: `page_view`, `lead_pdf`, `lead_quiz`, `lead_whatsapp`, `lead_form`, `scroll_75`, `exit_intent` | ✅ |
| Captura de UTMs (`utm_source`, `gclid`, `fbclid`…) anexadas a cada lead | ✅ |
| GA4 + Meta Pixel + GTM (injetados só se você preencher os IDs no config) | ✅ |
| Schema Markup: `FAQPage`, `HowTo`, `BreadcrumbList`, `Product`, `LocalBusiness`, `WebSite` | ✅ |
| `sitemap.xml`, `robots.txt`, `favicon.svg`, imagem OG 1200×630 | ✅ |
| **PDF "Guia Completo MCMV: do zero à chave"** — 15 páginas, com checklist imprimível, as 27 dúvidas e QR Codes para o WhatsApp dos corretores | ✅ |

---

## ⚠️ ANTES DE PUBLICAR — substitua os placeholders

1. **`assets/js/config.js`** (arquivo único — não precisa reconstruir nada):
   - `[CORRETOR 1]` / `[CORRETOR 2]` → nomes reais
   - `[CRECI 1]` / `[CRECI 2]` → CRECI reais
   - `5511900000000` / `5511900000001` → WhatsApp reais (DDI+DDD+número, só dígitos)
   - `cidadesAtuacao` → ex.: `"Ourinhos, Assis e região"`
   - `webhookUrl` → URL do Zapier/Make/n8n (veja "Fluxo de lead" abaixo)
   - `ga4Id` / `metaPixelId` / `gtmId` → IDs de rastreamento (deixe `""` para desativar)
   - **Depois de editar os números, gere o PDF de novo** (o QR Code da última página aponta para o WhatsApp).
2. **Depoimentos da home** (`tools/content_core.py`, função `home()`): substitua `[Nome]`/`[Cidade]` por depoimentos **reais e autorizados** (LGPD) — ou remova a seção.
3. **Empreendimentos** (`tools/content_extra.py`, lista `EMPREENDIMENTOS`): os 3 atuais são **dados de exemplo** — substitua nomes, bairros, cidades, tipologias, valores, diferenciais e pontos próximos; troque o mapa ilustrativo pelo embed real.
4. Confirme os valores vigentes do MCMV (renda, teto, subsídio, juros) na data da publicação — **eles mudam por portaria**. O site foi escrito de propósito sem cravar valores, sempre remetendo à confirmação com o corretor.

Depois das edições 2 e 3, reconstrua: `python3 tools/build_site.py`

---

## 🗂 Estrutura do repositório

```
/                          ← site publicado (abra em qualquer host estático)
├── index.html             ← home
├── guia-minha-casa-minha-vida/   ← landing do PDF (isca principal)
├── duvidas/               ← hub + 10 páginas de dúvida
├── documentos/            ← checklist imprimível
├── passo-a-passo/         ← timeline dos 7 passos
├── quiz/                  ← diagnóstico de 2 minutos
├── empreendimentos/       ← vitrine + páginas de empreendimento
├── sobre/ contato/ obrigado/ blog/ politica-de-privacidade/ termos/
├── 404.html
├── sitemap.xml  robots.txt  favicon.svg
└── assets/
    ├── css/style.css      ← design system completo
    ├── js/config.js       ← ⚙️ CONFIGURE AQUI (corretores, webhook, analytics)
    ├── js/main.js         ← motor do site (quiz, formulários, A/B, exit intent)
    ├── img/og-image.png   ← imagem de compartilhamento (1200×630)
    └── pdf/guia-mcmv-sem-duvidas.pdf   ← a isca principal

tools/
├── build_site.py          ← gera todas as páginas HTML
├── content_core.py        ← conteúdo: home, guia, dúvidas, documentos, passos
├── content_extra.py       ← conteúdo: quiz, empreendimentos, blog, páginas legais
├── build_pdf.py           ← gera o PDF do guia + a imagem OG
└── render.py              ← templates, componentes, schemas e leitura do config.js
```

**Fluxo de edição:** mudou dados de corretor? → só editar `config.js`. Mudou conteúdo/copy? → editar `tools/content_*.py` e rodar `python3 tools/build_site.py`. Mudou empreendimento ou WhatsApp? → rodar também `python3 tools/build_pdf.py`.

---

## 🔌 Fluxo de lead e automação (plano §11)

- **Todo formulário** grava o lead no `localStorage` do navegador (chave `mcmv_leads`) e, se `webhookUrl` estiver preenchida no `config.js`, envia um **POST em JSON** para ela (Zapier/Make/n8n → CRM → notificação ao corretor).
- **Payload do lead:** `{tipo: pdf|quiz|mini|contato, origem, ab, utms:{...}, dados:{...}, capturado_em}` — pronto para o round-robin/roteamento do §11.3 do plano.
- **Distribuição:** o A/B test (50/50) já decide qual corretor aparece como CTA principal para cada visitante; o campo `ab` viaja no payload para você medir quem converte mais (após 30 dias, fixe o vencedor com `abTestCorretores: false`).
- **Mensagens pré-preenchidas** por página (§11.4): já implementadas em `config.js` (`window.SITE_MSGS`) — incluindo a mensagem dinâmica do quiz com resultado + faixa de renda.
- **Para testar os leads sem webhook:** preencha um formulário e rode no console do navegador: `JSON.parse(localStorage.getItem('mcmv_leads'))`.

## 📊 Rastreamento

Preencha `ga4Id`, `metaPixelId` ou `gtmId` no `config.js` — os scripts são injetados automaticamente. Eventos disparados no `dataLayer`: `page_view`, `scroll_75`, `lead_whatsapp` (com nome do corretor), `lead_pdf`, `lead_quiz`, `lead_form`, `exit_intent`. No GTM, crie acionadores para cada `event` e envie como conversão.

## 🚀 Como publicar

O site é 100% estático — publique a raiz do repositório em qualquer um destes:

- **Netlify / Vercel:** arraste a pasta ou conecte o repositório (build: nenhum, output: raiz).
- **Hostinger / cPanel:** suba os arquivos por FTP na `public_html`.
- **GitHub Pages:** publique o branch (as URLs com barra final já funcionam).

Depois: aponte o domínio `mcmvsemduvidas.com.br`, suba o `sitemap.xml` no Google Search Console e configure a conversão principal (`lead_whatsapp` + `lead_form`).

## 🧰 Requisitos para regenerar (só para quem for editar o conteúdo)

```bash
pip install fpdf2 qrcode pillow   # para o PDF e a imagem OG
python3 tools/build_site.py       # regenera as páginas HTML
python3 tools/build_pdf.py        # regenera o PDF do guia + OG image
```

## ⚖️ Compliance embutido (plano §13)

- Aviso "sujeito à análise de crédito / regras mudam por portaria" em **todas** as páginas.
- Rodapé de site independente sem vínculo com Governo/Caixa/MCMV.
- Uso apenas descritivo das marcas MCMV e MRV; sem logotipos de terceiros.
- Checkbox LGPD não pré-marcado, finalidade explícita, retenção de 24 meses e e-mail de exclusão na Política de Privacidade.
- Depoimentos marcados como ilustrativos até serem substituídos por reais.
- Nenhuma promessa de aprovação em lugar nenhum do site ou do PDF.

---

© 2026 MCMV Sem Dúvidas — projeto de site isca para captação de leads MCMV.
