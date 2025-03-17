import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';

const MemeRadar = () => {
  const { data: cryptosList, isFetching, error } = useGetCryptosQuery(250);
  console.log('Full cryptosList:', cryptosList);

  const allCoins = cryptosList?.data?.coins || [];
  if (allCoins.length > 0) {
    console.log('All Coin IDs:', allCoins.map(coin => coin.id));
    console.log('All Coins (ID, Name):', allCoins.map(coin => ({ id: coin.id, name: coin.name })));
  }

  const memeCoinIds = [
    'dogecoin', 'shiba-inu', 'pepe', 'floki-inu', 'bonk',
    'dogwifhat', 'mog-coin', 'cat-in-a-dogs-world', 'popcat', 'brett'
  ];
  const memeCoins = allCoins
    .filter(coin => coin.id && memeCoinIds.includes(coin.id))
    .sort((a, b) => Number(b.change) - Number(a.change))
    .slice(0, 5);
  console.log('Filtered memeCoins:', memeCoins);

  if (isFetching) return <div>Loading Meme Coin Radar...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="meme-radar">
      <Typography.Title level={2}>Meme Coin Radar</Typography.Title>
      <Typography.Text>Top 5 trending meme coins by 24h price change</Typography.Text>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {memeCoins.length > 0 ? (
          memeCoins.map(coin => (
            <Col xs={24} sm={12} lg={8} key={coin.uuid}>
              <Card title={coin.name} hoverable>
                <p>Price: ${Number(coin.price).toFixed(6)}</p>
                <p>24h Change: <span style={{ color: coin.change > 0 ? 'green' : 'red' }}>{coin.change}%</span></p>
                <p>X Mentions: {Math.floor(Math.random() * 1000)} (mock)</p>
              </Card>
            </Col>
          ))
        ) : (
          <Typography.Text>No meme coins found in data.</Typography.Text>
        )}
      </Row>
    </div>
  );
};

export default MemeRadar;