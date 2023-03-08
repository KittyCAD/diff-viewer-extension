import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, ThemeProvider, useTheme } from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { BufferGeometry } from 'three'
import { WireframeColors } from './WireframeModel'

type ViewerSTLProps = {
    file: string
    colors: WireframeColors
}

function ViewerSTL({ file, colors }: ViewerSTLProps) {
    const [geomety, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new STLLoader()
        const buffer = window.atob(file)
        const geometry = loader.parse(buffer)
        console.log(`Model ${geometry.id} loaded`)
        setGeometry(geometry)
    }, [file])
    return geomety ? <Viewer3D geometry={geomety} colors={colors} /> : null
}

type CadDiffThemedProps = FileDiff

function CadDiffInternals({
    before,
    after,
}: CadDiffThemedProps): React.ReactElement {
    const { theme } = useTheme()
    const beforeColors: WireframeColors = {
        face: theme?.colors.fg.default,
        edge: theme?.colors.danger.muted,
        dashEdge: theme?.colors.danger.subtle,
    }
    const afterColors: WireframeColors = {
        face: theme?.colors.fg.default,
        edge: theme?.colors.success.muted,
        dashEdge: theme?.colors.success.subtle,
    }
    return (
        <Box display="flex" height={300}>
            <Box flexGrow={1} backgroundColor="danger.subtle">
                {before && <ViewerSTL file={before} colors={beforeColors} />}
            </Box>
            <Box
                flexGrow={1}
                backgroundColor="success.subtle"
                borderLeftWidth={1}
                borderLeftColor="border.default"
                borderLeftStyle="solid"
            >
                {after && <ViewerSTL file={after} colors={afterColors} />}
            </Box>
        </Box>
    )
}

export type CadDiffProps = FileDiff

export function CadDiff({ before, after }: CadDiffProps): React.ReactElement {
    return (
        <ThemeProvider colorMode="auto">
            <CadDiffInternals before={before} after={after} />
        </ThemeProvider>
    )
}
