import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import './AnalyticsChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function AnalyticsChart({ data }) {
    if (!data) return null;

    const eventCountPercent = parseFloat(data.eventCountPercent);
    const totalUsersPercent = parseFloat(data.totalUsersPercent);
    const yMax = Math.ceil(Math.max(eventCountPercent, totalUsersPercent) / 10) * 10 + 10;

    const chartData = {
        labels: ['Comparison'],
        datasets: [
            {
                label: 'Event Count %',
                data: [eventCountPercent],
                backgroundColor: '#4CAF50',
                barThickness: 'flex',
            },
            {
                label: 'Total Users %',
                data: [totalUsersPercent],
                backgroundColor: '#2196F3',
                barThickness: 'flex',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // allow container control
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.dataset.label}: ${ctx.raw}%`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: yMax,
                ticks: {
                    callback: value => `${value}%`,
                    stepSize: 10,
                },
            },
            x: {
                ticks: { display: false },
            },
        },
    };

    return (
        <div className="chart-wrapper">
            <Bar data={chartData} options={options} />
        </div>
    );
}

export default AnalyticsChart;