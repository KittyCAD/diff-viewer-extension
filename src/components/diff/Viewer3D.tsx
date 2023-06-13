import { MutableRefObject, PropsWithChildren } from 'react'
import '@react-three/fiber'
import { BufferGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import { Camera } from './Camera'
import { CameraControls } from './CameraControls'
import { Sphere } from 'three'

type Viewer3DProps = {
    cameraRef: MutableRefObject<any>
    geometry: BufferGeometry
    boundingSphere?: Sphere
}

export function Viewer3D({
    cameraRef,
    geometry,
    boundingSphere,
    children,
}: PropsWithChildren<Viewer3DProps>) {
    return (
        <Canvas dpr={[1, 2]} shadows>
            {children}
            <CameraControls
                cameraRef={cameraRef}
                target={boundingSphere?.center}
            />
            {geometry && (
                <Camera cameraRef={cameraRef} boundingSphere={boundingSphere} />
            )}
        </Canvas>
    )
}
