# -*- coding: utf-8 -*-
"""
영일오엔씨 일보현황 데이터 파이프라인

사업소별 일일매출수금 현황 엑셀 파일에서 데이터를 추출하여
대시보드용 JSON 파일을 생성합니다.

사용법:
    python data_pipeline.py [날짜]

    날짜 형식: MMDD (예: 1101 = 11월 1일)
    날짜 미지정 시 가장 최근 날짜 사용
"""

import pandas as pd
import json
import sys
from datetime import datetime
from pathlib import Path


class DailyReportPipeline:
    """사업소별 일일매출수금 현황을 처리하는 파이프라인"""

    BRANCH_MAPPING = {
        '화성IL': '화성 IL',
        '서울': '서울,화성 IL',
        '창원': '창원',
        '화성auto(남부)': '화성auto(남부)',
        '화성auto남부': '화성auto(남부)',
        '화성auto(중부)': '화성auto(중부)',
        '화성auto중부': '화성auto(중부)',
        '인천(서부)': '인천(서부)',
        '인천서부': '인천(서부)',
        '평촌': '인천(서부)',
        '남양주(동부)': '남양주(동부)',
        '남양주동부': '남양주(동부)',
        '천안북부': '남양주(동부)',
        '제주': '제주',
        '부산': '부산',
    }

    def __init__(self, data_folder: str = 'Basic_Sheet'):
        self.data_folder = Path(data_folder)

    def extract_from_branch_file(self, file_path: str, branch_name: str, sheet_name: str) -> dict:
        """사업소별 일일매출수금 현황 파일에서 데이터 추출"""
        try:
            df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

            date_val = df.iloc[1, 0]
            if isinstance(date_val, datetime):
                report_date = date_val.strftime('%Y-%m-%d')
            else:
                report_date = str(date_val)[:10]

            sales = {
                'date': report_date,
                'branch': branch_name,
                'total_sales': self._safe_number(df.iloc[8, 5]),
                'mobil_sell_out': self._safe_number(df.iloc[3, 5]),
                '모빌(Sell-out)_Total(L)': self._safe_number(df.iloc[8, 10]),
                '모빌(Sell-out)_Flagship(L)': self._safe_number(df.iloc[3, 12]) if df.shape[1] > 12 else 0,
                'mobil_sell_in_total': 0,
                '모빌(Sell-in)_Flagship(L)': 0,
            }

            collection = {
                'date': report_date,
                'branch': branch_name,
                'total_collection': self._safe_number(df.iloc[12, 5]),
                'cash': self._safe_number(df.iloc[9, 5]),
                'bill': self._safe_number(df.iloc[10, 5]),
                'card': self._safe_number(df.iloc[11, 5]),
                'etc1': 0,
                'etc2': 0,
            }

            return {'sales': sales, 'collection': collection}

        except Exception as e:
            print(f"[오류] {file_path} ({branch_name}): {e}")
            return None

    def _safe_number(self, value) -> float:
        """안전하게 숫자 변환"""
        if pd.isna(value):
            return 0.0
        try:
            return float(value)
        except:
            return 0.0

    def find_branch_files(self) -> list:
        """데이터 폴더에서 사업소별 파일 찾기"""
        files = []
        seen_branches = set()

        for f in sorted(self.data_folder.glob('*일일매출수금*현황*.xlsx')):
            if '(1)' in f.stem:
                continue

            for key in self.BRANCH_MAPPING:
                if key in f.stem:
                    branch = self.BRANCH_MAPPING[key]
                    if branch not in seen_branches:
                        files.append({'path': f, 'branch': branch})
                        seen_branches.add(branch)
                    break
        return files

    def get_available_dates(self, file_path: str) -> list:
        """파일에서 사용 가능한 날짜(시트) 목록 반환"""
        xl = pd.ExcelFile(file_path)
        dates = [s for s in xl.sheet_names if s.isdigit() and len(s) == 4]
        return sorted(dates, reverse=True)

    def process_date(self, target_date: str = None) -> dict:
        """특정 날짜의 모든 사업소 데이터 처리"""
        results = {
            'sales': [],
            'collections': [],
            'funds': [],
            'ar_balances': [],
            'mobile': [],
            'expenses': [],
            'major_expenses': [],
            'generated_at': datetime.now().isoformat()
        }

        branch_files = self.find_branch_files()

        if not branch_files:
            print("[경고] 브랜치 파일을 찾을 수 없습니다.")
            return {}

        for bf in branch_files:
            dates = self.get_available_dates(str(bf['path']))
            if not dates:
                continue

            sheet_name = target_date if target_date in dates else dates[0]
            data = self.extract_from_branch_file(str(bf['path']), bf['branch'], sheet_name)

            if data:
                results['sales'].append(data['sales'])
                results['collections'].append(data['collection'])
                results['mobile'].append({
                    'date': data['sales']['date'],
                    'branch': data['sales']['branch'],
                    'il_payment': data['sales']['mobil_sell_out'],
                    'auto_payment': data['sales']['mobil_sell_in_total']
                })

        return results

    def generate_dashboard_json(self, output_path: str = None, target_date: str = None):
        """대시보드용 JSON 파일 생성"""
        if output_path is None:
            output_path = 'daily-report-dashboard/src/data/dashboard.json'

        data = self.process_date(target_date)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"대시보드 데이터 생성 완료: {output_path}")
        print(f"  - 매출 데이터: {len(data['sales'])}건")
        print(f"  - 수금 데이터: {len(data['collections'])}건")
        return data


def main():
    """메인 실행 함수"""
    target_date = sys.argv[1] if len(sys.argv) > 1 else None

    pipeline = DailyReportPipeline('Basic_Sheet')
    pipeline.generate_dashboard_json(target_date=target_date)


if __name__ == '__main__':
    main()
