import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CoinsTable from './CoinsTable';

jest.mock('../../hooks/useCoins', () => ({
  useCoins: jest.fn(),
}));

const mockCoins = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 50000,
    market_cap: 1000000000,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 4000,
    market_cap: 500000000,
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
    current_price: 1,
    market_cap: 70000000,
  },
];

describe('CoinsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    require('../../hooks/useCoins').useCoins.mockReturnValue({ isLoading: true });
    render(<CoinsTable />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    require('../../hooks/useCoins').useCoins.mockReturnValue({ isLoading: false, error: true });
    render(<CoinsTable />);
    expect(screen.getByText(/error loading coins/i)).toBeInTheDocument();
  });

  it('renders table with coins', () => {
    require('../../hooks/useCoins').useCoins.mockReturnValue({ isLoading: false, error: false, data: mockCoins });
    render(<CoinsTable />);
    expect(screen.getByPlaceholderText(/filter by name or symbol/i)).toBeInTheDocument();
    expect(screen.getByText(/bitcoin/i)).toBeInTheDocument();
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
    expect(screen.getByText(/tether/i)).toBeInTheDocument();
    expect(screen.getAllByText(/btc/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/eth/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/usdt/i).length).toBeGreaterThan(0);
    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    expect(screen.getByText('$1.00')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000,000')).toBeInTheDocument();
  });

  it('filters coins by name or symbol', () => {
    require('../../hooks/useCoins').useCoins.mockReturnValue({ isLoading: false, error: false, data: mockCoins });
    render(<CoinsTable />);
    const input = screen.getByPlaceholderText(/filter by name or symbol/i);
    fireEvent.change(input, { target: { value: 'bit' } });
    expect(screen.getByText(/bitcoin/i)).toBeInTheDocument();
    expect(screen.queryByText(/ethereum/i)).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'eth' } });
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
    expect(screen.queryByText(/bitcoin/i)).not.toBeInTheDocument();
  });

  it('sorts by column when header is clicked', () => {
    require('../../hooks/useCoins').useCoins.mockReturnValue({ isLoading: false, error: false, data: mockCoins });
    render(<CoinsTable />);
    // Find the Name header and click it
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    fireEvent.click(nameHeader);
    // After sorting, the first row should be Bitcoin (since it's already sorted asc by default)
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText(/bitcoin/i)).toBeInTheDocument();
    // Click again to sort desc
    fireEvent.click(nameHeader);
    // Now the first row should be Tether (alphabetically last)
    const rowsDesc = screen.getAllByRole('row');
    expect(within(rowsDesc[1]).getByText(/tether/i)).toBeInTheDocument();
  });

  it('paginates results', () => {
    // 20 mock coins for pagination
    const manyCoins = Array.from({ length: 20 }, (_, i) => ({
      ...mockCoins[0],
      id: `coin${i}`,
      name: `Coin${i}`,
      symbol: `c${i}`,
    }));
    require('../../hooks/useCoins').useCoins.mockReturnValue({ isLoading: false, error: false, data: manyCoins });
    render(<CoinsTable />);
    // Should show page 1 of 2
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
    // Click next page
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();
    // Click previous page
    fireEvent.click(screen.getByText(/previous/i));
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });
}); 