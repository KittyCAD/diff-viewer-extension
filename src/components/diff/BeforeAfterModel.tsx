import { useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { useTheme } from '@primer/react'
import { useEffect } from 'react'
import { BufferGeometry } from 'three'
import { Vector3 } from 'three'
import { calculateFovFactor } from './Camera'
import {
    Geometry,
    Base,
    Subtraction,
    Intersection,
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
    const { theme } = useTheme()
    const commonColor = theme?.colors.fg.default
    const additionsColor = theme?.colors.success.default
    const deletionsColor = theme?.colors.danger.default

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
        <>
            <mesh>
                <Geometry>
                    <Base geometry={beforeGeometry}>
                        <meshBasicMaterial color={commonColor} />
                    </Base>
                    <Intersection geometry={afterGeometry} />
                </Geometry>
            </mesh>
            {/* Additions */}
            <mesh>
                <Geometry>
                    <Base geometry={afterGeometry}>
                        <meshBasicMaterial color={additionsColor} />
                    </Base>
                    <Subtraction geometry={beforeGeometry} />
                </Geometry>
            </mesh>
            {/* Deletions */}
            <mesh>
                <Geometry>
                    <Base geometry={beforeGeometry}>
                        <meshBasicMaterial color={deletionsColor} />
                    </Base>
                    <Subtraction geometry={afterGeometry} />
                </Geometry>
            </mesh>
        </>
    )
}
