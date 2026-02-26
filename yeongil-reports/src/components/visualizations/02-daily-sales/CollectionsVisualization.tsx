'use client';

import { useEffect, useState } from 'react';

interface CollectionsVisualizationProps {
  date?: string;
  branch?: string;
  title?: string;
}

export default function CollectionsVisualization({
  date,
  branch,
  title = "수금현황 (Collections Status)"
}: CollectionsVisualizationProps) {

  const [cashAmount, setCashAmount] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const selectedBranch = branch || '화성IL';
        const response = await fetch(`/api/operations/02-daily-sales?date=${selectedDate}&branch=${selectedBranch}`);
        const result = await response.json();

        if (result.success && result.data && result.data.collectionsStatus) {
          setCashAmount(result.data.collectionsStatus.cash);
          setBillAmount(result.data.collectionsStatus.notes);
          setCardAmount(result.data.collectionsStatus.card);
        }
      } catch (error) {
        console.error('Failed to fetch collections data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  // Mock data
  const mockCash = 45000000;
  const mockBill = 32000000;
  const mockCard = 38000000;

  const finalCash = cashAmount || mockCash;
  const finalBill = billAmount || mockBill;
  const finalCard = cardAmount || mockCard;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <div className="text-gray-600">Loading data...</div>
        </div>
      </div>
    );
  }

  const total = finalCash + finalBill + finalCard;

  const cashPercent = (finalCash / total) * 100;
  const billPercent = (finalBill / total) * 100;
  const cardPercent = (finalCard / total) * 100;

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const collections = [
    { type: '현금', amount: finalCash, percent: cashPercent, color: 'green', icon: '💵' },
    { type: '어음', amount: finalBill, percent: billPercent, color: 'blue', icon: '📄' },
    { type: '카드', amount: finalCard, percent: cardPercent, color: 'purple', icon: '💳' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6 shadow-sm">
        <div className="pb-2">
          <h3 className="text-sm font-medium text-gray-600">총 수금액</h3>
        </div>
        <div>
          <div className="text-4xl font-bold text-green-900">{formatNumber(total)}</div>
          <p className="text-sm text-gray-600 mt-2">Total Collections Today</p>
        </div>
      </div>

      {/* Collection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map((item, idx) => (
          <div key={idx} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border-2 border-${item.color}-200 rounded-lg p-6 shadow-sm hover:scale-105 transition-transform`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{item.type}</h3>
              <span className="text-3xl">{item.icon}</span>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: `rgb(var(--${item.color}-700))` }}>
              {formatNumber(item.amount)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">비중</span>
              <span className="font-bold" style={{ color: `rgb(var(--${item.color}-600))` }}>
                {item.percent.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Donut Chart Visualization */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">결제 수단별 구성 (Payment Method Breakdown)</h3>
        </div>
        <div className="p-6">
          {/* Horizontal Stacked Bar */}
          <div className="mb-8">
            <div className="h-20 w-full flex rounded-lg overflow-hidden shadow-lg">
              <div
                className="bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
                style={{ width: `${cashPercent}%` }}
                title={`현금: ${formatNumber(cashAmount)}`}
              >
                {cashPercent > 15 && <span className="text-sm">💵 {cashPercent.toFixed(0)}%</span>}
              </div>
              <div
                className="bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
                style={{ width: `${billPercent}%` }}
                title={`어음: ${formatNumber(billAmount)}`}
              >
                {billPercent > 15 && <span className="text-sm">📄 {billPercent.toFixed(0)}%</span>}
              </div>
              <div
                className="bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
                style={{ width: `${cardPercent}%` }}
                title={`카드: ${formatNumber(cardAmount)}`}
              >
                {cardPercent > 15 && <span className="text-sm">💳 {cardPercent.toFixed(0)}%</span>}
              </div>
            </div>
          </div>

          {/* Legend with Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">💵</div>
              <div className="text-sm text-gray-600 mb-1">현금 (Cash)</div>
              <div className="text-lg font-bold text-green-700">{formatNumber(cashAmount)}</div>
              <div className="text-xs text-gray-600 mt-1">{cashPercent.toFixed(1)}%</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm text-gray-600 mb-1">어음 (Bill)</div>
              <div className="text-lg font-bold text-blue-700">{formatNumber(billAmount)}</div>
              <div className="text-xs text-gray-600 mt-1">{billPercent.toFixed(1)}%</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl mb-2">💳</div>
              <div className="text-sm text-gray-600 mb-1">카드 (Card)</div>
              <div className="text-lg font-bold text-purple-700">{formatNumber(cardAmount)}</div>
              <div className="text-xs text-gray-600 mt-1">{cardPercent.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
