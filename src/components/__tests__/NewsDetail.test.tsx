import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import NewsDetail from '../NewsDetail';
import { BrowserRouter } from 'react-router-dom';

const mockNews = [
  {
    id: '1',
    title: 'Test News 1',
    url: 'https://example.com/1',
    published_at: new Date().toISOString(),
    description: 'Test description',
  },
];
const mockComments = [
  {
    _id: 'c1',
    userId: 'u1',
    username: 'user1',
    text: 'Nice article!',
    createdAt: new Date().toISOString(),
  },
];

jest.mock('../../services/newsApi', () => ({
  fetchDeFiNews: jest.fn(),
  fetchComments: jest.fn(() => Promise.resolve([])),
  postComment: jest.fn(),
}));
const { fetchDeFiNews, fetchComments, postComment } = require('../../services/newsApi');

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
const { useAuth } = require('../../context/AuthContext');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

describe('NewsDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { username: 'testuser' } });
    fetchComments.mockImplementation(() => Promise.resolve([]));
  });

  it('renders loading state initially', () => {
    fetchDeFiNews.mockReturnValue(new Promise(() => {}));
    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );
    expect(screen.getByText(/loading news/i)).toBeInTheDocument();
  });

  it('renders not found if news item is missing', async () => {
    fetchDeFiNews.mockResolvedValueOnce([]);
    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/news item not found/i)).toBeInTheDocument();
    });
  });

  it('renders news item and comments', async () => {
    fetchDeFiNews.mockResolvedValueOnce(mockNews);
    fetchComments.mockResolvedValueOnce(mockComments);
    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Test News 1')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText(/nice article/i)).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
    });
  });

  it('allows posting a comment', async () => {
    fetchDeFiNews.mockResolvedValueOnce(mockNews);
    fetchComments.mockResolvedValueOnce([]);
    postComment.mockResolvedValueOnce({});
    fetchComments.mockResolvedValueOnce(mockComments);
    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Test News 1')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText(/add a comment/i), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));
    await waitFor(() => {
      expect(postComment).toHaveBeenCalled();
    });
  });

  it('shows sign in prompt if not authenticated', async () => {
    useAuth.mockReturnValue({ user: null });
    fetchDeFiNews.mockResolvedValueOnce(mockNews);
    fetchComments.mockResolvedValueOnce([]);
    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/sign in to post a comment/i)).toBeInTheDocument();
    });
  });
}); 