import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { useGetCryptosQuery } from '../services/cryptoApi';
import millify from 'millify';
import './Cryptocurrencies.css';

const { Option } = Select;

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (cryptosList?.data?.coins) {
      // Step 1: Start with all coins, add fallbacks
      let allCryptos = [...cryptosList.data.coins].map(coin => ({
        ...coin,
        price: coin.price || 0,
        marketCap: coin.marketCap || 0,
        '24hVolume': coin['24hVolume'] || 0,
        change: coin.change || 0,
        iconUrl: coin.iconUrl || 'https://via.placeholder.com/32'
      }));

      // Step 2: Apply search to all coins
      let filteredCryptos = allCryptos.filter((coin) =>
        coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      );

      // Step 3: Sort the full searched list
      filteredCryptos.sort((a, b) => {
        if (sortBy === 'market_cap') return Number(b.marketCap) - Number(a.marketCap);
        if (sortBy === 'price') return Number(b.price) - Number(a.price);
        if (sortBy === 'volume') return Number(b['24hVolume']) - Number(a['24hVolume']);
        if (sortBy === 'percent_change') return Number(b.change) - Number(a.change);
        return 0;
      });

      // Step 4: Apply filter if not 'all'
      if (filter === 'gainers') {
        filteredCryptos = filteredCryptos.filter((coin) => Number(coin.change) > 5);
      } else if (filter === 'most_traded') {
        filteredCryptos = filteredCryptos.filter((coin) => Number(coin['24hVolume']) > 1000000000);
      }

      // Step 5: Re-rank coins based on new order
      filteredCryptos = filteredCryptos.map((coin, index) => ({
        ...coin,
        rank: index + 1 // New rank: 1, 2, 3...
      }));

      setCryptos(filteredCryptos);
    }
  }, [cryptosList, searchTerm, sortBy, filter]);

  if (isFetching) return <div>Loading...</div>;

  return (
    <>
      {!simplified && (
        <div className="crypto-controls">
          <Input
            placeholder="Search Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250, marginRight: 16 }}
          />
          <Select
            value={sortBy}
            className="crypto-select"
            onChange={(value) => setSortBy(value)}
          >
            <Option value="market_cap">Market Cap</Option>
            <Option value="price">Price</Option>
            <Option value="volume">24h Volume</Option>
            <Option value="percent_change">% Change</Option>
          </Select>
          <Select
            value={filter}
            className="crypto-select"
            onChange={(value) => setFilter(value)}
          >
            <Option value="all">All</Option>
            <Option value="gainers">Top Gainers</Option>
            <Option value="most_traded">Most Traded</Option>
          </Select>
        </div>
      )}
      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos.map((coin) => (
          <Col xs={24} sm={12} lg={6} className="crypto-card" key={coin.uuid}>
            <Link to={`/crypto/${coin.uuid}`} onClick={() => console.log(`Navigating to /crypto/${coin.uuid}`)}>
              <Card
                title={`${coin.rank}. ${coin.name || 'Unknown'}`}
                extra={<img className="crypto-image" src={coin.iconUrl} alt={coin.name || 'coin'} />}
                hoverable
              >
                <p>Price: {millify(coin.price)}</p>
                <p>Market Cap: {millify(coin.marketCap)}</p>
                <p>Daily Change: {millify(coin.change)}%</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Cryptocurrencies;