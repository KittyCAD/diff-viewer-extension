import { Box, Button, FormControl, TextInput } from '@primer/react'
import { useState, PropsWithChildren } from 'react'

export type TokenFormProps = {
    service: string
    onToken: (token: string) => void
}

export function TokenForm({
    service,
    onToken,
    children,
}: PropsWithChildren<TokenFormProps>) {
    const [token, setToken] = useState('')

    return (
        <Box>
            <FormControl required>
                <FormControl.Label>Enter a {service} token</FormControl.Label>
                <TextInput
                    alt="Text input for token"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                />
                {children}
            </FormControl>
            <Button sx={{ mt: 2 }} onClick={() => onToken(token)}>
                Save
            </Button>
        </Box>
    )
}
