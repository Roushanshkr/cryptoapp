import React, { useState, useEffect } from 'react';
import { Select, Typography, Row, Col, Card, Input } from 'antd';
import moment from 'moment';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import Loader from './Loader';

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);

  const { data: cryptoNews, isFetching, error } = useGetCryptoNewsQuery();
  console.log("Raw Crypto News:", cryptoNews);
  console.log("Error:", error);
  console.log("Sample Article:", cryptoNews?.result?.[0]);
  console.log("All Article Dates:", cryptoNews?.result?.map(article => new Date(article.feedDate).toLocaleString()));

  useEffect(() => {
    if (cryptoNews?.result) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const lowerCaseCategory = newsCategory.toLowerCase();
      const filteredNews = cryptoNews.result.filter((article) => {
        const title = article.title?.toLowerCase() || '';
        const matchesSearch = title.includes(lowerCaseSearchTerm);
        const matchesCategory = newsCategory === 'all' || title.includes(lowerCaseCategory);
        return matchesSearch && matchesCategory;
      });
      setNewsArticles(filteredNews);
    } else {
      setNewsArticles([]);
    }
  }, [cryptoNews, searchTerm, newsCategory]);

  if (isFetching) return <Loader />;
  if (error) return <Text>Error fetching news: {JSON.stringify(error)}</Text>;
  if (!cryptoNews?.result) return <Text>No news found in response.</Text>;

  const defaultImage = 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032';

  return (
    <>
      {!simplified && (
        <>
          <div className="search-crypto">
            <Input
              placeholder="Search News"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Select
              value={newsCategory}
              style={{ width: 200 }}
              onChange={(value) => setNewsCategory(value)}
            >
              <Option value="all">All</Option>
              <Option value="bitcoin">Bitcoin</Option>
              <Option value="ethereum">Ethereum</Option>
              <Option value="nfts">NFTs</Option>
              <Option value="regulations">Regulations</Option>
            </Select>
          </Row>
        </>
      )}
      <Row gutter={[24, 24]}>
        {newsArticles.map((news, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                className="news-card"
                cover={
                  <img
                    src={news?.imgUrl || defaultImage}
                    alt="news"
                    onError={(e) => (e.target.src = 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032')}
                  />
                }
              >
                <div className="news-image-container">
                  <Title className="news-title" level={4}>{news.title}</Title>
                </div>
                <div className="provider-container" style={{ justifyContent: 'space-between' }}>
                  <Text className="read-more">Read More</Text>
                  <Text>{moment(news.feedDate).format("MMMM D, YYYY")}</Text>
                </div>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default News;