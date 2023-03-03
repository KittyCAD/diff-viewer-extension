import { useEffect, useRef, useState } from 'react'
import '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { BufferGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import CameraControls from './CameraControls'
import OrthoPerspectiveCamera from './OrthoPerspectiveCamera'
import Model from './Model'

export type ViewerSTLProps = {
    file: string
    faceColor: string
    edgeColor: string
    dashEdgeColor: string
}

export function ViewerSTL({
    file,
    faceColor,
    edgeColor,
    dashEdgeColor,
}: ViewerSTLProps) {
    const newCameraRef = useRef<any>()
    const [geometry, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new STLLoader()
        const geometry = loader.parse(atob(file))
        console.log(`Model ${geometry.id} loaded`)
        setGeometry(geometry)
    }, [file])
    return (
        <Canvas dpr={[1, 2]} shadows>
            {typeof window !== 'undefined' && geometry && (
                <Model
                    geometry={geometry}
                    cameraRef={newCameraRef}
                    faceColor={faceColor}
                    edgeColor={edgeColor}
                    dashEdgeColor={dashEdgeColor}
                />
            )}
            <CameraControls cameraRef={newCameraRef} />
            {geometry && <OrthoPerspectiveCamera geometry={geometry} />}
        </Canvas>
    )
}
