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
import styled from 'styled-components';

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

const LineChartContainer = styled.div({
    backgroundColor: '#f2f2f2',
    padding: 24,
    borderRadius: '10px 10px 20px 20px',
    margin: 12,
    height: 200,
    flexGrow: 1
})

const getAnnouncementContentTooltip = (lineChartData) => ({ raw, label }) => {
    const price = raw
    const timestamp = label

    const tooltip = `Price: ${price} - ${lineChartData[timestamp]}`
    return tooltip
};

const LineChart = ({ selectedCoinDiscordData }) => {
    const { messages = [] } = selectedCoinDiscordData

    const labels = []
    const priceData = []

    const lineChartData = messages.reduce((acc, { timestamp, content }, idx) => {
        const { year, month, date
        } = extractDate(timestamp);

        const label = `${year}-${month}-${date}`
        acc[label] = content
        labels.push(label)

        priceData.push(Math.random() * idx) // TODO replace with price data
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
        <LineChartContainer>
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
        </LineChartContainer>
    );
};

export default LineChart;
