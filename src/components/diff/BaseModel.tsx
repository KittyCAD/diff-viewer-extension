import { useThree } from '@react-three/fiber'
import type { MutableRefObject, PropsWithChildren } from 'react'
import { Suspense, useEffect, useRef } from 'react'
import { BufferGeometry } from 'three'
import { Vector3 } from 'three'
import { calculateFovFactor } from './Camera'

type BaseModelProps = {
    cameraRef: MutableRefObject<any>
    geometry: BufferGeometry
}

export function BaseModel({ geometry, cameraRef, children }: PropsWithChildren<BaseModelProps>) {
    const groupRef = useRef<any>()
    const camera = useThree(state => state.camera)
    const canvasHeight = useThree(state => state.size.height)

    // Camera view, adapted from KittyCAD/website
    useEffect(() => {
        if (geometry && cameraRef.current) {
            geometry.computeBoundingSphere()
            // TODO: understand the implications of this,
            // it's been disabled as it was causing before and after to be misaligned
            // geometry.center()

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

    return (
        <Suspense fallback={null}>
            <group ref={groupRef}>
                {children}
            </group>
        </Suspense>
    )
}
