import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { BufferGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import { Box, ThemeProvider, useTheme } from '@primer/react'
import { FileDiff } from '../chrome/types'

function ModelView({ file }: { file: string }): React.ReactElement {
    const { theme } = useTheme()
    const [geometry, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new STLLoader()
        const geometry = loader.parse(atob(file))
        console.log(`Model ${geometry.id} loaded`)
        setGeometry(geometry)
    }, [file])
    return (
        <Canvas>
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} />
            <mesh geometry={geometry}>
                <meshStandardMaterial color={theme?.colors.fg.default} />
            </mesh>
            <OrbitControls />
        </Canvas>
    )
}

export type CadDiffProps = FileDiff

export function CadDiff({ before, after }: CadDiffProps): React.ReactElement {
    return (
        <ThemeProvider colorMode="auto">
            <Box display="flex" height={300}>
                <Box flexGrow={1} backgroundColor="danger.subtle">
                    {before && <ModelView file={before} />}
                </Box>
                <Box
                    flexGrow={1}
                    backgroundColor="success.subtle"
                    borderLeftWidth={1}
                    borderLeftColor="border.default"
                    borderLeftStyle="solid"
                >
                    {after && <ModelView file={after} />}
                </Box>
            </Box>
        </ThemeProvider>
    )
}
