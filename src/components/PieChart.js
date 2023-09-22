import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { transparentize } from 'polished';

import Card from './Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedCoinData }) => {

    const { classificationData = {} } = selectedCoinData

    const labels = []
    const data = []
    const backgroundColors = []

    classificationData.forEach(({ label, percentage, backgroundColor }) => {
        labels.push(label)
        data.push(percentage)
        backgroundColors.push(transparentize(0.7, backgroundColor))
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
        <Card style={{ backgroundColor: 'white', maxHeight: 500, flexGrow: 1, justifyContent: 'center' }}>
            <Pie data={chartData} />
        </Card >
    );
}

export default PieChart