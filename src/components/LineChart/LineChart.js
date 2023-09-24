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
    height: 200,
    flexGrow: 1
})

const getAnnouncementContentTooltip = (data) => ({ raw, label }) => {
    const price = raw
    const content = data.find(({ timestamp }) => timestamp === label)?.content
    const tooltip = `Price: ${price} - ${content}`
    return tooltip
};

function extractYearMonthDay(datetimeStr) {
    // Parse the datetime string into a Date object
    const dateTime = new Date(datetimeStr);

    // Extract year, month, and day from the Date object
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1; // Months are zero-based, so add 1
    const day = dateTime.getDate();
    const hour = dateTime.getHours()
    const minute = dateTime.getMinutes()
    return { year, month, day, hour, minute };
}

const getProcessedDiscordData = (selectedCoinDiscordData) => {
    const { messages = [] } = selectedCoinDiscordData;

    const processedDiscordData = [];

    messages.forEach(({ timestamp, content }) => {
        const { year, month, day, hour, minute } = extractDate(timestamp);

        const formattedTimestamp = `${year}-${month}-${day}-${hour}-${minute}`;
        processedDiscordData.push({
            timestamp: formattedTimestamp,
            content,
            year,
            month,
            day,
            hour,
            minute,
        });
    });

    return processedDiscordData;
};

const findMatchingPrice = ({ data, year, month, day, hour, minute }) => {
    const matchingPrice = data.find(
        ({
            priceYear,
            priceMonth,
            priceDay,
            priceHour,
            priceMinute,
        }) => {
            const yearMatch = year === priceYear; //worldcoin data will begin from 2023
            const monthMatch = month === priceMonth;
            const dayMatch = day === priceDay;
            const hourMatch = hour === priceHour;

            if (yearMatch && monthMatch && dayMatch && hourMatch) {
                const hasMinuteMatch = priceMinute === minute;
                if (hasMinuteMatch) {
                    return true;
                } else {
                    const previousMinute = minute === 0 ? 59 : minute - 1;
                    return findMatchingPrice({
                        data,
                        year,
                        month,
                        day,
                        hour,
                        minute: previousMinute,
                    });
                }
            }
            return false;
        }
    );

    return matchingPrice;
};

const LineChart = ({ currency, worldCoinPrice, selectedCoinDiscordData, twitterData }) => {
    const [coinPriceData, setCoinPriceData] = useState([])
    const [labels, setLabels] = useState([])

    useEffect(() => {
        const processedTwitterData = twitterData.map(({ date, rawContent }) => {
            const { year, month, day, hour, minute } = extractYearMonthDay(date);
            const timestamp = `${year}-${month}-${day}-${hour}-${minute}`
            return {
                timestamp,
                year,
                month,
                day,
                hour,
                minute,
                content: rawContent,
            }
        })

        // const processedDiscordData = getProcessedDiscordData(selectedCoinDiscordData)
        // const combinedData = _.sortBy([...processedTwitterData, ...processedDiscordData], 'timestamp')
        const combinedData = _.sortBy(processedTwitterData, 'timestamp').filter(({ year, month }) => {
            return year === 2023 && month >= 7
        })

        const worldCoinPriceData = []
        worldCoinPrice.forEach(({ timestamp, price_usd, price_eth }) => {
            const { priceYear, priceMonth, priceDay, priceHour, priceMinute } = convertUnixTimestamp(timestamp);
            worldCoinPriceData.push({
                priceYear,
                priceMonth,
                priceDay,
                priceHour,
                priceMinute,
                price_usd,
                price_eth,
            })

        })

        const priceData = [];

        combinedData.forEach(({ year, month, day, hour, minute, timestamp, content }) => {
            if (year === 2023 && month >= 7) {
                const matchingPrice = findMatchingPrice({ data: worldCoinPriceData, year, month, day, hour, minute })
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
                        content
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

    const header = _.isEmpty(selectedCoinDiscordData) ? <div> NO DISCORD DATA FOR SELECTED COIN</div> : null

    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: (x) => { return x.raw },
                    label: getAnnouncementContentTooltip(coinPriceData),
                }
            }
        },
    }

    return (
        <> {header}
            <LineChartContainer>
                <Line
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                label: 'Twitter/Price Volatility Graph',
                                data: priceDataInCurrency,
                                backgroundColor: 'blue',
                            },
                        ],
                    }}
                    options={chartOptions}
                />

            </LineChartContainer>
        </>
    );
};

export default LineChart;
