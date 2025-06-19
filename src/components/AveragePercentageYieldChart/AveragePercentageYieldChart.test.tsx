import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AveragePercentageYieldChart from './AveragePercentageYieldChart';
import { useAveragePercentageYield } from '../../hooks/useAveragePercentageYield';

// Mock the useAveragePercentageYield hook
jest.mock('../../hooks/useAveragePercentageYield');

describe('AveragePercentageYieldChart', () => {
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
    (useAveragePercentageYield as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AveragePercentageYieldChart />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useAveragePercentageYield as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Failed to fetch'),
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AveragePercentageYieldChart />
      </QueryClientProvider>
    );

    expect(screen.getByText('Error loading AveragePercentageYieldChart data')).toBeInTheDocument();
  });

  it('renders chart with data and handles filtering', () => {
    const mockData = [
      { symbol: 'USDC', percentage: 5.2 },
      { symbol: 'DAI', percentage: 4.8 },
      { symbol: 'USDT', percentage: 5.0 },
    ];

    (useAveragePercentageYield as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockData,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AveragePercentageYieldChart />
      </QueryClientProvider>
    );

    // Check if title is rendered
    expect(screen.getByText('Average Percentage Yield')).toBeInTheDocument();

    // Check if filter input is rendered
    const filterInput = screen.getByPlaceholderText('Filter by symbol...');
    expect(filterInput).toBeInTheDocument();

    // Test filtering
    fireEvent.change(filterInput, { target: { value: 'US' } });
    expect(filterInput).toHaveValue('US');
  });
}); 