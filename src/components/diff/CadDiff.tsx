import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, useTheme } from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { BufferGeometry, Mesh } from 'three'
import { WireframeColors } from './WireframeModel'

function Loader3D({ file, colors }: { file: string; colors: WireframeColors }) {
    const [geomety, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new OBJLoader()
        const buffer = window.atob(file)
        const group = loader.parse(buffer)
        console.log(`Model ${group.id} loaded`)
        const geometry = (group.children[0] as Mesh)?.geometry
        setGeometry(geometry)
    }, [file])
    return geomety ? <Viewer3D geometry={geomety} colors={colors} /> : null
}

export function CadDiff({ before, after }: FileDiff): React.ReactElement {
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
        <Box display="flex" height={300} overflow="hidden" minWidth={0}>
            <Box flexGrow={1} minWidth={0} backgroundColor="danger.subtle">
                {before && <Loader3D file={before} colors={beforeColors} />}
            </Box>
            <Box
                flexGrow={1}
                minWidth={0}
                backgroundColor="success.subtle"
                borderLeftWidth={1}
                borderLeftColor="border.default"
                borderLeftStyle="solid"
            >
                {after && <Loader3D file={after} colors={afterColors} />}
            </Box>
        </Box>
    )
}
