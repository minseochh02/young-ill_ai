import React from 'react';

const MetricCard = ({ title, value, subtext, color }) => {
    return (
        <div className="card">
            <div className="card-title">{title}</div>
            <div className="metric-value" style={{ color: color }}>{value}</div>
            {subtext && <div className="metric-label">{subtext}</div>}
        </div>
    );
};

export default MetricCard;
