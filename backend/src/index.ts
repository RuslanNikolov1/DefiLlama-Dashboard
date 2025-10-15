import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import newsRoutes from './routes/newsRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 seconds timeout
axios.defaults.headers.common['User-Agent'] = 'DefiLlama-Dashboard/1.0.0';

// Helper function to handle axios errors
const handleAxiosError = (error: unknown, res: express.Response, defaultMessage: string) => {
  console.error('API proxy error:', error);
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || defaultMessage;
    res.status(status).json({ error: message });
  } else {
    res.status(500).json({ error: defaultMessage });
  }
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// CoinGecko API proxy routes
app.get('/api/coins', async (req, res) => {
  try {
    const { vs_currency = 'usd', order = 'market_cap_desc', per_page = '50', page = '1', sparkline = 'false' } = req.query;
    
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=${sparkline}`;
    
    const response = await axios.get(coinGeckoUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch coins data');
  }
});

// Coin detail proxy route
app.get('/api/coins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { localization = 'false', tickers = 'true', market_data = 'true', community_data = 'true', developer_data = 'true', sparkline = 'false' } = req.query;
    
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/${id}?localization=${localization}&tickers=${tickers}&market_data=${market_data}&community_data=${community_data}&developer_data=${developer_data}&sparkline=${sparkline}`;
    
    const response = await axios.get(coinGeckoUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch coin detail data');
  }
});

// Coin market chart proxy route
app.get('/api/coins/:id/market_chart', async (req, res) => {
  try {
    const { id } = req.params;
    const { vs_currency = 'usd', days = '90' } = req.query;
    
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}`;
    
    const response = await axios.get(coinGeckoUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch market chart data');
  }
});

// Coin tickers proxy route
app.get('/api/coins/:id/tickers', async (req, res) => {
  try {
    const { id } = req.params;
    const { include_exchange_logo = 'true' } = req.query;
    
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/${id}/tickers?include_exchange_logo=${include_exchange_logo}`;
    
    const response = await axios.get(coinGeckoUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch tickers data');
  }
});

// DefiLlama API proxy routes
app.get('/api/llama/charts', async (req, res) => {
  try {
    const response = await axios.get('https://api.llama.fi/charts', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch TVL charts data');
  }
});

app.get('/api/llama/protocols', async (req, res) => {
  try {
    const response = await axios.get('https://api.llama.fi/protocols', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch protocols data');
  }
});

// DefiLlama Yields API proxy route
app.get('/api/llama/yields/pools', async (req, res) => {
  try {
    const response = await axios.get('https://yields.llama.fi/pools', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch yields data');
  }
});

// DefiLlama Stablecoins API proxy route
app.get('/api/llama/stablecoins/charts', async (req, res) => {
  try {
    const response = await axios.get('https://stablecoins.llama.fi/stablecoincharts/all', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch stablecoin data');
  }
});

// Error handling middleware
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  } else {
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? String(err) : undefined,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});