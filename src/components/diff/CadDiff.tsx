import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, useTheme, Text } from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { BufferGeometry, Mesh } from 'three'
import { WireframeColors } from './WireframeModel'
import { Buffer } from 'buffer'
import { Canvas } from '@react-three/fiber'
import { Camera } from './Camera'
import { CameraControls } from './CameraControls'
import { useRef } from 'react'
import { BeforeAfterModel } from './BeforeAfterModel'

function loadGeometry(file: string): BufferGeometry {
    const loader = new OBJLoader()
    const buffer = Buffer.from(file, 'base64').toString()
    const group = loader.parse(buffer)
    console.log(`Model ${group.id} loaded`)
    return (group.children[0] as Mesh)?.geometry
}

function Loader3DDiff({ before, after, colors }: { before: string; after: string; colors: WireframeColors }) {
    const [beforeGeometry, setBeforeGeometry] = useState<BufferGeometry>()
    const [afterGeometry, setAfterGeometry] = useState<BufferGeometry>()
    const cameraRef = useRef<any>()
    useEffect(() => {
        setBeforeGeometry(loadGeometry(before))
    }, [before])
    useEffect(() => {
        setAfterGeometry(loadGeometry(after))
    }, [after])
    return (beforeGeometry && afterGeometry) ? (
        <Canvas dpr={[1, 2]} shadows>
            {typeof window !== 'undefined' && beforeGeometry && (
                <BeforeAfterModel
                    beforeGeometry={beforeGeometry}
                    afterGeometry={afterGeometry}
                    cameraRef={cameraRef}
                    colors={colors}
                />
            )}
            <CameraControls cameraRef={cameraRef} />
            {beforeGeometry && <Camera geometry={beforeGeometry} />}
        </Canvas>
    ) : (
        <Box p={3}>
            <Text>Sorry, the rich diff can't be displayed for this file.</Text>
        </Box>
    )
}

function Loader3D({ file, colors }: { file: string; colors: WireframeColors }) {
    const [geometry, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new OBJLoader()
        const buffer = Buffer.from(file, 'base64').toString()
        const group = loader.parse(buffer)
        console.log(`Model ${group.id} loaded`)
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
    const sideBySideEnabled = false 
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
            {!sideBySideEnabled && before && after &&
                <Loader3DDiff before={before} after={after} colors={beforeColors} />
            }
            {sideBySideEnabled && before && (
                <Box flexGrow={1} minWidth={0} backgroundColor="danger.subtle">
                    <Loader3D file={before} colors={beforeColors} />
                </Box>
            )}
            {sideBySideEnabled && after && (
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
