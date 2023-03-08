import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

type Props = {
    cameraRef: any
}

export function CameraControls({ cameraRef }: Props) {
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
