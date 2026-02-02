'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report07() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('화성');

  const branches = ['화성', '창원', '부산', '동부', '서부', '중부', '제주'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">07. 미거래업체현황 (Inactive Customer Status)</h1>
        <p className="text-sm text-gray-500">Monthly review of customers with no transactions (3+ months).</p>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />

      {/* Branch Selector */}
      <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Branch</h2>
        <div className="grid grid-cols-4 gap-3">
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
            <p className="text-2xl font-bold">{selectedBranch}영업소</p>
          </div>
          <div className="text-4xl opacity-50">⚠️</div>
        </div>
      </div>

      {/* Main Content */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-blue-900">
          {selectedBranch}영업소 3개월 미거래 업체
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          {selectedBranch}영업소 3개월 미거래 업체 / 2025/05/01 ~ 2025/07/31
        </p>

        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">담당자<br/>(Manager)</th>
                <th className="border px-3 py-2">거래처코드<br/>(Customer Code)</th>
                <th className="border px-3 py-2">거래처명<br/>(Customer Name)</th>
                <th className="border px-3 py-2">구분<br/>(Category)</th>
                <th className="border px-3 py-2">잔액<br/>(Balance)</th>
                <th className="border px-3 py-2">처리방안<br/>(Action Plan)</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(15)].map((_, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2">-</td>
                  <td className="border px-3 py-2 text-right">-</td>
                  <td className="border px-3 py-2">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs">
          <p className="font-medium">📋 Purpose:</p>
          <p className="mt-1">Identifies customers who have not made any transactions within a 3-month period. 처리방안 column allows managers to document their planned approach for each inactive customer (e.g., follow-up call, account closure, special promotion, etc.).</p>
        </div>
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 미거래업체현황 report.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
