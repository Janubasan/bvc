"""
L3-B: TESTE A/B DE CRIATIVOS — estatística honesta, sem auto-engano.

Usa teste z de duas proporções (aproximação normal) + intervalo de
Wilson, com regra sequencial: só declara vencedor com amostra mínima
E p < 0.05 E lift mínimo. Isso evita o clássico erro de afiliado:
pausar criativo bom depois de 40 cliques.
"""

from __future__ import annotations
import math

Z_95 = 1.96


def _phi(x: float) -> float:
    """CDF da normal padrão."""
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def intervalo_wilson(sucessos: int, n: int, z: float = Z_95) -> tuple[float, float]:
    """Intervalo de confiança de Wilson para uma proporção (limites 0..1)."""
    if n <= 0:
        return (0.0, 0.0)
    p = sucessos / n
    denom = 1 + z * z / n
    centro = (p + z * z / (2 * n)) / denom
    meia = (z / denom) * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
    return (max(0.0, centro - meia), min(1.0, centro + meia))


def significancia_ab(
    cliques_a: int, vendas_a: int,
    cliques_b: int, vendas_b: int,
    min_cliques: int = 200,
    min_lift: float = 0.15,
) -> dict:
    """
    Teste A/B de conversão (vendas/cliques) entre duas variantes.

    Retorna dict com: cvr_a, cvr_b, lift, z, p_valor, significativo,
    vencedor ('A'|'B'|None), status ('DECIDIDO'|'AGUARDAR_AMOSTRA'|'SEM_DIFERENCA').
    """
    if min(cliques_a, cliques_b) < min_cliques:
        return {
            "status": "AGUARDAR_AMOSTRA",
            "cvr_a": round(vendas_a / cliques_a, 4) if cliques_a else 0.0,
            "cvr_b": round(vendas_b / cliques_b, 4) if cliques_b else 0.0,
            "significativo": False,
            "vencedor": None,
            "nota": f"amostra mínima: {min_cliques} cliques por variante",
        }

    pa = vendas_a / cliques_a
    pb = vendas_b / cliques_b
    p_pool = (vendas_a + vendas_b) / (cliques_a + cliques_b)

    if p_pool in (0.0, 1.0):
        z, p_valor = 0.0, 1.0
    else:
        se = math.sqrt(p_pool * (1 - p_pool) * (1 / cliques_a + 1 / cliques_b))
        z = (pa - pb) / se if se > 0 else 0.0
        p_valor = 2 * (1 - _phi(abs(z)))

    base = min(pa, pb)
    lift = abs(pa - pb) / base if base > 0 else float("inf")
    significativo = p_valor < 0.05 and lift >= min_lift

    if significativo:
        vencedor = "A" if pa > pb else "B"
        status = "DECIDIDO"
    elif p_valor < 0.05:
        vencedor, status = None, "SEM_DIFERENCA_PRATICA"
    else:
        vencedor, status = None, "SEM_DIFERENCA"

    return {
        "status": status,
        "cvr_a": round(pa, 4),
        "cvr_b": round(pb, 4),
        "lift": round(lift, 3) if lift != float("inf") else None,
        "z": round(z, 3),
        "p_valor": round(p_valor, 4),
        "significativo": significativo,
        "vencedor": vencedor,
        "wilson_a": tuple(round(x, 4) for x in intervalo_wilson(vendas_a, cliques_a)),
        "wilson_b": tuple(round(x, 4) for x in intervalo_wilson(vendas_b, cliques_b)),
    }
