import { renderHook, waitFor } from '@testing-library/react';
import { useCoins } from '../useCoins';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: PropsWithChildren<{}>) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

beforeAll(() => {
  process.env.VITE_COINGECKO_API_KEY = 'test-key';
});

describe('useCoins', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns data on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: '', current_price: 1, market_cap: 2 },
      ],
    });
    const { result } = renderHook(() => useCoins(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data![0].name).toBe('Bitcoin');
  });

  it('returns error on fetch failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useCoins(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('returns error on network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useCoins(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toMatch(/network error/i);
  });

  it('returns empty array if API returns empty', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });
    const { result } = renderHook(() => useCoins(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual([]);
  });
}); 