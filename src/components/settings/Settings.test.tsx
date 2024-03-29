import { render, screen, waitFor } from '@testing-library/react'
import { Settings } from './Settings'

it('renders settings popup with both save buttons', async () => {
    render(<Settings />)

    // Waiting for loading
    await waitFor(() => screen.findByText(/github token/i))

    // GitHub and KittyCAD buttons
    // TODO: understand why screen.getByRole started to hang
    const buttons = screen.getAllByText('Save')
    expect(buttons[0]).toBeEnabled()
    expect(buttons[1]).toBeEnabled()
})
