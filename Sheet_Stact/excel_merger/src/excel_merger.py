import pandas as pd
import os
import re
from datetime import datetime
from typing import Dict, List, Tuple
from collections import defaultdict

class ExcelMerger:
    def __init__(self, watch_folder: str, output_folder: str):
        self.watch_folder = watch_folder
        self.output_folder = output_folder
        self.file_groups = defaultdict(list)

    def extract_datetime_from_filename(self, filename: str) -> Tuple[datetime, bool]:
        """파일명에서 날짜 추출. (datetime, 파일명에서_추출여부) 반환"""
        patterns = [
            (r'(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})',
             lambda m: datetime(int(m[0]), int(m[1]), int(m[2]), int(m[3]), int(m[4]), int(m[5]))),
            (r'(\d{4})(\d{2})(\d{2})[_\-](\d{2})(\d{2})(\d{2})',
             lambda m: datetime(int(m[0]), int(m[1]), int(m[2]), int(m[3]), int(m[4]), int(m[5]))),
            (r'(\d{4})[_\-](\d{2})[_\-](\d{2})[_\-\s](\d{2})[_:\-](\d{2})[_:\-](\d{2})',
             lambda m: datetime(int(m[0]), int(m[1]), int(m[2]), int(m[3]), int(m[4]), int(m[5]))),
            (r'(\d{2})(\d{2})(\d{2})[_\-](\d{2})(\d{2})(?!\d)',
             lambda m: datetime(2000 + int(m[0]), int(m[1]), int(m[2]), int(m[3]), int(m[4]))),
            (r'(\d{4})(\d{2})(\d{2})(?!\d)',
             lambda m: datetime(int(m[0]), int(m[1]), int(m[2]))),
            (r'(\d{4})[_\-](\d{2})[_\-](\d{2})(?!\d)',
             lambda m: datetime(int(m[0]), int(m[1]), int(m[2]))),
        ]
        for pattern, parser in patterns:
            match = re.search(pattern, filename)
            if match:
                try:
                    return parser(match.groups()), True
                except ValueError:
                    continue
        file_path = os.path.join(self.watch_folder, filename)
        return datetime.fromtimestamp(os.path.getmtime(file_path)), False

    def extract_prefix(self, filename: str) -> str:
        """파일명에서 접두어(그룹명) 추출"""
        name_without_ext = os.path.splitext(filename)[0]
        date_patterns = [
            r'[_\-]?\d{4}\d{2}\d{2}\d{2}\d{2}\d{2}.*$',
            r'[_\-]?\d{4}\d{2}\d{2}[_\-]\d{2}\d{2}\d{2}.*$',
            r'[_\-]?\d{4}[_\-]\d{2}[_\-]\d{2}[_\-\s]\d{2}[_:\-]\d{2}[_:\-]\d{2}.*$',
            r'[_\-]?\d{2}\d{2}\d{2}[_\-]\d{2}\d{2}(?!\d).*$',
            r'[_\-]?\d{4}\d{2}\d{2}(?!\d).*$',
            r'[_\-]?\d{4}[_\-]\d{2}[_\-]\d{2}(?!\d).*$',
        ]
        prefix = name_without_ext
        for pattern in date_patterns:
            new_prefix = re.sub(pattern, '', prefix)
            if new_prefix != prefix and new_prefix:
                prefix = new_prefix
                break
        if not prefix.strip('_- '):
            prefix = name_without_ext
        return prefix.rstrip('_- ')

    def group_files_by_prefix(self) -> Dict[str, List[Tuple[str, datetime]]]:
        """접두어별로 파일 그룹화"""
        self.file_groups.clear()
        excel_files = [f for f in os.listdir(self.watch_folder)
                      if f.endswith(('.xlsx', '.xls', '.csv'))]
        for file in excel_files:
            prefix = self.extract_prefix(file)
            file_time, from_filename = self.extract_datetime_from_filename(file)
            self.file_groups[prefix].append((file, file_time))
        for prefix in self.file_groups:
            self.file_groups[prefix].sort(key=lambda x: x[1], reverse=True)
        return dict(self.file_groups)

    def clean_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """데이터베이스 준비를 위한 데이터 정리"""
        if df.empty:
            return df
        
        # 1. 첫 번째 컬럼이 NaN인 행 제거 (합계/소계 행)
        first_col = df.columns[0]
        df = df[df[first_col].notna()]
        
        # 2. 날짜 형식 검증 (첫 번째 컬럼이 날짜인 행만 유지)
        date_pattern = r'^\d{4}[/\-]\d{2}[/\-]\d{2}$'
        df = df[df[first_col].astype(str).str.match(date_pattern, na=False)]
        
        # 3. 완전히 빈 행 제거
        df = df.dropna(how='all')
        
        return df.reset_index(drop=True)

    def merge_excel_files(self, file_list: List[Tuple[str, datetime]], prefix: str) -> pd.DataFrame:
        """같은 그룹의 엑셀 파일들을 병합 (DB 준비용 정리 포함)"""
        all_data = []
        column_names = None

        for filename, file_time in file_list:
            file_path = os.path.join(self.watch_folder, filename)

            try:
                if filename.endswith('.csv'):
                    df = pd.read_csv(file_path, encoding='utf-8', skiprows=1)
                else:
                    # 첫 번째 행(제목행) 건너뛰고, 두 번째 행을 헤더로 사용
                    df = pd.read_excel(file_path, engine='calamine', skiprows=1)

                # 첫 번째 파일의 컬럼명을 기준으로 사용
                if column_names is None:
                    column_names = df.columns.tolist()
                else:
                    df.columns = column_names[:len(df.columns)]

                # 데이터 정리 (헤더 행, 합계 행 제거)
                df = self.clean_dataframe(df)

                if not df.empty:
                    df['source_file'] = filename
                    df['file_datetime'] = file_time
                    df['import_order'] = len(all_data)
                    all_data.append(df)

            except Exception as e:
                print(f'파일 읽기 오류 {filename}: {e}')
                continue

        if all_data:
            merged_df = pd.concat(all_data, ignore_index=True)
            merged_df = merged_df.sort_values(['file_datetime', 'import_order'], ascending=[False, True])
            return merged_df.reset_index(drop=True)

        return pd.DataFrame()

    def process_all_groups(self):
        """모든 파일 그룹 처리"""
        self.group_files_by_prefix()
        for prefix, file_list in self.file_groups.items():
            if len(file_list) > 1:
                merged_data = self.merge_excel_files(file_list, prefix)
                if not merged_data.empty:
                    output_filename = f"{prefix}_merged_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                    output_path = os.path.join(self.output_folder, output_filename)
                    merged_data.to_excel(output_path, index=False)
                    print(f'병합 완료: {output_filename}')
                    print(f'  - 처리 파일 수: {len(file_list)}')
                    print(f'  - 전체 행 수: {len(merged_data)}')

    def get_file_summary(self) -> Dict[str, int]:
        """파일 그룹별 요약 정보"""
        self.group_files_by_prefix()
        return {prefix: len(files) for prefix, files in self.file_groups.items()}
