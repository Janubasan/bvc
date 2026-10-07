"""
JEV-LAYA — Orquestrador de decisão para afiliados (HARNESS v2).

JEV  = os 3 PREDITORES:
    J  -> Janela de Demanda   (tendência + sazonalidade)
    E  -> Evidência Social    (reviews, rating, engajamento de comunidade)
    V  -> Viabilidade de Valor(comissão efetiva x preço x risco)

LAYA = as 4 CAMADAS (LAYers) de orquestração:
    L1 -> COLETA    (dados do produto / mercado / sinais externos)
    L2 -> PREDIÇÃO  (previsores JEV normalizados 0..1 com evidências)
    L3 -> DECISÃO   (Score HARNESS, CPC máximo, veredito, vias/canais)
    L4 -> AÇÃO      (criativos, mensagens de alerta, trilha de auditoria)

Uso rápido:
    from jevlaya import orquestrar
    relatorio = orquestrar(produto, resultados)
"""

from .orquestrador_laya import orquestrar, CAMADAS
from .score import score_harness, cpc_maximo, roas_break_even
from .veredito import decidir_veredito
from .criativos import matriz_criativos
from .ab_teste import significancia_ab, intervalo_wilson

__version__ = "2.0.0"
__all__ = [
    "orquestrar",
    "CAMADAS",
    "score_harness",
    "cpc_maximo",
    "roas_break_even",
    "decidir_veredito",
    "matriz_criativos",
    "significancia_ab",
    "intervalo_wilson",
]
