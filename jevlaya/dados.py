"""
L1: COLETA — catálogo de referência e adaptadores de sinais.

Em produção esta camada troca por integracões reais (mesmo contrato):
  * Shopee Affiliate Open API  -> comissao, vendas, link comissionado
  * Mercado Livre Linkbuilder  -> links meli.la, ofertas do dia
  * Amazon PA-API 5.0          -> preço, rating, disponibilidade
  * Pytrends / Google Trends   -> tendencia_busca
  * Reddit API (PRAW)          -> mencoes_semana, sentimento de nicho
  * TikTok Creative Center     -> hashtags/criativos em alta

O contrato de `sinais` é o MESMO nos dois modos — por isso o resto do
HARNESS funciona hoje, offline, e não muda nada quando plugar as APIs.
"""

from __future__ import annotations

# ---------------------------------------------------------------- catálogo
# Catálogo de referência usado no radar e nos testes.
# Valores montados a partir das faixas reais observadas na pesquisa:
#   - Shopee BR: comissão base ~3-6% + comissão extra até 25-30% em campanha
#   - Info-produtos (Hotmart/Kiwify): 30-60% de comissão
#   - Reviews/ratings: faixas típicas de best-sellers de marketplace
CATEGORIAS = {
    "eletronicos": {"comissao_base": 3.5, "devolucao": 0.07},
    "casa": {"comissao_base": 6.0, "devolucao": 0.04},
    "moda": {"comissao_base": 8.0, "devolucao": 0.09},
    "beleza": {"comissao_base": 7.0, "devolucao": 0.03},
    "infoproduto": {"comissao_base": 40.0, "devolucao": 0.10},
    "suplementos": {"comissao_base": 10.0, "devolucao": 0.02},
}

PRODUTOS_REFERENCIA = [
    {
        "id": "airfryer-4l",
        "nome": "Air Fryer 4L 1500W",
        "categoria": "casa",
        "loja": "shopee",
        "ticket": 219.90,
        "comissao_base_pct": 6.0,
        "comissao_extra_pct": 8.0,     # campanha Comissão Extra ativa
        "num_avaliacoes": 12800,
        "rating_medio": 4.8,
        "mencoes_semana": 420,
        "ugc_disponivel": True,
        "tendencia_busca": 0.35,
        "sazonalidade": 0.7,           # aquece fim de ano / dia das mães
        "momentum_vendas": 0.66,
        "menor_preco_rival": 229.90,
        "concorrencia": 0.75,          # muita gente anuncia
    },
    {
        "id": "fone-tws",
        "nome": "Fone Bluetooth TWS com ANC",
        "categoria": "eletronicos",
        "loja": "shopee",
        "ticket": 79.90,
        "comissao_base_pct": 3.5,
        "comissao_extra_pct": 5.0,
        "num_avaliacoes": 30500,
        "rating_medio": 4.6,
        "mencoes_semana": 810,
        "ugc_disponivel": True,
        "tendencia_busca": 0.12,
        "sazonalidade": 0.4,
        "momentum_vendas": 0.58,
        "menor_preco_rival": 74.90,    # rival mais barato
        "concorrencia": 0.9,
    },
    {
        "id": "luminaria-galaxia",
        "nome": "Luminária Projetor Galáxia",
        "categoria": "casa",
        "loja": "shopee",
        "ticket": 89.90,
        "comissao_base_pct": 6.0,
        "comissao_extra_pct": 10.0,
        "num_avaliacoes": 7600,
        "rating_medio": 4.7,
        "mencoes_semana": 1900,        # viral no TikTok
        "ugc_disponivel": True,
        "tendencia_busca": 0.72,
        "sazonalidade": 0.55,
        "momentum_vendas": 0.81,
        "menor_preco_rival": 99.90,
        "concorrencia": 0.45,
    },
    {
        "id": "curso-renda-extra",
        "nome": "Curso: Renda Extra com Canva (Kiwify)",
        "categoria": "infoproduto",
        "loja": "kiwify",
        "ticket": 97.00,
        "comissao_base_pct": 40.0,
        "comissao_extra_pct": 0.0,
        "num_avaliacoes": 890,
        "rating_medio": 4.5,
        "mencoes_semana": 95,
        "ugc_disponivel": False,
        "tendencia_busca": 0.28,
        "sazonalidade": 0.3,
        "momentum_vendas": 0.49,
        "menor_preco_rival": 97.00,
        "concorrencia": 0.6,
    },
    {
        "id": "kit-skincare",
        "nome": "Kit Skincare Vitamina C",
        "categoria": "beleza",
        "loja": "shopee",
        "ticket": 59.90,
        "comissao_base_pct": 7.0,
        "comissao_extra_pct": 6.0,
        "num_avaliacoes": 5400,
        "rating_medio": 4.9,
        "mencoes_semana": 640,
        "ugc_disponivel": True,
        "tendencia_busca": 0.41,
        "sazonalidade": 0.5,
        "momentum_vendas": 0.62,
        "menor_preco_rival": 64.90,
        "concorrencia": 0.55,
    },
    {
        "id": "whey-concentrado",
        "nome": "Whey Protein Concentrado 900g",
        "categoria": "suplementos",
        "loja": "shopee",
        "ticket": 89.00,
        "comissao_base_pct": 10.0,
        "comissao_extra_pct": 0.0,
        "num_avaliacoes": 2100,
        "rating_medio": 4.3,
        "mencoes_semana": 150,
        "ugc_disponivel": False,
        "tendencia_busca": -0.1,
        "sazonalidade": 0.35,
        "momentum_vendas": 0.4,
        "menor_preco_rival": 79.90,
        "concorrencia": 0.7,
    },
]


def coletar_sinais(produto: dict) -> dict:
    """
    L1 oficial: devolve o dicionário de sinais no contrato JEV.
    Em produção, substituir o corpo por chamadas de API mantendo o contrato.
    """
    cat = CATEGORIAS.get(produto.get("categoria", "casa"), CATEGORIAS["casa"])
    return {
        "tendencia_busca": produto.get("tendencia_busca", 0.0),
        "sazonalidade": produto.get("sazonalidade", 0.3),
        "momentum_vendas": produto.get("momentum_vendas", 0.5),
        "num_avaliacoes": produto.get("num_avaliacoes", 0),
        "rating_medio": produto.get("rating_medio", 0.0),
        "mencoes_semana": produto.get("mencoes_semana", 0),
        "ugc_disponivel": produto.get("ugc_disponivel", False),
        "comissao_base_pct": produto.get("comissao_base_pct", cat["comissao_base"]),
        "comissao_extra_pct": produto.get("comissao_extra_pct", 0.0),
        "ticket": produto.get("ticket", 0.0),
        "menor_preco_rival": produto.get("menor_preco_rival", produto.get("ticket")),
        "taxa_devolucao": cat["devolucao"],
    }
