import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import millify from 'millify';
import { Col, Row, Typography, Select, Button } from 'antd'; // Added Button
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const navigate = useNavigate(); // Navigation tool
  console.log("coinId from URL:", coinId);
  const [timePeriod, setTimePeriod] = useState('7d');
  const { data, isFetching, error } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timePeriod });

  console.log("Crypto Details API Response:", data);
  console.log("Crypto Details Error:", error);
  console.log("Coin History API Response:", coinHistory);

  if (isFetching) return <Loader />;
  if (error) return <div>Error: {error.message || 'Something went wrong'}</div>;
  const cryptoDetails = data?.data?.coin;
  if (!cryptoDetails) return <div>Coin not found or data unavailable.</div>;

  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails?.price ? millify(cryptoDetails.price) : 'N/A'}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank || 'N/A', icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptoDetails?.["24hVolume"] ? millify(Number(cryptoDetails["24hVolume"])) : 'N/A'}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap ? millify(cryptoDetails.marketCap) : 'N/A'}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high', value: `$ ${cryptoDetails?.allTimeHigh?.price ? millify(cryptoDetails.allTimeHigh.price) : 'N/A'}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets || 'N/A', icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges || 'N/A', icon: <MoneyCollectOutlined /> },
    { title: 'Approved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total ? millify(cryptoDetails.supply.total) : 'N/A'}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating ? millify(cryptoDetails.supply.circulating) : 'N/A'}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <Col className="coin-detail-container">
      <Button
        type="primary"
        onClick={() => navigate('/cryptocurrencies')}
        style={{ marginBottom: 16 }}
      >
        Previous
      </Button>
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">{cryptoDetails?.name} ({cryptoDetails?.symbol}) Price</Title>
        <p>{cryptoDetails.name} live price in US Dollar (USD). View value statistics, market cap and supply.</p>
      </Col>
      <Select defaultValue="7d" className="select-timeperiod" placeholder="Select Timeperiod" onChange={(value) => setTimePeriod(value)}>
        {time.map((date) => <Option key={date}>{date}</Option>)}
      </Select>
      <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails?.price)} coinName={cryptoDetails?.name} />
      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">{cryptoDetails.name} Value Statistics</Title>
            <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">Other Stats Info</Title>
            <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <Col className="coin-desc-link">
        <Row className="coin-desc">
          <Title level={3} className="coin-details-heading">What is {cryptoDetails.name}?</Title>
          {cryptoDetails.description ? HTMLReactParser(cryptoDetails.description) : "No description available."}
        </Row>
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">{cryptoDetails.name} Links</Title>
          {cryptoDetails.links && cryptoDetails.links.length > 0 ? (
            cryptoDetails.links.map((link) => (
              <Row className="coin-link" key={link.name}>
                <Title level={5} className="link-name">{link.type}</Title>
                <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
              </Row>
            ))
          ) : (
            <Text>No links available.</Text>
          )}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;