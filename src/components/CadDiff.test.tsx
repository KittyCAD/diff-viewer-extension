import { render } from '@testing-library/react'
import { CadDiff } from './CadDiff'

it('renders the CAD diff element', () => {
    render(<CadDiff />)

    // TODO: find a way to add proper tests for ModelView,
    // seems non-trivial with the simulated DOM
    // Probably will have to go for end-to-end
})
