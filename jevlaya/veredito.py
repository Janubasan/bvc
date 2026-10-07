"""
L3-C: VEREDITO AUTOMÁTICO — a decisão que o afiliado paga para receber.

Entrada : métricas da campanha (cliques, vendas, gasto, receita de comissão)
          + parâmetros do produto (ticket, comissão %, CPC máximo).
Saída   : ESCALAR | OTIMIZAR | AGUARDAR | PAUSAR
          + alerta pronto para WhatsApp/Telegram.

Convenção de ROAS usada aqui (ROAS DE COMISSÃO, a única honesta p/ afiliado):
    roas = receita_de_comissao / gasto_em_ads
    break-even = 1.0  (cada R$1 gasto precisa voltar >= R$1 em comissão)
Não usamos ROAS sobre o GMV da venda, porque o afiliado não recebe o GMV —
recebe só a comissão. Usar 1/comissao% como break-even inflaria a meta.

Regras (validadas no MVP e mantidas como política pública do produto):
  1. Amostras pequenas (cliques < minimo) nunca decidem        -> AGUARDAR.
  2. CPC real > CPC máximo                                      -> PAUSAR.
  3. Sem nenhuma venda após 3x a amostra mínima                 -> PAUSAR.
  4. ROAS_comissao >= 1.2 e >= 3 vendas                          -> ESCALAR.
  5. ROAS_comissao entre 0.8 e 1.2                               -> OTIMIZAR.
"""

from __future__ import annotations
from .score import cpc_maximo


def decidir_veredito(
    cliques: int,
    vendas: int,
    gasto: float,
    receita_comissao: float,
    ticket: float,
    comissao_pct: float,
    cvr_esperada: float = 0.015,
    min_cliques: int = 100,
    margem_seguranca: float = 0.8,
) -> dict:
    cpc_real = gasto / cliques if cliques else 0.0
    cpc_teto = cpc_maximo(ticket, comissao_pct, cvr_esperada, margem_seguranca)
    cvr_real = vendas / cliques if cliques else 0.0
    roas = receita_comissao / gasto if gasto else 0.0   # ROAS de comissão
    break_even = 1.0                                     # R$1 de comissão por R$1 gasto

    if cliques < min_cliques:
        veredito = "AGUARDAR"
        motivo = (
            f"Amostra insuficiente: {cliques}/{min_cliques} cliques. "
            "Decisão com pouca amostra é chute — o HARNESS não chuta."
        )
    elif cpc_real > cpc_teto:
        veredito = "PAUSAR"
        motivo = (
            f"CPC real (R$ {cpc_real:,.3f}) estourou o máximo (R$ {cpc_teto:,.3f}). "
            "Cada clique está comprando prejuízo."
        )
    elif vendas == 0 and cliques >= 3 * min_cliques:
        veredito = "PAUSAR"
        motivo = (
            f"{cliques} cliques e ZERO vendas. Produto, página ou público errado — "
            "troque o ângulo antes de gastar mais."
        )
    elif roas >= 1.2 * break_even and vendas >= 3:
        veredito = "ESCALAR"
        motivo = (
            f"ROAS {roas:,.2f} acima do break-even ({break_even:,.2f}) com folga "
            f"e {vendas} vendas confirmadas. Aumente 20-30% do orçamento por vez."
        )
    elif roas >= 0.8 * break_even:
        veredito = "OTIMIZAR"
        motivo = (
            f"ROAS {roas:,.2f} perto do break-even ({break_even:,.2f}). "
            "Não pause: troque o criativo perdedor e refine o público."
        )
    else:
        veredito = "PAUSAR"
        motivo = (
            f"ROAS {roas:,.2f} abaixo de 80% do break-even ({break_even:,.2f}). "
            "Continuar é financiar a plataforma de anúncios."
        )

    return {
        "veredito": veredito,
        "motivo": motivo,
        "metricas": {
            "cliques": cliques,
            "vendas": vendas,
            "cpc_real": round(cpc_real, 4),
            "cpc_maximo": cpc_teto,
            "cvr_real": round(cvr_real, 4),
            "roas": round(roas, 3),
            "roas_break_even": break_even,
            "lucro": round(receita_comissao - gasto, 2),
        },
        "alerta_whatsapp": (
            f"🤖 HARNESS — {veredito}\n"
            f"CPC real: R$ {cpc_real:,.3f} | CPC máx: R$ {cpc_teto:,.3f}\n"
            f"ROAS: {roas:,.2f} (mínimo: {break_even:,.2f}) | Lucro: R$ {receita_comissao - gasto:,.2f}\n"
            f"→ {motivo}"
        ),
    }
