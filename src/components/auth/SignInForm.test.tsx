import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignInForm } from './SignInForm';

const mockSignIn = jest.fn();

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signIn: mockSignIn, error: null }),
}));

const originalUseAuth = require('../../context/AuthContext').useAuth;

describe('SignInForm', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
  });

  it('renders sign in form', () => {
    render(<SignInForm />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('calls signIn on submit', async () => {
    mockSignIn.mockResolvedValueOnce();
    render(<SignInForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows error message if error exists', () => {
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({ signIn: mockSignIn, error: 'Invalid credentials' }),
    }));
    const { SignInForm: ErrorSignInForm } = require('./SignInForm');
    render(<ErrorSignInForm />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    jest.dontMock('../../context/AuthContext');
  });

  it('shows loading state on submit', async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {}));
    render(<SignInForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    });
  });
}); 