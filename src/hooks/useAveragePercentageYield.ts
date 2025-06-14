import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Interface representing a single borrow rate entry.
 */
interface PercentageRateEntry {
    /** The symbol or name of the borrowing pool/token */
    symbol: string;
    /** The base borrow APY (annual percentage yield) rate */
    percentage: number;
}

/**
 * Custom React Query hook to fetch percentage rates from the DeFiLlama Yields API.
 *
 * This hook queries the `/pools` endpoint and returns an array of percentage rate entries,
 * each containing a symbol and the apyMean30d.
 */

export const useAveragePercentageYield = () => {
    return useQuery<PercentageRateEntry[]>({
        queryKey: ['averagePercentageYield'],
        queryFn: async () => {
            const res = await axios.get('https://yields.llama.fi/pools');
            return res.data.data.map((entry: any) => ({
                symbol: entry.symbol,
                percentage: entry.apyMean30d ?? 0,
            })).slice(0, 100);
        },
    });
};