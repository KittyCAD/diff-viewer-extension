import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TokenForm } from './TokenForm';

it('renders a token form', () => {
  const service = "service"
  const onToken = jest.fn()
  render(<TokenForm service={service} onToken={onToken} />);
  expect(screen.getByText(`Enter a ${service} token`)).toBeInTheDocument();
  // TODO: add text field
  const button = screen.getByRole("button")
  expect(button).toBeEnabled()
  fireEvent.click(button)
  expect(onToken.mock.calls).toHaveLength(1)
});