"""
L3-A: Pontuação HARNESS e matemática financeira do afiliado.

Fórmula original do MVP (validada e mantida):
    Score = Procura_norm * 40 + Comissão_norm * 30 + (1 - Concorrência_norm) * 30
Tudo normalizado para 0..1, resultando em Score 0..100.

Matemática de tráfego pago (o coração do produto):
    comissão_por_venda = ticket * (comissao_pct / 100)
    CPC_MAXIMO         = comissão_por_venda * CVR_estimada * margem_segurança
    ROAS_BREAK_EVEN    = 1 / (comissao_pct / 100)

Exemplo real ( Shopee, comissão efetiva ~10%, ticket R$ 89, CVR 1,5% ):
    comissão_por_venda = 8,90
    cpc_max (margem 0.8) = 8,90 * 0,015 * 0,8 = R$ 0,107
    => qualquer clique acima de R$ 0,10 destrói a margem. Por isso o
       afiliado precisa de CPCs baixos (TikTok/Kwai BR: R$ 0,05-0,30)
       OU de ticket/comissão maiores (produtos digitais: 30-60%).
"""

from dataclasses import dataclass


def _clip01(x: float) -> float:
    return max(0.0, min(1.0, float(x)))


def normalizar_comissao(comissao_pct: float, teto_pct: float = 15.0) -> float:
    """Comissão em % do ticket normalizada 0..1 (teto típico de marketplace)."""
    return _clip01(comissao_pct / teto_pct)


def score_harness(
    procura: float,
    comissao_pct: float,
    concorrencia: float,
    teto_comissao: float = 15.0,
) -> dict:
    """
    Score HARNESS 0..100.

    procura      : 0..1 (volume de busca/demanda normalizado)
    comissao_pct : % do ticket (ex.: 10.0)
    concorrencia : 0..1 (densidade de anúncios/afiliados no nicho)
    """
    procura = _clip01(procura)
    concorrencia = _clip01(concorrencia)
    com_norm = normalizar_comissao(comissao_pct, teto_comissao)

    score = 40.0 * procura + 30.0 * com_norm + 30.0 * (1.0 - concorrencia)
    return {
        "score": round(score, 1),
        "componentes": {
            "procura": round(procura * 40, 1),
            "comissao": round(com_norm * 30, 1),
            "concorrencia": round((1 - concorrencia) * 30, 1),
        },
        "faixa": (
            "QUENTE" if score >= 70 else "MORNO" if score >= 45 else "FRIO"
        ),
    }


def cpc_maximo(
    ticket: float,
    comissao_pct: float,
    cvr_estimada: float,
    margem_seguranca: float = 0.8,
) -> float:
    """
    CPC máximo (R$) que mantém ROAS positivo com folga.

    ticket           : preço do produto (R$)
    comissao_pct     : comissão efetiva % (base + bônus de campanha)
    cvr_estimada     : taxa de conversão clique->venda esperada (0..1)
    margem_seguranca : fração da margem que você aceita gastar (0.8 = deixa 20% de lucro)
    """
    if ticket <= 0 or cvr_estimada <= 0:
        return 0.0
    comissao_por_venda = ticket * (_clip01(comissao_pct / 100.0) if comissao_pct > 1 else comissao_pct)
    return round(comissao_por_venda * _clip01(cvr_estimada) * margem_seguranca, 4)


def roas_break_even(comissao_pct: float) -> float:
    """ROAS mínimo para não perder dinheiro (receita_total / gasto_em_ads)."""
    c = comissao_pct / 100.0 if comissao_pct > 1 else comissao_pct
    if c <= 0:
        return float("inf")
    return round(1.0 / c, 2)


@dataclass
class Campanha:
    cliques: int = 0
    vendas: int = 0
    gasto: float = 0.0
    receita_comissao: float = 0.0

    @property
    def cpc_real(self) -> float:
        return round(self.gasto / self.cliques, 4) if self.cliques else 0.0

    @property
    def cvr_real(self) -> float:
        return round(self.vendas / self.cliques, 4) if self.cliques else 0.0

    @property
    def roas(self) -> float:
        return round(self.receita_comissao / self.gasto, 2) if self.gasto else 0.0

    @property
    def lucro(self) -> float:
        return round(self.receita_comissao - self.gasto, 2)
