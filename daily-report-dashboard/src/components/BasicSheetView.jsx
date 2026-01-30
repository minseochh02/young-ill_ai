import React, { useState } from 'react';
import basicSheetsData from '../data/basic_sheets.json';
import { exportToCSV } from '../utils/excelExporter';
import { getPeriodDates, PERIOD_OPTIONS } from '../utils/dateUtils';
// BRANCHES is not exported from BasicDailyDashboard, so we define it locally.
// Since BRANCHES is not exported, I will redefine or use the same list.
const BRANCHES = [
  '전체', '서울,화성 IL', '창원', '화성auto(남부)', '화성auto(중부)',
  '인천(서부)', '남양주(동부)', '제주', '부산'
];

// 숫자 포맷팅
const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('ko-KR').format(Math.round(num));
};

const formatCurrency = (num) => {
  if (num === null || num === undefined) return '-';
  return `₩${formatNumber(num)}`;
};

// 판매현황 테이블
function SalesTable({ data, title, filters }) {
  const [sortField, setSortField] = useState('일자');
  const [sortDesc, setSortDesc] = useState(false);
  const [localFilter, setLocalFilter] = useState(''); // Keep local text filter if needed, or merege.

  // 데이터가 없어도 UI 구조 유지를 위해 records 초기화
  const records = data?.records || [];

  // Global + Local Filter
  const filteredRecords = records.filter(r => {
    // Global Filters
    if (filters.startDate && r['일자'] < filters.startDate) return false;
    if (filters.endDate && r['일자'] > filters.endDate) return false;
    if (filters.branch !== '전체' && !String(r['거래처그룹1코드명'] || '').includes(filters.branch)) return false;
    if (filters.client && !String(r['판매처명'] || '').includes(filters.client)) return false;
    if (filters.manager && !String(r['담당자명'] || '').includes(filters.manager)) return false;
    if (filters.item && !String(r['품목명(규격)'] || '').includes(filters.item)) return false;

    // Local Filter
    if (localFilter && (
      !String(r['판매처명'] || '').toLowerCase().includes(localFilter.toLowerCase()) &&
      !String(r['품목명(규격)'] || '').toLowerCase().includes(localFilter.toLowerCase())
    )) return false;

    return true;
  });

  // Recalculate Summary
  const summary = {
    total_records: filteredRecords.length,
    total_amount: filteredRecords.reduce((acc, r) => acc + (r['합 계'] || 0), 0),
    total_supply: filteredRecords.reduce((acc, r) => acc + (r['공급가액'] || 0), 0),
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    return sortDesc
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal));
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  return (
    <div>
      <div className="section-title" style={{ fontSize: '16px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <button
          onClick={() => exportToCSV(sortedRecords, '판매현황_상세')}
          style={{ padding: '4px 8px', fontSize: '11px', background: '#217346', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          엑셀파일로 저장
        </button>
      </div>
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">총 레코드</div>
          <div className="summary-value">{formatNumber(summary.total_records)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">총 매출액</div>
          <div className="summary-value text-primary">{formatCurrency(summary.total_amount)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">공급가액</div>
          <div className="summary-value">{formatCurrency(summary.total_supply)}</div>
        </div>
      </div>

      {/* Branch Summary */}
      {data?.summary?.by_branch && Object.keys(data.summary.by_branch).length > 0 && (
        <div className="branch-summary">
          <div className="section-title">사업소별 집계</div>
          <div className="branch-chips">
            {Object.entries(data.summary.by_branch).map(([branch, info]) => (
              <div key={branch} className="branch-chip">
                <span className="chip-label">{branch}</span>
                <span className="chip-value">{formatCurrency(info.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="table-filter">
        <input
          type="text"
          placeholder="결과 내 재검색 (거래처, 품목)..."
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          className="filter-input"
        />
        <span className="filter-count">{filteredRecords.length} / {records.length} 건</span>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="data-table basic-sheet-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('일자')} className="sortable">일자</th>
              <th onClick={() => handleSort('거래처그룹1코드명')} className="sortable">사업소</th>
              <th onClick={() => handleSort('판매처명')} className="sortable">판매처</th>
              <th onClick={() => handleSort('품목명(규격)')} className="sortable">품목명</th>
              <th onClick={() => handleSort('수량')} className="sortable text-right">수량</th>
              <th onClick={() => handleSort('단가')} className="sortable text-right">단가</th>
              <th onClick={() => handleSort('공급가액')} className="sortable text-right">공급가액</th>
              <th onClick={() => handleSort('합 계')} className="sortable text-right">합계</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((row, idx) => (
                <tr key={idx}>
                  <td>{row['일자'] || '-'}</td>
                  <td>{row['거래처그룹1코드명'] || '-'}</td>
                  <td className="truncate" title={row['판매처명']}>{row['판매처명'] || '-'}</td>
                  <td className="truncate" title={row['품목명(규격)']}>{row['품목명(규격)'] || '-'}</td>
                  <td className="text-right">{formatNumber(row['수량'])}</td>
                  <td className="text-right">{formatNumber(row['단가'])}</td>
                  <td className="text-right">{formatNumber(row['공급가액'])}</td>
                  <td className="text-right text-primary">{formatNumber(row['합 계'])}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center" style={{ padding: '20px' }}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 구매현황 테이블
function PurchaseTable({ data, title, filters }) {
  const [sortField, setSortField] = useState('일자');
  const [sortDesc, setSortDesc] = useState(false);
  const [localFilter, setLocalFilter] = useState('');

  const records = data?.records || [];

  const filteredRecords = records.filter(r => {
    // Global
    if (filters.startDate && r['일자'] < filters.startDate) return false;
    if (filters.endDate && r['일자'] > filters.endDate) return false;
    // Purchase data might not have branch? If '전체' skip.
    if (filters.client && !String(r['구매처명'] || '').includes(filters.client)) return false;
    // Purchase data might not have manager?
    if (filters.item && !String(r['품목명'] || '').includes(filters.item)) return false;

    // Local
    if (localFilter && (
      !String(r['구매처명'] || '').toLowerCase().includes(localFilter.toLowerCase()) &&
      !String(r['품목명'] || '').toLowerCase().includes(localFilter.toLowerCase())
    )) return false;

    return true;
  });

  const summary = {
    total_records: filteredRecords.length,
    total_amount: filteredRecords.reduce((acc, r) => acc + (r['합 계'] || 0), 0),
    total_supply: filteredRecords.reduce((acc, r) => acc + (r['공급가액'] || 0), 0),
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    return sortDesc
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal));
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  return (
    <div>
      <div className="section-title" style={{ fontSize: '16px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <button
          onClick={() => exportToCSV(sortedRecords, '구매현황_상세')}
          style={{ padding: '4px 8px', fontSize: '11px', background: '#217346', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          엑셀파일로 저장
        </button>
      </div>
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">총 레코드</div>
          <div className="summary-value">{formatNumber(summary.total_records)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">총 구매액</div>
          <div className="summary-value text-danger">{formatCurrency(summary.total_amount)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">공급가액</div>
          <div className="summary-value">{formatCurrency(summary.total_supply)}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="table-filter">
        <input
          type="text"
          placeholder="결과 내 재검색..."
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          className="filter-input"
        />
        <span className="filter-count">{filteredRecords.length} / {records.length} 건</span>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="data-table basic-sheet-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('일자')} className="sortable">일자</th>
              <th onClick={() => handleSort('구매처명')} className="sortable">구매처명</th>
              <th onClick={() => handleSort('품목명')} className="sortable">품목명</th>
              <th onClick={() => handleSort('창고명')} className="sortable">창고명</th>
              <th onClick={() => handleSort('수량')} className="sortable text-right">수량</th>
              <th onClick={() => handleSort('단가')} className="sortable text-right">단가</th>
              <th onClick={() => handleSort('공급가액')} className="sortable text-right">공급가액</th>
              <th onClick={() => handleSort('합 계')} className="sortable text-right">합계</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((row, idx) => (
                <tr key={idx}>
                  <td>{row['일자'] || '-'}</td>
                  <td className="truncate" title={row['구매처명']}>{row['구매처명'] || '-'}</td>
                  <td className="truncate" title={row['품목명']}>{row['품목명'] || '-'}</td>
                  <td>{row['창고명'] || '-'}</td>
                  <td className="text-right">{formatNumber(row['수량'])}</td>
                  <td className="text-right">{formatNumber(row['단가'])}</td>
                  <td className="text-right">{formatNumber(row['공급가액'])}</td>
                  <td className="text-right text-danger">{formatNumber(row['합 계'])}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center" style={{ padding: '20px' }}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 채권현황 테이블
function ReceivablesTable({ data, title, filters }) {
  const [localFilter, setLocalFilter] = useState('');
  const [sortField, setSortField] = useState('합계');
  const [sortDesc, setSortDesc] = useState(true);

  const records = data?.records || [];

  const filteredRecords = records.filter(r => {
    // Receivables usually don't have 'date' range in the same way (snapshot).
    // But we can filter by branch, client, manager.
    if (filters.branch !== '전체' && !String(r['거래처그룹1명'] || '').includes(filters.branch)) return false;
    if (filters.client && !String(r['거래처명'] || '').includes(filters.client)) return false;
    if (filters.manager && !String(r['담당자명'] || '').includes(filters.manager)) return false;

    // Local
    if (localFilter && (
      !String(r['거래처명'] || '').toLowerCase().includes(localFilter.toLowerCase()) &&
      !String(r['거래처그룹1명'] || '').toLowerCase().includes(localFilter.toLowerCase()) &&
      !String(r['담당자명'] || '').toLowerCase().includes(localFilter.toLowerCase())
    )) return false;

    return true;
  });

  const summary = {
    total_records: filteredRecords.length,
    total_billed: filteredRecords.reduce((acc, r) => acc + (r['청구금액'] || 0), 0),
    total_unbilled: filteredRecords.reduce((acc, r) => acc + (r['미청구금액'] || 0), 0),
    total: filteredRecords.reduce((acc, r) => acc + (r['합계'] || 0), 0)
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    return sortDesc
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal));
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  return (
    <div>
      <div className="section-title" style={{ fontSize: '16px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <button
          onClick={() => exportToCSV(sortedRecords, '채권현황_상세')}
          style={{ padding: '4px 8px', fontSize: '11px', background: '#217346', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          엑셀파일로 저장
        </button>
      </div>
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">총 거래처</div>
          <div className="summary-value">{formatNumber(summary.total_records)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">청구금액</div>
          <div className="summary-value text-primary">{formatCurrency(summary.total_billed)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">미청구금액</div>
          <div className="summary-value text-warning">{formatCurrency(summary.total_unbilled)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">총 채권</div>
          <div className="summary-value text-danger">{formatCurrency(summary.total)}</div>
        </div>
      </div>

      {/* Branch Summary */}
      {data?.summary?.by_branch && Object.keys(data.summary.by_branch).length > 0 && (
        <div className="branch-summary">
          <div className="section-title">지사별 채권 현황</div>
          <div className="branch-chips">
            {Object.entries(data.summary.by_branch)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([branch, info]) => (
                <div key={branch} className="branch-chip wide">
                  <span className="chip-label">{branch}</span>
                  <div className="chip-details">
                    <span className="chip-sub">청구: {formatCurrency(info.billed)}</span>
                    <span className="chip-sub">미청구: {formatCurrency(info.unbilled)}</span>
                  </div>
                  <span className="chip-value">{formatCurrency(info.total)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="table-filter">
        <input
          type="text"
          placeholder="거래처명, 지사, 담당자 검색..."
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          className="filter-input"
        />
        <span className="filter-count">{filteredRecords.length} / {records.length} 건</span>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="data-table basic-sheet-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('거래처코드')} className="sortable">코드</th>
              <th onClick={() => handleSort('거래처그룹1명')} className="sortable">지사</th>
              <th onClick={() => handleSort('담당자명')} className="sortable">담당자</th>
              <th onClick={() => handleSort('거래처명')} className="sortable">거래처명</th>
              <th onClick={() => handleSort('청구금액')} className="sortable text-right">청구금액</th>
              <th onClick={() => handleSort('미청구금액')} className="sortable text-right">미청구금액</th>
              <th onClick={() => handleSort('합계')} className="sortable text-right">합계</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((row, idx) => (
                <tr key={idx}>
                  <td>{row['거래처코드'] || '-'}</td>
                  <td>{row['거래처그룹1명'] || '-'}</td>
                  <td>{row['담당자명'] || '-'}</td>
                  <td className="truncate" title={row['거래처명']}>{row['거래처명'] || '-'}</td>
                  <td className="text-right">{formatNumber(row['청구금액'])}</td>
                  <td className="text-right text-warning">{formatNumber(row['미청구금액'])}</td>
                  <td className="text-right text-danger">{formatNumber(row['합계'])}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center" style={{ padding: '20px' }}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 경영요약보고서
function ManagementReport({ data }) {
  if (!data?.sections?.length) {
    return <div className="empty-state">경영요약보고서 데이터가 없습니다.</div>;
  }

  return (
    <div>
      <div className="report-info">
        <span>기준일: {data.file_date?.split('T')[0] || '-'}</span>
        <span>섹션 수: {data.sections.length}</span>
      </div>

      {data.sections.map((section, sIdx) => (
        <div key={sIdx} className="report-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{section.name}</span>
            <button
              onClick={() => exportToCSV(section.data, `경영요약_${section.name}`)}
              style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}
            >
              엑셀저장
            </button>
          </div>
          <div className="table-scroll">
            <table className="data-table basic-sheet-table">
              <thead>
                <tr>
                  {section.data[0] && Object.keys(section.data[0]).map((key, kIdx) => (
                    <th key={kIdx}>{key.replace('Unnamed: ', '열')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.data.slice(1).map((row, rIdx) => (
                  <tr key={rIdx}>
                    {Object.values(row).map((val, vIdx) => (
                      <td key={vIdx} className={typeof val === 'number' ? 'text-right' : ''}>
                        {typeof val === 'number' ? formatNumber(val) : (val || '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// 단순 리스트 테이블 (수금, 지급, 입금)
function SimpleListTable({ data, type, title, filters }) {
  const [localFilter, setLocalFilter] = useState('');
  const [sortField, setSortField] = useState('date'); // 가상 필드명
  const [sortDesc, setSortDesc] = useState(true);

  // 데이터 없어도 UI 렌더링을 위해 기본값 설정
  const records = data?.records || [];
  // calc summary later

  // 컬럼 매핑 결정
  let dateCol = '일자-No.';
  let clientCol = '거래처명';
  let amountCol = '금액';
  let noteCol = '적요';

  if (type === 'deposits') { // 입금보고서집계
    dateCol = '전표번호';
  }

  const filteredRecords = records.filter(r => {
    // Global
    if (filters.startDate && r[dateCol] < filters.startDate) return false; // approximate check for date string
    if (filters.endDate && r[dateCol] > filters.endDate) return false;
    if (filters.client && !String(r[clientCol] || '').includes(filters.client)) return false;
    // Manager/Branch might not exist here, skip.

    // Local
    if (localFilter && (
      !String(r[clientCol] || '').toLowerCase().includes(localFilter.toLowerCase()) &&
      !String(r[noteCol] || '').toLowerCase().includes(localFilter.toLowerCase())
    )) return false;

    return true;
  });

  const summary = {
    total_records: filteredRecords.length,
    total_amount: filteredRecords.reduce((acc, r) => acc + (r[amountCol] || 0), 0)
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    // 정렬 로직
    let aVal = a[sortField];
    let bVal = b[sortField];

    // 특수 매핑
    if (sortField === 'date') { aVal = a[dateCol]; bVal = b[dateCol]; }
    if (sortField === 'client') { aVal = a[clientCol]; bVal = b[clientCol]; }
    if (sortField === 'amount') { aVal = a[amountCol]; bVal = b[amountCol]; }
    if (sortField === 'note') { aVal = a[noteCol]; bVal = b[noteCol]; }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    return sortDesc
      ? String(bVal || '').localeCompare(String(aVal || ''))
      : String(aVal || '').localeCompare(String(bVal || ''));
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  return (
    <div>
      <div className="section-title" style={{ fontSize: '16px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <button
          onClick={() => exportToCSV(sortedRecords, `${title || '목록'}`)}
          style={{ padding: '4px 8px', fontSize: '11px', background: '#217346', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          엑셀파일로 저장
        </button>
      </div>
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">총 레코드</div>
          <div className="summary-value">{formatNumber(summary.total_records || 0)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">총 합계</div>
          <div className="summary-value text-primary">{formatCurrency(summary.total_amount || 0)}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="table-filter">
        <input
          type="text"
          placeholder="거래처명, 적요 검색..."
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          className="filter-input"
        />
        <span className="filter-count">{filteredRecords.length} / {records.length} 건</span>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="data-table basic-sheet-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} className="sortable">일자/No.</th>
              <th onClick={() => handleSort('client')} className="sortable">거래처명</th>
              <th onClick={() => handleSort('amount')} className="sortable text-right">금액</th>
              <th onClick={() => handleSort('note')} className="sortable">적요</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((row, idx) => (
                <tr key={idx}>
                  <td>{row[dateCol] || '-'}</td>
                  <td className="truncate" title={row[clientCol]}>{row[clientCol] || '-'}</td>
                  <td className="text-right text-primary">{formatNumber(row[amountCol])}</td>
                  <td className="truncate" title={row[noteCol]}>{row[noteCol] || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center" style={{ padding: '20px' }}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 범용 테이블 (신규 시트용)
function GenericTable({ data, title, columns, amountCols = [] }) {
  const [localFilter, setLocalFilter] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);

  const records = data?.records || [];

  // 컬럼 자동 감지 (columns가 null이면 첫 레코드에서 추출)
  const displayCols = columns || (records.length > 0 ? Object.keys(records[0]).filter(k => !k.startsWith('_') && k !== 'source_file') : []);

  const filteredRecords = records.filter(r => {
    if (!localFilter) return true;
    return displayCols.some(col =>
      String(r[col] || '').toLowerCase().includes(localFilter.toLowerCase())
    );
  });

  const sortedRecords = sortField ? [...filteredRecords].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    return sortDesc
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal));
  }) : filteredRecords;

  const handleSort = (field) => {
    if (sortField === field) { setSortDesc(!sortDesc); }
    else { setSortField(field); setSortDesc(true); }
  };

  return (
    <div>
      <div className="section-title" style={{ fontSize: '16px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <button
          onClick={() => exportToCSV(sortedRecords, title)}
          style={{ padding: '4px 8px', fontSize: '11px', background: '#217346', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          엑셀파일로 저장
        </button>
      </div>
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">총 레코드</div>
          <div className="summary-value">{formatNumber(data?.summary?.total_records || 0)}</div>
        </div>
        {amountCols.map(col => (
          <div key={col} className="summary-card">
            <div className="summary-label">합계 ({col})</div>
            <div className="summary-value text-primary">{formatCurrency(data?.summary?.[`total_${col}`] || 0)}</div>
          </div>
        ))}
      </div>
      <div className="table-filter">
        <input type="text" placeholder="검색..." value={localFilter} onChange={(e) => setLocalFilter(e.target.value)} className="filter-input" />
        <span className="filter-count">{filteredRecords.length} / {records.length} 건</span>
      </div>
      <div className="table-scroll">
        <table className="data-table basic-sheet-table">
          <thead>
            <tr>
              {displayCols.map(col => (
                <th key={col} onClick={() => handleSort(col)} className={`sortable ${amountCols.includes(col) ? 'text-right' : ''}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((row, idx) => (
                <tr key={idx}>
                  {displayCols.map(col => (
                    <td key={col} className={typeof row[col] === 'number' ? 'text-right' : ''}>
                      {typeof row[col] === 'number' ? formatNumber(row[col]) : (row[col] || '-')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={displayCols.length} className="text-center" style={{ padding: '20px' }}>데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 메인 BasicSheetView 컴포넌트
function BasicSheetView() {
  const [activeTab, setActiveTab] = useState('sales');

  // Global Filters
  const [selectedBranch, setSelectedBranch] = useState('전체');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  // 갱신/롤백 상태
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');
  const [backups, setBackups] = useState([]);
  const [showBackups, setShowBackups] = useState(false);
  const [rollingBack, setRollingBack] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshMsg('');
    try {
      const res = await fetch('/api/refresh', { method: 'POST' });
      const data = await res.json();
      setRefreshMsg(data.message);
      if (data.success) {
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch {
      setRefreshMsg('API 서버 연결 실패 (python api_server.py 실행 필요)');
    }
    setRefreshing(false);
  };

  const handleShowBackups = async () => {
    if (showBackups) { setShowBackups(false); return; }
    try {
      const res = await fetch('/api/backups');
      const data = await res.json();
      setBackups(data.backups || []);
      setShowBackups(true);
    } catch {
      setRefreshMsg('API 서버 연결 실패');
    }
  };

  const handleRollback = async (filename) => {
    if (!confirm(`이 백업으로 복원하시겠습니까?\n${filename}`)) return;
    setRollingBack(true);
    setRefreshMsg('');
    try {
      const res = await fetch('/api/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      const data = await res.json();
      setRefreshMsg(data.message);
      if (data.success) {
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch {
      setRefreshMsg('API 서버 연결 실패');
    }
    setRollingBack(false);
  };

  const filters = {
    branch: selectedBranch,
    startDate,
    endDate,
    client: selectedClient,
    manager: selectedManager,
    item: selectedItem
  };

  const tabs = [
    { id: 'sales', label: '판매현황', count: basicSheetsData.data?.sales?.summary?.total_records || 0 },
    { id: 'purchases', label: '구매현황', count: basicSheetsData.data?.purchases?.summary?.total_records || 0 },
    { id: 'receivables', label: '채권현황', count: basicSheetsData.data?.receivables?.summary?.total_records || 0 },
    { id: 'collections', label: '수금현황', count: basicSheetsData.data?.collections?.summary?.total_records || 0 },
    { id: 'payments', label: '지급현황', count: basicSheetsData.data?.payments?.summary?.total_records || 0 },
    { id: 'deposits', label: '입금현황', count: basicSheetsData.data?.deposits?.summary?.total_records || 0 },
    { id: 'management', label: '경영요약', count: basicSheetsData.data?.management?.sections?.length || 0 },
    { id: 'bill_decrease', label: '어음감소', count: basicSheetsData.data?.bill_decrease?.summary?.total_records || 0 },
    { id: 'bill_increase', label: '어음증가', count: basicSheetsData.data?.bill_increase?.summary?.total_records || 0 },
    { id: 'fund_daily', label: '자금일보', count: basicSheetsData.data?.fund_daily?.summary?.total_records || 0 },
    { id: 'deposit_report', label: '입금보고서', count: basicSheetsData.data?.deposit_report?.summary?.total_records || 0 },
  ];

  return (
    <div className="basic-sheet-view">
      {/* 2-Row Filter Bar */}
      <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

      {/* Tab Navigation */}
      <div className="sheet-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sheet-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
        <div className="sheet-tab-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span>데이터 생성: {basicSheetsData.generated_at?.split('T')[0] || '-'}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              padding: '4px 10px', fontSize: '11px', cursor: 'pointer',
              background: refreshing ? '#999' : '#2563eb', color: 'white',
              border: 'none', borderRadius: '4px', whiteSpace: 'nowrap',
            }}
          >
            {refreshing ? '갱신 중...' : '수동 갱신'}
          </button>
          <button
            onClick={handleShowBackups}
            disabled={rollingBack}
            style={{
              padding: '4px 10px', fontSize: '11px', cursor: 'pointer',
              background: showBackups ? '#dc2626' : '#f59e0b', color: 'white',
              border: 'none', borderRadius: '4px', whiteSpace: 'nowrap',
            }}
          >
            {showBackups ? '닫기' : '복원'}
          </button>
        </div>
      </div>

      {/* 상태 메시지 */}
      {refreshMsg && (
        <div style={{
          padding: '8px 14px', margin: '0 0 8px', borderRadius: '6px', fontSize: '12px',
          background: refreshMsg.includes('실패') || refreshMsg.includes('오류') ? '#fef2f2' : '#f0fdf4',
          color: refreshMsg.includes('실패') || refreshMsg.includes('오류') ? '#dc2626' : '#16a34a',
          border: `1px solid ${refreshMsg.includes('실패') || refreshMsg.includes('오류') ? '#fecaca' : '#bbf7d0'}`,
        }}>
          {refreshMsg}
        </div>
      )}

      {/* 백업 목록 패널 */}
      {showBackups && (
        <div style={{
          padding: '12px', marginBottom: '10px', borderRadius: '8px',
          background: '#fffbeb', border: '1px solid #fde68a', fontSize: '12px',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>백업 목록 (최근 10개)</div>
          {backups.length === 0 ? (
            <div style={{ color: '#999' }}>백업 파일이 없습니다.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {backups.map((b) => (
                <div key={b.filename} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px', background: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontFamily: 'monospace', flex: 1 }}>
                    {b.timestamp.replace('_', ' ').replace(/(\d{4})(\d{2})(\d{2})\s(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')}
                  </span>
                  <span style={{ color: '#999' }}>{(b.size / 1024).toFixed(0)} KB</span>
                  <button
                    onClick={() => handleRollback(b.filename)}
                    disabled={rollingBack}
                    style={{
                      padding: '2px 8px', fontSize: '11px', cursor: 'pointer',
                      background: '#dc2626', color: 'white', border: 'none', borderRadius: '3px',
                    }}
                  >
                    {rollingBack ? '...' : '복원'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="sheet-content card">
        {activeTab === 'sales' && <SalesTable data={basicSheetsData.data?.sales} title="판매현황 상세" filters={filters} />}
        {activeTab === 'purchases' && <PurchaseTable data={basicSheetsData.data?.purchases} title="구매현황 상세" filters={filters} />}
        {activeTab === 'receivables' && <ReceivablesTable data={basicSheetsData.data?.receivables} title="채권현황 상세" filters={filters} />}
        {activeTab === 'collections' && <SimpleListTable data={basicSheetsData.data?.collections} type="collections" title="수금현황 상세" filters={filters} />}
        {activeTab === 'payments' && <SimpleListTable data={basicSheetsData.data?.payments} type="payments" title="지급현황 상세" filters={filters} />}
        {activeTab === 'deposits' && <SimpleListTable data={basicSheetsData.data?.deposits} type="deposits" title="입금현황 상세" filters={filters} />}
        {activeTab === 'management' && <ManagementReport data={basicSheetsData.data?.management} />}
        {activeTab === 'bill_decrease' && <GenericTable data={basicSheetsData.data?.bill_decrease} title="받을어음 감소현황" columns={['날짜','어음번호','거래처번호','거래처명','어음금액','만기','잔액']} amountCols={['어음금액','잔액']} />}
        {activeTab === 'bill_increase' && <GenericTable data={basicSheetsData.data?.bill_increase} title="받을어음 증가현황" columns={['날짜','거래처번호','어음번호','거래처명','어음금액','만기','어음기한만료','잔액']} amountCols={['어음금액','잔액']} />}
        {activeTab === 'fund_daily' && <GenericTable data={basicSheetsData.data?.fund_daily} title="자금일보" columns={null} amountCols={[]} />}
        {activeTab === 'deposit_report' && <GenericTable data={basicSheetsData.data?.deposit_report} title="입금보고서" columns={['급여번호','날짜','거래처명','계좌','잔액','이체일자','입금내용']} amountCols={['잔액']} />}
      </div>
    </div>
  );
}

export default BasicSheetView;
