import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

const mockSignOut = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: { username: 'alice' }, signOut: mockSignOut }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => mockNavigate,
  NavLink: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Link: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('../../ThemeToggle/ThemeToggle', () => () => <div>ThemeToggle</div>);

describe('Header', () => {
  it('renders sign in and sign up buttons when not authenticated', () => {
    jest.resetModules();
    jest.doMock('../../../context/AuthContext', () => ({
      useAuth: () => ({ user: null, signOut: jest.fn() }),
    }));
    const { Header: UnauthedHeader } = require('./Header');
    render(<UnauthedHeader />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('renders navigation and username when authenticated', () => {
    render(<Header />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/stablecoins/i)).toBeInTheDocument();
    expect(screen.getByText(/percentage yield/i)).toBeInTheDocument();
    expect(screen.getByText(/tvl chart/i)).toBeInTheDocument();
    expect(screen.getByText(/defi news/i)).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  it('calls signOut and navigates on sign out click', async () => {
    render(<Header />);
    fireEvent.click(screen.getByText(/sign out/i));
    expect(mockSignOut).toHaveBeenCalled();
    // Navigation is called after signOut resolves, so simulate async
    await Promise.resolve();
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('renders ThemeToggle', () => {
    render(<Header />);
    expect(screen.getByText(/themetoggle/i)).toBeInTheDocument();
  });
}); 