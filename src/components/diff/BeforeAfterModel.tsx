import type { MutableRefObject } from 'react'
import { useTheme } from '@primer/react'
import { BufferGeometry } from 'three'
import { Geometry, Base, Subtraction, Intersection } from '@react-three/csg'
import { BaseModel } from './BaseModel'

type BeforeAfterModelProps = {
    beforeGeometry: BufferGeometry
    afterGeometry: BufferGeometry
    cameraRef: MutableRefObject<any>
}

export function BeforeAfterModel({
    beforeGeometry,
    afterGeometry,
    cameraRef,
}: BeforeAfterModelProps) {
    const { theme } = useTheme()
    const commonColor = theme?.colors.fg.default
    const additionsColor = theme?.colors.success.muted
    const deletionsColor = theme?.colors.danger.muted

    return (
        // TODO: here we give beforeGeometry for auto camera centering,
        // for the lack of something better. Need to check the implications
        <BaseModel geometry={beforeGeometry} cameraRef={cameraRef}>
            {/* Unchanged */}
            <mesh>
                <meshPhongMaterial
                    color={commonColor}
                    transparent
                    opacity={0.8}
                />
                <Geometry>
                    <Base geometry={beforeGeometry} />
                    <Intersection geometry={afterGeometry} />
                </Geometry>
            </mesh>
            {/* Additions */}
            <mesh>
                <meshPhongMaterial color={additionsColor} />
                <Geometry>
                    <Base geometry={afterGeometry} />
                    <Subtraction geometry={beforeGeometry} />
                </Geometry>
            </mesh>
            {/* Deletions */}
            <mesh>
                <meshPhongMaterial color={deletionsColor} />
                <Geometry>
                    <Base geometry={beforeGeometry} />
                    <Subtraction geometry={afterGeometry} />
                </Geometry>
            </mesh>
        </BaseModel>
    )
}
