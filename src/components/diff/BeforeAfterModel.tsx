import { useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { useTheme } from '@primer/react'
import { useEffect } from 'react'
import { BufferGeometry } from 'three'
import { Vector3 } from 'three'
import { calculateFovFactor } from './Camera'
import { Geometry, Base, Subtraction, Intersection } from '@react-three/csg'

type Props = {
    cameraRef: MutableRefObject<any>
    beforeGeometry: BufferGeometry
    afterGeometry: BufferGeometry
}

export function BeforeAfterModel({
    beforeGeometry,
    afterGeometry,
    cameraRef,
}: Props) {
    const camera = useThree(state => state.camera)
    const canvasHeight = useThree(state => state.size.height)
    const { theme } = useTheme()
    const commonColor = theme?.colors.fg.default
    const additionsColor = theme?.colors.success.fg
    const deletionsColor = theme?.colors.danger.fg

    // Camera view
    useEffect(() => {
        if (beforeGeometry && cameraRef.current) {
            beforeGeometry.computeBoundingSphere()
            // TODO: understand the implications of this,
            // it's been disabled as it was causing before and after to be misaligned
            // beforeGeometry.center()

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
            {/* Unchanged */}
            <mesh>
                <meshPhongMaterial color={commonColor} transparent opacity={0.95}/>
                <Geometry>
                    <Base geometry={beforeGeometry} />
                    <Intersection geometry={afterGeometry} />
                </Geometry>
            </mesh>
            {/* Additions */}
            <mesh>
                <meshPhongMaterial color={additionsColor} />
                <Geometry>
                    <Base geometry={afterGeometry} />
                    <Subtraction geometry={beforeGeometry} />
                </Geometry>
            </mesh>
            {/* Deletions */}
            <mesh>
                <meshPhongMaterial color={deletionsColor} />
                <Geometry>
                    <Base geometry={beforeGeometry} />
                    <Subtraction geometry={afterGeometry} />
                </Geometry>
            </mesh>
        </>
    )
}
