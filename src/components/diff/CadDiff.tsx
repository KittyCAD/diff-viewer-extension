import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, useTheme, Text } from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { BufferGeometry, Mesh } from 'three'
import { WireframeColors } from './WireframeModel'
import { Buffer } from 'buffer'

function Loader3D({ file, colors }: { file: string; colors: WireframeColors }) {
    const [geometry, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new OBJLoader()
        const buffer = Buffer.from(file, 'base64').toString()
        const group = loader.parse(buffer)
        console.log(`Model ${group.id} loaded`)
        console.log(group)
        const geometry = (group.children[0] as Mesh)?.geometry
        setGeometry(geometry)
    }, [file])
    return geometry ? (
        <Viewer3D geometry={geometry} colors={colors} />
    ) : (
        <Box p={3}>
            <Text>Sorry, the rich diff can't be displayed for this file.</Text>
        </Box>
    )
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
            {before && (
                <Box flexGrow={1} minWidth={0} backgroundColor="danger.subtle">
                    <Loader3D file={before} colors={beforeColors} />
                </Box>
            )}
            {after && (
                <Box
                    flexGrow={1}
                    minWidth={0}
                    backgroundColor="success.subtle"
                    borderLeftWidth={1}
                    borderLeftColor="border.default"
                    borderLeftStyle="solid"
                >
                    <Loader3D file={after} colors={afterColors} />
                </Box>
            )}
        </Box>
    )
}
