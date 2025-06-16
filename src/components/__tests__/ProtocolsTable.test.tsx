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

    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
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

  it('renders table with data and handles filtering, sorting, and pagination', () => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      name: `Protocol ${i + 1}`,
      tvl: 1000000000 - (i * 100000000),
      chain: i % 2 === 0 ? 'Ethereum' : 'BSC',
    }));

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

    // Check if table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('TVL')).toBeInTheDocument();
    expect(screen.getByText('Chain')).toBeInTheDocument();

    // Check if data is rendered
    expect(screen.getByText('Protocol 1')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000,000')).toBeInTheDocument();

    // Check initial row count (15 items per page + header)
    const initialRows = screen.getAllByRole('row');
    expect(initialRows.length).toBe(16); // 15 data rows + 1 header row


    // Test sorting
    const tvlHeader = screen.getByText('TVL');
    fireEvent.click(tvlHeader);
    expect(tvlHeader).toHaveAttribute('aria-sort', 'descending');

    // Test keyboard navigation for sorting
    fireEvent.keyDown(tvlHeader, { key: 'Enter' });
    expect(tvlHeader).toHaveAttribute('aria-sort', 'ascending');

    // Test pagination
    const paginationInfo = screen.getByRole('status');
    expect(paginationInfo).toHaveTextContent('1');
    expect(paginationInfo).toHaveTextContent('2');

    // Test next page button
    const nextButton = screen.getByRole('button', { name: 'Next page' });
    fireEvent.click(nextButton);
    expect(paginationInfo).toHaveTextContent('2');

    // Test previous page button
    const prevButton = screen.getByRole('button', { name: 'Previous page' });
    fireEvent.click(prevButton);
    expect(paginationInfo).toHaveTextContent('1');

    // Test filtering
    fireEvent.change(filterInput, { target: { value: 'Ethereum' } });
    expect(filterInput).toHaveValue('Ethereum');
    expect(screen.getAllByText('Ethereum')).toHaveLength(10);
  });

  it('handles accessibility attributes correctly', () => {
    (useProtocols as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: [
        { name: 'Aave', tvl: 1000000000, chain: 'Ethereum' },
        { name: 'Uniswap', tvl: 800000000, chain: 'Ethereum' },
      ],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProtocolsTable />
      </QueryClientProvider>
    );

    // Check table container role
    expect(screen.getByRole('region', { name: 'Protocols table' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Protocols data' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Table pagination' })).toBeInTheDocument();

    // Check table role
    expect(screen.getByRole('grid')).toBeInTheDocument();

    // Check header roles
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(3); // Name, TVL, Chain

    // Check cell roles
    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBeGreaterThan(0);

    // Check pagination status
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
}); 