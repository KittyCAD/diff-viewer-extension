import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  render(<App />);
  
  // Waiting for loading
  await waitFor(() => screen.findByText(/github token/i))
  
  // GitHub and KittyCAD buttons
  const buttons = screen.getAllByRole('button')
  expect(buttons[0]).toBeEnabled()
  expect(buttons[1]).toBeEnabled()
});
