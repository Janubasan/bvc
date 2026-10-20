"""
opensheet-core — geração XLSX streaming para milhões de linhas (Rust)
Requer: pip install opensheet-core pandas

Para quando você precisa gerar o backup local .xlsx com 8 abas MRV sem estourar memória.
1,6x mais rápido que openpyxl, memória constante.
"""
from opensheet_core import XlsxWriter
from libs.mrv_data import MRV_EMPREDIMENTOS, load_leads

headers = ["Nome","Telefone","Email","Instagram","Interesse","Entrega","Metragem","Varanda","Bairro","Cidade","Faixa","Renda","Origem","Score","Status"]

with XlsxWriter("BVC-MRV-8predios.xlsx") as writer:
    # Uma sheet por prédio MRV
    for emp in MRV_EMPREDIMENTOS:
        ws = writer.add_worksheet(emp["nome_curto"])
        ws.write_row(0, 0, headers)
        # header style (bold) — opensheet suporta via write_row_with_format
        row_idx = 1
        for lead in load_leads(predio=emp["nome"]):
            ws.write_row(row_idx, 0, [
                lead["nome"], lead["telefone"], lead.get("email",""), lead.get("instagram",""),
                emp["nome"], emp["entrega"], emp["metragem"], emp["varanda"],
                lead["bairro"], lead["cidade"], lead["faixa"], lead["renda"],
                lead["origem"], lead["score"], lead["status"]
            ])
            row_idx += 1
        print(f"✅ {emp['nome_curto']}: {row_idx-1} linhas")

    # Consolidado
    ws_all = writer.add_worksheet("Consolidado")
    ws_all.write_row(0, 0, headers)
    for i, lead in enumerate(load_leads(), start=1):
        ws_all.write_row(i, 0, [lead["nome"], lead["telefone"], lead.get("email",""), lead["bairro"], lead["faixa"], lead["score"]])

print("📦 BVC-MRV-8predios.xlsx gerado com streaming Rust")
