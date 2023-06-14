import { MutableRefObject, PropsWithChildren } from 'react'
import '@react-three/fiber'
import { BufferGeometry } from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { Camera } from './Camera'
import { Sphere } from 'three'
import { Controls } from './Controls'
import { OrbitControls } from 'three-stdlib'

type Viewer3DProps = {
    geometry: BufferGeometry
    boundingSphere?: Sphere
    controlsRef: MutableRefObject<OrbitControls | null>
    onControlsAltered?: () => void
}

export function Viewer3D({
    controlsRef,
    geometry,
    boundingSphere,
    onControlsAltered,
    children,
}: PropsWithChildren<Viewer3DProps>) {
    return (
        <Canvas dpr={[1, 2]} shadows>
            {children}
            <Controls
                target={boundingSphere?.center}
                reference={controlsRef}
                onAltered={onControlsAltered}
            />
            {geometry && <Camera boundingSphere={boundingSphere} />}
        </Canvas>
    )
}
