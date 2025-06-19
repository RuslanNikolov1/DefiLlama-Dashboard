import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    ath: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_date: { usd: string };
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    market_cap_rank: number;
  };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    repos_url: { github: string[] };
    twitter_screen_name: string;
    subreddit_url: string;
  };
  genesis_date: string;
  market_cap_rank?: number;
}

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

const CoinDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  function getApiKey() {
    if (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID) {
      return process.env.VITE_COINGECKO_API_KEY;
    } else {
      try {
        // Use dynamic function to avoid static import.meta.env reference
        // @ts-ignore
        return new Function('return import.meta.env.VITE_COINGECKO_API_KEY')();
      } catch {
        return undefined;
      }
    }
  }
  const apiKey = getApiKey();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceChart, setPriceChart] = useState<ChartDataPoint[]>([]);
  const [marketCapChart, setMarketCapChart] = useState<ChartDataPoint[]>([]);
  const [volumeChart, setVolumeChart] = useState<ChartDataPoint[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=false`, {
        headers: apiKey ? { 'x-cg-pro-api-key': apiKey } : undefined
      }).then(r => r.json()),
      fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=90`, {
        headers: apiKey ? { 'x-cg-pro-api-key': apiKey } : undefined
      }).then(r => r.json()),
      fetch(`https://api.coingecko.com/api/v3/coins/${id}/tickers?include_exchange_logo=true`, {
        headers: apiKey ? { 'x-cg-pro-api-key': apiKey } : undefined
      }).then(r => r.json()),
    ])
      .then(([coinData, chartData, marketsData]) => {
        setCoin(coinData);
        setPriceChart(
          (chartData.prices || []).map((d: [number, number]) => ({ timestamp: d[0], value: d[1] }))
        );
        setMarketCapChart(
          (chartData.market_caps || []).map((d: [number, number]) => ({ timestamp: d[0], value: d[1] }))
        );
        setVolumeChart(
          (chartData.total_volumes || []).map((d: [number, number]) => ({ timestamp: d[0], value: d[1] }))
        );
        setMarkets(marketsData.tickers || []);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load coin data');
        setLoading(false);
      });
  }, [id, apiKey]);

  if (loading) return <div>Loading coin data...</div>;
  if (error || !coin) return <div>{error || 'Coin not found'}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: 'var(--card-background)', borderRadius: 16, padding: 24, boxShadow: '0 0 12px var(--shadow-color)' }}>
      {/* Coin Overview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <img src={coin.image.large} alt={coin.name} style={{ width: 64, height: 64 }} />
        <div>
          <h2 style={{ margin: 0 }}>{coin.name ?? 'N/A'} ({coin.symbol?.toUpperCase() ?? 'N/A'})</h2>
          <div style={{ fontSize: 24, fontWeight: 600 }}>
            ${coin.market_data?.current_price?.usd?.toLocaleString?.() ?? 'N/A'}
          </div>
          <div style={{ color: (coin.market_data?.price_change_percentage_24h ?? 0) >= 0 ? 'var(--success-color)' : 'var(--error-color)' }}>
            24h: {(coin.market_data?.price_change_percentage_24h ?? 0).toFixed(2)}%
          </div>
          <div>Rank #{coin.market_cap_rank ?? 'N/A'}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 32 }}>
        <div>
          <h3>Price (90d)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={priceChart}>
              <XAxis dataKey="timestamp" tickFormatter={t => new Date(t).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={t => new Date(t).toLocaleDateString()} />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3>Market Cap (90d)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={marketCapChart}>
              <XAxis dataKey="timestamp" tickFormatter={t => new Date(t).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={t => new Date(t).toLocaleDateString()} />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3>Volume (90d)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={volumeChart}>
              <XAxis dataKey="timestamp" tickFormatter={t => new Date(t).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={t => new Date(t).toLocaleDateString()} />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="value" stroke="#ffc658" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
        <div>
          <strong>Market Cap:</strong><br />${coin.market_data?.market_cap?.usd?.toLocaleString?.() ?? 'N/A'}
        </div>
        <div>
          <strong>Circulating Supply:</strong><br />{coin.market_data?.circulating_supply?.toLocaleString?.() ?? 'N/A'}
        </div>
        <div>
          <strong>Total Supply:</strong><br />{coin.market_data?.total_supply?.toLocaleString?.() ?? 'N/A'}
        </div>
        <div>
          <strong>Max Supply:</strong><br />{coin.market_data?.max_supply?.toLocaleString?.() ?? 'N/A'}
        </div>
        <div>
          <strong>All-Time High:</strong><br />${coin.market_data?.ath?.usd?.toLocaleString?.() ?? 'N/A'} ({coin.market_data?.ath_date?.usd ? new Date(coin.market_data.ath_date.usd).toLocaleDateString() : 'N/A'})
        </div>
        <div>
          <strong>All-Time Low:</strong><br />${coin.market_data?.atl?.usd?.toLocaleString?.() ?? 'N/A'} ({coin.market_data?.atl_date?.usd ? new Date(coin.market_data.atl_date.usd).toLocaleDateString() : 'N/A'})
        </div>
        <div>
          <strong>Genesis Date:</strong><br />{coin.genesis_date ?? 'N/A'}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 32 }}>
        <h3>Description</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: 16 }} dangerouslySetInnerHTML={{ __html: coin.description.en?.split('. ')[0] + '.' }} />
        <div style={{ marginTop: 8 }}>
          <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">Official Website</a>
        </div>
      </div>

      {/* Exchanges & Markets */}
      <div>
        <h3>Where to Buy</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Exchange</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Pair</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Price</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {markets.slice(0, 10).map((m, i) => (
              <tr key={i}>
                <td style={{ padding: 8 }}>
                  {m.market.name} {m.market.logo && <img src={m.market.logo} alt={m.market.name} style={{ width: 18, height: 18, verticalAlign: 'middle', marginLeft: 4 }} />}
                </td>
                <td style={{ padding: 8 }}>{m.base}/{m.target}</td>
                <td style={{ padding: 8 }}>${m.last.toLocaleString()}</td>
                <td style={{ padding: 8 }}>${m.converted_volume?.usd?.toLocaleString() || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinDetailPage; 