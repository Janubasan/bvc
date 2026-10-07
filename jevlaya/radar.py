"""
Pilar 1 — RADAR DE OPORTUNIDADES.

Varre o catálogo (em produção: APIs de afiliados + scrapers autorizados),
passa cada produto pelo fluxo LAYA e devolve o ranking do dia.
É a tela "HOJE" do produto: os 5 produtos com maior score + por quê.
"""

from __future__ import annotations
from .dados import PRODUTOS_REFERENCIA
from .orquestrador_laya import orquestrar


def radar_do_dia(catalogo: list[dict] | None = None, top_n: int = 5) -> list[dict]:
    """Rankeia o catálogo pelo fluxo LAYA e devolve o top N."""
    catalogo = catalogo if catalogo is not None else PRODUTOS_REFERENCIA
    resultados = []
    for produto in catalogo:
        fluxo = orquestrar(produto)
        d = fluxo["decisao"]
        resultados.append({
            "id": produto["id"],
            "nome": produto["nome"],
            "loja": produto.get("loja"),
            "score": d["score"]["score"],
            "faixa": d["score"]["faixa"],
            "jev": d["jev_composto"],
            "cpc_maximo": d["cpc_maximo"],
            "via_principal": d["vias"][0]["via"],
            "leitura_J": fluxo["jev"]["J"]["leitura"],
            "leitura_E": fluxo["jev"]["E"]["leitura"],
            "leitura_V": fluxo["jev"]["V"]["leitura"],
        })
    resultados.sort(key=lambda r: r["score"], reverse=True)
    return resultados[:top_n]


def relatorio_radar_texto(catalogo: list[dict] | None = None, top_n: int = 5) -> str:
    linhas = ["═" * 72, "📡 RADAR DE OPORTUNIDADES — HARNESS/JEV-LAYA", "═" * 72]
    for i, r in enumerate(radar_do_dia(catalogo, top_n), 1):
        linhas += [
            f"{i}. {r['nome']}  [{r['faixa']}]  score={r['score']}",
            f"   JEV composto: {r['jev']} | CPC máx: R$ {r['cpc_maximo']:.3f} | via: {r['via_principal']}",
            f"   J: {r['leitura_J']}",
            f"   E: {r['leitura_E']}",
            f"   V: {r['leitura_V']}",
            "",
        ]
    return "\n".join(linhas)
