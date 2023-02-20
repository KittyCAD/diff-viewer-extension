import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  
  // Waiting for loading
  setTimeout(() => {
    const element = screen.getByText(/github token/i);
    expect(element).toBeInTheDocument();
  }, 2000);
});
