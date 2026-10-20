"""
Python — Baixa último backup .xlsx do Drive (prPedr/dowloadPlanhasGoogle adaptado BVC)
Requer: pip install google-api-python-client google-auth
Agende com: crontab -e → 0 7 * * * python /path/download_backups.py
"""
import io
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

SERVICE_ACCOUNT_FILE = "service-account.json"
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
drive = build("drive", "v3", credentials=creds)

# Busca pasta BVC-Backups
folder_q = "mimeType='application/vnd.google-apps.folder' and name='BVC-Backups'"
folder = drive.files().list(q=folder_q, fields="files(id,name)").execute()["files"][0]

# Último backup MRV .xlsx
q = f"'{folder['id']}' in parents and name contains 'BVC-MRV-'"
files = drive.files().list(q=q, orderBy="createdTime desc", fields="files(id,name,createdTime)").execute()["files"]
if not files:
    print("Nenhum backup encontrado")
    exit()

latest = files[0]
print(f"Baixando: {latest['name']} ({latest['createdTime']})")
request = drive.files().get_media(fileId=latest["id"])
fh = io.FileIO(f"backups/{latest['name']}", "wb")
downloader = MediaIoBaseDownload(fh, request)
done = False
while not done:
    status, done = downloader.next_chunk()
    print(f"Progresso {int(status.progress()*100)}%")
print("✅ Backup baixado em backups/")
