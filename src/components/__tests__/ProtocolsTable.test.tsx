import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtocolsTable from '../ProtocolsTable';
import { useProtocols } from '../../hooks/useProtocols';

// Mock the useProtocols hook
jest.mock('../../hooks/useProtocols');

describe('ProtocolsTable', () => {
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
    (useProtocols as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProtocolsTable />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading protocols...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useProtocols as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Failed to fetch'),
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProtocolsTable />
      </QueryClientProvider>
    );

    expect(screen.getByText('Error loading protocols')).toBeInTheDocument();
  });

  it('renders table with data and handles filtering and sorting', () => {
    const mockData = [
      { name: 'Aave', tvl: 1000000000, chain: 'Ethereum' },
      { name: 'Uniswap', tvl: 800000000, chain: 'Ethereum' },
      { name: 'PancakeSwap', tvl: 500000000, chain: 'BSC' },
    ];

    (useProtocols as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockData,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProtocolsTable />
      </QueryClientProvider>
    );

    // Check if filter input is rendered
    const filterInput = screen.getByPlaceholderText('Filter by name or chain...');
    expect(filterInput).toBeInTheDocument();

    // Test filtering
    fireEvent.change(filterInput, { target: { value: 'Ethereum' } });
    expect(filterInput).toHaveValue('Ethereum');

    // Check if table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('TVL')).toBeInTheDocument();
    expect(screen.getByText('Chain')).toBeInTheDocument();

    // Check if data is rendered
    expect(screen.getByText('Aave')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000,000')).toBeInTheDocument();
    expect(screen.getAllByText('Ethereum')).toHaveLength(2);

    // Test sorting
    const tvlHeader = screen.getByText('TVL');
    fireEvent.click(tvlHeader);
    expect(tvlHeader).toHaveTextContent('TVL 🔽');
  });
}); 