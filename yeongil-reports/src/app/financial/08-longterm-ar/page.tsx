'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report08() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('summary');

  const branches = ['화성', '창원', '부산', '동부', '서부', '중부', '제주'];

  const tabs = [
    { id: 'summary', name: 'Current Month Summary', label: '월간 요약' },
    ...branches.map(b => ({ id: b, name: b, label: `${b}영업소` })),
  ];

  const months = ['2024/08', '2024/09', '2024/10', '2024/11', '2024/12', '2025/01', '2025/02', '2025/03', '2025/04', '2025/05', '2025/06', '2025/07'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">08. 장기미수금현황 (Long-term AR Outstanding)</h1>
        <p className="text-sm text-gray-500">Monthly review of overdue receivables.</p>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Tab Navigation */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Select View</h2>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-red-100 hover:shadow border border-gray-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <section>
            <h2 className="text-xl font-semibold mb-6 text-blue-900">Current Month Summary</h2>

            {/* Section 1: AR Status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-blue-100 p-3 rounded">
                Section 1: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} 기준 미수금 현황
              </h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2">사업소</th>
                      <th className="border px-3 py-2">당월 총 미수금</th>
                      <th className="border px-3 py-2">3개월 이상 장기미수금</th>
                      <th className="border px-3 py-2">장기미수금 비율</th>
                      <th className="border px-3 py-2">전월 장기미수</th>
                      <th className="border px-3 py-2">전월대비 장기미수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">{branch}</td>
                        <td className="border px-3 py-2 text-right">-</td>
                        <td className="border px-3 py-2 text-right">-</td>
                        <td className="border px-3 py-2 text-right">-%</td>
                        <td className="border px-3 py-2 text-right">-</td>
                        <td className="border px-3 py-2 text-right">-</td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-gray-200">
                      <td className="border px-3 py-2">Total</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-%</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Total AR for 3+ Months Overdue Companies */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-green-100 p-3 rounded">
                Section 2: 3개월 이상 장기미수 업체의 전체 미수금 현황
              </h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2">사업소</th>
                      <th className="border px-3 py-2">당월 장기미수금</th>
                      <th className="border px-3 py-2">전월 장기미수</th>
                      <th className="border px-3 py-2">전월대비 장기미수</th>
                      <th className="border px-3 py-2">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">{branch}</td>
                        <td className="border px-3 py-2 text-right">-</td>
                        <td className="border px-3 py-2 text-right">-</td>
                        <td className="border px-3 py-2 text-right">-</td>
                        <td className="border px-3 py-2">-</td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-gray-200">
                      <td className="border px-3 py-2">Total</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Companies with 5+ Months Overdue */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-red-100 p-3 rounded">
                Section 3: 미수 5개월 이상 출고 업체 현황
              </h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {branches.map((branch) => (
                        <th key={branch} className="border px-3 py-2 bg-red-50">{branch}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gray-50">
                        {branches.map((branch, colIdx) => (
                          <td key={`${branch}-${rowIdx}`} className="border px-3 py-2 align-top">
                            {rowIdx === 0 ? 'Company A' : rowIdx === 1 ? 'Company B' : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Branch Tabs */}
        {activeTab !== 'summary' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              {activeTab}영업소 - 3개월이상 장기미수
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              {activeTab}영업소 3개월이상 장기미수 / 2024/08/01 ~ 2025/07/31 / 2025.07.31 기준
            </p>

            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">담당자</th>
                    <th className="border px-2 py-1">거래처코드</th>
                    <th className="border px-2 py-1">거래처명</th>
                    <th className="border px-2 py-1">구분</th>
                    <th className="border px-2 py-1">이월잔액</th>
                    {months.map((m) => (
                      <th key={m} className="border px-2 py-1 bg-blue-50 text-xs">{m}</th>
                    ))}
                    <th className="border px-2 py-1">잔액</th>
                    <th className="border px-2 py-1">처리방안</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      {months.map((m, i) => (
                        <td key={i} className="border px-2 py-1 text-right text-xs">-</td>
                      ))}
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 mt-2 bg-yellow-50 p-2 rounded">
              * Monthly breakdown shows when receivables became overdue and tracks collection progress over time
            </p>
          </section>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 장기미수금현황 report.</p>
        <p className="mt-2">Summary tab shows 3 sections. Each branch tab shows detailed customer-level aging with 12 months of data.</p>
      </div>
    </div>
  );
}
