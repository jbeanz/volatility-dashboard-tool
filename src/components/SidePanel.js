import React from 'react';
import styled from 'styled-components';

import Flex from './Flex';

import { WORLD_COIN, UNIBOT } from '../utils';

const SidePanelContainer = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
    backgroundColor: '#ffdbf9',
    padding: 24,
    borderRadius: 20,
    margin: 12,
})

const Button = styled.button({
    width: 100,
    padding: 12,
    margin: 24,
    backgroundColor: '#ff9066',
    border: 'none',
    borderRadius: 3,
    cursor: 'pointer',
});

const Label = styled.div({
    fontWeight: 600,
    whiteSpace: 'nowrap',
    marginRight: 12,
})

const CoinData = styled.div({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 200,
})


const SidePanel = ({ coin, setCoin, coinData }) => {
    const { tokenAddress, twitterUrl, discordId } = coinData[coin] || 'Unavailable'

    return (
        <SidePanelContainer >
            <h2 style={{ color: '#020d66' }}>Analyze Token</h2>
            <Flex style={{ justifyContent: 'space-between' }}>
                <Button onClick={() => setCoin(WORLD_COIN)}>{WORLD_COIN}</Button>
                <Button onClick={() => setCoin(UNIBOT)}>{UNIBOT}</Button>
            </Flex>
            <Flex style={{ alignItems: 'flex-start', width: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Flex>
                    <Label>Token Address:</Label>
                    <CoinData>{tokenAddress}</CoinData>
                </Flex>
                <Flex>
                    <Label>Twitter Url:</Label>
                    <CoinData>{twitterUrl}</CoinData>
                </Flex>
                <Flex>
                    <Label>Discord Id:</Label>
                    <CoinData>{discordId}</CoinData>
                </Flex>
            </Flex >
        </SidePanelContainer >
    );
};

export default SidePanel;
