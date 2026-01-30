import React from 'react';

const CollectionsTable = ({ data }) => {
    if (!data || data.length === 0) return <div className="card">No Collections Data</div>;

    return (
        <div className="card">
            <div className="card-title">Collections Status (수금 현황)</div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Branch (사업소)</th>
                        <th>Total (총수금)</th>
                        <th>Cash (현금)</th>
                        <th>Bill (어음)</th>
                        <th>Card (카드)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.branch}</td>
                            <td className="text-right" style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('ko-KR').format(row.total_collection || 0)}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.cash || 0)}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.bill || 0)}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.card || 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CollectionsTable;
