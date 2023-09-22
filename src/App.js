import React, { useState } from 'react';

import SidePanel from './components/SidePanel';
import LineChart from './components/LineChart';
import ImpactTable from './components/ImpactTable';
import FrontRunTable from './components/FrontRunTable';
import PieChart from './components/PieChart';
import Flex from './components/Flex';

import { WORLD_COIN } from './utils';

import './App.css';

import discordData from './data/discord.json';
import coinData from './data/coinData.json'

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: 'yellow',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  height: 36,
  margin: 12
};

function App() {
  const [coin, setCoin] = useState(WORLD_COIN)

  return (
    <div className="App">
      <Flex style={{ flexDirection: 'column' }}>
        <h1 style={{ margin: 20, fontSize: 20 }}>Historical News/Social Media Volatility Dashboard</h1>
        <div style={{ display: 'flex' }}>
          <SidePanel
            coin={coin}
            setCoin={setCoin}
            coinData={coinData}
          />
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <LineChart discordData={discordData} />
            <div style={{ display: 'flex' }}>
              <ImpactTable />
            </div>
            <FrontRunTable />
            <div style={{ margin: 24 }}>
              <div style={{ display: 'flex' }}>
                <h3>Priced in</h3>
                <button style={buttonStyle}>ETH</button>
                <button style={buttonStyle}>BTC</button>
              </div>
              <div className="input-group">
                <label htmlFor="input1">Relevant Time Frame</label>
                <input type="text" id="input1" placeholder="180 days.." />
              </div>
            </div>
          </div>
          <PieChart />
        </div>
      </Flex >
    </div >
  );
}

export default App;
