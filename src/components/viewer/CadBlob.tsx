import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, Text, useTheme } from '@primer/react'
import { FileBlob } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { BufferGeometry, Sphere } from 'three'
import { WireframeColors, WireframeModel } from './WireframeModel'
import { useRef } from 'react'
import { loadGeometry } from '../../utils/three'
import { OrbitControls } from 'three-stdlib'
import { RecenterButton } from './RecenterButton'
import { ErrorMessage } from './ErrorMessage'

export function CadBlob({ blob }: FileBlob): React.ReactElement {
    const [geometry, setGeometry] = useState<BufferGeometry>()
    const [boundingSphere, setBoundingSphere] = useState<Sphere>()
    const controlsRef = useRef<OrbitControls | null>(null)
    const [controlsAltered, setControlsAltered] = useState(false)
    const { theme } = useTheme()
    const colors: WireframeColors = {
        face: theme?.colors.fg.default,
        edge: theme?.colors.fg.muted,
        dashEdge: theme?.colors.fg.subtle,
    }
    useEffect(() => {
        let geometry: BufferGeometry | undefined = undefined
        if (blob) {
            geometry = loadGeometry(blob)
            setGeometry(geometry)
            if (geometry && geometry.boundingSphere) {
                setBoundingSphere(geometry.boundingSphere)
            }
        }
    }, [blob])
    return (
        <>
            {geometry && (
                <Box position="relative">
                    <Box height={300} backgroundColor="canvas.subtle">
                        <Viewer3D
                            geometry={geometry}
                            boundingSphere={boundingSphere}
                            controlsRef={controlsRef}
                            onControlsAltered={() =>
                                !controlsAltered && setControlsAltered(true)
                            }
                        >
                            <WireframeModel
                                geometry={geometry}
                                boundingSphere={boundingSphere}
                                colors={colors}
                            />
                        </Viewer3D>
                    </Box>
                    {controlsAltered && (
                        <RecenterButton
                            onClick={() => {
                                controlsRef.current?.reset()
                                setControlsAltered(false)
                            }}
                        />
                    )}
                </Box>
            )}
            {!geometry && <ErrorMessage />}
        </>
    )
}
