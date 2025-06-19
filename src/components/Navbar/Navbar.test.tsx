import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders logo and brand name', () => {
    render(<Navbar />);
    expect(screen.getByAltText(/defillama logo/i)).toBeInTheDocument();
    expect(screen.getByText(/defillama/i)).toBeInTheDocument();
  });

  it('renders the navbar container', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', '/defillama-logo.png');
  });
}); 