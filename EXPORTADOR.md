# Exportador de Planilhas BVC — Melhor Solução (Análise)

> **Decisão: Híbrido Google Sheets (gsheeter-like) + XLSX Local (exceljs) + Backup Apps Script**
> 8 prédios MRV sistematizados, cada um com aba própria, formatação e dropdowns.

## 1. Pesquisa — 5 opções avaliadas

| Biblioteca | Tipo | Melhor para | Trade-off |
|---|---|---|---|
| **gsheeter** (Python) | Escrita automática Google Sheets via Service Account | `sheet.matrix = [[...]]` — 1 linha, ideal para 8 abas MRV | Só Google Sheets, sem XLSX local |
| **opensheet-core** (Rust) | XLSX streaming p/ milhões de linhas | 1,6x mais rápido que openpyxl, memória constante | Só Python/Rust, não Node |
| **openpyxl** (Python) | Tradicional XLSX | Compatibilidade máxima, formatação | Lento em volume, memória alta |
| **XlsxWriter** (Python) | Escrita XLSX com gráficos | Gráficos/formatação avançada | Só escrita (não lê) |
| **excel-exporter-bms** | Multi-abas p/ 1 XLSX | Consolidar 8 DataFrames | Menos mantido |

**Vencedor para Next.js (Node): `exceljs`**
- Equivalente Node de openpyxl/XlsxWriter, mas com **streaming**, formatação, 8 abas, dropdowns, filtros.
- Suporta `workbook.xlsx.writeBuffer()` → download direto no browser (sem backend Python).
- Para volume extremo, deixamos **opção Python opensheet-core** como `python/opensheet_export.py`.

**Vencedor para Google Sheets: `googleapis` + wrapper gsheeter-style**
- Já temos `googleapis@144` instalado. Criamos wrapper `src/lib/gsheeter.ts` que imita `gsheeter.service_account()` + `sheet.matrix = data`.
- Uma chamada `batchUpdate` escreve **8 abas de uma vez** (Gran Safira, Gran Essence, Gran Parma, Gran Terrazo, Priville, Gran Aurora, Gran Porto, Vert) — 1 quota hit vs 8 hits.

## 2. Arquitetura BVC Exportador

```
[Leads MRV] → src/lib/exporter.ts → 3 saídas:
  1. Google Sheets (googleapis batchUpdate) → 8 abas + formatação + validações
  2. XLSX Local (exceljs streaming) → 8 sheets + filtros + download
  3. Backup Auto (Apps Script + Python Drive) → .xlsx no Drive → download cron

API: POST /api/export { target: "googleSheets"|"xlsx"|"csv"|"all", predios: ["all"]|"Gran Porto", formatOptions }
UI:  src/components/Exportador.tsx → botões + preview + status
```

## 3. Google Sheets — Wrapper gsheeter-like

```ts
// src/lib/gsheeter.ts — imita Python gsheeter
import { google } from "googleapis";
const gs = await GSheet.authServiceAccount("service-account.json");
// ou process.env vars
const ss = await gs.getSpreadsheet("ID_DA_PLANILHA");
const sheet = ss.getSheet("Gran Porto");
sheet.matrix = [["Nome","Tel","Entrega","Metragem","Varanda","Status"], ...rows];
await sheet.save(); // batchUpdate com formatação
```

Implementação: `getSpreadsheet(id)` → lista sheets, `getSheet(name)` → get values, `set matrix` → `spreadsheets.values.update` + `batchUpdate` p/ formatar header (bold, cor MRV, freeze 1 row, dropdown Status).

## 4. XLSX Local — exceljs (streaming)

```ts
import ExcelJS from "exceljs";
const wb = new ExcelJS.Workbook();
MRV_EMPREENDIMENTOS.forEach(emp => {
  const ws = wb.addWorksheet(emp.nomeCurto);
  ws.addRow(["Nome","Tel","Entrega","Metragem","Varanda","Score","Status"]);
  // header style: fill = emp.cor, bold, freeze
  // dataValidation: status dropdown
  leads.filter(l=>l.bairroInteresse===emp.nome).forEach(l=>ws.addRow([...]));
  ws.autoFilter = "A1:H1";
});
const buffer = await wb.xlsx.writeBuffer(); // → download
```

**Diferencial exceljs vs openpyxl:**
- openpyxl: carrega tudo em memória
- exceljs: `WorkbookWriter` streaming → memória constante (igual opensheet-core p/ Node)

## 5. Backup Auto — prPedr/dowloadPlanhasGoogle (adaptado BVC)

- **Apps Script** (gatilho horário): `Drive.getFileById(ID).getAs("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")` → salva `BVC-MRV-2026-10-20.xlsx` no Drive.
- **Python** (cron/schedule): autentica Drive API, busca último backup `BVC-MRV-*.xlsx`, baixa p/ `backups/`.
- Arquivos: `scripts/apps_script_backup.gs` + `python/download_backups.py`

## 6. UI Exportador (BVC)

- Card Google Sheets: pastar ID → Testar → Escrever 8 abas → link
- Card XLSX: escolher prédios → Gerar XLSX formatado → Download
- Card CSV: 1 CSV por prédio ou consolidado
- Card Backup Auto: instruções Apps Script + Python cron

## 7. Próximo passo

Após exportador: **Disparos WhatsApp em massa** (Evolution API filas por prédio) + **Follow-up automático** (D+1, D+3, D+7 por Faixa).
