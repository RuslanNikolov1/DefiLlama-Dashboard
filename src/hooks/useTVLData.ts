import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Interface representing a single data point in the TVL chart.
 */
interface TVLDataPoint {
  date: number;
  totalLiquidityUSD: number;
}

/**
 * Custom React Query hook to fetch Total Value Locked (TVL) data from the DeFiLlama API.
 *
 * This hook retrieves historical TVL data using the `/charts` endpoint.
 * It returns an array of data points, each with a timestamp and total liquidity in USD.
 */

export const useTVLData = () => {
  return useQuery<TVLDataPoint[]>({
    queryKey: ['tvlData'],
    queryFn: async () => {
      const response = await api.get('/llama/charts');
      return response.data;
    },
  });
};