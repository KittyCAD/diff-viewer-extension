import { MutableRefObject, useState } from 'react'
import { useTheme } from '@primer/react'
import { BufferGeometry, Sphere } from 'three'
import { Geometry, Base, Subtraction, Intersection } from '@react-three/csg'
import { BaseModel } from './BaseModel'

type CombinedModelProps = {
    beforeGeometry: BufferGeometry
    afterGeometry: BufferGeometry
    boundingSphere: Sphere
    showUnchanged: boolean
    showAdditions: boolean
    showDeletions: boolean
    onRendered?: () => void
}

export function CombinedModel({
    beforeGeometry,
    afterGeometry,
    boundingSphere,
    showUnchanged,
    showAdditions,
    showDeletions,
    onRendered,
}: CombinedModelProps) {
    const { theme } = useTheme()
    const commonColor = theme?.colors.fg.muted
    const additionsColor = theme?.colors.success.muted
    const deletionsColor = theme?.colors.danger.muted
    const [rendered, setRendered] = useState(false)

    return (
        <BaseModel boundingSphere={boundingSphere}>
            {/* Unchanged */}
            <mesh
                onAfterRender={() => {
                    if (!rendered) {
                        setRendered(true)
                        onRendered && onRendered()
                    }
                }}
            >
                <meshPhongMaterial
                    color={commonColor}
                    transparent
                    opacity={showUnchanged ? 0.8 : 0}
                />
                <Geometry>
                    <Base geometry={beforeGeometry} />
                    <Intersection geometry={afterGeometry} />
                </Geometry>
            </mesh>
            {/* Additions */}
            <mesh>
                <meshPhongMaterial
                    color={additionsColor}
                    transparent
                    opacity={showAdditions ? 1 : 0}
                />
                <Geometry>
                    <Base geometry={afterGeometry} />
                    <Subtraction geometry={beforeGeometry} />
                </Geometry>
            </mesh>
            {/* Deletions */}
            <mesh>
                <meshPhongMaterial
                    color={deletionsColor}
                    transparent
                    opacity={showDeletions ? 1 : 0}
                />
                <Geometry>
                    <Base geometry={beforeGeometry} />
                    <Subtraction geometry={afterGeometry} />
                </Geometry>
            </mesh>
        </BaseModel>
    )
}
