import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'

interface Props {
    cameraRef: MutableRefObject<any>
}

export default function CameraControls({ cameraRef }: Props) {
    const camera = useThree(s => s.camera)
    const gl = useThree(s => s.gl)
    return (
        <OrbitControls
            makeDefault
            ref={cameraRef}
            args={[camera, gl.domElement]}
            enablePan={false}
        />
    )
}
