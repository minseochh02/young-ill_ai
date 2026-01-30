import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const SalesChart = ({ data }) => {
    // Data is expected to be an array of objects: { branch: 'Name', total_sales: 1000, ... }

    // Custom tooltip to format numbers
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <p className="label">{`${label} : ${new Intl.NumberFormat('ko-KR').format(payload[0].value)}`}</p>
                </div>
            );
        }
        return null;
    };

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="card" style={{ height: '400px' }}>
            <div className="card-title">Sales by Branch (사업소별 매출)</div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branch" />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: "compact" }).format(value)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="total_sales" name="Total Sales (총매출)" fill="#8884d8" barSize={50}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
