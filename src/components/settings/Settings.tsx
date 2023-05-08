import {
    Box,
    Details,
    FormControl,
    Link,
    Text,
    ThemeProvider,
    useDetails,
} from '@primer/react'
import { PropsWithChildren, useEffect, useState } from 'react'
import { KittycadUser, MessageIds, User } from '../../chrome/types'
import { Loading } from '../Loading'
import { TokenForm } from './TokenForm'
import { UserCard } from './UserCard'
import { createAvatar } from '@dicebear/avatars'
import * as avatarStyles from '@dicebear/avatars-bottts-sprites'

function BaseHelper({ children }: PropsWithChildren<{}>) {
    const { getDetailsProps, open } = useDetails({ closeOnOutsideClick: true })
    return (
        <Details {...getDetailsProps()}>
            <Box as="summary" sx={{ cursor: 'pointer' }}>
                {!open && <FormControl.Caption>Need help?</FormControl.Caption>}
            </Box>
            <Text color="fg.muted" as="ol" fontSize={12} px={3} py={0}>
                {children}
            </Text>
        </Details>
    )
}

function GithubHelper() {
    return (
        <BaseHelper>
            <li>
                Open{' '}
                <Link
                    href="https://github.com/settings/tokens/new?scopes=repo&description=KittyCAD"
                    target="_blank"
                >
                    this link
                </Link>
            </li>
            <li>Click on 'Generate token'</li>
            <li>Copy the provided token</li>
            <li>Paste it in the input above</li>
        </BaseHelper>
    )
}

function KittycadHelper() {
    return (
        <BaseHelper>
            <li>
                Open{' '}
                <Link
                    href="https://kittycad.io/account/api-tokens"
                    target="_blank"
                >
                    this link
                </Link>
            </li>
            <li>Click on 'Generate an API token'</li>
            <li>Copy the provided token</li>
            <li>Paste it in the input above</li>
        </BaseHelper>
    )
}

export function Settings() {
    const [githubUser, setGithubUser] = useState<User>()
    const [kittycadUser, setKittycadUser] = useState<KittycadUser>()
    const [firstInitDone, setFirstInitDone] = useState(false)

    async function fetchGithubUser() {
        try {
            const response = await chrome.runtime.sendMessage({
                id: MessageIds.GetGithubUser,
            })
            if ('error' in response) throw response.error
            setGithubUser(response as User)
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
            if ('error' in response) throw response.error
            setKittycadUser(response as KittycadUser)
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
                                    serviceAvatar="https://avatars.githubusercontent.com/github"
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
                                >
                                    <GithubHelper />
                                </TokenForm>
                            )}
                        </Box>
                        <Box mt={4}>
                            {kittycadUser ? (
                                <UserCard
                                    login={kittycadUser.email}
                                    avatar={
                                        kittycadUser.image ||
                                        createAvatar(avatarStyles, {
                                            seed:
                                                kittycadUser?.email ||
                                                'some-seed',
                                            dataUri: true,
                                        })
                                    }
                                    serviceAvatar="https://avatars.githubusercontent.com/kittycad"
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
                                >
                                    <KittycadHelper />
                                </TokenForm>
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
