import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CoinDetailPage from './CoinDetailPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'bitcoin' }),
}));

global.fetch = jest.fn();

const mockCoin = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: { large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  market_data: {
    current_price: { usd: 50000 },
    market_cap: { usd: 1000000000 },
    total_volume: { usd: 50000000 },
    price_change_percentage_24h: 2.5,
    price_change_percentage_7d: 5.1,
    price_change_percentage_30d: 10.2,
    ath: { usd: 69000 },
    ath_date: { usd: '2021-11-10T00:00:00.000Z' },
    atl: { usd: 67 },
    atl_date: { usd: '2013-07-06T00:00:00.000Z' },
    circulating_supply: 19000000,
    total_supply: 21000000,
    max_supply: 21000000,
    market_cap_rank: 1,
  },
  description: { en: 'Bitcoin is a cryptocurrency.' },
  links: {
    homepage: ['https://bitcoin.org'],
    blockchain_site: [],
    official_forum_url: [],
    repos_url: { github: [] },
    twitter_screen_name: '',
    subreddit_url: '',
  },
  genesis_date: '2009-01-03',
  market_cap_rank: 1,
};

const mockChart = {
  prices: [ [1622505600000, 35000], [1622592000000, 36000] ],
  market_caps: [ [1622505600000, 700000000], [1622592000000, 710000000] ],
  total_volumes: [ [1622505600000, 30000000], [1622592000000, 32000000] ],
};

const mockMarkets = {
  tickers: [
    {
      market: { name: 'Binance', logo: 'https://binance.com/logo.png' },
      base: 'BTC',
      target: 'USDT',
      last: 50000,
      converted_volume: { usd: 10000000 },
    },
    {
      market: { name: 'Coinbase', logo: 'https://coinbase.com/logo.png' },
      base: 'BTC',
      target: 'USD',
      last: 49900,
      converted_volume: { usd: 8000000 },
    },
  ],
};

describe('CoinDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    process.env.VITE_COINGECKO_API_KEY = 'test-key';
  });

  it('renders loading state', () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<CoinDetailPage />);
    expect(screen.getByText(/loading coin data/i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));
    render(<CoinDetailPage />);
    await waitFor(() => expect(screen.getByText(/failed to load coin data/i)).toBeInTheDocument());
  });

  it('renders coin overview, charts, key stats, description, and markets', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockCoin })
      .mockResolvedValueOnce({ ok: true, json: async () => mockChart })
      .mockResolvedValueOnce({ ok: true, json: async () => mockMarkets });
    render(<CoinDetailPage />);
    // Overview
    await waitFor(() => expect(screen.getAllByText(/bitcoin/i).length).toBeGreaterThan(0));
    expect(screen.getAllByText(/btc/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('$50,000').length).toBeGreaterThan(0);
    expect(screen.getByText(/rank #1/i)).toBeInTheDocument();
    // Key stats
    expect(screen.getAllByText(/market cap/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/circulating supply/i)).toBeInTheDocument();
    expect(screen.getByText(/all-time high/i)).toBeInTheDocument();
    expect(screen.getByText(/genesis date/i)).toBeInTheDocument();
    // Description
    expect(screen.getByText(/bitcoin is a cryptocurrency/i)).toBeInTheDocument();
    expect(screen.getByText(/official website/i)).toBeInTheDocument();
    // Markets
    expect(screen.getByText(/binance/i)).toBeInTheDocument();
    expect(screen.getByText(/coinbase/i)).toBeInTheDocument();
    expect(screen.getByText(/btc\/usdt/i)).toBeInTheDocument();
    expect(screen.getAllByText(/btc\/usd/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('$50,000').length).toBeGreaterThan(0);
    expect(screen.getByText('$49,900')).toBeInTheDocument();
    expect(screen.getByText('$10,000,000')).toBeInTheDocument();
    expect(screen.getByText('$8,000,000')).toBeInTheDocument();
  });

  it('handles missing data gracefully', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockCoin, market_data: undefined }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ tickers: [] }) });
    render(<CoinDetailPage />);
    await waitFor(() => expect(screen.getAllByText(/bitcoin/i).length).toBeGreaterThan(0));
    // Should not throw, should render fallback values
  });
}); 