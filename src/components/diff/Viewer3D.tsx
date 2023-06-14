import { MutableRefObject, PropsWithChildren } from 'react'
import '@react-three/fiber'
import { BufferGeometry } from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { Camera } from './Camera'
import { Sphere } from 'three'
import { Controls } from './Controls'
import { OrbitControls } from 'three-stdlib'

type Viewer3DProps = {
    controlsRef: MutableRefObject<OrbitControls | null>
    geometry: BufferGeometry
    boundingSphere?: Sphere
}

export function Viewer3D({
    controlsRef,
    geometry,
    boundingSphere,
    children,
}: PropsWithChildren<Viewer3DProps>) {
    return (
        <Canvas dpr={[1, 2]} shadows>
            {children}
            <Controls
                controlsRef={controlsRef}
                target={boundingSphere?.center}
            />
            {geometry && (
                <Camera boundingSphere={boundingSphere} />
            )}
        </Canvas>
    )
}
