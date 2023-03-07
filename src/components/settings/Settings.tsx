import { Box, ThemeProvider } from '@primer/react'
import { useEffect, useState } from 'react'
import { KittycadUser, MessageIds, User } from '../../chrome/types'
import { Loading } from '../Loading'
import { TokenForm } from './TokenForm'
import { UserCard } from './UserCard'

export function Settings() {
    const [githubUser, setGithubUser] = useState<User>()
    const [kittycadUser, setKittycadUser] = useState<KittycadUser>()
    const [firstInitDone, setFirstInitDone] = useState(false)

    async function fetchGithubUser() {
        try {
            const response = await chrome.runtime.sendMessage({
                id: MessageIds.GetGithubUser,
            })
            if (Object.keys(response).length === 0) throw Error('no response')
            const user = response as User
            setGithubUser(user)
        } catch (e) {
            console.error(e)
            setGithubUser(undefined)
        }
    }

    async function fetchKittycadUser() {
        try {
            const response = await chrome.runtime.sendMessage({
                id: MessageIds.GetKittycadUser,
            })
            if (Object.keys(response).length === 0) throw Error('no response')
            const user = response as KittycadUser
            if (!user.email) throw Error('empty user account')
            setKittycadUser(user)
        } catch (e) {
            console.error(e)
            setKittycadUser(undefined)
        }
    }

    async function onToken(id: MessageIds, token: string) {
        await chrome.runtime.sendMessage({ id, data: { token } })
    }

    useEffect(() => {
        ;(async () => {
            await fetchGithubUser()
            await fetchKittycadUser()
            setFirstInitDone(true)
        })()
    }, [])

    return (
        <ThemeProvider colorMode="auto">
            <Box backgroundColor="canvas.default" width={300} p={4}>
                {firstInitDone ? (
                    <Box>
                        <Box>
                            {githubUser ? (
                                <UserCard
                                    login={'@' + githubUser.login}
                                    avatar={githubUser.avatar_url}
                                    onSignOut={async () => {
                                        await onToken(
                                            MessageIds.SaveGithubToken,
                                            ''
                                        )
                                        setGithubUser(undefined)
                                    }}
                                />
                            ) : (
                                <TokenForm
                                    service="GitHub"
                                    onToken={async (token: string) => {
                                        await onToken(
                                            MessageIds.SaveGithubToken,
                                            token
                                        )
                                        await fetchGithubUser()
                                    }}
                                />
                            )}
                        </Box>
                        <Box mt={4}>
                            {kittycadUser ? (
                                <UserCard
                                    login={kittycadUser.email}
                                    avatar={
                                        kittycadUser.image ||
                                        'https://kittycad.io/logo-green.png'
                                    }
                                    onSignOut={async () => {
                                        await onToken(
                                            MessageIds.SaveKittycadToken,
                                            ''
                                        )
                                        setKittycadUser(undefined)
                                    }}
                                />
                            ) : (
                                <TokenForm
                                    service="KittyCAD"
                                    onToken={async (token: string) => {
                                        await onToken(
                                            MessageIds.SaveKittycadToken,
                                            token
                                        )
                                        await fetchKittycadUser()
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Loading />
                )}
            </Box>
        </ThemeProvider>
    )
}
