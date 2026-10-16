#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Auditoria de links e dados da BVC.

O que faz:
  1. Confere todos os repositórios citados (dados/*.csv) via API do GitHub.
  2. Confere todos os modelos do Hugging Face (dados/hf-modelos.csv) via API do Hub.
  3. Garante que todo repositório do catálogo (dados/catalogo.py) tem dados verificados.
  4. Com --atualizar, regrava os CSVs com estrelas/licenças/status atuais.

Uso:
    python3 scripts/verificar_links.py
    python3 scripts/verificar_links.py --atualizar
    python3 scripts/verificar_links.py --limite 20     # testa só 20 itens de cada lista

Requisitos: `gh` autenticado para o GitHub; internet para o Hugging Face.
"""
import argparse, csv, json, os, subprocess, sys, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, RAIZ)
CAMPOS = ["repo", "status", "stars", "pushed", "lang", "lic", "desc"]

def gh_repo(nome):
    r = subprocess.run(["gh", "api", f"repos/{nome}"], capture_output=True, text=True, timeout=45)
    if r.returncode != 0:
        return None
    d = json.loads(r.stdout)
    return {"repo": d["full_name"], "status": "archived" if d["archived"] else "ok",
            "stars": d["stargazers_count"], "pushed": d["pushed_at"][:10],
            "lang": d.get("language") or "", "lic": (d.get("license") or {}).get("spdx_id", "") or "",
            "desc": (d.get("description") or "").replace("\n", " ")[:160]}

def hf_model(modelo):
    url = f"https://huggingface.co/api/models/{modelo}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            d = json.loads(r.read())
        return d.get("likes"), d.get("downloads")
    except Exception:
        return None

def carregar_csv(nome):
    caminho = os.path.join(RAIZ, "dados", nome)
    return list(csv.DictReader(open(caminho))) if os.path.exists(caminho) else []

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--atualizar", action="store_true", help="regrava os CSVs com dados atuais")
    ap.add_argument("--limite", type=int, default=0, help="limitar itens por lista (teste rápido)")
    args = ap.parse_args()

    problemas, mudancas = [], []
    for arquivo in ("repos.csv", "extras.csv"):
        linhas = carregar_csv(arquivo)
        if not linhas:
            continue
        novos = []
        for i, linha in enumerate(linhas):
            if args.limite and i >= args.limite:
                novos.append(linha); continue
            atual = gh_repo(linha["repo"])
            if atual is None:
                problemas.append(f"[GitHub] sumiu/renomeado: {linha['repo']}")
                novos.append({**linha, "status": "NAO_EXISTE", "stars": "0"})
                continue
            if atual["repo"] != linha["repo"]:
                mudancas.append(f"[GitHub] nome canônico: {linha['repo']} -> {atual['repo']}")
            if str(atual["stars"]) != str(linha["stars"]):
                mudancas.append(f"[GitHub] {atual['repo']}: {linha['stars']} -> {atual['stars']} estrelas")
            novos.append(atual)
        if args.atualizar:
            with open(os.path.join(RAIZ, "dados", arquivo), "w", newline="") as f:
                w = csv.DictWriter(f, fieldnames=CAMPOS); w.writeheader()
                w.writerows({k: n.get(k, "") for k in CAMPOS} for n in novos)
            print(f"Atualizado: dados/{arquivo}")

    # Hugging Face
    hf_linhas = carregar_csv("hf-modelos.csv")
    for i, linha in enumerate(hf_linhas):
        if args.limite and i >= args.limite:
            break
        res = hf_model(linha["modelo"])
        if res is None:
            problemas.append(f"[HF] não encontrado (ou sem internet): {linha['modelo']}")
            continue
        likes, downloads = res
        print(f"[HF] ok {linha['modelo']}: {likes} likes, {downloads} downloads (csv: {linha['likes']}/{linha['downloads']})")

    # Cobertura do catálogo
    try:
        from dados.catalogo import CATALOGO
        verificados = {l["repo"] for l in carregar_csv("repos.csv")} | {l["repo"] for l in carregar_csv("extras.csv")}
        faltam = [r for _, itens in CATALOGO for r, _, _ in itens if r not in verificados]
        if faltam:
            problemas.append(f"[Catálogo] sem dados verificados: {', '.join(faltam)}")
    except ImportError:
        pass

    print("\n=== RESUMO ===")
    print(f"Mudanças detectadas: {len(mudancas)}")
    for m in mudancas[:40]:
        print("  ~", m)
    print(f"Problemas: {len(problemas)}")
    for p in problemas:
        print("  !", p)
    if not args.atualizar and mudancas:
        print("\nRode com --atualizar para regravar os CSVs e depois: python3 scripts/gerar_biblia_github.py")

if __name__ == "__main__":
    main()
