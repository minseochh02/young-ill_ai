import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FundChart = ({ data }) => {
    if (!data || data.length === 0) return <div>No Fund Data</div>;

    // Transform data for chart: map keys to values for the first entry (or sum)
    // The 'data' prop here is likely a list of records.
    // Let's prepare a summary object for the chart.

    // Example: sum of general_deposit across all entries (if split by branch, otherwise just take the row)
    const aggregated = data.reduce((acc, curr) => {
        acc.general_deposit += (curr.general_deposit || 0);
        acc.electronic_bill += (curr.electronic_bill || 0);
        acc.loans += (curr.loans || 0);
        return acc;
    }, { general_deposit: 0, electronic_bill: 0, loans: 0 });

    const chartData = [
        { name: 'General Deposit (보통예금)', value: aggregated.general_deposit, fill: '#82ca9d' },
        { name: 'Electronic Bill (전자어음)', value: aggregated.electronic_bill, fill: '#8884d8' },
        { name: 'Loans (대여금)', value: aggregated.loans, fill: '#ffc658' },
    ];

    return (
        <div className="card" style={{ height: '400px' }}>
            <div className="card-title">Fund Status (자금 현황)</div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: "compact" }).format(value)} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('ko-KR').format(value)} />
                    <Legend />
                    <Bar dataKey="value" name="Amount" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FundChart;
