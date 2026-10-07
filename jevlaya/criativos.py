"""
L4-A: MATRIZ DE CRIATIVOS — 5 GANCHOS x 6 ÂNGULOS = 30 variações por produto,
formatadas por canal (TikTok/Kwai, Reels, Pinterest, Grupo de Ofertas),
com checagem automática de promessas proibidas (compliance).

No HARNESS em produção esta matriz vira o payload do endpoint FastAPI
`/generate-content` (Claude/OpenAI preenchem os templates com o tom de
voz do afiliado). Aqui ela já funciona offline e serve de gabarito de
teste A/B: cada variação recebe um ID estável (ex.: AIRFRYER-G3-A2).
"""

from __future__ import annotations
from itertools import product as cartesian

GANCHOS = {
    "G1": {"tipo": "escassez", "formula": "Só hoje / últimas unidades / cupom acaba às 23h59"},
    "G2": {"tipo": "curiosidade", "formula": "Ninguém te contou isso sobre {produto}…"},
    "G3": {"tipo": "prova_social", "formula": "{avaliacoes} pessoas já compraram e a nota é {rating}"},
    "G4": {"tipo": "dor_solucao", "formula": "Cansado de {dor}? Isso resolve em 1 clique"},
    "G5": {"tipo": "oferta_direta", "formula": "{produto} de R$ {de} por R$ {por} ({off}% OFF)"},
}

ANGULOS = {
    "A1": {"tipo": "economia", "gancho_emocional": "pagar menos pelo mesmo produto"},
    "A2": {"tipo": "praticidade", "gancho_emocional": "resolver rápido, sem esforço"},
    "A3": {"tipo": "presente", "gancho_emocional": "acertar no presente de quem ama"},
    "A4": {"tipo": "status", "gancho_emocional": "ter algo que impressiona"},
    "A5": {"tipo": "bem_estar", "gancho_emocional": "viver melhor, com mais saúde/conforto"},
    "A6": {"tipo": "fomo", "gancho_emocional": "não ficar de fora do que todo mundo quer"},
}

CANAIS = {
    "tiktok": {"formato": "vídeo 9:16, 15-30s", "cta": "link na bio 👆", "limite_chars": 150},
    "kwai": {"formato": "vídeo 9:16, 15-30s", "cta": "clica no link 👆", "limite_chars": 150},
    "reels": {"formato": "vídeo 9:16, 30s + carrossel", "cta": "comenta EU QUERO", "limite_chars": 220},
    "pinterest": {"formato": "pin vertical 1000x1500", "cta": "salva esse pin 📌", "limite_chars": 300},
    "telegram": {"formato": "post com foto + botão", "cta": "🛒 Ver oferta", "limite_chars": 400},
    "whatsapp": {"formato": "mensagem curta + imagem", "cta": "garante aqui 👇", "limite_chars": 300},
}

# Promessas que DERRUBAM anúncio e conta (Meta/TikTok/CONAR)
PROMESSAS_PROIBIDAS = [
    "ganhe dinheiro", "renda garantida", "fique rico", "cura", "cura definitiva",
    "emagreça 10kg", "resultado garantido", "dinheiro fácil", "trabalhe de casa e ganhe",
    "antes e depois", "milagre", "100% garantido", "sem esforço",
]


def checar_compliance(texto: str) -> list[str]:
    """Retorna lista de violações encontradas no texto."""
    t = texto.lower()
    return [p for p in PROMESSAS_PROIBIDAS if p in t]


def montar_variacao(id_curto: str, produto: dict, gid: str, aid: str, canal: str) -> dict:
    g = GANCHOS[gid]
    a = ANGULOS[aid]
    nome = produto["nome"]
    ticket = produto.get("ticket", 0)
    de = produto.get("preco_de", round(ticket * 1.25, 2))
    off = round((1 - ticket / de) * 100) if de else 0

    base = {
        "escassez": f"🚨 SAIU CUPOM: {nome} com {off}% OFF só até 23h59 — depois volta ao preço normal.",
        "curiosidade": f"Ninguém fala isso, mas {nome.lower()} tem um truque que muda tudo… 🤫",
        "prova_social": f"+{produto.get('num_avaliacoes', 0):,} vendidos ⭐ {produto.get('rating_medio', 4.5)} — {nome} é o queridinho do momento.",
        "dor_solucao": f"Cansado de pagar caro em produto igual? {nome} entrega mais por menos. 👇",
        "oferta_direta": f"{nome}: de R$ {de:,.2f} por R$ {ticket:,.2f} ({off}% OFF). Últimas unidades.",
    }[g["tipo"]]

    angulo_txt = {
        "economia": "💸 O ângulo é UM: pagar menos pelo mesmo produto que todo mundo compra.",
        "praticidade": "⚡ Instala, usa, resolve. Sem manual, sem dor de cabeça.",
        "presente": "🎁 Presente certeiro — quem recebe agradece e quem compra economiza.",
        "status": "✨ Aquele item que todo mundo pergunta 'onde você comprou?'.",
        "bem_estar": "🌿 Mais conforto no dia a dia — você sente a diferença na primeira semana.",
        "fomo": "⏳ Todo mundo já garantiu o dele. Você vai ficar de fora de novo?",
    }[a["tipo"]]

    cta = CANAIS[canal]["cta"]
    texto = f"{base}\n{angulo_txt}\n{cta}\n#publi #afiliado"
    return {
        "id": f"{id_curto.upper()}-{gid}-{aid}",
        "gancho": g["tipo"],
        "angulo": a["tipo"],
        "canal": canal,
        "formato": CANAIS[canal]["formato"],
        "texto": texto[: CANAIS[canal]["limite_chars"]],
        "violacoes": checar_compliance(texto),
        "aprovado": not checar_compliance(texto),
    }


def matriz_criativos(produto: dict, canal: str = "tiktok", id_curto: str | None = None) -> list[dict]:
    """Gera as 30 variações (5 ganchos x 6 ângulos) para um produto/canal."""
    if canal not in CANAIS:
        raise ValueError(f"canal desconhecido: {canal}. Use {list(CANAIS)}")
    idc = id_curto or produto["id"].split("-")[0]
    return [
        montar_variacao(idc, produto, gid, aid, canal)
        for gid, aid in cartesian(GANCHOS, ANGULOS)
    ]


def prompt_ia_para_criativos(produto: dict, tom_de_voz: str = "descontraído e direto") -> str:
    """
    Prompt pronto para o endpoint /generate-content (Claude/OpenAI).
    Mantém as mesmas 30 células da matriz — a IA preenche, o HARNESS valida.
    """
    return f"""Aja como copywriter sênior de tráfego pago para afiliados no Brasil.

PRODUTO: {produto['nome']} | Ticket: R$ {produto.get('ticket', 0):,.2f} | Loja: {produto.get('loja', 'marketplace')}
AVALIAÇÕES: {produto.get('num_avaliacoes', 0):,} (nota {produto.get('rating_medio', '-')})
TOM DE VOZ DO AFILIADO: {tom_de_voz}

TAREFA: para cada combinação de GANCHO x ÂNGULO abaixo, escreva 1 criativo
(máx. 2 linhas + CTA) para TikTok/Kwai (vídeo 9:16, 15-30s).

GANCHOS: escassez | curiosidade | prova social | dor-solução | oferta direta
ÂNGULOS: economia | praticidade | presente | status | bem-estar | FOMO

REGRAS OBRIGATÓRIAS:
1. Inclua SEMPRE "#publi #afiliado" (transparência CONAR).
2. PROIBIDO: promessas de renda, cura, emagrecimento numérico, "garantido",
   "milagre", antes/depois. Qualquer violação = reprovação automática.
3. Número 1 de prova social: use SOMENTE os dados fornecidos acima.
4. Saída: JSON array com {{"id": "GANCHO-ANGULO", "texto": "..."}} (30 itens)."""
