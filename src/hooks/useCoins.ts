import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
}

export function useCoins() {
  return useQuery<Coin[]>({
    queryKey: ['coins'],
    queryFn: async () => {
      const response = await api.get('/coins');
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
} 