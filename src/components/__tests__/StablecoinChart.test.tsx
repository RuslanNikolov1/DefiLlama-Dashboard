import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StablecoinChart from '../StablecoinChart';
import { useStablecoinData } from '../../hooks/useStablecoinData';

// Mock the useStablecoinData hook
jest.mock('../../hooks/useStablecoinData');

describe('StablecoinChart', () => {
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

  it('renders loading state', () => {
    (useStablecoinData as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <StablecoinChart />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading stablecoin data...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useStablecoinData as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Failed to fetch'),
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <StablecoinChart />
      </QueryClientProvider>
    );

    expect(screen.getByText('Error loading stablecoin data')).toBeInTheDocument();
  });

  it('renders chart with data and handles filter changes', () => {
    const mockData = [
      { date: 1609459200, circulating: 50000000000 },
      { date: 1609545600, circulating: 51000000000 },
    ];

    (useStablecoinData as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockData,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <StablecoinChart />
      </QueryClientProvider>
    );

    // Check if title is rendered
    expect(screen.getByText('Stablecoin Circulating Supply')).toBeInTheDocument();

    // Check if filter select is rendered
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // Test filter change
    fireEvent.change(select, { target: { value: '7' } });
    expect(select).toHaveValue('7');
  });
}); 