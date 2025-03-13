import React, { useState, useEffect } from 'react';
import millify from 'millify';
import { Row, Col, Typography, Avatar, Card, Input } from 'antd';
import { useGetExchangesQuery } from '../services/cryptoExchangesApi';
import Loader from './Loader';

const { Text } = Typography;

const Exchanges = () => {
  const { data: exchanges, isFetching, error } = useGetExchangesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExchanges, setFilteredExchanges] = useState([]);

  useEffect(() => {
    if (exchanges) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = exchanges.filter((exchange) =>
        exchange.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredExchanges(filtered);
    }
  }, [exchanges, searchTerm]);

  // Show loader while fetching
  if (isFetching) return <Loader />;
  if (error) return <Text type="danger">Failed to load exchanges.</Text>;
  return (
    <>
      {/* Search Input Styled Same as Cryptocurrencies & News */}
      <div className="search-crypto">
        <Input
          placeholder="Search Exchange"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Row gutter={[24, 24]}>
        {filteredExchanges.length > 0 ? (
          filteredExchanges.map((exchange) => (
            <Col xs={24} sm={12} lg={8} key={exchange.id}>
              <a href={exchange.url} target="_blank" rel="noreferrer">
                <Card hoverable>
                  <div className="exchange-card">
                    <Avatar src={exchange.image} size="large" />
                    <Text strong>{exchange.name}</Text>
                  </div>
                  <Text>🌍 Country: {exchange.country || 'N/A'}</Text> <br />
                  <Text>📅 Established: {exchange.year_established || 'N/A'}</Text> <br />
                  <Text>🔒 Trust Score: {exchange.trust_score}</Text> <br />
                  <Text>📈 24h Volume (BTC): {millify(exchange.trade_volume_24h_btc)}</Text>
                </Card>
              </a>
            </Col>
          ))
        ) : (
          <Col span={24} className="no-results">
            <p>No exchanges found.</p>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Exchanges;
