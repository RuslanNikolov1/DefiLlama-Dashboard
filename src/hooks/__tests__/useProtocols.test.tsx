import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProtocols } from '../useProtocols';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useProtocols', () => {
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

  it('should fetch protocols data successfully', async () => {
    const mockData = [
      { name: 'Aave', tvl: 1000000000, chain: 'Ethereum' },
      { name: 'Uniswap', tvl: 800000000, chain: 'Ethereum' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useProtocols(), { wrapper });

    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if data is correct
    expect(result.current.data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.llama.fi/protocols');
  });

  it('should handle error state', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValueOnce(error);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useProtocols(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
}); 