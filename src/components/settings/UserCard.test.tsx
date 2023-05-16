import { fireEvent, render, screen } from '@testing-library/react'
import { UserCard } from './UserCard'
import { vi } from 'vitest'

it('renders a user card and checks its callback button', () => {
    const login = 'login'
    const avatar = 'avatar'
    const callback = vi.fn()

    render(
        <UserCard
            login={login}
            avatar={avatar}
            serviceAvatar="https://avatars.githubusercontent.com/github"
            onSignOut={callback}
        />
    )
    expect(screen.getByText(login)).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(2)

    const button = screen.getByRole('button')
    expect(button).toBeEnabled()

    expect(callback.mock.calls).toHaveLength(0)
    fireEvent.click(button)
    expect(callback.mock.calls).toHaveLength(1)
})
