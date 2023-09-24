import React, { useState } from 'react';
import styled from 'styled-components';

import SidePanel from './components/SidePanel';
import LineChart from './components/LineChart/LineChart';
import ImpactTable from './components/ImpactTable';
import FrontRunTable from './components/FrontRunTable';
import PieChart from './components/PieChart';
import Flex from './components/Flex';
import Parameters from './components/Parameters';

import { WORLD_COIN, ETH } from './utils';

import './App.css';

import discordData from './data/discord.json';
import coinData from './data/coinData.json'
import { twitterData } from './data/twitter.js'
import worldcoin_prices from './data/worldcoin_prices.json'

const Section = styled.section({
  display: 'flex',
  height: 700,
  margin: 12,
})

function App() {
  const [coin, setCoin] = useState(WORLD_COIN)
  const [currency, setCurrency] = useState(ETH)

  const selectedCoinData = coinData[coin] || {}
  const selectedCoinDiscordData = discordData[coin] || {}

  return (
    <div className="App">
      <Flex style={{ flexDirection: 'column' }}>
        <h1 style={{ color: '#020d66' }}>Historical News/Social Media Volatility Dashboard</h1>
        <Section>
          <SidePanel
            setCoin={setCoin}
            selectedCoinData={selectedCoinData}
          />
          <Flex style={{ flexDirection: 'column', flexGrow: 1 }}>
            <Parameters
              currency={currency}
              setCurrency={setCurrency}
            />
            <LineChart currency={currency} coin={coin} worldCoinPrice={worldcoin_prices} selectedCoinDiscordData={selectedCoinDiscordData} twitterData={twitterData} />
          </Flex>
        </Section>
        <Section style={{ backgroundColor: '#f4e0e0', margin: 0, padding: 12, flexDirection: 'column' }}>
          <h2 style={{ color: '#020d66' }}>Social Media Tags and Classification</h2>
          <Flex>
            <ImpactTable />
            <FrontRunTable />
            <PieChart selectedCoinData={selectedCoinData} />
          </Flex>
        </Section>
      </Flex >
    </div >
  );
}

export default App;
