# -*- coding: utf-8 -*-
"""Conteúdo — páginas principais: home, guia, dúvidas, documentos, passo a passo."""
import render as R
from render import icone, pagina, wa_btn, nome_corretor, cta_duais, aviso_analise, \
    section_head, page_hero, faq_details, form_guia, bloco_mini_diag, cta_final, \
    banner_guia, schema_faq, schema_breadcrumb, schema_website, schema_howto, HERO_ART

# ================================================================
# DADOS COMPARTILHADOS (reutilizados no PDF)
# ================================================================

# As 27 dúvidas mais comuns (pergunta, resposta)
DUVIDAS_27 = [
    ("O que é o Minha Casa Minha Vida?",
     "É o programa federal de habitação que facilita a compra da primeira casa por famílias de baixa e média renda, "
     "com subsídio, juros reduzidos e possibilidade de usar o FGTS. As condições variam conforme a faixa de renda da família "
     "e podem mudar por portaria do Governo Federal."),
    ("Quem pode participar?",
     "Em regra: famílias com renda dentro das faixas do programa, que não possuam outro imóvel residencial, "
     "com CPF regular e situação apta a passar por análise de crédito. O enquadramento exato é confirmado na pré-análise, "
     "que é gratuita."),
    ("Qual a renda máxima?",
     "O programa é dividido em faixas de renda, e os valores de teto mudam por portaria. Quanto menor a renda familiar, "
     "maiores o subsídio e o desconto nos juros. Confirme o valor vigente com um corretor antes de tirar conclusões."),
    ("Qual a renda mínima?",
     "Não existe um valor fixo: o que importa é a renda ser comprovável e a parcela caber no orçamento — "
     "o comprometimento recomendado fica em até cerca de 30% da renda familiar bruta."),
    ("Preciso ter FGTS?",
     "Não é obrigatório, mas o saldo de FGTS ajuda muito: pode cobrir a entrada, reduzir o valor financiado e melhorar "
     "as condições. Quem tem pelo menos 3 anos de FGTS (somados) costuma ter mais opções."),
    ("Quanto tempo de FGTS eu preciso ter?",
     "Em geral, 3 anos de trabalho sob o regime do FGTS — somando os períodos, sem precisar ser contínuo — para os usos "
     "mais comuns do fundo na compra da casa própria. Cada operação tem detalhes: confirme seu caso."),
    ("Posso usar o FGTS para a entrada?",
     "Sim, quando a operação se enquadra nas regras do fundo de garantia. É um dos usos mais comuns no Minha Casa Minha Vida "
     "e ajuda a fechar a entrada sem dinheiro vivo."),
    ("Posso usar o FGTS para pagar parcelas?",
     "Em condições específicas, sim: o FGTS pode abater parcelas ou amortizar o saldo devedor, conforme o contrato e as "
     "regras vigentes. Vale conversar com o corretor sobre o que se aplica a você."),
    ("Preciso dar entrada?",
     "Não necessariamente. Em muitos casos, o subsídio e o FGTS cobrem a entrada — mas isso não é regra para todo mundo: "
     "depende da sua faixa de renda, do valor do imóvel e da análise de crédito. Só a análise do seu caso confirma."),
    ("Posso comprar sozinho(a)?",
     "Sim, desde que a sua renda comprovada comporte a parcela. Se não comportar, a composição de renda com cônjuge ou "
     "familiar pode aumentar a capacidade de compra."),
    ("Posso comprar com meu cônjuge?",
     "Sim, é o caso mais comum: soma-se a renda dos dois para o financiamento. Atenção: o histórico de crédito dos dois "
     "entra na análise, então as restrições de um podem afetar o resultado."),
    ("Posso comprar com um familiar?",
     "Sim. A composição de renda com pais, filhos ou irmãos é possível, desde que o familiar entre no contrato e passe "
     "pela mesma análise de crédito."),
    ("Sou MEI. Posso participar?",
     "Sim. O MEI comprova renda com o faturamento: DAS pagos, extrato bancário e a declaração anual do MEI. "
     "A análise costuma olhar a média de faturamento dos últimos meses."),
    ("Sou autônomo. Como comprovo renda?",
     "Com extratos bancários dos últimos meses, declaração de imposto de renda, notas fiscais e comprovantes de serviços. "
     "O que importa é demonstrar recorrência e compatibilidade com a parcela."),
    ("Estou desempregado(a). Posso participar?",
     "Sem renda comprovável, a aprovação fica muito difícil. Os caminhos são recompor a renda (composição com familiar) "
     "ou organizar tudo agora e dar entrada quando estiver com nova estabilidade."),
    ("Tenho nome sujo. Posso participar?",
     "Depende: do valor total das dívidas, do tempo de negativação, se já foram quitadas, da existência de protestos e da "
     "sua renda. Ninguém pode prometer aprovação — mas dá para preparar o caso antes de tentar, quitando ou negociando "
     "pendências."),
    ("Meu score é baixo. E agora?",
     "Score baixo não é porta fechada: é sinal de que a análise será mais cuidadosa. Renda bem comprovada e documentação "
     "impecável ajudam muito — e contas em dia sobem o score em 60 a 90 dias."),
    ("Já tenho imóvel. Posso participar?",
     "Em regra, o programa é para quem não tem imóvel residencial. Existem exceções legais para imóveis de baixíssimo valor "
     "em regras específicas — confirme o seu caso antes de desistir."),
    ("Posso escolher o imóvel?",
     "Sim. Você escolhe entre os empreendimentos e unidades disponíveis que se enquadram na sua faixa de renda e nas "
     "condições vigentes do programa."),
    ("Quanto tempo demora o processo?",
     "Da pré-análise à assinatura do contrato, normalmente de algumas semanas a poucos meses — dependendo da documentação "
     "e do banco. A entrega das chaves segue o cronograma da obra."),
    ("Quais documentos eu preciso?",
     "RG, CPF, comprovante de estado civil e de residência, comprovantes de renda dos últimos 3 meses, carteira de trabalho, "
     "extrato do FGTS e declaração de IR (se declarar). O checklist completo e imprimível está no nosso guia gratuito."),
    ("Como funciona a análise de crédito?",
     "O banco verifica a renda, o histórico de crédito, o comprometimento da renda, a documentação e o enquadramento no "
     "programa. O corretor monta o dossiê e faz uma pré-análise antes, para aumentar as chances."),
    ("O que faz alguém ser reprovado?",
     "Renda não comprovável, comprometimento financeiro alto, restrições não tratadas, documentos incompletos e "
     "inconsistências entre o que foi informado e o que foi comprovado."),
    ("Posso fazer uma simulação sem compromisso?",
     "Sim — e é o recomendado. A pré-análise com o corretor é gratuita e mostra o seu enquadramento antes de você tomar "
     "qualquer decisão."),
    ("Quais custos existem além do imóvel?",
     "ITBI, registro do imóvel e seguros (MIP/DFI) — no MCMV, vários desses custos são reduzidos ou embutidos na parcela, "
     "conforme a faixa. O corretor apresenta o detalhamento antes da assinatura."),
    ("Como faço para visitar o decorado?",
     "Agende com o corretor. A visita é gratuita: você conhece o apartamento decorado, as plantas, a área de lazer e a região "
     "do empreendimento."),
    ("E depois da aprovação, o que acontece?",
     "Você escolhe a unidade, assina o contrato, faz o registro e acompanha a obra até a entrega das chaves. "
     "O corretor acompanha cada etapa com você."),
]

CHECKLIST = {
    "voce": [
        "RG e CPF",
        "Comprovante de estado civil (certidão de nascimento ou casamento)",
        "Comprovante de residência (últimos 3 meses)",
        "Comprovantes de renda (últimos 3 meses)",
        "Carteira de trabalho (se CLT)",
        "Extrato do FGTS",
        "Declaração de Imposto de Renda (se declarar)",
    ],
    "conjuge": [
        "Os mesmos documentos pessoais listados acima",
        "Comprovantes de renda do cônjuge (se entrar na composição)",
    ],
    "autonomo": [
        "Extratos bancários dos últimos meses",
        "DAS / declaração de faturamento (MEI)",
        "Declaração de Imposto de Renda",
        "Notas fiscais de serviços (se houver)",
    ],
}

PASSOS_7 = [
    {"n": 1, "titulo": "Verificar se você se encaixa",
     "tempo": "Mesmo dia", "trava": "Renda fora da faixa · dúvida sobre FGTS",
     "desc": "Você conversa com o corretor e revisa renda familiar, saldo de FGTS, situação do nome e seus objetivos. "
             "Essa pré-análise é gratuita e já mostra se o caminho faz sentido agora — ou o que precisa ser organizado antes."},
    {"n": 2, "titulo": "Organizar os documentos",
     "tempo": "1 a 7 dias", "trava": "Documentos faltando ou vencidos",
     "desc": "Com o checklist em mãos, você separa RG, CPF, comprovantes de renda e residência, extrato do FGTS e o que "
             "mais se aplicar ao seu caso (autônomo, MEI, cônjuge). Documentação completa é o que mais acelera o processo."},
    {"n": 3, "titulo": "Análise de crédito",
     "tempo": "3 a 15 dias úteis", "trava": "Renda não comprovada · restrições não tratadas",
     "desc": "O corretor monta o dossiê e envia ao banco. O banco valida renda, histórico de crédito, comprometimento e o "
             "enquadramento no programa. Uma boa pré-análise aqui evita surpresas."},
    {"n": 4, "titulo": "Escolher o empreendimento",
     "tempo": "1 a 7 dias", "trava": "Unidades disponíveis · condições vigentes",
     "desc": "Com a capacidade de compra definida, você visita os empreendimentos que cabem no seu orçamento e escolhe "
             "considerando localização, tipologia, prazo de entrega e condições do programa."},
    {"n": 5, "titulo": "Escolher a unidade",
     "tempo": "Junto com o passo 4", "trava": "Unidade reservada por outro comprador",
     "desc": "Andar, posição, metragem, vaga: cada detalhe influencia o valor e a disponibilidade. A unidade é reservada "
             "no seu nome durante a conclusão do processo."},
    {"n": 6, "titulo": "Assinar o contrato",
     "tempo": "1 a 4 semanas após a aprovação", "trava": "Pendências documentais de terceiros",
     "desc": "Minuta, conferência dos valores e assinatura. O corretor revisa tudo com você antes — você não assina nada "
             "sem entender cada linha."},
    {"n": 7, "titulo": "Entrega das chaves",
     "tempo": "Conforme o cronograma da obra", "trava": "Atrasos de obra",
     "desc": "Registro do imóvel, vistoria e a melhor parte: receber a chave da sua casa. O corretor acompanha o "
             "cronograma da obra com você até lá."},
]


# ================================================================
# HOME
# ================================================================
def home():
    hero = """
<section class="hero"><div class="container hero-inner">
  <div class="hero-copy">
    <span class="badge-trust"><span class="ok">%s</span> Atendimento humano · CRECI em dia · <em>Sujeito à análise de crédito</em></span>
    <h1>Você não sabe se pode ter sua casa pelo <span>Minha Casa Minha Vida</span>?</h1>
    <p class="hero-sub">Descubra em 2 minutos — e receba o guia completo. Sem juridiquês, sem enrolação: a gente te explica
    renda, documentos, FGTS, entrada e parcela — e te diz o próximo passo.</p>
    <div class="hero-botoes">
      <a class="btn btn-wa btn-lg" data-wa data-corretor="1" data-msg="home" data-ab="primary"
         href="%s" target="_blank" rel="noopener">%s Falar com <span class="js-corretor-nome">%s</span> no WhatsApp</a>
      <a class="btn btn-ghost btn-lg" href="/guia-minha-casa-minha-vida/">%s Baixar o Guia Completo (grátis)</a>
    </div>
    <p class="small muted">Prefere o outro corretor? <a data-wa data-corretor="2" data-msg="home" data-ab="secondary"
      href="%s" target="_blank" rel="noopener">Falar com <span class="js-corretor-nome">%s</span></a></p>
  </div>
  <div class="hero-art">%s</div>
</div></section>""" % (
        icone("check"), R.wa_href(R.C1, R.msg_de("home")), icone("whatsapp"), R.C1["nome"],
        icone("download"),
        R.wa_href(R.C2, R.msg_de("home")), R.C2["nome"], HERO_ART,
    )

    cards_duvida = [
        ("money", "Renda", "Quanto preciso ganhar para participar?", "/duvidas/renda-familiar/"),
        ("file", "Documentos", "O que eu preciso separar?", "/documentos/"),
        ("bank", "FGTS", "Posso usar meu FGTS?", "/duvidas/fgts/"),
        ("card", "Entrada", "Preciso dar entrada? Quanto?", "/duvidas/entrada/"),
        ("alert", "Nome sujo", "Meu nome está sujo. E agora?", "/duvidas/nome-sujo/"),
        ("home", "Escolher", "Qual casa cabe no meu bolso?", "/empreendimentos/"),
    ]
    sec_duvidas = '<section class="section section-alt"><div class="container">'
    sec_duvidas += section_head("As dúvidas que travam todo mundo", "As 6 dúvidas que travam todo mundo",
                                "Clique na sua maior dúvida — a resposta está a um clique de distância.")
    sec_duvidas += '<div class="grid-3">'
    for ic, titulo, copy, href in cards_duvida:
        sec_duvidas += (
            '<a class="card card-duvida" href="%s"><span class="card-icon">%s</span>'
            "<h3>%s</h3><p>%s</p><span class=\"seta\">Ver resposta →</span></a>"
        ) % (href, icone(ic), titulo, copy)
    sec_duvidas += '</div><p class="text-center mt-3"><a class="btn btn-ghost" href="/duvidas/">Ver todas as 10 categorias de dúvidas</a></p>'
    sec_duvidas += "</div></section>"

    guia_cover = """
<div class="guia-cover" role="img" aria-label="Capa do Guia Completo Minha Casa Minha Vida">
  <span class="gc-selo">Guia gratuito</span>
  <div class="gc-titulo">Guia Completo Minha Casa Minha Vida</div>
  <div class="gc-sub">Do zero à chave</div>
  <div class="gc-lista">✓ Checklist de documentos<br>✓ 27 dúvidas respondidas<br>✓ Os 7 passos até a chave<br>✓ Linguagem simples</div>
</div>"""
    sec_guia = '<section class="section"><div class="container"><div class="guia-grid">'
    sec_guia += guia_cover
    sec_guia += "<div>"
    sec_guia += '<span class="eyebrow">A isca principal</span>'
    sec_guia += "<h2>Guia Completo Minha Casa Minha Vida: do zero à chave</h2>"
    sec_guia += "<p class=\"lead\">Tudo o que trava as pessoas, resolvido em um material só — em linguagem que qualquer pessoa entende.</p>"
    sec_guia += '<ul class="check-list">'
    for item in ["Checklist de documentos para não perder viagem",
                 "27 dúvidas respondidas em linguagem simples",
                 "Como funciona renda, FGTS, entrada e parcela",
                 "O passo a passo do início até a entrega das chaves",
                 "O que fazer se seu nome estiver negativado"]:
        sec_guia += "<li>%s</li>" % item
    sec_guia += "</ul>"
    sec_guia += form_guia()
    sec_guia += "</div></div></section>"

    sec_quiz = """
<section class="section section-alt"><div class="container">
  <div class="quiz-promo">
    <div>
      <span class="eyebrow">Diagnóstico gratuito</span>
      <h2>Descubra sua chance no MCMV em 2 minutos</h2>
      <p>8 perguntas rápidas. No final, você recebe um diagnóstico personalizado — e pode falar direto com um corretor de verdade.</p>
    </div>
    <a class="btn btn-ambar btn-lg" href="/quiz/">%s Começar o diagnóstico</a>
  </div>
</div></section>""" % icone("target")

    passos = [
        ("Você responde algumas perguntas", "No quiz de diagnóstico ou na conversa inicial — sem compromisso."),
        ("Recebe seu diagnóstico personalizado", "Você descobre em que pé está: o que já está pronto e o que falta."),
        ("Baixa o guia completo com o checklist", "O material que organiza tudo: documentos, dúvidas e passos."),
        ("Fala com um corretor de verdade", "Atendimento humano no WhatsApp, com CRECI e nome — sem robô."),
    ]
    sec_como = '<section class="section"><div class="container">'
    sec_como += section_head("Sem enrolação", "Como funciona",
                             "O site não vende casa: ele dá clareza. A venda é consequência.")
    sec_como += '<div class="steps">'
    for i, (t, d) in enumerate(passos, start=1):
        sec_como += '<div class="step"><div class="step-num">%d</div><h3>%s</h3><p>%s</p></div>' % (i, t, d)
    sec_como += "</div></div></section>"

    from content_extra import EMPREENDIMENTOS, card_empreendimento
    sec_emp = '<section class="section section-alt"><div class="container">'
    sec_emp += section_head("Vitrine", "Empreendimentos disponíveis em <span class=\"js-cidades\">%s</span>" % R.CFG["cidades"],
                            "Unidades novas que se enquadram nas condições do programa. Visite o decorado sem compromisso.")
    sec_emp += '<div class="grid-3">'
    for emp in EMPREENDIMENTOS:
        sec_emp += card_empreendimento(emp)
    sec_emp += "</div>"
    sec_emp += '<div class="nota-exemplo">%s <strong>Dados de exemplo</strong> — substitua nomes, valores e fotos pelos empreendimentos reais em <code>tools/content_extra.py</code> e reconstrua o site.</div>' % icone("alert")
    sec_emp += '<p class="small muted mt-2">Condições e disponibilidade sujeitas a alteração sem aviso. Valores sujeitos à análise de crédito.</p>'
    sec_emp += '<p class="text-center mt-2"><a class="btn btn-ghost" href="/empreendimentos/">Ver todos os empreendimentos</a></p>'
    sec_emp += "</div></section>"

    depoimentos = [
        ("“Eu achava que não podia porque meu nome estava sujo. Me explicaram tudo com paciência e deu certo.”", "[Nome]", "[Cidade]"),
        ("“Cheguei sem saber nada. Saí com a lista de documentos na mão e a proposta feita.”", "[Nome]", "[Cidade]"),
        ("“O guia respondeu 90% das minhas dúvidas antes mesmo de eu falar com alguém.”", "[Nome]", "[Cidade]"),
    ]
    sec_depo = '<section class="section"><div class="container">'
    sec_depo += section_head("Prova social", "Quem passou por aqui",
                             "Histórias reais de quem saiu da dúvida e foi até a chave.")
    sec_depo += '<div class="grid-3">'
    for frase, nome, cidade in depoimentos:
        inicial = nome.strip("[]")[:1].upper() if nome and not nome.startswith("[") else "?"
        sec_depo += (
            '<div class="card depoimento"><span class="stars">%s</span>'
            '<blockquote>%s</blockquote>'
            '<div class="depo-autor"><span class="depo-avatar">%s</span>'
            "<span><strong>%s</strong><span>%s</span></span></div></div>"
        ) % ("★" * 5, frase, inicial, nome, cidade)
    sec_depo += "</div>"
    sec_depo += '<p class="small muted text-center mt-2">%s Exemplo ilustrativo — use apenas depoimentos <strong>reais e autorizados</strong> (LGPD). Substitua em <code>tools/content_core.py</code>.</p>' % icone("alert")
    sec_depo += "</div></section>"

    faq_home = []
    respostas_curta = {
        0: "Famílias com renda dentro das faixas do programa, sem outro imóvel residencial, com CPF regular e aptas à análise de crédito.",
        2: "O programa é dividido em faixas de renda e os valores mudam por portaria. Confirme o valor vigente com o corretor.",
        4: "Não é obrigatório, mas o saldo ajuda: pode cobrir a entrada e reduzir o financiamento.",
        15: "Depende do valor e da situação das dívidas. Ninguém pode prometer aprovação — mas há como preparar o caso.",
        19: "Da pré-análise à assinatura: de semanas a poucos meses. Documentação completa acelera tudo.",
        8: "Não necessariamente: em muitos casos o subsídio + FGTS cobrem. Só a análise do seu caso confirma.",
        10: "Sim, somando a renda dos dois. O histórico de crédito dos dois é avaliado.",
        12: "Sim, com DAS, extratos e declaração anual. A análise olha a média de faturamento.",
    }
    perguntas_home = [0, 2, 4, 15, 19, 8, 10, 12]
    acoes = ('<div class="faq-actions"><a class="btn btn-wa" data-wa data-corretor="1" data-msg="padrao" '
             'href="%s" target="_blank" rel="noopener">%s Falar no WhatsApp</a>'
             '<a class="btn btn-ghost" href="/guia-minha-casa-minha-vida/">%s Baixar guia</a></div>')
    for idx in perguntas_home:
        q, a = DUVIDAS_27[idx]
        faq_home.append((q, a + acoes % (R.wa_href(R.C1, R.msg_de("padrao")), icone("whatsapp"), icone("download"))))
    sec_faq = '<section class="section section-alt"><div class="container">'
    sec_faq += section_head("Perguntas rápidas", "FAQ rápido",
                            "As dúvidas mais comuns, respondidas direto.")
    sec_faq += faq_details(faq_home)
    sec_faq += "</div></section>"

    body = hero + sec_duvidas + sec_guia + sec_quiz + sec_como + sec_emp + sec_depo + sec_faq + cta_final("home") + aviso_analise()

    pagina(
        "", "MCMV Sem Dúvidas — Descubra se Você Pode Ter Sua Casa",
        "Guia completo, checklist de documentos e diagnóstico gratuito do Minha Casa Minha Vida. Tire suas dúvidas e fale com um corretor.",
        body,
        jsonld=[schema_website(), schema_faq([(q, a) for q, a in faq_home])],
    )


# ================================================================
# /guia-minha-casa-minha-vida/ — landing do PDF
# ================================================================
def guia():
    dentro = [
        "📄 Checklist de documentos (imprimível)",
        "❓ 27 dúvidas respondidas em linguagem simples",
        "🏦 Como usar o FGTS a seu favor",
        "💰 Renda, entrada e parcela explicadas sem juridiquês",
        "📉 O que fazer com nome negativado e score baixo",
        "🚀 Os 7 passos até a entrega das chaves",
    ]
    body = page_hero(
        "Guia Completo Minha Casa Minha Vida: do zero à chave",
        "27 dúvidas respondidas, checklist de documentos e o passo a passo completo — em linguagem que qualquer pessoa entende.",
        trilha=[("Início", "/"), ("Guia grátis", None)],
        eyebrow="Material gratuito",
    )
    body += """
<section class="page-content"><div class="container"><div class="lado-a-lado">
  <div>
    <h2>O que tem dentro</h2>
    <ul class="check-list">"""
    for item in dentro:
        body += "<li>%s</li>" % item
    body += """
    </ul>
    <h3>Para quem é</h3>
    <p>Para quem paga aluguel e não sabe se pode comprar. Para quem acha que ganha demais ou de menos.
    Para quem está com o nome sujo e quer entender o caminho. Para quem quer parar de procurar respostas
    em dez lugares diferentes.</p>
    <div class="bloco-e-agora" style="text-align:left">
      <h3>Como você recebe</h3>
      <p>%s Você preenche o formulário → %s recebe o guia no e-mail e WhatsApp → %s lê com calma e dá o próximo passo com um corretor.</p>
    </div>
  </div>
  <div>
""" % (icone("file"), icone("mail"), icone("check"))
    body += form_guia()
    body += """
  </div>
</div>"""
    body += aviso_analise()
    body += "</div></section>"
    body += banner_guia()

    pagina(
        "guia-minha-casa-minha-vida",
        "Guia Completo Minha Casa Minha Vida (Grátis): do Zero à Chave",
        "Baixe grátis o guia completo do Minha Casa Minha Vida: checklist de documentos, 27 dúvidas respondidas e o passo a passo até a chave.",
        body,
        jsonld=[schema_breadcrumb([("Início", "/"), ("Guia grátis", "/guia-minha-casa-minha-vida/")])],
    )


# ================================================================
# /duvidas/ — hub
# ================================================================
CATEGORIAS = [
    # (slug, ícone, nome, pergunta-chave H1, msg_key, índices das relacionadas em DUVIDAS_27)
    ("quem-pode-participar", "user", "Quem pode participar?", "Quem pode participar do Minha Casa Minha Vida?", "quem_pode", [0, 1, 2, 17]),
    ("renda-familiar", "money", "Renda familiar", "Qual a renda necessária para o Minha Casa Minha Vida?", "renda", [2, 3, 10, 11]),
    ("documentos", "file", "Documentos", "Quais documentos preciso para o Minha Casa Minha Vida?", "documentos", [20, 5, 21]),
    ("fgts", "bank", "FGTS", "Posso usar o FGTS para comprar minha casa?", "fgts", [4, 5, 6, 7]),
    ("entrada", "card", "Entrada", "Preciso dar entrada para comprar pelo MCMV?", "entrada", [8, 4, 24]),
    ("parcelas", "chart", "Parcelas", "Quanto vou pagar por mês?", "parcelas", [23, 24, 3]),
    ("nome-sujo", "alert", "Nome sujo", "Estou com nome negativado. Posso participar do MCMV?", "nome_sujo", [15, 10, 22]),
    ("score", "trending", "Score de crédito", "Meu score é baixo. Isso me impede?", "score", [16, 21, 22]),
    ("aprovacao", "check", "Aprovação", "Como funciona a aprovação? Quanto tempo demora?", "aprovacao", [21, 22, 19, 23]),
    ("empreendimentos", "building", "Empreendimentos", "Como escolher o empreendimento certo?", "empreendimentos", [18, 25, 26]),
]

RESPOSTAS = {
    "quem-pode-participar": """
<p>O programa é feito para famílias que querem comprar a primeira casa e não conseguem financiamento pelas
condições normais do mercado. Em geral, é preciso:</p>
<ul class="check-list">
<li>Ter <strong>renda familiar</strong> dentro dos limites do programa</li>
<li><strong>Não ter outro imóvel</strong> residencial no nome</li>
<li>Ter o <strong>nome apto a passar em análise de crédito</strong></li>
<li>Ter <strong>CPF regular</strong> e documentação em ordem</li>
</ul>
<p>Não existe "perfil perfeito": existem famílias de todos os tipos — casais, pais com filhos, pessoas sozinhas,
autônomos, MEIs, aposentados. O que define a participação é o conjunto <strong>renda + situação cadastral +
documentação</strong>.</p>
<h3>Atenção</h3>
<p>As regras e os limites de renda mudam por portaria. Por isso, o mais seguro é confirmar seu caso específico
com um corretor — leva 5 minutos e evita você perder tempo com informação desatualizada.</p>
""",
    "renda-familiar": """
<p>O programa é dividido em <strong>faixas de renda</strong>. Quanto menor a renda da família, maior o subsídio
e menores os juros. É o jeito do programa priorizar quem mais precisa.</p>
<p>O cálculo é feito com a <strong>renda familiar bruta somada</strong> — ou seja, você + cônjuge + quem mora
com você e compõe renda.</p>
<h3>Como somar</h3>
<ul class="check-list">
<li>Salário CLT (bruto)</li>
<li>Renda de autônomo (com comprovação)</li>
<li>Aposentadoria / pensão</li>
<li>Pensão alimentícia recebida</li>
<li>Aluguel recebido</li>
</ul>
<p><strong>O que NÃO entra:</strong> benefícios como Bolsa Família, auxílios temporários e similares.</p>
<div class="prose-aviso"><p>⚠️ Os valores das faixas mudam por portaria. Confirme o valor vigente com um corretor
antes de assumir que você está dentro ou fora.</p></div>
""",
    "documentos": """
<p>A lista parece grande, mas é simples. O segredo é separar <strong>antes</strong> de ir ao corretor —
isso economiza semanas no processo.</p>
<h3>Documentos pessoais</h3>
<p>RG, CPF, certidão de nascimento ou casamento, comprovante de residência.</p>
<h3>Comprovação de renda</h3>
<p>Holerites dos últimos 3 meses (CLT), extratos bancários (autônomo/MEI), declaração de IR, extrato do FGTS.</p>
<h3>Se tiver cônjuge</h3>
<p>Os mesmos documentos dele(a), se entrar na composição de renda.</p>
<p>👉 O checklist completo e imprimível está na nossa página de documentos — e no guia gratuito.</p>
""",
    "fgts": """
<p>Sim, na maioria dos casos. O FGTS pode ser usado para:</p>
<ul class="check-list">
<li><strong>Dar entrada</strong> ou amortizar o valor</li>
<li><strong>Reduzir o saldo devedor</strong> do financiamento</li>
<li><strong>Pagar parte das parcelas</strong> (em condições específicas)</li>
<li><strong>Cobrir custos</strong> de escritura e registro</li>
</ul>
<h3>Regras principais</h3>
<ul class="check-list">
<li>É preciso ter saldo na conta vinculada</li>
<li>A compra deve ser de imóvel residencial urbano</li>
<li>A operação precisa se enquadrar nas regras do fundo</li>
<li>Em geral, é necessário ter pelo menos 3 anos de trabalho sob regime do FGTS (soma dos períodos)</li>
</ul>
<div class="prose-aviso"><p>⚠️ Não saque antes de confirmar. Cada caso tem detalhes que mudam o resultado —
e o saldo sai da conta na hora da operação, não antes.</p></div>
""",
    "entrada": """
<p>Não necessariamente. Muitos casos conseguem <strong>entrada zero</strong> ou entrada coberta pelo
<strong>subsídio + FGTS</strong>.</p>
<h3>O que define isso</h3>
<ul class="check-list">
<li>Sua faixa de renda</li>
<li>Valor do imóvel</li>
<li>Saldo de FGTS disponível</li>
<li>Análise de crédito</li>
</ul>
<p>Na prática: em boa parte dos atendimentos, o FGTS e o subsídio cobrem a entrada — e a família começa a
pagar só as parcelas. Mas isso <strong>não é regra para todo mundo</strong>. Só a análise do seu caso confirma.</p>
""",
    "parcelas": """
<p>A parcela depende de três coisas:</p>
<ul class="check-list">
<li><strong>Valor do imóvel</strong></li>
<li><strong>Valor financiado</strong> (depois de subsídio + FGTS + entrada)</li>
<li><strong>Prazo e taxa de juros</strong> da sua faixa de renda</li>
</ul>
<p>Quanto menor sua renda, <strong>menor o juros</strong> e <strong>maior o subsídio</strong> — e a parcela
pode caber bem no orçamento.</p>
<h3>Regra prática</h3>
<p>Sua parcela não deve comprometer mais de <strong>30% da renda familiar bruta</strong>.</p>
<p>O cálculo exato muda muito de caso para caso. Em vez de chutar, vale simular com um corretor —
é rápido e gratuito.</p>
""",
    "nome-sujo": """
<p>Essa é a dúvida que mais trava as pessoas — e a resposta honesta é: <strong>depende</strong>.</p>
<h3>O que conta na análise</h3>
<ul class="check-list">
<li>Valor total das dívidas</li>
<li>Há quanto tempo estão negativadas</li>
<li>Se já foram quitadas ou negociadas</li>
<li>Se há protestos ou processos</li>
<li>Sua renda e capacidade de pagamento</li>
</ul>
<h3>O que ajuda</h3>
<ul class="check-list">
<li>Quitar ou negociar as dívidas menores primeiro</li>
<li>Tirar certidões de quitação</li>
<li>Ter uma renda comprovável e estável</li>
<li>Fazer uma análise prévia antes de dar entrada no processo</li>
</ul>
<h3>O que NÃO fazemos</h3>
<p>Prometer aprovação. Ninguém pode prometer isso. O que fazemos é olhar seu caso e te dizer honestamente
qual é o caminho — mesmo quando a resposta é "resolvamos isso primeiro".</p>
""",
    "score": """
<p>Score baixo <strong>não é uma porta fechada</strong> — é um sinal de que a análise vai ser mais cuidadosa.</p>
<h3>O que ajuda a melhorar</h3>
<ul class="check-list">
<li>Colocar as contas em dia</li>
<li>Evitar novos pedidos de crédito por 60–90 dias</li>
<li>Manter CPF ativo e endereço atualizado nos bureaus de crédito</li>
<li>Ter comprovação de renda consistente</li>
<li>Compor renda com cônjuge ou familiar</li>
</ul>
<p>Muitos casos com score baixo são aprovados quando a renda é bem comprovada e a documentação está impecável.
O contrário também é verdade: score alto não garante nada se a renda não fechar.</p>
""",
    "aprovacao": """
<p>O fluxo completo é este:</p>
<ul class="check-list">
<li><strong>Pré-análise</strong> com o corretor (mesmo dia)</li>
<li><strong>Envio de documentos</strong> (1–3 dias)</li>
<li><strong>Análise de crédito</strong> pelo banco (3–15 dias úteis)</li>
<li><strong>Aprovação e escolha da unidade</strong></li>
<li><strong>Assinatura do contrato</strong></li>
<li><strong>Registro e entrega das chaves</strong></li>
</ul>
<h3>O que mais atrasa</h3>
<p>Documentos incompletos e renda não comprovada. Na prática, essas duas coisas atrasam mais processos do que
qualquer outra.</p>
<h3>O que você pode fazer hoje</h3>
<p>Separar os documentos com antecedência, usando o checklist gratuito.</p>
""",
    "empreendimentos": """
<p>Considere estes critérios antes de escolher:</p>
<ul class="check-list">
<li><strong>Localização</strong> — distância do trabalho, escola, transporte</li>
<li><strong>Tipologia</strong> — 2 ou 3 quartos, com ou sem vaga</li>
<li><strong>Valor da parcela</strong> — cabe no seu orçamento?</li>
<li><strong>Condições do MCMV</strong> — o empreendimento se encaixa na sua faixa?</li>
<li><strong>Prazo de entrega</strong></li>
<li><strong>Infraestrutura do bairro</strong></li>
</ul>
<p>Trabalhamos com empreendimentos que se enquadram no programa em <span class="js-cidades">%s</span>.
Dá para visitar o decorado, ver as plantas e conhecer a região antes de decidir.</p>
""" % "[CIDADES]",
}


def hub_duvidas():
    body = page_hero(
        "Tire sua dúvida sobre o Minha Casa Minha Vida",
        "Escolha um tema ou digite sua pergunta. Cada resposta termina com o próximo passo — porque informação sem ação não muda nada.",
        trilha=[("Início", "/"), ("Dúvidas", None)],
        eyebrow="Tirador de dúvidas",
    )
    body += """
<section class="page-content"><div class="container">
  <div class="busca">
    <span class="busca-ic">ICONBUSCA</span>
    <input type="search" id="busca-duvidas" placeholder="Digite sua dúvida: ex. 'nome sujo', 'FGTS', 'renda'…" aria-label="Buscar dúvida">
  </div>
  <div class="categorias-grid">
""" .replace("ICONBUSCA", icone("search"))
    for slug, ic, nome, _h1, _msg, _rel in CATEGORIAS:
        body += (
            '<a class="categoria-card js-buscavel" href="/duvidas/%s/"><span class="card-icon">%s</span>%s</a>'
        ) % (slug, icone(ic), nome)
    body += """
  </div>
  <p class="busca-semResultado">Nenhuma dúvida encontrada com esse termo. <a href="/contato/">Pergunte direto para a gente</a> — respondemos rápido.</p>
"""
    faq_top = [(DUVIDAS_27[i][0], DUVIDAS_27[i][1]) for i in [0, 2, 4, 8, 15, 16, 20, 21, 19, 23]]
    body += '<h2 class="text-center mt-4">Perguntas frequentes</h2><p class="text-center muted">As mais buscadas, com resposta curta e direta.</p>'
    body += faq_details(faq_top, com_busca=True)
    body += '<div class="bloco-e-agora"><h3>Não achou sua dúvida?</h3><p>Pergunte para um corretor de verdade — sem compromisso e sem custos.</p>%s</div>' % cta_duais("padrao")
    body += aviso_analise()
    body += "</div></section>"

    pagina(
        "duvidas",
        "Dúvidas sobre o Minha Casa Minha Vida — Respostas Simples",
        "Tire suas dúvidas sobre o Minha Casa Minha Vida: renda, FGTS, entrada, parcelas, nome sujo, score e aprovação. Respostas simples + próximo passo.",
        body,
        jsonld=[
            schema_breadcrumb([("Início", "/"), ("Dúvidas", "/duvidas/")]),
            schema_faq(faq_top),
        ],
    )


def paginas_duvidas():
    for slug, ic, nome, h1, msg_key, rel in CATEGORIAS:
        seo_titulos = {
            "quem-pode-participar": ("Quem Pode Participar do Minha Casa Minha Vida? Veja os Requisitos",
                                     "Descubra quem pode participar do Minha Casa Minha Vida: renda, imóvel no nome, CPF e análise de crédito — explicado em linguagem simples."),
            "renda-familiar": ("Renda Familiar no Minha Casa Minha Vida: Quanto Precisa Ganhar",
                               "Entenda como funciona a renda familiar no MCMV: o que soma, o que não entra e por que as faixas mudam por portaria."),
            "documentos": ("Documentos para o Minha Casa Minha Vida: o Que Separar",
                           "Veja quais documentos precisa para o Minha Casa Minha Vida: pessoais, renda, cônjuge, autônomo e MEI. Baixe o checklist grátis."),
            "fgts": ("Posso Usar meu FGTS no Minha Casa Minha Vida? Entenda as Regras",
                     "Saiba quando e como usar o FGTS no Minha Casa Minha Vida: entrada, amortização, parcelas e as regras do fundo em linguagem clara."),
            "entrada": ("Preciso Dar Entrada no Minha Casa Minha Vida? Depende",
                        "Entenda se você precisa dar entrada no MCMV: como subsídio e FGTS podem cobrir — e por que isso não vale para todo mundo."),
            "parcelas": ("Quanto Fica a Parcela do Minha Casa Minha Vida?",
                         "Entenda o que define a parcela do MCMV: valor do imóvel, financiamento, juros da sua faixa e a regra dos 30% da renda."),
            "nome-sujo": ("Nome Sujo no Minha Casa Minha Vida: Posso Participar?",
                          "Entenda como funciona a análise de crédito do MCMV para quem está negativado e o que fazer antes de dar entrada no processo."),
            "score": ("Score Baixo Impede o Minha Casa Minha Vida? Entenda",
                      "Descubra o que o score significa de verdade na análise do MCMV e o que fazer para melhorar suas chances em 60–90 dias."),
            "aprovacao": ("Aprovação do Minha Casa Minha Vida: Como Funciona e Quanto Demora",
                          "Veja o fluxo completo da aprovação do MCMV: pré-análise, documentos, análise de crédito, contrato e chaves — com prazos reais."),
            "empreendimentos": ("Como Escolher o Empreendimento Certo no Minha Casa Minha Vida",
                                "Localização, tipologia, parcela, prazo de entrega: veja os critérios para escolher o empreendimento certo no MCMV."),
        }
        titulo_seo, desc_seo = seo_titulos[slug]

        resposta = RESPOSTAS[slug]
        # mini-diagnóstico usa o nome da categoria
        relacionadas = [(DUVIDAS_27[i][0], DUVIDAS_27[i][1] +
                         ' <a href="/duvidas/%s/">Ler a resposta completa →</a>' % slug) for i in rel]

        body = page_hero(h1, "", trilha=[("Início", "/"), ("Dúvidas", "/duvidas/"), (nome, None)])
        body += '<section class="page-content"><div class="container"><div class="prose">'
        body += resposta
        body += '<div class="bloco-e-agora"><h3>E agora?</h3><p>Leu até aqui? O próximo passo é falar com quem entende — sem compromisso.</p>'
        body += cta_duais(msg_key, com_guia=True)
        body += "</div>"
        body += bloco_mini_diag(nome)
        body += "<h2>Perguntas relacionadas</h2>"
        body += faq_details(relacionadas)
        body += aviso_analise()
        body += "</div></div></section>"

        schema_itens = [(h1, resposta)] + [(DUVIDAS_27[i][0], DUVIDAS_27[i][1]) for i in rel]
        pagina(
            "duvidas/" + slug, titulo_seo, desc_seo, body,
            jsonld=[
                schema_breadcrumb([("Início", "/"), ("Dúvidas", "/duvidas/"), (nome, "/duvidas/%s/" % slug)]),
                schema_faq(schema_itens),
            ],
        )


# ================================================================
# /documentos/ — checklist
# ================================================================
def documentos():
    def bloco(titulo, ic, itens, nota=""):
        html = '<div class="checklist-bloco"><h3>%s %s</h3><ul class="checklist-lista">' % (icone(ic), titulo)
        for it in itens:
            html += '<li><span class="checklist-caixa" role="checkbox" aria-checked="false" tabindex="0"></span><span>%s</span></li>' % it
        html += "</ul>"
        if nota:
            html += '<p class="small muted mt-1">%s</p>' % nota
        return html + "</div>"

    body = page_hero(
        "Documentos para o Minha Casa Minha Vida: a lista completa",
        "Separe tudo antes de ir ao corretor. Isso economiza semanas — e evita perder uma unidade por documento faltando.",
        trilha=[("Início", "/"), ("Documentos", None)],
        eyebrow="Checklist",
    )
    body += '<section class="page-content"><div class="container"><div class="lado-a-lado">'
    body += "<div>"
    body += bloco("Você", "user", CHECKLIST["voce"])
    body += bloco("Cônjuge / companheiro(a)", "users", CHECKLIST["conjuge"],
                  "Se entrar na composição de renda — o que é muito comum.")
    body += bloco("Se autônomo / MEI", "chart", CHECKLIST["autonomo"],
                  "O que importa é demonstrar recorrência da renda.")
    body += '<div class="bloco-e-agora"><h3>Dica de ouro</h3><p>Monte uma pasta (física ou digital) com tudo escaneado. '
    'Quem chega com o dossiê pronto adianta o processo em dias.</p>'
    body += '<p class="small muted">🖨️ Dica: esta página é imprimível — use <strong>Ctrl + P</strong> e leve a lista com você.</p></div>'
    body += "</div>"
    body += "<div>"
    body += form_guia(titulo="📥 Baixe o checklist + guia em PDF",
                      botao="📥 Quero o checklist e o guia grátis")
    body += '<div class="card mt-2"><h3>Preferiu perguntar direto?</h3><p class="small muted">Fale com um corretor e confirme o que se aplica ao seu caso.</p>'
    body += cta_duais("documentos", com_guia=False, tamanho="")
    body += "</div></div></div>"
    body += aviso_analise()
    body += "</div></section>"

    faq_docs = [(DUVIDAS_27[i][0], DUVIDAS_27[i][1]) for i in [20, 13, 11, 21]]
    body += '<section class="section section-alt no-print"><div class="container">'
    body += section_head("Documentos", "Perguntas relacionadas")
    body += faq_details(faq_docs)
    body += "</div></section>"

    pagina(
        "documentos",
        "Documentos Minha Casa Minha Vida: Lista Completa",
        "Veja a lista completa de documentos para o Minha Casa Minha Vida — CLT, autônomo e MEI. Checklist imprimível e PDF grátis.",
        body,
        jsonld=[
            schema_breadcrumb([("Início", "/"), ("Documentos", "/documentos/")]),
            schema_faq(faq_docs),
        ],
    )


# ================================================================
# /passo-a-passo/ — timeline
# ================================================================
def passo_a_passo():
    body = page_hero(
        "Minha Casa Minha Vida: o passo a passo completo até a chave",
        "As 7 etapas do processo — com tempo médio, o que pode travar e o que fazer em cada uma. Sem mistério.",
        trilha=[("Início", "/"), ("Passo a passo", None)],
        eyebrow="Timeline",
    )
    body += '<section class="page-content"><div class="container">'
    body += '<div class="timeline">'
    for p in PASSOS_7:
        body += '<div class="tl-item">'
        body += '<div class="tl-num">%d</div>' % p["n"]
        body += "<h3>%s</h3>" % p["titulo"]
        body += '<div class="tl-meta"><span class="tag">%s ⏱</span><span class="tag-verde tag">%s</span></div>' % (
            p["tempo"], "Pode travar: " + p["trava"])
        body += "<p>%s</p>" % p["desc"]
        emoji = "🔑" if p["n"] == 7 else ""
        body += wa_btn(1, "passo", "%sFalar sobre a etapa %d" % (emoji, p["n"]), cls="btn btn-wa btn-sm")
        body += "</div>"
    body += "</div>"
    body += '<div class="bloco-e-agora mt-4"><h3>Pronto para começar pela etapa 1?</h3>'
    body += "<p>A pré-análise é gratuita e leva minutos. Você sai sabendo exatamente onde está.</p>"
    body += cta_duais("passo")
    body += "</div>"
    body += aviso_analise()
    body += "</div></section>"

    howto = schema_howto("Como comprar sua casa pelo Minha Casa Minha Vida: passo a passo",
                         [(p["titulo"], p["desc"]) for p in PASSOS_7])
    pagina(
        "passo-a-passo",
        "Minha Casa Minha Vida Passo a Passo: os 7 Passos até a Chave",
        "Veja o passo a passo completo do Minha Casa Minha Vida: 7 etapas com tempo médio, o que pode travar e o que fazer em cada uma.",
        body,
        jsonld=[
            schema_breadcrumb([("Início", "/"), ("Passo a passo", "/passo-a-passo/")]),
            howto,
        ],
    )
