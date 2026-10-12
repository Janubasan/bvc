#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
afiliado.py — CLI do Manual do Afiliado (nível global e nacional)

Sem dependências externas (apenas biblioteca padrão do Python 3.8+).

Comandos
--------
  epc         EPC, CR, RPV e receita por visita a partir de cliques/receita
  projecao    Projeção de receita mensal (conservador / base / otimista)
  break-even  CPC máximo, CPA máximo e ROAS necessário de uma oferta
  ofertas     Rank de ofertas por EPC esperado + Affiliate Score (0-100)
  scorecard   Nota 0-100 de um nicho (critérios e pesos do capítulo 05)
  utm         Gera link com UTM padronizado + sub-id
  links       Gera a pasta /go/ (redirects.csv, index.php, .htaccess, robots)
  kpi         Resumo semanal a partir de templates/kpi-semanal.csv

Exemplos
--------
  python3 ferramentas/afiliado.py epc --clicks 4200 --receita 318.90
  python3 ferramentas/afiliado.py projecao --visitas 20000 --ctr .035 --cr .012 --aov 997 --comissao .5
  python3 ferramentas/afiliado.py break-even --comissao-media 598 --cr 0.012
  python3 ferramentas/afiliado.py ofertas --csv templates/planilha-ofertas.csv --top 10
  python3 ferramentas/afiliado.py scorecard --conhecimento 4 --interesse 5 --epc 4 \
      --recorrencia 2 --competicao 3 --teste 3 --risco 5
  python3 ferramentas/afiliado.py utm --destino https://site.com.br/review/x --source youtube \
      --medium organic --campaign review-x --content video-pinned
  python3 ferramentas/afiliado.py links --csv templates/mapa-de-links.csv --saida site-go/
  python3 ferramentas/afiliado.py kpi --csv templates/kpi-semanal.csv
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
from datetime import datetime
from urllib.parse import urlencode, urlparse, parse_qs, urlunparse

# ---------------------------------------------------------------- utilitários

BRL_PER_USD_DEFAULT = 5.50  # ajuste com --cambio quando necessário


def _f(v, default=0.0):
    """Converte valor de planilha (aceita '12,5', '12.5%', 'R$ 1.200', vazio) em float."""
    if v is None:
        return default
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip()
    if not s:
        return default
    s = s.replace("R$", "").replace("US$", "").replace("$", "").replace("€", "")
    s = s.replace("%", "").strip()
    negative = s.startswith("(") and s.endswith(")")
    s = s.strip("()")
    if "," in s and "." in s:  # 1.234,56
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:             # 1234,56
        s = s.replace(",", ".")
    else:
        s = s.replace(".", "")  if s.count(".") > 1 else s
    try:
        val = float(s)
    except ValueError:
        return default
    return -val if negative else val


def _pct(v):
    """Aceita 0.5, 50, '50%' e devolve fração (0.5)."""
    if v is None:
        return 0.0
    s = str(v).strip()
    had_pct = "%" in s
    n = _f(s)
    if had_pct:
        return n / 100.0
    return n if n <= 1 else n / 100.0


def _pct100(v):
    """Interpreta o valor SEMPRE como porcentagem (1.2 -> 0.012). Convenção das
    colunas `comissao_pct` e `cr_esperada` da planilha de ofertas."""
    n = _f(str(v).replace("%", ""))
    return n / 100.0


def _money(v, moeda="R$"):
    return f"{moeda} {v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def _num(v, casas=0):
    """Formata número no padrão PT-BR (1.234 / 1.234,5)."""
    if casas:
        return f"{v:,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{v:,.0f}".replace(",", ".")


def _read_csv(path):
    if not os.path.exists(path):
        sys.exit(f"[erro] arquivo não encontrado: {path}")
    with open(path, newline="", encoding="utf-8-sig") as fh:
        rows = [r for r in csv.DictReader(fh)]
    if not rows:
        sys.exit(f"[erro] CSV vazio: {path}")
    return rows


def _norm_key(k):
    return (k or "").strip().lower().replace(" ", "_").replace("-", "_")


def _rows_normalized(rows):
    return [{_norm_key(k): (v.strip() if isinstance(v, str) else v) for k, v in r.items()} for r in rows]


# ---------------------------------------------------------------- 1) EPC

def cmd_epc(a):
    clicks = _f(a.clicks)
    receita = _f(a.receita)
    visitas = _f(a.visitas)
    vendas = _f(a.vendas)
    if clicks <= 0:
        sys.exit("[erro] --clicks precisa ser > 0")
    epc = receita / clicks
    out = {
        "Cliques": f"{_num(clicks)}",
        "Receita": _money(receita, a.moeda),
        "EPC (receita/clique)": _money(epc, a.moeda),
    }
    if visitas > 0:
        out["CTR de link (cliques/visitas)"] = f"{clicks / visitas:.2%}"
        out["RPV (receita/visita)"] = _money(receita / visitas, a.moeda)
    if vendas > 0:
        out["CR (vendas/cliques)"] = f"{vendas / clicks:.2%}"
        out["Receita média por venda"] = _money(receita / vendas, a.moeda)
    print("\n== EPC ==")
    for k, v in out.items():
        print(f"  {k:<32} {v}")
    print("\n  Leitura: EPC é o teto do seu CPC. Se o CPC previsto do anúncio for maior que")
    print(f"  {_money(epc, a.moeda)}, o tráfego pago dá prejuízo (cap. 04 §2.3).\n")
    return 0


# ---------------------------------------------------------------- 2) Projeção

def cmd_projecao(a):
    visitas = _f(a.visitas)
    ctr = _pct(a.ctr)
    cr = _pct(a.cr)
    aov = _f(a.aov)
    com = _pct(a.comissao)
    fixa = _f(a.comissao_fixa)
    recorrencia = _f(a.recorrencia_meses) or 1.0
    custo = _f(a.custo)
    moeda = a.moeda

    def calc(mult):
        cliques = visitas * ctr * mult
        vendas = cliques * cr
        comissao_por_venda = aov * com + fixa
        receita_mes1 = vendas * comissao_por_venda
        ltv = vendas * comissao_por_venda * recorrencia if recorrencia > 1 else receita_mes1
        return cliques, vendas, receita_mes1, ltv

    print("\n== Projeção de receita mensal ==")
    print(f"  Premissas: {visitas:,.0f} visitas · CTR {ctr:.2%} · CR {cr:.2%} · "
          f"AOV {_money(aov, moeda)} · comissão {com:.1%}"
          + (f" + {_money(fixa, moeda)} fixa" if fixa else "")
          + (f" · recorrência {recorrencia:.0f} meses" if recorrencia > 1 else ""))
    print()
    print(f"  {'Cenário':<14}{'Cliques':>10}{'Vendas':>9}{'Receita/mês':>16}{'LTV (total)':>16}")
    for nome, mult in (("conservador", 0.7), ("base", 1.0), ("otimista", 1.5)):
        cliques, vendas, rec, ltv = calc(mult)
        print(f"  {nome:<14}{_num(cliques):>10}{_num(vendas,1):>9}{_money(rec, moeda):>16}{_money(ltv, moeda):>16}")
    if custo:
        _, _, rec, _ = calc(1.0)
        print(f"\n  Custo mensal: {_money(custo, moeda)} → lucro (cenário base): "
              f"{_money(rec - custo, moeda)}  |  margem: {(rec - custo) / rec:.1%}" if rec else "")
    print("\n  Dica: rode de novo trocando só a oferta (--aov/--comissao). A diferença de")
    print("  receita com a MESMA audiência é o argumento do cap. 05 §1 (EPC > comissão).\n")
    return 0


# ---------------------------------------------------------------- 3) Break-even

def cmd_break_even(a):
    comissao_media = _f(a.comissao_media)     # R$/US$ por venda
    cr = _pct(a.cr)
    aov = _f(a.aov)
    com = _pct(a.comissao)
    margem = _pct(a.margem_alvo) or 0.5
    moeda = a.moeda

    if comissao_media <= 0 and aov > 0 and com > 0:
        comissao_media = aov * com
    if comissao_media <= 0:
        sys.exit("[erro] informe --comissao-media OU (--aov e --comissao)")

    epc = comissao_media * cr
    print("\n== Break-even de tráfego pago ==")
    print(f"  Comissão média por venda ....... {_money(comissao_media, moeda)}")
    print(f"  CR esperada ................... {cr:.2%}")
    print(f"  EPC teórico ................... {_money(epc, moeda)}")
    print(f"  CPC máximo (break-even) ....... {_money(epc, moeda)}")
    print(f"  CPC-alvo com margem {margem:.0%} ..... {_money(epc * (1 - margem), moeda)}")
    print(f"  CPA máximo (por venda) ........ {_money(comissao_media, moeda)}")
    print(f"  Valor por clique qualificado .. {_money(epc, moeda)}  (= EPC; use como teto de CPL/CPC)")
    roas = 1 / margem if margem else 0
    print(f"  ROAS necessário sobre comissão  {roas:.2f}x")
    print("\n  Regra de entrada (cap. 12 §2, motor 3): só anuncie quando o EPC orgânico")
    print("  medido for ≥ 2x o CPC previsto do canal.\n")
    return 0


# ---------------------------------------------------------------- 4) Ofertas

SCORE_FIELDS = ("comissao_pct", "comissao_fixa", "aov", "cookie_dias", "recorrencia_meses",
                "cr_esperada", "moeda", "fonte")


def _score_oferta(r, cambio):
    moeda = (r.get("moeda") or "BRL").upper()[:3]
    fx = 1.0 if moeda == "USD" else (1.0 / cambio if moeda == "BRL" else 1.0)

    aov = _f(r.get("aov")) * fx
    com = _pct100(r.get("comissao_pct"))
    fixa = _f(r.get("comissao_fixa")) * fx
    cr = _pct100(r.get("cr_esperada"))
    cookie = _f(r.get("cookie_dias"))
    rec = _f(r.get("recorrencia_meses"))
    comissao_por_venda = aov * com + fixa
    epc = comissao_por_venda * cr                      # em USD (normalizado)
    ltv = comissao_por_venda * (rec if rec > 1 else 1) * cr

    filled = sum(1 for f in SCORE_FIELDS if str(r.get(f, "")).strip())
    confianca = 1.0 if (r.get("fonte") or "").lower().startswith(("oficial", "painel")) else 0.5

    s_epc = min(epc / 3.0, 1.0) * 40                   # US$ 3 de EPC = nota cheia
    s_cookie = min(cookie / 90.0, 1.0) * 20
    s_rec = min(rec / 24.0, 1.0) * 20
    s_conf = confianca * 10
    s_comp = (filled / len(SCORE_FIELDS)) * 10
    score = s_epc + s_cookie + s_rec + s_conf + s_comp

    return {
        "nome": r.get("nome") or r.get("programa") or "?",
        "rede": r.get("rede") or "-",
        "categoria": r.get("categoria") or "-",
        "comissao": ((f"{com * 100:.0f}%" if com else "") +
                     (f" +US${_num(fixa, 2)}" if fixa else "")) or "-",
        "aov": aov,
        "cr": cr,
        "cookie": cookie,
        "rec": rec,
        "epc_usd": epc,
        "ltv_usd": ltv,
        "score": score,
        "s_epc": s_epc, "s_cookie": s_cookie, "s_rec": s_rec, "s_conf": s_conf, "s_comp": s_comp,
        "url": r.get("url_cadastro") or "",
    }


def cmd_ofertas(a):
    rows = _rows_normalized(_read_csv(a.csv))
    cambio = _f(a.cambio) or BRL_PER_USD_DEFAULT
    scored = sorted((_score_oferta(r, cambio) for r in rows), key=lambda x: -x["score"])
    if a.filtro:
        f = a.filtro.lower()
        scored = [s for s in scored if f in s["nome"].lower() or f in s["categoria"].lower()
                  or f in s["rede"].lower()]
    top = scored[: a.top]

    print(f"\n== Ranking de ofertas (EPC normalizado em USD · câmbio R$ {cambio:.2f}/US$) ==")
    print(f"  {'#':<3}{'Oferta':<28}{'Comissão':<12}{'Cookie':>7}{'Rec':>5}"
          f"{'EPC US$':>10}{'LTV US$':>10}{'Score':>7}")
    for i, s in enumerate(top, 1):
        print(f"  {i:<3}{s['nome'][:27]:<28}{s['comissao'][:11]:<12}{_num(s['cookie']):>6}d"
              f"{_num(s['rec']):>5}{_num(s['epc_usd'],2):>10}{_num(s['ltv_usd'],2):>10}{_num(s['score'],1):>7}")

    print("\n  Convenção da planilha: comissao_pct e cr_esperada em % (1.2 = 1,2%);")
    print("  valores fixos e AOV são normalizados para US$ pelo câmbio informado.")
    print("\n  Composição do Affiliate Score (0-100):")
    print("    EPC esperado (US$ 3 = teto) .... 40 pts")
    print("    Cookie (90 dias = teto) ........ 20 pts")
    print("    Recorrência (24 meses = teto) .. 20 pts")
    print("    Confiança da fonte ............. 10 pts")
    print("    Completude dos campos .......... 10 pts")
    if a.explicar and top:
        s = top[0]
        print(f"\n  Detalhe do 1º colocado ({s['nome']}):")
        print(f"    EPC {_num(s['s_epc'],1)}/40 · cookie {_num(s['s_cookie'],1)}/20 · recorrência "
              f"{_num(s['s_rec'],1)}/20 · confiança {_num(s['s_conf'],1)}/10 · completude {_num(s['s_comp'],1)}/10")
        if s["url"]:
            print(f"    cadastro: {s['url']}")
    print("\n  ⚠ Confirme comissão, cookie e regras na página OFICIAL antes de publicar (cap. 05 §4).\n")
    if a.saida:
        with open(a.saida, "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh)
            w.writerow(["posicao", "nome", "rede", "categoria", "comissao", "aov_usd", "cr",
                        "cookie_dias", "recorrencia_meses", "epc_usd", "ltv_usd", "score", "url"])
            for i, s in enumerate(scored, 1):
                w.writerow([i, s["nome"], s["rede"], s["categoria"], s["comissao"], f"{s['aov']:.2f}",
                            f"{s['cr']:.4f}", s["cookie"], s["rec"], f"{s['epc_usd']:.3f}",
                            f"{s['ltv_usd']:.2f}", f"{s['score']:.1f}", s["url"]])
        print(f"  [ok] ranking exportado para {a.saida}\n")
    return 0


# ---------------------------------------------------------------- 5) Scorecard de nicho

PESOS = {"conhecimento": 0.20, "interesse": 0.15, "epc": 0.25, "recorrencia": 0.10,
         "competicao": 0.10, "teste": 0.10, "risco": 0.10}


def cmd_scorecard(a):
    notas = {k: _f(getattr(a, k)) for k in PESOS}
    invalidos = [k for k, v in notas.items() if not (0 <= v <= 5)]
    if invalidos:
        sys.exit(f"[erro] notas devem estar entre 0 e 5: {', '.join(invalidos)}")
    total = sum(notas[k] / 5 * PESOS[k] for k in PESOS) * 100
    print(f"\n== Scorecard de nicho: {a.nome or '(sem nome)'} ==")
    for k in PESOS:
        print(f"  {k:<14} nota {notas[k]:.0f}/5  peso {PESOS[k]:.0%}  → {notas[k]/5*PESOS[k]*100:>5.1f} pts")
    print(f"  {'TOTAL':<14}{'':<11}{'':<9}  → {total:>5.1f} / 100")
    veredicto = ("VÁ — nicho aprovado" if total >= 70 else
                 "AJUSTÁVEL — resolva o critério mais fraco antes de decidir" if total >= 55 else
                 "TROQUE — economia ou interesse insuficientes")
    print(f"\n  Veredicto: {veredicto}")
    pior = min(notas, key=lambda k: notas[k] / 5 * PESOS[k])
    print(f"  Ponto mais fraco: {pior} ({notas[pior]:.0f}/5)\n")
    return 0


# ---------------------------------------------------------------- 6) UTM

def cmd_utm(a):
    destino = a.destino
    parts = urlparse(destino)
    qs = parse_qs(parts.query)
    params = {}
    if a.source:
        params["utm_source"] = a.source
    if a.medium:
        params["utm_medium"] = a.medium
    if a.campaign:
        params["utm_campaign"] = a.campaign
    if a.content:
        params["utm_content"] = a.content
    if a.term:
        params["utm_term"] = a.term
    for k, v in qs.items():
        params.setdefault(k, v[0])
    if a.subid:
        params[a.subid_key] = a.subid
    novo = urlunparse(parts._replace(query=urlencode(params, doseq=True)))
    print("\n== Link com UTM ==")
    print(f"  {novo}\n")
    print("  Nomenclatura (cap. 08 §2):")
    print("    source=plataforma · medium=organic|paid|social|email|referral|ai")
    print("    campaign=tema · content=peça/posição · term=keyword (paga)")
    print("  Use o MESMO valor de content no sub-id do link de afiliado para casar")
    print("  clique ↔ venda no relatório da rede.\n")
    return 0


# ---------------------------------------------------------------- 7) /go/ (links)

INDEX_PHP = r"""<?php
/**
 * Redirect de afiliado com log de clique (padrão Yoast / link-cloaker).
 * Gerado por ferramentas/afiliado.py em __GERADO__
 *
 * - lê redirects.csv (slug,destino,programa,sid,subid_param,ativo)
 * - grava em clicks.log (TSV) para você medir EPC por peça (cap. 08)
 * - responde 302 + X-Robots-Tag: noindex, nofollow
 * - bloqueia slug inexistente (default)
 */
declare(strict_types=1);

$dir   = __DIR__;
$slug  = isset($_GET['k']) ? preg_replace('/[^a-z0-9\-_]/i', '', (string)$_GET['k']) : '';
$sid   = isset($_GET['sid']) ? substr(preg_replace('/[^a-zA-Z0-9\-_\.]/', '', (string)$_GET['sid']), 0, 64) : '';
$map   = [];

if (($fh = fopen($dir . '/redirects.csv', 'r')) !== false) {
    $header = fgetcsv($fh);
    while (($row = fgetcsv($fh)) !== false) {
        if (count($row) < 2) { continue; }
        $data = array_combine(array_map('strtolower', $header) ?: [], $row) ?: [];
        $key  = $data['slug'] ?? ($row[0] ?? '');
        $ativo = strtolower((string)($data['ativo'] ?? 'sim'));
        if ($key !== '' && !in_array($ativo, ['nao', 'no', '0', 'false'], true)) {
            $map[$key] = ['destino' => $data['destino'] ?? $row[1],
                          'programa' => $data['programa'] ?? '',
                          'sid_padrao' => $data['sid'] ?? '',
                          'subid_param' => $data['subid_param'] ?? 'subid'];
        }
    }
    fclose($fh);
}

header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer-when-downgrade');

if ($slug === '' || !isset($map[$slug])) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Link indisponivel.\n";
    exit;
}

$dest = $map[$slug]['destino'];
$sidFinal = $sid !== '' ? $sid : (string)$map[$slug]['sid_padrao'];

// sub-id: anexa UM parametro, cujo nome vem da coluna subid_param do CSV
// (varia por programa: subid, sub1, sub2, aff_sub, clickref, irclickid, sck, src, utm_content...)
// deixe a coluna vazia quando o programa nao suportar sub-id.
if ($sidFinal !== '' && $map[$slug]['subid_param'] !== '') {
    $param = $map[$slug]['subid_param'];
    if (strpos($dest, $param . '=') === false) {
        $sep = (strpos($dest, '?') === false) ? '?' : '&';
        $dest .= $sep . $param . '=' . rawurlencode($sidFinal);
    }
}

$linha = implode("\t", [
    date('c'), $slug, $sidFinal, $map[$slug]['programa'],
    $_SERVER['REMOTE_ADDR'] ?? '', substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 180),
    substr($_SERVER['HTTP_REFERER'] ?? '', 0, 180),
]);
@file_put_contents($dir . '/clicks.log', $linha . PHP_EOL, FILE_APPEND | LOCK_EX);

header('Location: ' . $dest, true, 302);
exit;
"""

HTACCESS = """# /go/ — redirecionamentos de afiliado (gerado por ferramentas/afiliado.py)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /go/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^([A-Za-z0-9\\-_]+)/?$ index.php?k=$1 [QSA,L]
</IfModule>

# proteger arquivos internos
<FilesMatch "\\.(csv|log)$">
  Require all denied
</FilesMatch>
"""

NGINX_CONF = """# /go/ — variante Nginx (coloque no server block)
location ~ ^/go/([A-Za-z0-9\\-_]+)/?$ {
    try_files /go/index.php?k=$1&$args =404;
    fastcgi_pass unix:/run/php/php-fpm.sock;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root/go/index.php;
    fastcgi_param QUERY_STRING k=$1&$args;
}
location ~ ^/go/.*\\.(csv|log)$ { deny all; }
"""

ROBOTS_SNIPPET = """# adicione ao seu robots.txt (cap. 07 §4)
User-agent: *
Disallow: /go/
Disallow: /recomenda/
"""


def cmd_links(a):
    rows = _rows_normalized(_read_csv(a.csv))
    if a.check:
        return _check_links(rows)

    saida = a.saida or "site-go"
    os.makedirs(saida, exist_ok=True)
    destinos, slugs = [], set()
    with open(os.path.join(saida, "redirects.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["slug", "destino", "programa", "sid", "subid_param", "ativo"])
        for r in rows:
            slug = (r.get("slug") or "").strip().lower()
            dest = (r.get("destino") or "").strip()
            if not slug or not dest:
                continue
            if slug in slugs:
                print(f"  [aviso] slug duplicado ignorado: {slug}")
                continue
            slugs.add(slug)
            w.writerow([slug, dest, r.get("programa", ""), r.get("sid", ""),
                        (r.get("subid_param") or "subid"), (r.get("ativo") or "sim")])
            destinos.append((slug, dest, r.get("programa", "")))

    php = INDEX_PHP.replace("__GERADO__", datetime.now().strftime("%d/%m/%Y %H:%M"))
    _write(os.path.join(saida, "index.php"), php)
    _write(os.path.join(saida, ".htaccess"), HTACCESS)
    _write(os.path.join(saida, "nginx.conf.example"), NGINX_CONF)
    _write(os.path.join(saida, "robots.snippet.txt"), ROBOTS_SNIPPET)
    _write(os.path.join(saida, "README.md"),
           "# Pasta /go/\n\n"
           f"Gerada em {datetime.now():%d/%m/%Y %H:%M} com {len(destinos)} links.\n\n"
           "1. Copie esta pasta para a raiz do site como `/go/`.\n"
           "2. Adicione `Disallow: /go/` ao `robots.txt`.\n"
           "3. Habilite mod_rewrite (Apache) ou use o `nginx.conf.example`.\n"
           "4. Nos conteúdos use `rel=\"sponsored nofollow noopener\"` e posição com `?sid=`:\n"
           "   `<a href=\"/go/nome?sid=tbl-top\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Ver preço</a>`\n"
           "5. `clicks.log` guarda: data, slug, sid, programa, IP, UA, referer → base do EPC (cap. 08).\n"
           "6. Rode a checagem mensal: `python3 ferramentas/afiliado.py links --csv <csv> --check`\n")

    print(f"\n== /go/ gerado em {saida}/ ==")
    for arq in ("redirects.csv", "index.php", ".htaccess", "nginx.conf.example",
                "robots.snippet.txt", "README.md"):
        print(f"  [ok] {arq}")
    print(f"\n  {len(destinos)} links mapeados:")
    for slug, dest, prog in destinos[:12]:
        print(f"    /go/{slug:<24} → {dest[:60]}{'…' if len(dest) > 60 else ''}  [{prog}]")
    if len(destinos) > 12:
        print(f"    … e mais {len(destinos) - 12}")
    print("\n  Próximo passo: adicione o snippet de robots.txt e teste cada slug em aba anônima.\n")
    return 0


def _write(path, content):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)


def _check_links(rows, timeout=8):
    import urllib.request
    print("\n== Checagem de destinos ==")
    ok = falha = 0
    for r in rows:
        slug = (r.get("slug") or "").strip()
        dest = (r.get("destino") or "").strip()
        if not dest:
            continue
        try:
            req = urllib.request.Request(dest, method="GET",
                                        headers={"User-Agent": "Mozilla/5.0 (link-checker manual-afiliado)"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                code = resp.getcode()
                final = resp.geturl()
            status = "OK " if code == 200 else f"{code}"
            ok += 1 if code == 200 else 0
            falha += 0 if code == 200 else 1
            print(f"  [{status}] /go/{slug:<22} → {final[:70]}")
        except Exception as exc:  # rede bloqueada, 403 de bot, timeout…
            falha += 1
            print(f"  [ERRO] /go/{slug:<22} → {type(exc).__name__}: {str(exc)[:60]}")
    print(f"\n  Resumo: {ok} ok · {falha} com problema.")
    print("  Nota: alguns programas bloqueiam checagem automatizada (403). Nesses casos,")
    print("  valide manualmente em aba anônima (SOP-A3).\n")
    return 1 if falha else 0


# ---------------------------------------------------------------- 8) KPI

def cmd_kpi(a):
    rows = _rows_normalized(_read_csv(a.csv))
    por_canal, por_semana = {}, {}
    for r in rows:
        sem = str(r.get("semana") or r.get("data") or "-")
        canal = str(r.get("canal") or "-")
        visitas = _f(r.get("visitas"))
        cliques = _f(r.get("cliques"))
        receita = _f(r.get("receita"))
        custo = _f(r.get("custos") or r.get("custo"))
        contatos = _f(r.get("novos_contatos"))
        c = por_canal.setdefault(canal, [0, 0, 0.0, 0.0, 0])
        c[0] += visitas; c[1] += cliques; c[2] += receita; c[3] += custo; c[4] += int(contatos)
        s = por_semana.setdefault(sem, [0, 0, 0.0, 0.0])
        s[0] += visitas; s[1] += cliques; s[2] += receita; s[3] += custo

    moeda = a.moeda
    print("\n== KPI por canal (período do CSV) ==")
    print(f"  {'Canal':<16}{'Visitas':>10}{'Cliques':>9}{'CTR':>8}{'Receita':>14}{'EPC':>10}{'RPV':>10}")
    tot = [0, 0, 0.0, 0.0, 0]
    for canal, (v, cl, rec, cust, cont) in sorted(por_canal.items(), key=lambda kv: -kv[1][2]):
        ctr = cl / v if v else 0
        epc = rec / cl if cl else 0
        rpv = rec / v if v else 0
        print(f"  {canal[:15]:<16}{_num(v):>10}{_num(cl):>9}{ctr:>8.2%}{_money(rec, moeda):>14}"
              f"{_money(epc, moeda):>10}{_money(rpv, moeda):>10}")
        tot[0] += v; tot[1] += cl; tot[2] += rec; tot[3] += cust; tot[4] += cont
    print(f"  {'TOTAL':<16}{_num(tot[0]):>10}{_num(tot[1]):>9}"
          f"{(tot[1]/tot[0] if tot[0] else 0):>8.2%}{_money(tot[2], moeda):>14}"
          f"{_money(tot[2]/tot[1] if tot[1] else 0, moeda):>10}"
          f"{_money(tot[2]/tot[0] if tot[0] else 0, moeda):>10}")
    print(f"\n  Custo total: {_money(tot[3], moeda)} · Lucro: {_money(tot[2] - tot[3], moeda)}"
          f" · Novos contatos: {_num(tot[4])}")

    semanas = sorted(por_semana)
    if len(semanas) >= 2:
        print("\n== Variação semana a semana ==")
        print(f"  {'Semana':<14}{'Visitas':>10}{'Cliques':>9}{'Receita':>14}{'EPC':>10}")
        anterior = None
        for sem in semanas:
            v, cl, rec, cust = por_semana[sem]
            epc = rec / cl if cl else 0
            delta = ""
            if anterior and anterior[1]:
                d = (epc - anterior[1]) / anterior[1]
                delta = f"  ({d:+.0%} EPC)"
            print(f"  {sem[:13]:<14}{_num(v):>10}{_num(cl):>9}{_money(rec, moeda):>14}{_money(epc, moeda):>10}{delta}")
            anterior = (sem, epc)
    print("\n  Decisão (cap. 08 §5): dobre no canal com maior RPV; reescreva CTA onde CTR < 2%;")
    print("  troque a oferta onde EPC está abaixo da média do seu nicho.\n")
    return 0


# ---------------------------------------------------------------- parser

def build_parser():
    p = argparse.ArgumentParser(
        prog="afiliado.py",
        description="CLI do Manual do Afiliado — EPC, projeção, break-even, ofertas, UTM, /go/, KPI.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__.split("Exemplos")[-1])
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("epc", help="EPC, CR, CTR e RPV")
    s.add_argument("--clicks", required=True)
    s.add_argument("--receita", required=True)
    s.add_argument("--visitas", default="0")
    s.add_argument("--vendas", default="0")
    s.add_argument("--moeda", default="R$")
    s.set_defaults(func=cmd_epc)

    s = sub.add_parser("projecao", help="projeção de receita mensal em 3 cenários")
    s.add_argument("--visitas", required=True)
    s.add_argument("--ctr", required=True, help="CTR do link (0.035 ou 3.5%%)")
    s.add_argument("--cr", required=True, help="conversão do clique em venda")
    s.add_argument("--aov", required=True, help="ticket médio")
    s.add_argument("--comissao", required=True, help="%% de comissão")
    s.add_argument("--comissao-fixa", default="0", help="bounty/valor fixo por venda")
    s.add_argument("--recorrencia-meses", default="1", help="meses de comissão recorrente")
    s.add_argument("--custo", default="0", help="custo mensal (ferramentas + anúncios)")
    s.add_argument("--moeda", default="R$")
    s.set_defaults(func=cmd_projecao)

    s = sub.add_parser("break-even", help="CPC/CPA máximo e ROAS necessário")
    s.add_argument("--comissao-media", default="0", help="valor médio de comissão por venda")
    s.add_argument("--aov", default="0")
    s.add_argument("--comissao", default="0", help="%% (usada com --aov)")
    s.add_argument("--cr", default="0.02")
    s.add_argument("--margem-alvo", default="0.5")
    s.add_argument("--moeda", default="R$")
    s.set_defaults(func=cmd_break_even)

    s = sub.add_parser("ofertas", help="rank de ofertas por EPC esperado + Affiliate Score")
    s.add_argument("--csv", default="templates/planilha-ofertas.csv")
    s.add_argument("--top", type=int, default=15)
    s.add_argument("--filtro", default="")
    s.add_argument("--cambio", default=str(BRL_PER_USD_DEFAULT))
    s.add_argument("--explicar", action="store_true")
    s.add_argument("--saida", default="", help="exporta o ranking em CSV")
    s.set_defaults(func=cmd_ofertas)

    s = sub.add_parser("scorecard", help="nota 0-100 de um nicho")
    s.add_argument("--nome", default="")
    for k in PESOS:
        s.add_argument(f"--{k.replace('_', '-')}", dest=k, default="0", help="nota 0-5")
    s.set_defaults(func=cmd_scorecard)

    s = sub.add_parser("utm", help="gera link com UTM padronizado")
    s.add_argument("--destino", required=True)
    s.add_argument("--source", default="")
    s.add_argument("--medium", default="")
    s.add_argument("--campaign", default="")
    s.add_argument("--content", default="")
    s.add_argument("--term", default="")
    s.add_argument("--subid", default="")
    s.add_argument("--subid-key", dest="subid_key", default="subid")
    s.set_defaults(func=cmd_utm)

    s = sub.add_parser("links", help="gera a pasta /go/ (redirect + log) ou checa destinos")
    s.add_argument("--csv", default="templates/mapa-de-links.csv")
    s.add_argument("--saida", default="site-go")
    s.add_argument("--check", action="store_true", help="testa os destinos do CSV")
    s.set_defaults(func=cmd_links)

    s = sub.add_parser("kpi", help="resumo semanal/mensal a partir do CSV de KPI")
    s.add_argument("--csv", default="templates/kpi-semanal.csv")
    s.add_argument("--moeda", default="R$")
    s.set_defaults(func=cmd_kpi)

    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
