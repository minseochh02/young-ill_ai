import React from 'react';

const ArBalanceTable = ({ data }) => {
    if (!data || data.length === 0) return <div className="card">No AR Balance Data</div>;

    const totalBalance = data.reduce((acc, curr) => acc + (curr.ar_balance || 0), 0);

    return (
        <div className="card">
            <div className="card-title">
                AR Month-End Balance (외상매출금 월말잔액)
                <div style={{ float: 'right', fontSize: '1rem', color: '#333' }}>
                    Total: {new Intl.NumberFormat('ko-KR').format(totalBalance)}
                </div>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Branch (지점명)</th>
                        <th>Balance (잔액)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.branch}</td>
                            <td className="text-right">{new Intl.NumberFormat('ko-KR').format(row.ar_balance || 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ArBalanceTable;
