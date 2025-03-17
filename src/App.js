import React, { useState, useEffect } from 'react';

import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Typography, Space } from 'antd';
import { Navbar, Exchanges, Homepage, Cryptocurrencies, News, CryptoDetails, MemeRadar } from './components';
import { useGetCryptosQuery } from './services/cryptoApi';
import './App.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const { data: cryptosList } = useGetCryptosQuery(250);
  const memeCoinIds = ['dogecoin', 'shiba-inu', 'pepe', 'floki-inu', 'bonk', 'dogwifhat', 'mog-coin', 'cat-in-a-dogs-world', 'popcat', 'brett'];
  const memeCoins = cryptosList?.data?.coins
    ?.filter(coin => memeCoinIds.includes(coin.id))
    .sort((a, b) => Number(b.change) - Number(a.change))
    .slice(0, 5) || [];

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className='navbar'>
        <Navbar setIsDarkMode={setIsDarkMode} />
      </div>
      <div className='main'>
        <Layout>
          <div className='routes'>
            <Routes>
              <Route path="/" element={<Homepage memeCoins={memeCoins} />} />
              <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
              <Route path="/crypto/:coinId" element={<CryptoDetails />} /> {/* Must be here */}
              <Route path="/exchanges" element={<Exchanges />} />
              <Route path="/news" element={<News />} />
              <Route path="/meme-radar" element={<MemeRadar />} />
            </Routes>
          </div>
        </Layout>
        <div className='footer'>
          <Typography.Title level={5} style={{ color: 'white', textAlign: 'center' }}>
            EclipseTrade <br />
            All rights reserved
          </Typography.Title>
          <Space>
            <Link to="/">Home</Link>
            <Link to="/exchanges">Exchanges</Link>
            <Link to="/news">News</Link>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default App;