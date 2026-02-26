'use client';

import { useEffect, useState } from 'react';

interface ARData {
  branch: string;
  totalCollection: number;
  cash: number;
  bill: number;
  card: number;
  other: number;
}

interface ARBalanceData {
  branch: string;
  previousBalance: number;
  currentSales: number;
  currentBalance: number;
}

interface ARStatusVisualizationProps {
  date?: string;
  title?: string;
}

export default function ARStatusVisualization({
  date,
  title = "외상매출금 현황 (AR / Collections Status)"
}: ARStatusVisualizationProps) {

  const [dailyData, setDailyData] = useState<ARData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ARData[]>([]);
  const [balanceData, setBalanceData] = useState<ARBalanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/operations/01-ilbo?date=${selectedDate}`);
        const result = await response.json();

        if (result.success && result.data) {
          const daily = result.data.arStatus.daily.map((item: any) => ({
            branch: item.branch,
            totalCollection: item.totalCollections,
            cash: item.cash,
            bill: item.notes,
            card: item.card,
            other: item.other,
          }));

          const monthly = result.data.arStatus.monthlyCumulative.map((item: any) => ({
            branch: item.branch,
            totalCollection: item.totalCollections,
            cash: item.cash,
            bill: item.notes,
            card: item.card,
            other: item.other,
          }));

          const balance = result.data.arStatus.arBalance.map((item: any) => ({
            branch: item.branch,
            previousBalance: item.previousMonthBalance,
            currentSales: item.currentMonthSales,
            currentBalance: item.currentBalance,
          }));

          setDailyData(daily);
          setMonthlyData(monthly);
          setBalanceData(balance);
        }
      } catch (error) {
        console.error('Failed to fetch AR data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  // Mock data
  const mockDailyData: ARData[] = [
    { branch: '화성IL', totalCollection: 120000000, cash: 50000000, bill: 30000000, card: 35000000, other: 5000000 },
    { branch: '창원', totalCollection: 95000000, cash: 40000000, bill: 25000000, card: 27000000, other: 3000000 },
    { branch: '화성auto(남부)', totalCollection: 110000000, cash: 45000000, bill: 28000000, card: 32000000, other: 5000000 },
    { branch: '화성auto(중부)', totalCollection: 105000000, cash: 43000000, bill: 27000000, card: 31000000, other: 4000000 },
    { branch: '인천(서부)', totalCollection: 88000000, cash: 38000000, bill: 22000000, card: 25000000, other: 3000000 },
    { branch: '남양주(동부)', totalCollection: 82000000, cash: 35000000, bill: 20000000, card: 24000000, other: 3000000 },
    { branch: '제주', totalCollection: 70000000, cash: 30000000, bill: 18000000, card: 20000000, other: 2000000 },
    { branch: '부산', totalCollection: 90000000, cash: 38000000, bill: 23000000, card: 26000000, other: 3000000 },
  ];

  const mockMonthlyData: ARData[] = [
    { branch: '화성IL', totalCollection: 3600000000, cash: 1500000000, bill: 900000000, card: 1050000000, other: 150000000 },
    { branch: '창원', totalCollection: 2850000000, cash: 1200000000, bill: 750000000, card: 810000000, other: 90000000 },
    { branch: '화성auto(남부)', totalCollection: 3300000000, cash: 1350000000, bill: 840000000, card: 960000000, other: 150000000 },
    { branch: '화성auto(중부)', totalCollection: 3150000000, cash: 1290000000, bill: 810000000, card: 930000000, other: 120000000 },
    { branch: '인천(서부)', totalCollection: 2640000000, cash: 1140000000, bill: 660000000, card: 750000000, other: 90000000 },
    { branch: '남양주(동부)', totalCollection: 2460000000, cash: 1050000000, bill: 600000000, card: 720000000, other: 90000000 },
    { branch: '제주', totalCollection: 2100000000, cash: 900000000, bill: 540000000, card: 600000000, other: 60000000 },
    { branch: '부산', totalCollection: 2700000000, cash: 1140000000, bill: 690000000, card: 780000000, other: 90000000 },
  ];

  const mockBalanceData: ARBalanceData[] = [
    { branch: '화성IL', previousBalance: 250000000, currentSales: 1350000000, currentBalance: 280000000 },
    { branch: '창원', previousBalance: 180000000, currentSales: 1140000000, currentBalance: 210000000 },
    { branch: '화성auto(남부)', previousBalance: 220000000, currentSales: 1260000000, currentBalance: 250000000 },
    { branch: '화성auto(중부)', previousBalance: 210000000, currentSales: 1200000000, currentBalance: 240000000 },
    { branch: '인천(서부)', previousBalance: 170000000, currentSales: 1050000000, currentBalance: 195000000 },
    { branch: '남양주(동부)', previousBalance: 160000000, currentSales: 990000000, currentBalance: 180000000 },
    { branch: '제주', previousBalance: 130000000, currentSales: 840000000, currentBalance: 150000000 },
    { branch: '부산', previousBalance: 175000000, currentSales: 1080000000, currentBalance: 200000000 },
  ];

  const daily = dailyData.length > 0 ? dailyData : mockDailyData;
  const monthly = monthlyData.length > 0 ? monthlyData : mockMonthlyData;
  const balance = balanceData.length > 0 ? balanceData : mockBalanceData;

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

  // Calculate totals
  const dailyTotal = daily.reduce((sum, b) => sum + b.totalCollection, 0);
  const monthlyTotal = monthly.reduce((sum, b) => sum + b.totalCollection, 0);
  const totalCurrentBalance = balance.reduce((sum, b) => sum + b.currentBalance, 0);
  const totalPreviousBalance = balance.reduce((sum, b) => sum + b.previousBalance, 0);

  const maxDailyCollection = Math.max(...daily.map(b => b.totalCollection));
  const maxMonthlyCollection = Math.max(...monthly.map(b => b.totalCollection));

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">일일 총수금액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-900">{formatNumber(dailyTotal)}</div>
            <p className="text-xs text-gray-600 mt-1">Daily Collections</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">월 누적 수금액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-teal-900">{formatNumber(monthlyTotal)}</div>
            <p className="text-xs text-gray-600 mt-1">Monthly Collections</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">현재 외상잔액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-900">{formatNumber(totalCurrentBalance)}</div>
            <p className="text-xs text-gray-600 mt-1">Current AR Balance</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">잔액 변동</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900">
              {totalCurrentBalance > totalPreviousBalance ? '+' : ''}
              {formatNumber(totalCurrentBalance - totalPreviousBalance)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Balance Change</p>
          </div>
        </div>
      </div>

      {/* Daily Collections by Payment Type */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded"></span>
            일계 수금 현황 (Daily Collections by Payment Type)
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-2 mb-4" style={{ height: '320px' }}>
            {daily.map((branch, idx) => {
              const heightPercentage = Math.max((branch.totalCollection / maxDailyCollection) * 100, 5);
              const cashPercent = (branch.cash / branch.totalCollection) * 100;
              const billPercent = (branch.bill / branch.totalCollection) * 100;
              const cardPercent = (branch.card / branch.totalCollection) * 100;
              const otherPercent = (branch.other / branch.totalCollection) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '280px' }}>
                    <div className="absolute -top-6 text-xs font-semibold text-green-600">
                      {formatNumber(branch.totalCollection)}
                    </div>
                    {/* Stacked Bar */}
                    <div className="w-full flex flex-col-reverse rounded-t-lg shadow-lg overflow-hidden cursor-pointer group" style={{ height: `${heightPercentage}%` }}>
                      {/* Cash - Green */}
                      <div className="bg-green-600 hover:bg-green-700 transition-colors" style={{ height: `${cashPercent}%` }} title={`현금: ${formatNumber(branch.cash)}`}></div>
                      {/* Bill - Blue */}
                      <div className="bg-blue-600 hover:bg-blue-700 transition-colors" style={{ height: `${billPercent}%` }} title={`어음: ${formatNumber(branch.bill)}`}></div>
                      {/* Card - Purple */}
                      <div className="bg-purple-600 hover:bg-purple-700 transition-colors" style={{ height: `${cardPercent}%` }} title={`카드: ${formatNumber(branch.card)}`}></div>
                      {/* Other - Gray */}
                      <div className="bg-gray-600 hover:bg-gray-700 transition-colors" style={{ height: `${otherPercent}%` }} title={`기타: ${formatNumber(branch.other)}`}></div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        <div>현금: {formatNumber(branch.cash)}</div>
                        <div>어음: {formatNumber(branch.bill)}</div>
                        <div>카드: {formatNumber(branch.card)}</div>
                        <div>기타: {formatNumber(branch.other)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center w-full break-words leading-tight">
                    {branch.branch}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>현금</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>어음</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span>카드</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>기타</span>
            </div>
          </div>
        </div>
      </div>

      {/* AR Balance Flow */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded"></span>
            외상매출금 잔액 흐름 (AR Balance Flow)
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {balance.map((branch, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm mb-3">{branch.branch}</div>
                <div className="flex items-center gap-2">
                  {/* Previous Balance */}
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xs text-gray-600 mb-1">전월잔액</div>
                    <div className="bg-gray-200 rounded px-3 py-2 text-sm font-semibold">
                      {formatNumber(branch.previousBalance)}
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-gray-400 text-xl">+</div>

                  {/* Current Sales */}
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xs text-gray-600 mb-1">당월매출</div>
                    <div className="bg-blue-100 rounded px-3 py-2 text-sm font-semibold text-blue-700">
                      {formatNumber(branch.currentSales)}
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-gray-400 text-xl">→</div>

                  {/* Current Balance */}
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xs text-gray-600 mb-1">현잔액</div>
                    <div className="bg-red-100 rounded px-3 py-2 text-sm font-semibold text-red-700">
                      {formatNumber(branch.currentBalance)}
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="flex-1 ml-4">
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
                        style={{ width: `${(branch.currentBalance / (branch.previousBalance + branch.currentSales)) * 100}%` }}
                      >
                        {((branch.currentBalance / (branch.previousBalance + branch.currentSales)) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
