import React, { useState, useEffect } from 'react';
import './App.css';
import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import FundChart from './components/FundChart';
import MobileValuesChart from './components/MobileValuesChart';
import ExpenseHistory from './components/ExpenseHistory';
import FundHistoryTable from './components/FundHistoryTable';
import CollectionsTable from './components/CollectionsTable';
import ArBalanceTable from './components/ArBalanceTable';
import MajorExpTable from './components/MajorExpTable';
import DateSelector from './components/CalendarModal';
import DbViewButton from './components/DbViewerModal';
import BasicSheetView from './components/BasicSheetView';
import BasicDailyDashboard from './components/BasicDailyDashboard';
import { playDing } from './utils/sound';
import dailyReportsData from './data/daily_reports.json';

// 메인 뷰 탭 목록
const MAIN_VIEWS = [
  { id: 'daily', label: '일보현황', icon: '📊' },
  { id: 'basic_daily', label: '기본일보', icon: '📈' },
  { id: 'basic', label: '기본시트', icon: '📋' },
];

const emptyData = {
  sales: [],
  funds: [],
  expenses: [],
  major_expenses: [],
  mobile: [],
  collections: [],
  ar_balances: []
};

// 사업소 목록
const BRANCHES = [
  '전체',
  '서울,화성 IL',
  '창원',
  '화성auto(남부)',
  '화성auto(중부)',
  '인천(서부)',
  '남양주(동부)',
  '제주',
  '부산'
];

function App() {
  const [mainView, setMainView] = useState('daily');
  const [selectedBranch, setSelectedBranch] = useState('전체');
  const [selectedDate, setSelectedDate] = useState(dailyReportsData.dates[0] || null);
  const [showCumulative, setShowCumulative] = useState(false);
  const [status, setStatus] = useState(null);

  const handleMainViewChange = (viewId) => {
    setMainView(viewId);
    playDing();
  };

  // 선택된 날짜 또는 누계 데이터 가져오기
  const getCurrentData = () => {
    if (showCumulative) {
      // 누계 데이터
      const cumulative = dailyReportsData.cumulative;
      return {
        sales: cumulative.sales || [],
        collections: cumulative.collections || [],
        funds: [],
        major_expenses: [],
        mobil_payments: [],
        totals: cumulative.totals || {}
      };
    } else {
      // 일별 데이터
      const dailyData = dailyReportsData.daily_data.find(d => d.date === selectedDate);
      return dailyData || emptyData;
    }
  };

  const data = getCurrentData();

  // 사업소 필터링된 데이터
  const getFilteredData = () => {
    if (selectedBranch === '전체') {
      return data;
    }
    return {
      sales: data.sales?.filter(s => s.branch === selectedBranch || s.branch.includes(selectedBranch.split(',')[0])) || [],
      collections: data.collections?.filter(c => c.branch === selectedBranch || c.branch.includes(selectedBranch.split(',')[0]) || selectedBranch.includes(c.branch)) || [],
      funds: data.funds || [],
      major_expenses: data.major_expenses || [],
      mobil_payments: data.mobil_payments?.filter(m => m.branch.includes(selectedBranch.split(',')[0]) || selectedBranch.includes(m.branch)) || [],
    };
  };

  const filteredData = getFilteredData();

  useEffect(() => {
    setStatus("Loading...");
    const timer = setTimeout(() => {
      setStatus(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedDate, showCumulative]);

  // 누계 모드일 때는 cumulative.totals 사용, 일별일 때는 계산
  const totalSales = showCumulative && selectedBranch === '전체'
    ? dailyReportsData.cumulative.totals.total_sales
    : filteredData.sales ? filteredData.sales.reduce((acc, curr) => acc + (curr.total_sales || 0), 0) : 0;

  const totalFundsIn = showCumulative && selectedBranch === '전체'
    ? dailyReportsData.cumulative.totals.total_funds_in
    : filteredData.funds ? filteredData.funds.filter(f => f.type === '당입').reduce((acc, curr) => acc + (curr.general_deposit || 0), 0) : 0;

  const totalCollections = showCumulative && selectedBranch === '전체'
    ? dailyReportsData.cumulative.totals.total_collection
    : filteredData.collections ? filteredData.collections.reduce((acc, curr) => acc + (curr.total_collection || 0), 0) : 0;

  const totalArBalance = showCumulative && selectedBranch === '전체'
    ? dailyReportsData.cumulative.totals.total_ar_balance
    : filteredData.collections ? filteredData.collections.reduce((acc, curr) => acc + (curr.ar_balance || 0), 0) : 0;

  const reportDate = showCumulative ? `${dailyReportsData.dates[0]} ~ ${dailyReportsData.dates[dailyReportsData.dates.length - 1]}` : selectedDate;
  const branchCount = filteredData.sales ? filteredData.sales.length : 0;

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    playDing();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCumulative(false);
    playDing();
  };

  const handleToggleCumulative = (isCumulative) => {
    setShowCumulative(isCumulative);
    playDing();
  };

  return (
    <div className="dashboard-container">
      <header>
        <div>
          <h1>영일오엔씨 Daily Report</h1>
          <div className="date-display">
            {mainView === 'daily' ? (showCumulative ? '누계' : '일별') + ': ' + reportDate : '기본시트 데이터'}
          </div>
        </div>
        <div className="header-controls">
          <DbViewButton />
          {mainView === 'daily' && (
            <DateSelector
              availableDates={dailyReportsData.dates}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              showCumulative={showCumulative}
              onToggleCumulative={handleToggleCumulative}
            />
          )}
        </div>
      </header>

      {/* Main View Tabs */}
      <div className="main-tabs">
        {MAIN_VIEWS.map(view => (
          <button
            key={view.id}
            className={`main-tab ${mainView === view.id ? 'active' : ''}`}
            onClick={() => handleMainViewChange(view.id)}
          >
            <span className="tab-icon">{view.icon}</span>
            {view.label}
          </button>
        ))}
      </div>

      {/* Basic Sheet View */}
      {mainView === 'basic' && <BasicSheetView />}

      {/* Basic Daily Dashboard View */}
      {mainView === 'basic_daily' && <BasicDailyDashboard />}

      {/* Daily Report View */}
      {mainView === 'daily' && (
        <>
          {/* Branch Selector */}
          <div className="branch-container">
            <div className="branch-buttons">
              {BRANCHES.map((branch) => (
                <button
                  key={branch}
                  className={`branch-button ${selectedBranch === branch ? 'active' : ''}`}
                  onClick={() => handleBranchChange(branch)}
                >
                  {branch === '전체' ? '전체 합산' : branch}
                </button>
              ))}
            </div>
            <span className="branch-info">
              선택: {selectedBranch} | 사업소: {branchCount}개
            </span>
          </div>

          {/* Row 1: Key Metrics */}
          <div className="metrics-grid">
            <MetricCard title="Total Sales (총매출)" value={`₩${new Intl.NumberFormat('ko-KR').format(totalSales)}`} color="#3b82f6" />
            <MetricCard title="Collections (수금)" value={`₩${new Intl.NumberFormat('ko-KR').format(totalCollections)}`} color="#8b5cf6" />
            <MetricCard title="AR Balance (미수잔액)" value={`₩${new Intl.NumberFormat('ko-KR').format(totalArBalance)}`} color="#ef4444" />
            <MetricCard title="Funds In (자금입금)" value={`₩${new Intl.NumberFormat('ko-KR').format(totalFundsIn)}`} color="#10b981" />
          </div>

          {/* Row 2: Sales Charts & Tables */}
          <div className="charts-grid">
            <SalesChart data={filteredData.sales} />
            <div className="card">
              <div className="card-title">Detailed Sales Data (상세 매출)</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Branch (사업소)</th>
                    <th>Total Sales (총매출)</th>
                    <th>Sell-out (판매)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.sales && filteredData.sales.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.branch}</td>
                      <td>{new Intl.NumberFormat('ko-KR').format(row.total_sales)}</td>
                      <td>{new Intl.NumberFormat('ko-KR').format(row.mobil_sell_out || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 3: Collections & AR Balances */}
          <div className="charts-grid">
            <CollectionsTable data={filteredData.collections} />
            <ArBalanceTable data={filteredData.ar_balances} />
          </div>

          {/* Row 4: Funds & Mobile */}
          <div className="charts-grid">
            <FundChart data={filteredData.funds} />
            <div>
              <MobileValuesChart data={filteredData.mobile} />
              <div className="card" style={{ marginTop: '12px' }}>
                <div className="card-title">Mobile Payment Summary (모빌 결제 요약)</div>
                <p className="text-secondary">매출 기록에서 추출 (Sell-out/Sell-in)</p>
              </div>
            </div>
          </div>

          {/* Row 5: Fund History */}
          <div className="charts-grid">
            <FundHistoryTable data={filteredData.funds} />
            <div className="card">
              <div className="card-title">System Status (시스템 상태)</div>
              <p className="text-secondary">
                선택 사업소: {selectedBranch} |
                업데이트: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Row 6: Major Expenses & Transaction History */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <MajorExpTable data={filteredData.major_expenses} />
            <ExpenseHistory data={filteredData.expenses} />
          </div>
        </>
      )}

      {/* Status Overlay */}
      {status && (
        <div className="status-overlay">
          <div className="status-message">{status}</div>
        </div>
      )}
    </div>
  );
}

export default App;
