import { Box, BranchName, Button, FormControl, TextInput } from '@primer/react'
import { useState } from 'react'

export type TokenFormProps = {
    service: string
    onToken: (token: string) => void
}

export function TokenForm({ service, onToken }: TokenFormProps) {
    const [token, setToken] = useState('')

    return (
        <Box>
            <FormControl required>
                <FormControl.Label>Enter a {service} token</FormControl.Label>
                <TextInput
                    value={token}
                    onChange={e => setToken(e.target.value)}
                />
                {service === 'GitHub' && (
                    <FormControl.Caption>
                        With <BranchName>repo</BranchName> permissions
                    </FormControl.Caption>
                )}
            </FormControl>
            <Button sx={{ mt: 2 }} onClick={() => onToken(token)}>
                Save
            </Button>
        </Box>
    )
}
