import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

let originalAlert: typeof global.alert;
beforeAll(() => {
  originalAlert = global.alert;
  global.alert = jest.fn();
});
afterAll(() => {
  global.alert = originalAlert;
});

import { SignUpForm } from './SignUpForm';

const mockSignUp = jest.fn();
let mockError: string | null = null;
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ signUp: mockSignUp, error: mockError }),
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    mockSignUp.mockReset();
    mockError = null;
    (global.alert as jest.Mock).mockClear();
  });

  it('renders sign up form', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it.skip('shows alert if passwords do not match', () => {
    render(<SignUpForm />);
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'abc12345' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(global.alert).toHaveBeenCalledWith('Passwords do not match');
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('calls signUp on submit', async () => {
    mockSignUp.mockResolvedValueOnce();
    render(<SignUpForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'bob' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'abc12345' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'abc12345' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('bob@example.com', 'abc12345', 'bob');
    });
  });

  it('shows error message if error exists', () => {
    mockError = 'Email taken';
    render(<SignUpForm />);
    expect(screen.getByText(/email taken/i)).toBeInTheDocument();
  });

  it('shows loading state on submit', async () => {
    mockSignUp.mockImplementation(() => new Promise(() => {}));
    render(<SignUpForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'bob' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'abc12345' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'abc12345' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing up/i })).toBeInTheDocument();
    });
  });
}); 