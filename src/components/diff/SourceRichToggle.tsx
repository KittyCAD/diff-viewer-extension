import { ButtonGroup, IconButton, Tooltip } from '@primer/react'
import { PackageIcon, CodeIcon } from '@primer/octicons-react'

export type SourceRichToggleProps = {
    disabled: boolean
    richSelected: boolean
    onSourceSelected?: () => void
    onRichSelected?: () => void
}

export function SourceRichToggle({
    disabled,
    richSelected,
    onSourceSelected,
    onRichSelected,
}: SourceRichToggleProps) {
    return (
        <ButtonGroup sx={{ float: 'right', mr: '-8px' }}>
            <Tooltip
                aria-label="Display the source diff"
                direction="w"
                sx={{ height: '32px' }}
            >
                <IconButton
                    aria-label="Display the source diff"
                    icon={CodeIcon}
                    disabled={disabled}
                    onClick={onSourceSelected}
                    sx={{
                        bg: !richSelected ? 'transparent' : 'neutral.subtle',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderRight: 'none',
                        color: 'fg.subtle',
                        width: '40px',
                    }}
                />
            </Tooltip>
            <Tooltip
                aria-label="Display the rich diff"
                direction="w"
                sx={{ height: '32px' }}
            >
                <IconButton
                    aria-label="Display the rich diff"
                    icon={PackageIcon}
                    disabled={disabled}
                    onClick={onRichSelected}
                    sx={{
                        bg: richSelected ? 'transparent' : 'neutral.subtle',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        color: 'fg.subtle',
                        width: '40px',
                    }}
                />
            </Tooltip>
        </ButtonGroup>
    )
}
