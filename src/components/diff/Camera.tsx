import { OrthographicCamera } from '@react-three/drei'
import { MutableRefObject, useEffect, useRef } from 'react'
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
                intensity={4}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-cameraNear={1}
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

export function Camera({ boundingSphere }: { boundingSphere?: Sphere }) {
    return (
        <>
            <OrthographicCamera makeDefault>
                <CameraLighting boundingSphere={boundingSphere} />
            </OrthographicCamera>
        </>
    )
}
