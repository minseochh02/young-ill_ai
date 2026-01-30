# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains three main projects for 영일오엔씨 business operations:

1. **Daily Report Dashboard** (`daily-report-dashboard/`) - React 19 + Vite 7 dashboard for tracking branch sales, collections, AR balance, and funds
2. **PlayWright Codegen Tool** (`PlayWright_codegen_영일0116/`) - Playwright-based web automation with Tkinter GUI (see subfolder's `CLAUDE.md` for details)
3. **SheetSTACK** (`Sheet_Stact/`) - Excel file auto-merger using CustomTkinter + watchdog

## Development Commands

### Daily Report Dashboard
```bash
cd daily-report-dashboard
npm install      # Install dependencies
npm run dev      # Dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

### Excel Parsing (for Dashboard)
```bash
# Primary: Parse Basic_Sheet folder with master DB generation
python parse_basic_sheets.py              # Auto-discovery, skip if cached
python parse_basic_sheets.py --force      # Force re-parse ignoring cache
python parse_basic_sheets.py --watch      # Watch mode: folder monitor + API server (port 5174)

# Alternative: Parse ILBO daily reports (requires manual FILES list update)
python parse_daily_reports.py

# Alternative: Parse branch-specific daily reports
python data_pipeline.py [MMDD]  # e.g., python data_pipeline.py 1101
```

**Python dependencies for parsing:**
```bash
pip install pandas openpyxl python-calamine watchdog
```

### PlayWright Codegen Tool
```bash
cd PlayWright_codegen_영일0116
pip install -r requirements.txt
playwright install chromium
python app/main.py   # Launch GUI
```

### SheetSTACK Excel Merger
```bash
cd Sheet_Stact/excel_merger
pip install -r requirements.txt
python main.py   # Launch GUI
```

## Data Pipelines

### Pipeline 1: Basic Sheet (Primary — Auto-discovery with Master DB)
```
1_Basic_Sheet/*.xlsx
    ↓ generate_master_excels()
1_Basic_Sheet/master/{type}_master.xlsx   (one master per type, deduped)
    ↓ main() → parse from master excels
daily-report-dashboard/src/data/basic_sheets.json
    ↓
Dashboard display (11 tabs)
```

**Supported file types (11):**

| Type | Category | Dedup Strategy |
|------|----------|----------------|
| 판매현황 | Transaction | 일자 + 판매처명 + 품목코드 |
| 구매현황 | Transaction | 일자 + 구매처명 + 품목코드 |
| 채권현황 | Snapshot | Latest file only |
| 경영요약보고서 | Snapshot | Latest file only |
| 수금현황 | Transaction | 일자-No. + 거래처명 + 금액 + 적요 |
| 지급현황 | Transaction | 일자-No. + 거래처명 + 금액 + 적요 |
| 입금보고서집계 | Transaction | 전표번호 + 거래처명 + 금액 + 적요 |
| 받을어음감소현황 | Transaction | 날짜 + 어음번호 |
| 받을어음증가현황 | Transaction | 날짜 + 어음번호 |
| 자금일보 | Snapshot | Latest file only |
| 입금보고서 | Transaction | 급여번호 + 날짜 |

Files are automatically grouped by Korean prefix (text before first digit) and sorted by datetime in filename.

**Key functions in `parse_basic_sheets.py`:**
- `generate_master_excels(file_groups)` — Merges files by type, deduplicates, saves to `master/`
- `parse_generic_data(filepath, config)` — Universal parser using FILE_CONFIGS
- `main(force=False)` — Orchestrates: cache check → master generation → parsing → JSON output
- `start_api_server(port=5174)` — Embedded HTTP API server for dashboard refresh/rollback
- `watch_folder()` — Watchdog-based folder monitoring with 3s debounce

**API endpoints (port 5174, auto-started in --watch mode):**
- `GET /api/refresh` — Force re-parse and update JSON
- `GET /api/rollback?file={filename}` — Restore from backup
- `GET /api/backups` — List available backups (max 10)

### Pipeline 2: ILBO Daily Reports
```
ILBO/*.xlsx → parse_daily_reports.py → daily_reports.json + 영일오엔씨_마스터DB.xlsx
```
**Setup:** Add file path to `FILES` list in `parse_daily_reports.py`, then run the script.

### Pipeline 3: Branch Daily Reports
```
Basic_Sheet/*일일매출수금*현황*.xlsx → data_pipeline.py → dashboard.json
```
**Usage:** `python data_pipeline.py [MMDD]` (uses latest sheet if date not specified)

## Architecture

### Daily Report Dashboard
React 19 + Vite 7 with Recharts for visualizations.

Key components in `src/components/`:
- `App.jsx` - Main dashboard with date/branch filtering
- `CalendarModal.jsx` - Date picker with daily/cumulative toggle
- `BasicSheetView.jsx` - Tab-based view for 11 data types with:
  - `SalesTable` — 판매현황 (sortable, filterable, CSV export)
  - `PurchasesTable` — 구매현황
  - `ReceivablesTable` — 채권현황
  - `ManagementSummary` — 경영요약보고서
  - `SimpleListTable` — 수금/지급/입금보고서집계
  - `GenericTable` — 어음감소/어음증가/자금일보/입금보고서
  - Refresh button (calls `/api/refresh`)
  - Rollback button (calls `/api/rollback`)
- Charts: `SalesChart.jsx`, `FundChart.jsx`, `MobileValuesChart.jsx`
- Tables: `CollectionsTable.jsx`, `ArBalanceTable.jsx`, `FundHistoryTable.jsx`, `MajorExpTable.jsx`
- `MetricCard.jsx` — Reusable metric display card

Data files in `src/data/`: `daily_reports.json`, `basic_sheets.json`

Vite proxy config forwards `/api` to `http://127.0.0.1:5174`.

### PlayWright Codegen Tool
See `PlayWright_codegen_영일0116/CLAUDE.md` for complete architecture.

Core modules in `app/`:
- `codegen_manager.py` - Playwright Codegen process lifecycle (Windows uses taskkill for process tree)
- `script_executor.py` - Execution with popup/download handling, UTF-8/CP949 encoding on Windows
- `cdp_recorder.py` - Chrome DevTools Protocol recording (bypasses automation detection)
- `ui_builder.py` - Generates standalone apps from scripts

### SheetSTACK Excel Merger
CustomTkinter GUI with watchdog file monitoring.

Modules in `Sheet_Stact/excel_merger/src/`:
- `excel_merger.py` - Groups files by prefix, extracts datetime from filename (`YYYYMMDDHHMMSS` pattern)
- `auto_merger.py` - Folder monitoring with 2-second debounce

## Master DB Excel Structure (영일오엔씨_마스터DB.xlsx)

Generated by `parse_daily_reports.py` with these sheets:

| Sheet | Key Columns |
|-------|-------------|
| 매출DB | 날짜, 사업소, 총매출액, 모빌Sell-out금액, Sell-out/Sell-in (L) |
| 수금DB | 날짜, 사업소, 총수금액, 현금, 어음, 카드, 전월잔액, 당월매출, 미수잔액 |
| 자금DB | 날짜, 구분(전잔/당입/지출/현잔), 보통예금, 전자어음, 외담대, 받을어음, CMA, 외화, 차입금 |
| 주요비용DB | 날짜, 거래처, 금액, 적요 |
| 모빌결제DB | 날짜, 사업소, IL, AUTO, MBK, 합계 |
| 일별합계DB | 날짜, 총매출액, 총Sell-out, 총수금액, 총미수잔액 |

## Installation & Deployment

**Install.bat** installs:
- Node.js packages (`npm install` in `daily-report-dashboard/`)
- Python packages: `pandas`, `openpyxl`, `python-calamine`, `watchdog`

**START.bat** launches:
1. `python parse_basic_sheets.py --watch` (folder monitor + API server, separate window)
2. `npm run dev` (Vite dev server on port 5173)
3. Auto-opens browser to http://localhost:5173

## Korean Terminology

| 한글 | English |
|------|---------|
| 사업소 | Branch (화성IL, 서울, 창원, 인천서부, 남양주동부, 제주, 부산) |
| 총매출 | Total Sales |
| 수금 | Collections |
| 미수잔액 | AR Balance (Accounts Receivable) |
| 입금/출금 | Deposit/Withdrawal |
| 일계/월누계 | Daily/Monthly Cumulative |
| 전잔/당입/지출/현잔 | Previous/Deposit/Withdraw/Current Balance |
| 일보 | Daily Report |
| 채권 | Receivables |
| 경영요약보고서 | Management Summary Report |
| 받을어음 | Notes Receivable |
| 자금일보 | Daily Fund Report |
| 입금보고서 | Deposit Report |
