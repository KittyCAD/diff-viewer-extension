import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

type Props = {
    cameraRef: any
    target: Vector3
}

export function CameraControls({ cameraRef, target }: Props) {
    const camera = useThree(s => s.camera)
    const gl = useThree(s => s.gl)
    return (
        <OrbitControls
            makeDefault
            target={target}
            ref={cameraRef}
            args={[camera, gl.domElement]}
            enablePan={false}
        />
    )
}
