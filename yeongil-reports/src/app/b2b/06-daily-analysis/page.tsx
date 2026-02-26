'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';
import B2BSalesVisualization from '@/components/visualizations/06-b2b-daily-analysis/B2BSalesVisualization';

// Type definitions for B2B sales data structure
interface Product {
  name: string;
  qty: number;
  price: number;
  supply: number;
  dsp: number;
  asp: number;
  otherCosts?: number;
  profit_dsp: number;
  profit_asp: number;
  rate_dsp: number;
  rate_asp: number;
  remarks?: string;
}

interface Customer {
  name: string;
  products: Product[];
}

interface Manager {
  name: string;
  customers: Customer[];
}

interface Branch {
  name: string;
  managers: Manager[];
}

interface B2BData {
  branches: Branch[];
}

// Mock data structure based on actual Excel hierarchy
const mockData: B2BData = {
  branches: [
    {
      name: '화성사업소',
      managers: [
        {
          name: '조성호',
          customers: [
            {
              name: '(주) 수산세보틱스',
              products: [
                { name: 'MOBIL DTE 22 ULTRA [200]', qty: 3, price: 572000, supply: 1716000, dsp: 520000, asp: 156000, otherCosts: 0, profit_dsp: 1040000, profit_asp: 1404000, rate_dsp: 60.6, rate_asp: 81.8 }
              ]
            },
            {
              name: '(주)서브원',
              products: [
                { name: 'MOBIL DTE 25 ULTRA [200]', qty: 1, price: 567500, supply: 567500, dsp: 492000, asp: 492000, otherCosts: 0, profit_dsp: 75500, profit_asp: 75500, rate_dsp: 13.3, rate_asp: 13.3 }
              ]
            },
            {
              name: 'AJ네트웍스 주식회사',
              products: [
                { name: 'MOBIL DELVAC LEGEND 10W40 [20]', qty: 9, price: 64000, supply: 576000, dsp: 55200, asp: 55200, otherCosts: 0, profit_dsp: 79200, profit_asp: 79200, rate_dsp: 13.75, rate_asp: 13.75 }
              ]
            },
            {
              name: '롯데오토케어(주)',
              products: [
                { name: 'MOBIL SUPER TP TURBO 0W30 [1/12]', qty: 70, price: 73992, supply: 5179440, dsp: 50300, asp: 50300, otherCosts: 0, profit_dsp: 1658440, profit_asp: 1658440, rate_dsp: 32.0, rate_asp: 32.0 }
              ]
            }
          ]
        },
        {
          name: '정현우',
          customers: [
            {
              name: '(주)리워터',
              products: [
                { name: 'MOBIL PEGASUS 610-sp [200]', qty: 4, price: 900000, supply: 3600000, dsp: 630000, asp: 630000, otherCosts: 0, profit_dsp: 1080000, profit_asp: 1080000, rate_dsp: 30.0, rate_asp: 30.0 }
              ]
            },
            {
              name: '한국서부발전주식회사태안발전본부',
              products: [
                { name: 'MOBIL DTE 732-sp [200]', qty: 4, price: 790000, supply: 3160000, dsp: 575000, asp: 575000, otherCosts: 0, profit_dsp: 860000, profit_asp: 860000, rate_dsp: 27.2, rate_asp: 27.2 }
              ]
            }
          ]
        },
        { name: '김중경', customers: [] },
        { name: '김기진', customers: [] },
        { name: '임재창', customers: [] },
        { name: '김건우', customers: [] }
      ]
    },
    {
      name: '창원사업소',
      managers: [
        { name: '박경묵', customers: [] },
        { name: '이성욱', customers: [] },
        { name: '조종복', customers: [] }
      ]
    },
    {
      name: '부산사업소',
      managers: [
        { name: '김철주', customers: [] }
      ]
    }
  ]
};

export default function Report06() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showVisualization, setShowVisualization] = useState(false);

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">06. B2B일일매출분석 (B2B Daily Sales Analysis)</h1>
          <p className="text-sm text-gray-500">Daily overview of all branches' B2B sales performance with profitability analysis.</p>
        </div>
        <button
          onClick={() => setShowVisualization(!showVisualization)}
          className={`px-6 py-3 rounded-lg font-semibold text-base transition-all shadow-lg ${
            showVisualization
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
          }`}
        >
          {showVisualization ? '📊 Visualized View' : '📋 Show Visualization'}
        </button>
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
          {showVisualization ? (
            <B2BSalesVisualization />
          ) : (
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
                      <th className="border px-2 py-1 bg-green-50" colSpan={3}>구매현황</th>
                      <th className="border px-2 py-1 bg-purple-50" colSpan={2}>매출이익</th>
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
                      <th className="border px-2 py-1 text-xs bg-green-50">기타비용<br/>(운임 외)</th>
                      {/* 매출이익 */}
                      <th className="border px-2 py-1 text-xs bg-purple-50">매출이익(DSP)</th>
                      <th className="border px-2 py-1 text-xs bg-purple-50">매출이익(ASP)</th>
                      {/* 이익율 */}
                      <th className="border px-2 py-1 text-xs bg-orange-50">이익률(DSP)</th>
                      <th className="border px-2 py-1 text-xs bg-orange-50">이익율(ASP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.branches.map((branch, bIdx) => (
                      <>
                        {/* 사업소 */}
                        <tr key={`branch-${bIdx}`} className="bg-indigo-100 font-bold">
                          <td className="border px-3 py-2" colSpan={12}>{branch.name}</td>
                        </tr>

                        {/* 영업사원 */}
                        {branch.managers.map((manager, mIdx) => (
                          <>
                            <tr key={`manager-${bIdx}-${mIdx}`} className="bg-blue-50 font-semibold">
                              <td className="border px-3 py-2 pl-8" colSpan={12}>
                                {manager.name} {manager.customers.length > 0 && `(담당 고객사 ${manager.customers.length}개)`}
                              </td>
                            </tr>

                            {/* 고객사 */}
                            {manager.customers.map((customer, cIdx) => (
                              <>
                                <tr key={`customer-${bIdx}-${mIdx}-${cIdx}`} className="bg-gray-100">
                                  <td className="border px-3 py-2 pl-12" colSpan={12}>{customer.name}</td>
                                </tr>

                                {/* 품목 */}
                                {customer.products.map((product, pIdx) => (
                                  <tr key={`product-${bIdx}-${mIdx}-${cIdx}-${pIdx}`} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2 pl-16 text-xs">{product.name}</td>
                                    <td className="border px-2 py-1 text-right">{product.qty.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right">{product.price.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right">{product.supply.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right">{product.dsp.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right">{product.asp.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right">{product.otherCosts ? product.otherCosts.toLocaleString() : '-'}</td>
                                    <td className="border px-2 py-1 text-right">{product.profit_dsp.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right">{product.profit_asp.toLocaleString()}</td>
                                    <td className="border px-2 py-1 text-right">{product.rate_dsp.toFixed(1)}%</td>
                                    <td className="border px-2 py-1 text-right">{product.rate_asp.toFixed(1)}%</td>
                                    <td className="border px-2 py-1">{product.remarks || '-'}</td>
                                  </tr>
                                ))}
                              </>
                            ))}
                          </>
                        ))}
                      </>
                    ))}

                    {/* Summary Row */}
                    <tr className="font-bold bg-yellow-100">
                      <td className="border px-3 py-2">전체 합계</td>
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
                    <p className="text-gray-600">DSP (Distributor Selling Price), ASP (Actual Selling Price), 기타비용(운임 외)</p>
                  </div>
                  <div>
                    <p className="font-medium">매출이익 (Sales Profit)</p>
                    <p className="text-gray-600">매출이익(DSP), 매출이익(ASP)</p>
                  </div>
                  <div>
                    <p className="font-medium">이익율 (Profit Rate %)</p>
                    <p className="text-gray-600">이익률(DSP), 이익율(ASP)</p>
                  </div>
                </div>
              </div>
            </section>
          )}
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
