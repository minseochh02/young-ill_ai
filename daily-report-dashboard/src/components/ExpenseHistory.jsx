import React from 'react';

const ExpenseHistory = ({ data }) => {
    if (!data || data.length === 0) return <div className="card">No Expense Data Available</div>;

    return (
        <div className="card">
            <div className="card-title">Expense/Transaction History (비용/입출금 내역)</div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Card</th>
                        <th>Bill (어음)</th>
                        <th>Cash</th>
                        <th>Client</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.date}</td>
                            <td>{row.type}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.card || 0)}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.bill || 0)}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.cash || 0)}</td>
                            <td>{row.client}</td>
                            <td>{row.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseHistory;
