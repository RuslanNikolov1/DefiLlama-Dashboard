import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartSkeleton, TableSkeleton } from './Skeletons';

describe('Skeleton Components', () => {
  describe('ChartSkeleton', () => {
    it('renders chart skeleton with correct structure', () => {
      render(<ChartSkeleton />);
      
      // Check if the container is rendered
      const container = screen.getByTestId('chart-skeleton');
      expect(container).toBeInTheDocument();
      
      // Check if the title placeholder is rendered
      const titlePlaceholder = container?.firstChild as HTMLElement;
      expect(titlePlaceholder).toHaveStyle({
        height: '20px',
        width: '200px',
        marginBottom: '1rem',
      });
    });

    it('applies shimmer animation styles', () => {
      render(<ChartSkeleton />);
      
      const elements = document.querySelectorAll('.chartContainer > div');
      elements.forEach(element => {
        expect(element).toHaveStyle({
          background: 'linear-gradient(90deg, #2a2a3d 25%, #3a3a4d 50%, #2a2a3d 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        });
      });
    });
  });

  describe('TableSkeleton', () => {
    it('renders table skeleton with correct structure', () => {
      render(<TableSkeleton />);
      
      // Check if the container is rendered
      const container = screen.getByTestId('table-skeleton');
      expect(container).toBeInTheDocument();
    });

    it('applies shimmer animation styles to all cells', () => {
      render(<TableSkeleton />);
      
      const cells = document.querySelectorAll('td');
      cells.forEach(cell => {
        expect(cell).toHaveStyle({
          height: '40px',
          background: 'linear-gradient(90deg, #2a2a3d 25%, #3a3a4d 50%, #2a2a3d 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        });
      });
    });

    it('applies shimmer animation styles to header cells', () => {
      render(<TableSkeleton />);
      
      const headerCells = document.querySelectorAll('th');
      headerCells.forEach(cell => {
        expect(cell).toHaveStyle({
          height: '40px',
          background: 'linear-gradient(90deg, #2a2a3d 25%, #3a3a4d 50%, #2a2a3d 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        });
      });
    });
  });
}); 