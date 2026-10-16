#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""BVC-OS — Unidade econômica e painel de caixa.

Lê projetos/<slug>/estado.json e calcula: ticket, CAC, LTV, payback, margem bruta,
custo de IA por cliente, runway e o painel de 8 números do AG-CAIXA.

Uso:
    python3 scripts/calcular_unidade.py --slug meu-saas
    python3 scripts/calcular_unidade.py --slug meu-saas --horas 12 --valor-hora 60 --ferramentas 300 --caixa 3000 --custo-fixo 500
    python3 scripts/calcular_unidade.py --slug meu-saas --json

Convenções:
  - horas * valor-hora + ferramentas = custo de aquisição do período (CAC do período).
  - o script NÃO inventa números: campos sem dado aparecem como [SEM DADO].
"""
import argparse, json, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIMITE_MARGEM = 70.0          # margem bruta mínima saudável (%)
LIMITE_CUSTO_IA = 30.0        # custo de IA + infra máximo (% da receita)
LIMITE_LTV_CAC = 3.0
LIMITE_PAYBACK = 12.0         # meses
LIMITE_RUNWAY = 6.0           # meses

def num(v, default=None):
    if v is None:
        return default
    try:
        return float(str(v).replace("R$", "").replace(".", "").replace(",", ".").strip())
    except Exception:
        return default

def brl(v):
    return "[SEM DADO]" if v is None else f"R$ {v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

def fmt(v, sufixo="", casas=2):
    return "[SEM DADO]" if v is None else f"{v:,.{casas}f}{sufixo}".replace(",", "X").replace(".", ",").replace("X", ".")

def sem_dado(v, rotulo):
    return rotulo if v is None else v

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--horas", type=float, help="horas trabalhadas no período (aquisição/entrega)")
    ap.add_argument("--valor-hora", type=float, default=50.0)
    ap.add_argument("--ferramentas", type=float, default=0.0, help="gasto com ferramentas/ads no período (R$)")
    ap.add_argument("--caixa", type=float, help="caixa disponível (R$)")
    ap.add_argument("--custo-fixo", type=float, help="custo fixo mensal (R$)")
    ap.add_argument("--json", action="store_true", help="imprime só o JSON")
    args = ap.parse_args()

    caminho = os.path.join(RAIZ, "projetos", args.slug, "estado.json")
    if not os.path.exists(caminho):
        sys.exit(f"ERRO: não encontrei {caminho}. Rode o master_orchestrator.py init primeiro.")
    e = json.load(open(caminho, encoding="utf-8"))
    m = e.get("metricas", {}) or {}
    p = e.get("preco", {}) or {}

    ticket = num(p.get("mensal"))
    clientes = num(m.get("clientes_pagos"), 0.0)
    clientes_novos = num(m.get("clientes_novos"), clientes)
    receita = num(m.get("receita_recebida"), 0.0)
    custo_ia = num(m.get("custo_ia_mes"), 0.0)
    churn_pct = num(m.get("churn_pct"))
    horas = args.horas if args.horas is not None else num(m.get("horas_trabalhadas"))
    valor_hora = args.valor_hora
    ferramentas = args.ferramentas

    custo_aquisicao = None
    cac = None
    if horas is not None:
        custo_aquisicao = horas * valor_hora + ferramentas
        cac = (custo_aquisicao / clientes_novos) if clientes_novos else None

    ltv = (ticket / (churn_pct / 100.0)) if (ticket and churn_pct) else None
    ltv_cac = (ltv / cac) if (ltv and cac) else None
    margem_bruta = ((receita - custo_ia) / receita * 100) if receita else None
    payback = (cac / (ticket * (margem_bruta / 100))) if (cac and ticket and margem_bruta) else None
    custo_ia_cliente = (custo_ia / clientes) if clientes else None
    runway = (args.caixa / args.custo_fixo) if (args.caixa and args.custo_fixo) else None
    mrr = num(m.get("mrr"), 0.0)

    painel = {
        "ticket_mensal": ticket, "clientes_pagos": clientes, "mrr": mrr,
        "receita_recebida": receita, "cac": cac, "ltv": ltv, "ltv_cac": ltv_cac,
        "payback_meses": payback, "margem_bruta_pct": margem_bruta,
        "custo_ia_mes": custo_ia, "custo_ia_por_cliente": custo_ia_cliente,
        "runway_meses": runway, "horas_periodo": horas,
    }
    alertas = []
    if margem_bruta is not None and margem_bruta < LIMITE_MARGEM:
        alertas.append(f"Margem bruta {margem_bruta:.1f}% abaixo de {LIMITE_MARGEM:.0f}% — reduza custo de IA ou reprecifique.")
    if custo_ia_cliente is not None and ticket and custo_ia_cliente > 0.10 * ticket:
        alertas.append(f"Custo de IA por cliente ({brl(custo_ia_cliente)}) acima de 10% do ticket.")
    if ltv_cac is not None and ltv_cac < LIMITE_LTV_CAC:
        alertas.append(f"LTV/CAC {ltv_cac:.2f} abaixo de {LIMITE_LTV_CAC:.0f} — canal não é sustentável.")
    if payback is not None and payback > LIMITE_PAYBACK:
        alertas.append(f"Payback {payback:.1f} meses acima de {LIMITE_PAYBACK:.0f} — reforce oferta/ticket.")
    if runway is not None and runway < LIMITE_RUNWAY:
        alertas.append(f"Runway {runway:.1f} meses abaixo de {LIMITE_RUNWAY:.0f} — modo P1 (caixa rápido).")
    if receita and custo_ia and (100 * custo_ia / receita) > LIMITE_CUSTO_IA:
        alertas.append(f"Custo de IA = {100 * custo_ia / receita:.1f}% da receita (limite {LIMITE_CUSTO_IA:.0f}%) — bloqueia G5.")

    if args.json:
        print(json.dumps({"painel": painel, "alertas": alertas}, ensure_ascii=False, indent=2))
        return

    print(f"=== Unidade econômica — {e.get('nome') or args.slug} ===")
    print(f"{'ticket mensal':28} {brl(ticket)}")
    print(f"{'clientes pagos':28} {clientes if clientes else '[SEM DADO]'}")
    print(f"{'MRR':28} {brl(mrr)}")
    print(f"{'receita recebida (período)':28} {brl(receita)}")
    print(f"{'CAC (período)':28} {brl(cac)}   [base: {('%.1f h x R$ %.2f' % (horas, valor_hora)) if horas is not None else '[SEM DADO] horas'} + {brl(ferramentas)} ferramentas]")
    print(f"{'LTV':28} {brl(ltv)}   [churn {fmt(churn_pct, '%')}]")
    print(f"{'LTV / CAC':28} {sem_dado(fmt(ltv_cac), '[SEM DADO]')}")
    print(f"{'payback':28} {sem_dado(fmt(payback, ' meses'), '[SEM DADO]')}")
    print(f"{'margem bruta':28} {sem_dado(fmt(margem_bruta, '%'), '[SEM DADO]')}")
    print(f"{'custo de IA / mês':28} {brl(custo_ia)}")
    print(f"{'custo de IA / cliente':28} {brl(custo_ia_cliente)}")
    print(f"{'runway':28} {sem_dado(fmt(runway, ' meses'), '[SEM DADO]')}")
    print("\nAlertas:")
    if alertas:
        for a in alertas:
            print("  ! " + a)
    else:
        print("  nenhum (ou dados insuficientes para avaliar)")
    print("\nPróxima coleta obrigatória: churn_pct, horas_trabalhadas, clientes_novos e custo_ia_mes no estado.json")

if __name__ == "__main__":
    main()
