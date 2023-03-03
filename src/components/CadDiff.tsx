import React, { useEffect, useRef, useState } from 'react'
import '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { BufferGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import { Box, ThemeProvider } from '@primer/react'
import { FileDiff } from '../chrome/types'
import CameraControls from './Viewer3D/CameraControls'
import OrthoPerspectiveCamera from './Viewer3D/OrthoPerspectiveCamera'
import Model from './Viewer3D/Model'

function Viewer3D({ file }: { file: string }) {
    const newCameraRef = useRef<any>()
    const [geometry, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new STLLoader()
        const geometry = loader.parse(atob(file))
        console.log(`Model ${geometry.id} loaded`)
        setGeometry(geometry)
    }, [file])
    return (
        <Canvas dpr={[1, 2]} shadows>
            {typeof window !== 'undefined' && geometry && (
                <Model
                    geometry={geometry}
                    cameraRef={newCameraRef}
                    metadata={undefined}
                />
            )}
            <CameraControls cameraRef={newCameraRef} />
            {geometry && <OrthoPerspectiveCamera geometry={geometry} />}
        </Canvas>
    )
}

export type CadDiffProps = FileDiff

export function CadDiff({ before, after }: CadDiffProps): React.ReactElement {
    return (
        <ThemeProvider colorMode="auto">
            <Box display="flex" height={300}>
                <Box flexGrow={1} backgroundColor="danger.subtle">
                    {before && <Viewer3D file={before} />}
                </Box>
                <Box
                    flexGrow={1}
                    backgroundColor="success.subtle"
                    borderLeftWidth={1}
                    borderLeftColor="border.default"
                    borderLeftStyle="solid"
                >
                    {after && <Viewer3D file={after} />}
                </Box>
            </Box>
        </ThemeProvider>
    )
}
