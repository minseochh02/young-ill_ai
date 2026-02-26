'use client';

import { useEffect, useState } from 'react';

interface InventoryData {
  brand: string;
  previous: number;
  incoming: number;
  outgoing: number;
  current: number;
}

interface InventoryVisualizationProps {
  date?: string;
  branch?: string;
  title?: string;
}

export default function InventoryVisualization({
  date,
  branch,
  title = "재고 (Inventory)"
}: InventoryVisualizationProps) {

  const [data, setData] = useState<InventoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const selectedBranch = branch || '화성IL';
        const response = await fetch(`/api/operations/02-daily-sales?date=${selectedDate}&branch=${selectedBranch}`);
        const result = await response.json();

        if (result.success && result.data && result.data.inventory) {
          const inventoryData = result.data.inventory.map((item: any) => ({
            brand: item.brand,
            previous: item.previousDay,
            incoming: item.incoming,
            outgoing: item.outgoing,
            current: item.current,
          }));
          setData(inventoryData);
        }
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  // Mock data
  const mockData: InventoryData[] = [
    { brand: 'Mobil', previous: 45000, incoming: 35000, outgoing: 38000, current: 42000 },
    { brand: 'Mobil-MB', previous: 18000, incoming: 12000, outgoing: 15000, current: 15000 },
    { brand: '블라자 (Blazer)', previous: 12000, incoming: 8000, outgoing: 9000, current: 11000 },
    { brand: '훅스 (Fuchs)', previous: 9000, incoming: 6000, outgoing: 7000, current: 8000 },
    { brand: '기타(쉘 외 타사제품)', previous: 7000, incoming: 5000, outgoing: 6000, current: 6000 },
  ];

  const inventoryData = data.length > 0 ? data : mockData;

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
  const totalPrevious = inventoryData.reduce((sum, i) => sum + i.previous, 0);
  const totalIncoming = inventoryData.reduce((sum, i) => sum + i.incoming, 0);
  const totalOutgoing = inventoryData.reduce((sum, i) => sum + i.outgoing, 0);
  const totalCurrent = inventoryData.reduce((sum, i) => sum + i.current, 0);

  const turnoverRate = totalPrevious > 0 ? (totalOutgoing / totalPrevious) * 100 : 0;

  const formatVolume = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만L`;
    }
    return `${num.toLocaleString()}L`;
  };

  // Brand colors for pie chart
  const brandColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
  ];

  // Calculate brand percentages
  const brandData = inventoryData.map((item, idx) => ({
    ...item,
    percentage: (item.current / totalCurrent) * 100,
    color: brandColors[idx % brandColors.length],
  }));

  // Create pie chart segments
  let currentAngle = 0;
  const pieSegments = brandData.map((item) => {
    const angle = (item.percentage / 100) * 360;
    const segment = {
      percentage: item.percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: item.color,
    };
    currentAngle += angle;
    return segment;
  });

  // Convert angle to SVG path
  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(50, 50, 45, endAngle);
    const end = polarToCartesian(50, 50, 45, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M 50 50 L ${start.x} ${start.y} A 45 45 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Determine color based on turnover rate
  const getColor = (rate: number) => {
    if (rate >= 70) return { stroke: '#10b981', bg: 'bg-green-100', text: 'text-green-700' };
    if (rate >= 50) return { stroke: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-700' };
    if (rate >= 30) return { stroke: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-700' };
    return { stroke: '#ef4444', bg: 'bg-red-100', text: 'text-red-700' };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* Inventory Flow Visualization */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">재고 흐름 (Inventory Flow)</h3>
        </div>
        <div className="p-6">
          <div className="flex gap-6">
            {/* Brand Distribution Pie Chart */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 flex-shrink-0">
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-gray-700">브랜드별 재고</div>
                <div className="text-xs text-gray-600">Current Stock Distribution</div>
              </div>
              <div className="flex justify-center mb-3">
                <div className="relative" style={{ width: '180px', height: '180px' }}>
                  <svg viewBox="0 0 100 100" className="transform -rotate-0">
                    {pieSegments.map((segment, idx) => (
                      <path
                        key={idx}
                        d={createArc(segment.startAngle, segment.endAngle)}
                        fill={brandData[idx].color}
                        opacity="0.9"
                        className="hover:opacity-100 transition-opacity"
                      />
                    ))}
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-xs text-gray-600">총재고</div>
                    <div className="text-lg font-bold text-gray-900">{formatVolume(totalCurrent)}</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1">
                {brandData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1 flex-1">
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="truncate">{item.brand}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{item.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Calculations */}
            <div className="flex-1 space-y-3">
              {inventoryData.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-xs mb-2 text-gray-700">{item.brand}</div>

                  <div className="flex items-center gap-2">
                    {/* Previous */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-gray-600 mb-1">전일</div>
                      <div className="bg-gray-200 rounded px-2 py-1 text-xs font-semibold min-w-[70px]">
                        {formatVolume(item.previous)}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-green-500 text-lg">+</div>

                    {/* Incoming */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-gray-600 mb-1">입고</div>
                      <div className="bg-green-100 rounded px-2 py-1 text-xs font-semibold text-green-700 min-w-[70px]">
                        {formatVolume(item.incoming)}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-red-500 text-lg">-</div>

                    {/* Outgoing */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-gray-600 mb-1">출고</div>
                      <div className="bg-red-100 rounded px-2 py-1 text-xs font-semibold text-red-700 min-w-[70px]">
                        {formatVolume(item.outgoing)}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-gray-400 text-lg">=</div>

                    {/* Current */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-gray-600 mb-1">현재고</div>
                      <div className="bg-blue-100 rounded px-2 py-1 text-xs font-semibold text-blue-700 min-w-[70px]">
                        {formatVolume(item.current)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Turnover Analysis - CIRCULAR GAUGES */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">회전율 분석 (Turnover Analysis)</h3>
        </div>
        <div className="p-6">
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">평균 재고 회전율</div>
                <div className="text-3xl font-bold text-purple-900">{turnoverRate.toFixed(1)}%</div>
              </div>
              <div className="text-5xl opacity-50">🔄</div>
            </div>
          </div>

          {/* Circular Gauges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {inventoryData.map((item, idx) => {
              const itemTurnover = item.previous > 0 ? (item.outgoing / item.previous) * 100 : 0;
              const stockDays = item.outgoing > 0 ? (item.current / item.outgoing) * 1 : 0;
              const turnoverNormalized = Math.min(itemTurnover, 100);

              const colorScheme = getColor(itemTurnover);

              return (
                <div key={idx} className={`${colorScheme.bg} rounded-lg p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow`}>
                  <div className="text-sm font-semibold text-gray-700 mb-3 text-center">{item.brand}</div>

                  {/* Circular Progress */}
                  <div className="flex justify-center mb-3">
                    <div className="relative" style={{ width: '100px', height: '100px' }}>
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={colorScheme.stroke}
                          strokeWidth="10"
                          strokeDasharray={`${turnoverNormalized * 2.827} 282.7`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className={`text-2xl font-bold ${colorScheme.text}`}>
                          {itemTurnover.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-xs text-gray-600">회전율</div>
                    <div className={`text-xs font-semibold ${colorScheme.text}`}>
                      재고 {stockDays.toFixed(1)}일분
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>우수 (≥70%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>양호 (≥50%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>보통 (≥30%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>주의 (&lt;30%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
