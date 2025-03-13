import React from 'react';
import millify from 'millify';
import { Typography, Row, Col, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { useGetCryptosQuery, useGetCryptoStatsQuery } from '../services/cryptoApi';
import { Cryptocurrencies, News } from '../components';
import Loader from './Loader';

const { Title } = Typography;

const Homepage = () => {
  const { data: coinsData, isFetching: isFetchingCoins } = useGetCryptosQuery(10);
  const { data: statsData, isFetching: isFetchingStats } = useGetCryptoStatsQuery();
  console.log("Homepage Crypto Data:", coinsData);
  console.log("Homepage Stats Data:", statsData);

  if (isFetchingCoins || isFetchingStats) return <Loader />;

  const coinList = coinsData?.data?.coins || [];
  const globalStats = {
    total: statsData?.data?.totalCoins || 0,
    totalExchanges: statsData?.data?.totalExchanges || 0,
    totalMarketCap: coinList.reduce((sum, coin) => sum + (Number(coin.marketCap) || 0), 0) || 0,
    total24hVolume: coinList.reduce((sum, coin) => sum + (Number(coin["24hVolume"]) || 0), 0) || 0,
    totalMarkets: statsData?.data?.totalMarkets || 0,
  };

  return (
    <>
      <Title level={2} className="heading">Global Crypto Stats</Title>
      <Row>
        <Col span={12}><Statistic title="Total Cryptocurrencies" value={globalStats.total} /></Col>
        <Col span={12}><Statistic title="Total Exchanges" value={globalStats.totalExchanges} /></Col>
        <Col span={12}><Statistic title="Total Market Cap" value={millify(globalStats.totalMarketCap)} /></Col>
        <Col span={12}><Statistic title="Total 24h Volume" value={millify(globalStats.total24hVolume)} /></Col>
        <Col span={12}><Statistic title="Total Markets" value={globalStats.totalMarkets} /></Col>
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Top 10 Cryptocurrencies in the World</Title>
        <Title level={2} className="show-more"><Link to="/cryptocurrencies">Show More</Link></Title>
      </div>
      <Cryptocurrencies simplified />
      <div className="home-heading-container">
        <Title level={2} className="home-title">Latest Crypto News</Title>
        <Title level={2} className="show-more"><Link to="/news">Show More</Link></Title>
      </div>
      <News simplified />
    </>
  );
};

export default Homepage;