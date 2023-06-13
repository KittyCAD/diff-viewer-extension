import { useThree } from '@react-three/fiber'
import type { MutableRefObject, PropsWithChildren } from 'react'
import { Suspense, useEffect, useRef } from 'react'
import { Camera, Sphere } from 'three'
import { Vector3 } from 'three'

function calculateFovFactor(fov: number, canvasHeight: number): number {
    const pixelsFromCenterToTop = canvasHeight / 2
    // Only interested in the angle from the center to the top of frame
    const deg2Rad = Math.PI / 180
    const halfFovRadians = (fov * deg2Rad) / 2
    return pixelsFromCenterToTop / Math.tan(halfFovRadians)
}

type BaseModelProps = {
    cameraRef: MutableRefObject<any>
    boundingSphere: Sphere | null | undefined
}

export function BaseModel({
    boundingSphere,
    cameraRef,
    children,
}: PropsWithChildren<BaseModelProps>) {
    const groupRef = useRef<any>()
    const canvasHeight = useThree(state => state.size.height)

    // Camera view, adapted from KittyCAD/website
    useEffect(() => {
        if (boundingSphere && cameraRef.current) {
            const camera = cameraRef.current
            // move the camera away so the object fits in the view
            const { radius } = boundingSphere || { radius: 1 }
            if (!camera.position.length()) {
                const arbitraryNonZeroStartPosition = new Vector3(0.5, 0.5, 1)
                camera.position.copy(arbitraryNonZeroStartPosition)
            }
            const initialZoomOffset = 7.5 // TODO: understand why we have this value
            camera.position.setLength(radius * initialZoomOffset)

            // set zoom for orthographic Camera
            const fov = 15 // TODO fov shouldn't be hardcoded
            const fovFactor = calculateFovFactor(fov, canvasHeight)
            camera.zoom = fovFactor / camera.position.length()
            camera.updateProjectionMatrix()
        }
    }, [boundingSphere, cameraRef, canvasHeight])

    return (
        <Suspense fallback={null}>
            <group ref={groupRef}>{children}</group>
        </Suspense>
    )
}
