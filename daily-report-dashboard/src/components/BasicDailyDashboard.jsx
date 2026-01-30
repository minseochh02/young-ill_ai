import React, { useState, useMemo } from 'react';
import basicSheetsData from '../data/basic_sheets.json';
import { exportToCSV } from '../utils/excelExporter';
import { getPeriodDates, PERIOD_OPTIONS } from '../utils/dateUtils';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, ComposedChart
} from 'recharts';

// 유틸리티 함수
const formatCurrency = (val) => {
    if (val === undefined || val === null) return '-';
    return `₩${new Intl.NumberFormat('ko-KR').format(Math.round(val))}`;
};

const formatNumber = (val) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('ko-KR').format(Math.round(val));
};

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#64748b'];

export default function BasicDailyDashboard() {
    // 필터 상태
    const [selectedBranch, setSelectedBranch] = useState('전체');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedManager, setSelectedManager] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedReportType, setSelectedReportType] = useState('all'); // 'all', 'sales', 'purchase', 'collection', 'payment', 'deposit'

    // 데이터 로드
    const rawData = basicSheetsData.data || {};

    // 사업소 목록 (일보현황과 동일하게 맞춤)
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

    // 사업소 이름 매핑 (Dashboard Select Option -> Data File Branch Name)
    const BRANCH_MAPPING = {
        '서울,화성 IL': ['화성사업소', 'MB', '서울'],
        '창원': ['창원사업소', '창원'],
        '화성auto(남부)': ['남부지사', '남부'],
        '화성auto(중부)': ['중부사업소', '중부'],
        '인천(서부)': ['서부사업소', '서부', '인천'],
        '남양주(동부)': ['동부사업소', '동부', '남양주'],
        '제주': ['제주사업소', '제주'],
        '부산': ['부산사업소', '부산']
    };

    const REPORT_TYPES = [
        { id: 'all', label: '종합(All)' },
        { id: 'sales', label: '판매일보' },
        { id: 'purchase', label: '구매일보' },
        { id: 'collection', label: '수금일보' },
        { id: 'payment', label: '지급일보' },
        { id: 'deposit', label: '입금일보' },
    ];

    // 2. 데이터 필터링 및 집계 수행
    const stats = useMemo(() => {
        // 집계용 초기 구조
        const daily_stats = {}; // { 'YYYY-MM-DD': { sales: 0, ... } }
        const client_sales = {};
        const item_sales = {};
        const total_metrics = { sales: 0, purchase: 0, collection: 0, payment: 0, deposit: 0, profit: 0 };

        // 날짜 정규화 헬퍼
        const normalizeDate = (d) => {
            if (!d) return null;
            return String(d).replace(/\//g, '-').split(' ')[0];
        };

        const getSafeFloat = (val) => {
            const num = parseFloat(val);
            return isNaN(num) ? 0 : num;
        };

        const addToDaily = (date, key, amount) => {
            if (!date) return;
            if (!daily_stats[date]) {
                daily_stats[date] = { sales: 0, purchase: 0, collection: 0, payment: 0, deposit: 0, profit: 0, date };
            }
            daily_stats[date][key] += amount;
        };

        // --- A. 매출 (Sales) 필터링 ---
        if (rawData.sales?.records) {
            rawData.sales.records.forEach(rec => {
                // 필터 조건 확인
                const recBranch = rec['거래처그룹1코드명'];
                const recDate = normalizeDate(rec['일자']);
                const recClient = rec['판매처명'];
                const recManager = rec['담당자명'] || rec['영업담당자'] || ''; // Adjust key as per data
                const recItem = rec['품목명(규격)'];

                if (selectedBranch !== '전체') {
                    // 선택된 사업소에 해당하는 키워드/이름 목록 가져오기
                    const targetKeywords = BRANCH_MAPPING[selectedBranch] || [selectedBranch];

                    // 레코드의 지점명(recBranch)이 키워드 목록 중 하나라도 포함하거나 일치하면 통과
                    const isMatch = targetKeywords.some(keyword => recBranch?.includes(keyword));
                    if (!isMatch) return;
                }

                if (startDate && recDate < startDate) return;
                if (endDate && recDate > endDate) return;
                if (selectedClient && !recClient?.includes(selectedClient)) return;
                if (selectedManager && !recManager?.includes(selectedManager)) return;
                if (selectedItem && !recItem?.includes(selectedItem)) return;

                const amount = getSafeFloat(rec['합 계']);
                addToDaily(recDate, 'sales', amount);
                total_metrics.sales += amount;

                // Analytics 집계
                if (recClient) client_sales[recClient] = (client_sales[recClient] || 0) + amount;
                if (recItem) item_sales[recItem] = (item_sales[recItem] || 0) + amount;
            });
        }

        // --- B. 매입 (Purchases) 필터링 ---
        // 매입은 '사업소' 정보가 없을 수 있음 -> '전체'일 때만 포함하거나, 별도 로직 필요.
        // 여기서는 '전체' 선택 시에만 포함하도록 하거나, 필터가 없을 때 포함.
        // 사용자 요구: '관련 자료' -> 사업소가 다르면 매입은 제외하는게 맞음 (데이터에 사업소가 없다면)
        // 단, 구매현황 파일에 사업소 정보가 정말 없는지 확인 필요. 아까 파싱 로직엔 없었음.
        // 따라서: 사업소 필터가 '전체'일 때만 매입 집계 (정확성을 위해)
        if (rawData.purchases?.records && selectedBranch === '전체') {
            rawData.purchases.records.forEach(rec => {
                const recDate = normalizeDate(rec['일자']);
                const recClient = rec['구매처명'];
                const recItem = rec['품목명'];

                if (startDate && recDate < startDate) return;
                if (endDate && recDate > endDate) return;
                if (selectedClient && !recClient?.includes(selectedClient)) return; // 여기선 Client가 구매처
                // 품목 필터 적용 (매입 품목도 검색 대상이라면)
                if (selectedItem && !recItem?.includes(selectedItem)) return;

                // 단, '거래처' 필터가 '판매처'를 의미하면 매입처와 섞일 수 있음. 
                // 여기서는 입력된 텍스트가 포함되면 다 보여주는 식으로 유연하게.

                const amount = getSafeFloat(rec['합 계']);
                addToDaily(recDate, 'purchase', amount);
                total_metrics.purchase += amount;
            });
        }

        // --- C. 수금, 지급, 입금 (Collections, Payments, Deposits) ---
        // 이들 역시 사업소 정보가 명확치 않음(수금현황 파일 자체에 구분 없다면).
        // '전체'일 때만 포함.
        const processSimpleList = (records, key, clientKey, amountKey, dateKey) => {
            if (!records || selectedBranch !== '전체') return;

            records.forEach(rec => {
                const recDate = normalizeDate(rec[dateKey]);
                const recClient = rec[clientKey];

                if (startDate && recDate < startDate) return;
                if (endDate && recDate > endDate) return;
                if (selectedClient && !recClient?.includes(selectedClient)) return;

                const amount = getSafeFloat(rec[amountKey]);
                addToDaily(recDate, key, amount);
                total_metrics[key] += amount;
            });
        };

        processSimpleList(rawData.collections?.records, 'collection', '거래처명', '금액', '일자-No.');
        processSimpleList(rawData.payments?.records, 'payment', '거래처명', '금액', '일자-No.');
        processSimpleList(rawData.deposits?.records, 'deposit', '거래처명', '금액', '전표번호'); // 입금 전표번호 파싱 로직 체크

        // --- 결과 정리 ---
        // 일별 추이 정렬
        const daily_trends = Object.values(daily_stats).sort((a, b) => a.date.localeCompare(b.date));

        // 이익 계산
        daily_trends.forEach(d => {
            d.profit = d.sales - d.purchase;
        });
        total_metrics.profit = total_metrics.sales - total_metrics.purchase;

        // Top 5 Analytics
        const top_clients = Object.entries(client_sales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

        const top_items = Object.entries(item_sales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

        return { daily_trends, totals: total_metrics, analytics: { top_clients, top_items } };

    }, [rawData, selectedBranch, startDate, endDate, selectedClient, selectedManager, selectedItem]);

    if (!rawData.sales) {
        return <div className="p-4">데이터 로딩 중이거나 데이터가 없습니다.</div>;
    }

    const { daily_trends, totals, analytics } = stats;

    return (
        <div className="daily-dashboard">
            <h2 className="section-title" style={{ marginTop: '0', marginBottom: '20px' }}>기본일보 (Daily Report)</h2>

            {/* 필터 컨트롤 바 */}
            <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Row 1: 사업소, 기간, 표시기간 */}
                <div className="filter-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                    <div className="filter-group">
                        <label>사업소</label>
                        <select
                            value={selectedBranch}
                            onChange={e => setSelectedBranch(e.target.value)}
                            className="form-select"
                        >
                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>검색 기간</label>
                        <div className="date-range-container">
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="form-input"
                            />
                            <span>~</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="form-input"
                            />
                            {(startDate || endDate) && <button className="btn-clear" onClick={() => { setStartDate(''); setEndDate(''); }}>✕</button>}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>표시기간</label>
                        <select
                            className="form-select"
                            onChange={(e) => {
                                if (e.target.value) {
                                    const { startDate, endDate } = getPeriodDates(e.target.value);
                                    setStartDate(startDate);
                                    setEndDate(endDate);
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>기간 선택...</option>
                            {PERIOD_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 2: 거래처명, 담당자명, 품목명 */}
                <div className="filter-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                    <div className="filter-group">
                        <label>거래처명</label>
                        <input
                            type="text"
                            placeholder="거래처 검색..."
                            value={selectedClient}
                            onChange={e => setSelectedClient(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>담당자명</label>
                        <input
                            type="text"
                            placeholder="담당자 검색..."
                            value={selectedManager}
                            onChange={e => setSelectedManager(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>품목명</label>
                        <input
                            type="text"
                            placeholder="품목 검색..."
                            value={selectedItem}
                            onChange={e => setSelectedItem(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 보고서 유형 선택 버튼 */}
            <div className="report-type-selector card" style={{ marginBottom: '20px', padding: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {REPORT_TYPES.map(type => (
                    <button
                        key={type.id}
                        className={`btn-report-type ${selectedReportType === type.id ? 'active' : ''}`}
                        onClick={() => setSelectedReportType(type.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            backgroundColor: selectedReportType === type.id ? '#0ea5e9' : '#fff',
                            color: selectedReportType === type.id ? '#fff' : '#333',
                            cursor: 'pointer',
                            fontWeight: selectedReportType === type.id ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* 1. 요약 카드 (선택 유형에 따라 필터링) */}
            <div className="summary-cards" style={{ marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {(selectedReportType === 'all' || selectedReportType === 'sales') &&
                    <MetricCard title="기간 총 매출" value={totals.sales} color="primary" />}
                {(selectedReportType === 'all' || selectedReportType === 'purchase') &&
                    <MetricCard title="기간 총 매입" value={totals.purchase} color="danger" />}
                {(selectedReportType === 'all') &&
                    <MetricCard title="영업이익 (매출-매입)" value={totals.profit} color={totals.profit >= 0 ? "success" : "danger"} />}
                {(selectedReportType === 'all' || selectedReportType === 'collection') &&
                    <MetricCard title="총 수금" value={totals.collection} color="info" />}
                {(selectedReportType === 'all' || selectedReportType === 'payment') &&
                    <MetricCard title="총 지급" value={totals.payment} color="warning" />}
                {(selectedReportType === 'all' || selectedReportType === 'deposit') &&
                    <MetricCard title="총 입금" value={totals.deposit} color="success" />}
            </div>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: selectedReportType === 'all' ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '30px' }}>
                {/* 2. 매출/매입 추이 */}
                {(selectedReportType === 'all' || selectedReportType === 'sales' || selectedReportType === 'purchase') && (
                    <div className="card">
                        <div className="card-title">
                            {selectedReportType === 'sales' ? '일별 매출 추이' :
                                selectedReportType === 'purchase' ? '일별 매입 추이' :
                                    '일별 매출/매입 추이'}
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={daily_trends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" orientation="left" tickFormatter={(val) => `${(val / 10000).toFixed(0)}만`} />
                                    {selectedReportType === 'all' && <YAxis yAxisId="right" orientation="right" tickFormatter={(val) => `${(val / 10000).toFixed(0)}만`} />}
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    {(selectedReportType === 'all' || selectedReportType === 'sales') &&
                                        <Bar yAxisId="left" dataKey="sales" name="매출" fill="#0ea5e9" barSize={20} />}
                                    {(selectedReportType === 'all' || selectedReportType === 'purchase') &&
                                        <Bar yAxisId="left" dataKey="purchase" name="매입" fill="#f97316" barSize={20} />}
                                    {selectedReportType === 'all' &&
                                        <Line yAxisId="right" type="monotone" dataKey="profit" name="이익" stroke="#22c55e" />}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* 3. 자금 흐름 */}
                {(selectedReportType === 'all' || ['collection', 'payment', 'deposit'].includes(selectedReportType)) && (
                    <div className="card">
                        <div className="card-title">
                            {selectedReportType === 'collection' ? '일별 수금 추이' :
                                selectedReportType === 'payment' ? '일별 지급 추이' :
                                    selectedReportType === 'deposit' ? '일별 입금 추이' :
                                        '일별 자금 흐름 (수금/지급/입금)'}
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={daily_trends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" />
                                    <YAxis tickFormatter={(val) => `${(val / 10000).toFixed(0)}만`} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    {(selectedReportType === 'all' || selectedReportType === 'collection') && <Bar dataKey="collection" name="수금" fill="#3b82f6" />}
                                    {(selectedReportType === 'all' || selectedReportType === 'payment') && <Bar dataKey="payment" name="지급" fill="#eab308" />}
                                    {(selectedReportType === 'all' || selectedReportType === 'deposit') && <Bar dataKey="deposit" name="입금" fill="#10b981" />}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Analytics - Sales Only (Only show when Sales or All is selected) */}
            {(selectedReportType === 'all' || selectedReportType === 'sales') && (
                <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                    {/* 4. Top 거래처 (Pie) */}
                    <div className="card">
                        <div className="card-title">매출 Top 5 거래처 (선택 기간/조건)</div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.top_clients}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#0ea5e9"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {analytics.top_clients.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 5. Top 품목 (Bar) */}
                    <div className="card">
                        <div className="card-title">매출 Top 5 품목 (선택 기간/조건)</div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.top_items} layout="vertical" margin={{ left: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" tickFormatter={(val) => `${(val / 10000).toFixed(0)}만`} />
                                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="value" name="매출액" fill="#22c55e" barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. 상세 데이터 테이블 */}
            <div className="card">
                <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>일자별 현황 상세 ({REPORT_TYPES.find(t => t.id === selectedReportType)?.label})</span>
                    <button
                        onClick={() => {
                            const headers = {
                                date: '일자',
                                sales: '매출액',
                                purchase: '매입액',
                                profit: '영업이익',
                                collection: '수금액',
                                payment: '지급액',
                                deposit: '입금액'
                            };
                            // Only include visible columns based on report type?
                            // For simplicity, we export all columns or just relevant ones.
                            // Let's filter keys based on logic if needed, but exporting all is usually fine.
                            // Or better, construct a flat list of data that matches the table.

                            const exportData = daily_trends.map(row => ({
                                date: row.date,
                                sales: row.sales,
                                purchase: row.purchase,
                                profit: row.profit,
                                collection: row.collection,
                                payment: row.payment,
                                deposit: row.deposit
                            }));

                            exportToCSV(exportData, `기본일보_${selectedReportType}_${new Date().toISOString().slice(0, 10)}`, headers);
                        }}
                        style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#217346', // Excel green
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        엑셀파일로 저장
                    </button>
                </div>
                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>일자</th>
                                {(selectedReportType === 'all' || selectedReportType === 'sales') && <th className="text-right">매출액</th>}
                                {(selectedReportType === 'all' || selectedReportType === 'purchase') && <th className="text-right">매입액</th>}
                                {(selectedReportType === 'all') && <th className="text-right">영업이익</th>}
                                {(selectedReportType === 'all' || selectedReportType === 'collection') && <th className="text-right">수금액</th>}
                                {(selectedReportType === 'all' || selectedReportType === 'payment') && <th className="text-right">지급액</th>}
                                {(selectedReportType === 'all' || selectedReportType === 'deposit') && <th className="text-right">입금액</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {daily_trends.length > 0 ? (
                                daily_trends.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{row.date}</td>
                                        {(selectedReportType === 'all' || selectedReportType === 'sales') && <td className="text-right text-primary">{formatNumber(row.sales)}</td>}
                                        {(selectedReportType === 'all' || selectedReportType === 'purchase') && <td className="text-right text-danger">{formatNumber(row.purchase)}</td>}
                                        {(selectedReportType === 'all') && <td className={`text-right ${row.profit >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 'bold' }}>
                                            {formatNumber(row.profit)}
                                        </td>}
                                        {(selectedReportType === 'all' || selectedReportType === 'collection') && <td className="text-right">{formatNumber(row.collection)}</td>}
                                        {(selectedReportType === 'all' || selectedReportType === 'payment') && <td className="text-right">{formatNumber(row.payment)}</td>}
                                        {(selectedReportType === 'all' || selectedReportType === 'deposit') && <td className="text-right">{formatNumber(row.deposit)}</td>}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">해당 조건의 데이터가 없습니다.</td>
                                </tr>
                            )}
                            {/* 합계 행 */}
                            <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                <td>합계</td>
                                {(selectedReportType === 'all' || selectedReportType === 'sales') && <td className="text-right text-primary">{formatNumber(totals.sales)}</td>}
                                {(selectedReportType === 'all' || selectedReportType === 'purchase') && <td className="text-right text-danger">{formatNumber(totals.purchase)}</td>}
                                {(selectedReportType === 'all') && <td className="text-right text-success">{formatNumber(totals.profit)}</td>}
                                {(selectedReportType === 'all' || selectedReportType === 'collection') && <td className="text-right">{formatNumber(totals.collection)}</td>}
                                {(selectedReportType === 'all' || selectedReportType === 'payment') && <td className="text-right">{formatNumber(totals.payment)}</td>}
                                {(selectedReportType === 'all' || selectedReportType === 'deposit') && <td className="text-right">{formatNumber(totals.deposit)}</td>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, color }) {
    const colorMap = {
        primary: '#0d6efd',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
    };

    return (
        <div className="summary-card" style={{ borderLeft: `4px solid ${colorMap[color] || '#ccc'}` }}>
            <div className="summary-label">{title}</div>
            <div className="summary-value" style={{ color: colorMap[color] }}>{formatCurrency(value)}</div>
        </div>
    );
}
