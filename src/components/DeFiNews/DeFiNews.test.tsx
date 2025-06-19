import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DeFiNews from './DeFiNews';
import { BrowserRouter } from 'react-router-dom';

const mockNews = [
  {
    id: '1',
    title: 'Test News 1',
    url: 'https://example.com/1',
    published_at: new Date().toISOString(),
    description: 'A'.repeat(200),
  },
  {
    id: '2',
    title: 'Test News 2',
    url: 'https://example.com/2',
    published_at: new Date().toISOString(),
    description: 'Short desc',
  },
];

jest.mock('../../services/newsApi', () => ({
  fetchDeFiNews: jest.fn(),
}));
const { fetchDeFiNews } = require('../../services/newsApi');

describe('DeFiNews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    fetchDeFiNews.mockReturnValue(new Promise(() => {}));
    render(<DeFiNews />);
    expect(screen.getByText(/loading defi news/i)).toBeInTheDocument();
  });

  it('renders news items after loading', async () => {
    fetchDeFiNews.mockResolvedValueOnce(mockNews);
    render(
      <BrowserRouter>
        <DeFiNews />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Test News 1')).toBeInTheDocument();
      expect(screen.getByText('Test News 2')).toBeInTheDocument();
    });
    // Truncated description
    expect(screen.getByText(/a{157}\.{3}/i)).toBeInTheDocument();
    // Short description
    expect(screen.getByText('Short desc')).toBeInTheDocument();
    // Link
    expect(screen.getByRole('link', { name: /test news 1/i })).toHaveAttribute('href', '/news/1');
  });

  it('renders no news if fetch fails', async () => {
    fetchDeFiNews.mockRejectedValueOnce(new Error('fail'));
    render(
      <BrowserRouter>
        <DeFiNews />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
}); 