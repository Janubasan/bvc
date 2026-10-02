#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera docs/03-BIBLIA-GITHUB.md a partir de dados/catalogo.py + dados/*.csv (verificados via API do GitHub).

Uso:
    python3 scripts/gerar_biblia_github.py            # gera o documento
    python3 scripts/verificar_links.py --atualizar    # atualiza os CSVs e depois regenere
"""
import csv, os, sys, datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, RAIZ)
from dados.catalogo import CATALOGO  # noqa: E402

def carregar():
    dados = {}
    for arq in ("repos.csv", "extras.csv"):
        caminho = os.path.join(RAIZ, "dados", arq)
        if not os.path.exists(caminho):
            continue
        for linha in csv.DictReader(open(caminho)):
            if linha["repo"] and linha["stars"]:
                dados[linha["repo"]] = linha
    return dados

LICENCAS_ALERTA = {
    "AGPL-3.0": "AGPL: se você oferecer como serviço na rede, precisa publicar as modificações. Use como serviço separado ou substitua.",
    "GPL-3.0": "GPL: obras derivadas devem ser GPL. Ok para uso interno/ferramenta; cuidado ao embutir em produto fechado.",
    "GPL-2.0": "GPLv2: idem acima.",
    "NOASSERTION": "Licença não padronizada/ambígua: leia o LICENSE do repositório antes de usar em produto comercial.",
    "other": "Licença própria (ex.: non-commercial): leia antes de usar comercialmente.",
}

def tabela(itens, dados):
    fora = []
    linhas = []
    for repo, uso, modelo in itens:
        d = dados.get(repo)
        if not d:
            fora.append(repo)
            continue
        estrelas = f"{int(d['stars']):,}".replace(",", ".")
        lic = d["lic"] if d["lic"] not in ("", "None") else "ver LICENSE"
        status = " ⚠️arquivado" if d["status"] == "archived" else ""
        link = f"[{repo}](https://github.com/{repo})"
        linhas.append(f"| {link}{status} | {estrelas} | {lic} | {uso} | {modelo} |")
    return "\n".join(linhas), fora

def main():
    dados = carregar()
    hoje = datetime.date.today().isoformat()
    partes = []
    faltando_total = []

    partes.append(f"""# 03 — Bíblia dos Repositórios (GitHub)

> **{sum(len(i) for _, i in CATALOGO)} repositórios curados**, todos com link direto, estrelas e licença. Estrelas são um retrato do dia **{hoje}**: servem para você julgar maturidade, não como placar.

## Como usar este documento

1. **Não clone tudo.** Cada categoria responde a uma pergunta diferente. Vá direto à sua (Ctrl+F pelo nome da seção).
2. **Uma decisão de stack por vez.** Escolha o boilerplate (ou o backend), depois o pagamento, depois o resto.
3. **Confira a licença antes de embutir em produto fechado.** A coluna "Licença" e a seção final evitam dor de cabeça.
4. **O número da coluna "Modelo"** aponta para o modelo de renda do [`docs/01`](01-MODELOS-DE-RENDA.md) que aquele repo viabiliza.

### As 6 decisões de stack que importam

| Decisão | Opção segura para micro-SaaS | Quando fugir |
|---|---|---|
| Backend/DB | Supabase ou PocketBase | Precisa de multi-tenant pesado → Appwrite/Nhost |
| Front | Next.js + shadcn/ui + Tailwind | Time pequeno e sem JS → SvelteKit |
| Pagamento | Stripe (global) / Mercado Pago + Pix (BR) | Vender para devs → Paddle/Lemon Squeezy (MoR) |
| IA | API de LLM + RAG com pgvector | Dados sensíveis/on-premise → llama.cpp/Ollama/vLLM |
| Automação | n8n (self-host) | Time dev → Windmill/Trigger.dev |
| Observabilidade de negócio | PostHog + Metabase + Langfuse | Vai cobrar por uso → OpenMeter/Lago |
""")

    for categoria, itens in CATALOGO:
        corpo, fora = tabela(itens, dados)
        faltando_total += fora
        partes.append(f"\n## {categoria}\n")
        partes.append("| Repositório | ⭐ | Licença | Para que serve na prática | Modelo BVC |")
        partes.append("|---|---:|---|---|---|")
        partes.append(corpo)
        partes.append("")

    partes.append("""
## Licenças: leia antes de clonar

| Licença | O que significa na prática |
|---|---|
| **MIT / Apache-2.0 / BSD** | Uso comercial livre, inclusive em produto fechado. Prefira estas. |
| **AGPL-3.0** | Se você oferecer o software como serviço pela rede, precisa liberar as modificações. Use como serviço isolado (ex.: crawler separado) ou troque. |
| **GPL-2.0 / GPL-3.0** | Obra derivada precisa ser GPL. Ferramenta interna ok; embutir em SaaS fechado, não. |
| **Fair-code (n8n)** | Livre para uso interno; restrições para revender como serviço de automação concorrente. Leia os termos. |
| **NOASSERTION / "other"** | O GitHub não reconheceu a licença. Abra o arquivo LICENSE: pode ser non-commercial, dual ou proprietária. |
| **CC-BY-4.0 em código** | Incomum e problemático para software; trate como documentação, não como biblioteca. |

### Armadilhas comuns (e a saída)

- **AGPL em produto fechado:** `firecrawl`, `Skyvern`, `documenso`, `plausible`, `grafana`(AGPL), `getlago`, `khoj`, `ToolJet`, `heyform`, `zammad`, `solidtime`, `kimai`.
  → Saída: rodar como serviço separado via API (comunicação por rede, não linkagem), ou usar alternativa MIT/Apache (ex.: `crawl4ai` no lugar do Firecrawl; `umami` no lugar do Plausible).
- **Repositórios arquivados / descontinuados:** `huggingface/text-generation-inference`, `mistralai/mistral-inference`, `s0md3v/roop`, `FlowiseAI/Flowise`, `RooCodeInc/Roo-Code`, `rhasspy/piper`, `facebookresearch/demucs`, `Sanster/IOPaint`, `vercel/nextjs-subscription-payments`.
  → Saída: use os substitutos citados na descrição de cada linha (vLLM/transformers, Dify/RAGFlow, Cline/opencode, Kokoro/MeloTTS, ComfyUI, nextjs/saas-starter).
- **Nome trocado/redirect:** `nextjs/saas-starter` (ex-leerob), `anomalyco/opencode` (ex-sst), `aaif-goose/goose` (ex-block), `LibreChat-AI/LibreChat` (ex-danny-avila), `prisma/orm` (ex-prisma/prisma), `calcom/cal.diy`, `openbq-org/OpenBB`, `hiyouga/LlamaFactory`, `dbt-labs/dbt`.
  → Sempre use o nome canônico acima para não pegar fork abandonado.
- **Modelos com licença não comercial:** vários modelos de imagem/vídeo no HF (ex.: FLUX.1-dev). Para uso comercial, cheque a licença ou use a variante Apache-2.0 (`FLUX.1-schnell`, `Z-Image-Turbo`).

## Como minerar mais repositórios sozinho (a parte didática)

```text
# 1) Por tópico, ordenado por estrelas
github.com/topics/micro-saas | /saas-boilerplate | /ai-agents | /rag | /mcp-server | /self-hosted

# 2) Busca avançada dentro do GitHub
stars:>1000 topic:saas-boilerplate pushed:>2026-01-01 language:TypeScript
"micro saas" in:name,description,readme stars:>100
topic:mcp-server stars:>200
path:docker-compose.yml "supabase" stars:>500

# 3) Descobrir o que está crescendo (não só o que é famoso)
github.com/trending?since=weekly          -> acesse semanalmente e anote 3 projetos
github.com/explore                      -> recomendações por tema que você segue
awesome-lists (linha "Aprender" acima)  -> navegue do índice para o nicho
```

**Regra de escolha:** estrelas medem atenção, não manutenção. Antes de adotar, verifique: último commit (< 90 dias), issues abertas com resposta, releases recentes, tamanho da comunidade (Discord/forum) e se existe empresa/indivíduo mantenedor.

## Checklist antes de adotar um repositório

- [ ] Licença compatível com uso comercial (MIT/Apache/BSD = sim; AGPL/GPL = dependendo)
- [ ] Último commit há menos de 90 dias (ou manutenção claramente estável)
- [ ] Issues recentes respondidas por mantenedores
- [ ] Você entende como pedir ajuda (Discord, Discussions, Issues)
- [ ] Existe caminho de saída (trocar a peça sem reescrever o produto)
- [ ] Não depende de um único mantenedor pago/blocked
- [ ] Custo de infra em produção estimado (antes de escalar clientes)
- [ ] Você consegue explicar, em 1 frase, o que ele faz no seu produto

> Estrelas mudam. Para revalidar tudo em um comando: `python3 scripts/verificar_links.py --atualizar && python3 scripts/gerar_biblia_github.py`

➡️ Próximo: [`04-BIBLIA-HUGGINGFACE.md`](04-BIBLIA-HUGGINGFACE.md)
""")

    destino = os.path.join(RAIZ, "docs", "03-BIBLIA-GITHUB.md")
    open(destino, "w").write("\n".join(partes) + "\n")
    print(f"OK -> {destino}")
    print(f"Repos no catálogo: {sum(len(i) for _, i in CATALOGO)} | com dados verificados: {sum(1 for _, itens in CATALOGO for r, _, _ in itens if r in dados)}")
    if faltando_total:
        print("SEM DADOS VERIFICADOS (rode verificar_links.py --atualizar):", ", ".join(faltando_total))

if __name__ == "__main__":
    main()
