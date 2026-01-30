# 영일오엔씨 업무 자동화 프로젝트

이카운트 ERP 데이터 기반 일일 매출/수금 현황 대시보드, 웹 자동화 도구, 엑셀 병합기를 포함하는 통합 프로젝트입니다.

## 프로젝트 구성

| 프로젝트 | 경로 | 설명 |
|----------|------|------|
| **Daily Report Dashboard** | `daily-report-dashboard/` | React 19 + Vite 7 대시보드 (매출, 수금, 채권, 자금 등) |
| **PlayWright Codegen Tool** | `PlayWright_codegen_영일0116/` | Playwright 기반 웹 자동화 스크립트 생성/실행 도구 |
| **SheetSTACK** | `Sheet_Stact/` | 엑셀 파일 자동 병합기 (CustomTkinter + watchdog) |

## 설치 및 실행

### 최초 설치
```
Install.bat 더블클릭
```
Node.js 패키지 및 Python 의존성(pandas, openpyxl, python-calamine, watchdog)을 자동 설치합니다.

### 대시보드 실행
```
START.bat 더블클릭
```
- 대시보드 서버 (http://localhost:5173) 자동 시작
- Basic Sheet 폴더 감시 + API 서버 (`--watch` 모드) 자동 시작
- 브라우저 자동 열림

### 요구사항
- **Node.js** 18+
- **Python** 3.8+
- Python 패키지: `pandas`, `openpyxl`, `python-calamine`, `watchdog`

## 프로젝트 구조

```
0101/
├── daily-report-dashboard/       # React 웹 대시보드
│   └── src/
│       ├── components/           # UI 컴포넌트 (BasicSheetView, Charts, Tables)
│       └── data/                 # JSON 데이터 (basic_sheets.json, daily_reports.json)
├── 1_Basic_Sheet/                # 이카운트에서 다운받은 원본 엑셀 파일
│   └── master/                   # 종류별 마스터 엑셀 (자동 생성)
├── ILBO/                         # 일보 원본 파일
├── PlayWright_codegen_영일0116/  # 웹 자동화 도구
├── Sheet_Stact/                  # 엑셀 병합기
├── parse_basic_sheets.py         # Basic Sheet 파싱 파이프라인 (메인)
├── parse_daily_reports.py        # ILBO 일보 파싱 파이프라인
├── data_pipeline.py              # 사업소별 일일매출수금 파이프라인
├── api_server.py                 # API 서버 (독립 실행용)
├── Install.bat                   # 설치 스크립트
├── START.bat                     # 실행 스크립트 (대시보드 + watch 모드)
├── CLAUDE.md                     # Claude Code 가이드
└── README.md
```

## 데이터 파이프라인

### Pipeline 1: Basic Sheet (메인 — 자동 감시)
```
1_Basic_Sheet/*.xlsx
    ↓ generate_master_excels()
1_Basic_Sheet/master/{종류}_master.xlsx  (종류별 마스터 엑셀)
    ↓ main() — JSON 생성
daily-report-dashboard/src/data/basic_sheets.json
    ↓
대시보드 표시 (11개 탭)
```

**지원 시트 종류 (11종):**

| 종류 | 타입 | 대시보드 탭 |
|------|------|-------------|
| 판매현황 | 거래 | 판매현황 |
| 구매현황 | 거래 | 구매현황 |
| 채권현황 | 스냅샷 | 채권현황 |
| 경영요약보고서 | 스냅샷 | 경영요약 |
| 수금현황 | 거래 | 수금현황 |
| 지급현황 | 거래 | 지급현황 |
| 입금보고서집계 | 거래 | 입금집계 |
| 받을어음감소현황 | 거래 | 어음감소 |
| 받을어음증가현황 | 거래 | 어음증가 |
| 자금일보 | 스냅샷 | 자금일보 |
| 입금보고서 | 거래 | 입금보고서 |

**실행 방법:**
```bash
# 자동 감시 모드 (START.bat에 포함)
python parse_basic_sheets.py --watch

# 수동 실행
python parse_basic_sheets.py

# 캐시 무시 강제 실행
python parse_basic_sheets.py --force
```

**마스터 엑셀 생성 로직:**
- **거래 데이터**: 모든 파일 병합 → 날짜 정규화 → 중복 제거(최신 파일 우선) → 날짜순 정렬
- **스냅샷 데이터**: 최신 파일만 사용

### Pipeline 2: ILBO 일보
```
ILBO/*.xlsx → parse_daily_reports.py → daily_reports.json + 영일오엔씨_마스터DB.xlsx
```

### Pipeline 3: 사업소별 일일매출수금
```
Basic_Sheet/*일일매출수금*현황*.xlsx → data_pipeline.py → dashboard.json
```

## 대시보드 기능

### 기본시트 뷰 (BasicSheetView)
- 11개 데이터 탭 전환
- 테이블 정렬/필터링/CSV 내보내기
- 수동 갱신 버튼 (API 서버 연동)
- 롤백 기능 (최대 10개 백업)

### 일보 뷰 (App)
- 날짜/사업소별 필터링
- 매출, 수금, 외상잔액, 자금 차트
- 캘린더 모달 (일계/월누계 토글)

## API 서버

`--watch` 모드 실행 시 포트 5174에서 API 서버가 자동 시작됩니다.

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/refresh` | 데이터 수동 갱신 |
| `GET /api/rollback?file={filename}` | 특정 백업으로 롤백 |
| `GET /api/backups` | 백업 목록 조회 |

Vite 개발 서버에서 `/api` 경로는 자동으로 프록시됩니다.

## 사업소 목록

화성IL, 서울, 창원, 화성auto(남부), 화성auto(중부), 인천(서부), 남양주(동부), 제주, 부산

## 한글 용어

| 한글 | English |
|------|---------|
| 사업소 | Branch |
| 총매출 | Total Sales |
| 수금 | Collections |
| 미수잔액 | AR Balance (Accounts Receivable) |
| 채권 | Receivables |
| 입금/출금 | Deposit/Withdrawal |
| 전잔/당입/지출/현잔 | Previous/Deposit/Withdraw/Current Balance |
| 일보 | Daily Report |
| 경영요약보고서 | Management Summary Report |
| 받을어음 | Notes Receivable |
| 자금일보 | Daily Fund Report |

## 기술 스택

- **Frontend**: React 19 + Vite 7 + Recharts
- **Backend**: Python (pandas, openpyxl, python-calamine, watchdog)
- **API**: Python HTTPServer (포트 5174)
- **자동화**: Playwright + Tkinter GUI
- **엑셀 병합**: CustomTkinter + watchdog
