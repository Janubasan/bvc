# -*- coding: utf-8 -*-
"""
MCMV Sem Dúvidas — Gerador do PDF "Guia Completo Minha Casa Minha Vida: do zero à chave"
Uso:  python3 tools/build_pdf.py

Requisitos: pip install fpdf2 qrcode pillow
Saídas:     assets/pdf/guia-mcmv-sem-duvidas.pdf  +  assets/img/og-image.png
"""
import io
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import render as R
from content_core import DUVIDAS_27, CHECKLIST, PASSOS_7

from fpdf import FPDF
from PIL import Image, ImageDraw, ImageFont

FONTES = "/usr/share/fonts/truetype/dejavu"
AZUL = (11, 43, 82)
AZUL_MED = (29, 95, 184)
AZUL_CLARO = (227, 237, 250)
VERDE = (31, 163, 74)
VERDE_CLARO = (233, 251, 240)
AMBAR = (255, 176, 32)
AMBAR_ESC = (185, 117, 4)
AMBAR_CLARO = (255, 244, 224)
TEXTO = (58, 74, 97)
CINZA = (120, 134, 155)
BRANCO = (255, 255, 255)

C1 = R.CFG["corretores"][0]
C2 = R.CFG["corretores"][1] if len(R.CFG["corretores"]) > 1 else R.CFG["corretores"][0]

DISCLAIMER = ("Material informativo independente, sem vínculo com o Governo Federal, a Caixa Econômica Federal ou o "
              "programa Minha Casa Minha Vida. Sujeito à análise de crédito e às condições vigentes.")


class GuiaPDF(FPDF):
    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-16)
        self.set_draw_color(*AZUL_CLARO)
        self.set_line_width(0.3)
        self.line(18, self.get_y(), 192, self.get_y())
        self.set_font("DejaVu", "", 7.2)
        self.set_text_color(*CINZA)
        self.set_y(-13)
        self.cell(0, 5, "MCMV Sem Dúvidas — Guia informativo. Sujeito às condições vigentes do programa.", align="L")
        self.cell(0, 5, "pág. %d" % self.page_no(), align="R")


def novo_pdf():
    pdf = GuiaPDF("P", "mm", "A4")
    pdf.set_margins(18, 18, 18)
    pdf.set_auto_page_break(True, 22)
    pdf.add_font("DejaVu", "", os.path.join(FONTES, "DejaVuSans.ttf"))
    pdf.add_font("DejaVu", "B", os.path.join(FONTES, "DejaVuSans-Bold.ttf"))
    pdf.set_title("Guia Completo Minha Casa Minha Vida: do zero à chave")
    pdf.set_author("MCMV Sem Dúvidas")
    return pdf


# ---------------- utilitários ----------------
def paragrafo(pdf, texto, tamanho=10.5, cor=TEXTO, estilo="", lh=5.6, apos=2):
    pdf.set_font("DejaVu", estilo, tamanho)
    pdf.set_text_color(*cor)
    pdf.multi_cell(174, lh, texto)
    pdf.ln(apos)


def h2(pdf, texto):
    pdf.ln(2)
    pdf.set_font("DejaVu", "B", 13)
    pdf.set_text_color(*AZUL)
    pdf.multi_cell(174, 7, texto)
    pdf.ln(1.5)


def bullets(pdf, itens, simbolo="•", cor_simbolo=VERDE, indentar=0):
    for it in itens:
        x0 = pdf.get_x()
        pdf.set_font("DejaVu", "B", 10.5)
        pdf.set_text_color(*cor_simbolo)
        pdf.cell(6 + indentar, 5.6, simbolo)
        pdf.set_font("DejaVu", "", 10.5)
        pdf.set_text_color(*TEXTO)
        pdf.multi_cell(174 - 6 - indentar, 5.6, it)
        pdf.ln(0.8)
    pdf.ln(1.5)


def caixa_aviso(pdf, titulo, texto, fundo=AMBAR_CLARO, borda=AMBAR):
    import math
    pdf.ln(2)
    y = pdf.get_y()
    pdf.set_fill_color(*fundo)
    pdf.set_draw_color(*borda)
    pdf.set_line_width(0.6)
    pdf.set_font("DejaVu", "", 9.2)
    linhas = max(1, math.ceil(pdf.get_string_width(texto) / 155))
    altura = 10 + linhas * 4.8
    if y + altura > 275:
        pdf.add_page()
        y = pdf.get_y()
    pdf.rect(18, y, 174, altura, style="DF")
    pdf.set_xy(23, y + 2.5)
    pdf.set_font("DejaVu", "B", 9.5)
    pdf.set_text_color(*AMBAR_ESC)
    pdf.cell(164, 5, titulo)
    pdf.set_xy(23, y + 7.5)
    pdf.set_font("DejaVu", "", 9.2)
    pdf.set_text_color(*TEXTO)
    pdf.multi_cell(164, 4.6, texto)
    pdf.set_y(y + altura + 3)


def cta_box(pdf, texto):
    import math
    pdf.ln(2)
    y = pdf.get_y()
    pdf.set_font("DejaVu", "B", 10)
    linhas = max(1, math.ceil(pdf.get_string_width(texto) / 155))
    altura = 8 + linhas * 5 + 10
    if y + altura > 275:
        pdf.add_page()
        y = pdf.get_y()
    pdf.set_fill_color(*VERDE_CLARO)
    pdf.set_draw_color(*VERDE)
    pdf.set_line_width(0.5)
    pdf.rect(18, y, 174, altura, style="DF", round_corners=True, corner_radius=3)
    pdf.set_xy(24, y + 4)
    pdf.set_font("DejaVu", "B", 10)
    pdf.set_text_color(*VERDE)
    pdf.multi_cell(162, 5, texto)
    pdf.set_font("DejaVu", "", 8.5)
    pdf.set_text_color(*CINZA)
    pdf.set_xy(24, y + altura - 7.5)
    pdf.cell(162, 5, "WhatsApp: %s  ·  %s  ·  CRECI %s / %s" % (C1["whatsapp"], C2["whatsapp"], C1["creci"], C2["creci"]))
    pdf.set_y(y + altura + 4)


def cap_titulo(pdf, numero, titulo, subtitulo=""):
    if pdf.page_no() > 1 and pdf.get_y() > 40:
        pdf.add_page()
    pdf.ln(2)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(*AMBAR_ESC)
    pdf.cell(174, 5, "CAPÍTULO %02d" % numero)
    pdf.ln(6)
    pdf.set_font("DejaVu", "B", 19)
    pdf.set_text_color(*AZUL)
    pdf.multi_cell(174, 9.5, titulo)
    pdf.ln(1)
    pdf.set_draw_color(*AMBAR)
    pdf.set_line_width(1.2)
    pdf.line(18, pdf.get_y(), 66, pdf.get_y())
    pdf.ln(4)
    if subtitulo:
        paragrafo(pdf, subtitulo, tamanho=10.5, cor=CINZA, estilo="", apos=4)


# ---------------- capa ----------------
def capa(pdf):
    pdf.add_page()
    pdf.set_fill_color(*AZUL)
    pdf.rect(0, 0, 210, 297, style="F")
    # faixas decorativas
    pdf.set_fill_color(*AZUL_MED)
    pdf.rect(0, 0, 210, 6, style="F")
    pdf.set_fill_color(*AMBAR)
    pdf.rect(0, 291, 210, 6, style="F")

    # casa geométrica
    pdf.set_fill_color(*AZUL_MED)
    pdf.rect(75, 92, 60, 46, style="F", round_corners=True, corner_radius=2)
    pdf.set_fill_color(*BRANCO)
    pdf.polygon([(63, 92), (105, 62), (147, 92)], style="F")
    pdf.set_fill_color(*AMBAR)
    pdf.rect(98, 112, 14, 26, style="F", round_corners=True, corner_radius=1)
    pdf.set_fill_color(*AZUL_CLARO)
    pdf.rect(82, 100, 12, 12, style="F")
    pdf.rect(116, 100, 12, 12, style="F")
    # selo verde de check
    pdf.set_fill_color(*VERDE)
    pdf.set_draw_color(*BRANCO)
    pdf.set_line_width(2)
    pdf.ellipse(140, 76, 24, 24, style="DF")
    pdf.set_draw_color(*BRANCO)
    pdf.set_line_width(2.4)
    pdf.line(146, 88, 151, 93)
    pdf.line(151, 93, 159, 82)

    pdf.set_y(158)
    pdf.set_font("DejaVu", "", 10)
    pdf.set_text_color(*AMBAR)
    pdf.cell(174, 6, "GUIA COMPLETO · GRÁTIS", align="C")
    pdf.ln(9)
    pdf.set_font("DejaVu", "B", 27)
    pdf.set_text_color(*BRANCO)
    pdf.cell(174, 12, "Minha Casa Minha Vida", align="C")
    pdf.ln(13)
    pdf.set_font("DejaVu", "B", 16)
    pdf.set_text_color(*AZUL_CLARO)
    pdf.cell(174, 8, "do zero à chave", align="C")
    pdf.ln(12)
    pdf.set_font("DejaVu", "", 10.5)
    pdf.set_text_color(*AZUL_CLARO)
    pdf.cell(174, 6, "Checklist de documentos + 27 dúvidas respondidas", align="C")
    pdf.ln(7)
    pdf.cell(174, 6, "em linguagem que qualquer pessoa entende", align="C")

    # selos
    pdf.set_y(226)
    selos = ["ATUALIZADO", "LINGUAGEM SIMPLES", "GRÁTIS"]
    pdf.set_font("DejaVu", "B", 8)
    larguras = [pdf.get_string_width(s) + 12 for s in selos]
    total = sum(larguras) + 8 * (len(selos) - 1)
    x = (210 - total) / 2
    for s, w in zip(selos, larguras):
        pdf.set_xy(x, 226)
        pdf.set_fill_color(38, 66, 106)
        pdf.set_draw_color(*AMBAR)
        pdf.set_line_width(0.3)
        pdf.rect(x, 226, w, 9, style="DF", round_corners=True, corner_radius=4)
        pdf.set_text_color(*AMBAR)
        pdf.cell(w, 9, s, align="C")
        x += w + 8

    # corretores
    pdf.set_y(252)
    pdf.set_font("DejaVu", "", 9)
    pdf.set_text_color(*AZUL_CLARO)
    pdf.cell(174, 5, "Atendimento humano por:", align="C")
    pdf.ln(6)
    pdf.set_font("DejaVu", "B", 11)
    pdf.set_text_color(*BRANCO)
    pdf.cell(174, 6, "%s  ·  CRECI %s        %s  ·  CRECI %s" % (C1["nome"], C1["creci"], C2["nome"], C2["creci"]), align="C")
    pdf.ln(8)
    pdf.set_font("DejaVu", "", 8)
    pdf.set_text_color(*CINZA)
    pdf.multi_cell(174, 4.5, DISCLAIMER, align="C")

    pdf.add_page()


def sumario(pdf):
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(*AMBAR_ESC)
    pdf.cell(174, 5, "SUMÁRIO")
    pdf.ln(8)
    pdf.set_font("DejaVu", "B", 20)
    pdf.set_text_color(*AZUL)
    pdf.cell(174, 10, "O que você vai encontrar aqui")
    pdf.ln(6)
    pdf.set_draw_color(*AMBAR)
    pdf.set_line_width(1.2)
    pdf.line(18, pdf.get_y(), 66, pdf.get_y())
    pdf.ln(8)

    capitulos = [
        ("01", "Você pode participar?"),
        ("02", "Renda familiar: como calcular"),
        ("03", "O que é FGTS e como usar"),
        ("04", "Entrada: você precisa mesmo?"),
        ("05", "Parcelas: quanto vai pesar no bolso"),
        ("06", "Nome sujo e score: o que fazer"),
        ("07", "Checklist de documentos (imprimível)"),
        ("08", "Os 7 passos até a chave"),
        ("09", "As 27 dúvidas mais comuns"),
        ("10", "Próximos passos"),
        ("—", "Contatos dos corretores + QR Code"),
    ]
    for num, titulo in capitulos:
        pdf.set_font("DejaVu", "B", 13)
        pdf.set_text_color(*AMBAR_ESC)
        pdf.cell(14, 9, num)
        pdf.set_font("DejaVu", "", 12)
        pdf.set_text_color(*AZUL)
        pdf.cell(150, 9, titulo)
        pdf.ln(10)

    pdf.ln(4)
    paragrafo(pdf, "Como usar este guia: leia na ordem se você está começando agora — ou pule direto para a dúvida "
                   "que mais te trava. Cada capítulo termina com um próximo passo prático.", tamanho=10, cor=CINZA)
    cta_box(pdf, "Quer aplicar este guia ao SEU caso? Fale com um corretor agora:")
    pdf.add_page()


# ---------------- capítulos ----------------
def cap1(pdf):
    cap_titulo(pdf, 1, "Você pode participar?", "A dúvida que trava tudo — respondida em uma página.")
    paragrafo(pdf, "O Minha Casa Minha Vida existe para uma coisa: ajudar famílias a comprarem a primeira casa "
                   "quando o financiamento comum do mercado não cabe no orçamento. Se você paga aluguel e nunca "
                   "comprou imóvel, as chances de se encaixar são maiores do que você imagina.")
    h2(pdf, "O programa pede, em geral:")
    bullets(pdf, [
        "Renda familiar dentro dos limites do programa (que mudam por portaria)",
        "Não ter outro imóvel residencial no seu nome",
        "Nome apto a passar por análise de crédito",
        "CPF regular e documentação em ordem",
    ])
    h2(pdf, "Quem NÃO precisa desistir antes de perguntar")
    paragrafo(pdf, "Autônomos e MEIs com renda comprovável participam. Aposentados participam. Quem está com o nome "
                   "negativado pode, dependendo do caso. Quem ganha pouco pode compor renda com a família. "
                   "Quem acha que ganha demais pode estar olhando uma tabela desatualizada.")
    paragrafo(pdf, "Não existe perfil perfeito — existe um conjunto de fatores (renda + situação cadastral + "
                   "documentos) que se avalia junto, em uma pré-análise gratuita que leva minutos.")
    caixa_aviso(pdf, "Atenção", "As regras e os limites de renda mudam por portaria do Governo Federal. Confirme o "
                  "seu caso com um corretor antes de tirar conclusões — leva 5 minutos e evita decisão com informação "
                  "desatualizada.")
    cta_box(pdf, "Capítulo 1, próximo passo: confirme seu enquadramento em uma conversa de 5 minutos.")


def cap2(pdf):
    cap_titulo(pdf, 2, "Renda familiar: como calcular", "O número mais importante do processo — e o mais mal entendido.")
    paragrafo(pdf, "O programa é dividido em faixas de renda. Quanto menor a renda da família, maior o subsídio "
                   "(dinheiro que o governo complementa no valor do imóvel) e menores os juros. É assim que o "
                   "programa prioriza quem mais precisa.")
    h2(pdf, "Como a renda é somada")
    paragrafo(pdf, "Conta a renda familiar bruta somada — você, cônjuge e quem mora com você e compõe renda. "
                   "Entre na soma:")
    bullets(pdf, [
        "Salário CLT (o bruto, não o que cai na conta)",
        "Renda de autônomo ou MEI (comprovável)",
        "Aposentadoria e pensões",
        "Pensão alimentícia recebida",
        "Aluguéis recebidos",
    ])
    h2(pdf, "O que NÃO entra")
    bullets(pdf, [
        "Bolsa Família e benefícios assistenciais",
        "Auxílios temporários (emergenciais)",
    ], simbolo="✕", cor_simbolo=(214, 69, 69))
    h2(pdf, "Composição de renda: o truque legítimo")
    paragrafo(pdf, "Se a sua renda sozinha não comporta a parcela, é possível somar a renda de cônjuge ou familiar "
                   "no contrato. Isso aumenta a capacidade de compra — e é totalmente dentro das regras.")
    caixa_aviso(pdf, "Atenção", "Os valores das faixas de renda mudam por portaria. Confirme o valor vigente com um "
                  "corretor antes de assumir que você está dentro ou fora.")
    cta_box(pdf, "Capítulo 2, próximo passo: some sua renda familiar e confirme sua faixa com um corretor.")


def cap3(pdf):
    cap_titulo(pdf, 3, "O que é FGTS e como usar", "O melhor amigo de quem quer sair do aluguel.")
    paragrafo(pdf, "O FGTS (Fundo de Garantia do Tempo de Serviço) é o dinheiro que o empregador deposita todo mês "
                   "na sua conta vinculada. Muita gente esquece que ele existe — e ele pode ser a diferença entre "
                   "conseguir e não conseguir a casa própria.")
    h2(pdf, "Para que o FGTS serve na compra")
    bullets(pdf, [
        "Dar entrada no imóvel (parcial ou total)",
        "Abater o valor financiado — o que derruba a parcela",
        "Amortizar o saldo devedor durante o financiamento",
        "Cobrir parte de escritura e registro, em condições específicas",
    ])
    h2(pdf, "As regras que importam")
    bullets(pdf, [
        "Ter saldo disponível na conta vinculada",
        "Ter, no mínimo, 3 anos de vínculo sob o regime do FGTS — somando os períodos, sem precisar ser contínuo",
        "O imóvel ser residencial e urbano",
        "A operação se enquadrar nas regras do fundo",
    ])
    h2(pdf, "Como ver seu saldo")
    paragrafo(pdf, "Pelo aplicativo oficial (Carteira de Trabalho Digital ou app do FGTS da Caixa). Nele você vê os "
                   "depósitos, o saldo total e quanto o fundo rendeu.")
    caixa_aviso(pdf, "O que NUNCA fazer", "Não saque o saldo antes de planejar a compra. Saques comuns (demissão, "
                  "aniversário) tiram o dinheiro da conta vinculada — e fora dela, o FGTS não serve para a operação. "
                  "Antes de qualquer saque, converse com quem entende de habitação.")
    cta_box(pdf, "Capítulo 3, próximo passo: confira seu saldo no app e leve o extrato para a conversa.")


def cap4(pdf):
    cap_titulo(pdf, 4, "Entrada: você precisa mesmo?", "A pergunta que mais gera desistência desnecessária.")
    paragrafo(pdf, "Não necessariamente. Muitos casos conseguem entrada zero — ou entrada coberta pela combinação "
                   "de subsídio (complemento do governo) e saldo de FGTS. É isso que permite, em boa parte dos "
                   "atendimentos, a família começar a pagar só as parcelas.")
    h2(pdf, "O que define se você dá entrada")
    bullets(pdf, [
        "Sua faixa de renda",
        "O valor do imóvel escolhido",
        "O saldo de FGTS disponível",
        "O resultado da análise de crédito",
    ])
    caixa_aviso(pdf, "Honestidade acima de tudo", "Entrada zero não é regra para todo mundo. Existem casos em que "
                  "uma entrada é necessária — e prometer o contrário seria mentira. O que fazemos é mostrar o seu "
                  "cenário real, com os números na mesa, antes de qualquer decisão.")
    paragrafo(pdf, "O subsídio, aliás, não é empréstimo: é complemento que reduz o valor financiado e não precisa "
                   "ser devolvido, dentro das condições do programa para a sua faixa.")
    cta_box(pdf, "Capítulo 4, próximo passo: simule seu cenário real de entrada com um corretor.")


def cap5(pdf):
    cap_titulo(pdf, 5, "Parcelas: quanto vai pesar no bolso", "Como a parcela é calculada — e a regra de ouro do orçamento.")
    paragrafo(pdf, "A parcela depende de três coisas:")
    bullets(pdf, [
        "O valor do imóvel",
        "O valor financiado (depois de descontar subsídio + FGTS + entrada)",
        "O prazo e a taxa de juros da sua faixa de renda",
    ])
    paragrafo(pdf, "O detalhe que quase ninguém sabe: quanto menor a sua renda, menores os juros e maior o subsídio. "
                   "Ou seja, o programa é justamente mais gentil com quem ganha menos.")
    h2(pdf, "A regra de ouro: 30%")
    paragrafo(pdf, "Sua parcela não deve comprometer mais do que cerca de 30% da renda familiar bruta. Se passar "
                   "disso, o caminho costuma ser compor renda ou escolher uma unidade diferente — não torcer para dar certo.")
    h2(pdf, "O que entra na parcela")
    paragrafo(pdf, "Na parcela do MCMV costumam estar embutidos o seguro do imóvel (DFI), o seguro de vida (MIP) e a "
                   "taxa de administração. Por isso ela é um pouco maior que um cálculo “puro” de financiamento — e é "
                   "assim que ela cabe no orçamento, sem surpresa no meio do caminho.")
    paragrafo(pdf, "O cálculo exato muda de caso para caso. Em vez de chutar, simule: com um corretor é rápido e gratuito.")
    cta_box(pdf, "Capítulo 5, próximo passo: descubra sua parcela real com uma simulação gratuita.")


def cap6(pdf):
    cap_titulo(pdf, 6, "Nome sujo e score: o que fazer", "A dúvida que mais trava as pessoas — sem drama e sem promessa furada.")
    paragrafo(pdf, "Primeiro, a resposta honesta: ter o nome negativado não é um “não” automático — é um “depende”. "
                   "O que a análise olha é o conjunto:")
    bullets(pdf, [
        "Valor total das dívidas em aberto",
        "Há quanto tempo as restrições existem",
        "Se dívidas já foram quitadas ou negociadas",
        "Existência de protestos ou ações judiciais",
        "Sua renda e capacidade de pagamento atual",
    ])
    h2(pdf, "O plano de 5 passos antes de tentar")
    bullets(pdf, [
        "Mapeie tudo: tire o relatório completo (Serasa, SPC ou Boa Vista) e liste valor, credor e data",
        "Resolva as dívidas pequenas primeiro: R$ 80 pendurado no CPF pesa desproporcionalmente",
        "Negocie com desconto: na porta do credor, à vista, os descontos são reais",
        "Guarde as provas: comprovantes de quitação e acordos viram argumento na análise",
        "Faça uma pré-análise antes de dar entrada: uma reprovação mal conduzida deixa rastro",
    ], simbolo="1", cor_simbolo=AZUL_MED)
    h2(pdf, "E o score baixo?")
    paragrafo(pdf, "Score baixo não é porta fechada — é sinal de que a análise será mais cuidadosa. Renda bem "
                   "comprovada e documentação impecável pesam muito. E contas em dia sobem o score em 60 a 90 dias.")
    caixa_aviso(pdf, "O que ninguém pode prometer", "Aprovação. Desconfie de quem prometer. O que um bom corretor "
                  "faz é aumentar suas chances: dossiê organizado, pendências tratadas, renda comprovada e a unidade "
                  "certa para o seu perfil.")
    cta_box(pdf, "Capítulo 6, próximo passo: mostre sua situação com transparência e receba um plano honesto.")


def cap7(pdf):
    cap_titulo(pdf, 7, "Checklist de documentos", "Separe tudo antes de ir ao corretor — isso economiza semanas.")
    paragrafo(pdf, "Marque cada item conforme for separando. Dica: monte uma pasta (física ou digital) com tudo "
                   "escaneado — quem chega com o dossiê pronto adianta o processo em dias.", tamanho=10, cor=CINZA)

    def bloco(titulo, itens):
        if pdf.get_y() > 220:
            pdf.add_page()
        pdf.ln(2)
        pdf.set_font("DejaVu", "B", 12)
        pdf.set_text_color(*AZUL)
        pdf.cell(174, 7, titulo)
        pdf.ln(8)
        for it in itens:
            if pdf.get_y() > 262:
                pdf.add_page()
            pdf.set_draw_color(*AZUL_MED)
            pdf.set_line_width(0.5)
            pdf.rect(20, pdf.get_y() + 0.8, 5, 5)
            pdf.set_x(30)
            pdf.set_font("DejaVu", "", 10.5)
            pdf.set_text_color(*TEXTO)
            pdf.multi_cell(162, 5.6, it)
            pdf.ln(1.4)

    bloco("Você", CHECKLIST["voce"])
    bloco("Cônjuge / companheiro(a) — se entrar na composição", CHECKLIST["conjuge"])
    bloco("Se autônomo / MEI", CHECKLIST["autonomo"])
    pdf.ln(2)
    paragrafo(pdf, "Observação: casos específicos (pensão, guarda de filhos, imóvel anterior) podem pedir documentos "
                   "extras — o corretor avisa na pré-análise.", tamanho=9, cor=CINZA)
    cta_box(pdf, "Dúvida sobre algum documento? Envie a foto pelo WhatsApp e a gente confirma.")


def cap8(pdf):
    cap_titulo(pdf, 8, "Os 7 passos até a chave", "O processo inteiro, sem mistério.")
    for p in PASSOS_7:
        if pdf.get_y() > 240:
            pdf.add_page()
        y = pdf.get_y()
        # número no círculo
        pdf.set_fill_color(*AZUL)
        pdf.set_draw_color(*AZUL)
        pdf.ellipse(18, y, 11, 11, style="F")
        pdf.set_xy(18, y + 2.5)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*BRANCO)
        pdf.cell(11, 6, str(p["n"]), align="C")
        # título + meta
        pdf.set_xy(34, y + 0.5)
        pdf.set_font("DejaVu", "B", 12)
        pdf.set_text_color(*AZUL)
        pdf.cell(120, 6, p["titulo"])
        pdf.set_xy(34, y + 6.5)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(*VERDE)
        pdf.cell(158, 4.5, "Tempo médio: %s   ·   Pode travar: %s" % (p["tempo"], p["trava"]))
        pdf.set_xy(34, y + 11.5)
        pdf.set_font("DejaVu", "", 9.8)
        pdf.set_text_color(*TEXTO)
        pdf.multi_cell(158, 5, p["desc"])
        y_final = pdf.get_y()
        pdf.set_y(max(y_final, y + 18) + 4)
    cta_box(pdf, "Pronto para começar pela etapa 1? A pré-análise é gratuita.")


def cap9(pdf):
    cap_titulo(pdf, 9, "As 27 dúvidas mais comuns", "Respostas curtas e diretas — para consultar sempre que precisar.")
    for i, (pergunta, resposta) in enumerate(DUVIDAS_27, start=1):
        if pdf.get_y() > 240:
            pdf.add_page()
        pdf.set_font("DejaVu", "B", 10.8)
        pdf.set_text_color(*AZUL)
        pdf.multi_cell(174, 5.6, "%d. %s" % (i, pergunta))
        pdf.set_x(18)  # volta à margem esquerda antes da resposta
        pdf.set_font("DejaVu", "", 9.8)
        pdf.set_text_color(*TEXTO)
        pdf.multi_cell(174, 5.2, resposta)
        pdf.ln(2.4)


def cap10(pdf):
    cap_titulo(pdf, 10, "Próximos passos", "Conhecimento sem ação não muda nada. Aqui está o plano:")
    passos = [
        "Marque os documentos do checklist que você já tem",
        "Separe o que falta — comece pelos comprovantes de renda",
        "Envie uma mensagem para um dos corretores (WhatsApp na última página)",
        "Em até 24h você recebe uma orientação personalizada para o seu caso",
    ]
    for i, p in enumerate(passos, start=1):
        pdf.set_font("DejaVu", "B", 22)
        pdf.set_text_color(*AZUL_CLARO)
        pdf.cell(12, 12, str(i))
        pdf.set_font("DejaVu", "", 11.5)
        pdf.set_text_color(*AZUL)
        pdf.multi_cell(160, 7, p)
        pdf.ln(3)
    pdf.ln(4)
    caixa_aviso(pdf, "Um último lembrete", "As regras do Minha Casa Minha Vida (renda, teto do imóvel, subsídio e "
                  "juros) mudam por portaria do Governo Federal. Este guia explica a lógica — os números do seu caso "
                  "são confirmados na conversa com o corretor, com as condições vigentes do dia.", fundo=AZUL_CLARO, borda=AZUL_MED)


def ultima_pagina(pdf, qr1_path, qr2_path):
    pdf.add_page()
    pdf.set_fill_color(*AZUL)
    pdf.rect(0, 0, 210, 297, style="F")
    pdf.set_fill_color(*AMBAR)
    pdf.rect(0, 0, 210, 6, style="F")

    pdf.set_y(30)
    pdf.set_font("DejaVu", "B", 10)
    pdf.set_text_color(*AMBAR)
    pdf.cell(174, 6, "FALAR COM UM CORRETOR AGORA", align="C")
    pdf.ln(10)
    pdf.set_font("DejaVu", "B", 21)
    pdf.set_text_color(*BRANCO)
    pdf.cell(174, 11, "Sua casa começa com", align="C")
    pdf.ln(11)
    pdf.cell(174, 11, "uma conversa", align="C")
    pdf.ln(14)

    # cards dos corretores com QR
    for x, c, qr_path in [(22, C1, qr1_path), (110, C2, qr2_path)]:
        pdf.set_fill_color(16, 56, 104)
        pdf.set_draw_color(*AZUL_MED)
        pdf.rect(x, pdf.get_y(), 78, 108, style="DF", round_corners=True, corner_radius=5)
        pdf.set_xy(x, pdf.get_y() + 8)
        pdf.set_font("DejaVu", "B", 12)
        pdf.set_text_color(*BRANCO)
        pdf.cell(78, 6, c["nome"], align="C")
        pdf.set_xy(x, pdf.get_y() + 6)
        pdf.set_font("DejaVu", "", 9)
        pdf.set_text_color(*AZUL_CLARO)
        pdf.cell(78, 5, "CRECI %s" % c["creci"], align="C")
        pdf.set_xy(x, pdf.get_y() + 5)
        pdf.cell(78, 5, "Atendimento: %s" % c["horario"], align="C")
        if qr_path and os.path.exists(qr_path):
            pdf.image(qr_path, x + 78 / 2 - 22, pdf.get_y() + 6, w=44)
            pdf.set_xy(x, pdf.get_y() + 6 + 46)
            pdf.set_font("DejaVu", "", 8)
            pdf.set_text_color(*AZUL_CLARO)
            pdf.cell(78, 5, "Aponte a câmera e chame no WhatsApp", align="C")
        else:
            pdf.set_xy(x, pdf.get_y() + 6)
            pdf.set_font("DejaVu", "", 9)
            pdf.set_text_color(*AZUL_CLARO)
            pdf.cell(78, 40, "WhatsApp:\n%s" % c["whatsapp"], align="C")

    pdf.set_y(-58)
    pdf.set_font("DejaVu", "", 8)
    pdf.set_text_color(*CINZA)
    pdf.multi_cell(174, 4.5, DISCLAIMER, align="C")
    pdf.ln(2)
    pdf.set_font("DejaVu", "", 8)
    pdf.set_text_color(*CINZA)
    pdf.cell(174, 5, "© 2026 MCMV Sem Dúvidas — mcmvsemduvidas.com.br", align="C")


def qr_arquivo(texto, caminho):
    import qrcode
    img = qrcode.make(texto, box_size=10, border=2)
    img.save(caminho)
    return caminho


def gerar_pdf():
    print("Gerando o PDF do guia…")
    pdf = novo_pdf()
    capa(pdf)
    sumario(pdf)
    cap1(pdf)
    cap2(pdf)
    cap3(pdf)
    cap4(pdf)
    cap5(pdf)
    cap6(pdf)
    cap7(pdf)
    cap8(pdf)
    cap9(pdf)
    cap10(pdf)

    # QR codes apontando para o WhatsApp de cada corretor
    import tempfile
    tmp = tempfile.mkdtemp()
    msg = R.msg_de("guia")
    qr1 = qr_arquivo(R.wa_href(C1, msg), os.path.join(tmp, "qr1.png"))
    qr2 = qr_arquivo(R.wa_href(C2, msg), os.path.join(tmp, "qr2.png"))
    ultima_pagina(pdf, qr1, qr2)

    destino = os.path.join(R.ROOT, "assets", "pdf", "guia-mcmv-sem-duvidas.pdf")
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    pdf.output(destino)
    print("✅ PDF gerado:", destino, "(%d páginas)" % pdf.page_no())


# ================================================================
# OG image (1200x630) — para compartilhamento em redes sociais
# ================================================================
def gerar_og():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), AZUL)
    d = ImageDraw.Draw(img)
    # gradiente sutil
    for y in range(H):
        t = y / H
        cor = tuple(int(AZUL[i] + (AZUL_MED[i] - AZUL[i]) * t * 0.55) for i in range(3))
        d.line([(0, y), (W, y)], fill=cor)
    # barra âmbar
    d.rectangle([0, 0, W, 14], fill=AMBAR)
    d.rectangle([0, H - 14, W, H], fill=AMBAR)

    f_bold = lambda s: ImageFont.truetype(os.path.join(FONTES, "DejaVuSans-Bold.ttf"), s)
    f_reg = lambda s: ImageFont.truetype(os.path.join(FONTES, "DejaVuSans.ttf"), s)

    # casa geométrica à direita
    d.polygon([(950, 300), (1050, 215), (1150, 300)], fill=(255, 255, 255))
    d.rectangle([970, 300, 1130, 420], fill=AZUL_MED)
    d.rectangle([1035, 360, 1065, 420], fill=AMBAR)
    d.rectangle([985, 320, 1015, 350], fill=AZUL_CLARO)
    d.rectangle([1085, 320, 1115, 350], fill=VERDE_CLARO)
    d.ellipse([1090, 200, 1160, 270], outline=VERDE, width=10)
    d.line([(1108, 238), (1124, 254)], fill=VERDE, width=10)
    d.line([(1124, 254), (1146, 222)], fill=VERDE, width=10)

    # textos
    d.text((70, 120), "MCMV", font=f_bold(150), fill=(255, 255, 255))
    d.text((70, 265), "SEM DÚVIDAS", font=f_bold(78), fill=AMBAR)
    d.text((70, 375), "Do aluguel à chave: descubra se você pode", font=f_reg(38), fill=AZUL_CLARO)
    d.text((70, 425), "ter sua casa — e o que fazer primeiro.", font=f_reg(38), fill=AZUL_CLARO)

    # pill do guia
    d.rounded_rectangle([70, 500, 560, 560], radius=30, fill=(31, 163, 74))
    d.text((100, 514), "Guia completo + diagnóstico grátis", font=f_bold(26), fill=(255, 255, 255))

    destino = os.path.join(R.ROOT, "assets", "img", "og-image.png")
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    img.save(destino, optimize=True)
    print("✅ OG image gerada:", destino)


if __name__ == "__main__":
    gerar_pdf()
    gerar_og()
