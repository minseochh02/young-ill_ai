# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SheetSTACK (엑셀 시트 자동 병합기) is a Python desktop application that automatically merges Excel files with similar name prefixes, sorted by date in reverse order (newest first).

## Commands

Run from the SheetSTACK directory (`C:\Users\JS\Desktop\SheetSTACK`):

```bash
# Install dependencies
pip install -r excel_merger/requirements.txt

# Run the application
python excel_merger/main.py
```

Or with full paths from any directory:

```bash
pip install -r C:\Users\JS\Desktop\SheetSTACK\excel_merger\requirements.txt
python C:\Users\JS\Desktop\SheetSTACK\excel_merger\main.py
```

## Architecture

```
excel_merger/
├── main.py              # GUI entry point (CustomTkinter-based)
├── src/
│   ├── excel_merger.py  # Core merging logic (ExcelMerger class)
│   └── auto_merger.py   # File watching logic (watchdog-based AutoMerger)
└── requirements.txt
```

### Key Components

- **ExcelMergerGUI** (`main.py`): CustomTkinter GUI with folder selection, manual/auto merge modes, and progress display
- **ExcelMerger** (`src/excel_merger.py`): Groups files by prefix, extracts datetime from filenames (pattern: `YYYYMMDDHHMMSS`), merges with pandas
- **AutoMerger** (`src/auto_merger.py`): Uses watchdog to monitor folder for new/modified Excel files, triggers merge with 2-second debounce

### Data Flow

1. Files are grouped by prefix (text before first digit in filename)
2. Files within each group are sorted by datetime extracted from filename (reverse order)
3. Merged output includes `source_file`, `file_datetime`, `import_order` columns
4. Output files are named `{prefix}_merged_{timestamp}.xlsx`

## Dependencies

- pandas + openpyxl: Excel/CSV file handling
- watchdog: File system monitoring
- customtkinter: Modern tkinter GUI
