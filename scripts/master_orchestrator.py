#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""BVC-OS — Orquestrador local (dry-run por padrão).

Comandos:
    python3 scripts/master_orchestrator.py init    --slug meu-saas
    python3 scripts/master_orchestrator.py status  --slug meu-saas
    python3 scripts/master_orchestrator.py gates   --slug meu-saas
    python3 scripts/master_orchestrator.py next    --slug meu-saas --comando "/semana"
    python3 scripts/master_orchestrator.py handoff --slug meu-saas --de AG-CANAL --para copywriter \
        --objetivo "10 abordagens para clinicas" --saida "10 mensagens + lista" \
        --criterio "<=90 palavras" --criterio "1 pergunta" --prazo hoje
    python3 scripts/master_orchestrator.py run     --slug meu-saas --comando "/semana"   # só com API key

Por padrão NÃO chama nenhuma API: monta o prompt final (master + estado + comando) para você
colar no seu modelo. Para execução real, exporte BVC_LLM_API_KEY (opcional: BVC_LLM_BASE_URL,
BVC_LLM_MODEL) e use `run`. Toda execução é registrada em projetos/<slug>/logs/.
"""
import argparse, datetime, json, os, sys, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER = os.path.join(RAIZ, "prompts", "00-MASTER-PROMPT.md")
AGENTES = os.path.join(RAIZ, "prompts", "agentes.json")

ESTADO_PADRAO = {
    "slug": "", "nome": "", "percurso_atual": "P1", "etapa": "validacao",
    "publico": "[SEM DADO]", "dor": "[SEM DADO]", "resultado_prometido": "[SEM DADO]",
    "preco": {"setup": "[SEM DADO]", "mensal": "[SEM DADO]"},
    "canal_principal": "[SEM DADO]",
    "metricas": {"conversas": 0, "mensagens_enviadas": 0, "respostas": 0, "testes": 0, "clientes_pagos": 0,
                 "mrr": 0, "churn_pct": None, "ativacao_pct": None, "custo_ia_mes": 0,
                 "receita_recebida": 0, "caixa_usado": 0, "horas_trabalhadas": 0},
    "portas": {g: "pendente" for g in ["G0", "G1", "G2", "G3", "G4", "G5", "G6"]},
    "evidencias": {g: [] for g in ["G0", "G1", "G2", "G3", "G4", "G5", "G6"]},
    "experimentos": [], "riscos": [], "decisoes": [],
    "proximo_passo": "", "ultima_atualizacao": ""
}

def pasta(slug):
    return os.path.join(RAIZ, "projetos", slug)

def caminho_estado(slug):
    return os.path.join(pasta(slug), "estado.json")

def carregar(slug):
    caminho = caminho_estado(slug)
    if not os.path.exists(caminho):
        sys.exit(f"ERRO: estado não encontrado em {caminho}. Rode: python3 scripts/master_orchestrator.py init --slug {slug}")
    return json.load(open(caminho, encoding="utf-8"))

def salvar(slug, estado):
    estado["ultima_atualizacao"] = datetime.date.today().isoformat()
    os.makedirs(pasta(slug), exist_ok=True)
    json.dump(estado, open(caminho_estado(slug), "w", encoding="utf-8"), ensure_ascii=False, indent=2)

def registrar(slug, comando, conteudo):
    d = os.path.join(pasta(slug), "logs")
    os.makedirs(d, exist_ok=True)
    arq = os.path.join(d, f"{datetime.date.today().isoformat()}-{comando.strip('/') or 'run'}.md")
    with open(arq, "a", encoding="utf-8") as f:
        f.write(f"\n\n---\n\n## {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')} — {comando}\n\n{conteudo}\n")
    return arq

# ---------------------------------------------------------------- init
def cmd_init(args):
    os.makedirs(pasta(args.slug), exist_ok=True)
    estado = json.loads(json.dumps(ESTADO_PADRAO))
    estado["slug"] = args.slug

    spec = os.path.join(pasta(args.slug), "spec.json")
    if os.path.exists(spec):
        s = json.load(open(spec, encoding="utf-8"))
        estado["nome"] = s.get("nome", args.slug)
        estado["publico"] = s.get("publico", estado["publico"])
        estado["dor"] = s.get("dor", estado["dor"])
        estado["resultado_prometido"] = s.get("resultado", estado["resultado_prometido"])
        estado["preco"] = {"setup": s.get("preco_setup", "[SEM DADO]"), "mensal": s.get("preco_mensal", "[SEM DADO]")}
        estado["canal_principal"] = s.get("canal", estado["canal_principal"])
    elif not args.nome:
        print("AVISO: sem spec.json no projeto. Informe --nome, --publico, --dor, --preco-mensal.")

    for campo, arg in (("nome", "nome"), ("publico", "publico"), ("dor", "dor")):
        v = getattr(args, arg, None)
        if v:
            estado[campo] = v
    if args.preco_mensal:
        estado["preco"]["mensal"] = args.preco_mensal
    if args.canal:
        estado["canal_principal"] = args.canal

    estado["proximo_passo"] = "Rodar /iniciar no BVC-OS e validar a dor (G0): 15 conversas, 5 com gasto declarado."
    salvar(args.slug, estado)
    print(f"OK: estado criado em projetos/{args.slug}/estado.json")
    print("Próximo: python3 scripts/master_orchestrator.py next --slug", args.slug, '--comando "/iniciar"')

# ---------------------------------------------------------------- status
def cmd_status(args):
    e = carregar(args.slug)
    m = e.get("metricas", {})
    portas = e.get("portas", {})
    print(f"=== BVC-OS | {e.get('nome') or e['slug']} ===")
    print(f"Percurso: {e.get('percurso_atual')} | Etapa: {e.get('etapa')} | Atualizado: {e.get('ultima_atualizacao')}")
    print(f"Público: {e.get('publico')}")
    print(f"Preço: setup {e.get('preco', {}).get('setup')} | mensal {e.get('preco', {}).get('mensal')}")
    print(f"Canal: {e.get('canal_principal')}")
    print("\nMétricas:")
    for k, v in m.items():
        print(f"  - {k}: {v}")
    print("\nPortas:")
    for g in sorted(portas):
        print(f"  - {g}: {portas[g]}")
    pendentes = [g for g, v in portas.items() if v != "aprovada"]
    print(f"\nPróximo passo registrado: {e.get('proximo_passo') or '[SEM DADO]'}")
    print(f"Portas pendentes: {', '.join(sorted(pendentes)) if pendentes else 'nenhuma'}")

# ---------------------------------------------------------------- gates
def cmd_gates(args):
    e = carregar(args.slug)
    m = e.get("metricas", {}) or {}
    p = e.get("preco", {}) or {}

    def num(v, d=0.0):
        try:
            return float(str(v).replace("R$", "").replace(".", "").replace(",", ".").strip())
        except Exception:
            return d

    ticket = num(p.get("mensal"))
    custo_ia = num(m.get("custo_ia_mes"))
    receita = num(m.get("receita_recebida"))
    horas = num(m.get("horas_trabalhadas"))
    clientes = num(m.get("clientes_pagos"))
    conversas = num(m.get("conversas"))
    clientes_por_canal = num(m.get("clientes_por_canal", 0))

    avaliacoes = {}
    avaliacoes["G0"] = ("aprovada" if conversas >= 15 else "pendente",
                        f"{int(conversas)}/15 conversas; evidência de gasto precisa de registro por cliente")
    avaliacoes["G1"] = ("aprovada" if clientes >= 3 else "pendente",
                        f"{int(clientes)}/3 pagos ou pré-pagos")
    avaliacoes["G2"] = (e["portas"].get("G2", "pendente"), "exige 1 cliente com antes/depois medido + depoimento")
    avaliacoes["G3"] = ("pendente", "exige 3 mensalidades ativas + 1 renovação sem desconto")
    avaliacoes["G4"] = ("aprovada" if clientes_por_canal >= 10 else "pendente",
                        f"{int(clientes_por_canal)}/10 clientes do mesmo canal + CAC calculado")
    if receita > 0:
        pct = 100 * custo_ia / receita
        avaliacoes["G5"] = ("aprovada" if pct < 30 else "reprovada", f"custo de IA = {pct:.1f}% da receita (limite 30%)")
    else:
        avaliacoes["G5"] = ("pendente", "[SEM DADO] receita ainda zero")
    avaliacoes["G6"] = (e["portas"].get("G6", "pendente"), "exige 4 semanas sem intervenção manual crítica (runbooks)")

    print(f"=== Auditoria de portas — {e['slug']} ===")
    for g in ["G0", "G1", "G2", "G3", "G4", "G5", "G6"]:
        st, obs = avaliacoes[g]
        print(f"  {g}: {st.upper():10} — {obs}")
    reprovadas = [g for g, (st, _) in avaliacoes.items() if st == "reprovada"]
    if reprovadas:
        print(f"\nATTENCAO: portas reprovadas: {', '.join(reprovadas)} -> conserte antes de escalar (ver prompts/04).")
    if ticket and receita:
        print(f"\nTicket mensal: R$ {ticket:.2f} | Horas registradas: {horas:.1f}h | Custo IA: R$ {custo_ia:.2f}")

# ---------------------------------------------------------------- next
def montar_prompt(slug, comando):
    e = carregar(slug)
    master = open(MASTER, encoding="utf-8").read() if os.path.exists(MASTER) else "[master prompt ausente]"
    return f"""{master}

---

## ESTADO ATUAL DO NEGÓCIO (fonte da verdade)

```json
{json.dumps(e, ensure_ascii=False, indent=2)}
```

---

## COMANDO DO USUÁRIO

{comando or "/status"}

Responda seguindo o FORMATO OBRIGATÓRIO (seção 13). Se algum dado necessário não estiver no estado, use [SEM DADO] e crie o handoff para obtê-lo. Termine com a ação de hoje (15-60 min).
"""

def cmd_next(args):
    texto = montar_prompt(args.slug, args.comando)
    destino = registrar(args.slug, args.comando or "status", texto)
    print(texto)
    print(f"\n[prompt salvo em {os.path.relpath(destino, RAIZ)} — cole no seu modelo principal]")

# ---------------------------------------------------------------- handoff
def cmd_handoff(args):
    e = carregar(args.slug)
    faltando = [c for c in ["de", "para", "objetivo", "saida", "criterio"] if not getattr(args, c)]
    if faltando:
        sys.exit(f"ERRO: informe: {', '.join('--' + f for f in faltando)}")
    d = os.path.join(pasta(args.slug), "handoffs")
    os.makedirs(d, exist_ok=True)
    existentes = [f for f in os.listdir(d) if f.endswith(".json")]
    hid = f"h-{len(existentes) + 1:03d}"
    handoff = {
        "id": hid, "de": args.de, "para": args.para, "objetivo": args.objetivo,
        "contexto": args.contexto or f"publico={e.get('publico')} | dor={e.get('dor')}",
        "entrada": {}, "saida_esperada": args.saida,
        "criterios_aceitacao": args.criterio, "prazo": args.prazo,
        "custo_estimado": {"tempo_h": args.tempo_h, "ia_brl": args.ia_brl},
        "status": "pendente", "resultado": None, "evidencia": [], "aprendizado": ""
    }
    caminho = os.path.join(d, f"{hid}.json")
    json.dump(handoff, open(caminho, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    e.setdefault("decisoes", []).append({"data": datetime.date.today().isoformat(), "tipo": "handoff",
                                         "resumo": f"{handoff['id']}: {args.de} -> {args.para}: {args.objetivo}"})
    salvar(args.slug, e)
    print(f"OK: handoff criado em {os.path.relpath(caminho, RAIZ)}")
    print(json.dumps(handoff, ensure_ascii=False, indent=2))

# ---------------------------------------------------------------- run (opcional)
def cmd_run(args):
    texto = montar_prompt(args.slug, args.comando)
    chave = os.environ.get("BVC_LLM_API_KEY")
    modelo = args.modelo or os.environ.get("BVC_LLM_MODEL", "gpt-4.1-mini")
    base = os.environ.get("BVC_LLM_BASE_URL", "https://api.openai.com/v1")
    if not chave:
        print("MODO DRY-RUN (sem BVC_LLM_API_KEY). Prompt montado abaixo — cole no seu modelo:\n")
        print(texto)
        registrar(args.slug, args.comando or "run", texto)
        return
    corpo = json.dumps({"model": modelo, "messages": [{"role": "user", "content": texto}]}).encode()
    req = urllib.request.Request(f"{base}/chat/completions", data=corpo,
                                 headers={"Authorization": f"Bearer {chave}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            resp = json.loads(r.read())
        resposta = resp["choices"][0]["message"]["content"]
        uso = resp.get("usage", {})
    except Exception as exc:
        sys.exit(f"ERRO na chamada de API: {exc}")
    print(resposta)
    log = (f"modelo: {modelo}\nuso: {json.dumps(uso)}\n\n{resposta}")
    caminho = registrar(args.slug, args.comando or "run", log)
    print(f"\n[resposta registrada em {os.path.relpath(caminho, RAIZ)}]")


def main():
    ap = argparse.ArgumentParser(description="BVC-OS — orquestrador local (dry-run por padrão).")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("init", help="cria/atualiza o estado do negócio")
    p.add_argument("--slug", required=True)
    p.add_argument("--nome"); p.add_argument("--publico"); p.add_argument("--dor")
    p.add_argument("--preco-mensal"); p.add_argument("--canal")
    p.set_defaults(func=cmd_init)

    p = sub.add_parser("status", help="resume o estado")
    p.add_argument("--slug", required=True); p.set_defaults(func=cmd_status)

    p = sub.add_parser("gates", help="audita as portas G0-G6")
    p.add_argument("--slug", required=True); p.set_defaults(func=cmd_gates)

    p = sub.add_parser("next", help="monta o prompt final (master + estado + comando)")
    p.add_argument("--slug", required=True); p.add_argument("--comando", default="/status")
    p.set_defaults(func=cmd_next)

    p = sub.add_parser("handoff", help="cria um handoff validado entre agentes")
    p.add_argument("--slug", required=True); p.add_argument("--de", required=True)
    p.add_argument("--para", required=True); p.add_argument("--objetivo", required=True)
    p.add_argument("--saida", required=True); p.add_argument("--criterio", action="append")
    p.add_argument("--prazo", default="hoje"); p.add_argument("--contexto")
    p.add_argument("--tempo-h", type=float, default=0.5); p.add_argument("--ia-brl", type=float, default=1.0)
    p.set_defaults(func=cmd_handoff)

    p = sub.add_parser("run", help="executa via API (exige BVC_LLM_API_KEY)")
    p.add_argument("--slug", required=True); p.add_argument("--comando", default="/status")
    p.add_argument("--modelo"); p.set_defaults(func=cmd_run)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
