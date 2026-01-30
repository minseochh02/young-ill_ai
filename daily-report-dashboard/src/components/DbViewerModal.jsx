import React, { useState } from 'react';
import { Database, X, Download, Table } from 'lucide-react';
import dailyReportsData from '../data/daily_reports.json';

const TABS = [
    { id: 'sales', label: '매출DB', icon: '📊' },
    { id: 'collections', label: '수금DB', icon: '💰' },
    { id: 'funds', label: '자금DB', icon: '🏦' },
    { id: 'expenses', label: '주요비용DB', icon: '💳' },
    { id: 'mobil', label: '모빌결제DB', icon: '⛽' },
    { id: 'daily', label: '일별합계DB', icon: '📅' },
];

const DbViewerModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('sales');

    const formatNumber = (num) => {
        if (num === null || num === undefined || isNaN(num)) return '-';
        return new Intl.NumberFormat('ko-KR').format(Math.round(num));
    };

    const renderSalesTable = () => (
        <table className="db-table">
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>사업소</th>
                    <th>총매출액</th>
                    <th>모빌Sell-out</th>
                    <th>Total(L)</th>
                    <th>Flagship(L)</th>
                </tr>
            </thead>
            <tbody>
                {dailyReportsData.daily_data.flatMap(day =>
                    day.sales.map((s, idx) => (
                        <tr key={`${day.date}-${idx}`}>
                            <td>{day.date}</td>
                            <td>{s.branch}</td>
                            <td className="text-right">{formatNumber(s.total_sales)}</td>
                            <td className="text-right">{formatNumber(s.mobil_sell_out)}</td>
                            <td className="text-right">{formatNumber(s.mobil_sell_out_total_l)}</td>
                            <td className="text-right">{formatNumber(s.mobil_sell_out_flagship_l)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderCollectionsTable = () => (
        <table className="db-table">
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>사업소</th>
                    <th>총수금액</th>
                    <th>현금</th>
                    <th>어음</th>
                    <th>카드</th>
                    <th>미수잔액</th>
                </tr>
            </thead>
            <tbody>
                {dailyReportsData.daily_data.flatMap(day =>
                    day.collections.map((c, idx) => (
                        <tr key={`${day.date}-${idx}`}>
                            <td>{day.date}</td>
                            <td>{c.branch}</td>
                            <td className="text-right">{formatNumber(c.total_collection)}</td>
                            <td className="text-right">{formatNumber(c.cash)}</td>
                            <td className="text-right">{formatNumber(c.bill)}</td>
                            <td className="text-right">{formatNumber(c.card)}</td>
                            <td className="text-right text-danger">{formatNumber(c.ar_balance)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderFundsTable = () => (
        <table className="db-table">
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>구분</th>
                    <th>보통예금</th>
                    <th>전자어음</th>
                    <th>외담대</th>
                    <th>적금+보험</th>
                    <th>CMA</th>
                </tr>
            </thead>
            <tbody>
                {dailyReportsData.daily_data.flatMap(day =>
                    day.funds.map((f, idx) => (
                        <tr key={`${day.date}-${idx}`}>
                            <td>{day.date}</td>
                            <td>{f.type}</td>
                            <td className="text-right">{formatNumber(f.general_deposit)}</td>
                            <td className="text-right">{formatNumber(f.electronic_bill)}</td>
                            <td className="text-right">{formatNumber(f.loans)}</td>
                            <td className="text-right">{formatNumber(f.savings_insurance)}</td>
                            <td className="text-right">{formatNumber(f.cma)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderExpensesTable = () => (
        <table className="db-table">
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>거래처</th>
                    <th>금액</th>
                    <th>적요</th>
                </tr>
            </thead>
            <tbody>
                {dailyReportsData.daily_data.flatMap(day =>
                    day.major_expenses.map((e, idx) => (
                        <tr key={`${day.date}-${idx}`}>
                            <td>{day.date}</td>
                            <td>{e.client}</td>
                            <td className="text-right">{formatNumber(e.amount)}</td>
                            <td>{e.description}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderMobilTable = () => (
        <table className="db-table">
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>사업소</th>
                    <th>IL</th>
                    <th>AUTO</th>
                    <th>MBK</th>
                    <th>합계</th>
                </tr>
            </thead>
            <tbody>
                {dailyReportsData.daily_data.flatMap(day =>
                    day.mobil_payments.map((m, idx) => (
                        <tr key={`${day.date}-${idx}`}>
                            <td>{day.date}</td>
                            <td>{m.branch}</td>
                            <td className="text-right">{formatNumber(m.il)}</td>
                            <td className="text-right">{formatNumber(m.auto)}</td>
                            <td className="text-right">{formatNumber(m.mbk)}</td>
                            <td className="text-right">{formatNumber(m.total)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const renderDailyTable = () => (
        <table className="db-table">
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>총매출액</th>
                    <th>총Sell-out</th>
                    <th>총수금액</th>
                    <th>총미수잔액</th>
                </tr>
            </thead>
            <tbody>
                {dailyReportsData.daily_data.map(day => (
                    <tr key={day.date}>
                        <td>{day.date}</td>
                        <td className="text-right">{formatNumber(day.totals.total_sales)}</td>
                        <td className="text-right">{formatNumber(day.totals.total_mobil_sell_out)}</td>
                        <td className="text-right">{formatNumber(day.totals.total_collection)}</td>
                        <td className="text-right text-danger">{formatNumber(day.totals.total_ar_balance)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderTable = () => {
        switch (activeTab) {
            case 'sales': return renderSalesTable();
            case 'collections': return renderCollectionsTable();
            case 'funds': return renderFundsTable();
            case 'expenses': return renderExpensesTable();
            case 'mobil': return renderMobilTable();
            case 'daily': return renderDailyTable();
            default: return null;
        }
    };

    const handleDownload = () => {
        window.open('/영일오엔씨_마스터DB.xlsx', '_blank');
    };

    return (
        <div className="db-modal-overlay" onClick={onClose}>
            <div className="db-modal" onClick={e => e.stopPropagation()}>
                <div className="db-modal-header">
                    <div className="db-modal-title">
                        <Database size={20} />
                        <span>마스터 DB 조회</span>
                    </div>
                    <div className="db-modal-actions">
                        <button className="db-download-btn" onClick={handleDownload}>
                            <Download size={16} />
                            <span>엑셀 다운로드</span>
                        </button>
                        <button className="db-close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="db-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`db-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="db-table-container">
                    {renderTable()}
                </div>

                <div className="db-modal-footer">
                    <span>총 {dailyReportsData.dates.length}일 데이터</span>
                    <span>|</span>
                    <span>기간: {dailyReportsData.dates[0]} ~ {dailyReportsData.dates[dailyReportsData.dates.length - 1]}</span>
                </div>
            </div>
        </div>
    );
};

const DbViewButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className="db-view-btn" onClick={() => setIsOpen(true)}>
                <Table size={16} />
                <span>DB 보기</span>
            </button>
            {isOpen && <DbViewerModal onClose={() => setIsOpen(false)} />}
        </>
    );
};

export default DbViewButton;
