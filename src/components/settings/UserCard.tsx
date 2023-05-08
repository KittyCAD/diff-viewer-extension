import { Avatar, AvatarPair, Box, Button, Text } from '@primer/react'

export type UserCardProps = {
    login: string
    avatar: string
    serviceAvatar: string
    onSignOut: () => void
}

export function UserCard({
    login,
    avatar,
    serviceAvatar,
    onSignOut,
}: UserCardProps) {
    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <AvatarPair>
                    <Avatar src={avatar} />
                    <Avatar src={serviceAvatar} />
                </AvatarPair>
                <Box flexGrow={1} pl={3}>
                    <Text color="fg.default" fontSize={20} fontWeight={500}>
                        {login}
                    </Text>
                </Box>
            </Box>
            <Button onClick={onSignOut}>Sign out</Button>
        </Box>
    )
}
