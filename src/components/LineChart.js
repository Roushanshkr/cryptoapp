import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Col, Row, Typography } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  const history = coinHistory?.data?.history || [];
  const coinPrice = history.map((item) => item.price);
  const coinTimestamp = history.map((item) => new Date(item.timestamp * 1000).toLocaleDateString()); // Format as dates

  const data = {
    labels: [...coinTimestamp].reverse(), // Reverse for chronological order
    datasets: [
      {
        label: "Price In USD",
        data: [...coinPrice].reverse(), // Reverse to match timestamps
        borderColor: "#0071bd",
        backgroundColor: "#0071bd",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: tooltipItem => `$${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: value => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <>
      <Row className="chart-header">
        <AntTitle level={2} className="chart-title">{coinName} Price Chart</AntTitle>
        <Col className="price-container">
          <AntTitle level={5} className="price-change">Change: {coinHistory?.data?.change || 0}%</AntTitle>
          <AntTitle level={5} className="current-price">Current {coinName} Price: ${currentPrice}</AntTitle>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  );
};

export default LineChart;