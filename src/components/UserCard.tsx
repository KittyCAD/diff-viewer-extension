import { Avatar, Box, Button, Text } from "@primer/react"

export type UserCardProps = {
  login: string
  avatar: string
  onSignOut: () => void
}

export function UserCard({ login, avatar, onSignOut }: UserCardProps) {
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar src={avatar} size={32} />
        <Box flexGrow={1} pl={2}>
          <Text color="fg.default" fontSize={20}>
            {login}
          </Text>
        </Box>
      </Box>
      <Button onClick={onSignOut}>Sign out</Button>
    </Box>
  )
}
