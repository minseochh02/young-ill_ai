'use client';

import { useEffect, useState } from 'react';

interface KeyStatusItem {
  date: string;
  company: string;
  amount: number;
  note: string;
}

interface KeyStatusVisualizationProps {
  date?: string;
  branch?: string;
  title?: string;
}

export default function KeyStatusVisualization({
  date,
  branch,
  title = "주요현황 (Key Status)"
}: KeyStatusVisualizationProps) {

  const [data, setData] = useState<KeyStatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const selectedBranch = branch || '화성IL';
        const response = await fetch(`/api/operations/02-daily-sales?date=${selectedDate}&branch=${selectedBranch}`);
        const result = await response.json();

        if (result.success && result.data && result.data.keyStatus) {
          setData(result.data.keyStatus.filter((item: any) => item !== null).map((item: any) => ({
            date: item.date,
            company: item.company,
            amount: item.amount,
            note: item.remarks,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch key status data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  // Mock data
  const mockData: KeyStatusItem[] = [
    { date: '2026-02-01', company: '현대중공업', amount: 85000000, note: '대형 선박용 윤활유 납품' },
    { date: '2026-02-01', company: 'LG전자', amount: 62000000, note: '공장 설비용 오일 정기 공급' },
    { date: '2026-02-02', company: '삼성전자', amount: 73000000, note: '반도체 공정용 특수 윤활유' },
    { date: '2026-02-02', company: '포스코', amount: 95000000, note: '제철소 대형 설비 유지보수용' },
    { date: '2026-02-02', company: '한화에어로스페이스', amount: 54000000, note: '항공기 부품 가공용 오일' },
  ];

  const keyData = data.length > 0 ? data : mockData;

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

  const totalAmount = keyData.reduce((sum, item) => sum + item.amount, 0);
  const averageAmount = keyData.length > 0 ? totalAmount / keyData.length : 0;

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">주요 거래 건수</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-900">{keyData.length}건</div>
            <p className="text-xs text-gray-600 mt-1">Key Transactions</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 거래액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-violet-900">{formatNumber(totalAmount)}</div>
            <p className="text-xs text-gray-600 mt-1">Total Amount</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">평균 거래액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-900">{formatNumber(averageAmount)}</div>
            <p className="text-xs text-gray-600 mt-1">Average Amount</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">주요 거래 내역 (Key Transaction Details)</h3>
        </div>
        <div className="p-6">
          <div className="flex gap-8">
            {/* Pie Chart */}
            <div className="flex-shrink-0">
              <svg width="300" height="300" viewBox="-100 -100 200 200" className="transform -rotate-90">
                {(() => {
                  const colors = [
                    '#6366f1', // indigo-500
                    '#8b5cf6', // violet-500
                    '#a855f7', // purple-500
                    '#d946ef', // fuchsia-500
                    '#ec4899', // pink-500
                  ];

                  let currentAngle = 0;

                  return keyData.map((item, idx) => {
                    const percentage = (item.amount / totalAmount) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;

                    currentAngle = endAngle;

                    // Convert angles to radians
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    // Calculate path coordinates
                    const x1 = 90 * Math.cos(startRad);
                    const y1 = 90 * Math.sin(startRad);
                    const x2 = 90 * Math.cos(endRad);
                    const y2 = 90 * Math.sin(endRad);

                    const largeArc = angle > 180 ? 1 : 0;

                    const pathData = [
                      `M 0 0`,
                      `L ${x1} ${y1}`,
                      `A 90 90 0 ${largeArc} 1 ${x2} ${y2}`,
                      `Z`
                    ].join(' ');

                    return (
                      <path
                        key={idx}
                        d={pathData}
                        fill={colors[idx % colors.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <title>{`${item.company}: ${formatNumber(item.amount)} (${percentage.toFixed(1)}%)`}</title>
                      </path>
                    );
                  });
                })()}
              </svg>
            </div>

            {/* Legend and Details */}
            <div className="flex-1 space-y-3">
              {keyData.map((item, idx) => {
                const colors = [
                  { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-900', lightBg: 'bg-indigo-50' },
                  { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-900', lightBg: 'bg-violet-50' },
                  { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-900', lightBg: 'bg-purple-50' },
                  { bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', text: 'text-fuchsia-900', lightBg: 'bg-fuchsia-50' },
                  { bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-900', lightBg: 'bg-pink-50' },
                ];
                const color = colors[idx % colors.length];
                const percentage = (item.amount / totalAmount) * 100;

                return (
                  <div key={idx} className={`border-l-4 ${color.border} pl-4 py-3 ${color.lightBg} rounded-r hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 ${color.bg} rounded-full`}></div>
                          <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded">
                            {item.date}
                          </span>
                          <span className={`text-sm font-bold ${color.text}`}>{item.company}</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.note}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-xl font-bold ${color.text}`}>{formatNumber(item.amount)}</div>
                        <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Distribution */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">거래액 분포 (Amount Distribution)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-2" style={{ height: '200px' }}>
            {keyData.map((item, idx) => {
              const maxAmount = Math.max(...keyData.map(i => i.amount));
              const heightPercentage = Math.max((item.amount / maxAmount) * 100, 10);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '160px' }}>
                    <div className="absolute -top-5 text-xs font-semibold text-indigo-600">
                      {formatNumber(item.amount)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500 cursor-pointer shadow-md relative group min-h-[20px]"
                      style={{ height: `${heightPercentage}%` }}
                      title={item.company}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        <div>{item.company}</div>
                        <div>{formatNumber(item.amount)}</div>
                        <div className="text-gray-300 text-xs">{item.date}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center w-full truncate px-1">
                    {item.company.length > 8 ? `${item.company.substring(0, 6)}...` : item.company}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
