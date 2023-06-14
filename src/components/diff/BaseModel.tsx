import { useThree } from '@react-three/fiber'
import type { MutableRefObject, PropsWithChildren } from 'react'
import { Suspense, useEffect, useRef } from 'react'
import { Sphere } from 'three'
import { Vector3 } from 'three'
import { calculateFovFactor } from './Camera'

type BaseModelProps = {
    boundingSphere: Sphere | null | undefined
}

export function BaseModel({
    boundingSphere,
    children,
}: PropsWithChildren<BaseModelProps>) {
    const camera = useThree(state => state.camera)
    const controls = useThree(state => state.controls) as any // TODO: fix type
    const canvasHeight = useThree(state => state.size.height)

    // Camera view, adapted from KittyCAD/website
    useEffect(() => {
        if (boundingSphere && camera && controls && canvasHeight) {
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
            controls.saveState()
        }
    }, [boundingSphere, camera, controls, canvasHeight])

    return (
        <Suspense fallback={null}>
            <group>{children}</group>
        </Suspense>
    )
}
