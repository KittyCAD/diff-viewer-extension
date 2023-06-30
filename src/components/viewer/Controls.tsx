import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { MutableRefObject } from 'react'
import { Vector3 } from 'three'
// From https://github.com/pmndrs/drei/discussions/719#discussioncomment-1961149
import { OrbitControls as OrbitControlsType } from 'three-stdlib'

export type ControlsProps = {
    target?: Vector3
    reference: MutableRefObject<OrbitControlsType | null>
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
            enablePan={true}
        />
    )
}
