import React from 'react';

const FundHistoryTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-title">Fund History Details (자금 내역 상세)</div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date (날짜)</th>
                        <th>Type (구분)</th>
                        <th>General Deposit (보통예금)</th>
                        <th>Electronic Bill (전자어음)</th>
                        <th>Loans (대여금)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.date}</td>
                            <td>
                                <span className={row.type === '입금' ? 'text-success' : 'text-danger'}>
                                    {row.type}
                                </span>
                            </td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.general_deposit || 0)}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.electronic_bill || 0)}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.loans || 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FundHistoryTable;
