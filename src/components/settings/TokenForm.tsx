import { Box, Button, FormControl, TextInput } from '@primer/react'
import { useState, PropsWithChildren } from 'react'

export type TokenFormProps = {
    service: string
    loading: boolean
    onToken: (token: string) => void
}

export function TokenForm({
    service,
    loading,
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
                    loading={loading}
                    onChange={e => setToken(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && onToken(token)}
                />
                {children}
            </FormControl>
            <Button sx={{ mt: 2 }} onClick={() => onToken(token)}>
                Save
            </Button>
        </Box>
    )
}
