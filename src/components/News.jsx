import React, { useState, useEffect } from 'react';
import { Select, Typography, Row, Col, Card, Input } from 'antd';
import moment from 'moment';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const count = simplified ? 6 : 12;
  const [newsCategory, setNewsCategory] = useState('cryptocurrency');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);

  // Fetch news from API
  const { data: cryptoNews, isFetching, error } = useGetCryptoNewsQuery({ count });
  console.log("News Data:", cryptoNews); // ✅ Corrected log

  const { data } = useGetCryptosQuery(100);

  useEffect(() => {
    if (cryptoNews?.result) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filteredNews = cryptoNews.result.filter((article) =>
        article.title?.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setNewsArticles(filteredNews);
    } else {
      setNewsArticles([]);
    }
  }, [cryptoNews, searchTerm]);

  if (isFetching) return <Loader />;
  if (!cryptoNews?.result) return <p>No news found.</p>;

  const defaultImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

  return (
    <>
      {!simplified && (
        <div className="search-crypto">
          <Input
            placeholder="Search News"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <Row gutter={[24, 24]}>
        {!simplified && (
          <Col span={24}>
            <Select
              showSearch
              className="select-news"
              placeholder="Select a Crypto"
              onChange={(value) => setNewsCategory(value)}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Option value="cryptocurrency">Cryptocurrency</Option>
              {data?.data?.coins.map((coin) => (
                <Option key={coin.name} value={coin.name}>{coin.name}</Option>
              ))}
            </Select>
          </Col>
        )}

        {newsArticles.map((news, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Card
  hoverable
  className="news-card"
  cover={
    <img
      src={news?.imgUrl || defaultImage} // ✅ Now using imgUrl from API
      alt="news"
      onError={(e) => (e.target.src = defaultImage)} // ✅ Fallback to default image
      // style={{ height: '150px', objectFit: 'cover' }} // ✅ Ensure consistent image size
    />
  }
>

                <div className="news-image-container">
                  <Title className="news-title" level={4}>{news.title}</Title>
                </div>
                <p>
  {news.description?.length > 100
    ? `${news.description.substring(0, 100)}...`
    : news.description}
</p>

                <div className="provider-container"style={{justifyContent:'space-between'}} >
                  
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="read-more">
  Read More
</a>
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
