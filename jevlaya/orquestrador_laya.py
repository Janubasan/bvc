"""
LAYA — orquestrador de fluxo em 4 camadas (LAYers).

    L1 COLETA   -> dados.py.coletar_sinais()
    L2 PREDICAO -> previsores_jev.rodar_previsores()
    L3 DECISAO  -> score_harness + cpc_maximo + veredito + vias
    L4 ACAO     -> matriz de criativos + alerta + plano de execução

Cada camada registra entrada/saída na trilha de auditoria — o afiliado
(e o suporte do SaaS) consegue explicar QUALQUER decisão em 30 segundos.
Essa auditabilidade é argumento de venda: "nenhuma decisão é caixa-preta".
"""

from __future__ import annotations
from datetime import datetime, timezone

from .dados import coletar_sinais
from .previsores_jev import rodar_previsores
from .score import score_harness, cpc_maximo, roas_break_even
from .veredito import decidir_veredito
from .criativos import matriz_criativos, CANAIS

CAMADAS = ("L1_COLETA", "L2_PREDICAO", "L3_DECISAO", "L4_ACAO")


def vias_recomendadas(produto: dict, jev: dict) -> list[dict]:
    """
    L3-D: VIAS — por onde escoar o produto. Heurística transparente:
      - infoproduto/comissão alta      -> tráfego pago Meta/TikTok + advertorial
      - UGC + buzz alto                -> TikTok/Kwai orgânico (trend surf)
      - ticket baixo + desconto        -> grupos de oferta Telegram/WhatsApp
      - ticket >= 150                  -> review comparativo Reels/Shorts
    """
    vias = []
    comissao = jev["V"]["evidencia"]["comissao_efetiva_pct"]
    buzz = jev["E"]["evidencia"]["buzz_comunidade"]
    ugc = jev["E"]["evidencia"]["ugc_modelavel"]
    ticket = produto.get("ticket", 0)
    tende_desconto = produto.get("menor_preco_rival", ticket) >= ticket

    if comissao >= 25:
        vias.append({
            "via": "Meta/TikTok Ads (pago)",
            "modo": "pago",
            "motivo": f"comissão efetiva de {comissao:.0f}% sustenta CPC pago com folga",
        })
        vias.append({
            "via": "Advertorial/landing de pré-venda",
            "modo": "pago",
            "motivo": "página intermediária dobra CVR em infoproduto e protege a conta de anúncios",
        })
    if ugc and buzz >= 0.5:
        vias.append({
            "via": "TikTok/Kwai orgânico (modelar UGC em alta)",
            "modo": "organico",
            "motivo": "produto com buzz e vídeos de terceiros para modelar — custo zero de produção",
        })
    if ticket <= 120 and tende_desconto:
        vias.append({
            "via": "Canal de ofertas Telegram/WhatsApp",
            "modo": "organico",
            "motivo": "ticket de impulso + paridade de preço boa — conversão por urgência de desconto",
        })
    if ticket >= 150:
        vias.append({
            "via": "Reels/Shorts comparativo ('vale a pena?')",
            "modo": "organico",
            "motivo": "ticket médio-alto pede redução de dúvida antes do clique",
        })
    if not vias:
        vias.append({
            "via": "Pinterest + SEO de nicho",
            "modo": "organico",
            "motivo": "sem alavanca imediata: construir tráfego de cauda longa",
        })
    return vias


def orquestrar(
    produto: dict,
    campanha: dict | None = None,
    canais_criativos: tuple = ("tiktok", "telegram"),
) -> dict:
    """
    Executa o fluxo LAYA completo para UM produto.

    produto  : dict com campos do catálogo (ver dados.py)
    campanha : opcional {cliques, vendas, gasto, receita_comissao}
    """
    auditoria = []

    def log(camada, payload):
        auditoria.append({
            "camada": camada,
            "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "payload": payload,
        })

    # ---- L1 COLETA
    sinais = coletar_sinais(produto)
    log("L1_COLETA", {"sinais": sinais})

    # ---- L2 PREDICAO (JEV)
    jev = rodar_previsores(sinais)
    log("L2_PREDICAO", {k: v for k, v in jev.items() if k != "jev_composto"} |
        {"jev_composto": jev["jev_composto"]})

    # ---- L3 DECISAO
    score = score_harness(
        procura=0.5 * jev["J"]["valor"] + 0.5 * sinais["momentum_vendas"],
        comissao_pct=jev["V"]["evidencia"]["comissao_efetiva_pct"],
        concorrencia=produto.get("concorrencia", 0.5),
    )
    cvr_esperada = 0.01 + 0.02 * jev["E"]["valor"]  # prova social eleva CVR esperada
    cpc_teto = cpc_maximo(produto["ticket"],
                          jev["V"]["evidencia"]["comissao_efetiva_pct"],
                          cvr_esperada)
    vias = vias_recomendadas(produto, jev)

    veredito = None
    if campanha:
        veredito = decidir_veredito(
            cliques=campanha.get("cliques", 0),
            vendas=campanha.get("vendas", 0),
            gasto=campanha.get("gasto", 0.0),
            receita_comissao=campanha.get("receita_comissao", 0.0),
            ticket=produto["ticket"],
            comissao_pct=jev["V"]["evidencia"]["comissao_efetiva_pct"],
            cvr_esperada=cvr_esperada,
        )
    decisao = {
        "score": score,
        "jev_composto": jev["jev_composto"],
        "cvr_esperada": round(cvr_esperada, 4),
        "cpc_maximo": cpc_teto,
        # ROAS de comissão: break-even sempre 1.0 (ver veredito.py)
        "roas_break_even_comissao": 1.0,
        # ROAS que Meta/Google Ads exibem (valor da compra / gasto):
        "roas_break_even_plataforma": roas_break_even(
            jev["V"]["evidencia"]["comissao_efetiva_pct"]
        ),
        "vias": vias,
        "veredito": veredito,
    }
    log("L3_DECISAO", {"score": score["score"], "faixa": score["faixa"],
                       "cpc_maximo": cpc_teto, "vias": [v["via"] for v in vias],
                       "veredito": veredito["veredito"] if veredito else None})

    # ---- L4 ACAO
    criativos = {c: matriz_criativos(produto, canal=c) for c in canais_criativos}
    acao = {
        "criativos": criativos,
        "total_variacoes": sum(len(v) for v in criativos.values()),
        "aprovados": sum(1 for v in criativos.values() for c in v if c["aprovado"]),
        "alerta": veredito["alerta_whatsapp"] if veredito else None,
    }
    log("L4_ACAO", {"variacoes": acao["total_variacoes"], "aprovadas": acao["aprovados"]})

    return {
        "produto": produto["nome"],
        "camadas_executadas": CAMADAS,
        "sinais": sinais,
        "jev": jev,
        "decisao": decisao,
        "acao": acao,
        "auditoria": auditoria,
    }
