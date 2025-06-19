import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../../context/ThemeContext';

describe('ThemeToggle', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  it('renders theme toggle button', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    
    // Initial state should be dark theme
    expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
    
    // Click to toggle to light theme
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
    
    // Click again to toggle back to dark theme
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
  });

  it('persists theme preference in localStorage', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    
    // Toggle to light theme
    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('light');
    
    // Toggle back to dark theme
    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
}); 