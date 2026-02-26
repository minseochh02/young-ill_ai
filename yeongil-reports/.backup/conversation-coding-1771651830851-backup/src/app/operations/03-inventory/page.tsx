'use client';

import { useState, useEffect } from 'react';
import DateSelector from '@/components/DateSelector';
import InventoryTrackingVisualization from '@/components/visualizations/03-inventory/InventoryTrackingVisualization';
import { queryTable, aggregateTable } from '@/../../egdesk-helpers';

export default function Report03() {
  const branches = [
    '통합',
    '화성(서울)',
    '창원',
    '남양주',
    '인천',
    '화성오토',
    '제주',
    '부산'
  ];

  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showVisualization, setShowVisualization] = useState(false);
  
  // Data states
  const [purchasesData, setPurchasesData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data when date or branch changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch purchases data grouped by product type
        const purchases = await aggregateTable(
          'purchases',
          '중량',
          'SUM',
          {
            filters: {
              '일자': `<=${selectedDate}`
            },
            groupBy: '품목그룹2명'
          }
        );
        
        // Fetch sales data grouped by product type
        const sales = await aggregateTable(
          'sales',
          '중량',
          'SUM',
          {
            filters: {
              '일자': `<=${selectedDate}`
            },
            groupBy: '품목그룹2명'
          }
        );

        setPurchasesData(purchases);
        setSalesData(sales);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, selectedBranch]);

  // Helper function to get value from aggregated data
  const getAggregatedValue = (data: any, productType: string) => {
    if (!data || !data.results) return 0;
    const result = data.results.find((r: any) => r['품목그룹2명'] === productType);
    return result ? Number(result.value || 0) : 0;
  };

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    if (num === 0) return '-';
    return num.toLocaleString();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">03. 재고파악시트 (Inventory Tracking)</h1>
          <p className="text-sm text-gray-500">Daily inventory tracking with totals shown for each day. Total summary provided at the end of each month.</p>
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

      {/* Branch Selector */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Branch / View</h2>
        <div className="grid grid-cols-5 gap-3">
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                selectedBranch === branch
                  ? 'bg-green-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-100 hover:shadow border border-gray-200'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-green-600 text-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Viewing Data For:</p>
            <p className="text-2xl font-bold">{selectedBranch}</p>
          </div>
          <div className="text-4xl opacity-50">📦</div>
        </div>
      </div>

      {/* Inventory Tracking Table */}
      <section className="mb-12">
        {showVisualization ? (
          <InventoryTrackingVisualization />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Inventory Movement Tracking</h2>
              <span className="text-base font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded">단위 : Liter</span>
            </div>

            <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2" rowSpan={2}>구분</th>
                <th className="border px-3 py-2" rowSpan={2}>Product Division</th>
                <th className="border px-3 py-2" rowSpan={2}>Type</th>
                <th className="border px-3 py-2">Values (L)</th>
              </tr>
            </thead>
            <tbody>
              {/* 기초재고 (Opening Inventory) */}
              <tr className="bg-blue-50">
                <td className="border px-3 py-2 font-bold" rowSpan={5}>기초재고<br/>(Opening Inventory)</td>
                <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border px-3 py-2 font-medium">MB</td>
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>

              {/* 매입 (Purchases) */}
              <tr className="bg-green-50">
                <td className="border px-3 py-2 font-bold" rowSpan={5}>매입<br/>(Purchases)</td>
                <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">
                  {loading ? '...' : formatNumber(getAggregatedValue(purchasesData, 'Auto-Flagship'))}
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">
                  {loading ? '...' : formatNumber(getAggregatedValue(purchasesData, 'Auto-Others'))}
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">
                  {loading ? '...' : formatNumber(getAggregatedValue(purchasesData, 'IL-Flagship'))}
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">
                  {loading ? '...' : formatNumber(getAggregatedValue(purchasesData, 'IL-Others'))}
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="border px-3 py-2 font-medium">MB</td>
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">
                  {loading ? '...' : formatNumber(getAggregatedValue(purchasesData, 'MB-Others'))}
                </td>
              </tr>

              {/* 매출 (Sales) */}
              <tr className="bg-purple-50">
                <td className="border px-3 py-2 font-bold" rowSpan={5}>매출<br/>(Sales)</td>
                <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-purple-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-purple-50">
                <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-purple-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-purple-50">
                <td className="border px-3 py-2 font-medium">MB</td>
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>

              {/* 이동 (Transfers/Movement) */}
              <tr className="bg-orange-50">
                <td className="border px-3 py-2 font-bold" rowSpan={5}>이동<br/>(Transfers)</td>
                <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-orange-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-orange-50">
                <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-orange-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-orange-50">
                <td className="border px-3 py-2 font-medium">MB</td>
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>

              {/* 재고 (Inventory) */}
              <tr className="bg-yellow-50">
                <td className="border px-3 py-2 font-bold" rowSpan={5}>재고<br/>(Inventory)</td>
                <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                <td className="border px-3 py-2 pl-6">Flagship</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border px-3 py-2 font-medium">MB</td>
                <td className="border px-3 py-2 pl-6">Others</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>

              {/* Grand Total */}
              <tr className="bg-gray-200 font-bold text-sm">
                <td className="border px-3 py-2" colSpan={3}>Total</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
          </>
        )}
      </section>

      {/* Additional tables for 통합 view only */}
      {selectedBranch === '통합' && (
        <>
          {/* 동부재고 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">동부재고 (East Branch Inventory)</h2>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">Product Division</th>
                    <th className="border px-3 py-2">Type</th>
                    <th className="border px-3 py-2">Values (L)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                    <td className="border px-3 py-2 pl-6">Flagship</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border px-3 py-2 pl-6">Others</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                    <td className="border px-3 py-2 pl-6">Flagship</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border px-3 py-2 pl-6">Others</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border px-3 py-2 font-medium">MB</td>
                    <td className="border px-3 py-2 pl-6">Others</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 서부재고 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">서부재고 (West Branch Inventory)</h2>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">Product Division</th>
                    <th className="border px-3 py-2">Type</th>
                    <th className="border px-3 py-2">Values (L)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-green-50">
                    <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                    <td className="border px-3 py-2 pl-6">Flagship</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border px-3 py-2 pl-6">Others</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                    <td className="border px-3 py-2 pl-6">Flagship</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border px-3 py-2 pl-6">Others</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border px-3 py-2 font-medium">MB</td>
                    <td className="border px-3 py-2 pl-6">Others</td>
                    <td className="border px-3 py-2 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Additional table for individual branches only */}
      {selectedBranch !== '통합' && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">재고 D/M계 (Inventory D/M Total)</h2>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">구분</th>
                  <th className="border px-3 py-2">Product Division</th>
                  <th className="border px-3 py-2">Type</th>
                  <th className="border px-3 py-2">Values (L)</th>
                </tr>
              </thead>
              <tbody>
                {/* Auto */}
                <tr className="bg-teal-50">
                  <td className="border px-3 py-2 font-bold" rowSpan={5}>재고 D/M계</td>
                  <td className="border px-3 py-2 font-medium" rowSpan={2}>Auto</td>
                  <td className="border px-3 py-2 pl-6">Flagship</td>
                  <td className="border px-3 py-2 text-right">-</td>
                </tr>
                <tr className="bg-teal-50">
                  <td className="border px-3 py-2 pl-6">Others</td>
                  <td className="border px-3 py-2 text-right">-</td>
                </tr>
                {/* IL */}
                <tr className="bg-teal-50">
                  <td className="border px-3 py-2 font-medium" rowSpan={2}>IL</td>
                  <td className="border px-3 py-2 pl-6">Flagship</td>
                  <td className="border px-3 py-2 text-right">-</td>
                </tr>
                <tr className="bg-teal-50">
                  <td className="border px-3 py-2 pl-6">Others</td>
                  <td className="border px-3 py-2 text-right">-</td>
                </tr>
                {/* MB */}
                <tr className="bg-teal-50">
                  <td className="border px-3 py-2 font-medium">MB</td>
                  <td className="border px-3 py-2 pl-6">Others</td>
                  <td className="border px-3 py-2 text-right">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 재고파악시트 report.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
        <p className="mt-2"><strong>Note:</strong> 통합 view shows additional tables (동부재고, 서부재고). Individual branches show 재고 D/M계 table.</p>
      </div>
    </div>
  );
}
