import { useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { BufferGeometry, DoubleSide } from 'three'
import { EdgesGeometry, Vector3 } from 'three'
import { calculateFovFactor } from './Camera'
import { Geometry, Base, Addition, Subtraction, Intersection, Difference } from '@react-three/csg'

export type WireframeColors = {
    face: string
    edge: string
    dashEdge: string
}

type Props = {
    cameraRef: MutableRefObject<any>
    geometry: BufferGeometry
    colors: WireframeColors
}

export function WireframeModel({ geometry, cameraRef, colors }: Props) {
    const groupRef = useRef<any>()
    const camera = useThree(state => state.camera)
    const canvasHeight = useThree(state => state.size.height)

    // Camera view
    useEffect(() => {
        if (geometry && cameraRef.current) {
            geometry.computeBoundingSphere()
            geometry.center()

            // move the camera away so the object fits in the view
            const { radius } = geometry.boundingSphere || { radius: 1 }
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
    }, [geometry, camera, cameraRef, canvasHeight])

    // Edges for wireframe
    const edgeThresholdAngle = 10
    const edges = useMemo(
        () => new EdgesGeometry(geometry.center(), edgeThresholdAngle),
        [geometry]
    )

    return (
        <Suspense fallback={null}>
            <group ref={groupRef}>
                <mesh
                    castShadow={true}
                    receiveShadow={true}
                    geometry={geometry}
                >
                    <meshBasicMaterial
                        color={colors.face}
                        side={DoubleSide}
                        depthTest={true}
                    />
                </mesh>
                <lineSegments
                    geometry={edges}
                    renderOrder={100}
                    onUpdate={line => line.computeLineDistances()}
                >
                    <lineDashedMaterial
                        color={colors.dashEdge}
                        dashSize={5}
                        gapSize={4}
                        scale={40}
                        depthTest={false}
                    />
                </lineSegments>
                <lineSegments geometry={edges} renderOrder={100}>
                    <lineBasicMaterial color={colors.edge} depthTest={true} />
                </lineSegments>
            </group>
        </Suspense>
    )
}
