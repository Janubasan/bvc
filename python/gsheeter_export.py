"""
gsheeter — escrita automática 8 prédios MRV (service account)
Requer: pip install gsheeter pandas
"""
import gsheeter
from gsheeter import Drive
from libs.mrv_data import MRV_EMPREDIMENTOS  # adapte ao seu path

# Autenticação via service account
gsheeter.service_account("service-account.json")

# Abre a planilha (ID da URL)
spreadsheet = Drive.get_spreadsheet("ID_DA_PLANILHA")

# Para cada prédio MRV, escreve matrix em aba própria
headers = ["Nome","Telefone","Email","Instagram","Interesse","Entrega","Metragem","Varanda","Bairro","Cidade","Faixa","Renda","Origem","Score","Status","Intent","Criado em","Financiamento"]

for emp in MRV_EMPREDIMENTOS:
    sheet_name = emp["nome_curto"]  # ex: Gran Porto
    sheet = spreadsheet.get_sheet(sheet_name)
    # Cria se não existir
    if sheet is None:
        sheet = spreadsheet.add_sheet(sheet_name)
    # Monta matrix: header + rows filtradas por prédio
    rows = [headers] + [
        [lead["nome"], lead["telefone"], lead.get("email",""), lead.get("instagram",""), emp["nome"], emp["entrega"], emp["metragem"], emp["varanda"], lead["bairro"], lead["cidade"], lead["faixa"], lead["renda"], lead["origem"], lead["score"], lead["status"], "|".join(lead["intent"]), lead["created_at"], "420 meses • FGTS • menores taxas"]
        for lead in leads if emp["nome"] in lead.get("interesse","")
    ]
    sheet.matrix = rows  # ← gsheeter magic: escreve tudo em 1 batch
    print(f"✅ {sheet_name}: {len(rows)-1} linhas escritas")

# Consolidado
consolidado = spreadsheet.get_sheet("Consolidado")
consolidado.matrix = [headers] + [[l["nome"], l["telefone"], l.get("email",""), l.get("instagram",""), l["interesse"], l["bairro"], l["cidade"], l["faixa"], l["renda"], l["origem"], l["score"], l["status"]] for l in leads]
print("✅ Consolidado escrito")
