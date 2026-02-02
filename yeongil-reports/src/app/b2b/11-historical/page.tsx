'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';
import InfoModal from '@/components/InfoModal';

export default function Report11() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('tab2');
  const [isDataStandardsOpen, setIsDataStandardsOpen] = useState(false);
  const [isClassificationOpen, setIsClassificationOpen] = useState(false);

  const tabs = [
    { id: 'tab2', name: '산업별', label: 'By Industry' },
    { id: 'tab3', name: '팀별', label: 'By Team' },
    { id: 'tab4', name: '제품군', label: 'Product Group' },
    { id: 'tab5', name: '거래처별', label: 'By Customer' },
    { id: 'tab6', name: 'FPS', label: 'FPS' },
    { id: 'tab7', name: '지역', label: 'Region' },
    { id: 'tab8', name: '신규', label: 'New Customers' },
    { id: 'tab9', name: '산업유제품명', label: 'Industrial Products' },
    { id: 'tab10', name: '전제품 판매', label: 'All Products' },
    { id: 'tab11', name: '누적실적', label: 'Cumulative Results' },
    { id: 'tab12', name: '거래처현황', label: 'Customer Status' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">11. B2B자료 (B2B Historical Data)</h1>
          <button
            onClick={() => setIsDataStandardsOpen(true)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow flex items-center gap-2"
            title="View Data Organization Standards"
          >
            <span className="text-lg">ℹ️</span>
            <span>Data Standards</span>
          </button>
          <button
            onClick={() => setIsClassificationOpen(true)}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow flex items-center gap-2"
            title="View Classification Reference"
          >
            <span className="text-lg">📋</span>
            <span>Classification Ref</span>
          </button>
        </div>
        <p className="text-sm text-gray-500">Reference data for trend comparison during closing meetings.</p>
      </div>

      {/* Data Standards Modal */}
      <InfoModal
        isOpen={isDataStandardsOpen}
        onClose={() => setIsDataStandardsOpen(false)}
        title="자료 기준 (Data Organization Standards)"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-3">자료 정리 기준</h3>

          <ol className="space-y-3 text-sm">
            <li><strong>기본 기준:</strong> Data is organized based on customer registration information in the ERP system (담당자, 업종, 지역 등).</li>

            <li><strong>가상업체 등록:</strong> For MRO companies or cases where companies sell to specific customers/industries, virtual companies are registered separately in the system to match actual transactions. (2022-2023 data was organized based on voucher description content)</li>

            <li><strong>2024년 이후:</strong> Except for some January entries, items 1-2 above are recorded in vouchers and created based on the ERP system. Sales reps who want to apply different classification than the ERP must request virtual company registration from the management support team during sales.</li>

            <li><strong>B2C 산업유:</strong> Industrial oil products sold in the B2C segment - only Mobil industrial oil products are separately added.</li>

            <li>
              <strong>Historical Data Adjustments:</strong>
              <ul className="ml-6 mt-2 space-y-1">
                <li><strong>2022:</strong> Included sales from 중앙, excluded sales from 영일 to 중앙, excluded duplicate 현대중공업/삼광엔씨 transactions</li>
                <li><strong>2023:</strong> Excluded duplicate 현대중공업/삼광오엔씨 transactions</li>
                <li><strong>2024:</strong> Excluded duplicate 현대중공업/삼광오엔씨 transactions</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-sm">
          <p className="font-semibold">⚠️ Important Note:</p>
          <p className="mt-1">If customer registration information needs correction, request modifications from the management support team. When data is corrected in the ERP, historical data is automatically updated as well.</p>
        </div>
      </InfoModal>

      {/* Classification Reference Modal */}
      <InfoModal
        isOpen={isClassificationOpen}
        onClose={() => setIsClassificationOpen(false)}
        title="분류기준 (Classification Standards)"
      >
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">분류기준 (Classification Standard)</h3>
            <p className="text-sm text-gray-700">Reference table for classification codes and standards used across the system. Used for internal tracking and maintaining consistency in data categorization.</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">분류기준 신규 (Classification Standard New)</h3>
            <p className="text-sm text-gray-700">Reference table for new classification codes and standards. Used for internal tracking and maintaining consistency in data categorization.</p>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm">
            <p className="text-gray-600">These reference tables contain code mappings and classification hierarchies used throughout the B2B data analysis.</p>
          </div>
        </div>
      </InfoModal>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Tab Navigation - 2 rows for 14 tabs */}
      <div className="mb-6 border-b-2 border-gray-200">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
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
        {activeTab === 'tab2' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">산업별 (By Industry) - Pivot Analysis</h2>
            <p className="text-xs text-gray-600 mb-3">품목그룹1코드: IL | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2}>행 레이블</th>
                    <th className="border px-2 py-1" rowSpan={2}>산업분류</th>
                    <th className="border px-2 py-1" rowSpan={2}>sector</th>
                    <th className="border px-2 py-1" rowSpan={2}>영일분류</th>
                    <th className="border px-2 py-1" rowSpan={2}>IL팀</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={10}>2024년</th>
                    <th className="border px-2 py-1 bg-blue-100">2024년 요약</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={10}>2025년</th>
                    <th className="border px-2 py-1 bg-green-100">2025년 요약</th>
                    <th className="border px-2 py-1" rowSpan={2}>총합계</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월'].map(m => (
                      <th key={`2024-${m}`} className="border px-1 py-1 text-xs bg-blue-50">{m}</th>
                    ))}
                    <th className="border px-1 py-1 text-xs bg-blue-100">요약</th>
                    {['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월'].map(m => (
                      <th key={`2025-${m}`} className="border px-1 py-1 text-xs bg-green-50">{m}</th>
                    ))}
                    <th className="border px-1 py-1 text-xs bg-green-100">요약</th>
                  </tr>
                </thead>
                <tbody>
                  {['energy', 'manufacturing', 'manufacturing 요약', 'metals', 'process', 'pulp&paper', 'reseller', 'reseller 요약', '총합계'].map((industry, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${industry.includes('요약') || industry === '총합계' ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{industry}</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      {[...Array(22)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab3' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">팀별 (By Team) - Organizational View</h2>
            <p className="text-xs text-gray-600 mb-3">품목그룹1코드: IL | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2}>행 레이블</th>
                    <th className="border px-2 py-1" rowSpan={2}>IL팀</th>
                    <th className="border px-2 py-1" rowSpan={2}>IL담당</th>
                    <th className="border px-2 py-1" rowSpan={2}>산업분류</th>
                    <th className="border px-2 py-1" rowSpan={2}>sector</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={10}>2024년</th>
                    <th className="border px-2 py-1 bg-blue-100">2024년 요약</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={10}>2025년</th>
                    <th className="border px-2 py-1 bg-green-100">2025년 요약</th>
                    <th className="border px-2 py-1" rowSpan={2}>총합계</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월'].map(m => (
                      <th key={`2024-${m}`} className="border px-1 py-1 text-xs bg-blue-50">{m}</th>
                    ))}
                    <th className="border px-1 py-1 text-xs bg-blue-100">요약</th>
                    {['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월'].map(m => (
                      <th key={`2025-${m}`} className="border px-1 py-1 text-xs bg-green-50">{m}</th>
                    ))}
                    <th className="border px-1 py-1 text-xs bg-green-100">요약</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '화성사업소', isSummary: false },
                    { name: '화성사업소 요약', isSummary: true },
                    { name: '경남사업소', isSummary: false },
                    { name: '경남사업소 요약', isSummary: true },
                    { name: 'B2C', isSummary: false },
                    { name: 'B2C 요약', isSummary: true },
                    { name: '총합계', isSummary: true },
                  ].map((item, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${item.isSummary ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{item.name}</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      {[...Array(22)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab4' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">제품군 (Product Group) - Product Tier Analysis</h2>
            <p className="text-xs text-gray-600 mb-3">품목그룹1코드: IL | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>행 레이블</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                    <th className="border px-2 py-1" rowSpan={3}>총합계</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {[1,2,3,4].map(q => (
                      <th key={`2024-Q${q}`} className="border px-1 py-1 text-xs bg-blue-50" colSpan={3}>{q}사분기</th>
                    ))}
                    {[1,2,3,4].map(q => (
                      <th key={`2025-Q${q}`} className="border px-1 py-1 text-xs bg-green-50" colSpan={3}>{q}사분기</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    {[...Array(8)].map((_, qIdx) => (
                      ['1월','2월','3월'].map((m, mIdx) => (
                        <th key={`q${qIdx}-${mIdx}`} className="border px-1 py-1">{(qIdx % 4) * 3 + mIdx + 1}월</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['0', 'Standard', 'Premium', 'Flagship', 'Alliance', '총합계'].map((tier, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${tier === '총합계' ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{tier}</td>
                      {[...Array(24)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                      <td className="border px-2 py-1 text-right font-semibold">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab5' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">거래처별 (By Customer) - Customer-level Analysis</h2>
            <p className="text-xs text-gray-600 mb-3">품목그룹1코드: IL | 공급가액: (모두) | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>행 레이블</th>
                    <th className="border px-2 py-1" rowSpan={3}>IL팀</th>
                    <th className="border px-2 py-1" rowSpan={3}>IL담당</th>
                    <th className="border px-2 py-1" rowSpan={3}>sector</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                    <th className="border px-2 py-1" rowSpan={3}>총합계</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {[1,2,3,4].map(q => (
                      <th key={`2024-Q${q}`} className="border px-1 py-1 text-xs bg-blue-50" colSpan={3}>{q}사분기</th>
                    ))}
                    {[1,2,3,4].map(q => (
                      <th key={`2025-Q${q}`} className="border px-1 py-1 text-xs bg-green-50" colSpan={3}>{q}사분기</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    {[...Array(8)].map((_, qIdx) => (
                      ['1월','2월','3월'].map((m, mIdx) => (
                        <th key={`q${qIdx}-${mIdx}`} className="border px-1 py-1">{(qIdx % 4) * 3 + mIdx + 1}월</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '화성사업소', isSummary: false },
                    { name: '화성사업소 요약', isSummary: true },
                    { name: '경남사업소', isSummary: false },
                    { name: '경남사업소 요약', isSummary: true },
                    { name: 'B2C', isSummary: false },
                    { name: '총합계', isSummary: true },
                  ].map((item, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${item.isSummary ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{item.name}</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      {[...Array(24)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                      <td className="border px-2 py-1 text-right font-semibold">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab6' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">FPS - Flagship/Premium/Standard Analysis</h2>
            <p className="text-xs text-gray-600 mb-3">품목그룹1코드 | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>행 레이블</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {[1,2,3,4].map(q => (
                      <th key={`2024-Q${q}`} className="border px-1 py-1 text-xs bg-blue-50" colSpan={3}>{q}사분기</th>
                    ))}
                    {[1,2,3,4].map(q => (
                      <th key={`2025-Q${q}`} className="border px-1 py-1 text-xs bg-green-50" colSpan={3}>{q}사분기</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    {[...Array(8)].map((_, qIdx) => (
                      ['1월','2월','3월'].map((m, mIdx) => (
                        <th key={`q${qIdx}-${mIdx}`} className="border px-1 py-1">{(qIdx % 4) * 3 + mIdx + 1}월</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['FLA', 'PRE', 'STA', '총합계'].map((tier, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${tier === '총합계' ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1 font-medium">{tier}</td>
                      {[...Array(24)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab7' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">지역 (Region) - Geographic Analysis</h2>
            <p className="text-xs text-gray-600 mb-3">품목그룹1코드 | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>행 레이블</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {[1,2,3,4].map(q => (
                      <th key={`2024-Q${q}`} className="border px-1 py-1 text-xs bg-blue-50" colSpan={3}>{q}사분기</th>
                    ))}
                    {[1,2,3,4].map(q => (
                      <th key={`2025-Q${q}`} className="border px-1 py-1 text-xs bg-green-50" colSpan={3}>{q}사분기</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    {[...Array(8)].map((_, qIdx) => (
                      ['1월','2월','3월'].map((m, mIdx) => (
                        <th key={`q${qIdx}-${mIdx}`} className="border px-1 py-1">{(qIdx % 4) * 3 + mIdx + 1}월</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['서울경기', '충청', '경남', '총합계'].map((region, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${region === '총합계' ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{region}</td>
                      {[...Array(24)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab8' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">신규 (New Customers) - New Customer Tracking</h2>
            <p className="text-xs text-gray-600 mb-3">품목그룹1코드 | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>행 레이블 (Company Name)</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                    <th className="border px-2 py-1" rowSpan={3}>총합계</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {[1,2,3,4].map(q => (
                      <th key={`2024-Q${q}`} className="border px-1 py-1 text-xs bg-blue-50" colSpan={3}>{q}사분기</th>
                    ))}
                    {[1,2,3,4].map(q => (
                      <th key={`2025-Q${q}`} className="border px-1 py-1 text-xs bg-green-50" colSpan={3}>{q}사분기</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    {[...Array(8)].map((_, qIdx) => (
                      ['1월','2월','3월'].map((m, mIdx) => (
                        <th key={`q${qIdx}-${mIdx}`} className="border px-1 py-1">{(qIdx % 4) * 3 + mIdx + 1}월</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['주식회사 티엔엠', 'Company B', 'Company C', '총합계'].map((company, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${company === '총합계' ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{company}</td>
                      {[...Array(24)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                      <td className="border px-2 py-1 text-right font-semibold">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab9' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">산업유제품명 (Industry Product Name) - Product Detail</h2>
            <p className="text-xs text-gray-600 mb-3">영일분류: (다중 항목) | 합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>Product Name</th>
                    <th className="border px-2 py-1" rowSpan={3}>단위</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {[1,2,3,4].map(q => (
                      <th key={`2024-Q${q}`} className="border px-1 py-1 text-xs bg-blue-50" colSpan={3}>{q}사분기</th>
                    ))}
                    {[1,2,3,4].map(q => (
                      <th key={`2025-Q${q}`} className="border px-1 py-1 text-xs bg-green-50" colSpan={3}>{q}사분기</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    {[...Array(8)].map((_, qIdx) => (
                      ['1월','2월','3월'].map((m, mIdx) => (
                        <th key={`q${qIdx}-${mIdx}`} className="border px-1 py-1">{(qIdx % 4) * 3 + mIdx + 1}월</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'MOBIL FLUID 424', unit: 'Drum' },
                    { name: 'Product A', unit: 'box' },
                    { name: 'Product B', unit: 'EA' },
                  ].map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{product.name}</td>
                      <td className="border px-2 py-1 text-center font-medium">{product.unit}</td>
                      {[...Array(24)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab10' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">전제품 판매 (All Products Sales) - Comprehensive View</h2>
            <p className="text-xs text-gray-600 mb-3">합계 : 중량</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={3}>행 레이블</th>
                    <th className="border px-2 py-1" rowSpan={3}>담당자</th>
                    <th className="border px-2 py-1" rowSpan={3}>판매처명</th>
                    <th className="border px-2 py-1 bg-blue-50" colSpan={12}>2024년</th>
                    <th className="border px-2 py-1 bg-green-50" colSpan={12}>2025년</th>
                    <th className="border px-2 py-1" rowSpan={3}>총합계</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {[1,2,3,4].map(q => (
                      <th key={`2024-Q${q}`} className="border px-1 py-1 text-xs bg-blue-50" colSpan={3}>{q}사분기</th>
                    ))}
                    {[1,2,3,4].map(q => (
                      <th key={`2025-Q${q}`} className="border px-1 py-1 text-xs bg-green-50" colSpan={3}>{q}사분기</th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    {[...Array(8)].map((_, qIdx) => (
                      ['1월','2월','3월'].map((m, mIdx) => (
                        <th key={`q${qIdx}-${mIdx}`} className="border px-1 py-1">{(qIdx % 4) * 3 + mIdx + 1}월</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['산업1팀', '산업2팀', '산업3팀', '산업4팀', '창원팀', '부산팀', 'AUTO', '총합계'].map((team, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${team === '총합계' ? 'font-semibold bg-gray-100' : ''}`}>
                      <td className="border px-2 py-1">{team}</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                      {[...Array(24)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-right">-</td>
                      ))}
                      <td className="border px-2 py-1 text-right font-semibold">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tab11' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">누적실적 (Cumulative Results) - Raw Transaction Data</h2>
            <p className="text-xs text-gray-600 mb-3">Source data for all pivot tables - one row per transaction</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr className="bg-gray-50 text-xs">
                    <th className="border px-1 py-1">날자</th>
                    <th className="border px-1 py-1">거래처그룹1</th>
                    <th className="border px-1 py-1">거래처코드</th>
                    <th className="border px-1 py-1">실거래처</th>
                    <th className="border px-1 py-1">ERP담당자</th>
                    <th className="border px-1 py-1">담당자</th>
                    <th className="border px-1 py-1">판매처명</th>
                    <th className="border px-1 py-1">품목코드</th>
                    <th className="border px-1 py-1">품목명</th>
                    <th className="border px-1 py-1">단위</th>
                    <th className="border px-1 py-1">규격명</th>
                    <th className="border px-1 py-1">수량</th>
                    <th className="border px-1 py-1">중량</th>
                    <th className="border px-1 py-1">단가</th>
                    <th className="border px-1 py-1">공급가액</th>
                    <th className="border px-1 py-1">합 계</th>
                    <th className="border px-1 py-1">품목그룹1코드</th>
                    <th className="border px-1 py-1">품목그룹2명</th>
                    <th className="border px-1 py-1">품목그룹3코드</th>
                    <th className="border px-1 py-1">창고명</th>
                    <th className="border px-1 py-1">거래처그룹2명</th>
                    <th className="border px-1 py-1">신규일</th>
                    <th className="border px-1 py-1">적요</th>
                    <th className="border px-1 py-1">적요2</th>
                    <th className="border px-1 py-1">코드변경</th>
                    <th className="border px-1 py-1">실납업체</th>
                    <th className="border px-1 py-1">업종</th>
                    <th className="border px-1 py-1">지역</th>
                    <th className="border px-1 py-1">IL사업소</th>
                    <th className="border px-1 py-1">IL팀</th>
                    <th className="border px-1 py-1">IL담당</th>
                    <th className="border px-1 py-1">모빌분류</th>
                    <th className="border px-1 py-1">산업분류</th>
                    <th className="border px-1 py-1">sector</th>
                    <th className="border px-1 py-1">영일분류</th>
                    <th className="border px-1 py-1">지역3</th>
                    <th className="border px-1 py-1">품목그룹</th>
                    <th className="border px-1 py-1">사업유제품명</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(15)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {[...Array(38)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-xs">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">* 38 columns total - comprehensive transaction log feeding all pivot tables</p>
          </section>
        )}

        {activeTab === 'tab12' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">거래처현황 (Customer Status) - Customer Master Data</h2>
            <p className="text-xs text-gray-600 mb-3">Customer registration and classification information from ERP</p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr className="bg-gray-50 text-xs">
                    <th className="border px-1 py-1">거래처코드</th>
                    <th className="border px-1 py-1">세무신고거래처코드</th>
                    <th className="border px-1 py-1">거래처명</th>
                    <th className="border px-1 py-1">대표자명</th>
                    <th className="border px-1 py-1">담당자명</th>
                    <th className="border px-1 py-1">검색창내용</th>
                    <th className="border px-1 py-1">업태</th>
                    <th className="border px-1 py-1">종목</th>
                    <th className="border px-1 py-1">거래처그룹1명</th>
                    <th className="border px-1 py-1">거래처그룹2명</th>
                    <th className="border px-1 py-1">주소1</th>
                    <th className="border px-1 py-1">거래처계층그룹명</th>
                    <th className="border px-1 py-1">RTS코드</th>
                    <th className="border px-1 py-1">코드변경</th>
                    <th className="border px-1 py-1">신규일</th>
                    <th className="border px-1 py-1">업종분류코드</th>
                    <th className="border px-1 py-1">지역코드</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(15)].map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {[...Array(17)].map((_, i) => (
                        <td key={i} className="border px-1 py-1 text-xs">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">* 17 columns total - customer master data used for classification enrichment</p>
          </section>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the B2B자료 report with 11 data tabs.</p>
        <p className="mt-2">Reference documentation (자료 기준, 분류기준) accessible via info buttons above.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
