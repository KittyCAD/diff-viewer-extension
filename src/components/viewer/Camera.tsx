import { OrthographicCamera } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Sphere } from 'three'

function CameraLighting({ boundingSphere }: { boundingSphere?: Sphere }) {
    const ref1 = useRef<any>()
    const ref2 = useRef<any>()
    useEffect(() => {
        if (ref1.current) {
            const { radius } = boundingSphere || { radius: 1 }
            // move spot light away relative to the object's size
            ref1.current.position.setLength(radius * 15)
        }
    }, [boundingSphere])
    return (
        <>
            <spotLight
                ref={ref1}
                position={[20, 20, 5]}
                angle={(8 * Math.PI) / 180}
                intensity={4 * Math.PI}
                decay={0}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-cameraNear={1}
            />
            <spotLight
                ref={ref2}
                position={[0, 0, 0]}
                angle={0.8}
                intensity={1.8 * Math.PI}
                decay={0}
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

export function Camera({ boundingSphere }: { boundingSphere?: Sphere }) {
    return (
        <>
            <OrthographicCamera makeDefault>
                <CameraLighting boundingSphere={boundingSphere} />
            </OrthographicCamera>
        </>
    )
}
