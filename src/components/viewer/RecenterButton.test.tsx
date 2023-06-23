import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { RecenterButton } from './RecenterButton'

it('renders the recenter button', async () => {
    const callback = vi.fn()
    render(<RecenterButton onClick={callback} />)
    const button = await screen.findByRole('button')
    expect(callback.mock.calls).toHaveLength(0)
    fireEvent.click(button)
    expect(callback.mock.calls).toHaveLength(1)
})
