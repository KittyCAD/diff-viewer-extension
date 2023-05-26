import { Box, Text } from '@primer/react'
import React from 'react'
export type ErrorMessageProps = {
    message?: string
}

export function ErrorMessage({
    message,
}: ErrorMessageProps): React.ReactElement {
    return (
        <Box p={3}>
            <Text>
                {message ||
                    "Sorry, the rich diff can't be displayed for this file."}
            </Text>
        </Box>
    )
}
