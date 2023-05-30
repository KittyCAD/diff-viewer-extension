import type { MutableRefObject } from 'react'
import { useTheme } from '@primer/react'
import {
    Box3,
    BufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    Sphere,
    Vector3,
} from 'three'
import { Geometry, Base, Subtraction, Intersection } from '@react-three/csg'
import { BaseModel } from './BaseModel'

type UnifiedModelProps = {
    beforeGeometry: BufferGeometry
    afterGeometry: BufferGeometry
    cameraRef: MutableRefObject<any>
    showUnchanged: boolean
    showAdditions: boolean
    showDeletions: boolean
}

function getCommonSphere(
    beforeGeometry: BufferGeometry,
    afterGeometry: BufferGeometry
) {
    const group = new Group()
    const dummyMaterial = new MeshBasicMaterial()
    group.add(new Mesh(beforeGeometry, dummyMaterial))
    group.add(new Mesh(afterGeometry, dummyMaterial))
    const boundingBox = new Box3().setFromObject(group)
    const center = new Vector3()
    boundingBox.getCenter(center)
    return boundingBox.getBoundingSphere(new Sphere(center))
}

export function UnifiedModel({
    beforeGeometry,
    afterGeometry,
    cameraRef,
    showUnchanged,
    showAdditions,
    showDeletions,
}: UnifiedModelProps) {
    const { theme } = useTheme()
    const commonColor = theme?.colors.fg.muted
    const additionsColor = theme?.colors.success.muted
    const deletionsColor = theme?.colors.danger.muted

    return (
        <BaseModel
            boundingSphere={getCommonSphere(beforeGeometry, afterGeometry)}
            cameraRef={cameraRef}
        >
            {/* Unchanged */}
            <mesh>
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
