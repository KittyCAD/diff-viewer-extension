import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { MutableRefObject } from 'react'
import { Vector3 } from 'three'
import { OrbitControls as OrbitControlsType } from 'three-stdlib'

export type ControlsProps = {
    reference: MutableRefObject<OrbitControlsType | null>
    target?: Vector3
    onAltered?: () => void
}

export function Controls({ target, reference, onAltered }: ControlsProps) {
    const camera = useThree(s => s.camera)
    const gl = useThree(s => s.gl)
    return (
        <OrbitControls
            makeDefault
            onEnd={onAltered}
            ref={reference}
            target={target}
            args={[camera, gl.domElement]}
            enablePan={false}
        />
    )
}
