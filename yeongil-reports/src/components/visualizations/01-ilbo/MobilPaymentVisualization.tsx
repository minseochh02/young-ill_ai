'use client';

import { useEffect, useState } from 'react';

interface MobilBranchData {
  branch: string;
  il: number;
  auto: number;
  mbk: number;
}

interface MobilPaymentVisualizationProps {
  date?: string;
  title?: string;
}

export default function MobilPaymentVisualization({
  date,
  title = "모빌결제내역 (Mobil Payment Details)"
}: MobilPaymentVisualizationProps) {

  const [dailyData, setDailyData] = useState<MobilBranchData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MobilBranchData[]>([]);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/operations/01-ilbo?date=${selectedDate}`);
        const result = await response.json();

        if (result.success && result.data) {
          const daily = result.data.mobilPaymentDetails.daily.branches.map((item: any) => ({
            branch: item.branch,
            il: item.il,
            auto: item.auto,
            mbk: item.mbk,
          }));

          const monthly = result.data.mobilPaymentDetails.monthlyCumulative.branches.map((item: any) => ({
            branch: item.branch,
            il: 0,
            auto: 0,
            mbk: item.amount,
          }));

          setDailyData(daily);
          setMonthlyData(monthly);
          setPreviousBalance(result.data.mobilPaymentDetails.daily.previousDayBalance);
          setPaymentAmount(result.data.mobilPaymentDetails.daily.paymentAmount);
        }
      } catch (error) {
        console.error('Failed to fetch mobil payment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  // Mock data
  const mockDailyData: MobilBranchData[] = [
    { branch: '화성 IL', il: 45000000, auto: 0, mbk: 0 },
    { branch: '창원 IL', il: 38000000, auto: 0, mbk: 0 },
    { branch: '화성 AUTO (중부)', il: 0, auto: 42000000, mbk: 0 },
    { branch: '남부지사', il: 0, auto: 40000000, mbk: 0 },
    { branch: '인천(서부)', il: 35000000, auto: 0, mbk: 0 },
    { branch: '남양주(동부)', il: 33000000, auto: 0, mbk: 0 },
    { branch: '제주', il: 28000000, auto: 0, mbk: 0 },
    { branch: '부산', il: 36000000, auto: 0, mbk: 0 },
  ];

  const mockMonthlyData: MobilBranchData[] = [
    { branch: '화성 IL', il: 1350000000, auto: 0, mbk: 0 },
    { branch: '창원 IL', il: 1140000000, auto: 0, mbk: 0 },
    { branch: '화성 AUTO (중부)', il: 0, auto: 1260000000, mbk: 0 },
    { branch: '남부지사', il: 0, auto: 1200000000, mbk: 0 },
    { branch: '인천(서부)', il: 1050000000, auto: 0, mbk: 0 },
    { branch: '남양주(동부)', il: 990000000, auto: 0, mbk: 0 },
    { branch: '제주', il: 840000000, auto: 0, mbk: 0 },
    { branch: '부산', il: 1080000000, auto: 0, mbk: 0 },
  ];

  const daily = dailyData.length > 0 ? dailyData : mockDailyData;
  const monthly = monthlyData.length > 0 ? monthlyData : mockMonthlyData;
  const prevBalance = previousBalance || 450000000;
  const payment = paymentAmount || 280000000;

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
  const dailyILTotal = daily.reduce((sum, b) => sum + b.il, 0);
  const dailyAutoTotal = daily.reduce((sum, b) => sum + b.auto, 0);
  const dailyMBKTotal = daily.reduce((sum, b) => sum + b.mbk, 0);
  const dailyTotal = dailyILTotal + dailyAutoTotal + dailyMBKTotal;

  const monthlyILTotal = monthly.reduce((sum, b) => sum + b.il, 0);
  const monthlyAutoTotal = monthly.reduce((sum, b) => sum + b.auto, 0);
  const monthlyMBKTotal = monthly.reduce((sum, b) => sum + b.mbk, 0);
  const monthlyTotal = monthlyILTotal + monthlyAutoTotal + monthlyMBKTotal;

  const currentBalance = prevBalance + monthlyTotal - payment;

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const maxDaily = Math.max(...daily.map(b => b.il + b.auto + b.mbk));
  const maxMonthly = Math.max(...monthly.map(b => b.il + b.auto + b.mbk));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">일일 구매액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-900">{formatNumber(dailyTotal)}</div>
            <p className="text-xs text-gray-600 mt-1">Daily Purchase</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">월 누적 구매액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-900">{formatNumber(monthlyTotal)}</div>
            <p className="text-xs text-gray-600 mt-1">Monthly Purchase</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">결제금액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{formatNumber(payment)}</div>
            <p className="text-xs text-gray-600 mt-1">Payment Made</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">현재 잔액</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-900">{formatNumber(currentBalance)}</div>
            <p className="text-xs text-gray-600 mt-1">Current Balance</p>
          </div>
        </div>
      </div>

      {/* Product Type Distribution */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">제품별 구매 비중 (Product Type Distribution)</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-sm text-gray-600 mb-2">IL (Industrial Lubricants)</div>
              <div className="text-3xl font-bold text-blue-600">{formatNumber(monthlyILTotal)}</div>
              <div className="text-sm text-gray-600 mt-2">{((monthlyILTotal/monthlyTotal)*100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-sm text-gray-600 mb-2">AUTO (Automotive)</div>
              <div className="text-3xl font-bold text-green-600">{formatNumber(monthlyAutoTotal)}</div>
              <div className="text-sm text-gray-600 mt-2">{((monthlyAutoTotal/monthlyTotal)*100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-sm text-gray-600 mb-2">MBK (Marine/Others)</div>
              <div className="text-3xl font-bold text-purple-600">{formatNumber(monthlyMBKTotal)}</div>
              <div className="text-sm text-gray-600 mt-2">{((monthlyMBKTotal/monthlyTotal)*100).toFixed(1)}%</div>
            </div>
          </div>

          {/* Stacked horizontal bar */}
          <div className="h-16 w-full flex rounded-lg overflow-hidden shadow-lg">
            <div
              className="bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
              style={{ width: `${(monthlyILTotal/monthlyTotal)*100}%` }}
              title={`IL: ${formatNumber(monthlyILTotal)}`}
            >
              {(monthlyILTotal/monthlyTotal)*100 > 10 && <span>IL {((monthlyILTotal/monthlyTotal)*100).toFixed(0)}%</span>}
            </div>
            <div
              className="bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
              style={{ width: `${(monthlyAutoTotal/monthlyTotal)*100}%` }}
              title={`AUTO: ${formatNumber(monthlyAutoTotal)}`}
            >
              {(monthlyAutoTotal/monthlyTotal)*100 > 10 && <span>AUTO {((monthlyAutoTotal/monthlyTotal)*100).toFixed(0)}%</span>}
            </div>
            <div
              className="bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
              style={{ width: `${(monthlyMBKTotal/monthlyTotal)*100}%` }}
              title={`MBK: ${formatNumber(monthlyMBKTotal)}`}
            >
              {(monthlyMBKTotal/monthlyTotal)*100 > 10 && <span>MBK {((monthlyMBKTotal/monthlyTotal)*100).toFixed(0)}%</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Purchase by Branch */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded"></span>
            일일 지점별 구매 (Daily Purchase by Branch)
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-2 mb-4" style={{ height: '320px' }}>
            {daily.map((branch, idx) => {
              const total = branch.il + branch.auto + branch.mbk;
              const heightPercentage = Math.max((total / maxDaily) * 100, 5);
              const ilPercent = total > 0 ? (branch.il / total) * 100 : 0;
              const autoPercent = total > 0 ? (branch.auto / total) * 100 : 0;
              const mbkPercent = total > 0 ? (branch.mbk / total) * 100 : 0;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '280px' }}>
                    <div className="absolute -top-6 text-xs font-semibold text-red-600">
                      {formatNumber(total)}
                    </div>
                    {/* Stacked Bar */}
                    <div className="w-full flex flex-col-reverse rounded-t-lg shadow-lg overflow-hidden cursor-pointer group min-h-[20px]" style={{ height: `${heightPercentage}%` }}>
                      <div className="bg-blue-500 hover:bg-blue-600 transition-colors" style={{ height: `${ilPercent}%` }}></div>
                      <div className="bg-green-500 hover:bg-green-600 transition-colors" style={{ height: `${autoPercent}%` }}></div>
                      <div className="bg-purple-500 hover:bg-purple-600 transition-colors" style={{ height: `${mbkPercent}%` }}></div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        <div>IL: {formatNumber(branch.il)}</div>
                        <div>AUTO: {formatNumber(branch.auto)}</div>
                        <div>MBK: {formatNumber(branch.mbk)}</div>
                        <div className="border-t mt-1 pt-1">합계: {formatNumber(total)}</div>
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
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>IL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>AUTO</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>MBK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Flow */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">잔액 흐름 (Balance Flow)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">전일잔액</div>
              <div className="bg-gray-200 rounded-lg px-6 py-4 text-xl font-bold">{formatNumber(prevBalance)}</div>
            </div>

            <div className="text-3xl text-gray-400">+</div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">월 구매액</div>
              <div className="bg-orange-100 rounded-lg px-6 py-4 text-xl font-bold text-orange-700">{formatNumber(monthlyTotal)}</div>
            </div>

            <div className="text-3xl text-gray-400">-</div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">결제금액</div>
              <div className="bg-blue-100 rounded-lg px-6 py-4 text-xl font-bold text-blue-700">{formatNumber(payment)}</div>
            </div>

            <div className="text-3xl text-gray-400">=</div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">현재잔액</div>
              <div className="bg-purple-100 rounded-lg px-6 py-4 text-xl font-bold text-purple-700">{formatNumber(currentBalance)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
