import { Box, Spinner } from '@primer/react'

export function Loading() {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-around">
            <Box display="block" py={4}>
                <Spinner size="large" />
            </Box>
        </Box>
    )
}
