import { useEffect, useRef, useState } from 'react'
import '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { BufferGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import { WireframeModel } from './WireframeModel'
import { Camera } from './Camera'
import { CameraControls } from './CameraControls'

type Props = {
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
}: Props) {
    const [geometry, setGeometry] = useState<BufferGeometry>()
    const cameraRef = useRef<any>()
    useEffect(() => {
        const loader = new STLLoader()
        const geometry = loader.parse(atob(file))
        console.log(`Model ${geometry.id} loaded`)
        setGeometry(geometry)
    }, [file])
    return (
        <Canvas dpr={[1, 2]} shadows>
            {typeof window !== 'undefined' && geometry && (
                <WireframeModel
                    geometry={geometry}
                    cameraRef={cameraRef}
                    faceColor={faceColor}
                    edgeColor={edgeColor}
                    dashEdgeColor={dashEdgeColor}
                />
            )}
            <CameraControls cameraRef={cameraRef} />
            {geometry && <Camera geometry={geometry} />}
        </Canvas>
    )
}
