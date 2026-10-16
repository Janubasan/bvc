import json, subprocess, csv, sys
rows=[]
names=[l.strip() for l in open('repos.txt') if l.strip()]
for n in names:
    try:
        out=subprocess.run(["gh","api",f"repos/{n}"],capture_output=True,text=True,timeout=30)
        if out.returncode!=0:
            rows.append({"repo":n,"status":"NAO_EXISTE","stars":0,"pushed":"","lang":"","lic":"","desc":""})
            continue
        d=json.loads(out.stdout)
        rows.append({"repo":d["full_name"],"status":"archived" if d["archived"] else "ok",
            "stars":d["stargazers_count"],"pushed":d["pushed_at"][:10],"lang":d.get("language") or "",
            "lic":(d.get("license") or {}).get("spdx_id","") or "","desc":(d.get("description") or "").replace("\n"," ")[:160]})
    except Exception as e:
        rows.append({"repo":n,"status":"ERRO:"+str(e)[:40],"stars":0,"pushed":"","lang":"","lic":"","desc":""})
with open('repos.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=["repo","status","stars","pushed","lang","lic","desc"]); w.writeheader(); w.writerows(rows)
ok=[r for r in rows if r["status"]!="NAO_EXISTE"]
print(f"total={len(rows)} ok={len(ok)} inexistentes={len(rows)-len(ok)}")
for r in rows:
    if r["status"]=="NAO_EXISTE": print("  FALTA:",r["repo"])
