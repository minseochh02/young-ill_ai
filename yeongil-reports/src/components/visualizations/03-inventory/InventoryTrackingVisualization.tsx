'use client';

import { useEffect, useState } from 'react';

interface ProductData {
  flagship: number;
  others: number;
}

interface CategoryData {
  auto: ProductData;
  il: ProductData;
  mb: number;
}

interface InventoryData {
  opening: CategoryData;
  purchases: CategoryData;
  sales: CategoryData;
  transfers: CategoryData;
  inventory: CategoryData;
}

interface InventoryTrackingVisualizationProps {
  date?: string;
  branch?: string;
  title?: string;
}

export default function InventoryTrackingVisualization({
  date,
  branch,
  title = "Inventory Movement Tracking"
}: InventoryTrackingVisualizationProps) {

  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const selectedBranch = branch || '통합';
        const response = await fetch(`/api/operations/03-inventory?date=${selectedDate}&branch=${selectedBranch}`);
        const result = await response.json();

        if (result.success && result.data && result.data.inventoryTracking) {
          const tracking = result.data.inventoryTracking;

          const mapCategory = (items: any[]) => ({
            auto: {
              flagship: items.find((i: any) => i.division === 'Auto' && i.type === 'Flagship')?.value || 0,
              others: items.find((i: any) => i.division === 'Auto' && i.type === 'Others')?.value || 0,
            },
            il: {
              flagship: items.find((i: any) => i.division === 'IL' && i.type === 'Flagship')?.value || 0,
              others: items.find((i: any) => i.division === 'IL' && i.type === 'Others')?.value || 0,
            },
            mb: items.find((i: any) => i.division === 'MB' && i.type === 'Others')?.value || 0,
          });

          setData({
            opening: mapCategory(tracking.openingInventory),
            purchases: mapCategory(tracking.purchases),
            sales: mapCategory(tracking.sales),
            transfers: mapCategory(tracking.transfers),
            inventory: mapCategory(tracking.inventory),
          });
        }
      } catch (error) {
        console.error('Failed to fetch inventory tracking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  // Mock data
  const mockData: InventoryData = {
    opening: {
      auto: { flagship: 45000, others: 32000 },
      il: { flagship: 38000, others: 28000 },
      mb: 15000
    },
    purchases: {
      auto: { flagship: 35000, others: 25000 },
      il: { flagship: 30000, others: 22000 },
      mb: 12000
    },
    sales: {
      auto: { flagship: 38000, others: 27000 },
      il: { flagship: 32000, others: 24000 },
      mb: 13000
    },
    transfers: {
      auto: { flagship: 2000, others: 1500 },
      il: { flagship: 1800, others: 1200 },
      mb: 800
    },
    inventory: {
      auto: { flagship: 44000, others: 31500 },
      il: { flagship: 37800, others: 27200 },
      mb: 14800
    }
  };

  const inventoryData = data || mockData;

  const formatVolume = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만L`;
    }
    return `${num.toLocaleString()}L`;
  };

  // Calculate totals
  const calcTotal = (cat: CategoryData) =>
    cat.auto.flagship + cat.auto.others + cat.il.flagship + cat.il.others + cat.mb;

  const openingTotal = calcTotal(inventoryData.opening);
  const purchasesTotal = calcTotal(inventoryData.purchases);
  const salesTotal = calcTotal(inventoryData.sales);
  const transfersTotal = calcTotal(inventoryData.transfers);
  const inventoryTotal = calcTotal(inventoryData.inventory);

  // Product categories for charts
  const categories = [
    { name: '기초재고', value: openingTotal, color: 'from-blue-500 to-blue-400', icon: '📦' },
    { name: '매입', value: purchasesTotal, color: 'from-green-500 to-green-400', icon: '📥' },
    { name: '매출', value: salesTotal, color: 'from-purple-500 to-purple-400', icon: '📤' },
    { name: '이동', value: transfersTotal, color: 'from-orange-500 to-orange-400', icon: '🔄' },
    { name: '재고', value: inventoryTotal, color: 'from-yellow-500 to-yellow-400', icon: '📊' },
  ];

  const productTypes = [
    { name: 'Auto Flagship', value: inventoryData.inventory.auto.flagship, color: 'bg-blue-500' },
    { name: 'Auto Others', value: inventoryData.inventory.auto.others, color: 'bg-blue-400' },
    { name: 'IL Flagship', value: inventoryData.inventory.il.flagship, color: 'bg-green-500' },
    { name: 'IL Others', value: inventoryData.inventory.il.others, color: 'bg-green-400' },
    { name: 'MB Others', value: inventoryData.inventory.mb, color: 'bg-purple-500' },
  ];

  const maxValue = Math.max(...categories.map(c => c.value));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${cat.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-50').replace('-400', '-100')} border-2 border-${cat.color.split('-')[1]}-200 rounded-lg p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{cat.name}</h3>
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatVolume(cat.value)}</div>
          </div>
        ))}
      </div>

      {/* Flow Visualization */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">재고 흐름 (Inventory Flow)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center gap-3 overflow-x-auto">
            {/* Opening */}
            <div className="text-center min-w-[120px]">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-xs text-gray-600 mb-1">기초재고</div>
              <div className="bg-blue-100 rounded-lg px-3 py-2 text-lg font-bold text-blue-700">
                {formatVolume(openingTotal)}
              </div>
            </div>

            <div className="text-green-500 text-2xl">+</div>

            {/* Purchases */}
            <div className="text-center min-w-[120px]">
              <div className="text-3xl mb-2">📥</div>
              <div className="text-xs text-gray-600 mb-1">매입</div>
              <div className="bg-green-100 rounded-lg px-3 py-2 text-lg font-bold text-green-700">
                {formatVolume(purchasesTotal)}
              </div>
            </div>

            <div className="text-purple-500 text-2xl">-</div>

            {/* Sales */}
            <div className="text-center min-w-[120px]">
              <div className="text-3xl mb-2">📤</div>
              <div className="text-xs text-gray-600 mb-1">매출</div>
              <div className="bg-purple-100 rounded-lg px-3 py-2 text-lg font-bold text-purple-700">
                {formatVolume(salesTotal)}
              </div>
            </div>

            <div className="text-orange-500 text-2xl">±</div>

            {/* Transfers */}
            <div className="text-center min-w-[120px]">
              <div className="text-3xl mb-2">🔄</div>
              <div className="text-xs text-gray-600 mb-1">이동</div>
              <div className="bg-orange-100 rounded-lg px-3 py-2 text-lg font-bold text-orange-700">
                {formatVolume(transfersTotal)}
              </div>
            </div>

            <div className="text-gray-400 text-2xl">=</div>

            {/* Inventory */}
            <div className="text-center min-w-[120px]">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-xs text-gray-600 mb-1">재고</div>
              <div className="bg-yellow-100 rounded-lg px-3 py-2 text-lg font-bold text-yellow-700">
                {formatVolume(inventoryTotal)}
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-2">재고 계산식</div>
            <div className="text-base font-mono font-semibold text-gray-800">
              재고 = 기초재고 + 매입 - 매출 ± 이동
            </div>
          </div>
        </div>
      </div>

      {/* Category Comparison Bar Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">항목별 비교 (Category Comparison)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-3" style={{ height: '300px' }}>
            {categories.map((cat, idx) => {
              const heightPercentage = Math.max((cat.value / maxValue) * 100, 5);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '260px' }}>
                    <div className="absolute -top-6 text-xs font-semibold">
                      {formatVolume(cat.value)}
                    </div>
                    <div
                      className={`w-full bg-gradient-to-t ${cat.color} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer shadow-lg min-h-[30px] flex items-start justify-center pt-3`}
                      style={{ height: `${heightPercentage}%` }}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center">{cat.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Type Breakdown */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">제품 타입별 재고 구성 (Current Inventory by Product Type)</h3>
        </div>
        <div className="p-6">
          {/* Stacked Bar */}
          <div className="mb-6">
            <div className="h-16 w-full flex rounded-lg overflow-hidden shadow-lg">
              {productTypes.map((type, idx) => {
                const percentage = (type.value / inventoryTotal) * 100;
                return (
                  <div
                    key={idx}
                    className={`${type.color} hover:opacity-80 transition-opacity flex items-center justify-center text-white font-semibold cursor-pointer`}
                    style={{ width: `${percentage}%` }}
                    title={`${type.name}: ${formatVolume(type.value)}`}
                  >
                    {percentage > 10 && <span className="text-xs">{percentage.toFixed(0)}%</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {productTypes.map((type, idx) => (
              <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg border">
                <div className={`w-full h-2 ${type.color} rounded mb-2`}></div>
                <div className="text-xs text-gray-600 mb-1">{type.name}</div>
                <div className="text-sm font-bold">{formatVolume(type.value)}</div>
                <div className="text-xs text-gray-500">{((type.value / inventoryTotal) * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Auto */}
        <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-blue-200 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900">Auto</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="border-l-4 border-blue-500 pl-3 py-2">
              <div className="text-xs text-gray-600">Flagship</div>
              <div className="text-xl font-bold text-blue-600">{formatVolume(inventoryData.inventory.auto.flagship)}</div>
            </div>
            <div className="border-l-4 border-blue-400 pl-3 py-2">
              <div className="text-xs text-gray-600">Others</div>
              <div className="text-xl font-bold text-blue-600">{formatVolume(inventoryData.inventory.auto.others)}</div>
            </div>
            <div className="pt-3 border-t-2 border-blue-200">
              <div className="text-xs text-gray-600">Total</div>
              <div className="text-2xl font-bold text-blue-900">
                {formatVolume(inventoryData.inventory.auto.flagship + inventoryData.inventory.auto.others)}
              </div>
            </div>
          </div>
        </div>

        {/* IL */}
        <div className="bg-white border-2 border-green-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-green-200 bg-green-50">
            <h3 className="text-lg font-semibold text-green-900">IL</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="border-l-4 border-green-500 pl-3 py-2">
              <div className="text-xs text-gray-600">Flagship</div>
              <div className="text-xl font-bold text-green-600">{formatVolume(inventoryData.inventory.il.flagship)}</div>
            </div>
            <div className="border-l-4 border-green-400 pl-3 py-2">
              <div className="text-xs text-gray-600">Others</div>
              <div className="text-xl font-bold text-green-600">{formatVolume(inventoryData.inventory.il.others)}</div>
            </div>
            <div className="pt-3 border-t-2 border-green-200">
              <div className="text-xs text-gray-600">Total</div>
              <div className="text-2xl font-bold text-green-900">
                {formatVolume(inventoryData.inventory.il.flagship + inventoryData.inventory.il.others)}
              </div>
            </div>
          </div>
        </div>

        {/* MB */}
        <div className="bg-white border-2 border-purple-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-purple-200 bg-purple-50">
            <h3 className="text-lg font-semibold text-purple-900">MB</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="border-l-4 border-purple-500 pl-3 py-2">
              <div className="text-xs text-gray-600">Others</div>
              <div className="text-xl font-bold text-purple-600">{formatVolume(inventoryData.inventory.mb)}</div>
            </div>
            <div className="pt-3 border-t-2 border-purple-200">
              <div className="text-xs text-gray-600">Total</div>
              <div className="text-2xl font-bold text-purple-900">
                {formatVolume(inventoryData.inventory.mb)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
