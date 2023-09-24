import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { transparentize } from 'polished';

import Card from './Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ pieChartData }) => {


    const labels = []
    const data = []
    const backgroundColors = [
        "#5f9d97",
        "#149bb3",
        "#0093d2",
        "#5d80e0",
        "#f48e00",
        "#d8b423",
        "#e6228e",
        "#5f9d97",
        "#149bb3",
        "#0093d2",
        "#5d80e0",
        "#f48e00",
        "#d8b423",
        "#e6228e",
    ]

    Object.entries(pieChartData).forEach(([key, value], idx) => {
        labels.push(key)
        data.push(value)
        backgroundColors.push(transparentize(0.7, backgroundColors[idx]))
    })

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: '# of Announcements',
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1,
            },
        ],
    };

    return (
        <Card style={{ backgroundColor: 'white', maxHeight: 400, flexGrow: 1, justifyContent: 'center' }}>
            <Pie data={chartData} />
        </Card >
    );
}

export default PieChart