# BVC — Manual do Afiliado · Nível Global e Nacional

Repositório de conhecimento operacional para quem vive (ou quer viver) de **marketing de afiliados**,
cobrindo as duas frentes:

- **Trilha Nacional (Brasil)** — Hotmart, Kiwify, Eduzz, Monetizze, Braip, Amazon Associados BR,
  Shopee, Magalu, Mercado Livre, Americanas, AliExpress, Awin/Lomadee, TikTok Shop BR + tributação
  (PF/MEI/Simples), CONAR, LGPD e meios de pagamento (PIX, Wise, Payoneer).
- **Trilha Global** — Amazon Associates US/UE/Índia, Impact, PartnerStack, CJ, Awin, Rakuten,
  ShareASale, ClickBank, Digistore24, SaaS recorrente, high-ticket (finanças, seguros, hospedagem, VPN),
  FTC Endorsement Guides, GDPR/ePrivacy, W-8BEN, VAT.

## O que tem aqui

| Caminho | Conteúdo |
| --- | --- |
| [`manual/`](manual/README.md) | O manual completo (17 capítulos, do zero à escala) |
| [`manual/00-o-que-realmente-funciona.md`](manual/00-o-que-realmente-funciona.md) | Síntese da pesquisa: benchmarks 2025–2026 e as 10 leis |
| [`manual/01-pesquisa-github.md`](manual/01-pesquisa-github.md) | O que o GitHub revela sobre o que funciona (dados coletados via API em 12/10/2026) |
| [`manual/02-pesquisa-huggingface.md`](manual/02-pesquisa-huggingface.md) | Modelos, datasets e spaces do Hugging Face aplicados a afiliados |
| [`manual/11-roadmap-90-dias.md`](manual/11-roadmap-90-dias.md) | Roadmap semana a semana (fundação → primeira comissão) |
| [`manual/12-roadmap-12-meses-e-escala.md`](manual/12-roadmap-12-meses-e-escala.md) | Roadmap mês a mês até R$/US$ 10k+ e plano de saída |
| [`ferramentas/`](ferramentas/) | CLI em Python (sem dependências): EPC, projeção, break-even, ranking de ofertas, UTM, gerador de `/go/` |
| [`templates/`](templates/) | Planilhas e modelos prontos (ofertas, calendário, disclosures, negociação, briefs) |
| [`build_site.py`](build_site.py) | Gera o manual em HTML de página única (`site/index.html`) |

## Comece por aqui (ordem de leitura)

1. `manual/00-o-que-realmente-funciona.md` — 15 min. Alinha expectativa com dados.
2. `manual/04-fundamentos-e-matematica-do-afiliado.md` — a matemática (EPC é a única métrica que importa).
3. `manual/05-nicho-e-selecao-de-oferta.md` → `manual/06-motor-de-conteudo.md`.
4. Escolha a trilha: `manual/09-trilha-nacional-brasil.md` **ou** `manual/10-trilha-global.md`.
5. Execute: `manual/11-roadmap-90-dias.md` e `manual/12-roadmap-12-meses-e-escala.md`.
6. Opere: `manual/13-sops-e-checklists.md` + `ferramentas/afiliado.py`.

## Ler no navegador

O manual inteiro em **um único arquivo HTML** (com sumário lateral, busca `Ctrl+K` e CSS de
impressão) já está versionado em [`site/index.html`](site/index.html) — abra direto no navegador
ou imprima para PDF.

Para regerar depois de editar os Markdown:

```bash
python3 build_site.py                                      # gera site/index.html
python3 -m http.server 8080 --bind 0.0.0.0 --directory site # serve localmente
```

## Uso da calculadora

```bash
python3 ferramentas/afiliado.py epc --clicks 4200 --receita 318.90
python3 ferramentas/afiliado.py projecao --visitas 20000 --ctr 0.035 --cr 0.032 --aov 220 --comissao 0.09
python3 ferramentas/afiliado.py break-even --comissao-media 42 --cr 0.032
python3 ferramentas/afiliado.py ofertas --csv templates/planilha-ofertas.csv
python3 ferramentas/afiliado.py utm --destino "https://go.site.com.br/recomenda/nome" --campanha "bf2026"
python3 ferramentas/afiliado.py links --csv templates/mapa-de-links.csv --saida site-go/
```

## Aviso

Este material é **educacional**. Números de comissões, cookies, mínimos de saque e regras tributárias
mudam com frequência — cada capítulo indica a **data da fonte** e o link oficial para conferência.
Antes de qualquer decisão fiscal ou jurídica, valide com contador/advogado. Nada aqui é promessa de
renda: a maior parte de quem tenta não chega a faturar de forma consistente (dado reforçado inclusive
por criadores que vivem disso — ver `manual/03`).
