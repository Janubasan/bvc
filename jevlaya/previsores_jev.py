"""
L2: PREDITORES JEV — a camada de inteligência do HARNESS.

Cada preditor recebe os sinais coletados em L1 e devolve um valor 0..1
com a EVIDÊNCIA usada (auditável — nada de caixa-preta).

J — JANELA DE DEMANDA
    O produto está numa janela de compra ascendente?
    Sinais: tendência de busca (Google Trends-like), sazonalidade,
    momentum de vendas recentes.

E — EVIDÊNCIA SOCIAL
    O mercado já validou o produto?
    Sinais: nº de avaliações, rating médio, engajamento em comunidades
    (Reddit/Telegram/TikTok), UGC disponível para reaproveitar.

V — VIABILIDADE DE VALOR
    A conta fecha para o afiliado?
    Sinais: comissão efetiva (base + bônus), ticket, paridade de preço
    entre lojas, risco de devolução/cancelamento.

Em produção, os sinais vêm de:
  * Google Trends API / Pytrends (J)
  * API de afiliados Shopee/ML/Amazon + scraper de reviews (E)
  * Reddit API, TikTok Creative Center, Kwai trends (J/E)
  * Tabelas de comissão oficiais + campanhas de Comissão Extra (V)
No MVP validado (este repo), os sinais entram como dicionário e a
orquestração já funciona offline — plugar as fontes reais é só trocar
a função `coletar_sinais` em dados.py.
"""

from __future__ import annotations
import math


def _clip01(x: float) -> float:
    return max(0.0, min(1.0, float(x)))


def preditor_janela_demanda(sinais: dict) -> dict:
    """
    J: 0..1.
    sinais esperados:
      tendencia_busca      : -1..+1 (queda..alta no Google Trends 90d)
      sazonalidade         : 0..1   (força da data sazonal vigente)
      momentum_vendas      : 0..1   (variação normalizada de vendas 30d)
    """
    tendencia = sinais.get("tendencia_busca", 0.0)          # -1..1
    sazonal = _clip01(sinais.get("sazonalidade", 0.0))
    momentum = _clip01(sinais.get("momentum_vendas", 0.0))

    tendencia_norm = (tendencia + 1.0) / 2.0                 # 0..1
    valor = 0.45 * tendencia_norm + 0.25 * sazonal + 0.30 * momentum

    return {
        "preditor": "JANELA_DEMANDA",
        "valor": round(valor, 3),
        "evidencia": {
            "tendencia_busca": round(tendencia_norm, 3),
            "sazonalidade": round(sazonal, 3),
            "momentum_vendas": round(momentum, 3),
        },
        "leitura": (
            "janela ascendente — entrar agora" if valor >= 0.66
            else "janela estável — ok para orgânico" if valor >= 0.4
            else "janela em queda — evitar tráfego pago"
        ),
    }


def preditor_evidencia_social(sinais: dict) -> dict:
    """
    E: 0..1.
    sinais esperados:
      num_avaliacoes : int    (reviews acumulados no marketplace)
      rating_medio   : float  (0..5)
      mencoes_semana : int    (menções em comunidades/hashtags)
      ugc_disponivel : bool   (há vídeos de terceiros para modelar)
    """
    reviews = max(0, int(sinais.get("num_avaliacoes", 0)))
    rating = _clip01(sinais.get("rating_medio", 0.0) / 5.0)
    mencoes = max(0, int(sinais.get("mencoes_semana", 0)))
    ugc = 1.0 if sinais.get("ugc_disponivel") else 0.0

    # log(1+x) comprime cauda longa: 100 reviews já é prova forte
    prova_reviews = min(1.0, math.log1p(reviews) / math.log1p(10_000))
    buzz = min(1.0, math.log1p(mencoes) / math.log1p(1_000))

    valor = 0.40 * prova_reviews + 0.30 * rating + 0.15 * buzz + 0.15 * ugc
    return {
        "preditor": "EVIDENCIA_SOCIAL",
        "valor": round(valor, 3),
        "evidencia": {
            "prova_reviews": round(prova_reviews, 3),
            "rating": round(rating, 3),
            "buzz_comunidade": round(buzz, 3),
            "ugc_modelavel": ugc,
        },
        "leitura": (
            "produto validado pelo mercado — use prova social no criativo"
            if valor >= 0.6
            else "validação parcial — teste com pouco orçamento"
            if valor >= 0.35
            else "sem prova social — risco alto, só orgânico"
        ),
    }


def preditor_viabilidade_valor(sinais: dict) -> dict:
    """
    V: 0..1.
    sinais esperados:
      comissao_base_pct   : float (ex.: 6)
      comissao_extra_pct  : float (campanhas de comissão extra, ex.: 8)
      ticket              : float (preço R$)
      menor_preco_rival   : float (menor preço do mesmo item em outra loja)
      taxa_devolucao      : float (0..1, histórico da categoria)
    """
    base = max(0.0, float(sinais.get("comissao_base_pct", 0.0)))
    extra = max(0.0, float(sinais.get("comissao_extra_pct", 0.0)))
    ticket = max(0.0, float(sinais.get("ticket", 0.0)))
    rival = float(sinais.get("menor_preco_rival", 0.0)) or ticket
    devolucao = _clip01(sinais.get("taxa_devolucao", 0.05))

    comissao_efetiva = min(base + extra, 40.0)               # teto realista
    com_norm = _clip01(comissao_efetiva / 15.0)              # 15% = teto marketplace
    # ticket doce p/ impulso no BR: R$ 40-300. Muito caro derruba CVR orgânica
    ticket_doce = 1.0 if 40 <= ticket <= 300 else max(0.2, 1 - abs(math.log10(max(ticket, 1) / 120)))
    # paridade: rival mais barato que você penaliza (<1); mais caro ou igual = 1
    paridade = 1.0 if rival <= 0 else _clip01(min(rival, ticket) / ticket)
    risco = 1.0 - devolucao

    valor = 0.40 * com_norm + 0.25 * ticket_doce + 0.20 * paridade + 0.15 * risco
    return {
        "preditor": "VIABILIDADE_VALOR",
        "valor": round(valor, 3),
        "evidencia": {
            "comissao_efetiva_pct": round(comissao_efetiva, 1),
            "ticket_doce": round(ticket_doce, 3),
            "paridade_preco": round(paridade, 3),
            "risco_devolucao": round(risco, 3),
        },
        "leitura": (
            "conta fecha no pago — CPC máximo liberado" if valor >= 0.6
            else "conta fecha só no orgânico/bônus de campanha" if valor >= 0.4
            else "margem insuficiente — descarte ou só cupom"
        ),
    }


def rodar_previsores(sinais: dict) -> dict:
    """Executa os 3 preditores JEV e devolve o vetor completo."""
    j = preditor_janela_demanda(sinais)
    e = preditor_evidencia_social(sinais)
    v = preditor_viabilidade_valor(sinais)
    # Peso: valor manda (dinheiro), demanda vem depois, prova social sustenta
    combinado = 0.40 * v["valor"] + 0.35 * j["valor"] + 0.25 * e["valor"]
    return {
        "J": j,
        "E": e,
        "V": v,
        "jev_composto": round(combinado, 3),
    }
