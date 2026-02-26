'use client';

import { useEffect, useState } from 'react';

interface BranchData {
  branch: string;
  totalSales: number;
  totalLiters: number;
  flagshipLiters: number;
  sellInTotal: number;
  sellInFlagship: number;
}

interface SalesStatusVisualizationProps {
  date?: string;
  title?: string;
}

export default function SalesStatusVisualization({
  date,
  title = "매출현황 (Sales Status)"
}: SalesStatusVisualizationProps) {

  const [dailyData, setDailyData] = useState<BranchData[]>([]);
  const [monthlyData, setMonthlyData] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/operations/01-ilbo?date=${selectedDate}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Map API data to component format
          const daily = result.data.salesStatus.daily.map((item: any) => ({
            branch: item.branch,
            totalSales: item.totalSalesAmount,
            totalLiters: item.mobilSellOut.total,
            flagshipLiters: item.mobilSellOut.flagship,
            sellInTotal: item.mobilSellIn.total,
            sellInFlagship: item.mobilSellIn.flagship,
          }));

          const monthly = result.data.salesStatus.monthlyCumulative.map((item: any) => ({
            branch: item.branch,
            totalSales: item.totalSalesAmount,
            totalLiters: item.mobilSellOut.total,
            flagshipLiters: item.mobilSellOut.flagship,
            sellInTotal: item.mobilSellIn.total,
            sellInFlagship: item.mobilSellIn.flagship,
          }));

          setDailyData(daily);
          setMonthlyData(monthly);
        }
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  // Fallback mock data for demonstration
  const mockDailyData: BranchData[] = [
    { branch: '서울/화성IL', totalSales: 45000000, totalLiters: 35000, flagshipLiters: 28000, sellInTotal: 32000, sellInFlagship: 25000 },
    { branch: '창원', totalSales: 38000000, totalLiters: 29000, flagshipLiters: 23000, sellInTotal: 27000, sellInFlagship: 21000 },
    { branch: '화성auto(남부)', totalSales: 42000000, totalLiters: 32000, flagshipLiters: 26000, sellInTotal: 30000, sellInFlagship: 24000 },
    { branch: '화성auto(중부)', totalSales: 40000000, totalLiters: 31000, flagshipLiters: 25000, sellInTotal: 29000, sellInFlagship: 23000 },
    { branch: '인천(서부)', totalSales: 35000000, totalLiters: 27000, flagshipLiters: 21000, sellInTotal: 25000, sellInFlagship: 20000 },
    { branch: '남양주(동부)', totalSales: 33000000, totalLiters: 25000, flagshipLiters: 20000, sellInTotal: 23000, sellInFlagship: 18000 },
    { branch: '제주', totalSales: 28000000, totalLiters: 21000, flagshipLiters: 17000, sellInTotal: 20000, sellInFlagship: 16000 },
    { branch: '부산', totalSales: 36000000, totalLiters: 28000, flagshipLiters: 22000, sellInTotal: 26000, sellInFlagship: 20000 },
  ];

  const mockMonthlyData: BranchData[] = [
    { branch: '서울/화성IL', totalSales: 1350000000, totalLiters: 1050000, flagshipLiters: 840000, sellInTotal: 960000, sellInFlagship: 750000 },
    { branch: '창원', totalSales: 1140000000, totalLiters: 870000, flagshipLiters: 690000, sellInTotal: 810000, sellInFlagship: 630000 },
    { branch: '화성auto(남부)', totalSales: 1260000000, totalLiters: 960000, flagshipLiters: 780000, sellInTotal: 900000, sellInFlagship: 720000 },
    { branch: '화성auto(중부)', totalSales: 1200000000, totalLiters: 930000, flagshipLiters: 750000, sellInTotal: 870000, sellInFlagship: 690000 },
    { branch: '인천(서부)', totalSales: 1050000000, totalLiters: 810000, flagshipLiters: 630000, sellInTotal: 750000, sellInFlagship: 600000 },
    { branch: '남양주(동부)', totalSales: 990000000, totalLiters: 750000, flagshipLiters: 600000, sellInTotal: 690000, sellInFlagship: 540000 },
    { branch: '제주', totalSales: 840000000, totalLiters: 630000, flagshipLiters: 510000, sellInTotal: 600000, sellInFlagship: 480000 },
    { branch: '부산', totalSales: 1080000000, totalLiters: 840000, flagshipLiters: 660000, sellInTotal: 780000, sellInFlagship: 600000 },
  ];

  const daily = dailyData.length > 0 ? dailyData : mockDailyData;
  const monthly = monthlyData.length > 0 ? monthlyData : mockMonthlyData;

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

  // Calculate totals and KPIs
  const dailyTotal = daily.reduce((sum, b) => sum + b.totalSales, 0);
  const monthlyTotal = monthly.reduce((sum, b) => sum + b.totalSales, 0);
  const dailyTotalLiters = daily.reduce((sum, b) => sum + b.totalLiters, 0);
  const monthlyTotalLiters = monthly.reduce((sum, b) => sum + b.totalLiters, 0);

  const topBranch = [...daily].sort((a, b) => b.totalSales - a.totalSales)[0];
  const avgDailySales = dailyTotal / daily.length;

  // Find max value for scaling bars
  const maxDailySales = Math.max(...daily.map(b => b.totalSales));
  const maxMonthlySales = Math.max(...monthly.map(b => b.totalSales));

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const formatLiters = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만L`;
    }
    return `${num.toLocaleString()}L`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">일일 총매출</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{formatNumber(dailyTotal)}</div>
            <p className="text-xs text-gray-600 mt-1">{formatLiters(dailyTotalLiters)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">월 누적 매출</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-900">{formatNumber(monthlyTotal)}</div>
            <p className="text-xs text-gray-600 mt-1">{formatLiters(monthlyTotalLiters)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">최고 실적 지점</h3>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-900">{topBranch.branch}</div>
            <p className="text-xs text-gray-600 mt-1">{formatNumber(topBranch.totalSales)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">지점 평균 매출</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-900">{formatNumber(avgDailySales)}</div>
            <p className="text-xs text-gray-600 mt-1">일일 기준</p>
          </div>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded"></span>
            일계 (Daily Sales by Branch)
          </h3>
        </div>
        <div className="p-6">
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 mb-4" style={{ height: '320px' }}>
            {daily.map((branch, idx) => {
              const heightPercentage = Math.max((branch.totalSales / maxDailySales) * 100, 5);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  {/* Bar */}
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '280px' }}>
                    <div className="absolute -top-6 text-xs font-semibold text-blue-600">
                      {formatNumber(branch.totalSales)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer shadow-lg relative group min-h-[20px]"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        <div>매출: {formatNumber(branch.totalSales)}</div>
                        <div>Total: {formatLiters(branch.totalLiters)}</div>
                        <div>Flagship: {formatLiters(branch.flagshipLiters)}</div>
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="text-xs font-medium text-center w-full break-words leading-tight">
                    {branch.branch}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Summary */}
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center font-bold">
              <span className="text-base">Total</span>
              <div className="flex gap-4 text-sm">
                <span>매출: <span className="text-blue-600">{formatNumber(dailyTotal)}</span></span>
                <span>Total: {formatLiters(dailyTotalLiters)}</span>
                <span>Flagship: {formatLiters(daily.reduce((sum, b) => sum + b.flagshipLiters, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Cumulative Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded"></span>
            월누계 (Monthly Cumulative by Branch)
          </h3>
        </div>
        <div className="p-6">
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 mb-4" style={{ height: '320px' }}>
            {monthly.map((branch, idx) => {
              const heightPercentage = Math.max((branch.totalSales / maxMonthlySales) * 100, 5);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  {/* Bar */}
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '280px' }}>
                    <div className="absolute -top-6 text-xs font-semibold text-green-600">
                      {formatNumber(branch.totalSales)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-500 cursor-pointer shadow-lg relative group min-h-[20px]"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        <div>매출: {formatNumber(branch.totalSales)}</div>
                        <div>Total: {formatLiters(branch.totalLiters)}</div>
                        <div>Flagship: {formatLiters(branch.flagshipLiters)}</div>
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="text-xs font-medium text-center w-full break-words leading-tight">
                    {branch.branch}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Summary */}
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center font-bold">
              <span className="text-base">Total</span>
              <div className="flex gap-4 text-sm">
                <span>매출: <span className="text-green-600">{formatNumber(monthlyTotal)}</span></span>
                <span>Total: {formatLiters(monthlyTotalLiters)}</span>
                <span>Flagship: {formatLiters(monthly.reduce((sum, b) => sum + b.flagshipLiters, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sell-out vs Sell-in Comparison */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Sell-out vs Sell-in Comparison (Daily Liters)</h3>
        </div>
        <div className="p-6">
          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded"></div>
              <span className="text-sm font-medium">Sell-out (Total L)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-t from-purple-500 to-purple-400 rounded"></div>
              <span className="text-sm font-medium">Sell-in (Total L)</span>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div className="flex items-end justify-between gap-3" style={{ height: '288px' }}>
            {daily.map((branch, idx) => {
              const maxLiters = Math.max(...daily.map(b => Math.max(b.totalLiters, b.sellInTotal)));
              const sellOutHeight = Math.max((branch.totalLiters / maxLiters) * 100, 5);
              const sellInHeight = Math.max((branch.sellInTotal / maxLiters) * 100, 5);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  {/* Bars Container */}
                  <div className="w-full flex gap-1 items-end justify-center" style={{ height: '250px' }}>
                    {/* Sell-out Bar */}
                    <div className="relative flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer shadow-md relative group min-h-[20px]"
                        style={{ height: `${sellOutHeight}%` }}
                      >
                        {/* Value on top */}
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 whitespace-nowrap">
                          {(branch.totalLiters / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>

                    {/* Sell-in Bar */}
                    <div className="relative flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all duration-500 hover:from-purple-600 hover:to-purple-500 cursor-pointer shadow-md relative group min-h-[20px]"
                        style={{ height: `${sellInHeight}%` }}
                      >
                        {/* Value on top */}
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-purple-600 whitespace-nowrap">
                          {(branch.sellInTotal / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-xs font-medium text-center w-full break-words leading-tight mt-1">
                    {branch.branch.split('/')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t-2 border-gray-300 flex justify-around text-sm">
            <div>
              <span className="text-gray-600">Total Sell-out: </span>
              <span className="font-bold text-blue-600">{formatLiters(dailyTotalLiters)}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Sell-in: </span>
              <span className="font-bold text-purple-600">{formatLiters(daily.reduce((sum, b) => sum + b.sellInTotal, 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
