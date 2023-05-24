import { DotFillIcon } from '@primer/octicons-react'
import { Box, Label, Text } from '@primer/react'
import { PropsWithChildren } from 'react'

export type LegendLabelProps = {
    text: string
    color: 'neutral' | 'danger' | 'success'
    enabled: boolean
    onChange?: (enabled: boolean) => void
}

export function LegendLabel({
    text,
    color,
    enabled,
    onChange,
}: LegendLabelProps): React.ReactElement {
    return (
        <Box py={1}>
            <Label
                onClick={() => onChange && onChange(!enabled)}
                sx={{
                    border: 'none',
                    backgroundColor: enabled
                        ? `${color}.subtle`
                        : 'transparent',
                    color: `${color}.muted`,
                    cursor: 'pointer',
                }}
            >
                <DotFillIcon size={16} />
                <Text color="fg.default">{text}</Text>
            </Label>
        </Box>
    )
}

export function LegendBox({ children }: PropsWithChildren): React.ReactElement {
    return (
        <Box
            position="absolute"
            top={2}
            left={2}
            p={2}
            backgroundColor="canvas.default"
            color="fg.muted"
        >
            {children}
        </Box>
    )
}
