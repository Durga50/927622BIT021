import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Container, Typography, Select, MenuItem } from '@material-ui/core';

const StockPage = () => {
  const [stockData, setStockData] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [minutes, setMinutes] = useState(50);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/stocks/average?ticker=NVDA&minutes=${minutes}`);
        setStockData(response.data.priceHistory);
        setAveragePrice(response.data.averageStockPrice);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };
    fetchStockData();
  }, [minutes]);

  const handleMinutesChange = (event) => {
    setMinutes(event.target.value);
  };

  const data = {
    labels: stockData.map((entry) => new Date(entry.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Stock Price',
        data: stockData.map((entry) => entry.price),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Stock Prices
      </Typography>
      <Select value={minutes} onChange={handleMinutesChange}>
        <MenuItem value={10}>Last 10 minutes</MenuItem>
        <MenuItem value={30}>Last 30 minutes</MenuItem>
        <MenuItem value={50}>Last 50 minutes</MenuItem>
      </Select>
      <Line data={data} />
      <Typography variant="h6">
        Average Price: {averagePrice.toFixed(2)}
      </Typography>
    </Container>
  );
};

export default StockPage; 