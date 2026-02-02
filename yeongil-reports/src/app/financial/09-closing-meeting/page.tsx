'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report09() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('actual');

  const tabs = [
    { id: 'actual', name: '실적', label: 'Actual Results' },
    { id: 'plan', name: '계획', label: 'Plan' },
  ];

  const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">09. 마감회의 (Closing Meeting Report)</h1>
        <p className="text-sm text-gray-500">End-of-month summary for management meeting. Aggregates everything above.</p>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Tab Navigation */}
      <div className="mb-6 border-b-2 border-gray-200">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-base whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50'
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
        {(activeTab === 'actual' || activeTab === 'plan') && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              {activeTab === 'actual' ? '실적 (Actual Results)' : '계획 (Plan)'}
            </h2>

            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2} colSpan={4}>구분</th>
                    <th className="border px-2 py-1" rowSpan={2}>2023년 실적</th>
                    <th className="border px-2 py-1" rowSpan={2}>2024년 실적</th>
                    <th className="border px-2 py-1" rowSpan={2}>2025년(P)</th>
                    <th className="border px-2 py-1" rowSpan={2}>증감율</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={5}>누적</th>
                    {months.map((m) => (
                      <th key={m} className="border px-2 py-1 bg-green-50" colSpan={5}>{m}</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    <th className="border px-1 py-1 bg-blue-50">2024년</th>
                    <th className="border px-1 py-1 bg-blue-50">목표</th>
                    <th className="border px-1 py-1 bg-blue-50">2025년</th>
                    <th className="border px-1 py-1 bg-blue-50">달성율</th>
                    <th className="border px-1 py-1 bg-blue-50">전년대비</th>
                    {months.map((m) => (
                      <>
                        <th key={`${m}-2024`} className="border px-1 py-1 bg-green-50">2024년</th>
                        <th key={`${m}-목표`} className="border px-1 py-1 bg-green-50">목표</th>
                        <th key={`${m}-2025`} className="border px-1 py-1 bg-green-50">2025년</th>
                        <th key={`${m}-달성`} className="border px-1 py-1 bg-green-50">달성율</th>
                        <th key={`${m}-전년`} className="border px-1 py-1 bg-green-50">전년대비</th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Section 1: Auto+IL */}
                  <tr className="bg-orange-50 font-semibold">
                    <td className="border px-2 py-1" rowSpan={3}>Auto+IL</td>
                    <td className="border px-2 py-1">판매량</td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1">sell-in</td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1">재고</td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* Section 2: B2C */}
                  {/* B2C → Auto */}
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1" rowSpan={19}>B2C</td>
                    <td className="border px-2 py-1" rowSpan={5}>Auto</td>
                    <td className="border px-2 py-1">재고</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1">sell-in</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="bg-yellow-100 font-semibold">
                    <td className="border px-2 py-1">AUTO 합계</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border px-2 py-1" colSpan={2}>B2C 소계</td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border px-2 py-1" colSpan={2}>B2C 팀 소계</td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* B2C → 동부지사 */}
                  {['맥심팀', '솔개팀', '사무실', '소계'].map((item, idx) => (
                    <tr key={`dongbu-${item}`} className={item === '소계' ? 'bg-purple-50 font-semibold' : 'hover:bg-gray-50'}>
                      {idx === 0 && <td className="border px-2 py-1" rowSpan={4}>동부지사</td>}
                      <td className="border px-2 py-1">{item}</td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(58)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* B2C → 서부지사 */}
                  {['아리안팀', '미추홀팀', '랜더스팀', '사무실', '소계'].map((item, idx) => (
                    <tr key={`seobu-${item}`} className={item === '소계' ? 'bg-purple-50 font-semibold' : 'hover:bg-gray-50'}>
                      {idx === 0 && <td className="border px-2 py-1" rowSpan={5}>서부지사</td>}
                      <td className="border px-2 py-1">{item}</td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(58)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* B2C → 중부 */}
                  {['클라쓰팀', '사무실', '소계'].map((item, idx) => (
                    <tr key={`jungbu-${item}`} className={item === '소계' ? 'bg-purple-50 font-semibold' : 'hover:bg-gray-50'}>
                      {idx === 0 && <td className="border px-2 py-1" rowSpan={3}>중부</td>}
                      <td className="border px-2 py-1">{item}</td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(58)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* B2C → 제주 → 삼다도팀 */}
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1">제주</td>
                    <td className="border px-2 py-1">삼다도팀</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* B2C → 남부지사 */}
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1">남부지사</td>
                    <td className="border px-2 py-1">남부지사</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* Section 3: B2B */}
                  {/* B2B → B2B Auto소계 */}
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1" rowSpan={12}>B2B</td>
                    <td className="border px-2 py-1">B2B Auto소계</td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* B2B → IL → 재고/sell-in/IL합계 */}
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1" rowSpan={10}>IL</td>
                    <td className="border px-2 py-1">재고</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border px-2 py-1">sell-in</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  <tr className="bg-yellow-100 font-semibold">
                    <td className="border px-2 py-1">IL 합계</td>
                    <td className="border px-2 py-1"></td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* B2B → IL → Teams */}
                  {['산업1팀', '산업2팀', '산업3팀', '산업4팀', '산업 창원', '산업 부산', '기타(B2C)'].map((team) => (
                    <tr key={team} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{team}</td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(58)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* B2B 합계 */}
                  <tr className="bg-green-100 font-bold">
                    <td className="border px-2 py-1" colSpan={4}>B2B 합계</td>
                    {[...Array(58)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* Section 4: AVI 등 */}
                  {['판매량', 'sell-in', '재고'].map((item, idx) => (
                    <tr key={`avi-${item}`} className="hover:bg-gray-50">
                      {idx === 0 && <td className="border px-2 py-1" rowSpan={3}>AVI 등</td>}
                      <td className="border px-2 py-1">{item}</td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(58)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* Section 5: MB */}
                  {['판매량', 'sell-in', '재고'].map((item, idx) => (
                    <tr key={`mb-${item}`} className="hover:bg-gray-50">
                      {idx === 0 && <td className="border px-2 py-1" rowSpan={3}>MB</td>}
                      <td className="border px-2 py-1">{item}</td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(58)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

            {/* Separate Table: 매입매출 총괄표 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">매입매출 총괄표 (Purchase/Sales Summary)</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>구분</th>
                      <th className="border px-2 py-1" rowSpan={2}>항목</th>
                      <th className="border px-2 py-1" rowSpan={2}>2023년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2024년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2025년(P)</th>
                      <th className="border px-2 py-1" rowSpan={2}>증감율</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={5}>누적</th>
                      {months.map((m) => (
                        <th key={`sum-${m}`} className="border px-2 py-1 bg-green-50" colSpan={5}>{m}</th>
                      ))}
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1 bg-blue-50">2024년</th>
                      <th className="border px-1 py-1 bg-blue-50">목표</th>
                      <th className="border px-1 py-1 bg-blue-50">2025년</th>
                      <th className="border px-1 py-1 bg-blue-50">달성율</th>
                      <th className="border px-1 py-1 bg-blue-50">전년대비</th>
                      {months.map((m) => (
                        <>
                          <th key={`sum-${m}-2024`} className="border px-1 py-1 bg-green-50">2024년</th>
                          <th key={`sum-${m}-목표`} className="border px-1 py-1 bg-green-50">목표</th>
                          <th key={`sum-${m}-2025`} className="border px-1 py-1 bg-green-50">2025년</th>
                          <th key={`sum-${m}-달성`} className="border px-1 py-1 bg-green-50">달성율</th>
                          <th key={`sum-${m}-전년`} className="border px-1 py-1 bg-green-50">전년대비</th>
                        </>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sell-out */}
                    {['총합계', 'MB', 'AVI 등', 'AUTO', 'IL'].map((item, idx) => (
                      <tr key={`sellout-${item}`} className={item === '총합계' ? 'bg-indigo-50 font-semibold' : 'hover:bg-gray-50'}>
                        {idx === 0 && <td className="border px-2 py-1" rowSpan={5}>Sell-out</td>}
                        <td className="border px-2 py-1">{item}</td>
                        {[...Array(58)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}

                    {/* Sell-In */}
                    {['총합계', 'MB', 'AVI 등', 'AUTO', 'IL'].map((item, idx) => (
                      <tr key={`sellin-${item}`} className={item === '총합계' ? 'bg-indigo-50 font-semibold' : 'hover:bg-gray-50'}>
                        {idx === 0 && <td className="border px-2 py-1" rowSpan={5}>Sell-In</td>}
                        <td className="border px-2 py-1">{item}</td>
                        {[...Array(58)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="font-medium mb-1">Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>* 목표량은 월별 표시가 안되있는 경우 1/n으로 산정하였음</li>
                <li>* AVI 는 2021년 목표를 전년과 판매실적을 목표로 잡았음</li>
              </ul>
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 마감회의 report.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
