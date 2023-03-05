import { fireEvent, render, screen } from '@testing-library/react'
import { TokenForm } from './TokenForm'

it('renders a token form and checks its callback', () => {
    const service = 'service'
    const token = 'token'
    const callback = jest.fn()

    render(<TokenForm service={service} onToken={callback} />)
    expect(screen.getByText(`Enter a ${service} token`)).toBeInTheDocument()

    const field = screen.getByRole('textbox')
    fireEvent.change(field, { target: { value: token } })

    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
    fireEvent.click(button)

    expect(callback.mock.calls).toHaveLength(1)
    expect(callback.mock.lastCall[0]).toEqual(token)
})
