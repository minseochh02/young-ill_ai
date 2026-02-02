'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report10() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    { id: 'tab1', name: '사업소별', label: 'By Branch' },
    { id: 'tab2', name: '21 담당자별매출', label: 'By Person' },
    { id: 'tab3', name: '4 매출액', label: 'Sales Amount' },
    { id: 'tab4', name: '매출분석-채널', label: 'Channel Analysis' },
    { id: 'tab5', name: '거래처별원인', label: 'By Customer' },
    { id: 'tab6', name: '신규', label: 'New' },
    { id: 'tab7', name: '55 제품별현황', label: 'Product Status' },
    { id: 'tab8', name: '팀및전략딜러', label: 'Team & Strategic Dealers' },
    { id: 'tab9', name: '팀물량', label: 'Team Volume' },
    { id: 'tab10', name: '팀매출액', label: 'Team Sales' },
    { id: 'tab11', name: '쇼핑몰판매현황', label: 'Shopping Mall' },
  ];

  const branches = ['합계', '동부사업소', '서부사업소', '중부사업소', '제주사업소', '남부지사', 'B2B본부'];
  const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월'];
  const allMonths = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">10. B2C회의자료 (B2C Meeting Materials)</h1>
        <p className="text-sm text-gray-500">Companion to closing meeting, focused on B2C segment.</p>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Tab Navigation */}
      <div className="mb-6 border-b-2 border-gray-200">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.name}
              <span className="block text-xs opacity-75 mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Tab 1: 사업소별 */}
        {activeTab === 'tab1' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">사업소별 - AUTO 판매 실적 총괄</h2>
            <p className="text-xs text-gray-600 mb-3">단위: 리터 (Liters)</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>구분</th>
                    <th className="border px-2 py-1" rowSpan={3}>2023년 실적</th>
                    <th className="border px-2 py-1" rowSpan={3}>2024년 실적</th>
                    <th className="border px-2 py-1" rowSpan={3}>2025년 계획</th>
                    <th className="border px-2 py-1" rowSpan={3}>증감율</th>
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
                    <th className="border px-1 py-1 bg-blue-50">증감율</th>
                    {months.map((m) => (
                      <>
                        <th key={`${m}-2024`} className="border px-1 py-1 bg-green-50">2024년</th>
                        <th key={`${m}-목표`} className="border px-1 py-1 bg-green-50">목표</th>
                        <th key={`${m}-2025`} className="border px-1 py-1 bg-green-50">2025년</th>
                        <th key={`${m}-달성`} className="border px-1 py-1 bg-green-50">달성율</th>
                        <th key={`${m}-증감`} className="border px-1 py-1 bg-green-50">증감율</th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${branch === '합계' ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      {[...Array(55)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 2: 담당자별매출 */}
        {activeTab === 'tab2' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">21 담당자별매출 - By Person in Charge Sales</h2>
            <p className="text-xs text-gray-600 mb-3">단위: 리터 (Liters)</p>
            <div className="mb-4 text-xs bg-yellow-50 p-2 rounded">
              Note: 사무실은 전부 딜러로 함. 개인의 기타부분은 lcc로 분류
            </div>

            {/* Table 1: AUTO Breakdown */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Table 1: AUTO Breakdown</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2} colSpan={3}>구     분<br/>(PVL, CVL)</th>
                      <th className="border px-2 py-1" rowSpan={2}>전체 거래처수</th>
                      <th className="border px-2 py-1" rowSpan={2}>거래처수</th>
                      <th className="border px-2 py-1" rowSpan={2}>2023년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2024년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2025년 계획</th>
                      <th className="border px-2 py-1" rowSpan={2}>증감율</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={5}>누적실적</th>
                      {months.map((m) => (
                        <th key={m} className="border px-2 py-1 bg-green-50" colSpan={5}>{m}</th>
                      ))}
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1 bg-blue-50">2024년</th>
                      <th className="border px-1 py-1 bg-blue-50">목표</th>
                      <th className="border px-1 py-1 bg-blue-50">2025년</th>
                      <th className="border px-1 py-1 bg-blue-50">달성율</th>
                      <th className="border px-1 py-1 bg-blue-50">증감율</th>
                      {months.map((m) => (
                        <>
                          <th key={`${m}-2024`} className="border px-1 py-1 bg-green-50">2024년</th>
                          <th key={`${m}-목표`} className="border px-1 py-1 bg-green-50">목표</th>
                          <th key={`${m}-2025`} className="border px-1 py-1 bg-green-50">2025년</th>
                          <th key={`${m}-달성`} className="border px-1 py-1 bg-green-50">달성율</th>
                          <th key={`${m}-증감`} className="border px-1 py-1 bg-green-50">증감율</th>
                        </>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 합계 */}
                    <tr className="bg-yellow-100 font-bold">
                      <td className="border px-2 py-1" colSpan={3}>합계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>

                    {/* AUTO → B2C AUTO → 소계 + Fleet/LCC/사무실/남부지사 */}
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={8}>AUTO</td>
                      <td className="border px-2 py-1" rowSpan={5}>B2C AUTO</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['Fleet', 'LCC', '사무실', '남부지사'].map((item) => (
                      <tr key={item} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{item}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}

                    {/* AUTO → B2B AUTO → 소계 + b2b/기타 */}
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={3}>B2B AUTO</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['b2b', '기타'].map((item) => (
                      <tr key={item} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{item}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: B2C Detailed Breakdown */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Table 2: B2C Detailed Team Breakdown</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>Team</th>
                      <th className="border px-2 py-1" rowSpan={2}>Person</th>
                      <th className="border px-2 py-1" rowSpan={2}>Type</th>
                      <th className="border px-2 py-1" rowSpan={2}>전체 거래처수</th>
                      <th className="border px-2 py-1" rowSpan={2}>거래처수</th>
                      <th className="border px-2 py-1" rowSpan={2}>2023년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2024년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2025년 계획</th>
                      <th className="border px-2 py-1" rowSpan={2}>증감율</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={5}>누적실적</th>
                      {months.map((m) => (
                        <th key={m} className="border px-2 py-1 bg-green-50" colSpan={5}>{m}</th>
                      ))}
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1 bg-blue-50">2024년</th>
                      <th className="border px-1 py-1 bg-blue-50">목표</th>
                      <th className="border px-1 py-1 bg-blue-50">2025년</th>
                      <th className="border px-1 py-1 bg-blue-50">달성율</th>
                      <th className="border px-1 py-1 bg-blue-50">증감율</th>
                      {months.map((m) => (
                        <>
                          <th key={`${m}-2024`} className="border px-1 py-1 bg-green-50">2024년</th>
                          <th key={`${m}-목표`} className="border px-1 py-1 bg-green-50">목표</th>
                          <th key={`${m}-2025`} className="border px-1 py-1 bg-green-50">2025년</th>
                          <th key={`${m}-달성`} className="border px-1 py-1 bg-green-50">달성율</th>
                          <th key={`${m}-증감`} className="border px-1 py-1 bg-green-50">증감율</th>
                        </>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* B2C 총계 */}
                    <tr className="bg-yellow-100 font-bold">
                      <td className="border px-2 py-1" colSpan={3}>B2C 총계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>

                    {/* 맥심팀 → 합계 + 심경섭/이상욱 */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" rowSpan={7}>맥심팀</td>
                      <td className="border px-2 py-1" colSpan={2}>합계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={3}>심경섭</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['Fleet', 'LCC'].map((type) => (
                      <tr key={`shim-${type}`} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{type}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={3}>이상욱</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['Fleet', 'LCC'].map((type) => (
                      <tr key={`lee-${type}`} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{type}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}

                    {/* 솔개팀 → 합계 + 박태원/박경식/김태일 */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" rowSpan={10}>솔개팀</td>
                      <td className="border px-2 py-1" colSpan={2}>합계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['박태원', '박경식', '김태일'].map((person) => (
                      <>
                        <tr key={person} className="bg-blue-50 font-semibold">
                          <td className="border px-2 py-1" rowSpan={3}>{person}</td>
                          <td className="border px-2 py-1">소계</td>
                          {[...Array(61)].map((_, i) => (
                            <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                          ))}
                        </tr>
                        {['Fleet', 'LCC'].map((type) => (
                          <tr key={`${person}-${type}`} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{type}</td>
                            {[...Array(61)].map((_, i) => (
                              <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}

                    {/* Other teams - showing sample, can expand all if needed */}
                    {['아리안팀', '미추홀팀', '랜더스팀', '클라쓰팀'].map((team) => (
                      <tr key={team} className="bg-blue-100 font-bold">
                        <td className="border px-2 py-1" colSpan={3}>{team} (collapsed)</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}

                    {/* 삼다도팀 → 합계 + 김용수 (Fleet/LCC/딜러) */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" rowSpan={5}>삼다도팀</td>
                      <td className="border px-2 py-1">합계</td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={4}>김용수</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['Fleet', 'LCC', '딜러'].map((type) => (
                      <tr key={`kim-${type}`} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{type}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}

                    {/* 사무실 → 합계 + 사무실 (동부/서부/중부) */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" rowSpan={5}>사무실</td>
                      <td className="border px-2 py-1">합계</td>
                      <td className="border px-2 py-1"></td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={4}>사무실</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['동부', '서부', '중부'].map((region) => (
                      <tr key={region} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{region}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: 매출액 */}
        {activeTab === 'tab3' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">4 매출액 - Sales Amount (AUTO Breakdown)</h2>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2} colSpan={3}>구     분<br/>(PVL,CVL,IL,AVI,기타)</th>
                    <th className="border px-2 py-1" rowSpan={2}>전체 거래처수</th>
                    <th className="border px-2 py-1" rowSpan={2}>거래처수</th>
                    <th className="border px-2 py-1" rowSpan={2}>2023년 실적</th>
                    <th className="border px-2 py-1" rowSpan={2}>2024년 실적</th>
                    <th className="border px-2 py-1" rowSpan={2}>2025년 계획</th>
                    <th className="border px-2 py-1" rowSpan={2}>증감율</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={5}>누적실적</th>
                    {months.map((m) => (
                      <th key={m} className="border px-2 py-1 bg-green-50" colSpan={5}>{m}</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    <th className="border px-1 py-1 bg-blue-50">2024년</th>
                    <th className="border px-1 py-1 bg-blue-50">목표</th>
                    <th className="border px-1 py-1 bg-blue-50">2025년</th>
                    <th className="border px-1 py-1 bg-blue-50">달성율</th>
                    <th className="border px-1 py-1 bg-blue-50">증감율</th>
                    {months.map((m) => (
                      <>
                        <th key={`${m}-2024`} className="border px-1 py-1 bg-green-50">2024년</th>
                        <th key={`${m}-목표`} className="border px-1 py-1 bg-green-50">목표</th>
                        <th key={`${m}-2025`} className="border px-1 py-1 bg-green-50">2025년</th>
                        <th key={`${m}-달성`} className="border px-1 py-1 bg-green-50">달성율</th>
                        <th key={`${m}-증감`} className="border px-1 py-1 bg-green-50">증감율</th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 합계 */}
                  <tr className="bg-yellow-100 font-bold">
                    <td className="border px-2 py-1" colSpan={3}>합계</td>
                    {[...Array(61)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* AUTO → B2C AUTO → 소계/팀/사무실/남부지사 */}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border px-2 py-1" rowSpan={7}>AUTO</td>
                    <td className="border px-2 py-1" rowSpan={4}>B2C AUTO</td>
                    <td className="border px-2 py-1">소계</td>
                    {[...Array(61)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  {['팀', '사무실', '남부지사'].map((item) => (
                    <tr key={item} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{item}</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* AUTO → B2B AUTO → 소계/b2b/기타 */}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border px-2 py-1" rowSpan={3}>B2B AUTO</td>
                    <td className="border px-2 py-1">소계</td>
                    {[...Array(61)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  {['b2b', '기타'].map((item) => (
                    <tr key={item} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{item}</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                        {/* Table 2: B2C Detailed Team Breakdown (Same as Tab 2 Table 2) */}
                        <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Table 2: B2C Detailed Team Breakdown</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2} colSpan={3}>구     분<br/>(PVL,CVL,IL,AVI,기타)</th>
                      <th className="border px-2 py-1" rowSpan={2}>전체 거래처수</th>
                      <th className="border px-2 py-1" rowSpan={2}>거래처수</th>
                      <th className="border px-2 py-1" rowSpan={2}>2023년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2024년 실적</th>
                      <th className="border px-2 py-1" rowSpan={2}>2025년 계획</th>
                      <th className="border px-2 py-1" rowSpan={2}>증감율</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={5}>누적실적</th>
                      {months.map((m) => (
                        <th key={m} className="border px-2 py-1 bg-green-50" colSpan={5}>{m}</th>
                      ))}
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1 bg-blue-50">2024년</th>
                      <th className="border px-1 py-1 bg-blue-50">목표</th>
                      <th className="border px-1 py-1 bg-blue-50">2025년</th>
                      <th className="border px-1 py-1 bg-blue-50">달성율</th>
                      <th className="border px-1 py-1 bg-blue-50">증감율</th>
                      {months.map((m) => (
                        <>
                          <th key={`t2-${m}-2024`} className="border px-1 py-1 bg-green-50">2024년</th>
                          <th key={`t2-${m}-목표`} className="border px-1 py-1 bg-green-50">목표</th>
                          <th key={`t2-${m}-2025`} className="border px-1 py-1 bg-green-50">2025년</th>
                          <th key={`t2-${m}-달성`} className="border px-1 py-1 bg-green-50">달성율</th>
                          <th key={`t2-${m}-증감`} className="border px-1 py-1 bg-green-50">증감율</th>
                        </>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* B2C 총계 */}
                    <tr className="bg-yellow-100 font-bold">
                      <td className="border px-2 py-1" colSpan={3}>B2C 총계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>

                    {/* 맥심팀 → 합계 + 심경섭/이상욱 */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" rowSpan={7}>맥심팀</td>
                      <td className="border px-2 py-1" colSpan={2}>합계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={3}>심경섭</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['Fleet', 'LCC'].map((type) => (
                      <tr key={`t3-shim-${type}`} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{type}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1" rowSpan={3}>이상욱</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['Fleet', 'LCC'].map((type) => (
                      <tr key={`t3-lee-${type}`} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{type}</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}

                    {/* 솔개팀 → 합계 + 박태원/박경식/김태일 */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" rowSpan={10}>솔개팀</td>
                      <td className="border px-2 py-1" colSpan={2}>합계</td>
                      {[...Array(61)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    {['박태원', '박경식', '김태일'].map((person) => (
                      <>
                        <tr key={`t3-${person}`} className="bg-blue-50 font-semibold">
                          <td className="border px-2 py-1" rowSpan={3}>{person}</td>
                          <td className="border px-2 py-1">소계</td>
                          {[...Array(61)].map((_, i) => (
                            <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                          ))}
                        </tr>
                        {['Fleet', 'LCC'].map((type) => (
                          <tr key={`t3-${person}-${type}`} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{type}</td>
                            {[...Array(61)].map((_, i) => (
                              <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}

                    {/* Other teams - collapsed */}
                    {['아리안팀', '미추홀팀', '랜더스팀', '클라쓰팀', '삼다도팀', '사무실'].map((team) => (
                      <tr key={`t3-${team}`} className="bg-blue-100 font-bold">
                        <td className="border px-2 py-1" colSpan={3}>{team} (collapsed)</td>
                        {[...Array(61)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: 매출분석-채널 */}
        {activeTab === 'tab4' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">매출분석-채널 - Sales Analysis (2024 VS 2025)</h2>
            <p className="text-xs text-gray-600 mb-3">단위: 리터 (Liters)</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2}>구분</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={3}>2024년 01월~10월</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={3}>2025년 01월~10월</th>
                    <th className="border px-2 py-1 bg-orange-100" colSpan={4}>Comparison (2025 - 2024)</th>
                    <th className="border px-2 py-1" rowSpan={2}>원인분석</th>
                    <th className="border px-2 py-1" rowSpan={2}>대처방안</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border px-1 py-1 text-xs bg-blue-50">CVL</th>
                    <th className="border px-1 py-1 text-xs bg-blue-50">PVL</th>
                    <th className="border px-1 py-1 text-xs bg-blue-50">Total</th>
                    <th className="border px-1 py-1 text-xs bg-green-50">CVL</th>
                    <th className="border px-1 py-1 text-xs bg-green-50">PVL</th>
                    <th className="border px-1 py-1 text-xs bg-green-50">Total</th>
                    <th className="border px-1 py-1 text-xs bg-orange-100">CVL</th>
                    <th className="border px-1 py-1 text-xs bg-orange-100">PVL</th>
                    <th className="border px-1 py-1 text-xs bg-orange-100">증감</th>
                    <th className="border px-1 py-1 text-xs bg-orange-100">증감율</th>
                  </tr>
                </thead>
                <tbody>
                  {['Channel A', 'Channel B', 'Channel C'].map((channel, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{channel}</td>
                      {/* 2024년 */}
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      {/* 2025년 */}
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      {/* Comparison (calculated) */}
                      <td className="border px-2 py-1 text-right bg-orange-50 font-medium">-</td>
                      <td className="border px-2 py-1 text-right bg-orange-50 font-medium">-</td>
                      <td className="border px-2 py-1 text-right bg-orange-50 font-medium">-</td>
                      <td className="border px-2 py-1 text-right bg-orange-50 font-medium">-</td>
                      {/* Analysis */}
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2 bg-orange-50 p-2 rounded border border-orange-200">
              📊 Comparison columns (CVL, PVL, 증감, 증감율) are calculated: 2025년 - 2024년
            </p>
          </section>
        )}

        {/* Tab 5: 거래처별원인 */}
        {activeTab === 'tab5' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">거래처별원인 - By Customer Cause/Reason</h2>
            <p className="text-xs text-gray-600 mb-3">합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">거래처그룹2</th>
                    <th className="border px-3 py-2">담당자명</th>
                    <th className="border px-3 py-2">거래처코드</th>
                    <th className="border px-3 py-2">판매처명</th>
                    <th className="border px-3 py-2">2024년</th>
                    <th className="border px-3 py-2">2025년</th>
                    <th className="border px-3 py-2">증감(L)</th>
                    <th className="border px-3 py-2">원인분석</th>
                    <th className="border px-3 py-2">대응방안</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2 text-right">-</td>
                      <td className="border px-3 py-2">-</td>
                      <td className="border px-3 py-2">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 6: 신규 */}
        {activeTab === 'tab6' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">신규 - New Customer Acquisition</h2>
            <p className="text-xs text-gray-600 mb-3">신규거래처 (물량:워셔액제외) | 단위: 리터 / 공급가액</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2} colSpan={3}>구분 (물량:워셔액제외)</th>
                    <th className="border px-2 py-1" rowSpan={2}>2024년 거래처수</th>
                    <th className="border px-2 py-1" rowSpan={2}>목표 거래처수</th>
                    <th className="border px-2 py-1" rowSpan={2}>물량 2024년 실적</th>
                    <th className="border px-2 py-1" rowSpan={2}>전체공급금액 2024년 실적</th>
                    <th className="border px-2 py-1" rowSpan={2}>물량 2025년 계획</th>
                    <th className="border px-2 py-1" rowSpan={2}>증감율</th>
                    <th className="border px-2 py-1" rowSpan={2}>금액</th>
                    <th className="border px-2 py-1" rowSpan={2}>거래처평균</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={3}>누적실적</th>
                    {months.map((m) => (
                      <th key={m} className="border px-2 py-1 bg-green-50" colSpan={3}>{m}</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    <th className="border px-1 py-1 bg-blue-50">물량</th>
                    <th className="border px-1 py-1 bg-blue-50">금액</th>
                    <th className="border px-1 py-1 bg-blue-50">달성율</th>
                    {months.map((m) => (
                      <>
                        <th key={`${m}-count`} className="border px-1 py-1 bg-green-50">거래처수</th>
                        <th key={`${m}-vol`} className="border px-1 py-1 bg-green-50">물량</th>
                        <th key={`${m}-amt`} className="border px-1 py-1 bg-green-50">금액</th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* B2C 총계 */}
                  <tr className="bg-yellow-100 font-bold">
                    <td className="border px-2 py-1" colSpan={3}>B2C 총계</td>
                    {[...Array(41)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>

                  {/* 맥심팀 → 합계 + 심경섭/이상욱 (소계 only) */}
                  <tr className="bg-blue-100 font-bold">
                    <td className="border px-2 py-1" rowSpan={3}>맥심팀</td>
                    <td className="border px-2 py-1" colSpan={2}>합계</td>
                    {[...Array(41)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  {['심경섭', '이상욱'].map((person) => (
                    <tr key={`t6-${person}`} className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1">{person}</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(41)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* 솔개팀 → 합계 + 박태원/박경식/김태일 (소계 only) */}
                  <tr className="bg-blue-100 font-bold">
                    <td className="border px-2 py-1" rowSpan={4}>솔개팀</td>
                    <td className="border px-2 py-1" colSpan={2}>합계</td>
                    {[...Array(41)].map((_, i) => (
                      <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                    ))}
                  </tr>
                  {['박태원', '박경식', '김태일'].map((person) => (
                    <tr key={`t6-${person}`} className="bg-blue-50 font-semibold">
                      <td className="border px-2 py-1">{person}</td>
                      <td className="border px-2 py-1">소계</td>
                      {[...Array(41)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* Other teams - collapsed */}
                  {['아리안팀', '미추홀팀', '랜더스팀', '클라쓰팀', '삼다도팀', '사무실'].map((team) => (
                    <tr key={`t6-${team}`} className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" colSpan={3}>{team} (collapsed)</td>
                      {[...Array(41)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 7: 제품별현황 */}
        {activeTab === 'tab7' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">55 제품별현황 - Product Status</h2>
            <p className="text-xs text-gray-600 mb-3">단위: KL (킬로리터)</p>

            {/* Product 1: Auto */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-blue-100 p-2 rounded">Auto</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>구분</th>
                      <th className="border px-2 py-1" rowSpan={2}>2025년 목표</th>
                      <th className="border px-2 py-1" rowSpan={2}>2024년 실적</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={5}>2025년 4/4분기</th>
                      <th className="border px-2 py-1" rowSpan={2}>2025년 4/4분기 목표</th>
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-2 py-1 bg-blue-50">목표</th>
                      <th className="border px-2 py-1 bg-blue-50">실적</th>
                      <th className="border px-2 py-1 bg-blue-50">달성율</th>
                      <th className="border px-2 py-1 bg-blue-50">전년실적</th>
                      <th className="border px-2 py-1 bg-blue-50">전년 대비<br/>증감율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Team A', 'Team B'].map((team, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{team}</td>
                        {[...Array(8)].map((_, i) => (
                          <td key={i} className="border px-2 py-1 text-right">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product 2: B2C */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-green-100 p-2 rounded">B2C</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            {/* Product 3: Mobil 1 - By Division */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-purple-100 p-2 rounded">Mobil 1 (By Division)</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            {/* Product 3: Mobil 1 - By Team */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-purple-100 p-2 rounded">Mobil 1 (By Team)</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            {/* Product 4: AIOP */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-orange-100 p-2 rounded">AIOP</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            {/* Product 5: TP */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-pink-100 p-2 rounded">TP</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            {/* Product 6: Special plus 's */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-yellow-100 p-2 rounded">Special plus 's</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            {/* Product 7: CVL (with subdivisions) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-indigo-100 p-2 rounded">CVL (AP/FP/CP/ESP K/MX/LEGEND)</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            {/* Product 8: LEGEND */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 bg-teal-100 p-2 rounded">LEGEND</h3>
              <p className="text-xs text-gray-500 mb-2">Same structure as Auto table above</p>
            </div>

            <p className="text-xs text-gray-500 mt-4 bg-gray-100 p-3 rounded">
              * Each product section shows Q4 performance by team/division with same column structure
            </p>
          </section>
        )}

        {/* Tab 8: 팀및전략딜러 */}
        {activeTab === 'tab8' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">팀및전략딜러 - Team & Strategic Dealers</h2>

            {/* Section: PV/CV */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Section: PV/CV</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>행 레이블</th>
                      <th className="border px-2 py-1 bg-gray-200" colSpan={2}>2023년</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={14}>2024년</th>
                      <th className="border px-2 py-1 bg-green-50" colSpan={14}>2025년</th>
                      <th className="border px-2 py-1" rowSpan={2}>평균 대비</th>
                      <th className="border px-2 py-1" rowSpan={2}>동기 대비</th>
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1">합계</th>
                      <th className="border px-1 py-1">월평균</th>
                      {allMonths.map(m => <th key={`2024-${m}`} className="border px-1 py-1 bg-blue-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-blue-100">합계</th>
                      <th className="border px-1 py-1 bg-blue-100">월평균</th>
                      {allMonths.map(m => <th key={`2025-${m}`} className="border px-1 py-1 bg-green-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-green-100">합계</th>
                      <th className="border px-1 py-1 bg-green-100">월평균</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      '1맥심팀', '2솔개팀', '3아리안팀', '4미추홀팀', '5랜더스팀',
                      '6클라쓰팀', '7삼다도팀', '8남부지사'
                    ].map((team, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{team}</td>
                        {[...Array(32)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="font-semibold bg-blue-100">
                      <td className="border px-2 py-1">팀합계</td>
                      {[...Array(32)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-2 py-1">9사무실</td>
                      {[...Array(32)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-2 py-1">B2B팀</td>
                      {[...Array(32)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-2 py-1">10B2B팀</td>
                      {[...Array(32)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                    <tr className="font-bold bg-gray-200">
                      <td className="border px-2 py-1">총합계</td>
                      {[...Array(32)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: 남부지사 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Section: 남부지사</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>행 레이블</th>
                      <th className="border px-2 py-1 bg-gray-200" colSpan={2}>2023년</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={14}>2024년</th>
                      <th className="border px-2 py-1 bg-green-50" colSpan={14}>2025년</th>
                      <th className="border px-2 py-1" rowSpan={2}>평균 대비</th>
                      <th className="border px-2 py-1" rowSpan={2}>동기 대비</th>
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1">합계</th>
                      <th className="border px-1 py-1">월평균</th>
                      {allMonths.map(m => <th key={`nb-2024-${m}`} className="border px-1 py-1 bg-blue-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-blue-100">합계</th>
                      <th className="border px-1 py-1 bg-blue-100">월평균</th>
                      {allMonths.map(m => <th key={`nb-2025-${m}`} className="border px-1 py-1 bg-green-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-green-100">합계</th>
                      <th className="border px-1 py-1 bg-green-100">월평균</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['매입', '매출'].map((type, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{type}</td>
                        {[...Array(32)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: 전략딜러 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Section: 전략딜러</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>판매처명</th>
                      <th className="border px-2 py-1 bg-gray-200" colSpan={2}>2023년</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={14}>2024년</th>
                      <th className="border px-2 py-1 bg-green-50" colSpan={14}>2025년</th>
                      <th className="border px-2 py-1" rowSpan={2}>평균 대비</th>
                      <th className="border px-2 py-1" rowSpan={2}>동기 대비</th>
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1">합계</th>
                      <th className="border px-1 py-1">월평균</th>
                      {allMonths.map(m => <th key={`sd-2024-${m}`} className="border px-1 py-1 bg-blue-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-blue-100">합계</th>
                      <th className="border px-1 py-1 bg-blue-100">월평균</th>
                      {allMonths.map(m => <th key={`sd-2025-${m}`} className="border px-1 py-1 bg-green-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-green-100">합계</th>
                      <th className="border px-1 py-1 bg-green-100">월평균</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      '모빌유화/오일프랜드',
                      '원창윤활유',
                      '이현상사',
                      '흥국상사(진병택)',
                      '영동모빌'
                    ].map((dealer, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{dealer}</td>
                        {[...Array(32)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="font-bold bg-gray-200">
                      <td className="border px-2 py-1">총합계</td>
                      {[...Array(32)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 9: 팀물량 */}
        {activeTab === 'tab9' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">팀물량 - Team Volume</h2>
            <p className="text-xs text-gray-600 mb-3">Section: PV/CV</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2}>팀명</th>
                    <th className="border px-2 py-1" rowSpan={2}>담당자코드명</th>
                    <th className="border px-2 py-1" rowSpan={2}>그룹</th>
                    <th className="border px-2 py-1 bg-gray-200" colSpan={2}>2023년</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={14}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={14}>2025년</th>
                    <th className="border px-2 py-1" rowSpan={2}>평균 대비</th>
                    <th className="border px-2 py-1" rowSpan={2}>동기 대비</th>
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    <th className="border px-1 py-1">합계</th>
                    <th className="border px-1 py-1">월평균</th>
                    {allMonths.map(m => <th key={`2024-${m}`} className="border px-1 py-1 bg-blue-50">{m}</th>)}
                    <th className="border px-1 py-1 bg-blue-100">합계</th>
                    <th className="border px-1 py-1 bg-blue-100">월평균</th>
                    {allMonths.map(m => <th key={`2025-${m}`} className="border px-1 py-1 bg-green-50">{m}</th>)}
                    <th className="border px-1 py-1 bg-green-100">합계</th>
                    <th className="border px-1 py-1 bg-green-100">월평균</th>
                  </tr>
                </thead>
                <tbody>
                  {['Team A / Manager / Group', 'Team B / Manager / Group'].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1" colSpan={3}>{row}</td>
                      {[...Array(32)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 10: 팀매출액 */}
        {activeTab === 'tab10' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">팀매출액 - Team Sales Amount</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">매출액(공급가) - Sales Amount (Supply Price)</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>팀명</th>
                      <th className="border px-2 py-1" rowSpan={2}>담당자코드명</th>
                      <th className="border px-2 py-1" rowSpan={2}>그룹</th>
                      <th className="border px-2 py-1 bg-gray-200" colSpan={2}>2023년</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={14}>2024년</th>
                      <th className="border px-2 py-1 bg-green-50" colSpan={14}>2025년</th>
                      <th className="border px-2 py-1" rowSpan={2}>평균 대비</th>
                      <th className="border px-2 py-1" rowSpan={2}>동기 대비</th>
                      <th className="border px-2 py-1" rowSpan={2}>동기 대비</th>
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-1 py-1">합계</th>
                      <th className="border px-1 py-1">월평균</th>
                      {allMonths.map(m => <th key={`2024-${m}`} className="border px-1 py-1 bg-blue-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-blue-100">합계</th>
                      <th className="border px-1 py-1 bg-blue-100">월평균</th>
                      {allMonths.map(m => <th key={`2025-${m}`} className="border px-1 py-1 bg-green-50">{m}</th>)}
                      <th className="border px-1 py-1 bg-green-100">합계</th>
                      <th className="border px-1 py-1 bg-green-100">월평균</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Team A / Manager / Group', 'Team B / Manager / Group'].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1" colSpan={3}>{row}</td>
                        {[...Array(33)].map((_, i) => (
                          <td key={i} className="border px-1 py-1 text-right text-xs">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        )}

        {/* Tab 11: 쇼핑몰판매현황 */}
        {activeTab === 'tab11' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">쇼핑몰판매현황 - Shopping Mall Sales Status</h2>

            {/* Table 1: Customer Count Analysis */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Table 1: Customer Count Analysis</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>구분</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={3}>회사 종점대상 거래처수</th>
                      <th className="border px-2 py-1 bg-green-50" colSpan={4}>현 인터넷 거래처수</th>
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-2 py-1 bg-blue-50">종합대상<br/>거래처수</th>
                      <th className="border px-2 py-1 bg-blue-50">의사목표수<br/>(50%)</th>
                      <th className="border px-2 py-1 bg-blue-50">최소목표(30%)<br/>지급 기준</th>
                      <th className="border px-2 py-1 bg-green-50">대상</th>
                      <th className="border px-2 py-1 bg-green-50">비대상</th>
                      <th className="border px-2 py-1 bg-green-50">불인정</th>
                      <th className="border px-2 py-1 bg-green-50">총거래처수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['동부사업소', '서부사업소', '중부사업소'].map((branch, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{branch}</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right bg-yellow-100">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1"></td>
                    </tr>
                    <tr className="font-bold bg-gray-200">
                      <td className="border px-2 py-1">총합계</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right bg-yellow-100">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Customer Breakdown by Branch */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Table 2: Customer Breakdown (대상/비대상)</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">거래처그룹1코드</th>
                      <th className="border px-2 py-1">대상</th>
                      <th className="border px-2 py-1">신규</th>
                      <th className="border px-2 py-1">인정여부</th>
                      <th className="border px-2 py-1">거래처수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 동부사업소 breakdown */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border px-2 py-1" rowSpan={8}>동부사업소</td>
                      <td className="border px-2 py-1" rowSpan={4}>대상</td>
                      <td className="border px-2 py-1" rowSpan={3}>신규</td>
                      <td className="border px-2 py-1">인정</td>
                      <td className="border px-2 py-1 text-right">19</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-2 py-1">기존</td>
                      <td className="border px-2 py-1 text-right">60</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-2 py-1">불인정</td>
                      <td className="border px-2 py-1 text-right">12</td>
                    </tr>
                    <tr className="bg-yellow-50 font-semibold">
                      <td className="border px-2 py-1" colSpan={2}>대상 요약</td>
                      <td className="border px-2 py-1 text-right">91</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border px-2 py-1" rowSpan={2}>비대상</td>
                      <td className="border px-2 py-1">기존</td>
                      <td className="border px-2 py-1">불인정</td>
                      <td className="border px-2 py-1 text-right">13</td>
                    </tr>
                    <tr className="bg-yellow-50 font-semibold">
                      <td className="border px-2 py-1" colSpan={2}>비대상 요약</td>
                      <td className="border px-2 py-1 text-right">13</td>
                    </tr>
                    <tr className="bg-yellow-100 font-bold">
                      <td className="border px-2 py-1" colSpan={3}>동부사업소 요약</td>
                      <td className="border px-2 py-1 text-right">104</td>
                    </tr>

                    {/* 서부사업소, 중부사업소 - same structure collapsed */}
                    {['서부사업소', '중부사업소'].map((branch) => (
                      <tr key={branch} className="bg-blue-100 font-bold">
                        <td className="border px-2 py-1" colSpan={4}>{branch} (same breakdown structure)</td>
                        <td className="border px-2 py-1 text-right">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: 합계금액 (Total Amount) */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Table 3: 합계금액 (Total Amount)</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1" rowSpan={2}>팀명</th>
                      <th className="border px-2 py-1" rowSpan={2}>비고</th>
                      <th className="border px-2 py-1 bg-gray-200" colSpan={2}>2023년</th>
                      <th className="border px-2 py-1 bg-blue-50" colSpan={2}>2024년</th>
                      <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                      <th className="border px-2 py-1" rowSpan={2}>총합계</th>
                    </tr>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border px-2 py-1">합계</th>
                      <th className="border px-2 py-1">평균</th>
                      <th className="border px-2 py-1">합계</th>
                      <th className="border px-2 py-1">평균</th>
                      {allMonths.map(m => (
                        <th key={m} className="border px-2 py-1 bg-green-50">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { team: '1맥심팀', type: '쇼핑몰' },
                      { team: '1맥심팀', type: '포인트' },
                      { team: '1맥심팀 요약', type: null },
                      { team: '2솔개팀', type: '쇼핑몰' },
                      { team: '2솔개팀', type: '포인트' },
                      { team: '2솔개팀 요약', type: null },
                      { team: '3아리안팀', type: '쇼핑몰' },
                      { team: '3아리안팀', type: '포인트' },
                      { team: '3아리안팀 요약', type: null },
                      { team: '5랜더스팀', type: '쇼핑몰' },
                      { team: '5랜더스팀', type: '포인트' },
                      { team: '5랜더스팀 요약', type: null },
                      { team: '6클라쓰팀', type: '쇼핑몰' },
                      { team: '6클라쓰팀', type: '포인트' },
                      { team: '6클라쓰팀 요약', type: null },
                      { team: '총합계', type: null },
                    ].map((row, idx) => (
                      <tr key={idx} className={`hover:bg-gray-50 ${row.team.includes('요약') || row.team === '총합계' ? 'font-semibold bg-gray-100' : ''}`}>
                        <td className="border px-2 py-1">{row.team}</td>
                        <td className="border px-2 py-1">{row.type || ''}</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        {[...Array(12)].map((_, i) => (
                          <td key={i} className="border px-2 py-1 text-right text-xs">-</td>
                        ))}
                        <td className="border px-2 py-1 text-right font-semibold">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the B2C회의자료 report with 11 tabs.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
