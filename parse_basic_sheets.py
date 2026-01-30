# -*- coding: utf-8 -*-
"""
1_Basic_Sheet 엑셀 파일 파싱 및 병합 스크립트
- Sheet_Stact 로직 활용하여 같은 종류의 파일들을 병합
- 대시보드용 JSON 생성
"""

import pandas as pd
import json
import os
import re
import hashlib
import shutil
from datetime import datetime
from collections import defaultdict

BASE_PATH = r'C:\Users\JS\Desktop\0101\1_Basic_Sheet'
OUTPUT_PATH = r'C:\Users\JS\Desktop\0101\daily-report-dashboard\src\data'
CACHE_PATH = os.path.join(BASE_PATH, '.basic_sheet_cache.json')
BACKUP_DIR = os.path.join(OUTPUT_PATH, 'backups')


def get_folder_snapshot(folder_path):
    """폴더 내 엑셀 파일들의 수정시간+크기 스냅샷 생성"""
    snapshot = {}
    for f in sorted(os.listdir(folder_path)):
        if f.endswith(('.xlsx', '.xls')) and not f.startswith('~'):
            fp = os.path.join(folder_path, f)
            stat = os.stat(fp)
            snapshot[f] = f"{stat.st_mtime:.6f}_{stat.st_size}"
    return snapshot


def has_folder_changed(folder_path):
    """캐시와 비교하여 폴더 내 파일 변경 여부 확인. 변경 시 True 반환."""
    current = get_folder_snapshot(folder_path)
    current_hash = hashlib.md5(json.dumps(current, sort_keys=True).encode()).hexdigest()

    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, 'r', encoding='utf-8') as f:
                cache = json.load(f)
            if cache.get('hash') == current_hash:
                return False  # 변경 없음
        except (json.JSONDecodeError, KeyError):
            pass  # 캐시 손상 → 변경된 것으로 처리

    return True


def save_folder_cache(folder_path):
    """현재 폴더 스냅샷을 캐시에 저장"""
    current = get_folder_snapshot(folder_path)
    current_hash = hashlib.md5(json.dumps(current, sort_keys=True).encode()).hexdigest()
    with open(CACHE_PATH, 'w', encoding='utf-8') as f:
        json.dump({'hash': current_hash, 'updated_at': datetime.now().isoformat()}, f)


def backup_current_json():
    """현재 basic_sheets.json을 타임스탬프 백업으로 저장. 최대 10개 유지."""
    json_path = os.path.join(OUTPUT_PATH, 'basic_sheets.json')
    if not os.path.exists(json_path):
        return None

    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_name = f'basic_sheets_{timestamp}.json'
    backup_path = os.path.join(BACKUP_DIR, backup_name)
    shutil.copy2(json_path, backup_path)

    # 오래된 백업 정리 (최대 10개)
    backups = sorted(
        [f for f in os.listdir(BACKUP_DIR) if f.startswith('basic_sheets_') and f.endswith('.json')],
        reverse=True
    )
    for old in backups[10:]:
        os.remove(os.path.join(BACKUP_DIR, old))

    return backup_name


def list_backups():
    """사용 가능한 백업 목록 반환"""
    if not os.path.exists(BACKUP_DIR):
        return []
    backups = sorted(
        [f for f in os.listdir(BACKUP_DIR) if f.startswith('basic_sheets_') and f.endswith('.json')],
        reverse=True
    )
    result = []
    for b in backups:
        fp = os.path.join(BACKUP_DIR, b)
        stat = os.stat(fp)
        # 파일명에서 타임스탬프 추출: basic_sheets_YYYYMMDD_HHMMSS.json
        ts = b.replace('basic_sheets_', '').replace('.json', '')
        result.append({
            'filename': b,
            'timestamp': ts,
            'size': stat.st_size,
        })
    return result


def rollback(filename):
    """지정된 백업 파일로 복원"""
    backup_path = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(backup_path):
        return False, f"백업 파일 없음: {filename}"

    json_path = os.path.join(OUTPUT_PATH, 'basic_sheets.json')

    # 현재 파일도 백업 (롤백 전 안전망)
    backup_current_json()

    shutil.copy2(backup_path, json_path)
    return True, f"복원 완료: {filename}"

# 파일 종류별 설정
FILE_CONFIGS = {
    '판매현황': {
        'skiprows': 1,
        'key_columns': ['일자', '거래처그룹1코드명', '판매처명', '품목명(규격)', '수량', '공급가액', '합 계'],
        'date_column': '일자',
        'amount_columns': ['수량', '중량', '공급가액', '합 계'],
    },
    '구매현황': {
        'skiprows': 1,
        'key_columns': ['일자', '거래처코드', '구매처명', '품목명', '수량', '공급가액', '합 계'],
        'date_column': '일자',
        'amount_columns': ['수량', '중량', '공급가액', '합 계'],
    },
    '채권현황': {
        'skiprows': 1,
        'key_columns': ['거래처코드', '거래처그룹1명', '담당자명', '거래처명', '청구금액', '미청구금액', '합계'],
        'date_column': None,
        'amount_columns': ['청구금액', '미청구금액', '합계'],
    },
    '경영요약보고서': {
        'skiprows': 1,
        'key_columns': None,  # 특수 처리 필요
        'date_column': None,
        'amount_columns': [],
    },
    '수금현황': {
        'skiprows': 1,
        'key_columns': ['일자-No.', '거래처명', '금액', '적요'],
        'date_column': '일자-No.',
        'amount_columns': ['금액'],
    },
    '지급현황': {
        'skiprows': 1,
        'key_columns': ['일자-No.', '거래처명', '금액', '적요'],
        'date_column': '일자-No.',
        'amount_columns': ['금액'],
    },
    '입금보고서집계': {
        'skiprows': 1,
        'key_columns': ['전표번호', '거래처명', '금액', '적요'],
        'date_column': '전표번호',
        'amount_columns': ['금액'],
    },
    '받을어음감소현황': {
        'skiprows': 1,
        'key_columns': ['날짜', '어음번호', '거래처번호', '거래처명', '어음금액', '만기', '잔액'],
        'date_column': '날짜',
        'amount_columns': ['어음금액', '잔액'],
        'dedup_columns': ['날짜', '어음번호'],
        'type': 'transaction',
    },
    '받을어음증가현황': {
        'skiprows': 1,
        'key_columns': ['날짜', '거래처번호', '어음번호', '거래처명', '어음금액', '만기', '어음기한만료', '잔액'],
        'date_column': '날짜',
        'amount_columns': ['어음금액', '잔액'],
        'dedup_columns': ['날짜', '어음번호'],
        'type': 'transaction',
    },
    '자금일보': {
        'skiprows': 1,
        'key_columns': None,
        'date_column': None,
        'amount_columns': [],
        'type': 'snapshot',
    },
    '입금보고서': {
        'skiprows': 1,
        'key_columns': ['급여번호', '날짜', '거래처명', '계좌', '잔액', '이체일자', '입금내용'],
        'date_column': '날짜',
        'amount_columns': ['잔액'],
        'dedup_columns': ['급여번호', '날짜'],
        'type': 'transaction',
    },
}

MASTER_DIR = os.path.join(BASE_PATH, 'master')


def extract_datetime_from_filename(filename):
    """파일명에서 날짜/시간 추출"""
    patterns = [
        (r'(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})',
         lambda m: datetime(int(m[0]), int(m[1]), int(m[2]), int(m[3]), int(m[4]), int(m[5]))),
        (r'_(\d{13})',  # Unix timestamp in milliseconds
         lambda m: datetime.fromtimestamp(int(m[0]) / 1000)),
    ]
    for pattern, parser in patterns:
        match = re.search(pattern, filename)
        if match:
            try:
                return parser(match.groups())
            except (ValueError, OSError):
                continue
    return datetime.now()


def extract_prefix(filename):
    """파일명에서 접두어(종류) 추출"""
    name_without_ext = os.path.splitext(filename)[0]
    # 숫자나 언더스코어+숫자 앞까지 추출
    match = re.match(r'^([가-힣a-zA-Z]+)', name_without_ext)
    if match:
        return match.group(1)
    return name_without_ext


def group_files_by_prefix(folder_path):
    """폴더 내 파일들을 종류별로 그룹화"""
    groups = defaultdict(list)

    excel_files = [f for f in os.listdir(folder_path)
                   if f.endswith(('.xlsx', '.xls')) and not f.startswith('~')]

    for filename in excel_files:
        prefix = extract_prefix(filename)
        file_time = extract_datetime_from_filename(filename)
        groups[prefix].append({
            'filename': filename,
            'filepath': os.path.join(folder_path, filename),
            'datetime': file_time
        })

    # 날짜순 정렬 (최신순)
    for prefix in groups:
        groups[prefix].sort(key=lambda x: x['datetime'], reverse=True)

    return dict(groups)


def clean_dataframe(df, date_column=None):
    """데이터 정리 - 빈 행, 합계 행 제거"""
    if df.empty:
        return df

    # 완전히 빈 행 제거
    df = df.dropna(how='all')

    # 첫 번째 컬럼이 NaN인 행 제거
    if len(df.columns) > 0:
        first_col = df.columns[0]
        df = df[df[first_col].notna()]

    # 날짜 컬럼이 있으면 날짜 형식 검증 및 정규화
    if date_column and date_column in df.columns:
        date_pattern = r'^\d{4}[/\-]\d{2}[/\-]\d{2}'
        df = df[df[date_column].astype(str).str.match(date_pattern, na=False)]
        # 날짜 정규화: "2026/01/19 (일) 오전 1:00:47" → "2026/01/19"
        df[date_column] = df[date_column].astype(str).str.extract(r'^(\d{4}[/\-]\d{2}[/\-]\d{2})')[0]

    return df.reset_index(drop=True)


def generate_master_excels(file_groups):
    """종류별 마스터 엑셀 생성 — 병합 + 중복 제거 + 날짜순 정렬"""
    os.makedirs(MASTER_DIR, exist_ok=True)
    master_files = {}

    for prefix, file_list in file_groups.items():
        config = FILE_CONFIGS.get(prefix)
        if not config:
            print(f"  [{prefix}] 설정 없음 — 건너뜀")
            continue

        is_snapshot = config.get('type') == 'snapshot' or prefix in ('채권현황', '경영요약보고서', '자금일보')
        master_path = os.path.join(MASTER_DIR, f'{prefix}_master.xlsx')

        if is_snapshot:
            # 스냅샷: 최신 파일만 복사
            latest = file_list[0]
            shutil.copy2(latest['filepath'], master_path)
            master_files[prefix] = master_path
            print(f"  [{prefix}] 스냅샷 → 최신 파일 복사 ({latest['filename']})")
            continue

        # 거래 데이터: 모든 파일 병합
        all_dfs = []
        skiprows = config.get('skiprows', 1)
        date_col = config.get('date_column')

        for file_info in file_list:  # 최신순 정렬되어 있음
            try:
                df = pd.read_excel(file_info['filepath'], engine='calamine', skiprows=skiprows)
                df = clean_dataframe(df, date_col)
                if not df.empty:
                    df['_source_file'] = file_info['filename']
                    df['_file_datetime'] = file_info['datetime'].isoformat()
                    all_dfs.append(df)
            except Exception as e:
                print(f"  [{prefix}] 읽기 오류 {file_info['filename']}: {e}")

        if not all_dfs:
            print(f"  [{prefix}] 데이터 없음")
            continue

        merged = pd.concat(all_dfs, ignore_index=True)

        # 중복 제거: config에 dedup_columns가 있으면 사용, 없으면 기존 로직
        dedup_cols = config.get('dedup_columns')
        if not dedup_cols:
            # 기존 방식: 판매현황은 [일자, 판매처명, 품목코드] 등
            if prefix == '판매현황':
                dedup_cols = ['일자', '판매처명', '품목코드']
            elif prefix == '구매현황':
                dedup_cols = ['일자', '구매처명', '품목코드']
            else:
                dedup_cols = config.get('key_columns')

        if dedup_cols:
            existing = [c for c in dedup_cols if c in merged.columns]
            if existing:
                before = len(merged)
                merged = merged.drop_duplicates(subset=existing, keep='first')
                removed = before - len(merged)
                if removed:
                    print(f"  [{prefix}] 중복 제거: {removed}건")

        # 날짜순 정렬
        if date_col and date_col in merged.columns:
            merged = merged.sort_values(date_col).reset_index(drop=True)

        # _source_file, _file_datetime 제거 후 저장
        out_cols = [c for c in merged.columns if not c.startswith('_')]
        merged[out_cols].to_excel(master_path, index=False, engine='openpyxl')
        master_files[prefix] = master_path
        print(f"  [{prefix}] 마스터 생성: {len(merged)}건 → {prefix}_master.xlsx")

    return master_files


def safe_float(val):
    """안전하게 float 변환"""
    if pd.isna(val):
        return 0.0
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0


def parse_sales_data(file_list):
    """판매현황 데이터 병합 및 파싱"""
    all_data = []

    for file_info in file_list:
        try:
            df = pd.read_excel(file_info['filepath'], engine='calamine', skiprows=1)
            df = clean_dataframe(df, '일자')

            if not df.empty:
                df['source_file'] = file_info['filename']
                df['file_datetime'] = file_info['datetime'].isoformat()
                all_data.append(df)
        except Exception as e:
            print(f"Error reading {file_info['filename']}: {e}")

    if not all_data:
        return {'records': [], 'summary': {}}

    merged_df = pd.concat(all_data, ignore_index=True)

    # 중복 제거 (같은 날짜, 거래처, 품목)
    if '일자' in merged_df.columns and '판매처명' in merged_df.columns and '품목코드' in merged_df.columns:
        merged_df = merged_df.drop_duplicates(subset=['일자', '판매처명', '품목코드'], keep='first')

    # 요약 통계
    summary = {
        'total_records': len(merged_df),
        'total_amount': safe_float(merged_df['합 계'].sum()) if '합 계' in merged_df.columns else 0,
        'total_supply': safe_float(merged_df['공급가액'].sum()) if '공급가액' in merged_df.columns else 0,
        'by_branch': {},
        'by_date': {},
    }

    # 사업소별 집계
    if '거래처그룹1코드명' in merged_df.columns:
        branch_summary = merged_df.groupby('거래처그룹1코드명').agg({
            '합 계': 'sum',
            '공급가액': 'sum',
            '수량': 'sum'
        }).reset_index()
        for _, row in branch_summary.iterrows():
            summary['by_branch'][row['거래처그룹1코드명']] = {
                'total': safe_float(row['합 계']),
                'supply': safe_float(row['공급가액']),
                'quantity': safe_float(row['수량'])
            }

    # 날짜별 집계
    if '일자' in merged_df.columns:
        date_summary = merged_df.groupby('일자').agg({
            '합 계': 'sum',
            '공급가액': 'sum'
        }).reset_index()
        for _, row in date_summary.iterrows():
            summary['by_date'][str(row['일자'])] = {
                'total': safe_float(row['합 계']),
                'supply': safe_float(row['공급가액'])
            }

    # DataFrame을 JSON 직렬화 가능한 형태로 변환
    records = []
    for _, row in merged_df.iterrows():
        record = {}
        for col in merged_df.columns:
            val = row[col]
            if pd.isna(val):
                record[col] = None
            elif isinstance(val, (int, float)):
                record[col] = float(val) if not pd.isna(val) else 0
            else:
                record[col] = str(val)
        records.append(record)

    return {'records': records, 'summary': summary}


def parse_purchase_data(file_list):
    """구매현황 데이터 병합 및 파싱"""
    all_data = []

    for file_info in file_list:
        try:
            df = pd.read_excel(file_info['filepath'], engine='calamine', skiprows=1)
            df = clean_dataframe(df, '일자')

            if not df.empty:
                df['source_file'] = file_info['filename']
                df['file_datetime'] = file_info['datetime'].isoformat()
                all_data.append(df)
        except Exception as e:
            print(f"Error reading {file_info['filename']}: {e}")

    if not all_data:
        return {'records': [], 'summary': {}}

    merged_df = pd.concat(all_data, ignore_index=True)

    # 중복 제거
    if '일자' in merged_df.columns and '구매처명' in merged_df.columns and '품목코드' in merged_df.columns:
        merged_df = merged_df.drop_duplicates(subset=['일자', '구매처명', '품목코드'], keep='first')

    summary = {
        'total_records': len(merged_df),
        'total_amount': safe_float(merged_df['합 계'].sum()) if '합 계' in merged_df.columns else 0,
        'total_supply': safe_float(merged_df['공급가액'].sum()) if '공급가액' in merged_df.columns else 0,
        'by_vendor': {},
    }

    # 공급업체별 집계
    if '구매처명' in merged_df.columns:
        vendor_summary = merged_df.groupby('구매처명').agg({
            '합 계': 'sum'
        }).reset_index()
        for _, row in vendor_summary.iterrows():
            summary['by_vendor'][row['구매처명']] = safe_float(row['합 계'])

    records = []
    for _, row in merged_df.iterrows():
        record = {}
        for col in merged_df.columns:
            val = row[col]
            if pd.isna(val):
                record[col] = None
            elif isinstance(val, (int, float)):
                record[col] = float(val) if not pd.isna(val) else 0
            else:
                record[col] = str(val)
        records.append(record)

    return {'records': records, 'summary': summary}


def parse_receivables_data(file_list):
    """채권현황 데이터 파싱 (최신 파일만 사용 - 스냅샷 데이터)"""
    if not file_list:
        return {'records': [], 'summary': {}}

    # 최신 파일만 사용
    latest_file = file_list[0]

    try:
        df = pd.read_excel(latest_file['filepath'], engine='calamine', skiprows=1)
        df = clean_dataframe(df)
    except Exception as e:
        print(f"Error reading {latest_file['filename']}: {e}")
        return {'records': [], 'summary': {}}

    if df.empty:
        return {'records': [], 'summary': {}}

    summary = {
        'total_records': len(df),
        'total_billed': safe_float(df['청구금액'].sum()) if '청구금액' in df.columns else 0,
        'total_unbilled': safe_float(df['미청구금액'].sum()) if '미청구금액' in df.columns else 0,
        'total': safe_float(df['합계'].sum()) if '합계' in df.columns else 0,
        'by_branch': {},
        'file_date': latest_file['datetime'].isoformat(),
    }

    # 지사별 집계
    if '거래처그룹1명' in df.columns:
        branch_summary = df.groupby('거래처그룹1명').agg({
            '청구금액': 'sum',
            '미청구금액': 'sum',
            '합계': 'sum'
        }).reset_index()
        for _, row in branch_summary.iterrows():
            summary['by_branch'][row['거래처그룹1명']] = {
                'billed': safe_float(row['청구금액']),
                'unbilled': safe_float(row['미청구금액']),
                'total': safe_float(row['합계'])
            }

    records = []
    for _, row in df.iterrows():
        record = {}
        for col in df.columns:
            val = row[col]
            if pd.isna(val):
                record[col] = None
            elif isinstance(val, (int, float)):
                record[col] = float(val) if not pd.isna(val) else 0
            else:
                record[col] = str(val)
        records.append(record)

    return {'records': records, 'summary': summary}


def parse_management_report(file_list):
    """경영요약보고서 파싱 (최신 파일만 사용)"""
    if not file_list:
        return {'sections': [], 'summary': {}}

    latest_file = file_list[0]

    try:
        df = pd.read_excel(latest_file['filepath'], engine='calamine', skiprows=0)
    except Exception as e:
        print(f"Error reading {latest_file['filename']}: {e}")
        return {'sections': [], 'summary': {}}

    # 경영요약보고서는 섹션별로 구분됨
    sections = []
    current_section = None
    current_data = []

    for idx, row in df.iterrows():
        first_cell = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''

        # 섹션 헤더 감지 (숫자 . 로 시작)
        if re.match(r'^\d+\s*\.\s*', first_cell):
            if current_section and current_data:
                sections.append({
                    'name': current_section,
                    'data': current_data
                })
            current_section = first_cell.strip()
            current_data = []
        elif current_section and not first_cell.startswith('회사명'):
            row_data = {}
            for i, val in enumerate(row):
                col_name = df.columns[i] if i < len(df.columns) else f'col_{i}'
                if pd.isna(val):
                    row_data[str(col_name)] = None
                elif isinstance(val, (int, float)):
                    row_data[str(col_name)] = float(val)
                else:
                    row_data[str(col_name)] = str(val)
            if any(v is not None for v in row_data.values()):
                current_data.append(row_data)

    # 마지막 섹션 추가
    if current_section and current_data:
        sections.append({
            'name': current_section,
            'data': current_data
        })

    return {
        'sections': sections,
        'file_date': latest_file['datetime'].isoformat(),
        'summary': {
            'section_count': len(sections)
        }
    }



def parse_simple_list_data(file_list, config_name):
    """
    단순 리스트 형태 데이터 파싱 (수금, 지급, 입금 등)
    공통 컬럼: 날짜(일자/전표번호), 거래처명, 금액, 적요
    """
    if not file_list:
        return {'records': [], 'summary': {}}

    config = FILE_CONFIGS.get(config_name)
    if not config:
        return {'records': [], 'summary': {}}

    all_data = []
    
    # 여러 파일 병합
    for file_info in file_list:
        try:
            df = pd.read_excel(file_info['filepath'], engine='calamine', skiprows=config['skiprows'])
            
            # Key Column 기준 유효행 필터링 (컬럼이 실제로 존재하는지 확인)
            valid_cols = [c for c in config['key_columns'] if c in df.columns]
            if not valid_cols:
                continue

            # 전처리
            df = clean_dataframe(df)

            # 추가 정제: Key Column 값들이 NaN인 행 제거 (예: 거래처명이 없는 메타데이터 행)
            # config['key_columns'] 중 2번째 컬럼(보통 거래처명)이 존재하면 그걸 기준으로 필터링
            if len(config['key_columns']) > 1:
                chk_col = config['key_columns'][1] # 거래처명
                if chk_col in df.columns:
                    df = df.dropna(subset=[chk_col])

            # 날짜 컬럼 정제 (Key column 0번이 주로 날짜)
            date_col = config['date_column']
            if date_col and date_col in df.columns:
                 # 날짜 포맷이 다양할 수 있으므로 문자열 변환
                 df[date_col] = df[date_col].astype(str)

            if not df.empty:
                df['source_file'] = file_info['filename']
                all_data.append(df)
        except Exception as e:
            print(f"Error reading {file_info['filename']}: {e}")

    if not all_data:
        return {'records': [], 'summary': {}}

    merged_df = pd.concat(all_data, ignore_index=True)

    # 중복 제거
    subset_cols = config['key_columns']
    # 존재하는 컬럼만 사용
    subset_cols = [c for c in subset_cols if c in merged_df.columns]
    
    if subset_cols:
        merged_df = merged_df.drop_duplicates(subset=subset_cols, keep='first')

    # 금액 집계
    total_amount = 0
    amount_col = config['amount_columns'][0] if config['amount_columns'] else None
    
    if amount_col and amount_col in merged_df.columns:
        total_amount = safe_float(merged_df[amount_col].sum())
    
    summary = {
        'total_records': len(merged_df),
        'total_amount': total_amount,
    }

    # 레코드 변환
    records = []
    for _, row in merged_df.iterrows():
        record = {}
        for col in merged_df.columns:
            val = row[col]
            if pd.isna(val):
                record[col] = None
            elif isinstance(val, (int, float)):
                record[col] = float(val) if not pd.isna(val) else 0
            else:
                record[col] = str(val)
        records.append(record)

    return {'records': records, 'summary': summary}


def parse_generic_data(file_list, config_name):
    """
    범용 파서 — 신규 시트 종류 처리 (받을어음감소/증가현황, 자금일보, 입금보고서)
    FILE_CONFIGS 설정을 기반으로 동작
    """
    config = FILE_CONFIGS.get(config_name)
    if not config:
        return {'records': [], 'summary': {}}

    is_snapshot = config.get('type') == 'snapshot'

    if is_snapshot:
        # 스냅샷: 최신 파일만 사용
        if not file_list:
            return {'records': [], 'summary': {}}
        latest = file_list[0]
        try:
            df = pd.read_excel(latest['filepath'], engine='calamine', skiprows=config.get('skiprows', 1))
            df = clean_dataframe(df, config.get('date_column'))
        except Exception as e:
            print(f"Error reading {latest['filename']}: {e}")
            return {'records': [], 'summary': {}}

        if df.empty:
            return {'records': [], 'summary': {}}

        records = df_to_records(df)
        summary = {
            'total_records': len(records),
            'file_date': latest['datetime'].isoformat(),
        }
        # 금액 집계
        for amt_col in config.get('amount_columns', []):
            if amt_col in df.columns:
                summary[f'total_{amt_col}'] = safe_float(df[amt_col].sum())
        return {'records': records, 'summary': summary}

    # 거래 데이터: 모든 파일 병합
    all_data = []
    for file_info in file_list:
        try:
            df = pd.read_excel(file_info['filepath'], engine='calamine', skiprows=config.get('skiprows', 1))
            df = clean_dataframe(df, config.get('date_column'))
            if not df.empty:
                df['source_file'] = file_info['filename']
                all_data.append(df)
        except Exception as e:
            print(f"Error reading {file_info['filename']}: {e}")

    if not all_data:
        return {'records': [], 'summary': {}}

    merged_df = pd.concat(all_data, ignore_index=True)

    # 중복 제거
    dedup_cols = config.get('dedup_columns') or config.get('key_columns')
    if dedup_cols:
        existing = [c for c in dedup_cols if c in merged_df.columns]
        if existing:
            merged_df = merged_df.drop_duplicates(subset=existing, keep='first')

    # 날짜순 정렬
    date_col = config.get('date_column')
    if date_col and date_col in merged_df.columns:
        merged_df = merged_df.sort_values(date_col).reset_index(drop=True)

    records = df_to_records(merged_df)
    summary = {'total_records': len(records)}
    for amt_col in config.get('amount_columns', []):
        if amt_col in merged_df.columns:
            summary[f'total_{amt_col}'] = safe_float(merged_df[amt_col].sum())

    return {'records': records, 'summary': summary}


def df_to_records(df):
    """DataFrame을 JSON 직렬화 가능한 레코드 리스트로 변환"""
    records = []
    for _, row in df.iterrows():
        record = {}
        for col in df.columns:
            if col.startswith('_') or col == 'source_file':
                continue
            val = row[col]
            if pd.isna(val):
                record[col] = None
            elif isinstance(val, (int, float)):
                record[col] = float(val)
            else:
                record[col] = str(val)
        records.append(record)
    return records


def generate_daily_dashboard_data(data_result):
    """
    전체 데이터를 종합하여 일별 대시보드용 통계 데이터를 생성
    - 일별 추이 (매출, 매입, 수금, 지급, 입금, 손익)
    - 주요 분석 (Top 거래처, 품목 등)
    """
    daily_stats = defaultdict(lambda: {
        'sales': 0, 'purchase': 0, 'collection': 0,
        'payment': 0, 'deposit': 0, 'profit': 0
    })

    # 1. 판매현황 (매출) - date format: '2026-01-XX' or '2026/01/XX'
    # 데이터는 JSON 형태로 변환된 data_result['data']['sales']['records'] 사용
    if 'sales' in data_result['data']:
        for rec in data_result['data']['sales']['records']:
            d = rec.get('일자')
            amt = rec.get('합 계', 0)
            if d:
                # 날짜 표준화 (YYYY-MM-DD)
                d_str = str(d).replace('/', '-').split(' ')[0]
                daily_stats[d_str]['sales'] += safe_float(amt)

    # 2. 구매현황 (매입)
    if 'purchases' in data_result['data']:
        for rec in data_result['data']['purchases']['records']:
            d = rec.get('일자')
            amt = rec.get('합 계', 0)
            if d:
                d_str = str(d).replace('/', '-').split(' ')[0]
                daily_stats[d_str]['purchase'] += safe_float(amt)

    # 3. 수금현황
    if 'collections' in data_result['data']:
        for rec in data_result['data']['collections']['records']:
            # 수금 파일은 '일자-No.' 컬럼에 '2026/01/18 오전 ...' 형식으로 들어있음
            # 앞부분 날짜만 추출
            d_raw = rec.get('일자-No.')
            amt = rec.get('금액', 0)
            if d_raw:
                d_str = str(d_raw).split(' ')[0].replace('/', '-')
                daily_stats[d_str]['collection'] += safe_float(amt)
    
    # 4. 지급현황
    if 'payments' in data_result['data']:
        for rec in data_result['data']['payments']['records']:
            d_raw = rec.get('일자-No.')
            amt = rec.get('금액', 0)
            if d_raw:
                d_str = str(d_raw).split(' ')[0].replace('/', '-')
                daily_stats[d_str]['payment'] += safe_float(amt)

    # 5. 입금현황
    if 'deposits' in data_result['data']:
        for rec in data_result['data']['deposits']['records']:
            # 입금은 '전표번호'가 날짜 역할 (예: 2026/01/18-001 or 그냥 날짜)
            d_raw = rec.get('전표번호')
            amt = rec.get('금액', 0)
            if d_raw:
                # 전표번호 등에서 날짜 추출. 만약 '-'가 있다면 그 앞부분
                d_part = str(d_raw).split('-')[0].strip()
                # 날짜 형식이 아니면(숫자만 있거나 하면) 건너뛰거나 파싱 시도
                # 여기서는 '2026/01/18' 형태라고 가정
                d_str = d_part.split(' ')[0].replace('/', '-')
                
                # 유효한 날짜 문자열인지 확인
                if re.match(r'^\d{4}-\d{2}-\d{2}', d_str):
                    daily_stats[d_str]['deposit'] += safe_float(amt)

    # 손익 계산 (매출 - 매입) 및 리스트 변환
    sorted_dates = sorted(daily_stats.keys())
    daily_trends = []
    
    total_metrics = {'sales': 0, 'purchase': 0, 'collection': 0, 'payment': 0, 'deposit': 0, 'profit': 0}

    for d in sorted_dates:
        stat = daily_stats[d]
        stat['profit'] = stat['sales'] - stat['purchase']
        stat['date'] = d
        
        # 누적 합계
        for k in total_metrics:
            if k in stat:
                total_metrics[k] += stat[k]
        
        daily_trends.append(stat)

    # Analytics - Top Clients (Sales)
    client_sales = defaultdict(float)
    if 'sales' in data_result['data']:
        for rec in data_result['data']['sales']['records']:
            client = rec.get('판매처명')
            amt = rec.get('합 계', 0)
            if client:
                client_sales[client] += safe_float(amt)
    
    top_clients_sales = [
        {'name': k, 'value': v} 
        for k, v in sorted(client_sales.items(), key=lambda item: item[1], reverse=True)[:5]
    ]

    # Analytics - Top Items (Sales)
    item_sales = defaultdict(float)
    if 'sales' in data_result['data']:
        for rec in data_result['data']['sales']['records']:
            item = rec.get('품목명(규격)')
            amt = rec.get('합 계', 0)
            if item:
                item_sales[item] += safe_float(amt)

    top_items_sales = [
        {'name': k, 'value': v}
        for k, v in sorted(item_sales.items(), key=lambda item: item[1], reverse=True)[:5]
    ]

    return {
        'daily_trends': daily_trends,
        'totals': total_metrics,
        'analytics': {
            'top_clients': top_clients_sales,
            'top_items': top_items_sales
        }
    }


def main(force=False):
    """
    메인 파싱 함수.
    force=True면 캐시 무시하고 무조건 파싱.
    변경 없으면 스킵하고 False 반환, 파싱 실행하면 True 반환.
    """
    print("=" * 60)
    print("1_Basic_Sheet 파일 파싱 시작")
    print("=" * 60)

    # 변경 감지
    if not force and not has_folder_changed(BASE_PATH):
        print("\n파일 변경 없음 — 파싱을 건너뜁니다.")
        print("(강제 실행: python parse_basic_sheets.py --force)")
        print("=" * 60)
        return False

    # 파일 그룹화
    file_groups = group_files_by_prefix(BASE_PATH)

    print(f"\n발견된 파일 그룹:")
    for prefix, files in file_groups.items():
        print(f"  - {prefix}: {len(files)}개 파일")

    # 마스터 엑셀 생성
    print(f"\n{'='*40}")
    print("마스터 엑셀 생성 중...")
    print(f"{'='*40}")
    master_files = generate_master_excels(file_groups)
    print(f"마스터 생성 완료: {len(master_files)}종")

    # 각 종류별 파싱
    print(f"\n{'='*40}")
    print("JSON 데이터 생성 중...")
    print(f"{'='*40}")

    result = {
        'generated_at': datetime.now().isoformat(),
        'source_folder': BASE_PATH,
        'master_folder': MASTER_DIR,
        'data': {}
    }

    # 판매현황
    if '판매현황' in file_groups:
        print(f"\n판매현황 파싱 중...")
        result['data']['sales'] = parse_sales_data(file_groups['판매현황'])
        print(f"  - 레코드 수: {result['data']['sales']['summary'].get('total_records', 0)}")
        print(f"  - 총 매출: {result['data']['sales']['summary'].get('total_amount', 0):,.0f}원")

    # 구매현황
    if '구매현황' in file_groups:
        print(f"\n구매현황 파싱 중...")
        result['data']['purchases'] = parse_purchase_data(file_groups['구매현황'])
        print(f"  - 레코드 수: {result['data']['purchases']['summary'].get('total_records', 0)}")
        print(f"  - 총 구매: {result['data']['purchases']['summary'].get('total_amount', 0):,.0f}원")

    # 채권현황
    if '채권현황' in file_groups:
        print(f"\n채권현황 파싱 중...")
        result['data']['receivables'] = parse_receivables_data(file_groups['채권현황'])
        print(f"  - 거래처 수: {result['data']['receivables']['summary'].get('total_records', 0)}")
        print(f"  - 총 채권: {result['data']['receivables']['summary'].get('total', 0):,.0f}원")

    # 경영요약보고서
    if '경영요약보고서' in file_groups:
        print(f"\n경영요약보고서 파싱 중...")
        result['data']['management'] = parse_management_report(file_groups['경영요약보고서'])
        print(f"  - 섹션 수: {result['data']['management']['summary'].get('section_count', 0)}")

    # 수금현황
    if '수금현황' in file_groups:
        print(f"\n수금현황 파싱 중...")
        result['data']['collections'] = parse_simple_list_data(file_groups['수금현황'], '수금현황')
        print(f"  - 레코드 수: {result['data']['collections']['summary'].get('total_records', 0)}")
        print(f"  - 총 수금액: {result['data']['collections']['summary'].get('total_amount', 0):,.0f}원")

    # 지급현황
    if '지급현황' in file_groups:
        print(f"\n지급현황 파싱 중...")
        result['data']['payments'] = parse_simple_list_data(file_groups['지급현황'], '지급현황')
        print(f"  - 레코드 수: {result['data']['payments']['summary'].get('total_records', 0)}")
        print(f"  - 총 지급액: {result['data']['payments']['summary'].get('total_amount', 0):,.0f}원")

    # 입금보고서집계 (입금현황)
    if '입금보고서집계' in file_groups:
        print(f"\n입금보고서집계 파싱 중...")
        result['data']['deposits'] = parse_simple_list_data(file_groups['입금보고서집계'], '입금보고서집계')
        print(f"  - 레코드 수: {result['data']['deposits']['summary'].get('total_records', 0)}")
        print(f"  - 총 입금액: {result['data']['deposits']['summary'].get('total_amount', 0):,.0f}원")

    # 신규 4종
    NEW_TYPES = {
        '받을어음감소현황': 'bill_decrease',
        '받을어음증가현황': 'bill_increase',
        '자금일보': 'fund_daily',
        '입금보고서': 'deposit_report',
    }
    for korean_name, json_key in NEW_TYPES.items():
        if korean_name in file_groups:
            print(f"\n{korean_name} 파싱 중...")
            result['data'][json_key] = parse_generic_data(file_groups[korean_name], korean_name)
            rec_count = result['data'][json_key]['summary'].get('total_records', 0)
            print(f"  - 레코드 수: {rec_count}")

    # 종합 대시보드 데이터 생성
    print(f"\n기본일보 대시보드 데이터 집계 중...")
    result['dashboard_stats'] = generate_daily_dashboard_data(result)
    print(f"  - 집계된 일자 수: {len(result['dashboard_stats']['daily_trends'])}")

    # 기존 JSON 백업 후 저장
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    backup_name = backup_current_json()
    if backup_name:
        print(f"\n기존 데이터 백업: {backup_name}")
    json_path = os.path.join(OUTPUT_PATH, 'basic_sheets.json')

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # 캐시 저장
    save_folder_cache(BASE_PATH)

    print(f"\n저장 완료: {json_path}")
    print("=" * 60)
    return True


def start_api_server(port=5174):
    """대시보드용 경량 API 서버 (백그라운드 스레드)"""
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import threading

    class APIHandler(BaseHTTPRequestHandler):
        def _cors(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        def _json_response(self, status, data):
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self._cors()
            self.end_headers()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

        def do_OPTIONS(self):
            self.send_response(204)
            self._cors()
            self.end_headers()

        def do_POST(self):
            if self.path == '/api/refresh':
                try:
                    result = main(force=True)
                    if result:
                        self._json_response(200, {'success': True, 'message': '데이터 갱신 완료'})
                    else:
                        self._json_response(200, {'success': True, 'message': '변경 없음 (강제 갱신됨)'})
                except Exception as e:
                    self._json_response(500, {'success': False, 'message': f'갱신 실패: {e}'})
            elif self.path == '/api/rollback':
                length = int(self.headers.get('Content-Length', 0))
                body = json.loads(self.rfile.read(length)) if length else {}
                filename = body.get('filename')
                if not filename:
                    self._json_response(400, {'success': False, 'message': 'filename 필요'})
                    return
                ok, msg = rollback(filename)
                self._json_response(200 if ok else 400, {'success': ok, 'message': msg})
            else:
                self._json_response(404, {'error': 'Not found'})

        def do_GET(self):
            if self.path == '/api/backups':
                self._json_response(200, {'backups': list_backups()})
            else:
                self._json_response(404, {'error': 'Not found'})

        def log_message(self, format, *args):
            print(f"[API] {args[0]}")

    server = HTTPServer(('127.0.0.1', port), APIHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    print(f"[API] 서버 시작: http://127.0.0.1:{port}")
    print(f"[API]   POST /api/refresh  - 데이터 갱신")
    print(f"[API]   GET  /api/backups  - 백업 목록")
    print(f"[API]   POST /api/rollback - 복원")
    return server


def watch_folder():
    """1_Basic_Sheet 폴더 감시 + API 서버 통합 실행"""
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    import threading, time

    class BasicSheetHandler(FileSystemEventHandler):
        def __init__(self):
            self.debounce_timer = None
            self.debounce_delay = 3.0

        def _is_excel(self, path):
            return path.endswith(('.xlsx', '.xls')) and not os.path.basename(path).startswith('~')

        def on_created(self, event):
            if not event.is_directory and self._is_excel(event.src_path):
                print(f"\n[감시] 새 파일 감지: {os.path.basename(event.src_path)}")
                self._schedule()

        def on_modified(self, event):
            if not event.is_directory and self._is_excel(event.src_path):
                print(f"\n[감시] 파일 수정 감지: {os.path.basename(event.src_path)}")
                self._schedule()

        def on_deleted(self, event):
            if not event.is_directory and self._is_excel(event.src_path):
                print(f"\n[감시] 파일 삭제 감지: {os.path.basename(event.src_path)}")
                self._schedule()

        def _schedule(self):
            if self.debounce_timer:
                self.debounce_timer.cancel()
            self.debounce_timer = threading.Timer(self.debounce_delay, self._run_parse)
            self.debounce_timer.start()

        def _run_parse(self):
            print("\n[감시] 자동 파싱 실행 중...")
            try:
                main()
                print("[감시] 자동 파싱 완료. basic_sheets.json 갱신됨.")
            except Exception as e:
                print(f"[감시] 파싱 오류: {e}")

    # API 서버 시작 (백그라운드)
    api_server = start_api_server()

    # 폴더 감시 시작
    observer = Observer()
    observer.schedule(BasicSheetHandler(), BASE_PATH, recursive=False)
    observer.start()

    print("=" * 60)
    print(f"[감시] 폴더: {BASE_PATH}")
    print("[감시] 엑셀 파일 추가/수정/삭제 시 자동 파싱")
    print("[감시] 대시보드에서 수동갱신/복원 버튼 사용 가능")
    print("[감시] 종료: Ctrl+C")
    print("=" * 60)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        api_server.shutdown()
        print("\n종료 완료.")
    observer.join()


if __name__ == '__main__':
    import sys
    args = sys.argv[1:]
    force = '--force' in args
    watch = '--watch' in args

    if watch:
        main(force=True)
        watch_folder()
    else:
        main(force=force)
