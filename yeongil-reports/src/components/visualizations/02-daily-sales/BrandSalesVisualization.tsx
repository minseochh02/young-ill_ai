'use client';

import { useEffect, useState } from 'react';

interface BrandSalesData {
  brand: string;
  previousTotal: number;
  today: number;
  cumulative: number;
  note: string;
}

interface BrandSalesVisualizationProps {
  date?: string;
  branch?: string;
  title?: string;
}

export default function BrandSalesVisualization({
  date,
  branch,
  title = "판매현황 (Sales Status)"
}: BrandSalesVisualizationProps) {

  const [data, setData] = useState<BrandSalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const selectedBranch = branch || '화성IL';
        const response = await fetch(`/api/operations/02-daily-sales?date=${selectedDate}&branch=${selectedBranch}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Filter out the total row (매출액)
          const salesData = result.data.salesStatus
            .filter((item: any) => item.brand !== '매출액')
            .map((item: any) => ({
              brand: item.brand,
              previousTotal: item.previousDayCumulative,
              today: item.today,
              cumulative: item.cumulative,
              note: item.remarks,
            }));

          setData(salesData);
        }
      } catch (error) {
        console.error('Failed to fetch brand sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  // Mock data
  const mockData: BrandSalesData[] = [
    { brand: 'Mobil', previousTotal: 280000000, today: 45000000, cumulative: 325000000, note: '주력 제품' },
    { brand: 'Mobil-MB', previousTotal: 120000000, today: 18000000, cumulative: 138000000, note: '선박용' },
    { brand: '블라자 (Blazer)', previousTotal: 85000000, today: 12000000, cumulative: 97000000, note: '공업용' },
    { brand: '훅스 (Fuchs)', previousTotal: 65000000, today: 9000000, cumulative: 74000000, note: '특수 윤활유' },
    { brand: '기타(쉘 외 타사제품)', previousTotal: 50000000, today: 6000000, cumulative: 56000000, note: '기타 브랜드' },
  ];

  const salesData = data.length > 0 ? data : mockData;

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
  const totalPrevious = salesData.reduce((sum, b) => sum + b.previousTotal, 0);
  const totalToday = salesData.reduce((sum, b) => sum + b.today, 0);
  const totalCumulative = salesData.reduce((sum, b) => sum + b.cumulative, 0);

  const maxCumulative = Math.max(...salesData.map(b => b.cumulative));

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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">전일누계</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{formatNumber(totalPrevious)}</div>
            <p className="text-xs text-gray-600 mt-1">Previous Total</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">당일 매출</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-900">{formatNumber(totalToday)}</div>
            <p className="text-xs text-gray-600 mt-1">Today's Sales</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">누계</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-900">{formatNumber(totalCumulative)}</div>
            <p className="text-xs text-gray-600 mt-1">Cumulative Total</p>
          </div>
        </div>
      </div>

      {/* Brand Comparison Bar Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">브랜드별 누적 매출 (Cumulative Sales by Brand)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-3 mb-4" style={{ height: '320px' }}>
            {salesData.map((brand, idx) => {
              const heightPercentage = Math.max((brand.cumulative / maxCumulative) * 100, 5);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '280px' }}>
                    <div className="absolute -top-6 text-xs font-semibold text-purple-600">
                      {formatNumber(brand.cumulative)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-purple-600 hover:to-purple-500 cursor-pointer shadow-lg relative group min-h-[20px]"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        <div>전일누계: {formatNumber(brand.previousTotal)}</div>
                        <div>당일: {formatNumber(brand.today)}</div>
                        <div>누계: {formatNumber(brand.cumulative)}</div>
                        <div className="text-gray-300 text-xs mt-1">{brand.note}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center w-full break-words leading-tight">
                    {brand.brand}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today vs Previous Comparison - GROUPED BAR CHART */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">일일 증감 현황 (Daily Growth Comparison)</h3>
        </div>
        <div className="p-6">
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-4 mb-6" style={{ height: '300px' }}>
            {salesData.map((brand, idx) => {
              const avgDaily = brand.previousTotal / 30;
              const maxValue = Math.max(...salesData.map(b => Math.max(b.previousTotal / 30, b.today)));
              const prevHeight = Math.max((avgDaily / maxValue) * 100, 5);
              const todayHeight = Math.max((brand.today / maxValue) * 100, 5);
              const growthPercent = avgDaily > 0 ? ((brand.today / avgDaily - 1) * 100) : 0;
              const isPositive = growthPercent >= 0;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="w-full flex gap-1 items-end justify-center" style={{ height: '260px' }}>
                    {/* Previous Average */}
                    <div className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                      <div className="absolute -top-5 text-xs font-semibold text-gray-600">
                        {formatNumber(avgDaily)}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-gray-400 to-gray-300 rounded-t transition-all duration-500 min-h-[20px]"
                        style={{ height: `${prevHeight}%` }}
                        title="전일 평균"
                      ></div>
                    </div>

                    {/* Today */}
                    <div className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                      <div className="absolute -top-5 text-xs font-semibold text-green-600">
                        {formatNumber(brand.today)}
                      </div>
                      <div
                        className={`w-full bg-gradient-to-t ${isPositive ? 'from-green-500 to-green-400' : 'from-red-500 to-red-400'} rounded-t transition-all duration-500 min-h-[20px] relative group`}
                        style={{ height: `${todayHeight}%` }}
                        title="당일"
                      >
                        {/* Growth indicator */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                            {isPositive ? '↑' : '↓'} {Math.abs(growthPercent).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center w-full break-words leading-tight">
                    {brand.brand}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>전일 평균</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>당일 (증가)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>당일 (감소)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Market Share - DONUT CHART */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">브랜드 점유율 (Brand Market Share)</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donut Chart Visualization */}
            <div className="flex items-center justify-center">
              <div className="relative" style={{ width: '280px', height: '280px' }}>
                {/* SVG Donut Chart */}
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {salesData.map((brand, idx) => {
                    const percentage = (brand.cumulative / totalCumulative) * 100;
                    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                    const color = colors[idx % colors.length];

                    // Circle circumference = 2πr = 2 * π * 40 = 251.2
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;

                    // Calculate arc length based on percentage
                    const arcLength = (percentage / 100) * circumference;

                    // Calculate cumulative offset for positioning
                    const prevPercentage = salesData.slice(0, idx).reduce((sum, b) =>
                      sum + (b.cumulative / totalCumulative) * 100, 0
                    );
                    const offset = -(prevPercentage / 100) * circumference;

                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="20"
                        strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                        strokeDashoffset={offset}
                        className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                        style={{ transformOrigin: '50% 50%' }}
                      />
                    );
                  })}
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-3xl font-bold text-gray-800">{salesData.length}</div>
                  <div className="text-xs text-gray-600">브랜드</div>
                </div>
              </div>
            </div>

            {/* Legend with values */}
            <div className="flex flex-col justify-center space-y-3">
              {salesData.map((brand, idx) => {
                const percentage = (brand.cumulative / totalCumulative) * 100;
                const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'];
                const colorClass = colors[idx % colors.length];

                return (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className={`w-4 h-4 rounded ${colorClass} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{brand.brand}</div>
                      <div className="text-xs text-gray-600">{brand.note}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm">{percentage.toFixed(1)}%</div>
                      <div className="text-xs text-gray-600">{formatNumber(brand.cumulative)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
