import { MutableRefObject, PropsWithChildren } from 'react'
import '@react-three/fiber'
import { BufferGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import { Camera } from './Camera'
import { CameraControls } from './CameraControls'

type Viewer3DProps = {
    cameraRef: MutableRefObject<any>
    geometry: BufferGeometry
}

export function Viewer3D({ cameraRef, geometry, children }: PropsWithChildren<Viewer3DProps>) {
    return (
        <Canvas dpr={[1, 2]} shadows>
            {typeof window !== 'undefined' && children}
            <CameraControls cameraRef={cameraRef} />
            {geometry && <Camera geometry={geometry} />}
        </Canvas>
    )
}
