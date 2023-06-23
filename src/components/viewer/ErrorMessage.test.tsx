import { render, screen } from '@testing-library/react'
import { ErrorMessage } from './ErrorMessage'

it('renders the error message', async () => {
    render(<ErrorMessage />)
    const text = await screen.findByText(/preview/)
    expect(text).toBeDefined()
})

it('renders the error message with a custom message', async () => {
    render(<ErrorMessage message="custom" />)
    const text = await screen.findByText(/custom/)
    expect(text).toBeDefined()
})
