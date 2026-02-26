'use client';

import { useEffect, useState } from 'react';

interface FundsStatusVisualizationProps {
  date?: string;
  title?: string;
}

export default function FundsStatusVisualization({
  date,
  title = "자금 현황 (Funds Status)"
}: FundsStatusVisualizationProps) {

  const [fundsData, setFundsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/operations/01-ilbo?date=${selectedDate}`);
        const result = await response.json();

        if (result.success && result.data && result.data.fundsStatus) {
          const funds = result.data.fundsStatus;
          // Find each category
          const prev = funds.find((f: any) => f.category === '전잔');
          const income = funds.find((f: any) => f.category === '당입');
          const expense = funds.find((f: any) => f.category === '지출');
          const current = funds.find((f: any) => f.category === '현잔');

          setFundsData({
            deposit: { prev: prev?.regularDeposit || 0, income: income?.regularDeposit || 0, expense: expense?.regularDeposit || 0, current: current?.regularDeposit || 0 },
            eBill: { prev: prev?.electronicNotes || 0, income: income?.electronicNotes || 0, expense: expense?.electronicNotes || 0, current: current?.electronicNotes || 0 },
            collateralLoan: { prev: prev?.foreignCurrency || 0, income: income?.foreignCurrency || 0, expense: expense?.foreignCurrency || 0, current: current?.foreignCurrency || 0 },
            receivableBill: { prev: 120000000, income: 80000000, expense: 60000000, current: 140000000 },
            savings: { prev: prev?.savings || 0, income: income?.savings || 0, expense: expense?.savings || 0, current: current?.savings || 0 },
            cma: { prev: prev?.cma || 0, income: income?.cma || 0, expense: expense?.cma || 0, current: current?.cma || 0 },
            foreignDeposit: { prev: 200000000, income: 50000000, expense: 30000000, current: 220000000 },
            limitLoan: { prev: prev?.limitLoanBalance || 0, income: income?.limitLoanBalance || 0, expense: expense?.limitLoanBalance || 0, current: current?.limitLoanBalance || 0 },
            shortTermLoan: { prev: prev?.shortTermLoan || 0, income: income?.shortTermLoan || 0, expense: expense?.shortTermLoan || 0, current: current?.shortTermLoan || 0 },
            longTermLoan: { prev: prev?.longTermLoan || 0, income: income?.longTermLoan || 0, expense: expense?.longTermLoan || 0, current: current?.longTermLoan || 0 },
          });
        }
      } catch (error) {
        console.error('Failed to fetch funds data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  // Mock data for funds status
  const mockFundsData = {
    deposit: { prev: 1500000000, income: 800000000, expense: 600000000, current: 1700000000 },
    eBill: { prev: 250000000, income: 150000000, expense: 100000000, current: 300000000 },
    collateralLoan: { prev: 180000000, income: 50000000, expense: 30000000, current: 200000000 },
    receivableBill: { prev: 120000000, income: 80000000, expense: 60000000, current: 140000000 },
    savings: { prev: 500000000, income: 50000000, expense: 0, current: 550000000 },
    cma: { prev: 300000000, income: 100000000, expense: 50000000, current: 350000000 },
    foreignDeposit: { prev: 200000000, income: 50000000, expense: 30000000, current: 220000000 },
    limitLoan: { prev: 800000000, income: 200000000, expense: 150000000, current: 850000000 },
    shortTermLoan: { prev: 400000000, income: 100000000, expense: 80000000, current: 420000000 },
    longTermLoan: { prev: 1200000000, income: 0, expense: 50000000, current: 1150000000 },
  };

  const categories = [
    { key: 'deposit', label: '보통예금', color: 'blue', positive: true },
    { key: 'eBill', label: '전자어음', color: 'green', positive: true },
    { key: 'collateralLoan', label: '외담대', color: 'teal', positive: true },
    { key: 'receivableBill', label: '받을어음', color: 'cyan', positive: true },
    { key: 'savings', label: '적금+보험', color: 'indigo', positive: true },
    { key: 'cma', label: 'CMA', color: 'purple', positive: true },
    { key: 'foreignDeposit', label: '외화예금', color: 'pink', positive: true },
    { key: 'limitLoan', label: '한도대출잔액', color: 'orange', positive: false },
    { key: 'shortTermLoan', label: '단기차입금', color: 'red', positive: false },
    { key: 'longTermLoan', label: '장기차입금', color: 'rose', positive: false },
  ];

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const activeFundsData = fundsData || mockFundsData;

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

  const totalAssets = categories
    .filter(c => c.positive)
    .reduce((sum, c) => sum + activeFundsData[c.key as keyof typeof activeFundsData].current, 0);

  const totalLiabilities = categories
    .filter(c => !c.positive)
    .reduce((sum, c) => sum + activeFundsData[c.key as keyof typeof activeFundsData].current, 0);

  const netPosition = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 자산</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{formatNumber(totalAssets)}</div>
            <p className="text-xs text-gray-600 mt-1">Total Assets</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 부채</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-900">{formatNumber(totalLiabilities)}</div>
            <p className="text-xs text-gray-600 mt-1">Total Liabilities</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">순자산</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-900">{formatNumber(netPosition)}</div>
            <p className="text-xs text-gray-600 mt-1">Net Position</p>
          </div>
        </div>
      </div>

      {/* Assets vs Liabilities Comparison */}
      <div className="grid grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-blue-600">자산 (Assets)</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categories.filter(c => c.positive).map((category) => {
                const data = activeFundsData[category.key as keyof typeof activeFundsData];
                const percentage = (data.current / totalAssets) * 100;
                return (
                  <div key={category.key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category.label}</span>
                      <span className="text-sm font-bold text-blue-600">{formatNumber(data.current)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`bg-gradient-to-r from-blue-400 to-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 10 && (
                          <span className="text-white text-xs font-semibold">{percentage.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-red-600">부채 (Liabilities)</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categories.filter(c => !c.positive).map((category) => {
                const data = activeFundsData[category.key as keyof typeof activeFundsData];
                const percentage = (data.current / totalLiabilities) * 100;
                return (
                  <div key={category.key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category.label}</span>
                      <span className="text-sm font-bold text-red-600">{formatNumber(data.current)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`bg-gradient-to-r from-red-400 to-red-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 10 && (
                          <span className="text-white text-xs font-semibold">{percentage.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Funds Flow Visualization */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">자금 흐름 (Funds Flow)</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => {
              const data = fundsData[category.key as keyof typeof fundsData];
              const change = data.current - data.prev;
              const changePercent = ((change / data.prev) * 100).toFixed(1);

              return (
                <div key={category.key} className={`border-2 rounded-lg p-4 ${category.positive ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="text-xs font-medium text-gray-600 mb-2">{category.label}</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">전잔:</span>
                      <span className="font-medium">{formatNumber(data.prev)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>당입:</span>
                      <span className="font-medium">+{formatNumber(data.income)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>지출:</span>
                      <span className="font-medium">-{formatNumber(data.expense)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>현잔:</span>
                      <span className={category.positive ? 'text-blue-600' : 'text-red-600'}>
                        {formatNumber(data.current)}
                      </span>
                    </div>
                    <div className={`text-center text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '↑' : '↓'} {changePercent}%
                    </div>
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
