const axios = require('axios');

// Helper function to fetch stock prices
async function fetchStockPrices(ticker, minutes) {
  try {
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4MDczNTc3LCJpYXQiOjE3NDgwNzMyNzcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg4MWI5OTk4LWJmZmYtNDIxZi1hNjA5LTUxNTk5ZTk2MjdiOSIsInN1YiI6IjkyNzYyMmJpdDAyMUBta2NlLmFjLmluIn0sImVtYWlsIjoiOTI3NjIyYml0MDIxQG1rY2UuYWMuaW4iLCJuYW1lIjoiZHVyZ2EgZSIsInJvbGxObyI6IjkyNzYyMmJpdDAyMSIsImFjY2Vzc0NvZGUiOiJ3aGVRVXkiLCJjbGllbnRJRCI6Ijg4MWI5OTk4LWJmZmYtNDIxZi1hNjA5LTUxNTk5ZTk2MjdiOSIsImNsaWVudFNlY3JldCI6InF5eXVLdGdmd05IdUdyZUUifQ.gtG5M4jhz5c_t5idgfLQCtnmJxlVqEPQkjkTHxrAHbE`
    };
    const response = await axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}&aggregation=average`, { headers });
    console.log('API Response:', response.data);
    return response.data.priceHistory;
  } catch (error) {
    console.error('Error fetching stock prices:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch stock prices');
  }
}

// Calculate average stock price
exports.getAveragePrice = async (req, res) => {
  try {
    const { ticker, minutes } = req.query;
    const priceHistory = await fetchStockPrices(ticker, minutes);
    const averagePrice = calculateAveragePrice(priceHistory);
    res.json({ averageStockPrice: averagePrice, priceHistory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock prices' });
  }
};

// Calculate correlation between two stocks
exports.getCorrelation = async (req, res) => {
  try {
    const { ticker1, ticker2, minutes } = req.query;
    const prices1 = await fetchStockPrices(ticker1, minutes);
    const prices2 = await fetchStockPrices(ticker2, minutes);

    const avg1 = calculateAveragePrice(prices1);
    const avg2 = calculateAveragePrice(prices2);

    const correlation = calculateCorrelation(prices1, prices2);

    res.json({
      correlation,
      stocks: {
        [ticker1]: { averagePrice: avg1, priceHistory: prices1 },
        [ticker2]: { averagePrice: avg2, priceHistory: prices2 }
      }
    });
  } catch (error) {
    console.error('Error fetching stock prices:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to calculate correlation', details: error.response ? error.response.data : error.message });
  }
};

// Helper function to calculate average price
function calculateAveragePrice(priceHistory) {
  const total = priceHistory.reduce((sum, record) => sum + record.price, 0);
  return total / priceHistory.length;
}

// Helper function to calculate correlation
function calculateCorrelation(prices1, prices2) {
  let covariance = 0, variance1 = 0, variance2 = 0;
  const avg1 = calculateAveragePrice(prices1);
  const avg2 = calculateAveragePrice(prices2);

  for (let i = 0; i < Math.min(prices1.length, prices2.length); i++) {
    const diff1 = prices1[i].price - avg1;
    const diff2 = prices2[i].price - avg2;
    covariance += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }

  return covariance / Math.sqrt(variance1 * variance2);
}
