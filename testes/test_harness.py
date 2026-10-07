"""
HARNESS DE VALIDAÇÃO — testes que provam que a lógica do produto está certa.

Este é o "estrutura validada" do pitch: nenhuma decisão do HARNESS vai
para produção sem passar por estes testes. Rode com:

    python3 -m pytest testes/ -v
"""

import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jevlaya.score import (
    score_harness, cpc_maximo, roas_break_even, normalizar_comissao, Campanha,
)
from jevlaya.previsores_jev import (
    preditor_janela_demanda, preditor_evidencia_social,
    preditor_viabilidade_valor, rodar_previsores,
)
from jevlaya.veredito import decidir_veredito
from jevlaya.ab_teste import significancia_ab, intervalo_wilson
from jevlaya.criativos import matriz_criativos, checar_compliance, CANAIS, GANCHOS, ANGULOS
from jevlaya.orquestrador_laya import orquestrar, vias_recomendadas, CAMADAS
from jevlaya.radar import radar_do_dia
from jevlaya.dados import PRODUTOS_REFERENCIA


# ------------------------------------------------------------- L3: SCORE
class TestScoreHarness:
    def test_formula_original(self):
        # Score = procura*40 + comissao_norm*30 + (1-concorrencia)*30
        r = score_harness(procura=1.0, comissao_pct=15.0, concorrencia=0.0)
        assert r["score"] == 100.0
        assert r["faixa"] == "QUENTE"

    def test_pior_caso(self):
        r = score_harness(procura=0.0, comissao_pct=0.0, concorrencia=1.0)
        assert r["score"] == 0.0
        assert r["faixa"] == "FRIO"

    def test_componentes_somam(self):
        r = score_harness(procura=0.6, comissao_pct=9.0, concorrencia=0.4)
        soma = sum(r["componentes"].values())
        assert abs(soma - r["score"]) < 0.2

    def test_clipes_nao_estouram(self):
        r = score_harness(procura=5.0, comissao_pct=90.0, concorrencia=-2.0)
        assert 0.0 <= r["score"] <= 100.0

    def test_normalizar_comissao(self):
        assert normalizar_comissao(7.5, teto_pct=15.0) == 0.5
        assert normalizar_comissao(30.0, teto_pct=15.0) == 1.0


class TestCpcMaximo:
    def test_exemplo_shopee(self):
        # R$100, comissão 10%, CVR 1.5%, margem 0.8 -> 10*0.015*0.8 = 0.12
        assert cpc_maximo(100.0, 10.0, 0.015, 0.8) == 0.12

    def test_comissao_alta_permite_cpc_maior(self):
        fisico = cpc_maximo(100.0, 6.0, 0.015)
        digital = cpc_maximo(100.0, 40.0, 0.015)
        assert digital > fisico * 4

    def test_zero_quando_sem_conversao(self):
        assert cpc_maximo(100.0, 10.0, 0.0) == 0.0

    def test_roas_break_even_plataforma(self):
        # ROAS exibido pela plataforma (GMV/gasto): 10% comissão -> break-even 10
        assert roas_break_even(10.0) == 10.0
        assert roas_break_even(40.0) == 2.5


class TestCampanha:
    def test_metricas(self):
        c = Campanha(cliques=1000, vendas=20, gasto=100.0, receita_comissao=250.0)
        assert c.cpc_real == 0.1
        assert c.cvr_real == 0.02
        assert c.roas == 2.5
        assert c.lucro == 150.0


# ------------------------------------------------------------- L2: JEV
class TestPrevisoresJEV:
    def test_janela_faixa(self):
        r = preditor_janela_demanda({"tendencia_busca": 1.0, "sazonalidade": 1.0,
                                    "momentum_vendas": 1.0})
        assert r["valor"] == 1.0
        r2 = preditor_janela_demanda({"tendencia_busca": -1.0})
        assert 0.0 <= r2["valor"] < 0.35

    def test_evidencia_reviews_log(self):
        pouco = preditor_evidencia_social({"num_avaliacoes": 5})
        muito = preditor_evidencia_social({"num_avaliacoes": 50000})
        assert muito["valor"] > pouco["valor"]

    def test_viabilidade_rival_barato_penaliza(self):
        caro = preditor_viabilidade_valor({"ticket": 100, "menor_preco_rival": 70,
                                           "comissao_base_pct": 5})
        assert caro["evidencia"]["paridade_preco"] < 1.0

    def test_rodar_previsores_completo(self):
        r = rodar_previsores({"tendencia_busca": 0.5, "num_avaliacoes": 100,
                              "rating_medio": 4.5, "comissao_base_pct": 8,
                              "ticket": 90})
        assert set(r) == {"J", "E", "V", "jev_composto"}
        for k in "JEV":
            assert 0.0 <= r[k]["valor"] <= 1.0
        assert 0.0 <= r["jev_composto"] <= 1.0


# ------------------------------------------------------------- VEREDITO
class TestVeredito:
    BASE = dict(ticket=189.9, comissao_pct=14.0, cvr_esperada=0.015)

    def test_amostra_pequena_aguarda(self):
        v = decidir_veredito(cliques=50, vendas=2, gasto=10, receita_comissao=53,
                             **self.BASE)
        assert v["veredito"] == "AGUARDAR"

    def test_cpc_estourado_pausa(self):
        v = decidir_veredito(cliques=400, vendas=3, gasto=240, receita_comissao=80,
                             **self.BASE)
        assert v["veredito"] == "PAUSAR"
        assert "estourou" in v["motivo"]

    def test_saudavel_escala(self):
        v = decidir_veredito(cliques=840, vendas=14, gasto=68, receita_comissao=372.2,
                             **self.BASE)
        assert v["veredito"] == "ESCALAR"

    def test_zero_vendas_com_amostra_grande_pausa(self):
        v = decidir_veredito(cliques=400, vendas=0, gasto=20, receita_comissao=0,
                             min_cliques=100, **self.BASE)
        assert v["veredito"] == "PAUSAR"

    def test_alerta_formatado(self):
        v = decidir_veredito(cliques=840, vendas=14, gasto=68, receita_comissao=372.2,
                             **self.BASE)
        assert "HARNESS" in v["alerta_whatsapp"]
        assert "CPC real" in v["alerta_whatsapp"]


# ------------------------------------------------------------- A/B
class TestAB:
    def test_amostra_insuficiente_nao_decide(self):
        r = significancia_ab(90, 5, 80, 2)
        assert r["status"] == "AGUARDAR_AMOSTRA"
        assert r["vencedor"] is None

    def test_diferenca_real_declara_vencedor(self):
        r = significancia_ab(800, 28, 800, 14)
        assert r["status"] == "DECIDIDO"
        assert r["vencedor"] == "A"
        assert r["p_valor"] < 0.05

    def test_sem_diferenca(self):
        r = significancia_ab(500, 11, 500, 12)
        assert r["vencedor"] is None

    def test_wilson_contem_proporcao(self):
        lo, hi = intervalo_wilson(20, 1000)
        assert lo < 0.02 < hi


# ------------------------------------------------------------- CRIATIVOS
class TestCriativos:
    PRODUTO = PRODUTOS_REFERENCIA[0]

    def test_matriz_30_variacoes(self):
        m = matriz_criativos(self.PRODUTO, canal="tiktok")
        assert len(m) == len(GANCHOS) * len(ANGULOS) == 30

    def test_ids_unicos(self):
        m = matriz_criativos(self.PRODUTO, canal="telegram")
        ids = [c["id"] for c in m]
        assert len(set(ids)) == 30

    def test_todos_passam_compliance(self):
        for canal in CANAIS:
            m = matriz_criativos(self.PRODUTO, canal=canal)
            assert all(c["aprovado"] for c in m), f"violação no canal {canal}"

    def test_compliance_pega_promessa_proibida(self):
        assert "ganhe dinheiro" in checar_compliance("Compre e GANHE DINHEIRO fácil!")

    def test_canal_invalido(self):
        try:
            matriz_criativos(self.PRODUTO, canal="fax")
            assert False, "deveria levantar ValueError"
        except ValueError:
            pass

    def test_texto_respeita_limite(self):
        for canal, cfg in CANAIS.items():
            for c in matriz_criativos(self.PRODUTO, canal=canal):
                assert len(c["texto"]) <= cfg["limite_chars"]


# ------------------------------------------------------------- LAYA
class TestOrquestradorLaya:
    def test_fluxo_completo(self):
        f = orquestrar(PRODUTOS_REFERENCIA[2])
        assert f["camadas_executadas"] == CAMADAS
        assert len(f["auditoria"]) == 4
        assert f["decisao"]["cpc_maximo"] > 0
        assert f["acao"]["total_variacoes"] >= 30

    def test_com_campanha_da_veredito(self):
        f = orquestrar(PRODUTOS_REFERENCIA[0],
                       campanha={"cliques": 500, "vendas": 9, "gasto": 45,
                                 "receita_comissao": 198})
        assert f["decisao"]["veredito"]["veredito"] in (
            "ESCALAR", "PAUSAR", "OTIMIZAR", "AGUARDAR")

    def test_vias_infoproduto(self):
        curso = next(p for p in PRODUTOS_REFERENCIA if p["categoria"] == "infoproduto")
        f = orquestrar(curso)
        vias = [v["via"] for v in f["decisao"]["vias"]]
        assert any("Ads" in v for v in vias)

    def test_vias_nunca_vazio(self):
        for p in PRODUTOS_REFERENCIA:
            f = orquestrar(p)
            assert len(f["decisao"]["vias"]) >= 1


# ------------------------------------------------------------- RADAR
class TestRadar:
    def test_top5_ordenado(self):
        r = radar_do_dia()
        assert len(r) == 5
        scores = [x["score"] for x in r]
        assert scores == sorted(scores, reverse=True)

    def test_todo_produto_passa_pelo_fluxo(self):
        r = radar_do_dia(top_n=len(PRODUTOS_REFERENCIA))
        assert len(r) == len(PRODUTOS_REFERENCIA)
