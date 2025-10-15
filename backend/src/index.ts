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

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes (increased from 5)

// Fallback data for when CoinGecko API is rate-limited
const FALLBACK_COINS_DATA = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 110000,
    market_cap: 2200000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5
  },
  {
    id: "ethereum",
    symbol: "eth", 
    name: "Ethereum",
    image: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3500,
    market_cap: 420000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8
  }
];

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per IP

// Rate limiting middleware
const rateLimit = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  const current = requestCounts.get(ip);
  
  if (!current || now > current.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    next();
  } else if (current.count < RATE_LIMIT_MAX_REQUESTS) {
    current.count++;
    next();
  } else {
    res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    });
  }
};

// Helper function to get cached data or fetch new data
const getCachedData = async (key: string, fetchFunction: () => Promise<any>) => {
  const cached = cache.get(key);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`Cache hit for ${key}`);
    return cached.data;
  }
  
  console.log(`Cache miss for ${key}, fetching new data`);
  const data = await fetchFunction();
  cache.set(key, { data, timestamp: now });
  return data;
};

// Helper function to handle axios errors with fallback data
const handleAxiosError = (error: unknown, res: express.Response, defaultMessage: string, fallbackData?: any) => {
  console.error('API proxy error:', error);
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    let message = error.response?.data?.error || error.message || defaultMessage;
    
    // Handle specific error cases
    if (status === 429) {
      console.log('Rate limit exceeded, using fallback data');
      if (fallbackData) {
        res.json(fallbackData);
        return;
      }
      message = 'CoinGecko API rate limit exceeded. Please try again later.';
      res.status(429).json({ 
        error: message,
        retryAfter: 60 // Suggest waiting 60 seconds
      });
      return;
    }
    
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

// Apply rate limiting to API routes
app.use('/api/coins', rateLimit);
app.use('/api/llama', rateLimit);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.1'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// CoinGecko API proxy routes
app.get('/api/coins', async (req, res) => {
  try {
    const { vs_currency = 'usd', order = 'market_cap_desc', per_page = '50', page = '1', sparkline = 'false' } = req.query;
    
    const cacheKey = `coins-${vs_currency}-${order}-${per_page}-${page}-${sparkline}`;
    
    const data = await getCachedData(cacheKey, async () => {
      const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=${sparkline}`;
      
      const response = await axios.get(coinGeckoUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      return response.data;
    });
    
    res.json(data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch coins data', FALLBACK_COINS_DATA);
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
    // For coin detail, we'll return a generic error since we don't have specific fallback data
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