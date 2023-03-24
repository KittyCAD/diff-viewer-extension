import { fireEvent, render, screen } from '@testing-library/react'
import { SourceRichToggle } from './SourceRichToggle'

it('renders a source-rich diff toggle and checks its callbacks', async () => {
    const callbackSource = jest.fn()
    const callbackRich = jest.fn()

    render(
        <SourceRichToggle
            disabled={false}
            richSelected={true}
            onSourceSelected={callbackSource}
            onRichSelected={callbackRich}
        />
    )

    const [sourceButton, richButton] = await screen.findAllByRole('button')

    expect(callbackSource.mock.calls).toHaveLength(0)
    expect(callbackRich.mock.calls).toHaveLength(0)

    fireEvent.click(sourceButton)
    expect(callbackSource.mock.calls).toHaveLength(1)

    fireEvent.click(richButton)
    expect(callbackRich.mock.calls).toHaveLength(1)
})

it('renders a disbaled source-rich diff toggle', async () => {
    render(<SourceRichToggle disabled={true} richSelected={true} />)

    const [sourceButton, richButton] = await screen.findAllByRole('button')
    expect(sourceButton).toBeDisabled()
    expect(richButton).toBeDisabled()
})
