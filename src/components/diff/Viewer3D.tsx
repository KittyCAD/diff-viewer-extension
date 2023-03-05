import { useRef } from 'react'
import '@react-three/fiber'
import { BufferGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import { WireframeColors, WireframeModel } from './WireframeModel'
import { Camera } from './Camera'
import { CameraControls } from './CameraControls'

type Props = {
    geometry: BufferGeometry
    colors: WireframeColors
}

export function Viewer3D({ geometry, colors }: Props) {
    const cameraRef = useRef<any>()
    return (
        <Canvas dpr={[1, 2]} shadows>
            {typeof window !== 'undefined' && geometry && (
                <WireframeModel
                    geometry={geometry}
                    cameraRef={cameraRef}
                    colors={colors}
                />
            )}
            <CameraControls cameraRef={cameraRef} />
            {geometry && <Camera geometry={geometry} />}
        </Canvas>
    )
}
