import { OrthographicCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BufferGeometry } from 'three'

function CameraLighting({ geometry }: Props) {
    const ref1 = useRef<any>()
    const ref2 = useRef<any>()
    useEffect(() => {
        if (geometry && ref1.current) {
            geometry.computeBoundingSphere()
            const { radius } = geometry.boundingSphere || { radius: 1 }
            // move spot light away relative to the object's size
            ref1.current.position.setLength(radius * 15)
        }
    }, [geometry])
    return (
        <>
            <spotLight
                ref={ref1}
                position={[20, 20, 5]}
                angle={(8 * Math.PI) / 180}
                intensity={4}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadowCameraNear={1}
            />
            <spotLight
                ref={ref2}
                position={[0, 0, 0]}
                angle={0.8}
                intensity={1.8}
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

type Props = {
    geometry: BufferGeometry
}

export function Camera({ geometry }: Props) {
    const fov = 15
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
            orthoRef.current.position.copy(persRef.current.position.clone())
            orthoRef.current.zoom =
                fovFactor / orthoRef.current.position.length()
            orthoRef.current.updateProjectionMatrix()
        })
    }, [canvasHeight, orthoRef, isFirstRender])
    return (
        <>
            <OrthographicCamera ref={orthoRef} makeDefault>
                <CameraLighting geometry={geometry} />
            </OrthographicCamera>
        </>
    )
}
