# Templates e planilhas

Arquivos prontos para copiar e preencher. Todos são lidos pela CLI `ferramentas/afiliado.py`.

| Arquivo | Uso | Comando relacionado |
| --- | --- | --- |
| `planilha-ofertas.csv` | Banco de ofertas com comissão, cookie, recorrência, CR esperada e fonte | `afiliado.py ofertas --csv templates/planilha-ofertas.csv` |
| `mapa-de-links.csv` | Mapa slug → destino de afiliado (base do `/go/`) | `afiliado.py links --csv ... --saida site-go/` |
| `kpi-semanal.csv` | Métricas por semana/canal (visitas, cliques, receita, custo, contatos) | `afiliado.py kpi --csv ...` |
| `financeiro-mensal.csv` | DRE simples do mês (receita, reversals, custos, imposto, lucro) | — |
| `calendario-conteudo.csv` | Calendário editorial com pilar, intenção, oferta e derivados | — |
| `pin-map.csv` | Fila de pins (Pinterest) por artigo | — |
| `video-log.csv` | Registro do SOP-V1 (vídeo → 3 aprendizados → 3 ações) | — |
| `testes-ab.csv` | Registro de testes A/B com amostra mínima | — |
| `scorecard-nicho.md` | Nota 0-100 do nicho | `afiliado.py scorecard --conhecimento 4 ...` |
| `disclosure-site-pt.md` / `-en.md` | Textos de divulgação de afiliado para site | — |
| `disclosure-social.txt` |Disclosure por plataforma (BR e global) | — |
| `email-negociacao-comissao.md` | Pedido de tier/cupom ao gerente de afiliados | — |
| `brief-de-video.md` | Roteiro de review/comparativo em vídeo | — |
| `relatorio-mensal.md` | Fechamento mensal | — |
| `valuation.md` | Documento de valuation do ativo (para venda/captação) | — |
| `postmortem.md` | Análise de crise de tráfego/receita | — |
| `pesquisa-log.md` | Registro da rotina semanal de pesquisa (SOP-E) | — |

Regra de ouro: **toda linha preenchida precisa de data e fonte** quando envolver taxa, cookie ou
preço. Sem isso você decide com dado velho (cap. 13 SOP-E).
