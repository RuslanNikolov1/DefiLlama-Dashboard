import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Custom hook to fetch tabular data from the DeFiLlama API.
 * Uses React Query and Axios for data fetching and caching.
 */

interface Protocol {
  name: string;
  tvl: number;
  chain: string;
}

export const useProtocols = () => {
  return useQuery<Protocol[]>({
    queryKey: ['protocols'],
    queryFn: async () => {
      const res = await axios.get('https://api.llama.fi/protocols');
      return res.data;
    },
  });
};
