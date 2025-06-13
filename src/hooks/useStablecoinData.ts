import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Interface representing a single data point for stablecoin circulating supply.
 */
interface StablecoinEntry {
  date: number;
  circulating: number;
}

/**
 * Custom React Query hook to fetch stablecoin circulating supply data from the DeFiLlama Stablecoins API.
 *
 * This hook queries the `/stablecoincharts/all` endpoint and returns an array of data points,
 * each containing a timestamp and the total circulating stablecoin supply at that time.
 */

export const useStablecoinData = () => {
  return useQuery<StablecoinEntry[]>({
    queryKey: ['stablecoinData'],
    queryFn: async () => {
      const res = await axios.get('https://stablecoins.llama.fi/stablecoincharts/all');
      return res.data.map((point: any) => ({
        date: point.date,
        circulating: point.totalCirculating.peggedUSD
      }));
    },
  });
};