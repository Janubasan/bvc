# Dados da BVC — proveniência e como revalidar

| Arquivo | O que contém | Como foi gerado |
|---|---|---|
| `repos.txt` | 159 slugs iniciais (semente curada à mão) | escrito manualmente com base nas categorias dos docs 00-14 |
| `repos.csv` | verificação desses 159 via API do GitHub (stars, licença, último push, status) | `python3 dados/verify.py` (usa `gh api`) |
| `extras.txt` / `extras.csv` | 90+ slugs complementares (MCP, OCR, e-commerce, quant, BR) + `knadh/listmonk` | `gh api` em lote |
| `hf-modelos.csv` | 35 modelos do Hugging Face com likes, downloads, licença, uso e nota | API pública do Hub (`huggingface.co/api/models/...`) |
| `catalogo.py` | 231 repositórios curados em 15 categorias: `(repo, uso prático, modelo de renda)` | curadoria sobre os CSVs (fonte de `docs/03`) |

**Revalidar tudo:**
```bash
python3 scripts/verificar_links.py            # relatório de mudanças/problemas
python3 scripts/verificar_links.py --atualizar # regrava os CSVs com dados atuais
python3 scripts/gerar_biblia_github.py         # regenera docs/03-BIBLIA-GITHUB.md
```

**Números da última varredura (2026-10-02):** 251 linhas de CSV → 239 slugs únicos → 226 ativos, 9 arquivados (marcados ⚠️ no doc 03), 4 inexistentes (substituídos na curadoria). Soma de estrelas dos repos únicos: 11.353.004.

**Observação sobre o Hugging Face no sandbox:** a API do Hub pode estar inacessível em ambientes isolados; rode `verificar_links.py` na sua máquina para atualizar os números do doc 04.
