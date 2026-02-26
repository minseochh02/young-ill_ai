'use client';

export default function B2BSalesVisualization() {
  // Mock summary data
  const branchSummary = [
    { name: '화성사업소', revenue: 14798940, profit_dsp: 4790640, profit_asp: 5137040, rate_dsp: 32.4, rate_asp: 34.7, managers: 6, customers: 6 },
    { branch: '창원사업소', revenue: 0, profit_dsp: 0, profit_asp: 0, rate_dsp: 0, rate_asp: 0, managers: 3, customers: 0 },
    { name: '부산사업소', revenue: 0, profit_dsp: 0, profit_asp: 0, rate_dsp: 0, rate_asp: 0, managers: 1, customers: 0 },
  ];

  const formatNumber = (num: number) => {
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(0)}만`;
    return num.toLocaleString();
  };

  const totalRevenue = branchSummary.reduce((sum, b) => sum + b.revenue, 0);
  const totalProfit_dsp = branchSummary.reduce((sum, b) => sum + b.profit_dsp, 0);
  const avgRate_dsp = totalRevenue > 0 ? (totalProfit_dsp / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">B2B 사업부 일일매출 분석</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">총 매출액</h3>
          <div className="text-2xl font-bold text-blue-900">{formatNumber(totalRevenue)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">총 이익 (DSP)</h3>
          <div className="text-2xl font-bold text-green-900">{formatNumber(totalProfit_dsp)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">평균 이익율</h3>
          <div className="text-2xl font-bold text-purple-900">{avgRate_dsp.toFixed(1)}%</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">활성 고객사</h3>
          <div className="text-2xl font-bold text-amber-900">{branchSummary.reduce((sum, b) => sum + b.customers, 0)}개</div>
        </div>
      </div>

      {/* Branch Performance */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">사업소별 실적 (Branch Performance)</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {branchSummary.map((branch, idx) => {
              const hasData = branch.revenue > 0;
              return (
                <div key={idx} className={`border-l-4 ${hasData ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-r-lg p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-lg">{branch.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        영업사원: {branch.managers}명 | 고객사: {branch.customers}개
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(branch.revenue)}</div>
                      <div className="text-xs text-gray-600">매출액</div>
                    </div>
                  </div>
                  {hasData && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-xs text-gray-600">이익 (DSP)</div>
                        <div className="text-lg font-bold text-green-600">{formatNumber(branch.profit_dsp)}</div>
                        <div className="text-xs text-green-600 font-medium">{branch.rate_dsp.toFixed(1)}%</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-xs text-gray-600">이익 (ASP)</div>
                        <div className="text-lg font-bold text-purple-600">{formatNumber(branch.profit_asp)}</div>
                        <div className="text-xs text-purple-600 font-medium">{branch.rate_asp.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DSP vs ASP Comparison */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">DSP vs ASP 이익율 비교</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-4" style={{ height: '280px' }}>
            {branchSummary.filter(b => b.revenue > 0).map((branch, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                <div className="w-full flex gap-2 items-end justify-center" style={{ height: '240px' }}>
                  {/* DSP */}
                  <div className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                    <div className="absolute -top-5 text-xs font-semibold text-green-600">
                      {branch.rate_dsp.toFixed(1)}%
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all min-h-[20px]"
                      style={{ height: `${branch.rate_dsp * 2}%` }}
                    ></div>
                  </div>
                  {/* ASP */}
                  <div className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                    <div className="absolute -top-5 text-xs font-semibold text-purple-600">
                      {branch.rate_asp.toFixed(1)}%
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all min-h-[20px]"
                      style={{ height: `${branch.rate_asp * 2}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs font-medium text-center">{branch.name}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>DSP 이익율</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>ASP 이익율</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
