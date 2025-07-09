import React from 'react';
import './AnalyticsTable.css';

function AnalyticsTable({ data }) {
    if (!data || !data.rows || data.rows.length === 0) {
        return <p>No data available.</p>;
    }

    const headers = [
        ...data.dimensionHeaders.map((d) => d.name),
        ...data.metricHeaders.map((m) => m.name),
    ];

    const rows = data.rows.map((row) => ({
        eventName: row.dimensionValues[0].value,
        eventCount: parseInt(row.metricValues[0].value, 10),
        totalUsers: parseInt(row.metricValues[1].value, 10),
    }));

    const event1 = rows.find(r => r.eventName === 'App_Lang_Screen');
    const event2 = rows.find(r => r.eventName === 'ASE_N_Imp_AppLanguage_scr');

    const eventCountPercent = event1 && event2
        ? ((event2.eventCount / event1.eventCount) * 100).toFixed(2)
        : 'N/A';

    const totalUsersPercent = event1 && event2
        ? ((event2.totalUsers / event1.totalUsers) * 100).toFixed(2)
        : 'N/A';

    return (
        <div className="table-container">
            <table className="analytics-table">
                <thead>
                    <tr>
                        {headers.map((header, idx) => (
                            <th key={idx}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{row.eventName}</td>
                            <td>{row.eventCount}</td>
                            <td>{row.totalUsers}</td>
                        </tr>
                    ))}

                    <tr className="percentage-row">
                        <td><strong>Percentage</strong></td>
                        <td>{eventCountPercent} %</td>
                        <td>{totalUsersPercent} %</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AnalyticsTable;