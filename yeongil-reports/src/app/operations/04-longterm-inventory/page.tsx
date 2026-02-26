'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';
import LongTermInventoryVisualization from '@/components/visualizations/04-longterm-inventory/LongTermInventoryVisualization';

export default function Report04() {
  const branches = ['화성', '창원', '동부', '서부', '제주'];

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [showVisualization, setShowVisualization] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">04. 장기재고현황 (Long-term Inventory by Branch)</h1>
          <p className="text-sm text-gray-500">Flags slow-moving stock. Reviewed weekly or before month-end.</p>
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
      <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Branch</h2>
        <div className="grid grid-cols-5 gap-3">
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                selectedBranch === branch
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-amber-100 hover:shadow border border-gray-200'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-amber-600 text-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Viewing Data For:</p>
            <p className="text-2xl font-bold">{selectedBranch}</p>
          </div>
          <div className="text-4xl opacity-50">⚠️</div>
        </div>
      </div>

      {/* Long-term Inventory Table */}
      <section className="mb-12">
        {showVisualization ? (
          <LongTermInventoryVisualization />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Slow-moving Stock</h2>
              <span className="text-sm text-gray-500">Previous month inventory levels</span>
            </div>

            <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">구분<br/>(Division)</th>
                <th className="border px-3 py-2">제품명<br/>(Product Name)</th>
                <th className="border px-3 py-2">규격<br/>(Specification)</th>
                <th className="border px-3 py-2">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} 전재고<br/>(Previous Month Inventory)</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample rows with different types and unit types */}
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">IL</td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2 text-center font-medium text-blue-600">DM</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">AL</td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2 text-center font-medium text-green-600">PL</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">AL</td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2 text-center font-medium text-purple-600">BOX</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">기타</td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2 text-center font-medium text-orange-600">EA</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">기타</td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2 text-center font-medium text-blue-600">DM</td>
                <td className="border px-3 py-2 text-right">-</td>
              </tr>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2 text-center">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p className="font-medium mb-1">Unit Types (규격):</p>
          <div className="flex gap-4">
            <span><strong className="text-blue-600">DM</strong> = Drum</span>
            <span><strong className="text-green-600">PL</strong> = Pail</span>
            <span><strong className="text-purple-600">BOX</strong> = Box</span>
            <span><strong className="text-orange-600">EA</strong> = Each (individual unit)</span>
          </div>
        </div>
          </>
        )}
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 장기재고현황 report.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
