'use client';

interface SlowMovingItem {
  division: string;
  productName: string;
  spec: string;
  quantity: number;
}

interface LongTermInventoryVisualizationProps {
  data?: SlowMovingItem[];
  title?: string;
}

export default function LongTermInventoryVisualization({
  data,
  title = "Slow-moving Stock"
}: LongTermInventoryVisualizationProps) {

  // Mock data
  const mockData: SlowMovingItem[] = [
    { division: 'IL', productName: 'Mobil SHC 630', spec: 'DM', quantity: 45 },
    { division: 'IL', productName: 'Mobil Delvac 1340', spec: 'DM', quantity: 32 },
    { division: 'AL', productName: 'Mobil 1 5W-30', spec: 'PL', quantity: 28 },
    { division: 'AL', productName: 'Mobil Super 3000', spec: 'BOX', quantity: 18 },
    { division: 'AL', productName: 'Mobil ATF 220', spec: 'PL', quantity: 22 },
    { division: '기타', productName: 'Shell Rimula', spec: 'EA', quantity: 15 },
    { division: '기타', productName: 'Fuchs Titan', spec: 'DM', quantity: 12 },
    { division: 'IL', productName: 'Mobil Glygoyle 460', spec: 'DM', quantity: 38 },
  ];

  const slowMovingData = data || mockData;

  // Calculate totals by division
  const divisionTotals = slowMovingData.reduce((acc, item) => {
    acc[item.division] = (acc[item.division] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Calculate totals by spec
  const specTotals = slowMovingData.reduce((acc, item) => {
    acc[item.spec] = (acc[item.spec] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const totalQuantity = slowMovingData.reduce((sum, item) => sum + item.quantity, 0);
  const avgQuantity = totalQuantity / slowMovingData.length;

  const specColors: Record<string, { bg: string; text: string }> = {
    DM: { bg: 'bg-blue-100', text: 'text-blue-700' },
    PL: { bg: 'bg-green-100', text: 'text-green-700' },
    BOX: { bg: 'bg-purple-100', text: 'text-purple-700' },
    EA: { bg: 'bg-orange-100', text: 'text-orange-700' },
  };

  const divisionColors: Record<string, string> = {
    IL: 'from-blue-500 to-blue-400',
    AL: 'from-green-500 to-green-400',
    '기타': 'from-orange-500 to-orange-400',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-400 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-4xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-1">장기 재고 경고 (Long-term Stock Alert)</h3>
            <p className="text-sm text-amber-700">
              {slowMovingData.length}개 제품이 장기 재고로 분류되었습니다. 평균 재고량: {avgQuantity.toFixed(0)}개
            </p>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 장기재고 항목</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-900">{slowMovingData.length}개</div>
            <p className="text-xs text-gray-600 mt-1">Total Items</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 수량</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-900">{totalQuantity}개</div>
            <p className="text-xs text-gray-600 mt-1">Total Quantity</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">평균 수량</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900">{avgQuantity.toFixed(1)}개</div>
            <p className="text-xs text-gray-600 mt-1">Average per Item</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">최대 수량 제품</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-900">
              {[...slowMovingData].sort((a, b) => b.quantity - a.quantity)[0]?.quantity || 0}개
            </div>
            <p className="text-xs text-gray-600 mt-1">Highest Stock</p>
          </div>
        </div>
      </div>

      {/* Division Breakdown */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">구분별 장기재고 (By Division)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-4" style={{ height: '280px' }}>
            {Object.entries(divisionTotals).map(([division, quantity], idx) => {
              const maxQuantity = Math.max(...Object.values(divisionTotals));
              const heightPercentage = Math.max((quantity / maxQuantity) * 100, 10);
              const colors = divisionColors[division] || 'from-gray-500 to-gray-400';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '240px' }}>
                    <div className="absolute -top-6 text-xs font-semibold text-amber-600">
                      {quantity}개
                    </div>
                    <div
                      className={`w-full bg-gradient-to-t ${colors} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer shadow-lg min-h-[30px]`}
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-semibold text-center">{division}</div>
                  <div className="text-xs text-gray-600">{slowMovingData.filter(i => i.division === division).length} items</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spec Type Breakdown */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">규격별 분포 (By Specification Type)</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(specTotals).map(([spec, quantity], idx) => {
              const percentage = (quantity / totalQuantity) * 100;
              const colorSet = specColors[spec] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              const specLabels: Record<string, string> = {
                DM: 'Drum',
                PL: 'Pail',
                BOX: 'Box',
                EA: 'Each'
              };

              return (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`${colorSet.bg} ${colorSet.text} px-3 py-1 rounded-full text-xs font-bold`}>
                        {spec}
                      </span>
                      <span className="text-sm text-gray-600">{specLabels[spec]}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber-600">{quantity}개</span>
                      <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-6 rounded-full transition-all duration-500 ${colorSet.bg.replace('100', '500')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-medium mb-2 text-sm">Unit Types (규격):</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span><strong className="text-blue-600">DM</strong> = Drum</span>
              <span><strong className="text-green-600">PL</strong> = Pail</span>
              <span><strong className="text-purple-600">BOX</strong> = Box</span>
              <span><strong className="text-orange-600">EA</strong> = Each (individual unit)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Items List */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">최대 장기재고 항목 (Top Slow-moving Items)</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...slowMovingData].sort((a, b) => b.quantity - a.quantity).slice(0, 8).map((item, idx) => {
              const percentage = (item.quantity / totalQuantity) * 100;
              const colorSet = specColors[item.spec] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              const isHighAlert = item.quantity > avgQuantity * 1.2;

              return (
                <div key={idx} className={`border-l-4 ${isHighAlert ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'} rounded-r-lg p-4 hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.productName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.division}</span>
                          <span className={`text-xs ${colorSet.bg} ${colorSet.text} px-2 py-1 rounded font-semibold`}>
                            {item.spec}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600">{item.quantity}개</div>
                      {isHighAlert && (
                        <div className="text-xs text-red-600 font-semibold mt-1">⚠️ 높은 재고</div>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${isHighAlert ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
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
