import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AppWithProviders from './App';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

beforeEach(() => {
  localStorage.clear();
});

const queryClient = new QueryClient();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AppWithProviders />
      </MemoryRouter>
    );
  });
});

describe('Onboarding message', () => {
  beforeEach(() => {
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', id: '1' },
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      error: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the onboarding message on first visit to coins page', async () => {
    localStorage.removeItem('seenOnboardingCoins');
    renderWithProviders(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithProviders />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/you can click on a coin and see more about it!/i)).toBeInTheDocument();
    });
  });

  it('does not show the onboarding message if seenOnboardingCoins is true', async () => {
    localStorage.setItem('seenOnboardingCoins', 'true');
    renderWithProviders(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithProviders />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText(/you can click on a coin and see more about it!/i)).not.toBeInTheDocument();
    });
  });
}); 