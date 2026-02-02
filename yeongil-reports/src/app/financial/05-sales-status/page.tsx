'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report05() {
  const branches = ['화성', '창원', '남양주', '인천', '화성오토', '제주', '부산'];

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    { id: 'tab1', name: '판매현황', label: 'Sales Status' },
    { id: 'tab2', name: 'ㅍ', label: 'Summary' },
    { id: 'tab3', name: '재고현황', label: 'Inventory Status' },
    { id: 'tab4', name: '미판매현황', label: 'Unsold Status' },
    { id: 'tab5', name: '미입고현황', label: 'Unreceived Status' },
    { id: 'tab6', name: '자료', label: 'Data' },
    { id: 'tab7', name: 'data', label: 'ERP Download' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">05. 판매현황 (Full-year Sales Status)</h1>
        <p className="text-sm text-gray-500">Monthly accumulation of sales data across the year. Comprehensive sales and inventory tracking.</p>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Branch Selector */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Branch</h2>
        <div className="grid grid-cols-4 gap-3">
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                selectedBranch === branch
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-purple-100 hover:shadow border border-gray-200'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-purple-600 text-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Viewing Data For:</p>
            <p className="text-2xl font-bold">{selectedBranch}</p>
          </div>
          <div className="text-4xl opacity-50">📈</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b-2 border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.name}
              <span className="block text-xs text-gray-500 mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'tab1' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">판매현황({selectedBranch}) - Sales Status (Transaction Detail)</h2>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">월</th>
                    <th className="border px-2 py-1">일자</th>
                    <th className="border px-2 py-1">거래처그룹1코드명</th>
                    <th className="border px-2 py-1">세무신고거래처코드</th>
                    <th className="border px-2 py-1">거래처코드</th>
                    <th className="border px-2 py-1">담당자코드명</th>
                    <th className="border px-2 py-1">판매처명</th>
                    <th className="border px-2 py-1">품목코드</th>
                    <th className="border px-2 py-1">품목명(규격)</th>
                    <th className="border px-2 py-1">단위</th>
                    <th className="border px-2 py-1">규격명</th>
                    <th className="border px-2 py-1">수량</th>
                    <th className="border px-2 py-1">중량</th>
                    <th className="border px-2 py-1">단가</th>
                    <th className="border px-2 py-1">공급가액</th>
                    <th className="border px-2 py-1">합 계</th>
                    <th className="border px-2 py-1">품목그룹1코드</th>
                    <th className="border px-2 py-1">품목그룹2명</th>
                    <th className="border px-2 py-1">품목그룹3코드</th>
                    <th className="border px-2 py-1">창고명</th>
                    <th className="border px-2 py-1">거래처그룹2명</th>
                    <th className="border px-2 py-1">적요</th>
                    <th className="border px-2 py-1">적요</th>
                    <th className="border px-2 py-1">실납업체</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab2' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">ㅍ - Summary by Item Code (Monthly Changes)</h2>
            <p className="text-xs text-gray-600 mb-3">Year-over-year monthly comparison to track changes over time</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2}>품목코드</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                    <th className="border px-2 py-1" rowSpan={2}>합계</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {/* 2024 months */}
                    {['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'].map((month) => (
                      <th key={`2024-${month}`} className="border px-1 py-1 text-xs bg-blue-50">{month}</th>
                    ))}
                    {/* 2025 months */}
                    {['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'].map((month) => (
                      <th key={`2025-${month}`} className="border px-1 py-1 text-xs bg-green-50">{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 font-medium">Item-{idx + 1}</td>
                      {/* 2024 months */}
                      {[...Array(12)].map((_, i) => (
                        <td key={`2024-${i}`} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                      {/* 2025 months */}
                      {[...Array(12)].map((_, i) => (
                        <td key={`2025-${i}`} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                      <td className="border px-2 py-1 text-right font-semibold">-</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-200">
                    <td className="border px-2 py-1">Total</td>
                    {[...Array(24)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                    <td className="border px-2 py-1 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Compare product sales month-by-month across years to identify trends and changes</p>
          </section>
        )}

        {activeTab === 'tab3' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">재고현황 - Inventory Status Snapshot</h2>
            <p className="text-sm text-gray-600 mb-3">회사명: (주)영일오엔씨 / {selectedBranch} / {selectedDate} / 재고현황</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">품목코드</th>
                    <th className="border px-2 py-1">품명 및 규격</th>
                    <th className="border px-2 py-1">단위</th>
                    <th className="border px-2 py-1">재고수량</th>
                    <th className="border px-2 py-1">중량</th>
                    <th className="border px-2 py-1 bg-purple-50">{selectedBranch}</th>
                    <th className="border px-2 py-1">입고단가</th>
                    <th className="border px-2 py-1">금액</th>
                    <th className="border px-2 py-1">품목그룹1명</th>
                    <th className="border px-2 py-1">품목그룹2명</th>
                    <th className="border px-2 py-1">품목그룹3명</th>
                    <th className="border px-2 py-1">석유류</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right bg-purple-50">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab4' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">미판매현황 - Unsold Status (Customer Orders Backlog)</h2>
            <p className="text-sm text-gray-600 mb-3">회사명: (주)영일오엔씨 / {selectedBranch} / {selectedDate} ~ {selectedDate}</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">월/일</th>
                    <th className="border px-3 py-2">품목코드</th>
                    <th className="border px-3 py-2">품명 및 규격</th>
                    <th className="border px-3 py-2">수량</th>
                    <th className="border px-3 py-2">잔량</th>
                    <th className="border px-3 py-2">공급가액</th>
                    <th className="border px-3 py-2">거래처명</th>
                    <th className="border px-3 py-2">적요</th>
                    <th className="border px-3 py-2">납기일자</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-yellow-100">
                    <td className="border px-3 py-2" colSpan={8}>총합계 (Total Sum)</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Data is grouped monthly with 총합계 (total sum) for each month</p>
          </section>
        )}

        {activeTab === 'tab5' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">미입고현황 - Unreceived Status (Supplier Orders Pipeline)</h2>
            <p className="text-sm text-gray-600 mb-3">회사명: (주)영일오엔씨 / {selectedBranch} / {selectedDate} ~ {selectedDate}</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">월/일</th>
                    <th className="border px-2 py-1">품목코드</th>
                    <th className="border px-2 py-1">품명 및 규격</th>
                    <th className="border px-2 py-1">수량</th>
                    <th className="border px-2 py-1">잔량</th>
                    <th className="border px-2 py-1">잔량(중량)</th>
                    <th className="border px-2 py-1">미구매공급가액</th>
                    <th className="border px-2 py-1">미구매부가세</th>
                    <th className="border px-2 py-1">합계</th>
                    <th className="border px-2 py-1">납기일자</th>
                    <th className="border px-2 py-1">거래처명</th>
                    <th className="border px-2 py-1">품목그룹1명</th>
                    <th className="border px-2 py-1">창고명</th>
                    <th className="border px-2 py-1">품목별납기일자</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab6' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">자료 - Master Summary Table</h2>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">모빌코드</th>
                    <th className="border px-2 py-1">품목코드</th>
                    <th className="border px-2 py-1">품명 및 규격</th>
                    <th className="border px-2 py-1">단위</th>
                    <th className="border px-2 py-1" colSpan={12}>2024년 (1월~12월)</th>
                    <th className="border px-2 py-1" colSpan={11}>2025년 (1월~11월)</th>
                    <th className="border px-2 py-1">미판매</th>
                    <th className="border px-2 py-1">재고현황</th>
                    <th className="border px-2 py-1">미입고현황</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      {[...Array(23)].map((_, i) => (
                        <td key={i} className="border px-2 py-1 text-right text-gray-400">-</td>
                      ))}
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Consolidated year-over-year view by item with monthly totals</p>
          </section>
        )}

        {activeTab === 'tab7' && (
          <section>
            <div className="p-8 text-center bg-gray-50 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">data - ERP System Download</h2>
              <p className="text-gray-500">This tab contains raw ERP system download data and can be ignored for reporting purposes.</p>
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 판매현황 report with 7 tabs.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
