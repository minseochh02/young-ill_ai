import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MobileValuesChart = ({ data }) => {
    if (!data || data.length === 0) return <div>No Mobile Payment Data</div>;

    return (
        <div className="card" style={{ height: '400px' }}>
            <div className="card-title">Mobile Payment History (모빌결제)</div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branch" />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: "compact" }).format(value)} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('ko-KR').format(value)} />
                    <Legend />
                    <Bar dataKey="il_payment" name="IL" fill="#8884d8" />
                    <Bar dataKey="auto_payment" name="AUTO" fill="#82ca9d" />
                    <Bar dataKey="mbk_payment" name="MBK" fill="#ffc658" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MobileValuesChart;
