'use client';

import { useEffect, useState } from 'react';

interface PurchaseData {
  category: string;
  volume: number;
  amount: number;
}

interface PurchasesOrdersVisualizationProps {
  date?: string;
  branch?: string;
  title?: string;
}

export default function PurchasesOrdersVisualization({
  date,
  branch,
  title = "매입/발주 (Purchases / Orders)"
}: PurchasesOrdersVisualizationProps) {

  const [data, setData] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const selectedBranch = branch || '화성IL';
        const response = await fetch(`/api/operations/02-daily-sales?date=${selectedDate}&branch=${selectedBranch}`);
        const result = await response.json();

        if (result.success && result.data && result.data.purchasesOrders) {
          setData(result.data.purchasesOrders);
        }
      } catch (error) {
        console.error('Failed to fetch purchases data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  // Mock data
  const mockData: PurchaseData[] = [
    { category: '모빌', volume: 35000, amount: 42000000 },
    { category: 'IL (Flagship) 매출', volume: 28000, amount: 0 },
    { category: 'IL (Flagship) 매입', volume: 30000, amount: 36000000 },
  ];

  const purchaseData = data.length > 0 ? data : mockData;

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

  const totalVolume = purchaseData.reduce((sum, p) => sum + p.volume, 0);
  const totalAmount = purchaseData.reduce((sum, p) => sum + p.amount, 0);

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const formatVolume = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만L`;
    }
    return `${num.toLocaleString()}L`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 발주량</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-900">{formatVolume(totalVolume)}</div>
            <p className="text-xs text-gray-600 mt-1">Total Order Volume</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 매입액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-900">{formatNumber(totalAmount)}</div>
            <p className="text-xs text-gray-600 mt-1">Total Purchase Amount</p>
          </div>
        </div>
      </div>

      {/* Volume Bar Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">발주량 비교 (Order Volume Comparison)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-4" style={{ height: '280px' }}>
            {purchaseData.map((item, idx) => {
              const maxVolume = Math.max(...purchaseData.map(p => p.volume));
              const heightPercentage = Math.max((item.volume / maxVolume) * 100, 5);
              const colors = ['from-orange-500 to-orange-400', 'from-blue-500 to-blue-400', 'from-teal-500 to-teal-400'];

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '240px' }}>
                    <div className="absolute -top-6 text-xs font-semibold text-orange-600">
                      {formatVolume(item.volume)}
                    </div>
                    <div
                      className={`w-full bg-gradient-to-t ${colors[idx]} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer shadow-lg relative group min-h-[20px]`}
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        <div>발주량: {formatVolume(item.volume)}</div>
                        {item.amount > 0 && <div>금액: {formatNumber(item.amount)}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center w-full break-words leading-tight">
                    {item.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {purchaseData.map((item, idx) => {
          const colors = [
            { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-900' },
            { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-900' },
            { bg: 'from-teal-50 to-teal-100', border: 'border-teal-200', text: 'text-teal-900' }
          ];

          return (
            <div key={idx} className={`bg-gradient-to-br ${colors[idx].bg} border-2 ${colors[idx].border} rounded-lg p-6 shadow-sm hover:scale-105 transition-transform`}>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">{item.category}</h3>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Vol(L)</div>
                  <div className={`text-2xl font-bold ${colors[idx].text}`}>
                    {formatVolume(item.volume)}
                  </div>
                </div>

                {item.amount > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">금액</div>
                    <div className={`text-xl font-bold ${colors[idx].text}`}>
                      {formatNumber(item.amount)}
                    </div>
                  </div>
                )}

                {item.amount > 0 && (
                  <div className="pt-2 border-t border-gray-300">
                    <div className="text-xs text-gray-600 mb-1">단가</div>
                    <div className="text-sm font-semibold text-gray-700">
                      {formatNumber(item.amount / item.volume)}/L
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
