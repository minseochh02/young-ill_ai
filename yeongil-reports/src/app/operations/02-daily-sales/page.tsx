'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';
import BrandSalesVisualization from '@/components/visualizations/02-daily-sales/BrandSalesVisualization';
import CollectionsVisualization from '@/components/visualizations/02-daily-sales/CollectionsVisualization';
import PurchasesOrdersVisualization from '@/components/visualizations/02-daily-sales/PurchasesOrdersVisualization';
import InventoryVisualization from '@/components/visualizations/02-daily-sales/InventoryVisualization';
import KeyStatusVisualization from '@/components/visualizations/02-daily-sales/KeyStatusVisualization';
import NewCompaniesVisualization from '@/components/visualizations/02-daily-sales/NewCompaniesVisualization';

export default function Report02() {
  const brands = ['Mobil', 'Mobil-MB', '블라자 (Blazer)', '훅스 (Fuchs)', '기타(쉘 외 타사제품)'];
  const branches = [
    '화성IL',
    '창원',
    '화성auto(남부)',
    '화성auto(중부)',
    '인천(서부)',
    '남양주(동부)',
    '제주',
    '부산'
  ];

  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [showSection1Visualization, setShowSection1Visualization] = useState(false);
  const [showSection2Visualization, setShowSection2Visualization] = useState(false);
  const [showSection3Visualization, setShowSection3Visualization] = useState(false);
  const [showSection4Visualization, setShowSection4Visualization] = useState(false);
  const [showSection5Visualization, setShowSection5Visualization] = useState(false);
  const [showSection6Visualization, setShowSection6Visualization] = useState(false);

  // Master toggle function
  const toggleAllVisualizations = () => {
    const newValue = !(showSection1Visualization && showSection2Visualization &&
                       showSection3Visualization && showSection4Visualization &&
                       showSection5Visualization && showSection6Visualization);
    setShowSection1Visualization(newValue);
    setShowSection2Visualization(newValue);
    setShowSection3Visualization(newValue);
    setShowSection4Visualization(newValue);
    setShowSection5Visualization(newValue);
    setShowSection6Visualization(newValue);
  };

  const allVisualized = showSection1Visualization && showSection2Visualization &&
                        showSection3Visualization && showSection4Visualization &&
                        showSection5Visualization && showSection6Visualization;

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">02. 일일매출수금현황 (Branch Daily Sales & Collections)</h1>
          <p className="text-sm text-gray-500">Per-branch daily report. Each branch fills this in daily. Feeds into the 일보현황.</p>
        </div>
        <button
          onClick={toggleAllVisualizations}
          className={`px-6 py-3 rounded-lg font-semibold text-base transition-all shadow-lg ${
            allVisualized
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
          }`}
        >
          {allVisualized ? '📊 All Visualized' : '📋 Show All Visualizations'}
        </button>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Branch Selector */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Branch</h2>
        <div className="grid grid-cols-4 gap-3">
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                selectedBranch === branch
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-100 hover:shadow border border-gray-200'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-600 text-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Viewing Data For:</p>
            <p className="text-2xl font-bold">{selectedBranch}</p>
          </div>
          <div className="text-4xl opacity-50">📊</div>
        </div>
      </div>

      {/* Section 1: 판매현황 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">Section 1: 판매현황 (Sales Status)</h2>
          <button
            onClick={() => setShowSection1Visualization(!showSection1Visualization)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showSection1Visualization
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showSection1Visualization ? '📊 Visualized View' : '📋 Table View'}
          </button>
        </div>

        {showSection1Visualization ? (
          <BrandSalesVisualization date={selectedDate} branch={selectedBranch} />
        ) : (
          <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Brand</th>
                <th className="border px-3 py-2">전일누계</th>
                <th className="border px-3 py-2">당일</th>
                <th className="border px-3 py-2">누계</th>
                <th className="border px-3 py-2">비고</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-medium">{brand}</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2">-</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-100">
                <td className="border px-3 py-2">매출액</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
      </section>

      {/* Section 2: 수금현황 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">Section 2: 수금현황 (Collections Status)</h2>
          <button
            onClick={() => setShowSection2Visualization(!showSection2Visualization)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showSection2Visualization
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showSection2Visualization ? '📊 Visualized View' : '📋 Table View'}
          </button>
        </div>

        {showSection2Visualization ? (
          <CollectionsVisualization date={selectedDate} branch={selectedBranch} />
        ) : (
          <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">수금액</th>
                <th className="border px-3 py-2">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 pl-6">현금 (Cash)</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 pl-6">어음 (Notes/bills)</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 pl-6">카드 (Card)</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold bg-blue-100">
                <td className="border px-3 py-2 pl-6">합계 (Total collections)</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
      </section>

      {/* Section 3: 매입/발주 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">Section 3: 매입/발주 (Purchases / Orders)</h2>
          <button
            onClick={() => setShowSection3Visualization(!showSection3Visualization)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showSection3Visualization
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showSection3Visualization ? '📊 Visualized View' : '📋 Table View'}
          </button>
        </div>

        {showSection3Visualization ? (
          <PurchasesOrdersVisualization date={selectedDate} branch={selectedBranch} />
        ) : (
          <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">구분</th>
                <th className="border px-3 py-2">Vol(L)</th>
                <th className="border px-3 py-2">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">모빌</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">IL (Flagship) 매출</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2"></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">IL (Flagship) 매입</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
      </section>

      {/* Section 4: 재고 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">Section 4: 재고 (Inventory)</h2>
          <button
            onClick={() => setShowSection4Visualization(!showSection4Visualization)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showSection4Visualization
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showSection4Visualization ? '📊 Visualized View' : '📋 Table View'}
          </button>
        </div>

        {showSection4Visualization ? (
          <InventoryVisualization date={selectedDate} branch={selectedBranch} />
        ) : (
          <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Brand</th>
                <th className="border px-3 py-2">전일재고<br/>(Previous day)</th>
                <th className="border px-3 py-2">입고<br/>(Incoming)</th>
                <th className="border px-3 py-2">출고<br/>(Outgoing)</th>
                <th className="border px-3 py-2">재고<br/>(Current)</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-medium">{brand}</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-100">
                <td className="border px-3 py-2">Total</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2 text-right">-</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
      </section>

      {/* Additional Section: 주요현황 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">주요현황 (Key Status)</h2>
          <button
            onClick={() => setShowSection5Visualization(!showSection5Visualization)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showSection5Visualization
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showSection5Visualization ? '📊 Visualized View' : '📋 Table View'}
          </button>
        </div>

        {showSection5Visualization ? (
          <KeyStatusVisualization date={selectedDate} branch={selectedBranch} />
        ) : (
          <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">날짜</th>
                <th className="border px-3 py-2">상 호</th>
                <th className="border px-3 py-2">금  액</th>
                <th className="border px-3 py-2">비   고</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </section>

      {/* Additional Section: 신규개척업체 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">신규개척업체 (Newly Developed Companies)</h2>
          <button
            onClick={() => setShowSection6Visualization(!showSection6Visualization)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showSection6Visualization
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showSection6Visualization ? '📊 Visualized View' : '📋 Table View'}
          </button>
        </div>

        {showSection6Visualization ? (
          <NewCompaniesVisualization date={selectedDate} branch={selectedBranch} />
        ) : (
          <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">날짜</th>
                <th className="border px-3 py-2">상 호</th>
                <th className="border px-3 py-2">소재지</th>
                <th className="border px-3 py-2">비   고</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 일일매출수금현황 report.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
