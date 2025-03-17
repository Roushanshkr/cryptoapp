import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined, BulbTwoTone, RocketOutlined} from '@ant-design/icons';
// import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined, BulbTwoTone, RocketOutlined } from '@ant-design/icons';

import icon from '../images/cryptocurrency.jpg';

const Navbar = ({ setIsDarkMode }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(null);
  const [isDarkMode, setLocalDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 768) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const toggleDarkMode = () => {
    setLocalDarkMode(!isDarkMode);
    setIsDarkMode(!isDarkMode); // Pass to App.js
  };

  return (
    <div className='nav-container'>
      <div className='logo-container'>
        <Avatar src={icon} size="large" />
        <Typography.Title level={2} className='logo'>
          <Link to="/">EclipseTrade</Link>
        </Typography.Title>
        <Button className='menu-control-container' onClick={() => setActiveMenu(!activeMenu)}>
          <MenuOutlined />
        </Button>
        <Button onClick={toggleDarkMode} style={{ marginLeft: '10px' }}>
          <BulbTwoTone />
        </Button>
      </div>
      {activeMenu && (
  <Menu theme={isDarkMode ? "dark" : "light"}>
    <Menu.Item icon={<HomeOutlined />}>
      <Link to="/">Home</Link>
    </Menu.Item>
    <Menu.Item icon={<FundOutlined />}>
      <Link to="/cryptocurrencies">Cryptocurrencies</Link>
    </Menu.Item>
    <Menu.Item icon={<MoneyCollectOutlined />}>
      <Link to="/exchanges">Exchanges</Link>
    </Menu.Item>
    <Menu.Item icon={<BulbOutlined />}>
      <Link to="/news">News</Link>
    </Menu.Item>
    <Menu.Item icon={<RocketOutlined />}>
      <Link to="/meme-radar">Meme Radar</Link>
    </Menu.Item>
  </Menu>
)}
      
    </div>
  );
};

export default Navbar;