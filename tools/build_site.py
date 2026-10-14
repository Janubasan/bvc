# -*- coding: utf-8 -*-
"""
MCMV Sem Dúvidas — construtor do site
Uso:  python3 tools/build_site.py

Gera todas as páginas HTML, sitemap.xml, robots.txt e favicon.svg.
Os dados dos corretores vêm de site/assets/js/config.js.
"""
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import render as R
import content_core as core
import content_extra as extra

FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#14498A"/>
<path d="M32 14 12 32.5h5V53h12v-11h6v11h12V32.5h5L32 14z" fill="#ffffff"/>
<circle cx="47" cy="17.5" r="10.5" fill="#1FA34A"/>
<path d="M42.4 17.6l3.1 3.4 6-7" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""


def main():
    # Páginas principais
    core.home()
    core.guia()
    core.hub_duvidas()
    core.paginas_duvidas()
    core.documentos()
    core.passo_a_passo()

    # Quiz, empreendimentos e demais páginas
    extra.quiz()
    extra.hub_empreendimentos()
    extra.paginas_empreendimentos()
    extra.sobre()
    extra.contato()
    extra.obrigado()
    extra.blog_hub()
    extra.artigos_blog()
    extra.politica_privacidade()
    extra.termos()
    extra.pagina_404()

    escritos = R.gerar()

    # sitemap.xml (sem 404 e sem páginas noindex)
    hoje = date.today().isoformat()
    urls = []
    for p in R.PAGES:
        if p["url"] == "404" or p["noindex"]:
            continue
        u = "https://%s/" % R.CFG["dominio"] if p["url"] == "" else "https://%s/%s/" % (R.CFG["dominio"], p["url"])
        urls.append('  <url><loc>%s</loc><lastmod>%s</lastmod></url>' % (u, hoje))
    sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
               + "\n".join(urls) + "\n</urlset>\n")
    with open(os.path.join(R.ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap)

    robots = ("User-agent: *\nAllow: /\n\n"
              "Sitemap: https://%s/sitemap.xml\n" % R.CFG["dominio"])
    with open(os.path.join(R.ROOT, "robots.txt"), "w", encoding="utf-8") as f:
        f.write(robots)

    with open(os.path.join(R.ROOT, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(FAVICON)

    print("✅ %d páginas geradas (+ sitemap.xml, robots.txt, favicon.svg)" % len(escritos))
    for c in escritos:
        print("   •", os.path.relpath(c, R.ROOT))


if __name__ == "__main__":
    main()
