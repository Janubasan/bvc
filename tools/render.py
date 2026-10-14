# -*- coding: utf-8 -*-
"""
MCMV Sem Dúvidas — renderizador de páginas
Gera o HTML final a partir dos módulos de conteúdo (content_*.py).
A fonte única de verdade dos dados dos corretores é assets/js/config.js.
"""
import json
import os
import re
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANO = "2026"

# ---------------------------------------------------------------
# Leitura do config.js (fonte única dos corretores / domínio)
# ---------------------------------------------------------------
def ler_config():
    caminho = os.path.join(ROOT, "assets", "js", "config.js")
    with open(caminho, encoding="utf-8") as f:
        src = f.read()

    def pega(chave, padrao=""):
        m = re.search(chave + r'\s*:\s*"([^"]*)"', src)
        return m.group(1) if m else padrao

    cfg = {
        "dominio": pega("dominio", "mcmvsemduvidas.com.br"),
        "email": pega("emailContato", "contato@mcmvsemduvidas.com.br"),
        "cidades": pega("cidadesAtuacao", "[CIDADES]"),
        "corretores": [],
    }
    bloco = re.search(r"corretores\s*:\s*\[(.*?)\n  \]", src, re.S)
    if bloco:
        for m in re.finditer(r"\{(.*?)\}", bloco.group(1), re.S):
            b = m.group(1)

            def campo(k, padrao=""):
                mm = re.search(k + r'\s*:\s*"([^"]*)"', b)
                if mm:
                    return mm.group(1)
                mm = re.search(k + r'\s*:\s*([0-9]+)', b)
                return mm.group(1) if mm else padrao

            cfg["corretores"].append({
                "id": campo("id", "1"),
                "nome": campo("nome", "[CORRETOR]"),
                "creci": campo("creci", "[CRECI]"),
                "whatsapp": campo("whatsapp", "5511900000000"),
                "horario": campo("horario", ""),
            })
    msgs = {}
    bloco_msgs = re.search(r"window\.SITE_MSGS\s*=\s*\{(.*?)\};", src, re.S)
    if bloco_msgs:
        for m in re.finditer(r'(\w+)\s*:\s*"([^"]*)"', bloco_msgs.group(1)):
            msgs[m.group(1)] = m.group(2)
    cfg["msgs"] = msgs
    return cfg


CFG = ler_config()
C1 = CFG["corretores"][0] if CFG["corretores"] else {"id": "1", "nome": "[CORRETOR 1]", "creci": "[CRECI]", "whatsapp": "5511900000000", "horario": ""}
C2 = CFG["corretores"][1] if len(CFG["corretores"]) > 1 else C1


# ---------------------------------------------------------------
# Ícones (SVG inline, estilo traço)
# ---------------------------------------------------------------
ICONS = {
    "whatsapp": '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>',
    "check": '<polyline points="20 6 9 17 4 12"/>',
    "money": '<rect x="1" y="4" width="22" height="16" rx="2"/><circle cx="12" cy="12" r="3"/><line x1="5" y1="8" x2="5" y2="8"/>',
    "file": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    "bank": '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    "home": '<path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>',
    "key": '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
    "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "search": '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    "user": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "mail": '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    "pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "star": '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    "arrow": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    "building": '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    "message": '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    "help": '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    "alert": '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    "book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    "heart": '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    "zap": '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    "chart": '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    "card": '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    "id": '<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8.5" cy="10" r="2"/><path d="M14 9h5M14 13h5M5.5 16a3 3 0 0 1 6 0"/>',
    "x": '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    "menu": '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    "camera": '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    "trash": '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    "eye": '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    "compass": '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    "users": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "trending": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
}

PREENCHIDOS = {"star"}  # ícones com fill em vez de traço


def icone(nome, cls=""):
    if nome in PREENCHIDOS:
        corpo = '<g fill="currentColor" stroke="none">' + ICONS[nome] + '</g>'
    elif nome == "whatsapp":
        corpo = ICONS[nome]
    else:
        corpo = '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[nome] + '</g>'
    return '<svg class="ic %s" viewBox="0 0 24 24" aria-hidden="true">%s</svg>' % (cls, corpo)


# ---------------------------------------------------------------
# Ilustrações
# ---------------------------------------------------------------
LOGO = """<svg class="brand-logo" viewBox="0 0 48 48" aria-hidden="true">
<rect width="48" height="48" rx="12" fill="#14498A"/>
<path d="M24 11 9 24.5h3.5V39h9v-8.5h5V39h9V24.5H39L24 11z" fill="#fff"/>
<circle cx="35" cy="13.5" r="7.5" fill="#1FA34A"/>
<path d="M31.6 13.6l2.3 2.5 4.5-5.2" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>"""

HERO_ART = """<svg viewBox="0 0 560 440" role="img" aria-label="Ilustração: casa própria com chave na mão">
  <rect x="14" y="14" width="532" height="412" rx="30" fill="#ffffff" stroke="#DCE4F0"/>
  <circle cx="452" cy="106" r="88" fill="#E3EDFA"/>
  <circle cx="86" cy="352" r="66" fill="#E9FBF0"/>
  <circle cx="66" cy="70" r="26" fill="#FFF4E0"/>
  <!-- casa -->
  <rect x="150" y="212" width="272" height="158" rx="10" fill="#1D5FB8"/>
  <polygon points="128,212 286,112 444,212" fill="#0B2B52"/>
  <rect x="262" y="292" width="48" height="78" rx="6" fill="#FFB020"/>
  <rect x="178" y="248" width="44" height="44" rx="6" fill="#E3EDFA"/>
  <rect x="350" y="248" width="44" height="44" rx="6" fill="#E9FBF0"/>
  <rect x="196" y="120" width="18" height="52" rx="4" fill="#0B2B52"/>
  <!-- selo de aprovado -->
  <circle cx="436" cy="336" r="54" fill="#1FA34A" stroke="#fff" stroke-width="7"/>
  <path d="M412 336l16 16 32-34" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- chave -->
  <g>
    <circle cx="88" cy="150" r="21" fill="none" stroke="#FFB020" stroke-width="10"/>
    <rect x="106" y="145" width="58" height="10" rx="5" fill="#FFB020"/>
    <rect x="148" y="155" width="8" height="12" rx="2" fill="#FFB020"/>
    <rect x="160" y="155" width="8" height="16" rx="2" fill="#FFB020"/>
  </g>
  <!-- documento -->
  <g>
    <rect x="404" y="66" width="72" height="92" rx="9" fill="#fff" stroke="#C3D8F2" stroke-width="2.5"/>
    <rect x="417" y="82" width="46" height="7" rx="3.5" fill="#14498A"/>
    <rect x="417" y="98" width="46" height="7" rx="3.5" fill="#C3D8F2"/>
    <rect x="417" y="114" width="46" height="7" rx="3.5" fill="#C3D8F2"/>
    <rect x="417" y="130" width="30" height="7" rx="3.5" fill="#1FA34A"/>
  </g>
  <!-- moedas -->
  <circle cx="96" cy="300" r="17" fill="#FFB020"/>
  <circle cx="124" cy="316" r="13" fill="#F5A623"/>
  <text x="88" y="306" font-size="16" font-weight="bold" fill="#0B2B52" font-family="Arial">R$</text>
</svg>"""

PREDIO_ART = """<svg viewBox="0 0 320 180" role="img" aria-label="Ilustração de empreendimento">
  <rect width="320" height="180" fill="#EAF1FB"/>
  <circle cx="272" cy="40" r="22" fill="#FFD98A"/>
  <rect x="34" y="52" width="66" height="112" rx="4" fill="#14498A"/>
  <rect x="112" y="26" width="76" height="138" rx="4" fill="#1D5FB8"/>
  <rect x="200" y="74" width="58" height="90" rx="4" fill="#4E86CF"/>
  <g fill="#DCEBFF">
    <rect x="44" y="64" width="14" height="12" rx="2"/><rect x="64" y="64" width="14" height="12" rx="2"/>
    <rect x="44" y="86" width="14" height="12" rx="2"/><rect x="64" y="86" width="14" height="12" rx="2"/>
    <rect x="44" y="108" width="14" height="12" rx="2"/><rect x="64" y="108" width="14" height="12" rx="2"/>
    <rect x="44" y="130" width="14" height="12" rx="2"/><rect x="64" y="130" width="14" height="12" rx="2"/>
    <rect x="122" y="38" width="16" height="13" rx="2"/><rect x="146" y="38" width="16" height="13" rx="2"/><rect x="170" y="38" width="0" height="13" rx="2"/>
    <rect x="122" y="60" width="16" height="13" rx="2"/><rect x="146" y="60" width="16" height="13" rx="2"/><rect x="170" y="60" width="0" height="13" rx="2"/>
    <rect x="122" y="82" width="16" height="13" rx="2"/><rect x="146" y="82" width="16" height="13" rx="2"/>
    <rect x="122" y="104" width="16" height="13" rx="2"/><rect x="146" y="104" width="16" height="13" rx="2"/>
    <rect x="122" y="126" width="16" height="13" rx="2"/><rect x="146" y="126" width="16" height="13" rx="2"/>
    <rect x="210" y="86" width="12" height="11" rx="2"/><rect x="230" y="86" width="12" height="11" rx="2"/>
    <rect x="210" y="106" width="12" height="11" rx="2"/><rect x="230" y="106" width="12" height="11" rx="2"/>
    <rect x="210" y="126" width="12" height="11" rx="2"/><rect x="230" y="126" width="12" height="11" rx="2"/>
  </g>
  <rect x="138" y="138" width="24" height="26" rx="3" fill="#FFB020"/>
  <rect x="0" y="164" width="320" height="16" fill="#C9D9EE"/>
</svg>"""

MAPA_ART = """<svg viewBox="0 0 600 300" role="img" aria-label="Mapa ilustrativo da região do empreendimento">
  <rect width="600" height="300" fill="#EDF3FA"/>
  <rect x="0" y="0" width="600" height="300" fill="url(#grade)" opacity=".5"/>
  <defs>
    <pattern id="grade" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0v40" fill="none" stroke="#DCE4F0" stroke-width="1"/>
    </pattern>
  </defs>
  <path d="M-10 220 C 120 190, 210 260, 340 220 S 560 240, 620 200" stroke="#BBD4F0" stroke-width="26" fill="none" stroke-linecap="round"/>
  <path d="M80 -10 C 110 90, 60 180, 130 310" stroke="#ffffff" stroke-width="20" fill="none"/>
  <path d="M240 -10 C 260 100, 300 160, 270 310" stroke="#ffffff" stroke-width="16" fill="none"/>
  <path d="M430 -10 C 400 110, 470 190, 440 310" stroke="#ffffff" stroke-width="22" fill="none"/>
  <path d="M-10 90 C 150 70, 380 120, 610 80" stroke="#ffffff" stroke-width="14" fill="none"/>
  <g fill="#DCE9F8">
    <rect x="150" y="120" width="60" height="50" rx="7"/>
    <rect x="300" y="150" width="80" height="60" rx="7"/>
    <rect x="470" y="120" width="60" height="44" rx="7"/>
    <rect x="160" y="200" width="70" height="40" rx="7"/>
    <rect x="500" y="190" width="60" height="52" rx="7"/>
  </g>
  <circle cx="330" cy="120" r="40" fill="#1FA34A" opacity=".14"/>
  <path d="M330 88 c-15 0-26 11-26 26 0 19 26 42 26 42s26-23 26-42c0-15-11-26-26-26z" fill="#E07B2A"/>
  <circle cx="330" cy="113" r="9" fill="#fff"/>
  <text x="330" y="176" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0B2B52">Localização do empreendimento</text>
  <text x="330" y="196" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#5D6E86">(mapa ilustrativo — substitua pelo mapa real)</text>
</svg>"""


# ---------------------------------------------------------------
# Componentes HTML
# ---------------------------------------------------------------
def wa_href(corretor, msg):
    return "https://wa.me/%s?text=%s" % (corretor["whatsapp"], quote(msg, safe=""))


def msg_de(chave):
    return CFG["msgs"].get(chave, CFG["msgs"].get("padrao", "Olá!"))


def wa_btn(corretor_id, msg_key, label, cls="btn btn-wa", icone_nome="whatsapp",
           msg_custom=None, ab=None, extra=""):
    c = C1 if str(corretor_id) == "1" else C2
    msg = msg_custom or msg_de(msg_key)
    attrs = []
    if ab:
        attrs.append('data-ab="%s"' % ab)
    return (
        '<a class="%s" data-wa data-corretor="%s" data-msg="%s" href="%s" target="_blank" rel="noopener" %s %s>'
        '%s%s</a>'
    ) % (cls, c["id"], msg_key, wa_href(c, msg), " ".join(attrs), extra, icone(icone_nome), label)


def nome_corretor(n):
    return '<span class="js-corretor-%s-nome">%s</span>' % (n, (C1 if n == 1 else C2)["nome"])


def cta_duais(msg_key, msg_custom=None, com_guia=True, tamanho="btn-lg"):
    """Dois botões de WhatsApp (Corretor 1 e 2) + link do guia."""
    html = '<div class="botoes-duais">'
    html += wa_btn(1, msg_key, "Falar com %s" % nome_corretor(1), cls="btn btn-wa %s" % tamanho,
                   msg_custom=msg_custom)
    html += wa_btn(2, msg_key, "Falar com %s" % nome_corretor(2), cls="btn btn-wa %s" % tamanho,
                   msg_custom=msg_custom)
    html += "</div>"
    if com_guia:
        html += '<p class="text-center muted small mt-2">Ou se preferir: <a href="/guia-minha-casa-minha-vida/"><strong>baixe o guia completo grátis</strong></a>.</p>'
    return html


def aviso_analise():
    return (
        '<div class="aviso-analise">%s <strong>Sujeito à análise de crédito e às condições vigentes do programa.</strong> '
        "As regras do Minha Casa Minha Vida (renda, teto do imóvel, subsídio e juros) podem ser alteradas por portaria "
        "do Governo Federal. Consulte as condições atualizadas no momento da contratação.</div>"
    ) % icone("alert")


def section_head(eyebrow, titulo, sub=""):
    html = '<div class="section-head"><span class="eyebrow">%s</span><h2>%s</h2>' % (eyebrow, titulo)
    if sub:
        html += '<p class="lead">%s</p>' % sub
    return html + "</div>"


def breadcrumbs(trilha):
    """trilha: [(nome, url|None), ...] — o último é o atual."""
    itens = ['<nav class="breadcrumbs" aria-label="Você está aqui">']
    for i, (nome, url) in enumerate(trilha):
        if url:
            itens.append('<a href="%s">%s</a> <span aria-hidden="true">›</span> ' % (url, nome))
        else:
            itens.append('<span aria-current="page">%s</span>' % nome)
    return "".join(itens) + "</nav>"


def page_hero(titulo, sub="", trilha=None, eyebrow=""):
    bc = breadcrumbs(trilha) if trilha else ""
    eb = '<span class="eyebrow">%s</span>' % eyebrow if eyebrow else ""
    lead = '<p class="lead">%s</p>' % sub if sub else ""
    return '<section class="page-hero"><div class="container">%s<div style="margin-top:1rem">%s<h1>%s</h1>%s</div></div></section>' % (bc, eb, titulo, lead)


def faq_details(itens, com_busca=False):
    """itens: [(pergunta, resposta_html), ...]"""
    html = '<div class="faq-list">'
    for i, (p, r) in enumerate(itens):
        busca = ' js-buscavel' if com_busca else ""
        html += '<details class="%s"%s><summary>%s</summary><div class="faq-body">%s</div></details>' % (
            "faq-item" + busca, ' open' if i == 0 and com_busca else "", p, r)
    return html + "</div>"


# ---------------------- formulários ----------------------
def _campo(label, nome, tipo="text", placeholder="", obrigatorio=True, full=False, dica=""):
    req = "required" if obrigatorio else ""
    cls = "field field-full" if full else "field"
    dica_html = '<small class="muted">%s</small>' % dica if dica else ""
    return (
        '<div class="%s"><label for="%s-%s">%s</label>'
        '<input id="%s-%s" name="%s" type="%s" placeholder="%s" %s>%s</div>'
    ) % (cls, nome, abs(hash(label)) % 99999, label, nome, abs(hash(label)) % 99999, nome, tipo, placeholder, req, dica_html)


def _campo_select(label, nome, opcoes, placeholder="Selecione", obrigatorio=True, full=False):
    cls = "field field-full" if full else "field"
    ops = '<option value="">%s</option>' % placeholder
    for o in opcoes:
        ops += '<option value="%s">%s</option>' % (o, o)
    return (
        '<div class="%s"><label for="%s-%s">%s</label><select id="%s-%s" name="%s" %s>%s</select></div>'
    ) % (cls, nome, abs(hash(label)) % 99999, label, nome, abs(hash(label)) % 99999, nome,
         "required" if obrigatorio else "", ops)


def _lgpd():
    return (
        '<label class="checkbox-field"><input type="checkbox" name="lgpd" value="sim" required>'
        '<span>Aceito receber contato sobre o Minha Casa Minha Vida e li a '
        '<a href="/politica-de-privacidade/" target="_blank">Política de Privacidade</a>. '
        "Seus dados ficam protegidos e não são compartilhados (LGPD).</span></label>"
    )


def _erro():
    return '<p class="form-erro" role="alert"></p>'


def form_guia(redirect="/obrigado/", titulo="📥 Receba o guia grátis", botao="📥 Baixar meu guia grátis"):
    return (
        '<form class="js-lead form-card" data-tipo="pdf" data-redirect="%s" novalidate>'
        '<h3>%s</h3>'
        '<p class="muted small">Preencha para receber o <strong>Guia Completo MCMV: do zero à chave</strong> '
        "no seu e-mail e WhatsApp — grátis.</p>"
        '<div class="form-grid">'
        "%s%s%s%s"
        '<div class="field field-full">%s</div>'
        "</div>"
        "%s"
        '<button type="submit" class="btn btn-primary btn-lg btn-block mt-2">%s</button>'
        '<p class="form-note">%s</p>'
        "%s</form>"
    ) % (
        redirect, titulo,
        _campo("Nome completo", "nome", placeholder="Seu nome completo"),
        _campo("WhatsApp", "whatsapp", tipo="tel", placeholder="(11) 91234-5678"),
        _campo("E-mail", "email", tipo="email", placeholder="seu@email.com"),
        _campo("Cidade", "cidade", placeholder="Sua cidade"),
        _campo_select("Você já tem FGTS?", "fgts", ["Sim", "Não", "Não sei"], placeholder="Selecione"),
        _lgpd(), botao,
        "Grátis · Sem spam · Cancele quando quiser",
        _erro(),
    )


def form_mini(categoria):
    return (
        '<div class="minidiag-form">'
        '<form class="js-lead" data-tipo="mini" novalidate>'
        '<input type="hidden" name="categoria" value="%s">'
        '<div class="form-grid">'
        "%s%s%s"
        '<div class="field">%s</div>'
        "</div>"
        "%s"
        '<button type="submit" class="btn btn-primary btn-block mt-2">Quero meu diagnóstico %s</button>'
        "%s</form>"
        '<div class="form-sucesso">Recebido! Agora toque no botão abaixo para continuar direto no WhatsApp:</div>'
        '<div class="minidiag-wa-resultado">%s</div>'
        "</div>"
    ) % (
        categoria,
        _campo("Seu nome", "nome", placeholder="Seu nome"),
        _campo("WhatsApp", "whatsapp", tipo="tel", placeholder="(11) 91234-5678"),
        _campo_select("Renda familiar aproximada", "renda",
                      ["Até 1 salário mínimo", "De 1 a 2 salários mínimos", "De 2 a 4 salários mínimos",
                       "De 4 a 8 salários mínimos", "Acima de 8 salários mínimos", "Prefiro informar na conversa"],
                      placeholder="Selecione"),
        _campo_select("Tem FGTS?", "fgts", ["Sim", "Não", "Não sei"], placeholder="Selecione"),
        _lgpd(), icone("arrow"), _erro(),
        wa_btn(1, "padrao", "Falar com %s" % nome_corretor(1), cls="btn btn-wa") +
        wa_btn(2, "padrao", "Falar com %s" % nome_corretor(2), cls="btn btn-wa"),
    )


def bloco_mini_diag(categoria):
    return (
        '<div class="minidiag">'
        '<h3>%s Quer saber como isso se aplica ao SEU caso?</h3>'
        "<p>A gente analisa sua situação e te diz, sem compromisso, qual é o caminho mais curto "
        "até a sua casa — ou a verdade sobre o que precisa ser resolvido antes.</p>"
        '<div class="minidiag-choices">'
        '<button type="button" class="btn btn-primary minidiag-sim">Sim, quero meu diagnóstico</button>'
        '<button type="button" class="btn btn-ghost minidiag-nao">Não, só estava pesquisando</button>'
        "</div>"
        "%s"
        '<div class="minidiag-alternativa">'
        "<p class=\"small\"><strong>Sem problemas!</strong> Leve nosso material para ler com calma:</p>"
        '<a class="btn btn-ambar" href="/guia-minha-casa-minha-vida/">📥 Baixar o Guia Completo (grátis)</a>'
        "</div>"
        "</div>"
    ) % (icone("target"), form_mini(categoria))


def _campo_textarea(label, nome, placeholder="", obrigatorio=True):
    req = "required" if obrigatorio else ""
    return (
        '<div class="field field-full"><label for="%s-id">%s</label>'
        '<textarea id="%s-id" name="%s" placeholder="%s" %s></textarea></div>'
    ) % (nome, label, nome, nome, placeholder, req)


def form_contato():
    return (
        '<form class="js-lead form-card" data-tipo="contato" novalidate>'
        '<h3>Envie sua mensagem</h3>'
        '<div class="form-grid">'
        "%s%s%s"
        '<div class="field">%s</div>'
        "%s"
        "</div>"
        "%s"
        '<button type="submit" class="btn btn-primary btn-lg btn-block mt-2">Enviar mensagem</button>'
        '<p class="form-note">Resposta média em horário comercial: poucos minutos.</p>'
        '<div class="form-sucesso">Mensagem recebida! Vamos te responder em breve. Se preferir, '
        "fale agora mesmo pelo WhatsApp abaixo. %s</div>"
        "%s</form>"
    ) % (
        _campo("Nome completo", "nome", placeholder="Seu nome completo"),
        _campo("WhatsApp", "whatsapp", tipo="tel", placeholder="(11) 91234-5678"),
        _campo("E-mail (opcional)", "email", tipo="email", placeholder="seu@email.com", obrigatorio=False),
        _campo_select("Assunto", "assunto",
                      ["Quero saber se posso participar", "Dúvida sobre documentos",
                       "Dúvida sobre FGTS / entrada / parcelas", "Quero conhecer empreendimentos",
                       "Já comecei meu processo", "Outro assunto"]),
        _campo_textarea("Mensagem", "mensagem",
                        placeholder="Conte um pouco da sua situação: renda, se tem FGTS, se está com o nome negativado...",
                        obrigatorio=False),
        _lgpd(),
        wa_btn(1, "contato", "Ir para o WhatsApp agora", cls="btn btn-wa btn-sm"),
        _erro(),
    )


def cta_final(msg_key="padrao", custom=None):
    return (
        '<section class="section"><div class="container"><div class="cta-final">'
        "<h2>Você está a uma conversa de sair do aluguel.</h2>"
        "<p>Sem compromisso. Sem pressão. Só clareza.</p>"
        '<div class="mt-2">%s%s</div>'
        '<p class="alt mt-2">Ou se preferir: <a class="alt" href="/guia-minha-casa-minha-vida/">baixe o guia grátis</a>.</p>'
        "</div></div></section>"
    ) % (
        wa_btn(1, msg_key, "Falar com %s" % nome_corretor(1), cls="btn btn-wa btn-lg", msg_custom=custom),
        wa_btn(2, msg_key, "Falar com %s" % nome_corretor(2), cls="btn btn-wa btn-lg", msg_custom=custom),
    )


def banner_guia():
    return (
        '<section class="section"><div class="container">'
        '<div class="bloco-e-agora" style="margin:0">'
        "<h3>📥 Guia Completo Minha Casa Minha Vida — grátis</h3>"
        "<p>Checklist de documentos, 27 dúvidas respondidas e o passo a passo completo até a chave.</p>"
        '<a class="btn btn-primary btn-lg" href="/guia-minha-casa-minha-vida/">Quero meu guia grátis</a>'
        "</div></div></section>"
    )


# ---------------------- schemas ----------------------
def _schema(obj):
    return '<script type="application/ld+json">%s</script>' % json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


def schema_website():
    return _schema({
        "@context": "https://schema.org", "@type": "WebSite",
        "name": "MCMV Sem Dúvidas",
        "url": "https://%s/" % CFG["dominio"],
    })


def schema_breadcrumb(trilha):
    itens = []
    for i, (nome, url) in enumerate(trilha):
        if url is None:
            continue
        itens.append({
            "@type": "ListItem", "position": len(itens) + 1, "name": nome,
            "item": "https://%s%s" % (CFG["dominio"], url),
        })
    if not itens:
        return ""
    return _schema({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": itens})


def schema_faq(itens):
    return _schema({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": p,
             "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", " ", r)}}
            for p, r in itens
        ],
    })


def schema_howto(nome, passos):
    return _schema({
        "@context": "https://schema.org", "@type": "HowTo", "name": nome,
        "step": [{"@type": "HowToStep", "position": i + 1, "name": p[0], "text": p[1]} for i, p in enumerate(passos)],
    })


def schema_localbusiness():
    return _schema({
        "@context": "https://schema.org", "@type": "RealEstateAgent",
        "name": "MCMV Sem Dúvidas",
        "url": "https://%s/" % CFG["dominio"],
        "email": CFG["email"],
        "areaServed": CFG["cidades"],
        "employee": [
            {"@type": "Person", "name": c["nome"], "jobTitle": "Corretor de imóveis — CRECI %s" % c["creci"]}
            for c in (C1, C2)
        ],
        "disambiguatingDescription": "Site informativo independente, sem vínculo com o Governo Federal, "
                                     "a Caixa Econômica Federal ou o programa Minha Casa Minha Vida.",
    })


def schema_produto(emp):
    return _schema({
        "@context": "https://schema.org", "@type": "Product",
        "name": emp["nome"],
        "description": "Empreendimento %s em %s, %s. %s. Sujeito às condições do programa Minha Casa Minha Vida." % (
            emp["nome"], emp["bairro"], emp["cidade"], emp["resumo"]),
        "brand": {"@type": "Brand", "name": "[CONSTRUTORA]"},
        "offers": {
            "@type": "Offer",
            "price": emp["preco_num"],
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock",
            "url": "https://%s/empreendimentos/%s/" % (CFG["dominio"], emp["slug"]),
        },
    })


# ---------------------------------------------------------------
# Estrutura (header / footer / layout)
# ---------------------------------------------------------------
NAV = [
    ("Dúvidas", "/duvidas/"),
    ("Guia grátis", "/guia-minha-casa-minha-vida/"),
    ("Quiz", "/quiz/"),
    ("Empreendimentos", "/empreendimentos/"),
    ("Passo a passo", "/passo-a-passo/"),
    ("Blog", "/blog/"),
    ("Sobre", "/sobre/"),
]

FOOTER_DUVIDAS = [
    ("Quem pode participar", "/duvidas/quem-pode-participar/"),
    ("Renda familiar", "/duvidas/renda-familiar/"),
    ("Documentos", "/duvidas/documentos/"),
    ("FGTS", "/duvidas/fgts/"),
    ("Entrada", "/duvidas/entrada/"),
    ("Nome sujo", "/duvidas/nome-sujo/"),
    ("Score de crédito", "/duvidas/score/"),
    ("Aprovação", "/duvidas/aprovacao/"),
]


def _nav_html(url):
    links = []
    atual = url.rstrip("/")
    for nome, href in NAV:
        href_limpo = href.rstrip("/")
        ativo = ' aria-current="page"' if (atual != "" and href_limpo.startswith(atual)) else ""
        links.append('<a href="%s"%s>%s</a>' % (href, ativo, nome))
    return "".join(links)


def header(url):
    return (
        '<div class="topbar">⚡ <strong>Condições vigentes</strong> — válidas enquanto durar a tabela atual. '
        'Sujeito à análise de crédito.</div>'
        '<header class="header">'
        '<div class="container header-inner">'
        '<a class="brand" href="/">%s<span class="brand-nome">MCMV Sem Dúvidas<small>Do aluguel à chave</small></span></a>'
        '<nav class="nav-links" aria-label="Menu principal">%s</nav>'
        '%s'
        '<button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">%s</button>'
        "</div></header>"
    ) % (
        LOGO, _nav_html(url),
        wa_btn(1, "padrao", "Falar no WhatsApp", cls="btn btn-wa nav-cta"),
        icone("menu"),
    )


def footer():
    col_duvidas = "".join('<li><a href="%s">%s</a></li>' % (h, n) for n, h in FOOTER_DUVIDAS)
    col_nav = "".join(
        '<li><a href="%s">%s</a></li>' % (h, n)
        for n, h in NAV + [("Contato", "/contato/"), ("Política de Privacidade", "/politica-de-privacidade/"), ("Termos de Uso", "/termos/")]
    )
    corretores_html = ""
    for i, c in enumerate((C1, C2), start=1):
        corretores_html += (
            '<li>%s — <strong>CRECI %s</strong><br>'
            '%s <small>(%s)</small></li>'
        ) % (c["nome"], c["creci"], wa_btn(i, "padrao", "WhatsApp", cls="btn btn-wa btn-sm", icone_nome="whatsapp"), c["horario"])
    return (
        '<footer class="footer"><div class="container">'
        '<div class="footer-grid">'
        "<div>"
        '<a class="brand" href="/">%s<span class="brand-nome" style="color:#fff">MCMV Sem Dúvidas<small>Do aluguel à chave</small></span></a>'
        "<p class=\"small mt-2\">Site informativo independente. Não temos vínculo com o Governo Federal, "
        "a Caixa Econômica Federal ou com o programa Minha Casa Minha Vida.</p>"
        '<span class="footer-selo">%s Atendimento humano · CRECI em dia</span>'
        "</div>"
        "<div><h4>Navegação</h4><ul>%s</ul></div>"
        "<div><h4>Dúvidas</h4><ul>%s</ul></div>"
        "<div><h4>Atendimento</h4><ul>%s</ul></div>"
        "</div>"
        '<div class="footer-disclaimer">'
        "⚠️ Sujeito à análise de crédito e às condições vigentes do programa. As regras do Minha Casa Minha Vida "
        "podem ser alteradas por portaria do Governo Federal. Consulte as condições atualizadas no momento da contratação.<br>"
        '“Minha Casa Minha Vida” é citado de forma descritiva e informativa. Este site não é o site oficial do programa. '
        "Atuamos com empreendimentos de construtoras parceiras na região. Imagens e valores desta versão são ilustrativos."
        "</div>"
        '<div class="footer-bottom">'
        "<span>© %s MCMV Sem Dúvidas — Todos os direitos reservados.</span>"
        '<span><a href="/politica-de-privacidade/">Política de Privacidade</a> · <a href="/termos/">Termos de Uso</a> · LGPD</span>'
        "</div>"
        "</div></footer>"
    ) % (LOGO, icone("shield"), col_nav, col_duvidas, corretores_html, ANO)


def widget_whatsapp():
    itens = ""
    for i, c in enumerate((C1, C2), start=1):
        itens += (
            '<a class="wfp-item" data-wa data-corretor="%s" data-msg="padrao" href="%s" target="_blank" rel="noopener">'
            '<span class="wfp-avatar">%s</span>'
            "<span>%s<small>CRECI %s · %s</small></span></a>"
        ) % (c["id"], wa_href(c, msg_de("padrao")), icone("user"),
             nome_corretor(i), c["creci"], c["horario"])
    return (
        '<div class="wa-float">'
        '<div class="wa-float-panel">'
        '<div class="wfp-head">Fale com um corretor<small>Atendimento humano, sem robô</small></div>'
        "%s</div>"
        '<button class="wa-float-btn" aria-label="Abrir opções de WhatsApp">%s</button>'
        "</div>"
    ) % (itens, icone("whatsapp"))


def modal_exit():
    return (
        '<div class="modal" id="modal-exit" role="dialog" aria-modal="true" aria-labelledby="modal-exit-titulo">'
        '<div class="modal-card">'
        '<button class="modal-fechar" aria-label="Fechar">×</button>'
        '<div class="modal-emoji">🏠</div>'
        '<h2 id="modal-exit-titulo">Espera! Leve o Guia Completo MCMV antes de sair</h2>'
        '<p class="muted">Checklist de documentos, 27 dúvidas respondidas e o passo a passo até a chave — '
        "<strong>é grátis</strong>.</p>"
        '<a class="btn btn-primary btn-lg btn-block" href="/guia-minha-casa-minha-vida/">📥 Quero meu guia grátis</a>'
        '<p class="form-note">Sem spam. Seus dados protegidos (LGPD).</p>'
        "</div></div>"
    )


def layout(url, title, description, body, jsonld=None, noindex=False):
    canonical = "https://%s/" % CFG["dominio"] if url == "" else "https://%s/%s/" % (CFG["dominio"], url)
    ld = "".join(jsonld) if jsonld else ""
    robots = '<meta name="robots" content="noindex,nofollow">' if noindex else ""
    template = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
{robots}
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MCMV Sem Dúvidas">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="https://{dominio}/assets/img/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
{ld}
</head>
<body>
{header}
<main id="conteudo">
{body}
</main>
{footer}
{widget}
{modal}
<script src="/assets/js/config.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>"""
    return template.format(
        title=title, desc=description, robots=robots, canonical=canonical,
        dominio=CFG["dominio"], ld=ld, header=header(url), body=body,
        footer=footer(), widget=widget_whatsapp(), modal=modal_exit(),
    )


# ---------------------------------------------------------------
# Registro de páginas
# ---------------------------------------------------------------
PAGES = []


def pagina(url, title, desc, body, jsonld=None, noindex=False):
    PAGES.append({
        "url": url,
        "title": title,
        "desc": desc,
        "noindex": noindex,
        "html": layout(url, title, desc, body, jsonld, noindex),
    })


def gerar(destino=None):
    destino = destino or ROOT
    escritos = []
    for p in PAGES:
        if p["url"] == "":
            caminho = os.path.join(destino, "index.html")
        elif p["url"] == "404":
            caminho = os.path.join(destino, "404.html")
        else:
            caminho = os.path.join(destino, p["url"], "index.html")
        os.makedirs(os.path.dirname(caminho) if p["url"] != "404" else destino, exist_ok=True)
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(p["html"])
        escritos.append(caminho)
    return escritos
