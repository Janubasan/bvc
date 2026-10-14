# -*- coding: utf-8 -*-
"""Conteúdo — quiz, empreendimentos, sobre, contato, obrigado, blog e páginas legais."""
import json
import render as R
from render import icone, pagina, wa_btn, nome_corretor, cta_duais, aviso_analise, \
    section_head, page_hero, faq_details, form_guia, bloco_mini_diag, cta_final, \
    banner_guia, schema_faq, schema_breadcrumb, schema_localbusiness, schema_produto, \
    PREDIO_ART, MAPA_ART
from content_core import DUVIDAS_27, PASSOS_7


# ================================================================
# /quiz/ — Diagnóstico MCMV
# ================================================================
QUIZ = {
    "perguntas": [
        {"t": "Qual é a sua renda familiar mensal (somando todo mundo que mora com você)?", "opcoes": [
            {"t": "Até 1 salário mínimo", "p": 1},
            {"t": "De 1 a 2 salários mínimos", "p": 3},
            {"t": "De 2 a 4 salários mínimos", "p": 5},
            {"t": "De 4 a 8 salários mínimos", "p": 4},
            {"t": "Acima de 8 salários mínimos", "p": 1},
        ]},
        {"t": "Você tem FGTS com saldo?", "opcoes": [
            {"t": "Sim, com saldo", "p": 3},
            {"t": "Sim, mas acho que é pouco", "p": 2},
            {"t": "Não tenho / não sei", "p": 1},
        ]},
        {"t": "Você já tem imóvel residencial no seu nome?", "opcoes": [
            {"t": "Não", "p": 3},
            {"t": "Sim, mas vou vender", "p": 2},
            {"t": "Sim", "p": 0},
        ]},
        {"t": "Como está seu nome hoje?", "opcoes": [
            {"t": "Limpo", "p": 3},
            {"t": "Com dívidas, mas negociando", "p": 2},
            {"t": "Negativado", "p": 1},
        ]},
        {"t": "Qual sua situação de trabalho?", "opcoes": [
            {"t": "CLT há mais de 1 ano", "p": 3},
            {"t": "Autônomo / MEI com renda comprovada", "p": 3},
            {"t": "CLT há menos de 1 ano", "p": 2},
            {"t": "Sem renda comprovada", "p": 0},
        ]},
        {"t": "Você tem comprovantes de renda dos últimos 3 meses?", "opcoes": [
            {"t": "Sim, todos", "p": 3},
            {"t": "Alguns", "p": 2},
            {"t": "Não", "p": 0},
        ]},
        {"t": "Você tem entrada separada?", "opcoes": [
            {"t": "Sim", "p": 3},
            {"t": "Vou usar FGTS / subsídio", "p": 3},
            {"t": "Não tenho", "p": 2},
        ]},
        {"t": "Quando você pretende comprar?", "opcoes": [
            {"t": "Agora", "p": 3},
            {"t": "Nos próximos 6 meses", "p": 3},
            {"t": "Este ano", "p": 2},
            {"t": "Só pesquisando", "p": 1},
        ]},
    ],
    "resultados": [
        {"min": 19, "max": 24, "rotulo": "🟢 Alta chance", "classe": "result-alta",
         "titulo": "Alta chance — seu perfil está bem alinhado",
         "copy": "Seu perfil está bem alinhado com o MCMV{nome}. O próximo passo é organizar os documentos e escolher o empreendimento. Um corretor pode confirmar tudo em uma conversa rápida."},
        {"min": 13, "max": 18, "rotulo": "🟡 Boa chance", "classe": "result-boa",
         "titulo": "Boa chance — precisa organizar",
         "copy": "Você tem potencial{nome}, mas alguns pontos precisam de ajuste antes de dar entrada no processo. O bom: são pontos que dá para resolver com orientação certa."},
        {"min": 8, "max": 12, "rotulo": "🟠 Precisa de análise", "classe": "result-analise",
         "titulo": "Seu caso tem particularidades",
         "copy": "Seu caso tem particularidades{nome}. Vale uma conversa honesta antes de qualquer passo — sem promessas, só clareza sobre o que é possível."},
        {"min": 0, "max": 7, "rotulo": "🔵 Vamos revisar juntos", "classe": "result-revisar",
         "titulo": "Talvez não seja o momento ideal — mas existem caminhos",
         "copy": "Talvez esse não seja o momento ideal{nome} — mas tem caminhos: compor renda, organizar documentação, tratar pendências. Vamos ver o que dá para fazer."},
    ],
}


def quiz():
    quiz_json = json.dumps(QUIZ, ensure_ascii=False).replace("</", "<\\/")
    body = page_hero(
        "Diagnóstico MCMV: descubra sua chance em 2 minutos",
        "8 perguntas rápidas. No final, você recebe um diagnóstico personalizado — e pode falar direto com um corretor de verdade.",
        trilha=[("Início", "/"), ("Quiz", None)],
        eyebrow="Diagnóstico gratuito",
    )
    body += """
<section class="page-content"><div class="container">
  <div class="quiz-box" id="quiz-app">
    <div class="quiz-progresso">
      <span class="qp-label">Pergunta 1 de 8 · 0%%</span>
      <div class="qp-trilha"><div class="qp-barra"></div></div>
    </div>
    <div class="quiz-q">
      <h2 id="quiz-titulo"></h2>
      <div class="quiz-options"></div>
    </div>
    <button type="button" class="quiz-voltar" style="display:none">← Voltar pergunta</button>
    <div class="quiz-gate">
      <h2>Quase lá! Para liberar seu resultado personalizado…</h2>
      <p class="muted">Preencha os campos abaixo — o diagnóstico aparece na hora, e um corretor pode te orientar no próximo passo (se você quiser).</p>
      <form class="js-lead" data-tipo="quiz" novalidate>
        <div class="form-grid">
          <div class="field"><label for="quiz-nome">Seu nome</label>
            <input id="quiz-nome" name="nome" type="text" placeholder="Seu nome" required></div>
          <div class="field"><label for="quiz-zap">WhatsApp</label>
            <input id="quiz-zap" name="whatsapp" type="tel" placeholder="(11) 91234-5678" required></div>
          <div class="field field-full"><label for="quiz-cidade">Cidade</label>
            <input id="quiz-cidade" name="cidade" type="text" placeholder="Sua cidade" required></div>
        </div>
        <label class="checkbox-field"><input type="checkbox" name="lgpd" value="sim" required>
          <span>Aceito receber contato sobre o Minha Casa Minha Vida e li a
          <a href="/politica-de-privacidade/" target="_blank">Política de Privacidade</a>.</span></label>
        <button type="submit" class="btn btn-primary btn-lg btn-block">Ver meu resultado 🎯</button>
        <p class="form-erro" role="alert"></p>
      </form>
    </div>
    <div class="quiz-resultado">
      <span class="result-badge quiz-result-badge"></span>
      <h2 class="quiz-result-titulo"></h2>
      <p class="lead quiz-result-copy"></p>
      <div class="quiz-result-wa botoes-duais">
        BOTAO1 BOTAO2
      </div>
      <p class="text-center muted small mt-2">Ou se preferir: <a href="/guia-minha-casa-minha-vida/"><strong>baixe o guia completo grátis</strong></a>.</p>
    </div>
  </div>
  <div class="quiz-passos">
    <div class="quiz-num">1</div><div class="quiz-num">2</div><div class="quiz-num">3</div><div class="quiz-num ativo">4</div>
  </div>
  <p class="text-center muted small">Responda → Libere o resultado → Receba o guia → Fale com um corretor</p>
  <div class="aviso-analise">""" + icone("alert") + """ <strong>Este diagnóstico é orientativo.</strong> Ele não substitui a análise de crédito e não garante aprovação — serve para organizar seu próximo passo. Sujeito às condições vigentes do programa.</div>
</div></section>
<script type="application/json" id="quiz-data">%s</script>""" % quiz_json

    b1 = wa_btn(1, "padrao", "Falar com %s" % nome_corretor(1), cls="btn btn-wa btn-lg")
    b2 = wa_btn(2, "padrao", "Falar com %s" % nome_corretor(2), cls="btn btn-wa btn-lg")
    body = body.replace("BOTAO1 BOTAO2", b1 + b2)

    pagina(
        "quiz",
        "Diagnóstico MCMV — Descubra Sua Chance em 2 Minutos",
        "Responda 8 perguntas rápidas e receba um diagnóstico personalizado sobre sua chance no Minha Casa Minha Vida. Grátis e sem compromisso.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Quiz", "/quiz/")])],
    )


# ================================================================
# /empreendimentos/
# ================================================================
EMPREENDIMENTOS = [
    {
        "slug": "residencial-vista-bela",
        "nome": "Residencial Vista Bela",
        "bairro": "Centro",
        "cidade": "[CIDADE 1]",
        "resumo": "Apartamentos de 2 e 3 quartos a poucos minutos de tudo: comércio, escolas e transporte.",
        "tipologias": [("2 quartos", "45 m²", "R$ 248.000"),
                       ("2 quartos com vaga", "48 m²", "R$ 262.000"),
                       ("3 quartos com vaga", "58 m²", "R$ 295.000")],
        "a_partir": "A partir de R$ 248.000",
        "preco_num": "248000",
        "entrega": "Entrega prevista: [MÊS/ANO]",
        "diferenciais": [
            ("pin", "Localização central", "Perto de escolas, mercados, farmácias e ponto de ônibus — sem depender de carro."),
            ("home", "Plantas inteligentes", "2 e 3 quartos bem distribuídos, com opção de vaga coberta."),
            ("users", "Área de lazer completa", "Salão de festas, playground e espaço gourmet para a família."),
        ],
        "pontos": ["Escola a 400 m", "Mercado a 600 m", "Ponto de ônibus a 200 m", "Praça a 350 m", "UBS a 900 m"],
        "faq": [
            ("Esse empreendimento aceita MCMV?",
             "Sim — as unidades se enquadram nas condições do programa, sujeito à sua faixa de renda e à análise de crédito."),
            ("Qual o valor da parcela aproximada?",
             "Depende da sua faixa de renda, do FGTS e do subsídio. Um corretor faz a simulação exata em minutos — sem compromisso."),
            ("Posso usar FGTS?",
             "Em geral sim, nas unidades enquadradas no programa. A confirmação depende do enquadramento da operação."),
            ("Quando é a entrega?",
             "A previsão vigente é [MÊS/ANO], sujeita ao cronograma da obra e às intempéries previstas em contrato."),
            ("Posso visitar o decorado?",
             "Sim! A visita é gratuita e pode ser agendada para hoje ou para o fim de semana."),
        ],
    },
    {
        "slug": "residencial-bosque-do-vale",
        "nome": "Residencial Bosque do Vale",
        "bairro": "Jardim das Palmeiras",
        "cidade": "[CIDADE 2]",
        "resumo": "2 quartos com vaga em uma região tranquila, com área verde e boa estrutura de bairro.",
        "tipologias": [("2 quartos", "42 m²", "R$ 235.000"),
                       ("2 quartos com vaga", "45 m²", "R$ 251.000")],
        "a_partir": "A partir de R$ 235.000",
        "preco_num": "235000",
        "entrega": "Entrega prevista: [MÊS/ANO]",
        "diferenciais": [
            ("heart", "Bairro tranquilo e verde", "Rua arborizada, com praça ao lado e vizinhança residencial."),
            ("shield", "Portaria e segurança", "Condomínio fechado com portaria digital e câmeras."),
            ("money", "Parcela que cabe no bolso", "Uma das melhores relações custo-benefício da região para o programa."),
        ],
        "pontos": ["Praça ao lado", "Escola a 500 m", "Mercado a 700 m", "Terminal a 1,2 km", "Farmácia a 400 m"],
        "faq": [
            ("Esse empreendimento aceita MCMV?",
             "Sim — voltado para famílias do programa, sujeito à faixa de renda e à análise de crédito."),
            ("Qual o valor da parcela aproximada?",
             "A simulação exata depende de renda, FGTS e subsídio — o corretor calcula em minutos, sem compromisso."),
            ("Posso usar FGTS?",
             "Em geral sim, nas unidades enquadradas no programa."),
            ("Quando é a entrega?",
             "Previsão vigente: [MÊS/ANO], conforme cronograma da obra."),
            ("Posso visitar o decorado?",
             "Sim, visitas todos os dias com agendamento prévio."),
        ],
    },
    {
        "slug": "residencial-solar-das-aguas",
        "nome": "Residencial Solar das Águas",
        "bairro": "Alvorada",
        "cidade": "[CIDADE 1]",
        "resumo": "3 quartos com vaga para quem quer espaço — e um bairro em plena expansão.",
        "tipologias": [("3 quartos com vaga", "62 m²", "R$ 290.000"),
                       ("3 quartos com 2 vagas", "66 m²", "R$ 312.000")],
        "a_partir": "A partir de R$ 290.000",
        "preco_num": "290000",
        "entrega": "Entrega prevista: [MÊS/ANO]",
        "diferenciais": [
            ("trending", "Bairro em expansão", "Região em valorização, com novos comércios e serviços chegando."),
            ("home", "Metragens generosas", "3 quartos com 62 m² — espaço de sobra para a família crescer."),
            ("compass", "Fácil acesso", "A 5 minutos da rodovia e das principais vias da cidade."),
        ],
        "pontos": ["Rodovia a 2 km", "Escola a 600 m", "Shopping a 3 km", "Parque linear a 800 m", "Supermercado a 500 m"],
        "faq": [
            ("Esse empreendimento aceita MCMV?",
             "Sim — com unidades enquadradas no programa, sujeito à faixa de renda e à análise de crédito."),
            ("Qual o valor da parcela aproximada?",
             "Depende de renda, FGTS e subsídio. O corretor simula em minutos, sem compromisso."),
            ("Posso usar FGTS?",
             "Em geral sim, nas unidades enquadradas no programa."),
            ("Quando é a entrega?",
             "Previsão vigente: [MÊS/ANO], conforme cronograma da obra."),
            ("Posso visitar o decorado?",
             "Sim — agende com um dos corretores pelo WhatsApp."),
        ],
    },
]


def card_empreendimento(emp):
    msg = "Olá! Tenho interesse no %s em %s. Quero saber valor de parcela e condições." % (emp["nome"], emp["cidade"])
    return (
        '<div class="card card-emp">'
        '<div class="emp-foto"><span class="badge">MCMV</span>%s</div>'
        '<div class="emp-body">'
        "<h3>%s</h3>"
        '<span class="emp-local">%s %s, %s</span>'
        '<span class="emp-preco">%s</span>'
        '<p class="small muted" style="margin:0">%s</p>'
        '<div class="emp-botoes">'
        '<a class="btn btn-primary" href="/empreendimentos/%s/">Ver detalhes</a>'
        '%s'
        "</div></div></div>"
    ) % (PREDIO_ART, emp["nome"], icone("pin"), emp["bairro"], emp["cidade"],
         emp["a_partir"], emp["entrega"], emp["slug"],
         wa_btn(1, "empreendimentos", "WhatsApp", cls="btn btn-wa", msg_custom=msg))


def hub_empreendimentos():
    body = page_hero(
        "Empreendimentos Minha Casa Minha Vida em <span class=\"js-cidades\">%s</span>" % R.CFG["cidades"],
        "Unidades novas que se enquadram nas condições do programa. Veja as plantas, visite o decorado e simule sua parcela — sem compromisso.",
        trilha=[("Início", "/"), ("Empreendimentos", None)],
        eyebrow="Vitrine",
    )
    body += '<section class="page-content"><div class="container">'
    body += '<div class="grid-3">'
    for emp in EMPREENDIMENTOS:
        body += card_empreendimento(emp)
    body += "</div>"
    body += ('<div class="nota-exemplo">%s <strong>Dados de exemplo</strong> — substitua nomes, valores e fotos pelos '
             "empreendimentos reais em <code>tools/content_extra.py</code> e rode <code>python tools/build_site.py</code>.</div>") % icone("alert")
    body += '<p class="small muted mt-2">Condições e disponibilidade sujeitas a alteração sem aviso. Valores sujeitos à análise de crédito. '
    'Imagens ilustrativas.</p>'
    body += """
<div class="bloco-e-agora mt-4">
  <h3>Não sabe qual cabe no seu bolso?</h3>
  <p>Faça o diagnóstico de 2 minutos — ou fale direto com um corretor para simular sua parcela.</p>
  <div class="botoes-duais">
    <a class="btn btn-ambar btn-lg" href="/quiz/">%s Fazer o diagnóstico</a>
    %s
  </div>
</div>
""" % (icone("target"), wa_btn(1, "empreendimentos", "Simular com %s" % nome_corretor(1), cls="btn btn-wa btn-lg"))
    body += aviso_analise()
    body += "</div></section>"

    pagina(
        "empreendimentos",
        "Empreendimentos Minha Casa Minha Vida em [CIDADES] — Veja as Unidades",
        "Veja os empreendimentos disponíveis do Minha Casa Minha Vida na região: plantas, valores e condições. Visite o decorado sem compromisso.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Empreendimentos", "/empreendimentos/")])],
    )


def paginas_empreendimentos():
    for emp in EMPREENDIMENTOS:
        msg = "Olá! Tenho interesse no %s em %s. Quero saber valor de parcela e condições." % (emp["nome"], emp["cidade"])

        body = page_hero(
            "%s — %s, %s" % (emp["nome"], emp["bairro"], emp["cidade"]),
            "",
            trilha=[("Início", "/"), ("Empreendimentos", "/empreendimentos/"), (emp["nome"], None)],
        )
        body += '<section class="page-content" style="padding-top:0"><div class="container">'
        # hero do empreendimento
        body += '<div class="emp-hero">'
        body += '<span class="badge" style="position:static;display:inline-block">✅ Enquadrado no MCMV</span>'
        body += "<h2 style=\"margin-top:.6rem\">%s</h2>" % emp["nome"]
        body += '<div class="emp-meta"><span class="tag">%s %s, %s</span><span class="tag-verde tag">%s</span><span class="tag-ambar tag">%s</span></div>' % (
            icone("pin"), emp["bairro"], emp["cidade"], emp["entrega"], "Unidades disponíveis")
        body += '<div class="emp-preco-destaque">%s</div>' % emp["a_partir"]
        body += ('<p class="muted">Parcelas que cabem no bolso — com FGTS e subsídio, conforme sua faixa de renda. '
                 '<strong>Valores ilustrativos de exemplo.</strong></p>')
        body += '<div class="botoes-duais" style="justify-content:flex-start">'
        body += wa_btn(1, "empreendimentos", "Falar com %s" % nome_corretor(1), cls="btn btn-wa btn-lg", msg_custom=msg)
        body += wa_btn(2, "empreendimentos", "Falar com %s" % nome_corretor(2), cls="btn btn-wa btn-lg", msg_custom=msg)
        body += "</div></div>"

        # sobre
        body += '<div class="prose mt-4"><h2>Sobre o empreendimento</h2>'
        body += ("<p>%s Localizado no bairro <strong>%s</strong>, em <strong>%s</strong>, o %s nasce para quem quer "
                 "sair do aluguel sem abrir mão de localização: perto de escolas, mercados e transporte.</p>") % (
            icone("pin"), emp["bairro"], emp["cidade"], emp["nome"])
        body += ("<p>As unidades foram desenhadas para famílias do programa: plantas inteligentes, acabamento "
                 "padrão pronto para morar e áreas comuns que agregam qualidade de vida ao dia a dia.</p>")
        body += ("<p>O empreendimento se enquadra nas condições do Minha Casa Minha Vida, o que permite usar FGTS, "
                 "acessar subsídio e juros reduzidos conforme a sua faixa de renda — tudo confirmado na simulação.</p></div>")

        # tipologias
        body += "<h2 class=\"mt-4\">Tipologias</h2><div class=\"grid-3\">"
        for tip, m2, preco in emp["tipologias"]:
            body += ('<div class="card"><span class="card-icon">%s</span><h3>%s</h3>'
                     '<p class="muted" style="margin:0">%s</p>'
                     '<p class="emp-preco" style="margin:.4rem 0 0">a partir de %s</p></div>') % (
                icone("home"), tip, m2, preco)
        body += "</div>"

        # condições MCMV
        body += '<div class="bloco-e-agora"><h3>Condições MCMV</h3>'
        body += '<div class="cond-grid">'
        for ic, t in [("check", "Se enquadra no Minha Casa Minha Vida"),
                      ("bank", "Pode usar o FGTS"),
                      ("user", "Faixa de renda compatível? A gente confere")]:
            body += '<div class="card" style="padding:1.1rem">%s <strong>%s</strong></div>' % (icone(ic), t)
        body += "</div>"
        body += '<div class="mt-2">%s</div>' % wa_btn(
            1, "empreendimentos", "Confirmar minha condição", cls="btn btn-wa btn-lg", msg_custom=msg)
        body += "</div>"

        # localização
        body += "<h2>Localização</h2>"
        body += ('<div class="mapa-card">%s<div class="mapa-nota">%s Mapa ilustrativo — substitua pelo embed real '
                 "(Google Maps / OpenStreetMap) em <code>tools/content_extra.py</code>.</div></div>") % (MAPA_ART, icone("pin"))
        body += '<ul class="pontos-lista">'
        for p in emp["pontos"]:
            body += "<li>%s %s</li>" % (icone("pin"), p)
        body += "</ul>"

        # plantas e tour
        body += '<h2 class="mt-4">Plantas e tour</h2>'
        body += '<div class="planta-grid">'
        tiles = [("file", "Planta — 2 quartos", "substituir pela planta real"),
                 ("file", "Planta — 3 quartos", "substituir pela planta real"),
                 ("camera", "Fachada", "substituir por foto real"),
                 ("eye", "Tour virtual 360°", "substituir pelo link do tour")]
        for ic, t1, t2 in tiles:
            body += '<div class="planta-tile">%s<strong>%s</strong><span>%s</span></div>' % (icone(ic), t1, t2)
        body += "</div>"

        # por quê
        body += '<h2 class="mt-4">Por que esse empreendimento?</h2><div class="grid-3">'
        for ic, t, d in emp["diferenciais"]:
            body += '<div class="card"><span class="card-icon">%s</span><h3>%s</h3><p class="small muted" style="margin:0">%s</p></div>' % (
                icone(ic), t, d)
        body += "</div>"

        # FAQ
        body += "<h2 class=\"mt-4\">Perguntas sobre o %s</h2>" % emp["nome"]
        body += faq_details([(q, a) for q, a in emp["faq"]])

        # CTA final
        body += '<div class="bloco-e-agora"><h3>Gostou? O próximo passo é uma conversa rápida.</h3>'
        body += "<p>Sem compromisso: a gente simula sua parcela e confirma as condições para o seu perfil.</p>"
        body += cta_duais("empreendimentos", msg_custom=msg)
        body += "</div>"
        body += aviso_analise()
        body += "</div></section>"

        pagina(
            "empreendimentos/" + emp["slug"],
            "%s em %s, %s — Minha Casa Minha Vida" % (emp["nome"], emp["bairro"], emp["cidade"]),
            "Conheça o %s: %s a partir de %s. Veja tipologias, localização e condições do Minha Casa Minha Vida." % (
                emp["nome"], emp["resumo"], emp["a_partir"].replace("A partir de ", "")),
            body,
            jsonld=[
                schema_breadcrumb([("Início", "/"), ("Empreendimentos", "/empreendimentos/"), (emp["nome"], "/empreendimentos/%s/" % emp["slug"])]),
                schema_produto(emp),
                schema_faq(emp["faq"]),
            ],
        )


# ================================================================
# /sobre/
# ================================================================
def sobre():
    cards = ""
    for i, c in enumerate((R.C1, R.C2), start=1):
        taglines = {
            1: "“Eu explico do jeito que eu explicaria pra minha mãe.”",
            2: "“Meu trabalho é te dizer a verdade, mesmo quando não é o que você quer ouvir.”",
        }
        cards += (
            '<div class="card corretor-card">'
            '<div class="corretor-avatar">%s</div>'
            "<h3>%s</h3>"
            '<div class="corretor-meta">'
            '<span class="tag">CRECI %s</span><span class="tag">%s</span>'
            '<span class="tag-verde tag">Atendimento humano</span>'
            "</div>"
            '<p class="tagline">%s</p>'
            '<p class="small muted">Atende famílias de segunda a sábado, com horário %s. '
            "Responde no WhatsApp em minutos durante o horário comercial.</p>"
            "%s"
            "</div>"
        ) % (icone("user"),
             '<span class="js-corretor-%d-nome">%s</span>' % (i, c["nome"]),
             '<span class="js-corretor-%d-creci">%s</span>' % (i, c["creci"]),
             R.CFG["cidades"],
             taglines[i], c["horario"],
             wa_btn(i, "sobre", "Falar com %s" % nome_corretor(i), cls="btn btn-wa"))

    body = page_hero(
        "Quem está do outro lado",
        "Site na internet é fácil de fazer. Confiança, não. Por isso apresentamos quem vai te atender — com nome, CRECI e WhatsApp abertos.",
        trilha=[("Início", "/"), ("Sobre", None)],
        eyebrow="Transparência",
    )
    body += '<section class="page-content"><div class="container">'
    body += '<div class="grid-2">%s</div>' % cards
    body += """
<h2 class="mt-4">Nosso compromisso</h2>
<div class="grid-cta">
  <div class="card"><span class="card-icon">%s</span><h3>Clareza primeiro</h3><p class="small muted" style="margin:0">Se você não entendeu, a culpa é nossa. Explicamos de novo, do jeito que der.</p></div>
  <div class="card"><span class="card-icon">%s</span><h3>Verdade, sempre</h3><p class="small muted" style="margin:0">Se o seu caso não fecha, a gente diz — e mostra o que fazer para fechar.</p></div>
  <div class="card"><span class="card-icon">%s</span><h3>Resposta rápida</h3><p class="small muted" style="margin:0">WhatsApp respondido em minutos no horário comercial. Você nunca fica no vácuo.</p></div>
  <div class="card"><span class="card-icon">%s</span><h3>Dados protegidos</h3><p class="small muted" style="margin:0">O que você conta fica entre nós, conforme a LGPD. Sem venda de dados, jamais.</p></div>
</div>
<div class="bloco-e-agora mt-4">
  <h3>"Isso é golpe?" — saiba como conferir</h3>
  <p class="small">Corretor de verdade tem CRECI consultável no site do Conselho Regional (CRECI do seu estado),
  CNPJ da empresa no rodapé do site e atende por número fixo de WhatsApp. Desconfie de quem pede dinheiro para
  "garantir aprovação" — aprovação ninguém garante.</p>
  <p class="small">Este site é informativo e independente: não temos vínculo com o Governo Federal, a Caixa Econômica
  Federal ou o programa Minha Casa Minha Vida. O atendimento é feito por corretores credenciados.</p>
</div>
""" % (icone("message"), icone("shield"), icone("zap"), icone("heart"))
    body += cta_duais("sobre")
    body += aviso_analise()
    body += "</div></section>"

    pagina(
        "sobre",
        "Sobre — Conheça os Corretores do MCMV Sem Dúvidas",
        "Conheça os corretores que atendem o MCMV Sem Dúvidas: CRECI, horários e atendimento humano pelo WhatsApp. Transparência total.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Sobre", "/sobre/")]), schema_localbusiness()],
    )


# ================================================================
# /contato/
# ================================================================
def contato():
    from render import form_contato
    body = page_hero(
        "Fale com a gente",
        "Escolha o canal que preferir: WhatsApp direto, formulário ou e-mail. O atendimento é humano — de verdade.",
        trilha=[("Início", "/"), ("Contato", None)],
        eyebrow="Contato",
    )
    body += '<section class="page-content"><div class="container">'
    body += """
<div class="contato-meta">
  <div class="card"><span class="card-icon">%s</span><h3>Resposta rápida</h3><p class="small muted" style="margin:0">Média de minutos no horário comercial.</p></div>
  <div class="card"><span class="card-icon">%s</span><h3>Atendimento humano</h3><p class="small muted" style="margin:0">Sem robôs: um corretor de verdade responde.</p></div>
  <div class="card"><span class="card-icon">%s</span><h3>E-mail</h3><p class="small muted" style="margin:0">%s</p></div>
</div>
<div class="lado-a-lado">
""" % (icone("zap"), icone("user"), icone("mail"), R.CFG["email"])
    body += form_contato()
    body += "<div>"
    body += '<div class="card"><h3>WhatsApp direto</h3><p class="small muted">Escolha com quem quer falar:</p>'
    body += '<div class="botoes-duais" style="flex-direction:column">'
    body += wa_btn(1, "contato", "Falar com %s — CRECI %s" % (nome_corretor(1), R.C1["creci"]), cls="btn btn-wa btn-lg")
    body += wa_btn(2, "contato", "Falar com %s — CRECI %s" % (nome_corretor(2), R.C2["creci"]), cls="btn btn-wa btn-lg")
    body += "</div></div>"
    body += '<div class="card mt-2"><h3>Atendimento por horário</h3>'
    body += '<ul class="check-list" style="margin:0">'
    body += "<li>%s — das 08h às 14h</li>" % nome_corretor(1)
    body += "<li>%s — das 14h às 20h</li>" % nome_corretor(2)
    body += '<li class="small muted" style="font-weight:400">Fora do horário? Deixe a mensagem que respondemos na abertura do próximo turno.</li>'
    body += "</ul></div></div></div>"
    body += aviso_analise()
    body += "</div></section>"

    pagina(
        "contato",
        "Contato — Fale com um Corretor do MCMV Sem Dúvidas",
        "Fale com um corretor do MCMV Sem Dúvidas: WhatsApp direto, formulário ou e-mail. Atendimento humano e resposta rápida.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Contato", "/contato/")])],
    )


# ================================================================
# /obrigado/
# ================================================================
def obrigado():
    pdf = "/assets/pdf/guia-mcmv-sem-duvidas.pdf"
    body = page_hero(
        "Pronto! Seu guia está a caminho. 🎉",
        "Enviamos o material para o seu e-mail e WhatsApp. Enquanto isso, você já pode dar os próximos passos:",
        trilha=[("Início", "/"), ("Obrigado", None)],
    )
    body += """
<section class="page-content"><div class="container" style="max-width:860px;text-align:center">
  <div class="obrigado-check">ICONCHECK</div>
  <div class="card">
    <h3 style="margin-top:0">📥 Não quer esperar? Baixe agora</h3>
    <p class="muted">O Guia Completo Minha Casa Minha Vida: do zero à chave — o mesmo que chega no seu e-mail.</p>
    <a class="btn btn-primary btn-lg" href="PDFLINK" download>Baixar o guia agora (PDF)</a>
  </div>
  <h2 class="mt-4">Enquanto isso, você pode:</h2>
  <div class="obrigado-acoes">
    <a class="card" href="WALINK1" data-wa data-corretor="1" data-msg="obrigado" target="_blank" rel="noopener">
      <span class="card-icon">ICONWA</span>
      <span><h3>Falar agora com <span class="js-corretor-1-nome">CORRETOR1</span></h3><p>Resposta em minutos no horário comercial.</p></span>
    </a>
    <a class="card" href="WALINK2" data-wa data-corretor="2" data-msg="obrigado" target="_blank" rel="noopener">
      <span class="card-icon">ICONWA</span>
      <span><h3>Falar agora com <span class="js-corretor-2-nome">CORRETOR2</span></h3><p>Resposta em minutos no horário comercial.</p></span>
    </a>
    <a class="card" href="/empreendimentos/">
      <span class="card-icon">ICONBUILD</span>
      <span><h3>Ver empreendimentos</h3><p>Unidades disponíveis que se enquadram no programa.</p></span>
    </a>
    <a class="card" href="/quiz/">
      <span class="card-icon">ICONTARGET</span>
      <span><h3>Fazer o diagnóstico MCMV</h3><p>8 perguntas para descobrir sua chance.</p></span>
    </a>
  </div>
  <p class="muted">⏱️ Resposta média: poucos minutos em horário comercial.</p>
  AVISO
</div></section>
"""
    body = (body
            .replace("ICONCHECK", icone("check"))
            .replace("ICONWA", icone("whatsapp"))
            .replace("ICONBUILD", icone("building"))
            .replace("ICONTARGET", icone("target"))
            .replace("PDFLINK", pdf)
            .replace("WALINK1", R.wa_href(R.C1, R.msg_de("obrigado")))
            .replace("WALINK2", R.wa_href(R.C2, R.msg_de("obrigado")))
            .replace("CORRETOR1", R.C1["nome"])
            .replace("CORRETOR2", R.C2["nome"])
            .replace("AVISO", aviso_analise()))

    pagina(
        "obrigado",
        "Obrigado! Seu Guia MCMV Está a Caminho",
        "Guia completo do Minha Casa Minha Vida enviado para seu e-mail. Enquanto isso, fale com um corretor ou faça o diagnóstico.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Obrigado", "/obrigado/")])],
        noindex=True,
    )


# ================================================================
# /blog/ + artigos
# ================================================================
ARTIGOS = [
    {
        "slug": "quanto-precisa-ganhar-mcmv",
        "titulo": "Quanto precisa ganhar para participar do Minha Casa Minha Vida?",
        "resumo": "A resposta muda por portaria — mas a lógica não. Entenda de uma vez como a renda é medida, o que entra na soma e como descobrir se você se encaixa.",
        "data": "Atualizado em outubro de 2026",
        "leitura": "6 min de leitura",
        "icone": "money",
        "corpo": """
<p>Essa é a primeira pergunta de quem considera o programa — e a resposta que mais gente erra por aí. Vamos por partes.</p>

<h2>O programa é dividido em faixas de renda</h2>
<p>O Minha Casa Minha Vida não tem um "salário para entrar". Ele tem <strong>faixas de renda familiar</strong>: quanto menor a renda, maiores o subsídio (dinheiro que o governo complementa) e o desconto nos juros. Quem está na faixa mais baixa paga menos juros e recebe mais subsídio; quem está no topo do programa ainda tem condições melhores que o financiamento comum.</p>
<p>Os valores de cada faixa <strong>mudam por portaria do Governo Federal</strong>. Qualquer artigo (inclusive este) que cravar um valor em reais pode estar desatualizado no dia em que você lê. Por isso o nosso approach é diferente: ensinamos a lógica e confirmamos o número vigente com você na conversa.</p>

<h2>Como a renda familiar é calculada</h2>
<p>O que conta é a <strong>renda bruta somada da família</strong> — não só a sua. Entra na soma:</p>
<ul class="check-list">
<li>Salário CLT (bruto, não o que cai na conta)</li>
<li>Renda de autônomo ou MEI (comprovável)</li>
<li>Aposentadoria e pensões</li>
<li>Pensão alimentícia recebida</li>
<li>Aluguéis recebidos</li>
</ul>
<p><strong>Não entram:</strong> benefícios assistenciais como Bolsa Família e auxílios temporários.</p>

<h2>"Acho que ganho demais" — será?</h2>
<p>Muita gente desiste sem perguntar. Duas situações comuns:</p>
<p><strong>1. Você esqueceu de somar a família.</strong> A composição de renda (cônjuge, familiar) muda o cálculo — para melhor na capacidade de pagar, embora a soma aumente a renda declarada.</p>
<p><strong>2. Você olhou uma tabela desatualizada.</strong> As faixas foram ampliadas ao longo do tempo. O teto de hoje não é o de dois anos atrás.</p>

<h2>E "ganho de menos"?</h2>
<p>O outro lado também existe: quem ganha muito pouco pode ter dificuldade de comportar a parcela — a regra prática é comprometer no máximo cerca de <strong>30% da renda bruta</strong>. Nessas situações, a composição de renda com um familiar costuma resolver.</p>

<h2>Como saber de verdade</h2>
<p>Somar tudo, conferir a faixa vigente e ver o que ela significa para o imóvel que você quer. Isso é uma conversa de 5 minutos com um corretor — gratuita e sem compromisso. Ou comece pelo nosso <a href="/quiz/">diagnóstico de 2 minutos</a>.</p>
""",
        "faq": [
            ("Qual a renda máxima para o MCMV?",
             "Depende da faixa vigente — os valores mudam por portaria. Confirme o número atual com um corretor antes de tirar conclusões."),
            ("Bolsa Família conta como renda?",
             "Não. Benefícios assistenciais não entram na soma da renda familiar do programa."),
            ("Posso somar a renda do meu cônjuge?",
             "Sim, e é muito comum. A composição de renda aumenta a capacidade de pagamento do financiamento."),
            ("Autônomo pode participar?",
             "Sim, com renda comprovável por extratos, notas e declarações. O que importa é a recorrência."),
        ],
    },
    {
        "slug": "nome-sujo-impede-mcmv",
        "titulo": "Nome sujo impede o Minha Casa Minha Vida? Entenda de uma vez",
        "resumo": "A resposta honesta: depende. Mas 'depende' não é porta fechada — é um caminho com etapas. Veja o que a análise olha e o que fazer antes de tentar.",
        "data": "Atualizado em outubro de 2026",
        "leitura": "7 min de leitura",
        "icone": "alert",
        "corpo": """
<p>Se você está com o nome negativado e quer comprar a primeira casa, este artigo é para você. Sem promessa milagrosa — só o caminho real.</p>

<h2>O que o banco realmente olha</h2>
<p>Negativação não é um "não" automático. A análise de crédito avalia o conjunto:</p>
<ul class="check-list">
<li>Valor total das dívidas em aberto</li>
<li>Há quanto tempo as restrições existem</li>
<li>Se dívidas já foram quitadas ou negociadas</li>
<li>Existência de protestos e ações judiciais</li>
<li>Sua renda e capacidade de pagamento atual</li>
</ul>
<p>O que reprova mais do que "nome sujo" é <strong>renda que não fecha</strong> ou dívida grande demais em relação à renda.</p>

<h2>O que fazer antes de dar entrada</h2>
<h3>1. Mapeie as pendências</h3>
<p>Tire um relatório completo (Serasa, SPC ou Boa Vista) e liste tudo: valor, credor, data.</p>
<h3>2. Resolva as pequenas primeiro</h3>
<p>Dívidas de R$ 80, R$ 150 penduradas no CPF pesam desproporcionalmente na leitura da análise. Quite ou negocie as menores.</p>
<h3>3. Negocie com desconto</h3>
<p>Na porta do credor, à vista, os descontos são reais. Se não tiver o valor todo, proponha parcelamento que caiba no seu orçamento.</p>
<h3>4. Guarde as provas</h3>
<p>Comprovantes de quitação e acordos firmados. Eles viram argumento na análise.</p>
<h3>5. Faça uma pré-análise antes de tentar</h3>
<p>Uma reprovação mal conduzida deixa rastro. Melhor preparar o caso com um corretor e entrar quando o dossiê estiver forte.</p>

<h2>E o cônjuge com nome sujo?</h2>
<p>Situação muito comum: um tem o nome limpo, o outro não. Como a análise considera quem entra no contrato, existem caminhos — avaliar se a compra pode ser individual, tratar as pendências do cônjuge ou compor renda com outro familiar. Cada caso é um caso: isso se decide na conversa, com o relatório na mesa.</p>

<h2>O que ninguém pode prometer</h2>
<p>Aprovação. Desconfie de quem prometer. O que um bom corretor faz é <strong>aumentar suas chances</strong>: dossiê organizado, pendências tratadas, renda bem comprovada e a unidade certa para o seu perfil.</p>

<h2>Próximo passo</h2>
<p>Fale com um dos corretores e mostre sua situação com transparência — quanto mais claro o retrato, mais precisa a orientação. Se preferir começar pelo diagnóstico, ele leva 2 minutos.</p>
""",
        "faq": [
            ("Com nome sujo dá para comprar pelo MCMV?",
             "Depende do valor e da situação das dívidas, da renda e do histórico. A pré-análise mostra o caminho."),
            ("Score baixo reprova sozinho?",
             "Não. Score é um sinal, não uma sentença. Renda comprovável e documentação em ordem pesam muito."),
            ("Quitar as dívidas melhora a chance?",
             "Sim, principalmente as pequenas. Guarde os comprovantes de quitação e acordos."),
            ("Meu cônjuge tem restrição. Compro sozinho(a)?",
             "É uma possibilidade a avaliar, junto com composição de renda e tratamento das pendências. Depende do caso."),
        ],
    },
    {
        "slug": "como-usar-fgts-mcmv",
        "titulo": "Como usar o FGTS para comprar sua casa: passo a passo",
        "resumo": "O FGTS é o melhor amigo de quem quer sair do aluguel — e o mais mal interpretado. Veja quando usar, para que serve e o que NUNCA fazer com o saldo.",
        "data": "Atualizado em outubro de 2026",
        "leitura": "7 min de leitura",
        "icone": "bank",
        "corpo": """
<p>O FGTS (Fundo de Garantia do Tempo de Serviço) é aquele dinheiro que o empregador deposita todo mês na sua conta vinculada. Muita gente esquece que ele existe — e ele pode ser a diferença entre conseguir e não conseguir a casa própria.</p>

<h2>Para que o FGTS serve na compra</h2>
<ul class="check-list">
<li><strong>Entrada:</strong> pagar parte (ou toda) a entrada do imóvel</li>
<li><strong>Abatimento:</strong> reduzir o valor financiado, o que derruba a parcela</li>
<li><strong>Amortização:</strong> abater o saldo devedor durante o financiamento</li>
<li><strong>Custas:</strong> em certas condições, cobrir parte de escritura e registro</li>
</ul>

<h2>As regras que importam</h2>
<p>Para usar o FGTS na compra, os pontos clássicos são:</p>
<ul class="check-list">
<li>Ter saldo disponível na conta vinculada</li>
<li>Não possuir outro financiamento ativo pelo SFH (em regra)</li>
<li>Ter, no mínimo, 3 anos de vínculo sob regime do FGTS — <strong>somando os períodos</strong>, sem precisar ser contínuo</li>
<li>O imóvel ser residencial urbano e se enquadrar nas regras do fundo</li>
</ul>
<p>Detalhes mudam conforme a operação. O corretor e o banco confirmam o enquadramento antes de qualquer movimentação.</p>

<h2>Como ver seu saldo</h2>
<p>Pelo aplicativo oficial do FGTS (Carteira de Trabalho Digital ou app do FGTS da Caixa). Dá para ver os depósitos, o saldo total e até simular quanto o fundo rendeu.</p>

<h2>O que NUNCA fazer</h2>
<p><strong>Não saque o saldo antes de planejar a compra.</strong> Saques comuns (demissão, aniversário) tiram o dinheiro da conta vinculada — e fora dela, o FGTS não serve para a operação. O saque-aniversário, em especial, pode comprometer usos futuros dependendo do momento e das regras vigentes: antes de qualquer saque, converse com quem entende de habitação.</p>

<h2>FGTS + subsídio: a combinação que muda o jogo</h2>
<p>No Minha Casa Minha Vida, quem está nas faixas mais baixas pode combinar <strong>subsídio</strong> (complemento do valor do imóvel) com o <strong>FGTS</strong> — e é isso que permite, em muitos casos, começar a pagar só as parcelas, sem entrada em dinheiro vivo. Isso não é regra para todo mundo: depende da faixa, do imóvel e da análise.</p>

<h2>Próximo passo</h2>
<p>Confira seu saldo no app, separe os últimos comprovantes de trabalho e converse com um corretor para ver como o FGTS se encaixa no seu plano.</p>
""",
        "faq": [
            ("Quanto tempo de FGTS preciso ter?",
             "Em geral, 3 anos somados sob o regime — não precisa ser contínuo."),
            ("Posso usar o FGTS como entrada?",
             "Sim, quando a operação se enquadra nas regras do fundo. É um dos usos mais comuns no programa."),
            ("Fiz saque-aniversário. Perdi o direito de usar o FGTS?",
             "Depende do momento e das regras vigentes. Antes de qualquer saque, consulte quem entende da operação."),
            ("O FGTS paga as parcelas do financiamento?",
             "Em condições específicas, pode abater parcelas ou amortizar o saldo. Conforme o contrato."),
        ],
    },
]


def blog_hub():
    body = page_hero(
        "Blog MCMV Sem Dúvidas",
        "Conteúdo direto, sem juridiquês e sem promessa furada. O que você precisa saber para sair do aluguel.",
        trilha=[("Início", "/"), ("Blog", None)],
        eyebrow="Conteúdo",
    )
    body += '<section class="page-content"><div class="container">'
    body += '<div class="grid-3">'
    for art in ARTIGOS:
        body += (
            '<a class="card card-blog" href="/blog/%s/">'
            '<div class="blog-cover">%s</div>'
            '<div class="blog-body"><span class="tag">%s</span><h3>%s</h3><p>%s</p>'
            '<span class="ler-mais">Ler artigo →</span></div></a>'
        ) % (art["slug"], icone(art["icone"]), art["leitura"], art["titulo"], art["resumo"])
    body += "</div>"

    pauta_restante = [
        "Minha Casa Minha Vida: o que mudou e como funciona agora",
        "Preciso dar entrada no Minha Casa Minha Vida?",
        "Sou MEI. Posso fazer o Minha Casa Minha Vida?",
        "Autônomo sem carteira assinada: como comprovar renda no MCMV",
        "Documentos para o MCMV: a lista completa e atualizada",
        "Posso comprar com meu cônjuge mesmo se ele tiver nome sujo?",
        "O que faz você ser reprovado no Minha Casa Minha Vida",
        "Quanto tempo demora o processo do MCMV até a chave?",
        "Minha Casa Minha Vida vale a pena? Análise honesta",
        "Score baixo e MCMV: o que realmente importa",
        "Posso comprar um imóvel usado pelo Minha Casa Minha Vida?",
        "Como escolher o empreendimento certo para o seu perfil",
        "Quais custos além do imóvel eu preciso considerar?",
        "Como funciona a visita ao decorado (e o que perguntar)",
        "10 erros que atrasam a aprovação do MCMV",
        "Apartamento MCMV na sua cidade: melhores bairros e o que avaliar",
        "Como funciona a análise de crédito do MCMV",
    ]
    body += '<h2 class="mt-4">Pauta completa — novos artigos toda semana</h2>'
    body += '<ul class="pauta-lista">'
    for tema in pauta_restante:
        body += '<li><span class="dot"></span>%s <span class="muted small">(em breve)</span></li>' % tema
    body += "</ul>"
    body += banner_guia()
    body += "</div></section>"

    pagina(
        "blog",
        "Blog MCMV — Conteúdo sobre o Minha Casa Minha Vida",
        "Artigos diretos sobre o Minha Casa Minha Vida: renda, FGTS, nome sujo, documentos e aprovação. Sem juridiquês.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Blog", "/blog/")])],
    )


def artigos_blog():
    for art in ARTIGOS:
        cta_meio = """
<div class="artigo-cta">
  <p>🎯 Quer saber como isso se aplica ao SEU caso?</p>
  <div class="botoes-duais">
    <a class="btn btn-wa" data-wa data-corretor="1" data-msg="blog" href="%s" target="_blank" rel="noopener">%s Falar com um corretor</a>
    <a class="btn btn-ghost" href="/quiz/">Fazer o diagnóstico (2 min)</a>
  </div>
</div>""" % (R.wa_href(R.C1, R.msg_de("blog")), icone("whatsapp"))

        corpo = art["corpo"]
        # insere CTA no meio do artigo
        partes = corpo.split("<h2>", 3)
        if len(partes) >= 3:
            corpo = partes[0] + "<h2>" + partes[1] + "<h2>" + partes[2] + cta_meio + "<h2>" + partes[3] if len(partes) == 4 else corpo
        else:
            corpo += cta_meio

        body = page_hero(art["titulo"], art["resumo"],
                         trilha=[("Início", "/"), ("Blog", "/blog/"), (art["titulo"][:30] + "…", None)])
        body += '<section class="page-content"><div class="container">'
        body += '<article class="artigo">'
        body += '<div class="meta"><span>%s</span><span>%s</span><span>Por <strong>Equipe MCMV Sem Dúvidas</strong></span></div>' % (
            icone("calendar") + " " + art["data"], icone("clock") + " " + art["leitura"])
        body += '<div class="artigo-info">⚠️ <strong>Os valores do programa (renda, teto do imóvel, subsídio e juros) mudam por portaria.</strong> Este artigo explica a lógica — confirme os números vigentes com um corretor.</div>'
        body += corpo
        body += cta_final("blog")
        body += '<h2 class="mt-4">Perguntas frequentes</h2>'
        body += faq_details(art["faq"])
        body += "</article></div></section>"

        pagina(
            "blog/" + art["slug"],
            art["titulo"] + " — Blog MCMV",
            art["resumo"],
            body,
            jsonld=[
                schema_breadcrumb([("Início", "/"), ("Blog", "/blog/"), (art["titulo"], "/blog/%s/" % art["slug"])]),
                schema_faq(art["faq"]),
            ],
        )


# ================================================================
# Páginas legais
# ================================================================
def politica_privacidade():
    body = page_hero("Política de Privacidade", "Como coletamos, usamos e protegemos seus dados — em linguagem simples, como tudo por aqui.",
                     trilha=[("Início", "/"), ("Política de Privacidade", None)])
    body += """<section class="page-content"><div class="container"><div class="prose">
<h2>1. Quem somos</h2>
<p>Este site (“MCMV Sem Dúvidas”, disponível em <strong>%s</strong>) é um site informativo independente,
operado por corretores de imóveis credenciados, com a finalidade de orientar pessoas interessadas no programa
habitacional Minha Casa Minha Vida.</p>

<h2>2. Quais dados coletamos</h2>
<p>Coletamos apenas o necessário para te atender:</p>
<ul>
<li><strong>Dados de contato:</strong> nome, WhatsApp, e-mail e cidade — informados por você nos formulários;</li>
<li><strong>Informações do seu interesse:</strong> faixa de renda aproximada, se possui FGTS, resultado do
diagnóstico e dúvida que motivou o contato;</li>
<li><strong>Dados de navegação:</strong> páginas visitadas e origem da visita (UTMs), quando você aceita
ferramentas de medição.</li>
</ul>

<h2>3. Para que usamos</h2>
<ul>
<li>Entrar em contato sobre o Minha Casa Minha Vida (finalidade declarada no formulário);</li>
<li>Enviar o material gratuito solicitado (Guia, checklist);</li>
<li>Melhorar o conteúdo do site de forma agregada.</li>
</ul>
<p><strong>Não vendemos nem compartilhamos seus dados com terceiros</strong> fora da finalidade de atendimento,
sem o seu consentimento.</p>

<h2>4. Base legal (LGPD)</h2>
<p>O tratamento se dá com base no seu <strong>consentimento</strong>, expresso no checkbox do formulário
(nunca pré-marcado), e no <strong>legítimo interesse</strong> de atendimento à solicitação que você iniciou.</p>

<h2>5. Por quanto tempo guardamos</h2>
<p>Seus dados ficam armazenados em CRM com acesso restrito pelos corretores responsáveis, pelo prazo máximo de
<strong>24 meses sem interação</strong>, quando são excluídos.</p>

<h2>6. Seus direitos</h2>
<p>Você pode, a qualquer momento e sem custo: confirmar quais dados temos, corrigi-los, solicitar a exclusão
(“ser esquecido”), portá-los ou revogar o consentimento. Basta escrever para
<a href="mailto:%s"><strong>%s</strong></a> — atendemos em até 15 dias.</p>

<h2>7. Cookies e medição</h2>
<p>Utilizamos cookies essenciais de navegação e, quando ativados, ferramentas de medição de audiência
(Google Analytics 4 / Meta Pixel). Você pode bloqueá-los nas configurações do seu navegador sem prejuízo ao
uso do site.</p>

<h2>8. Segurança</h2>
<p>Adotamos medidas técnicas razoáveis para proteger os dados contra acesso não autorizado. Contudo, nenhum
sistema é 100%% seguro — se algo acontecer, avisaremos você e às autoridades competentes conforme a lei.</p>

<h2>9. Alterações desta política</h2>
<p>Esta política pode ser atualizada. A versão vigente estará sempre nesta página, com data de atualização.</p>
<p class="muted small">Última atualização: outubro de 2026.</p>
</div></div></section>""" % (R.CFG["dominio"], R.CFG["email"], R.CFG["email"])
    pagina(
        "politica-de-privacidade",
        "Política de Privacidade — MCMV Sem Dúvidas",
        "Como coletamos, usamos e protegemos seus dados, conforme a LGPD. Seus direitos e como exercê-los.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Política de Privacidade", "/politica-de-privacidade/")])],
    )


def termos():
    body = page_hero("Termos de Uso", "As regras do jogo deste site — o que ele é e o que ele não é.",
                     trilha=[("Início", "/"), ("Termos de Uso", None)])
    body += """<section class="page-content"><div class="container"><div class="prose">
<h2>1. Natureza do site</h2>
<p>O “MCMV Sem Dúvidas” é um <strong>site informativo independente</strong>. Não temos vínculo com o Governo
Federal, a Caixa Econômica Federal, o Ministério das Cidades ou o programa Minha Casa Minha Vida. O nome do
programa é citado de forma descritiva e informativa.</p>

<h2>2. O conteúdo não é promessa</h2>
<p>As informações aqui têm caráter educativo. <strong>Elas não constituem promessa de aprovação de crédito,
nem garantia de condições</strong> (valores, subsídios, juros, prazos ou disponibilidade de unidades). Tudo
depende de análise de crédito e das condições vigentes do programa, que mudam por portaria.</p>

<h2>3. Marcas de terceiros</h2>
<p>“Minha Casa Minha Vida” é marca do Governo Federal. Nomes e marcas de construtoras citados pertencem aos
seus titulares e aparecem apenas de forma descritiva. Este site não representa oficialmente nenhuma delas.</p>

<h2>4. Empreendimentos e valores</h2>
<p>Nomes, valores e imagens de empreendimentos exibidos nesta versão do site são <strong>ilustrativos</strong>
e devem ser confirmados com os corretores no momento do atendimento. Condições e disponibilidade sujeitas a
alteração sem aviso.</p>

<h2>5. Uso do site</h2>
<p>É proibido usar este site para fins ilícitos, extração automatizada de dados ou engenharia reversa dos
seus componentes. O conteúdo é protegido por lei — compartilhe os links à vontade, mas não copie os textos
como se fossem seus.</p>

<h2>6. Limitação de responsabilidade</h2>
<p>Não nos responsabilizamos por decisões tomadas exclusivamente com base no conteúdo do site, sem a devida
orientação personalizada e análise formal de crédito.</p>

<h2>7. Contato</h2>
<p>Dúvidas sobre estes termos: <a href="mailto:%s">%s</a>.</p>
<p class="muted small">Última atualização: outubro de 2026.</p>
</div></div></section>""" % (R.CFG["email"], R.CFG["email"])
    pagina(
        "termos",
        "Termos de Uso — MCMV Sem Dúvidas",
        "Termos de uso do site MCMV Sem Dúvidas: natureza informativa, uso de marcas, limitação de responsabilidade e contato.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Termos de Uso", "/termos/")])],
    )


def pagina_404():
    body = """
<section class="page-content"><div class="container text-center" style="max-width:640px">
  <div class="modal-emoji">🔍</div>
  <h1>Essa página não existe (ou mudou de lugar)</h1>
  <p class="lead">Mas o caminho até sua casa continua aberto. Escolha:</p>
  <div class="quiz-passos" style="justify-content:center">
    <a class="btn btn-primary" href="/">Voltar ao início</a>
    <a class="btn btn-wa" href="/duvidas/">Tirar dúvidas</a>
    <a class="btn btn-ghost" href="/guia-minha-casa-minha-vida/">Baixar o guia</a>
  </div>
</div></section>"""
    pagina(
        "404", "Página não encontrada — MCMV Sem Dúvidas",
        "Página não encontrada.", body,
        noindex=True,
    )
