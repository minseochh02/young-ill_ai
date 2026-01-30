# Excel to SQL Mapping Reference

This document provides detailed cell-by-cell mappings for converting Excel data to SQL tables.

> **📊 ACTIVE PIPELINES:** Only Pipeline 1 and Pipeline 2 are currently used in the dashboard.
> Pipeline 3 is documented but not actively used.

---

## Table of Contents

1. [Pipeline 1: Basic Sheet Files (1_Basic_Sheet)](#pipeline-1-basic-sheet-files) ✅ **ACTIVE**
2. [Pipeline 2: ILBO Daily Reports](#pipeline-2-ilbo-daily-reports) ✅ **ACTIVE**
3. [Pipeline 3: Branch Daily Reports](#pipeline-3-branch-daily-reports) ⚠️ **NOT CURRENTLY USED**
4. [SQL Schema Examples](#sql-schema-examples)

---

## Pipeline 1: Basic Sheet Files (1_Basic_Sheet)

Source: `parse_basic_sheets.py`

### Overview
- Files are auto-grouped by Korean prefix (text before first digit)
- `skiprows=1` means header is at row 2 (row 1 is skipped)
- Transaction types merge all files with deduplication
- Snapshot types use only the latest file
- ✅ **ACTIVELY USED** in dashboard via `basic_sheets.json`

---

### 1.1 판매현황 (Sales)

**File Pattern:** `판매현황_*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 일자 | date | DATE | Format: YYYY-MM-DD or YYYY/MM/DD |
| Column B | 거래처그룹1코드명 | branch_group | VARCHAR(100) | Branch/region name |
| Column C | 판매처명 | customer_name | VARCHAR(200) | Customer name |
| Column D | 품목코드 | item_code | VARCHAR(50) | Item code |
| Column E | 품목명(규격) | item_name | VARCHAR(300) | Item name with spec |
| Column F | 수량 | quantity | DECIMAL(15,2) | Sales quantity |
| Column G | 중량 | weight | DECIMAL(15,2) | Weight (optional) |
| Column H | 공급가액 | supply_amount | DECIMAL(15,2) | Supply amount (excluding VAT) |
| Column I | 합 계 | total_amount | DECIMAL(15,2) | Total amount (including VAT) |

**Deduplication Keys:** `[일자, 판매처명, 품목코드]`

**Sample SQL:**
```sql
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    branch_group VARCHAR(100),
    customer_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(50),
    item_name VARCHAR(300),
    quantity DECIMAL(15,2) DEFAULT 0,
    weight DECIMAL(15,2) DEFAULT 0,
    supply_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, customer_name, item_code)
);
```

---

### 1.2 구매현황 (Purchases)

**File Pattern:** `구매현황_*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 일자 | date | DATE | Purchase date |
| Column B | 거래처코드 | vendor_code | VARCHAR(50) | Vendor code |
| Column C | 구매처명 | vendor_name | VARCHAR(200) | Vendor name |
| Column D | 품목코드 | item_code | VARCHAR(50) | Item code |
| Column E | 품목명 | item_name | VARCHAR(300) | Item name |
| Column F | 수량 | quantity | DECIMAL(15,2) | Purchase quantity |
| Column G | 중량 | weight | DECIMAL(15,2) | Weight |
| Column H | 공급가액 | supply_amount | DECIMAL(15,2) | Supply amount |
| Column I | 합 계 | total_amount | DECIMAL(15,2) | Total amount |

**Deduplication Keys:** `[일자, 구매처명, 품목코드]`

**Sample SQL:**
```sql
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    vendor_code VARCHAR(50),
    vendor_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(50),
    item_name VARCHAR(300),
    quantity DECIMAL(15,2) DEFAULT 0,
    weight DECIMAL(15,2) DEFAULT 0,
    supply_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, vendor_name, item_code)
);
```

---

### 1.3 채권현황 (Receivables)

**File Pattern:** `채권현황_*.xlsx`

**Type:** Snapshot (latest file only)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 거래처코드 | customer_code | VARCHAR(50) | Customer code |
| Column B | 거래처그룹1명 | branch_name | VARCHAR(100) | Branch name |
| Column C | 담당자명 | manager_name | VARCHAR(100) | Account manager |
| Column D | 거래처명 | customer_name | VARCHAR(200) | Customer name |
| Column E | 청구금액 | billed_amount | DECIMAL(15,2) | Billed amount |
| Column F | 미청구금액 | unbilled_amount | DECIMAL(15,2) | Unbilled amount |
| Column G | 합계 | total_amount | DECIMAL(15,2) | Total receivables |

**Sample SQL:**
```sql
CREATE TABLE receivables (
    id SERIAL PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    customer_code VARCHAR(50),
    branch_name VARCHAR(100),
    manager_name VARCHAR(100),
    customer_name VARCHAR(200) NOT NULL,
    billed_amount DECIMAL(15,2) DEFAULT 0,
    unbilled_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 1.4 경영요약보고서 (Management Summary Report)

**File Pattern:** `경영요약보고서_*.xlsx`

**Type:** Snapshot (latest file only)

**Excel Structure:**
- Skip rows: 1
- Dynamic section-based structure

**Data Structure:**
- Sections identified by pattern: `^\d+\s*\.\s*` (e.g., "1. 매출현황", "2. 재무현황")
- Each section contains multiple rows of data
- Columns vary by section

**Note:** This report has variable structure. Recommend creating a JSON/JSONB column for flexible storage.

**Sample SQL:**
```sql
CREATE TABLE management_reports (
    id SERIAL PRIMARY KEY,
    report_date DATE NOT NULL,
    section_name VARCHAR(200),
    section_order INT,
    section_data JSONB,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 1.5 수금현황 (Collections)

**File Pattern:** `수금현황_*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 일자-No. | date_no | VARCHAR(100) | Date-Number (e.g., "2026/01/18 오전 10:00:00") |
| Column B | 거래처명 | customer_name | VARCHAR(200) | Customer name |
| Column C | 금액 | amount | DECIMAL(15,2) | Collection amount |
| Column D | 적요 | description | TEXT | Description/notes |

**Deduplication Keys:** `[일자-No., 거래처명, 금액, 적요]`

**Sample SQL:**
```sql
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    date_no VARCHAR(100) NOT NULL,
    collection_date DATE,
    customer_name VARCHAR(200) NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date_no, customer_name, amount, description)
);
```

---

### 1.6 지급현황 (Payments)

**File Pattern:** `지급현황_*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 일자-No. | date_no | VARCHAR(100) | Date-Number |
| Column B | 거래처명 | vendor_name | VARCHAR(200) | Vendor name |
| Column C | 금액 | amount | DECIMAL(15,2) | Payment amount |
| Column D | 적요 | description | TEXT | Description/notes |

**Deduplication Keys:** `[일자-No., 거래처명, 금액, 적요]`

**Sample SQL:**
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    date_no VARCHAR(100) NOT NULL,
    payment_date DATE,
    vendor_name VARCHAR(200) NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date_no, vendor_name, amount, description)
);
```

---

### 1.7 입금보고서집계 (Deposit Reports Summary)

**File Pattern:** `입금보고서집계_*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 전표번호 | voucher_no | VARCHAR(100) | Voucher number (may contain date) |
| Column B | 거래처명 | customer_name | VARCHAR(200) | Customer name |
| Column C | 금액 | amount | DECIMAL(15,2) | Deposit amount |
| Column D | 적요 | description | TEXT | Description |

**Deduplication Keys:** `[전표번호, 거래처명, 금액, 적요]`

**Sample SQL:**
```sql
CREATE TABLE deposit_reports (
    id SERIAL PRIMARY KEY,
    voucher_no VARCHAR(100) NOT NULL,
    voucher_date DATE,
    customer_name VARCHAR(200) NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(voucher_no, customer_name, amount, description)
);
```

---

### 1.8 받을어음감소현황 (Notes Receivable - Decrease)

**File Pattern:** `받을어음감소현황*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 날짜 | date | DATE | Transaction date |
| Column B | 어음번호 | bill_no | VARCHAR(100) | Bill/note number |
| Column C | 거래처번호 | customer_code | VARCHAR(50) | Customer code |
| Column D | 거래처명 | customer_name | VARCHAR(200) | Customer name |
| Column E | 어음금액 | bill_amount | DECIMAL(15,2) | Bill amount |
| Column F | 만기 | maturity_date | DATE | Maturity date |
| Column G | 잔액 | balance | DECIMAL(15,2) | Balance |

**Deduplication Keys:** `[날짜, 어음번호]`

**Sample SQL:**
```sql
CREATE TABLE bills_receivable_decrease (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    bill_no VARCHAR(100) NOT NULL,
    customer_code VARCHAR(50),
    customer_name VARCHAR(200),
    bill_amount DECIMAL(15,2) DEFAULT 0,
    maturity_date DATE,
    balance DECIMAL(15,2) DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, bill_no)
);
```

---

### 1.9 받을어음증가현황 (Notes Receivable - Increase)

**File Pattern:** `받을어음증가현황*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 날짜 | date | DATE | Transaction date |
| Column B | 거래처번호 | customer_code | VARCHAR(50) | Customer code |
| Column C | 어음번호 | bill_no | VARCHAR(100) | Bill/note number |
| Column D | 거래처명 | customer_name | VARCHAR(200) | Customer name |
| Column E | 어음금액 | bill_amount | DECIMAL(15,2) | Bill amount |
| Column F | 만기 | maturity_date | DATE | Maturity date |
| Column G | 어음기한만료 | bill_expiry | DATE | Bill expiry date |
| Column H | 잔액 | balance | DECIMAL(15,2) | Balance |

**Deduplication Keys:** `[날짜, 어음번호]`

**Sample SQL:**
```sql
CREATE TABLE bills_receivable_increase (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    customer_code VARCHAR(50),
    bill_no VARCHAR(100) NOT NULL,
    customer_name VARCHAR(200),
    bill_amount DECIMAL(15,2) DEFAULT 0,
    maturity_date DATE,
    bill_expiry DATE,
    balance DECIMAL(15,2) DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, bill_no)
);
```

---

### 1.10 자금일보 (Daily Fund Report)

**File Pattern:** `자금일보*.xlsx`

**Type:** Snapshot (latest file only)

**Excel Structure:**
- Skip rows: 1
- Variable structure, recommend flexible schema

**Sample SQL:**
```sql
CREATE TABLE fund_daily_reports (
    id SERIAL PRIMARY KEY,
    report_date DATE NOT NULL,
    data JSONB,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 1.11 입금보고서 (Deposit Report)

**File Pattern:** `입금보고서*.xlsx`

**Type:** Transaction (merge all files, deduplicate)

**Excel Structure:**
- Skip rows: 1
- Header row: Row 2

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Notes |
|-------------|-----------|-----------|-----------|-------|
| Column A | 급여번호 | payroll_no | VARCHAR(100) | Payroll number |
| Column B | 날짜 | date | DATE | Transaction date |
| Column C | 거래처명 | customer_name | VARCHAR(200) | Customer name |
| Column D | 계좌 | account | VARCHAR(100) | Account number |
| Column E | 잔액 | balance | DECIMAL(15,2) | Balance |
| Column F | 이체일자 | transfer_date | DATE | Transfer date |
| Column G | 입금내용 | deposit_content | TEXT | Deposit description |

**Deduplication Keys:** `[급여번호, 날짜]`

**Sample SQL:**
```sql
CREATE TABLE deposit_detailed_reports (
    id SERIAL PRIMARY KEY,
    payroll_no VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    customer_name VARCHAR(200),
    account VARCHAR(100),
    balance DECIMAL(15,2) DEFAULT 0,
    transfer_date DATE,
    deposit_content TEXT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(payroll_no, date)
);
```

---

## Pipeline 2: ILBO Daily Reports

> ✅ **ACTIVELY USED** in dashboard via `daily_reports.json`

Source: `parse_daily_reports.py`

**File Pattern:** `영일오엔씨 일보현황 2025년 - MMDD.xlsx`

**Sheet Name:** `일보` (Daily Report)

---

### 2.1 매출DB (Sales DB)

**Excel Location:** Rows 5-12, Sheet "일보"

**Branch Order:**
1. Row 5: 서울,화성 IL
2. Row 6: 창원
3. Row 7: 화성auto(남부)
4. Row 8: 화성auto(중부)
5. Row 9: 인천(서부)
6. Row 10: 남양주(동부)
7. Row 11: 제주
8. Row 12: 부산

**Column Mappings (for each branch row):**

| Excel Column | JSON Field | SQL Field | Data Type | Cell Location |
|-------------|-----------|-----------|-----------|---------------|
| Column B | total_sales | total_sales | DECIMAL(15,2) | B5-B12 |
| Column C | mobil_sell_out | mobil_sell_out | DECIMAL(15,2) | C5-C12 |
| Column D | mobil_sell_out_total_l | sell_out_total_l | DECIMAL(15,2) | D5-D12 |
| Column E | mobil_sell_out_flagship_l | sell_out_flagship_l | DECIMAL(15,2) | E5-E12 |
| Column F | mobil_sell_in_total_l | sell_in_total_l | DECIMAL(15,2) | F5-F12 |
| Column H | mobil_sell_in_flagship_l | sell_in_flagship_l | DECIMAL(15,2) | H5-H12 |

**Sample SQL:**
```sql
CREATE TABLE ilbo_sales (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INT,
    month INT,
    day INT,
    branch VARCHAR(100) NOT NULL,
    total_sales DECIMAL(15,2) DEFAULT 0,
    mobil_sell_out DECIMAL(15,2) DEFAULT 0,
    sell_out_total_l DECIMAL(15,2) DEFAULT 0,
    sell_out_flagship_l DECIMAL(15,2) DEFAULT 0,
    sell_in_total_l DECIMAL(15,2) DEFAULT 0,
    sell_in_flagship_l DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, branch)
);
```

---

### 2.2 수금DB (Collections DB)

**Excel Location:** Rows 19-26, Sheet "일보"

**Branch Order:**
1. Row 19: 화성 IL
2. Row 20: 창원
3. Row 21: 화성auto(남부)
4. Row 22: 화성auto(중부)
5. Row 23: 인천(서부)
6. Row 24: 남양주(동부)
7. Row 25: 제주
8. Row 26: 부산

**Column Mappings (for each branch row):**

| Excel Column | JSON Field | SQL Field | Data Type | Cell Location |
|-------------|-----------|-----------|-----------|---------------|
| Column B | total_collection | total_collection | DECIMAL(15,2) | B19-B26 |
| Column C | cash | cash | DECIMAL(15,2) | C19-C26 |
| Column D | bill | bill | DECIMAL(15,2) | D19-D26 |
| Column E | card | card | DECIMAL(15,2) | E19-E26 |
| Column F | etc1 | etc1 | DECIMAL(15,2) | F19-F26 |
| Column G | etc2 | etc2 | DECIMAL(15,2) | G19-G26 |
| Column M | prev_balance | prev_balance | DECIMAL(15,2) | M19-M26 |
| Column N | current_sales | current_sales | DECIMAL(15,2) | N19-N26 |
| Column O | ar_balance | ar_balance | DECIMAL(15,2) | O19-O26 |

**Sample SQL:**
```sql
CREATE TABLE ilbo_collections (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INT,
    month INT,
    day INT,
    branch VARCHAR(100) NOT NULL,
    total_collection DECIMAL(15,2) DEFAULT 0,
    cash DECIMAL(15,2) DEFAULT 0,
    bill DECIMAL(15,2) DEFAULT 0,
    card DECIMAL(15,2) DEFAULT 0,
    etc1 DECIMAL(15,2) DEFAULT 0,
    etc2 DECIMAL(15,2) DEFAULT 0,
    prev_balance DECIMAL(15,2) DEFAULT 0,
    current_sales DECIMAL(15,2) DEFAULT 0,
    ar_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, branch)
);
```

---

### 2.3 자금DB (Funds DB)

**Excel Location:** Rows 32-35, Sheet "일보"

**Fund Type Order:**
1. Row 32: 전잔 (Previous Balance)
2. Row 33: 당입 (Current Deposit)
3. Row 34: 지출 (Withdrawal)
4. Row 35: 현잔 (Current Balance)

**Column Mappings (for each fund type row):**

| Excel Column | JSON Field | SQL Field | Data Type | Cell Location |
|-------------|-----------|-----------|-----------|---------------|
| Column B | general_deposit | general_deposit | DECIMAL(15,2) | B32-B35 |
| Column C | electronic_bill | electronic_bill | DECIMAL(15,2) | C32-C35 |
| Column D | loans | loans | DECIMAL(15,2) | D32-D35 |
| Column E | receivable_bill | receivable_bill | DECIMAL(15,2) | E32-E35 |
| Column F | savings_insurance | savings_insurance | DECIMAL(15,2) | F32-F35 |
| Column G | cma | cma | DECIMAL(15,2) | G32-G35 |
| Column H | foreign_usd | foreign_usd | DECIMAL(15,2) | H32-H35 |
| Column I | foreign_eur | foreign_eur | DECIMAL(15,2) | I32-I35 |
| Column J | foreign_jpy | foreign_jpy | DECIMAL(15,2) | J32-J35 |
| Column K | foreign_usd_normal | foreign_usd_normal | DECIMAL(15,2) | K32-K35 |
| Column L | credit_limit | credit_limit | DECIMAL(15,2) | L32-L35 |
| Column M | short_term_loan | short_term_loan | DECIMAL(15,2) | M32-M35 |
| Column N | long_term_loan | long_term_loan | DECIMAL(15,2) | N32-N35 |
| Column O | retirement_pension | retirement_pension | DECIMAL(15,2) | O32-O35 |

**Sample SQL:**
```sql
CREATE TABLE ilbo_funds (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INT,
    month INT,
    day INT,
    fund_type VARCHAR(20) NOT NULL, -- 전잔/당입/지출/현잔
    general_deposit DECIMAL(15,2) DEFAULT 0,
    electronic_bill DECIMAL(15,2) DEFAULT 0,
    loans DECIMAL(15,2) DEFAULT 0,
    receivable_bill DECIMAL(15,2) DEFAULT 0,
    savings_insurance DECIMAL(15,2) DEFAULT 0,
    cma DECIMAL(15,2) DEFAULT 0,
    foreign_usd DECIMAL(15,2) DEFAULT 0,
    foreign_eur DECIMAL(15,2) DEFAULT 0,
    foreign_jpy DECIMAL(15,2) DEFAULT 0,
    foreign_usd_normal DECIMAL(15,2) DEFAULT 0,
    credit_limit DECIMAL(15,2) DEFAULT 0,
    short_term_loan DECIMAL(15,2) DEFAULT 0,
    long_term_loan DECIMAL(15,2) DEFAULT 0,
    retirement_pension DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, fund_type)
);
```

---

### 2.4 주요비용DB (Major Expenses DB)

**Excel Location:** Rows 43-52, Sheet "일보"

**Column Mappings:**

| Excel Column | JSON Field | SQL Field | Data Type | Cell Location |
|-------------|-----------|-----------|-----------|---------------|
| Column E | client | client_name | VARCHAR(200) | E43-E52 |
| Column F | amount | amount | DECIMAL(15,2) | F43-F52 |
| Column G | description | description | TEXT | G43-G52 |

**Note:** Only rows with non-null client and amount are included.

**Sample SQL:**
```sql
CREATE TABLE ilbo_major_expenses (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INT,
    month INT,
    day INT,
    client_name VARCHAR(200) NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.5 모빌결제DB (Mobil Payments DB)

**Excel Location:** Rows 44-51, Sheet "일보"

**Branch/Row Mapping:**
1. Row 44: 화성 IL
2. Row 45: 창원 IL
3. Row 46: 화성 AUTO (중부)
4. Row 47: 남부지사
5. Row 48: 인천(서부)
6. Row 49: 남양주(동부)
7. Row 50: 제주
8. Row 51: 부산

**Column Mappings (for each branch row):**

| Excel Column | JSON Field | SQL Field | Data Type | Cell Location |
|-------------|-----------|-----------|-----------|---------------|
| Column K | il | il_payment | DECIMAL(15,2) | K44-K51 |
| Column L | auto | auto_payment | DECIMAL(15,2) | L44-L51 |
| Column M | mbk | mbk_payment | DECIMAL(15,2) | M44-M51 |
| Column N | total | total_payment | DECIMAL(15,2) | N44-N51 |

**Sample SQL:**
```sql
CREATE TABLE ilbo_mobil_payments (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INT,
    month INT,
    day INT,
    branch VARCHAR(100) NOT NULL,
    il_payment DECIMAL(15,2) DEFAULT 0,
    auto_payment DECIMAL(15,2) DEFAULT 0,
    mbk_payment DECIMAL(15,2) DEFAULT 0,
    total_payment DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, branch)
);
```

---

### 2.6 일별합계DB (Daily Totals DB)

**Aggregated Data (calculated from above tables)**

**Sample SQL:**
```sql
CREATE TABLE ilbo_daily_totals (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    year INT,
    month INT,
    day INT,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_sell_out DECIMAL(15,2) DEFAULT 0,
    total_collection DECIMAL(15,2) DEFAULT 0,
    total_ar_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Pipeline 3: Branch Daily Reports

> ⚠️ **WARNING: NOT CURRENTLY USED IN DASHBOARD**
> 
> This pipeline outputs to `dashboard.json` but this file is **NOT imported or used** by any React component.
> The dashboard currently uses only Pipeline 1 (`basic_sheets.json`) and Pipeline 2 (`daily_reports.json`).
> 
> **Status:**
> - ❌ Files not present in workspace (`Basic_Sheet/` folder doesn't exist)
> - ❌ Output (`dashboard.json`) not imported in any component
> - ⚠️ Can be safely ignored for SQL implementation
> 
> This section is kept for reference only.

---

Source: `data_pipeline.py`

**File Pattern:** `*일일매출수금*현황*.xlsx`

**Sheet Name:** MMDD format (e.g., "1101" for November 1st)

---

### 3.1 Branch Sales Data

**Excel Locations:**

| Cell | JSON Field | SQL Field | Data Type | Description |
|------|-----------|-----------|-----------|-------------|
| A2 | date | report_date | DATE | Report date (extracted from cell) |
| F9 | total_sales | total_sales | DECIMAL(15,2) | Total sales |
| F4 | mobil_sell_out | mobil_sell_out | DECIMAL(15,2) | Mobil sell-out |
| K9 | sell_out_total_l | sell_out_total_l | DECIMAL(15,2) | Sell-out Total (Liters) |
| M4 | sell_out_flagship_l | sell_out_flagship_l | DECIMAL(15,2) | Sell-out Flagship (Liters) |

**Sample SQL:**
```sql
CREATE TABLE branch_daily_sales (
    id SERIAL PRIMARY KEY,
    report_date DATE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    total_sales DECIMAL(15,2) DEFAULT 0,
    mobil_sell_out DECIMAL(15,2) DEFAULT 0,
    sell_out_total_l DECIMAL(15,2) DEFAULT 0,
    sell_out_flagship_l DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_date, branch)
);
```

---

### 3.2 Branch Collections Data

**Excel Locations:**

| Cell | JSON Field | SQL Field | Data Type | Description |
|------|-----------|-----------|-----------|-------------|
| A2 | date | report_date | DATE | Report date |
| F13 | total_collection | total_collection | DECIMAL(15,2) | Total collection |
| F10 | cash | cash | DECIMAL(15,2) | Cash collection |
| F11 | bill | bill | DECIMAL(15,2) | Bill collection |
| F12 | card | card | DECIMAL(15,2) | Card collection |

**Sample SQL:**
```sql
CREATE TABLE branch_daily_collections (
    id SERIAL PRIMARY KEY,
    report_date DATE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    total_collection DECIMAL(15,2) DEFAULT 0,
    cash DECIMAL(15,2) DEFAULT 0,
    bill DECIMAL(15,2) DEFAULT 0,
    card DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_date, branch)
);
```

---

## SQL Schema Examples

### Complete Database Schema

```sql
-- Enable UUID extension (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- BASIC SHEET TABLES
-- ========================================

-- Sales transactions
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    branch_group VARCHAR(100),
    customer_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(50),
    item_name VARCHAR(300),
    quantity DECIMAL(15,2) DEFAULT 0,
    weight DECIMAL(15,2) DEFAULT 0,
    supply_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, customer_name, item_code)
);

CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_branch ON sales(branch_group);
CREATE INDEX idx_sales_customer ON sales(customer_name);

-- Purchases transactions
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    vendor_code VARCHAR(50),
    vendor_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(50),
    item_name VARCHAR(300),
    quantity DECIMAL(15,2) DEFAULT 0,
    weight DECIMAL(15,2) DEFAULT 0,
    supply_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, vendor_name, item_code)
);

CREATE INDEX idx_purchases_date ON purchases(date);
CREATE INDEX idx_purchases_vendor ON purchases(vendor_name);

-- ========================================
-- ILBO TABLES
-- ========================================

-- ILBO Sales by branch
CREATE TABLE ilbo_sales (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INT,
    month INT,
    day INT,
    branch VARCHAR(100) NOT NULL,
    total_sales DECIMAL(15,2) DEFAULT 0,
    mobil_sell_out DECIMAL(15,2) DEFAULT 0,
    sell_out_total_l DECIMAL(15,2) DEFAULT 0,
    sell_out_flagship_l DECIMAL(15,2) DEFAULT 0,
    sell_in_total_l DECIMAL(15,2) DEFAULT 0,
    sell_in_flagship_l DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, branch)
);

CREATE INDEX idx_ilbo_sales_date ON ilbo_sales(date);
CREATE INDEX idx_ilbo_sales_branch ON ilbo_sales(branch);
CREATE INDEX idx_ilbo_sales_year_month ON ilbo_sales(year, month);

-- ILBO Collections by branch
CREATE TABLE ilbo_collections (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INT,
    month INT,
    day INT,
    branch VARCHAR(100) NOT NULL,
    total_collection DECIMAL(15,2) DEFAULT 0,
    cash DECIMAL(15,2) DEFAULT 0,
    bill DECIMAL(15,2) DEFAULT 0,
    card DECIMAL(15,2) DEFAULT 0,
    etc1 DECIMAL(15,2) DEFAULT 0,
    etc2 DECIMAL(15,2) DEFAULT 0,
    prev_balance DECIMAL(15,2) DEFAULT 0,
    current_sales DECIMAL(15,2) DEFAULT 0,
    ar_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, branch)
);

CREATE INDEX idx_ilbo_collections_date ON ilbo_collections(date);
CREATE INDEX idx_ilbo_collections_branch ON ilbo_collections(branch);

-- ========================================
-- VIEWS FOR REPORTING
-- ========================================

-- Daily sales summary
CREATE VIEW v_daily_sales_summary AS
SELECT 
    date,
    SUM(total_amount) as total_sales,
    COUNT(*) as transaction_count,
    COUNT(DISTINCT customer_name) as unique_customers
FROM sales
GROUP BY date
ORDER BY date DESC;

-- Branch performance
CREATE VIEW v_branch_performance AS
SELECT 
    branch,
    date,
    total_sales,
    mobil_sell_out,
    total_collection,
    ar_balance,
    ROUND((total_collection::DECIMAL / NULLIF(total_sales, 0)) * 100, 2) as collection_rate
FROM ilbo_sales s
JOIN ilbo_collections c USING (date, branch)
ORDER BY date DESC, branch;
```

---

## Data Import Notes

### Date Format Handling
- Excel dates may come in formats: `YYYY-MM-DD`, `YYYY/MM/DD`, or Excel serial numbers
- Date validation regex used: `^\d{4}[/\-]\d{2}[/\-]\d{2}`
- Dates are normalized to `YYYY-MM-DD` format

### Numeric Values
- All amounts use `DECIMAL(15,2)` for precision
- NULL values converted to `0.0`
- Invalid values (non-numeric) converted to `0.0`

### String Handling
- All strings stored as UTF-8
- Trim whitespace before insert
- Empty strings stored as NULL

### Deduplication Strategy
- **Transaction types:** Keep first occurrence (DISTINCT ON + ORDER BY file_datetime)
- **Snapshot types:** Use only latest file by datetime
- Use `ON CONFLICT ... DO NOTHING` or `DO UPDATE` based on business rules

---

## Sample ETL Script (Python + SQLAlchemy)

```python
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.dialects.postgresql import insert
import pandas as pd
import json

# Database connection
engine = create_engine('postgresql://user:password@localhost/database')
metadata = MetaData()

# Load JSON data
with open('basic_sheets.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Insert sales data with upsert
sales_records = data['data']['sales']['records']
df = pd.DataFrame(sales_records)

# Rename columns to match SQL schema
df = df.rename(columns={
    '일자': 'date',
    '거래처그룹1코드명': 'branch_group',
    '판매처명': 'customer_name',
    '품목코드': 'item_code',
    '품목명(규격)': 'item_name',
    '수량': 'quantity',
    '중량': 'weight',
    '공급가액': 'supply_amount',
    '합 계': 'total_amount'
})

# Insert with upsert (PostgreSQL)
df.to_sql('sales', engine, if_exists='append', index=False, method='multi')

print(f"Inserted {len(df)} sales records")
```

---

## Validation Queries

```sql
-- Check for duplicate keys in sales
SELECT date, customer_name, item_code, COUNT(*)
FROM sales
GROUP BY date, customer_name, item_code
HAVING COUNT(*) > 1;

-- Check date ranges
SELECT 
    MIN(date) as earliest_date,
    MAX(date) as latest_date,
    COUNT(DISTINCT date) as unique_dates
FROM sales;

-- Check for NULL critical fields
SELECT COUNT(*) FROM sales WHERE customer_name IS NULL;
SELECT COUNT(*) FROM sales WHERE date IS NULL;

-- Summary by date
SELECT 
    date,
    COUNT(*) as transactions,
    SUM(total_amount) as total
FROM sales
GROUP BY date
ORDER BY date DESC
LIMIT 10;
```

---

## Maintenance

### Regular Tasks
1. **Vacuum analyze** tables weekly for performance
2. **Backup** before major ETL runs
3. **Archive** old data (> 2 years) to historical tables
4. **Monitor** duplicate key violations

### Performance Optimization
- Partition large tables by date (monthly/yearly)
- Create covering indexes for common queries
- Use materialized views for aggregated reports
- Consider read replicas for reporting queries

---

## Contact & Support

For questions about this mapping or SQL implementation:
- Review `parse_basic_sheets.py`, `parse_daily_reports.py`, `data_pipeline.py`
- Check `CLAUDE.md` for system architecture
- See `README.md` for general project info
