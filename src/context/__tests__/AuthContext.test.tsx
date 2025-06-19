import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('../../services/api', () => ({
  authApi: {
    verifyToken: jest.fn(),
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}));
const { authApi } = require('../../services/api');

describe('AuthProvider', () => {
  it('renders children', () => {
    render(
      <AuthProvider>
        <div>Auth Child</div>
      </AuthProvider>
    );
    expect(screen.getByText(/auth child/i)).toBeInTheDocument();
  });

  it('provides signIn and signUp and signOut', async () => {
    authApi.signIn.mockResolvedValue({ token: 't', user: { id: '1', email: 'a', username: 'b' } });
    authApi.signUp.mockResolvedValue({ token: 't', user: { id: '1', email: 'a', username: 'b' } });
    authApi.signOut.mockResolvedValue();
    let context: any;
    function Consumer() {
      context = useAuth();
      return null;
    }
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await act(async () => {
      await context.signUp('a', 'b', 'c');
      await context.signIn('a', 'b');
      await context.signOut();
    });
    expect(authApi.signUp).toHaveBeenCalled();
    expect(authApi.signIn).toHaveBeenCalled();
    expect(authApi.signOut).toHaveBeenCalled();
  });

  it('sets error on signIn/signUp failure', async () => {
    authApi.signIn.mockRejectedValue(new Error('fail sign in'));
    authApi.signUp.mockRejectedValue(new Error('fail sign up'));
    let context: any;
    function Consumer() {
      context = useAuth();
      return <div>{context.error}</div>;
    }
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await act(async () => {
      try { await context.signIn('a', 'b'); } catch {}
      try { await context.signUp('a', 'b', 'c'); } catch {}
    });
    expect(screen.getByText(/fail sign in|fail sign up/i)).toBeInTheDocument();
  });

  it('throws if useAuth is used outside provider', () => {
    const { useAuth } = jest.requireActual('../AuthContext');
    expect(() => useAuth()).toThrow();
  });
}); 