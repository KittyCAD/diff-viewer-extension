import { useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { BufferGeometry, DoubleSide } from 'three'
import { EdgesGeometry, Vector3 } from 'three'
import { calculateFovFactor } from './Camera'
import {
    Geometry,
    Base,
    Addition,
    Subtraction,
    Intersection,
    Difference,
} from '@react-three/csg'

export type WireframeColors = {
    face: string
    edge: string
    dashEdge: string
}

type Props = {
    cameraRef: MutableRefObject<any>
    beforeGeometry: BufferGeometry
    afterGeometry: BufferGeometry
    colors: WireframeColors
}

export function BeforeAfterModel({
    beforeGeometry,
    afterGeometry,
    cameraRef,
    colors,
}: Props) {
    const camera = useThree(state => state.camera)
    const canvasHeight = useThree(state => state.size.height)

    // Camera view
    useEffect(() => {
        if (beforeGeometry && cameraRef.current) {
            beforeGeometry.computeBoundingSphere()
            beforeGeometry.center()

            // move the camera away so the object fits in the view
            const { radius } = beforeGeometry.boundingSphere || { radius: 1 }
            if (!camera.position.length()) {
                const arbitraryNonZeroStartPosition = new Vector3(0.5, 0.5, 1)
                camera.position.copy(arbitraryNonZeroStartPosition)
            }
            const initialZoomOffset = 7.5
            camera.position.setLength(radius * initialZoomOffset)

            // set zoom for orthographic Camera
            const fov = 15 // TODO fov shouldn't be hardcoded
            const fovFactor = calculateFovFactor(fov, canvasHeight)
            camera.zoom = fovFactor / camera.position.length()
            camera.updateProjectionMatrix()
        }
    }, [beforeGeometry, camera, cameraRef, canvasHeight])

    return (
        <mesh castShadow receiveShadow>
            <Geometry useGroups>
                <Base geometry={beforeGeometry} position={[0, 0, 0]} scale={1}>
                    <meshPhongMaterial color={colors.face} />
                </Base>
                <Addition
                    geometry={afterGeometry}
                    position={[0, 0, 0]}
                    scale={1}
                >
                    <meshStandardMaterial color="skyblue" />
                </Addition>
            </Geometry>
        </mesh>
    )
}
