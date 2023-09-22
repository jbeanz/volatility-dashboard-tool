import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { extractDate } from './utils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const getAnnouncementContentTooltip = (lineChartData) => ({ raw, label }) => {
    const price = raw
    const timestamp = label

    const tooltip = `Price: ${price} - ${lineChartData[timestamp]}`
    return tooltip
};

const LineChart = ({ discordData }) => {
    const { messages } = discordData || {};

    const labels = []
    const priceData = []

    const lineChartData = messages.reduce((acc, { timestamp, content }, idx) => {
        const { year, month, date
        } = extractDate(timestamp);

        const label = `${year}-${month}-${date}`
        acc[label] = content
        labels.push(label)

        priceData.push(idx) // TODO replace with price data
        return acc
    }, {});


    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: (x) => { return x.raw },
                    label: getAnnouncementContentTooltip(lineChartData),
                }
            }
        },
    }

    return (
        <div
            style={{
                height: 400,
                display: 'flex',
                padding: '20px',
                backgroundColor: '#f2f2f2',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Line
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Price Volatility Graph',
                            data: priceData,
                            backgroundColor: 'purple',
                        },
                    ],
                }}
                options={chartOptions}
            />
        </div>
    );
};

export default LineChart;
