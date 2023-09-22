import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import Card from './Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const pieDataConfig = [
    {
        label: 'Hacks',
        percentage: 50,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',

    },
    {
        label: 'Memes',
        percentage: 25,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',

    },
    {
        label: 'Dev',
        percentage: 25,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',

    }
]

const labels = pieDataConfig.map(({ label }) => label)
const data = pieDataConfig.map(({ percentage }) => percentage)
const backgroundColors = pieDataConfig.map(({ backgroundColor }) => backgroundColor)

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

const PieChart = () => {
    return (
        <Card style={{ backgroundColor: 'white', maxHeight: 500, flexGrow: 1, justifyContent: 'center' }}>
            <Pie data={chartData} />
        </Card >
    );
}

export default PieChart