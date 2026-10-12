#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_site.py — gera `site/index.html` a partir dos Markdown de `manual/`.

Sem dependências externas (conversor Markdown próprio, suficiente para o manual:
headings, listas, tabelas GFM, code fences, blockquotes, hr, negrito/itálico/
código inline, links, imagens e task lists).

Uso:
    python3 build_site.py
    python3 build_site.py --manual manual --saida site/index.html --titulo "Manual do Afiliado"
    python3 -m http.server 8080 --bind 0.0.0.0 --directory site
"""

from __future__ import annotations

import argparse
import html
import os
import re
import sys
from datetime import datetime

# ------------------------------------------------------------------ inline

_CODE_TOKEN = "\x00CODE{}\x00"
_FRAG_TOKEN = "\x00FRAG{}\x00"


def _slug(text: str) -> str:
    text = re.sub(r"[^\w\s\-à-úÀ-Ú]", "", text, flags=re.UNICODE).strip().lower()
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"[^a-z0-9\-]", "", text.encode("ascii", "ignore").decode() or text)


def _inline(text: str, base: str = "") -> str:
    """Converte markdown inline para HTML.

    Ordem: protege `code` -> escapa HTML -> converte imagem/link (e protege o
    resultado) -> autolink de URL solta -> ênfase -> restaura tudo.
    """
    codes: list[str] = []
    frags: list[str] = []

    def stash_code(m):
        codes.append(m.group(1))
        return _CODE_TOKEN.format(len(codes) - 1)

    def stash_frag(h):
        frags.append(h)
        return _FRAG_TOKEN.format(len(frags) - 1)

    text = re.sub(r"`([^`]+)`", stash_code, text)
    text = html.escape(text, quote=False)

    # imagens e links markdown (o HTML gerado vai para o stash, imune ao autolink)
    text = re.sub(r"!\[([^\]]*)\]\(([^)\s]+)\)",
                  lambda m: stash_frag(
                      '<img src="{}" alt="{}" loading="lazy">'.format(
                          _href(m.group(2), base), m.group(1))),
                  text)

    def _link(m):
        url, rotulo = m.group(2), m.group(1)
        h = '<a href="{}"{}>{}</a>'.format(_href(url, base), _ext(url), rotulo)
        return stash_frag(h)

    text = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", _link, text)

    # autolink de URL solta
    text = re.sub(r"https?://[^\s<>)\]]+",
                  lambda m: stash_frag(
                      '<a href="{0}" target="_blank" rel="noopener">{0}</a>'.format(m.group(0))),
                  text)

    # ênfase
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)
    text = re.sub(r"(?<![\w])_([^_\n]+)_(?![\w])", r"<em>\1</em>", text)

    for i, f in enumerate(frags):
        text = text.replace(_FRAG_TOKEN.format(i), f)
    for i, c in enumerate(codes):
        text = text.replace(_CODE_TOKEN.format(i), "<code>{}</code>".format(html.escape(c, quote=False)))
    return text


def _plain(text: str) -> str:
    """Remove markdown de rótulos de navegação (sem gerar HTML)."""
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"(?<!\w)\*([^*\n]+)\*(?!\w)", r"\1", text)
    text = re.sub(r"(?<!\w)_([^_\n]+)_(?!\w)", r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def _href(url: str, base: str) -> str:
    if url.startswith(("http://", "https://", "mailto:", "#", "/")):
        return url
    if url.endswith(".md"):
        alvo = url[:-3]
        return f"#doc-{_slug(os.path.basename(alvo))}"
    return (base + url) if base else url


def _ext(url: str) -> str:
    return ' target="_blank" rel="noopener"' if url.startswith("http") else ""


# ------------------------------------------------------------------ blocos

def _convert(md: str, base: str = "") -> tuple[str, list[tuple[int, str, str]]]:
    lines = md.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    toc: list[tuple[int, str, str]] = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]

        # code fence
        m = re.match(r"^```(\w*)\s*$", line)
        if m:
            lang = m.group(1)
            i += 1
            buf = []
            while i < n and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            cls = f' class="language-{lang}"' if lang else ""
            out.append(f"<pre><code{cls}>{html.escape(chr(10).join(buf), quote=False)}</code></pre>")
            continue

        # heading
        m = re.match(r"^(#{1,6})\s+(.*)$", line)
        if m:
            level = len(m.group(1))
            raw = m.group(2).strip()
            sid = _slug(raw) or f"sec-{i}"
            if 1 <= level <= 3:
                toc.append((level, sid, raw))
            out.append(f'<h{level} id="{sid}">{_inline(raw, base)}</h{level}>')
            i += 1
            continue

        # hr
        if re.match(r"^\s*(-{3,}|\*{3,}|_{3,})\s*$", line):
            out.append("<hr>")
            i += 1
            continue

        # tabela GFM
        if "|" in line and i + 1 < n and re.match(r"^\s*\|?[\s:\-|]+\|[\s:\-|]*$", lines[i + 1]):
            header = _row(line)
            align = _align(lines[i + 1])
            i += 2
            body = []
            while i < n and "|" in lines[i] and lines[i].strip():
                body.append(_row(lines[i]))
                i += 1
            thead = "".join(
                f'<th{align[j] if j < len(align) else ""}>{_inline(c, base)}</th>'
                for j, c in enumerate(header))
            rows = "".join(
                "<tr>" + "".join(
                    f'<td{align[j] if j < len(align) else ""}>{_inline(c, base)}</td>'
                    for j, c in enumerate(r)) + "</tr>"
                for r in body)
            out.append(
                f'<div class="tablewrap"><table><thead><tr>{thead}</tr></thead>'
                f"<tbody>{rows}</tbody></table></div>")
            continue

        # blockquote
        if line.startswith(">"):
            buf = []
            while i < n and (lines[i].startswith(">") or (lines[i].strip() and buf)):
                buf.append(re.sub(r"^>\s?", "", lines[i]))
                i += 1
                if i < n and not lines[i].strip():
                    break
            inner, _ = _convert("\n".join(buf), base)
            out.append(f"<blockquote>{inner}</blockquote>")
            continue

        # listas (com nesting por indentação)
        if re.match(r"^\s*([-*+]|\d+\.)\s+", line):
            i, block = _list(lines, i, 0, base)
            out.append(block)
            continue

        # parágrafo
        if line.strip():
            buf = [line]
            i += 1
            while i < n and lines[i].strip() and not re.match(
                    r"^(#{1,6}\s|```|>|\s*([-*+]|\d+\.)\s|\s*\|)", lines[i]):
                buf.append(lines[i])
                i += 1
            out.append(f"<p>{_inline(' '.join(buf), base)}</p>")
            continue

        i += 1

    return "\n".join(out), toc


def _row(line: str) -> list[str]:
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [c.strip() for c in re.split(r"(?<!\\)\|", line)]


def _align(line: str) -> list[str]:
    res = []
    for cell in _row(line):
        c = cell.strip()
        if c.startswith(":") and c.endswith(":"):
            res.append(' class="c"')
        elif c.endswith(":"):
            res.append(' class="r"')
        else:
            res.append("")
    return res


def _list(lines: list[str], i: int, indent: int, base: str) -> tuple[int, str]:
    """Lista com nesting por indentação; itens multilinha são acumulados crus e
    convertidos no final (para não perder ênfase/links nas linhas de continuação)."""
    n = len(lines)
    pattern = re.compile(r"^(\s*)([-*+]|\d+\.)\s+(.*)$")
    first = pattern.match(lines[i])
    tag = "ol" if first and first.group(2)[0].isdigit() else "ul"
    raw: list[str] = []       # texto cru de cada item
    subs: list[list[str]] = []  # blocos HTML (sub-listas) anexados a cada item

    while i < n:
        line = lines[i]
        if not line.strip():
            j = i + 1
            m2 = pattern.match(lines[j]) if j < n else None
            if m2 and len(m2.group(1)) >= indent:
                i = j
                continue
            break
        m = pattern.match(line)
        if not m:
            if raw and (len(line) - len(line.lstrip())) >= indent + 2:
                raw[-1] += " " + line.strip()
                i += 1
                continue
            break
        cur = len(m.group(1))
        if cur < indent:
            break
        if cur > indent:
            i, sub = _list(lines, i, cur, base)
            if raw:
                subs[-1].append(sub)
            else:
                raw.append("")
                subs.append([sub])
            continue
        content = m.group(3)
        tm = re.match(r"^\[([ xX])\]\s*(.*)$", content)
        if tm:
            mark = "\u2611" if tm.group(1).lower() == "x" else "\u2610"
            raw.append('<span class="task">{}</span> {}'.format(mark, tm.group(2)))
        else:
            raw.append(content)
        subs.append([])
        i += 1

    itens = []
    for texto, blocos in zip(raw, subs):
        corpo = _inline(texto, base) if "<span class=\"task\">" not in texto else (
            texto.split("</span> ", 1)[0] + "</span> " + _inline(texto.split("</span> ", 1)[1], base)
            if "</span> " in texto else texto)
        itens.append("<li>" + corpo + "".join(blocos) + "</li>")
    return i, "<{0}>{1}</{0}>".format(tag, "".join(itens))


# ------------------------------------------------------------------ página

CSS = """
:root{--bg:#0f1115;--panel:#151922;--panel2:#1b2130;--text:#e6e9ef;--muted:#9aa4b2;--brand:#5eead4;
--brand2:#f0abfc;--line:#262d3d;--code:#0b0e14;--ok:#4ade80;--warn:#fbbf24;--bad:#f87171}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 -apple-system,BlinkMacSystemFont,
"Segoe UI",Roboto,Inter,Helvetica,Arial,sans-serif}
a{color:var(--brand);text-decoration:none}a:hover{text-decoration:underline}
header.top{position:sticky;top:0;z-index:20;background:linear-gradient(180deg,#11151d,#0f1115ee);
border-bottom:1px solid var(--line);padding:14px 20px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
header.top h1{font-size:16px;margin:0;letter-spacing:.2px}
header.top .sub{color:var(--muted);font-size:12.5px}
header.top .spacer{flex:1}
#q{background:var(--panel2);border:1px solid var(--line);color:var(--text);padding:8px 12px;
border-radius:999px;min-width:240px;font-size:13.5px;outline:none}
#q:focus{border-color:var(--brand)}
.layout{display:grid;grid-template-columns:320px 1fr;gap:0;align-items:start}
nav#side{position:sticky;top:60px;height:calc(100vh - 60px);overflow:auto;padding:18px 14px 60px;
border-right:1px solid var(--line);background:var(--panel)}
nav#side .grp{margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted)}
nav#side a{display:block;padding:5px 9px;border-radius:8px;color:#cfd6e4;font-size:13.5px}
nav#side a:hover{background:var(--panel2);text-decoration:none}
nav#side a.lvl3{padding-left:22px;font-size:12.5px;color:var(--muted)}
nav#side a.active{background:linear-gradient(90deg,rgba(94,234,212,.16),transparent);color:#fff;
border-left:2px solid var(--brand)}
nav#side a.hidden{display:none}
main{padding:34px 46px 120px;max-width:1080px}
section.doc{border-bottom:1px dashed var(--line);padding-bottom:40px;margin-bottom:40px}
h1{font-size:30px;line-height:1.25;margin:6px 0 14px}
h2{font-size:22px;margin:34px 0 12px;padding-top:6px;border-top:1px solid var(--line)}
h3{font-size:17.5px;margin:26px 0 8px;color:#dbe3f0}
h4{font-size:15px;margin:20px 0 6px;color:var(--muted)}
p{margin:10px 0}
ul,ol{margin:10px 0 10px 4px;padding-left:22px}
li{margin:4px 0}
li>ul,li>ol{margin:4px 0}
.task{color:var(--brand);font-weight:700;margin-right:2px}
code{background:var(--code);border:1px solid var(--line);padding:1.5px 5px;border-radius:5px;
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;color:#a5f3fc}
pre{background:var(--code);border:1px solid var(--line);border-radius:12px;padding:14px 16px;
overflow:auto;margin:14px 0}
pre code{background:none;border:0;padding:0;color:#d7e0ee;font-size:12.8px;line-height:1.55}
blockquote{margin:14px 0;padding:10px 16px;border-left:3px solid var(--brand2);
background:linear-gradient(90deg,rgba(240,171,252,.10),transparent);border-radius:0 10px 10px 0;color:#e8dcf5}
blockquote p{margin:6px 0}
.tablewrap{overflow:auto;margin:14px 0;border:1px solid var(--line);border-radius:12px}
table{border-collapse:collapse;width:100%;font-size:13.6px;background:var(--panel)}
th,td{padding:8px 11px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{background:var(--panel2);position:sticky;top:0;font-size:12.4px;text-transform:uppercase;
letter-spacing:.05em;color:#c8d2e2}
tbody tr:hover{background:#1a2130}
td.c,th.c{text-align:center}td.r,th.r{text-align:right}
hr{border:0;border-top:1px solid var(--line);margin:28px 0}
.badge{display:inline-block;background:var(--panel2);border:1px solid var(--line);color:var(--muted);
border-radius:999px;padding:2px 10px;font-size:11.5px;margin-right:6px}
footer{color:var(--muted);font-size:12.5px;padding:20px 46px 60px;border-top:1px solid var(--line)}
#toTop{position:fixed;right:20px;bottom:20px;background:var(--panel2);border:1px solid var(--line);
color:var(--text);border-radius:999px;padding:9px 14px;cursor:pointer;font-size:13px}
mark{background:#fde68a;color:#111;border-radius:3px;padding:0 2px}
@media(max-width:1000px){.layout{grid-template-columns:1fr}nav#side{position:static;height:auto;
border-right:0;border-bottom:1px solid var(--line)}main{padding:22px 18px 80px}footer{padding:18px}}
@media print{header.top,nav#side,#toTop{display:none}body{background:#fff;color:#000}
.layout{grid-template-columns:1fr}main{max-width:none;padding:0}a{color:#000;text-decoration:underline}
pre,blockquote,table{border-color:#ccc}th{background:#eee;color:#000}}
"""

JS = """
const q=document.getElementById('q');
q.addEventListener('input',()=>{
  const t=q.value.trim().toLowerCase();
  document.querySelectorAll('nav#side a').forEach(a=>{
    a.classList.toggle('hidden', t.length>1 && !a.textContent.toLowerCase().includes(t));
  });
  document.querySelectorAll('main mark').forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));
  if(t.length>2){
    const w=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT);
    const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
    nodes.forEach(n=>{
      if(n.parentElement.closest('pre,code,script'))return;
      const idx=n.textContent.toLowerCase().indexOf(t);
      if(idx<0)return;
      const s=n.splitText(idx);s.splitText(t.length);
      const mk=document.createElement('mark');mk.textContent=s.textContent;s.replaceWith(mk);
    });
  }
});
q.addEventListener('keydown',e=>{if(e.key==='Escape'){q.value='';q.dispatchEvent(new Event('input'));q.blur();}});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();q.focus();}});
const links=[...document.querySelectorAll('nav#side a')];
const obs=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting)return;
    const id=e.target.id;
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));
  });
},{rootMargin:'-60px 0px -75% 0px'});
document.querySelectorAll('main h1[id],main h2[id],main h3[id]').forEach(h=>obs.observe(h));
document.getElementById('toTop').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
"""

PAGE = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{titulo}</title>
<meta name="description" content="{descricao}">
<meta name="generator" content="build_site.py (manual do afiliado)">
<style>{css}</style>
</head>
<body>
<header class="top">
  <div>
    <h1>{titulo}</h1>
    <div class="sub">{subtitulo}</div>
  </div>
  <div class="spacer"></div>
  <input id="q" type="search" placeholder="Buscar no manual… (Ctrl+K)" autocomplete="off">
</header>
<div class="layout">
  <nav id="side">{sidebar}</nav>
  <main>{conteudo}</main>
</div>
<footer>{rodape}</footer>
<button id="toTop">↑ topo</button>
<script>{js}</script>
</body>
</html>
"""


def build(manual_dir: str, out: str, titulo: str) -> int:
    if not os.path.isdir(manual_dir):
        sys.exit(f"[erro] pasta não encontrada: {manual_dir}")
    arquivos = sorted(
        f for f in os.listdir(manual_dir) if f.endswith(".md")
    )
    # README do manual primeiro; demais em ordem numérica
    arquivos.sort(key=lambda f: (0 if f.lower().startswith("readme") else 1, f))
    if not arquivos:
        sys.exit("[erro] nenhum .md encontrado")

    sidebar_parts, body_parts = [], []
    for arq in arquivos:
        caminho = os.path.join(manual_dir, arq)
        with open(caminho, encoding="utf-8") as fh:
            md = fh.read()
        doc_id = f"doc-{_slug(arq[:-3])}"
        corpo, toc = _convert(md)
        rotulo = toc[0][2] if toc and toc[0][0] == 1 else arq[:-3].replace("-", " ")
        sidebar_parts.append(
            f'<div class="grp"><a href="#{doc_id}">{html.escape(_plain(rotulo))}</a></div>')
        for lvl, sid, txt in toc:
            if lvl == 1:
                continue
            cls = "lvl3" if lvl == 3 else "lvl2"
            sidebar_parts.append(
                f'<a class="{cls}" href="#{sid}">{html.escape(_plain(txt))}</a>')
        body_parts.append(f'<section class="doc" id="{doc_id}">{corpo}</section>')

    pagina = PAGE.format(
        titulo=html.escape(titulo),
        descricao=html.escape("Roadmap e manual operacional de marketing de afiliados — trilhas "
                              "nacional (Brasil) e global, com pesquisa em GitHub e Hugging Face."),
        subtitulo=html.escape(f"{len(arquivos)} capítulos · pesquisa GitHub/Hugging Face · "
                              f"gerado em {datetime.now():%d/%m/%Y %H:%M}"),
        css=CSS,
        js=JS,
        sidebar="\n".join(sidebar_parts),
        conteudo="\n".join(body_parts),
        rodape=html.escape(
            "Manual do Afiliado · material educacional. Números de comissões, cookies, saques e "
            "tributação mudam — confirme sempre na fonte oficial (data de coleta: 12/10/2026). "
            "Gerado por build_site.py a partir de manual/*.md."),
    )
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(pagina)
    kb = os.path.getsize(out) / 1024
    print(f"[ok] {out} gerado ({kb:,.0f} KB) a partir de {len(arquivos)} arquivos de {manual_dir}/")
    for arq in arquivos:
        print(f"     · {arq}")
    return 0


def main():
    p = argparse.ArgumentParser(description="Gera o manual em HTML de página única.")
    p.add_argument("--manual", default="manual", help="pasta com os .md (default: manual)")
    p.add_argument("--saida", default="site/index.html", help="arquivo de saída")
    p.add_argument("--titulo", default="Manual do Afiliado · Nível Global e Nacional")
    a = p.parse_args()
    return build(a.manual, a.saida, a.titulo)


if __name__ == "__main__":
    sys.exit(main())
