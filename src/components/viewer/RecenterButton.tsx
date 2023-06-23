import { Box, Button } from '@primer/react'

export function RecenterButton({ onClick }: { onClick: () => void }) {
    return (
        <Box top={2} right={2} position="absolute">
            <Button onClick={onClick}>Recenter</Button>
        </Box>
    )
}
