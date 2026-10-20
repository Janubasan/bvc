/**
 * Apps Script — Backup Auto BVC MRV 8 prédios
 * Gatilho: Acionadores → Adicionar acionador → backupMRV → Horário → Diário 06:00
 * O que faz: exporta planilha MRV para .xlsx no Drive (pasta BVC-Backups)
 */

function backupMRV() {
  const SPREADSHEET_ID = "ID_DA_PLANILHA_BVC_MRV"; // cole aqui
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const name = "BVC-MRV-8predios-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd") + ".xlsx";
  
  // Exporta via URL fetch com token
  const url = "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/export?format=xlsx";
  const token = ScriptApp.getOAuthToken();
  const res = UrlFetchApp.fetch(url, { headers: { Authorization: "Bearer " + token } });
  const blob = res.getBlob().setName(name);
  
  // Salva no Drive em pasta dedicada
  let folder;
  const folders = DriveApp.getFoldersByName("BVC-Backups");
  if (folders.hasNext()) folder = folders.next();
  else folder = DriveApp.createFolder("BVC-Backups");
  
  folder.createFile(blob);
  Logger.log("✅ Backup MRV salvo: " + name);
  
  // Opcional: mantém só últimos 30 dias
  const files = folder.getFiles();
  const cutoff = new Date(Date.now() - 30*24*60*60*1000);
  while (files.hasNext()) {
    const f = files.next();
    if (f.getDateCreated() < cutoff) f.setTrashed(true);
  }
}
