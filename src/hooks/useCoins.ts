import { useQuery } from '@tanstack/react-query';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
}

export function useCoins() {
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

  return useQuery<Coin[]>({
    queryKey: ['coins'],
    queryFn: async () => {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false',
        {
          headers: apiKey ? { 'x-cg-pro-api-key': apiKey } : undefined
        }
      );
      if (!res.ok) throw new Error('Failed to fetch coins');
      return res.json();
    },
    staleTime: 60 * 1000, // 1 minute
  });
} 