import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAveragePercentageYield } from '../useAveragePercentageYield';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useAveragePercentageYield', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('should fetch percentage yield data successfully', async () => {
    const mockResponse = {
      data: {
        data: [
          { symbol: 'USDC', apyMean30d: 5.2 },
          { symbol: 'DAI', apyMean30d: 4.8 },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAveragePercentageYield(), { wrapper });

    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if data is correctly transformed
    expect(result.current.data).toEqual([
      { symbol: 'USDC', percentage: 5.2 },
      { symbol: 'DAI', percentage: 4.8 },
    ]);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://yields.llama.fi/pools');
  });

  it('should handle missing apyMean30d values', async () => {
    const mockResponse = {
      data: {
        data: [
          { symbol: 'USDC', apyMean30d: null },
          { symbol: 'DAI', apyMean30d: undefined },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAveragePercentageYield(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([
      { symbol: 'USDC', percentage: 0 },
      { symbol: 'DAI', percentage: 0 },
    ]);
  });

  it('should handle error state', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValueOnce(error);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAveragePercentageYield(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
}); 