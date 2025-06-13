import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStablecoinData } from '../useStablecoinData';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useStablecoinData', () => {
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

  it('should fetch stablecoin data successfully', async () => {
    const mockData = [
      { date: 1609459200000, totalCirculating: { peggedUSD: 50000000000 } },
      { date: 1609545600000, totalCirculating: { peggedUSD: 51000000000 } },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useStablecoinData(), { wrapper });

    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if data is correct
    expect(result.current.data).toEqual([
      { date: 1609459200000, circulating: 50000000000 },
      { date: 1609545600000, circulating: 51000000000 },
    ]);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://stablecoins.llama.fi/stablecoincharts/all');
  });

  it('should handle error state', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValueOnce(error);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useStablecoinData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
}); 