import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders footer sections', () => {
    render(<Footer />);
    
    // Check section headers
    expect(screen.getByText('📊 Data Source')).toBeInTheDocument();
    expect(screen.getByText('📚 Resources')).toBeInTheDocument();
    expect(screen.getByText('👥 Community')).toBeInTheDocument();
  });

  it('renders all links with correct attributes', () => {
    render(<Footer />);
    
    // Check DefiLlama link
    const defiLlamaLink = screen.getByText('DefiLlama');
    expect(defiLlamaLink).toHaveAttribute('href', 'https://defillama.com');
    expect(defiLlamaLink).toHaveAttribute('target', '_blank');
    expect(defiLlamaLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check Documentation link
    const docsLink = screen.getByText('Documentation');
    expect(docsLink).toHaveAttribute('href', 'https://docs.llama.fi');
    expect(docsLink).toHaveAttribute('target', '_blank');
    expect(docsLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check GitHub link
    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/DefiLlama');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check Twitter link
    const twitterLink = screen.getByText('Twitter');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/DefiLlama');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check Discord link
    const discordLink = screen.getByText('Discord');
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/buPFYXzFDd');
    expect(discordLink).toHaveAttribute('target', '_blank');
    expect(discordLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders copyright notice with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} DefiLlama Dashboard. All data is sourced from DefiLlama.`)).toBeInTheDocument();
  });
}); 