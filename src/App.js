import React, { useState } from 'react';
import styled from 'styled-components';

import SidePanel from './components/SidePanel';
import LineChart from './components/LineChart';
import ImpactTable from './components/ImpactTable';
import FrontRunTable from './components/FrontRunTable';
import PieChart from './components/PieChart';
import Flex from './components/Flex';
import Parameters from './components/Parameters';

import { WORLD_COIN, ETH } from './utils';

import './App.css';

import discordData from './data/discord.json';
import coinData from './data/coinData.json'

const Section = styled.section({
  display: 'flex',
  height: 600,
  margin: 12,
})

function App() {
  const [coin, setCoin] = useState(WORLD_COIN)
  const [currency, setCurrency] = useState(ETH)

  return (
    <div className="App">
      <Flex style={{ flexDirection: 'column' }}>
        <h1 style={{ color: '#020d66' }}>Historical News/Social Media Volatility Dashboard</h1>
        <Section>
          <SidePanel
            coin={coin}
            setCoin={setCoin}
            coinData={coinData}
          />
          <Flex style={{ flexDirection: 'column', flexGrow: 1 }}>
            <Parameters
              currency={currency}
              setCurrency={setCurrency}
            />
            <LineChart discordData={discordData} />
          </Flex>
        </Section>
        <Section style={{ backgroundColor: '#f4e0e0', margin: 0, padding: 12, flexDirection: 'column' }}>
          <h2 style={{ color: '#020d66' }}>Social Media Tags and Classification</h2>
          <Flex>
            <ImpactTable />
            <FrontRunTable />
            <PieChart />
          </Flex>
        </Section>
        <Section style={{ flexDirection: 'column', alignItems: 'center' }}>

        </Section>

      </Flex >
    </div >
  );
}

export default App;
