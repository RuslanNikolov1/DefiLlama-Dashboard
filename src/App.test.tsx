import React from 'react';
import { render } from '@testing-library/react';
import AppWithProviders from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AppWithProviders />
      </MemoryRouter>
    );
  });
}); 