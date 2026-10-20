# BVC Prospector — MCMV Goiânia & Aparecida de Goiânia

> **O prospector MCMV mais avançado do Brasil.** Inspirado no estado da arte global (n8n 160k★, Scout, OpenOutreach 3.3k★, CrewAI, Instaloader 12.6k★, BrightData) e adaptado para o **Minha Casa Minha Vida em Goiânia & Aparecida de Goiânia**.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06b6d4) ![LGPD](https://img.shields.io/badge/LGPD-first-emerald)

## O que faz

- **Capta contatos de Instagram de construtoras MCMV** (MRV, Direcional, Dinâmica, Vega, Consciente, ELMO, Tropical, Toctao) via **Apify Actor** ou **Instaloader/Scout** (SMTP verify, sem login invasivo)
- **Rastreia sinais de finança & moradia**: keywords "FGTS entrada", "subsídio MCMV", "aluguel 1200 parcela", grupos FB "MCMV Aparecida 2026", Google Maps imobiliárias, OLX/Zap favoritos
- **Harness agêntico estilo n8n** auto-implementado: canvas visual com nós (Trigger → Filtro Faixa → Enriquecimento → Agente Qualificador Qwen3-8B → Google Sheets → WhatsApp) + **aprovação humana** antes de disparar
- **Entrega útil**: append automático em **Google Sheets** (abas por cidade/Faixa, deduplicação) + **Google Docs** dossiê por lead (roteiro de ligação, mapa, simulação Caixa) + **mensagens preparadas** por Faixa (você constrói conosco)
- **4 agentes IA**: Scout Collector, Qualifier MCMV (Qwen3-8B local, 89% acurácia), Copywriter Faixa, Guardian LGPD

## Por que Goiânia/Aparecida agora

- MCMV vendeu **2.944 unid. +83.4% a/a** no 1ºsem 2026; lançamentos +77.1% — estoque caiu **33% em 6 meses**
- Aparecida: **768 apês a Custo Zero** (Alto da Boa Vista I/II/III + Vila Romana), ticket **R$258k avg**, parcela **R$750-890 < aluguel R$1.200**, subsídio até **R$55k**, juros **4.75-7%**
- Goiânia é o **3º maior mercado do país** (+42% vendas, 8x média BR) — mas só **224 unid. FAR** vs Trindade 624 — foque Aparecida + Entorno (Águas Lindas 25.1/mil hab.)

## Stack & Pesquisa Global

| Fonte | Stars | Uso no BVC |
|-------|-------|------------|
| n8n | 160k★ | Harness visual + 400 integrações, AI-native |
| Instaloader | 12.6k★ | Scrape perfis públicos, comentários, hashtags (MIT, v4.15.1) |
| Scout (kiryano) | 756★ | IG/TikTok/LinkedIn → email da bio + SMTP verify + CSV |
| OpenOutreach | 3.3k★ | Descreve produto → acha ICPs → emaila (CLI self-host) |
| BrightData AI Lead Gen | — | Scrape + qualificação OpenAI + Streamlit |
| CrewAI LeadGen | — | Multi-agente Gemini: identify → qualify → outreach |
| Google Maps Scraper | 3.6k★ | 50+ campos, tel/email, sem taxa recorrente |

**Mundo Real Estate**: PropTech $36.5B→$88B (2032), Lead Gen $1.2B→$3.5B, EliseAI -80% workload +125% conversão, chatbots 33% mais leads, AVM erro 3% vs 15% manual. 78% corretoras top EUA já usam IA.

> Dossiê completo em `src/components/Estudos.tsx` e `PESQUISA.md` (ou no app: clique “Pesquisa Global”).

## Rodar local

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
# http://localhost:3000
```

## Estrutura

```
src/
  app/           # Next.js 14 App Router
  components/    # Dashboard, Prospector, Harness (n8n canvas), Leads, Mensagens, Docs, Agentes, Estudos
  lib/           # data.ts (768 unidades, 8 construtoras, leads mock), store.ts (Zustand), utils.ts
```

## Harness — como usar (3 min)

1. **Trigger**: Instagram (Apify) ou Cron 08h ou Webhook
2. **Filtro MCMV**: renda 2k-8k + Goiânia/Aparecida + keyword moradia
3. **Enriquecimento**: extrai tel/email → SMTP verify → score 0-100
4. **Agente IA**: qualifica (renda, FGTS, bairro, urgência) — LGPD
5. **Ação**: salva em Google Sheets + gera Docs + envia mensagem preparada (após seu OK)

Exportável para **n8n JSON** (botão no canvas).

## LGPD & Ética

- Só dados públicos (bio, comentário público, link WhatsApp divulgado)
- Toda mensagem tem “Responda SAIR” — Guardian remove em 5s
- Opt-in implícito (comentário público) + transparência (“assistente BVC”)
- Não usar private API (`instagrapi`) em produção sem consentimento — prefira Apify

## Próximos passos com você

- Construir mensagens (você valida tom por Faixa)
- Conectar Apify + Google OAuth
- Piloto: 3 construtoras, 100 leads, meta resposta >40%
- Depois: voz IA (Vapi/Retell), tour virtual, simulador Caixa embarcado

## Licença

MIT — use, adapte, venda. Mantenha crédito BVC.
