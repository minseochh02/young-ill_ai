'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report06() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Function to get sheet name for a given date
  const getSheetForDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    // For now, hardcoded logic based on November 2025 structure
    // TODO: This should be dynamic based on available Excel files
    if (month === 11) {
      if (day === 13) return { sheet: '11-13', label: '2025-11-13 (목)' };
      if (day === 12) return { sheet: '11-12', label: '2025-11-12 (수)' };
      if (day >= 3 && day <= 11) return { sheet: '11-03~11-11', label: `2025-11-${String(day).padStart(2, '0')}` };
    }

    return null;
  };

  const currentSheet = getSheetForDate(selectedDate);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">06. B2B일일매출분석 (B2B Daily Sales Analysis)</h1>
        <p className="text-sm text-gray-500">Daily overview of all branches' B2B sales performance with profitability analysis.</p>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Sheet Info */}
      {currentSheet ? (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm">
            <span className="font-semibold">Data Sheet:</span> {currentSheet.sheet}
            <span className="ml-4 text-gray-600">({currentSheet.label})</span>
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ No data available for selected date ({selectedDate}). Please select a date in November 2025.
          </p>
        </div>
      )}

      {/* Report Content */}
      {currentSheet && (
        <div className="min-h-[400px]">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              B2B 사업부 / 일일매출 분석 - {currentSheet.label}
            </h2>

              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 bg-yellow-50" rowSpan={2}>날짜 / 사업소 / 고객</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={3}>일일매출 현황</th>
                      <th className="border px-2 py-1 bg-green-50" colSpan={2}>구매현황</th>
                      <th className="border px-2 py-1 bg-purple-50" colSpan={3}>매출이익</th>
                      <th className="border px-2 py-1 bg-orange-50" colSpan={2}>이익율 (%)</th>
                      <th className="border px-2 py-1" rowSpan={2}>비고</th>
                    </tr>
                    <tr className="bg-gray-50">
                      {/* 일일매출 현황 */}
                      <th className="border px-2 py-1 text-xs bg-blue-50">수량</th>
                      <th className="border px-2 py-1 text-xs bg-blue-50">단가</th>
                      <th className="border px-2 py-1 text-xs bg-blue-50">공급가</th>
                      {/* 구매현황 */}
                      <th className="border px-2 py-1 text-xs bg-green-50">DSP</th>
                      <th className="border px-2 py-1 text-xs bg-green-50">ASP</th>
                      {/* 매출이익 */}
                      <th className="border px-2 py-1 text-xs bg-purple-50">기타비용<br/>(운임 외)</th>
                      <th className="border px-2 py-1 text-xs bg-purple-50">매출이익(DSP)</th>
                      <th className="border px-2 py-1 text-xs bg-purple-50">매출이익(ASP)</th>
                      {/* 이익율 */}
                      <th className="border px-2 py-1 text-xs bg-orange-50">이익률(DSP)</th>
                      <th className="border px-2 py-1 text-xs bg-orange-50">이익율(ASP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Branch Group */}
                    <tr className="bg-indigo-100 font-bold">
                      <td className="border px-3 py-2" colSpan={12}>화성사업소</td>
                    </tr>

                    {/* Manager */}
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-3 py-2 pl-8" colSpan={12}>조성호</td>
                    </tr>

                    {/* Customer */}
                    <tr className="bg-gray-100">
                      <td className="border px-3 py-2 pl-12" colSpan={12}>(주) 수산세보틱스</td>
                    </tr>

                    {/* Product Row */}
                    <tr className="hover:bg-gray-50">
                      <td className="border px-3 py-2 pl-16 text-xs">MOBIL DTE 22 ULTRA [200]</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>

                    {/* More placeholder rows */}
                    {[...Array(5)].map((_, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-3 py-2 pl-16 text-xs">품목명 {idx + 1}</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1">-</td>
                      </tr>
                    ))}

                    {/* Summary Row */}
                    <tr className="font-bold bg-yellow-100">
                      <td className="border px-3 py-2">합계</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-sm mb-2">📊 Key Metrics Explanation</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium">일일매출 현황 (Daily Sales)</p>
                    <p className="text-gray-600">수량, 단가, 공급가</p>
                  </div>
                  <div>
                    <p className="font-medium">구매현황 (Purchase)</p>
                    <p className="text-gray-600">DSP (Distributor Selling Price), ASP (Actual Selling Price)</p>
                  </div>
                  <div>
                    <p className="font-medium">매출이익 (Sales Profit)</p>
                    <p className="text-gray-600">기타비용, 매출이익(DSP), 매출이익(ASP)</p>
                  </div>
                  <div>
                    <p className="font-medium">이익율 (Profit Rate %)</p>
                    <p className="text-gray-600">이익률(DSP), 이익율(ASP)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the B2B일일매출분석 report.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
        <p className="mt-2 font-semibold">Hierarchical Structure: 사업소 → 담당자 → 고객사 → 품목</p>
      </div>
    </div>
  );
}
