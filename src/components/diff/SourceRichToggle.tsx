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
    const commonButtonSx = {
        color: 'fg.subtle',
        width: '40px',
    }
    const commonTooltipSx = {
        height: '32px',
    }
    const sourceText = 'Display the source diff'
    const richText = 'Display the rich diff'
    return (
        <ButtonGroup sx={{ float: 'right', mr: '-8px' }}>
            <Tooltip aria-label={sourceText} direction="w" sx={commonTooltipSx}>
                <IconButton
                    aria-label={sourceText}
                    icon={CodeIcon}
                    disabled={disabled}
                    onClick={onSourceSelected}
                    sx={{
                        ...commonButtonSx,
                        bg: !richSelected ? 'transparent' : 'neutral.subtle',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderRight: 'none',
                    }}
                />
            </Tooltip>
            <Tooltip aria-label={richText} direction="w" sx={commonTooltipSx}>
                <IconButton
                    aria-label={sourceText}
                    icon={PackageIcon}
                    disabled={disabled}
                    onClick={onRichSelected}
                    sx={{
                        ...commonButtonSx,
                        bg: richSelected ? 'transparent' : 'neutral.subtle',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}
                />
            </Tooltip>
        </ButtonGroup>
    )
}
