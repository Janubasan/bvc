#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gerador de micro-SaaS auto-preenchível da BVC.

Uso:
    python3 scripts/novo_micro_saas.py --exemplo > meu.spec.yaml
    python3 scripts/novo_micro_saas.py --spec meu.spec.yaml
    python3 scripts/novo_micro_saas.py --spec meu.spec.yaml --destino projetos

Ele lê os templates de templates/*.tmpl, substitui as variáveis do seu spec e cria
projetos/<slug>/ com: PRD, oferta, landing, preço, proposta, lançamento em X e Reddit,
cold e-mail, prompts de agente, checklist de 30 dias, .env.example e README.
"""
import argparse, datetime, json, os, re, sys, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES = os.path.join(RAIZ, "templates")

EXEMPLO = """# Spec do micro-SaaS — preencha e rode: python3 scripts/novo_micro_saas.py --spec este.yaml
slug: atendimento-clinicas
nome: AgendaBot para clínicas
autor: Seu Nome
email: voce@seudominio.com
publico: clínicas odontológicas com 2 a 5 cadeiras
dor: recepção perde 1h por dia confirmando consultas e 20% dos pacientes faltam
resultado: reduzir faltas em 40% e devolver 1h/dia para a recepção
prazo: 14 dias
preco_setup: R$ 1.500
preco_mensal: R$ 297
garantia: se não reduzir faltas em 30% em 60 dias, devolvo o setup
canal: grupos de WhatsApp de gestores + Instagram de dentistas
stack: n8n + API oficial do WhatsApp + Supabase + LLM gpt-oss-20b
diferenciais: confirmação automática, reagendamento em 1 clique, relatório semanal de faltas
metrica_sucesso: faltas por semana e tempo gasto em confirmação
"""

ARTEFATOS = [
    ("prd.md.tmpl", "PRD.md"),
    ("oferta.md.tmpl", "OFERTA.md"),
    ("landing.md.tmpl", "LANDING.md"),
    ("preco.md.tmpl", "PRECO.md"),
    ("proposta.md.tmpl", "PROPOSTA.md"),
    ("lancamento-x.md.tmpl", "LANCAMENTO-X.md"),
    ("lancamento-reddit.md.tmpl", "LANCAMENTO-REDDIT.md"),
    ("cold-email.md.tmpl", "COLD-EMAIL.md"),
    ("prompts-agente.md.tmpl", "PROMPTS-AGENTE.md"),
    ("checklist-30-dias.md.tmpl", "CHECKLIST-30-DIAS.md"),
]

ENV = """# .env — NUNCA comite este arquivo preenchido
APP_NAME="{nome}"
APP_URL=http://localhost:3000

# Banco/Auth (Supabase, Appwrite, PocketBase...)
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# IA (escolha 1 provedor de nuvem e, opcionalmente, 1 local)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
HF_TOKEN=
OLLAMA_BASE_URL=http://localhost:11434

# Pagamento
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
MERCADOPAGO_ACCESS_TOKEN=

# Observabilidade
POSTHOG_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
"""

README = """# {{nome}}

> Gerado pela **BVC** em {{data}} a partir de `{{slug}}.yaml`.

## O que é
{{nome}} ajuda **{{publico}}** a **{{resultado}}** em **{{prazo}}**.
Problema atacado: {{dor}}

## Arquivos
| Arquivo | Para que serve |
|---|---|
| PRD.md | Escopo do MVP e métrica de sucesso |
| OFERTA.md | A promessa, o que inclui e a garantia |
| LANDING.md | Texto pronto da página de venda |
| PRECO.md | Planos, descontos e regras de aumento |
| PROPOSTA.md | Proposta comercial de 1 página |
| LANCAMENTO-X.md | Plano de 7 dias no X |
| LANCAMENTO-REDDIT.md | Posts e regras para o Reddit |
| COLD-EMAIL.md | Sequência de 14 dias (e-mail + DM) |
| PROMPTS-AGENTE.md | System prompt e prompts de IA |
| CHECKLIST-30-DIAS.md | Execução semana a semana |
| .env.example | Variáveis de ambiente (copie para .env) |

## Stack escolhida
{{stack}}

## Canal inicial
{{canal}}

## Próximos passos (não pule)
1. Validar a dor com 15 conversas (docs/02 e docs/07).
2. Pré-vender para 3 clientes fundadores ({{preco_mensal}}/mês + {{preco_setup}} de setup).
3. Entregar o primeiro valor em {{prazo}} e medir {{metrica_sucesso}}.
4. Seguir `CHECKLIST-30-DIAS.md`.
5. Só então escalar o canal.

---
Gerado por `scripts/novo_micro_saas.py` · Bíblia completa em `../README.md`
"""

def slugify(texto):
    texto = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", texto.lower()).strip("-") or "meu-saas"

def ler_spec(caminho):
    dados = {}
    for linha in open(caminho, encoding="utf-8"):
        linha = linha.strip()
        if not linha or linha.startswith("#") or ":" not in linha:
            continue
        chave, valor = linha.split(":", 1)
        dados[chave.strip()] = valor.strip()
    return dados

def render(texto, ctx):
    for chave, valor in ctx.items():
        texto = texto.replace("{{" + chave + "}}", str(valor))
    return texto

def main():
    ap = argparse.ArgumentParser(description="Gera um projeto de micro-SaaS preenchido.")
    ap.add_argument("--spec", help="arquivo .yaml/.txt com chave: valor")
    ap.add_argument("--exemplo", action="store_true", help="imprime um spec de exemplo")
    ap.add_argument("--destino", default="projetos", help="pasta de saída (padrão: projetos)")
    args = ap.parse_args()

    if args.exemplo or not args.spec:
        print(EXEMPLO)
        if not args.exemplo:
            print("# Rode com --spec arquivo.yaml para gerar o projeto.", file=sys.stderr)
        return

    spec = ler_spec(args.spec)
    obrigatorios = ["nome", "publico", "dor", "resultado", "preco_mensal"]
    faltando = [c for c in obrigatorios if not spec.get(c)]
    if faltando:
        sys.exit(f"ERRO: preencha no spec: {', '.join(faltando)}")

    spec.setdefault("slug", slugify(spec["nome"]))
    spec.setdefault("autor", "Seu Nome")
    spec.setdefault("email", "voce@seudominio.com")
    spec.setdefault("prazo", "30 dias")
    spec.setdefault("preco_setup", "R$ 0")
    spec.setdefault("garantia", "garantia de satisfação em 30 dias")
    spec.setdefault("canal", "X/LinkedIn + comunidades do nicho")
    spec.setdefault("stack", "Supabase + Next.js + Stripe + LLM via API")
    spec.setdefault("diferenciais", "implantação guiada, relatórios e suporte")
    spec.setdefault("metrica_sucesso", "tempo economizado por semana")
    spec["data"] = datetime.date.today().isoformat()

    destino = os.path.join(RAIZ, args.destino, spec["slug"])
    os.makedirs(destino, exist_ok=True)

    gerados = []
    for template, saida in ARTEFATOS:
        caminho = os.path.join(TEMPLATES, template)
        if not os.path.exists(caminho):
            print(f"AVISO: template ausente: {template}")
            continue
        conteudo = render(open(caminho, encoding="utf-8").read(), spec)
        open(os.path.join(destino, saida), "w", encoding="utf-8").write(conteudo + "\n")
        gerados.append(saida)

    open(os.path.join(destino, "README.md"), "w", encoding="utf-8").write(render(README, spec))
    open(os.path.join(destino, ".env.example"), "w", encoding="utf-8").write(render(ENV, spec))
    json.dump(spec, open(os.path.join(destino, "spec.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    gerados += ["README.md", ".env.example", "spec.json"]

    print(f"OK: projeto criado em {os.path.relpath(destino, RAIZ)}/")
    for g in gerados:
        print(f"  - {g}")
    print("\nPróximos passos: leia CHECKLIST-30-DIAS.md e valide com 15 conversas (docs/02).")

if __name__ == "__main__":
    main()
