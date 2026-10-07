#!/usr/bin/env python3
"""
HARNESS v2 (JEV-LAYA) — CLI de demonstração completa.

Executa, sem internet e sem dependências externas:
  1. Radar de oportunidades (top 5 do catálogo)
  2. Fluxo LAYA completo do melhor produto (sinais -> JEV -> decisão -> ação)
  3. Teste A/B de criativos com estatística (z + Wilson)
  4. Veredito automático de campanha (com alerta WhatsApp)

Uso:
  python3 harness_cli.py                # demo completa
  python3 harness_cli.py --radar        # só o radar
  python3 harness_cli.py --produto ID   # fluxo de um produto específico
"""

from __future__ import annotations
import argparse
import json
import sys

from jevlaya.radar import radar_do_dia, relatorio_radar_texto
from jevlaya.orquestrador_laya import orquestrar
from jevlaya.dados import PRODUTOS_REFERENCIA
from jevlaya.ab_teste import significancia_ab
from jevlaya.veredito import decidir_veredito


def _div(titulo: str) -> None:
    print("\n" + "═" * 72)
    print(titulo)
    print("═" * 72)


def demo_radar() -> None:
    _div("📡 RADAR DE OPORTUNIDADES")
    print(relatorio_radar_texto())


def demo_fluxo(produto_id: str | None) -> None:
    if produto_id:
        alvo = next((p for p in PRODUTOS_REFERENCIA if p["id"] == produto_id), None)
        if alvo is None:
            ids = ", ".join(p["id"] for p in PRODUTOS_REFERENCIA)
            print(f"produto desconhecido: {produto_id}\ndisponíveis: {ids}")
            sys.exit(1)
    else:
        alvo = PRODUTOS_REFERENCIA[
            [p["id"] for p in PRODUTOS_REFERENCIA].index(radar_do_dia()[0]["id"])
        ]

    _div(f"🔬 FLUXO LAYA COMPLETO — {alvo['nome']}")
    fluxo = orquestrar(alvo)
    print(f"Camadas executadas: {' -> '.join(fluxo['camadas_executadas'])}\n")

    jev = fluxo["jev"]
    for chave in ("J", "E", "V"):
        p = jev[chave]
        print(f"[{chave}] {p['preditor']}: {p['valor']:.3f}")
        print(f"    leitura: {p['leitura']}")
        print(f"    evidência: {json.dumps(p['evidencia'], ensure_ascii=False)}\n")

    d = fluxo["decisao"]
    print(f"SCORE HARNESS: {d['score']['score']} ({d['score']['faixa']})")
    print(f"  componentes: {d['score']['componentes']}")
    print(f"CVR esperada: {d['cvr_esperada']:.2%} | CPC máximo: R$ {d['cpc_maximo']:.3f}")
    print(f"ROAS break-even: {d['roas_break_even_comissao']} (comissão) | "
          f"{d['roas_break_even_plataforma']} (ROAS exibido pela plataforma de ads)\n")

    print("VIAS recomendadas:")
    for v in d["vias"]:
        print(f"  • [{v['modo'].upper():8}] {v['via']}\n      -> {v['motivo']}")

    print(f"\nAÇÃO: {fluxo['acao']['total_variacoes']} variações geradas, "
          f"{fluxo['acao']['aprovados']} aprovadas no compliance")
    exemplo = fluxo["acao"]["criativos"]["tiktok"][2]
    print(f"\nExemplo de criativo [{exemplo['id']}] ({exemplo['canal']}):\n  " +
          exemplo["texto"].replace("\n", "\n  "))


def demo_ab() -> None:
    _div("🧪 TESTE A/B DE CRIATIVOS")
    cenários = {
        "amostra pequena (não decide)": (90, 4, 85, 6),
        "diferença real": (800, 28, 800, 14),
        "ruído sem diferença": (500, 11, 500, 12),
    }
    for nome, args in cenários.items():
        r = significancia_ab(*args)
        print(f"\n— {nome}: A={args[1]}/{args[0]} vs B={args[3]}/{args[2]}")
        print(f"  status={r['status']} | cvrA={r['cvr_a']:.2%} cvrB={r['cvr_b']:.2%} "
              f"| p={r.get('p_valor')} | vencedor={r.get('vencedor')}")


def demo_veredito() -> None:
    _div("⚖️  VEREDITO AUTOMÁTICO DE CAMPANHA")
    casos = [
        ("campanha saudável -> ESCALAR",
         dict(cliques=840, vendas=14, gasto=68.0, receita_comissao=372.20,
              ticket=189.9, comissao_pct=14.0)),
        ("CPC estourado -> PAUSAR",
         dict(cliques=400, vendas=3, gasto=240.0, receita_comissao=59.0,
              ticket=89.9, comissao_pct=8.5)),
        ("sem vendas -> PAUSAR",
         dict(cliques=450, vendas=0, gasto=95.0, receita_comissao=0.0,
              ticket=120.0, comissao_pct=6.0)),
        ("amostra insuficiente -> AGUARDAR",
         dict(cliques=60, vendas=2, gasto=12.0, receita_comissao=28.0,
              ticket=150.0, comissao_pct=10.0)),
    ]
    for nome, kwargs in casos:
        v = decidir_veredito(**kwargs)
        print(f"\n— {nome}")
        print(f"  {v['veredito']}: {v['motivo']}")
        print("  alerta WhatsApp:")
        for linha in v["alerta_whatsapp"].split("\n"):
            print(f"    {linha}")


def main() -> None:
    ap = argparse.ArgumentParser(description="HARNESS v2 — demo JEV-LAYA")
    ap.add_argument("--radar", action="store_true", help="só o radar")
    ap.add_argument("--produto", help="fluxo de um produto específico (id)")
    args = ap.parse_args()

    if args.radar:
        demo_radar()
        return

    print("HARNESS v2 — orquestrador JEV-LAYA para afiliados")
    print("(demo 100% offline; em produção as fontes são as APIs oficiais)")
    demo_radar()
    demo_fluxo(args.produto)
    demo_ab()
    demo_veredito()


if __name__ == "__main__":
    main()
