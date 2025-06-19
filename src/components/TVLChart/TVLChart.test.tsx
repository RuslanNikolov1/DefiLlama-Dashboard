import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TVLChart from './TVLChart';
import { useTVLData } from '../../hooks/useTVLData';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock the useTVLData hook
jest.mock('../../hooks/useTVLData');

describe('TVLChart', () => {
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
    (useTVLData as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TVLChart />
        </ThemeProvider>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useTVLData as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Failed to fetch'),
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TVLChart />
        </ThemeProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Error loading TVL data')).toBeInTheDocument();
  });

  it('renders chart with data and handles filter changes', () => {
    const mockData = [
      { date: 1609459200, totalLiquidityUSD: 1000000 },
      { date: 1609545600, totalLiquidityUSD: 1100000 },
      { date: 1609632000, totalLiquidityUSD: 1200000 },
    ];

    (useTVLData as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockData,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TVLChart />
        </ThemeProvider>
      </QueryClientProvider>
    );

    // Check if title is rendered
    expect(screen.getByText('Total Value Locked (TVL)')).toBeInTheDocument();

    // Check if filter select is rendered
    const select = screen.getByTestId('filter-select');
    expect(select).toBeInTheDocument();

    // Test filter change
    fireEvent.change(select, { target: { value: '7' } });
    expect(select).toHaveValue('7');
  });
}); 