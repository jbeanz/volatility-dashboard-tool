import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Card from '../Card'

import { TableContainer, Table, TableCell, TableHeaderCell, TableRowEven, TableRowHover } from './utils';

const Td = styled.td({
    whiteSpace: 'nowrap',  /* Prevent text from wrapping */
    overflow: 'hidden',      /* Hide overflowing content */
    textOverflow: 'ellipsis', /* Display ellipsis for overflow */
    maxWidth: 100        /* Set a maximum width for the cell */
})

function convertToTitleCase(inputString) {
    // Split the input string into words based on underscores or spaces
    const words = inputString.split(/[_\s]+/);

    // Capitalize the first letter of each word and make the rest lowercase
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Join the words back together with spaces
    const titleCaseString = capitalizedWords.join(' ');

    return titleCaseString;
}

function formatNumber(number, decimalPlaces) {
    // Convert the number to a string with the desired decimal places
    const roundedString = number.toFixed(decimalPlaces);

    // Convert the rounded string back to a number
    const roundedNumber = parseFloat(roundedString);
    return roundedNumber;
}

const ImpactTable = ({ topImpactfulData }) => {
    return (
        <div>
            {Object.entries(topImpactfulData).map(([table, tableData]) => {
                return (
                    <Card key={table} style={{ backgroundColor: 'white', margin: 12, flexDirection: 'column' }}>
                        <h3> {convertToTitleCase(table)}</h3>
                        <TableContainer>
                            <Table>
                                <thead>
                                    <TableRowEven>
                                        <TableHeaderCell>Tweet</TableHeaderCell>
                                        <TableHeaderCell>ETH %<span className="delta-symbol"></span></TableHeaderCell>
                                        <TableHeaderCell>USD %<span className="delta-symbol"></span></TableHeaderCell>
                                        <TableHeaderCell>Date</TableHeaderCell>
                                    </TableRowEven>
                                </thead>
                                <tbody>
                                    {tableData.map((row) => {
                                        const {
                                            content,
                                            // id,
                                            date,
                                            eth_delta,
                                            usd_delta,
                                        } = row
                                        const ethDelta = formatNumber(eth_delta, 8)
                                        const usdDelta = formatNumber(usd_delta, 4)

                                        const dateObj = new Date(date);
                                        const formattedDate = dateObj.toLocaleString()
                                        return (
                                            <TableRowHover>
                                                <TableCell>{content}</TableCell>
                                                <TableCell>{ethDelta}</TableCell>
                                                <TableCell>{usdDelta}</TableCell>
                                                <TableCell>{formattedDate}</TableCell>
                                            </TableRowHover>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </TableContainer>
                    </Card>
                )
            })}
        </div>
    );
}

export default ImpactTable;
