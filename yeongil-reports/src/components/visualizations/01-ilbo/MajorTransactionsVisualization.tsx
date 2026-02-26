'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  source: string;
  amount: number;
  description: string;
}

interface MajorTransactionsVisualizationProps {
  type: 'deposit' | 'expense';
  date?: string;
  title?: string;
}

export default function MajorTransactionsVisualization({
  type,
  date,
  title
}: MajorTransactionsVisualizationProps) {

  const [cardTransactions, setCardTransactions] = useState<Transaction[]>([]);
  const [billTransactions, setBillTransactions] = useState<Transaction[]>([]);
  const [cashTransactions, setCashTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const isDeposit = type === 'deposit';
  const defaultTitle = isDeposit ? '주요입금현황 (Major Deposits)' : '주요비용 지출현황 (Major Expenses)';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/operations/01-ilbo?date=${selectedDate}`);
        const result = await response.json();

        if (result.success && result.data) {
          const source = isDeposit ? result.data.majorDeposits : result.data.majorExpenses;

          setCardTransactions(source.card.slice(0, 3).map((item: any) => ({
            source: isDeposit ? item.source : item.destination,
            amount: item.amount,
            description: item.description,
          })));

          setBillTransactions(source.notes.slice(0, 3).map((item: any) => ({
            source: isDeposit ? item.source : item.destination,
            amount: item.amount,
            description: item.description,
          })));

          setCashTransactions(source.cash.slice(0, 3).map((item: any) => ({
            source: isDeposit ? item.source : item.destination,
            amount: item.amount,
            description: item.description,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch transaction data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, type, isDeposit]);

  // Mock data for deposits
  const mockDepositCard: Transaction[] = [
    { source: '현대오일뱅크', amount: 250000000, description: '월간 정산' },
    { source: 'SK에너지', amount: 180000000, description: '카드 매출' },
    { source: 'GS칼텍스', amount: 150000000, description: '정기 결제' },
  ];

  const mockDepositBill: Transaction[] = [
    { source: '대우인터내셔널', amount: 120000000, description: '외상 수금' },
    { source: '한화토탈', amount: 90000000, description: '어음 결제' },
    { source: '롯데케미칼', amount: 80000000, description: '정기 거래' },
  ];

  const mockDepositCash: Transaction[] = [
    { source: '소매 직거래', amount: 85000000, description: '현금 매출' },
    { source: '특수 고객', amount: 65000000, description: '현금 결제' },
    { source: '기타', amount: 45000000, description: '기타 입금' },
  ];

  // Mock data for expenses
  const mockExpenseCard: Transaction[] = [
    { source: '모빌코리아', amount: 350000000, description: '원유 구매' },
    { source: 'SK루브리컨츠', amount: 180000000, description: '윤활유 매입' },
    { source: '부자재 공급업체', amount: 120000000, description: '포장재/소모품' },
  ];

  const mockExpenseBill: Transaction[] = [
    { source: '운송업체', amount: 95000000, description: '물류비' },
    { source: '설비 유지보수', amount: 75000000, description: '시설관리' },
    { source: '임차료', amount: 60000000, description: '창고/사무실' },
  ];

  const mockExpenseCash: Transaction[] = [
    { source: '급여', amount: 180000000, description: '직원 급여' },
    { source: '관리비', amount: 45000000, description: '공과금/관리' },
    { source: '접대비/복리후생', amount: 35000000, description: '기타 경비' },
  ];

  const card = cardTransactions.length > 0 ? cardTransactions : (isDeposit ? mockDepositCard : mockExpenseCard);
  const bill = billTransactions.length > 0 ? billTransactions : (isDeposit ? mockDepositBill : mockExpenseBill);
  const cash = cashTransactions.length > 0 ? cashTransactions : (isDeposit ? mockDepositCash : mockExpenseCash);

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

  const totalCard = card.reduce((sum, t) => sum + t.amount, 0);
  const totalBill = bill.reduce((sum, t) => sum + t.amount, 0);
  const totalCash = cash.reduce((sum, t) => sum + t.amount, 0);
  const grandTotal = totalCard + totalBill + totalCash;

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const colorScheme = isDeposit
    ? { primary: 'green', secondary: 'teal', tertiary: 'emerald' }
    : { primary: 'red', secondary: 'orange', tertiary: 'rose' };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title || defaultTitle}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`bg-gradient-to-br from-${colorScheme.primary}-50 to-${colorScheme.primary}-100 border-2 border-${colorScheme.primary}-200 rounded-lg p-4 shadow-sm`}>
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">총 {isDeposit ? '입금' : '지출'}액</h3>
          </div>
          <div>
            <div className={`text-2xl font-bold text-${colorScheme.primary}-900`}>{formatNumber(grandTotal)}</div>
            <p className="text-xs text-gray-600 mt-1">Total</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">카드</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-900">{formatNumber(totalCard)}</div>
            <p className="text-xs text-gray-600 mt-1">{((totalCard/grandTotal)*100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">어음</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{formatNumber(totalBill)}</div>
            <p className="text-xs text-gray-600 mt-1">{((totalBill/grandTotal)*100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">현금</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900">{formatNumber(totalCash)}</div>
            <p className="text-xs text-gray-600 mt-1">{((totalCash/grandTotal)*100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown Pie Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">결제 수단별 비중 (Payment Method Breakdown)</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center gap-8">
            {/* Simple horizontal stacked bar */}
            <div className="flex-1">
              <div className="h-24 w-full flex rounded-lg overflow-hidden shadow-lg">
                <div
                  className="bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
                  style={{ width: `${(totalCard/grandTotal)*100}%` }}
                  title={`카드: ${formatNumber(totalCard)}`}
                >
                  {(totalCard/grandTotal)*100 > 15 && <span>카드 {((totalCard/grandTotal)*100).toFixed(0)}%</span>}
                </div>
                <div
                  className="bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
                  style={{ width: `${(totalBill/grandTotal)*100}%` }}
                  title={`어음: ${formatNumber(totalBill)}`}
                >
                  {(totalBill/grandTotal)*100 > 15 && <span>어음 {((totalBill/grandTotal)*100).toFixed(0)}%</span>}
                </div>
                <div
                  className="bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center text-white font-semibold cursor-pointer"
                  style={{ width: `${(totalCash/grandTotal)*100}%` }}
                  title={`현금: ${formatNumber(totalCash)}`}
                >
                  {(totalCash/grandTotal)*100 > 15 && <span>현금 {((totalCash/grandTotal)*100).toFixed(0)}%</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Transactions by Payment Method */}
      <div className="grid grid-cols-3 gap-4">
        {/* Card */}
        <div className="bg-white border-2 border-purple-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-purple-200 bg-purple-50">
            <h3 className="text-lg font-semibold text-purple-900">카드 Top 3</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {card.map((transaction, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-3 py-2 hover:bg-purple-50 transition-colors">
                  <div className="font-medium text-sm">{transaction.source}</div>
                  <div className="text-xs text-gray-600 mt-1">{transaction.description}</div>
                  <div className="text-lg font-bold text-purple-600 mt-1">{formatNumber(transaction.amount)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t-2 border-purple-200 font-bold text-purple-900">
              합계: {formatNumber(totalCard)}
            </div>
          </div>
        </div>

        {/* Bill */}
        <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-blue-200 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900">어음 Top 3</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {bill.map((transaction, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2 hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-sm">{transaction.source}</div>
                  <div className="text-xs text-gray-600 mt-1">{transaction.description}</div>
                  <div className="text-lg font-bold text-blue-600 mt-1">{formatNumber(transaction.amount)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t-2 border-blue-200 font-bold text-blue-900">
              합계: {formatNumber(totalBill)}
            </div>
          </div>
        </div>

        {/* Cash */}
        <div className="bg-white border-2 border-amber-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-amber-200 bg-amber-50">
            <h3 className="text-lg font-semibold text-amber-900">현금 Top 3</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {cash.map((transaction, idx) => (
                <div key={idx} className="border-l-4 border-amber-500 pl-3 py-2 hover:bg-amber-50 transition-colors">
                  <div className="font-medium text-sm">{transaction.source}</div>
                  <div className="text-xs text-gray-600 mt-1">{transaction.description}</div>
                  <div className="text-lg font-bold text-amber-600 mt-1">{formatNumber(transaction.amount)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t-2 border-amber-200 font-bold text-amber-900">
              합계: {formatNumber(totalCash)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
