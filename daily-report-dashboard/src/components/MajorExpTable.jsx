import React from 'react';

const MajorExpTable = ({ data }) => {
    if (!data || data.length === 0) return <div className="card">No Major Expense Data</div>;

    return (
        <div className="card">
            <div className="card-title">Major Expenses (주요비용 지출현황)</div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Client (지출처)</th>
                        <th>Amount (금액)</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.client}</td>
                            <td className="text-right" style={{ fontWeight: 'bold' }}>
                                {new Intl.NumberFormat('ko-KR').format(row.amount || 0)}
                            </td>
                            <td>{row.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MajorExpTable;
