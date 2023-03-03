import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BufferGeometry, Vector3 } from 'three/src/Three'

interface Props {
    geometry: BufferGeometry
}

export default function OrthoPerspectiveCamera({ geometry }: Props) {
    const fov = 15
    const isOrthoCamera = true
    const persRef = useRef<any>(null)
    const orthoRef = useRef<any>(null)
    const canvasHeight = useThree(state => state.size.height)
    const [isFirstRender, setIsFirstRender] = useState(true)

    useLayoutEffect(() => {
        const fovFactor = calculateFovFactor(fov, canvasHeight)
        if (!persRef.current || !orthoRef.current) return
        if (isFirstRender) {
            setIsFirstRender(false)
            return
        }
        setTimeout(() => {
            if (!isOrthoCamera) {
                persRef.current.position.copy(orthoRef.current.position.clone())
                const distance = fovFactor / orthoRef.current.zoom
                persRef.current.position.setLength(distance)
            } else {
                orthoRef.current.position.copy(persRef.current.position.clone())
                orthoRef.current.zoom =
                    fovFactor / orthoRef.current.position.length()
                orthoRef.current.updateProjectionMatrix()
            }
        })
    }, [isOrthoCamera]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <PerspectiveCamera
                ref={persRef}
                makeDefault={!isOrthoCamera}
                fov={fov}
            >
                <CameraLighting geometry={geometry} />
            </PerspectiveCamera>
            <OrthographicCamera ref={orthoRef} makeDefault={isOrthoCamera}>
                <CameraLighting geometry={geometry} />
            </OrthographicCamera>
        </>
    )
}

function CameraLighting({ geometry }: Props) {
    const { shadowSpotPosition, angle, intensity } = {
        shadowSpotPosition: new Vector3(20, 20, 5),
        angle: 8,
        intensity: 4,
    }
    const lightFromCamera = {
        showHelper: false,
        position: [0, 0, 0],
        angle: 0.8,
        intensity: 1.8,
    }
    const ref = useRef<any>()
    const ref2 = useRef<any>()
    useEffect(() => {
        if (geometry && ref.current) {
            geometry.computeBoundingSphere()
            const { radius } = geometry.boundingSphere || { radius: 1 }
            // move spot light away relative to the object's size
            ref.current.position.setLength(radius * 15)
        }
    }, [geometry])
    return (
        <>
            <spotLight
                ref={ref}
                position={shadowSpotPosition}
                angle={(angle * Math.PI) / 180}
                intensity={intensity}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadowCameraNear={1}
            />
            <spotLight
                ref={ref2}
                position={[0, 0, 0]}
                angle={lightFromCamera.angle}
                intensity={lightFromCamera.intensity}
            />
        </>
    )
}

export function calculateFovFactor(fov: number, canvasHeight: number): number {
    const pixelsFromCenterToTop = canvasHeight / 2
    // Only interested in the angle from the center to the top of frame
    const deg2Rad = Math.PI / 180
    const halfFovRadians = (fov * deg2Rad) / 2
    return pixelsFromCenterToTop / Math.tan(halfFovRadians)
}
