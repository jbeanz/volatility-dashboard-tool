import React, { useEffect, useState } from 'react';
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
import _ from 'lodash';

import { extractDate, convertUnixTimestamp } from './utils';

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
    height: 300,
    flexGrow: 1
})

const getTooltipContent = (data) => ({ raw, label }) => {
    const price = raw
    const content = data.find(({ timestamp }) => timestamp === label)?.content
    const tooltip = `Price: ${price} - ${content}`
    return tooltip
};

const getTooltipTitle = (data) => (x) => {
    const tooltipDate = data.find(({ timestamp }) => timestamp === x[0].label)?.tooltipDate
    return tooltipDate
};

function extractDateFromTwitterTimestamp(datetimeStr) {
    // Parse the datetime string into a Date object
    const dateTime = new Date(datetimeStr);

    // Extract year, month, and day from the Date object
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1; // Months are zero-based, so add 1
    const day = dateTime.getDate();
    const hour = dateTime.getHours()
    const minute = dateTime.getMinutes()
    const second = dateTime.getSeconds()
    const tooltipDate = dateTime.toLocaleString()

    return { year, month, day, hour, minute, second, tooltipDate };
}

// const getProcessedDiscordData = (selectedCoinDiscordData) => {
//     const { messages = [] } = selectedCoinDiscordData;

//     const processedDiscordData = [];

//     messages.forEach(({ timestamp, content }) => {
//         const { year, month, day, hour, minute, second } = extractDate(timestamp);

//         const formattedTimestamp = `${year}-${month}-${day}-${hour}-${minute}-${second}`;
//         processedDiscordData.push({
//             timestamp: formattedTimestamp,
//             content,
//             year,
//             month,
//             day,
//             hour,
//             minute,
//             second
//         });
//     });

//     return processedDiscordData;
// };

const findMatchingPrice = ({ data, year, month, day, hour, minute, second }) => {
    const matchingPrice = data.find(
        ({
            priceYear,
            priceMonth,
            priceDay,
            priceHour,
            priceMinute,
            priceSecond
        }) => {
            const yearMatch = year === priceYear; //worldcoin data will begin from 2023
            const monthMatch = month === priceMonth;
            const dayMatch = day === priceDay;
            const hourMatch = hour === priceHour;

            if (yearMatch && monthMatch && dayMatch && hourMatch) {
                const hasMinuteMatch = priceMinute === minute;
                if (hasMinuteMatch) {
                    const hasSecondMatch = priceSecond === second
                    if (hasSecondMatch)
                        return true
                    const previousSecond = second === 0 ? 59 : second - 1;
                    return findMatchingPrice({
                        data,
                        year,
                        month,
                        day,
                        hour,
                        minute,
                        second: previousSecond
                    })
                } else {
                    const previousMinute = minute === 0 ? 59 : minute - 1;
                    return findMatchingPrice({
                        data,
                        year,
                        month,
                        day,
                        hour,
                        minute: previousMinute,
                        second,
                    });
                }
            }
            return false;
        }
    );

    return matchingPrice;
};

const getChartOptions = (coinPriceData) => {
    const chartOptions = {
        plugins: {
            tooltip: {
                enabled: false,
                callbacks: {
                    title: getTooltipTitle(coinPriceData),
                    label: getTooltipContent(coinPriceData)
                },
                external: function (context) {
                    // Tooltip Element
                    let tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    const tooltipModel = context.tooltip;
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        const titleLines = tooltipModel.title || [];
                        const bodyLines = tooltipModel.body.map(getBody);

                        let innerHtml = '<thead>';

                        titleLines.forEach(function (title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';

                        bodyLines.forEach(function (body, i) {
                            let style = 'background:#ffffff';
                            style += '; border-color:#ffffff';
                            style += '; border-width: 2px';
                            const span = '<span style="' + style + '">' + body + '</span>';
                            innerHtml += '<tr><td>' + span + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        let tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    const position = context.chart.canvas.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            }
        },
    }
    return chartOptions
}

const LineChart = ({ currency, coin, worldCoinPrice, selectedCoinDiscordData, twitterData }) => {
    const [coinPriceData, setCoinPriceData] = useState([])
    const [labels, setLabels] = useState([])

    useEffect(() => {
        const twitterDataTimestamps = new Set()
        const processedTwitterData = []

        twitterData.forEach(({ date, rawContent }) => {
            const { year, month, day, hour, minute, second, tooltipDate } = extractDateFromTwitterTimestamp(date);
            const timestamp = `${year}-${month}-${day}-${hour}-${minute}-${second}`

            if (!twitterDataTimestamps.has(timestamp)) {
                processedTwitterData.push({
                    timestamp,
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    second,
                    content: rawContent,
                    tooltipDate
                })
                twitterDataTimestamps.add(timestamp)
            }
        })

        // const processedDiscordData = getProcessedDiscordData(selectedCoinDiscordData)
        // const filteredData = _.sortBy([...processedTwitterData, ...processedDiscordData], 'timestamp')
        const filteredData = _.sortBy(processedTwitterData, 'timestamp').filter(({ year, month }) => {
            return year === 2023 && month >= 7
        })

        const worldCoinPriceData = []
        worldCoinPrice.forEach(({ timestamp, price_usd, price_eth }) => {
            const { priceYear, priceMonth, priceDay, priceHour, priceMinute, priceSecond } = convertUnixTimestamp(timestamp);
            worldCoinPriceData.push({
                priceYear,
                priceMonth,
                priceDay,
                priceHour,
                priceMinute,
                priceSecond,
                price_usd,
                price_eth,
            })

        })

        const priceData = [];

        filteredData.forEach(({ year, month, day, hour, minute, timestamp, content, second, tooltipDate }) => {
            if (year === 2023 && month >= 7) {
                const matchingPrice = findMatchingPrice({ data: worldCoinPriceData, year, month, day, hour, minute, second })
                if (matchingPrice) {
                    const { price_usd, price_eth } = matchingPrice;
                    priceData.push({
                        priceUsd: price_usd,
                        priceEth: price_eth,
                        year,
                        month,
                        day,
                        hour,
                        minute,
                        timestamp,
                        content,
                        tooltipDate
                    });
                }
            }
        });

        setCoinPriceData(priceData)

        const dataLabels = priceData.map(({ timestamp }) => timestamp)

        setLabels(dataLabels)
    }, [worldCoinPrice])

    const priceDataUsd = coinPriceData.map(({ priceUsd }) => priceUsd);
    const priceDataEth = coinPriceData.map(({ priceEth }) => priceEth);
    const priceDataInCurrency = currency === 'USD' ? priceDataUsd : priceDataEth;

    const header = _.isEmpty(selectedCoinDiscordData) ? <h2> NO DISCORD DATA FOR SELECTED COIN</h2> : <h2>{`${coin} Price in ${currency} Over Time`}</h2>

    const chartOptions = getChartOptions(coinPriceData)
    return (
        <LineChartContainer>
            {header}
            <Line
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Twitter Announcements',
                            data: priceDataInCurrency,
                            backgroundColor: '#1d96e8',
                        },
                    ],

                }}
                options={chartOptions}
            />
        </LineChartContainer>
    );
};

export default LineChart;
