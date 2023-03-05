import React from 'react'
import '@react-three/fiber'
import { Box, ThemeProvider, useTheme } from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { ViewerSTL } from './ViewerSTL'

type CadDiffThemedProps = FileDiff

function CadDiffThemed({
    before,
    after,
}: CadDiffThemedProps): React.ReactElement {
    const { theme } = useTheme()
    const faceColor = theme?.colors.fg.default
    return (
        <Box display="flex" height={300}>
            <Box flexGrow={1} backgroundColor="danger.subtle">
                {before && (
                    <ViewerSTL
                        file={before}
                        faceColor={faceColor}
                        edgeColor={theme?.colors.danger.muted}
                        dashEdgeColor={theme?.colors.danger.subtle}
                    />
                )}
            </Box>
            <Box
                flexGrow={1}
                backgroundColor="success.subtle"
                borderLeftWidth={1}
                borderLeftColor="border.default"
                borderLeftStyle="solid"
            >
                {after && (
                    <ViewerSTL
                        file={after}
                        faceColor={faceColor}
                        edgeColor={theme?.colors.success.muted}
                        dashEdgeColor={theme?.colors.success.subtle}
                    />
                )}
            </Box>
        </Box>
    )
}

export type CadDiffProps = FileDiff

export function CadDiff({ before, after }: CadDiffProps): React.ReactElement {
    return (
        <ThemeProvider colorMode="auto">
            <CadDiffThemed before={before} after={after} />
        </ThemeProvider>
    )
}
