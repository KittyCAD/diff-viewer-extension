import type { MutableRefObject } from 'react'
import { useMemo, useRef } from 'react'
import { BufferGeometry, DoubleSide } from 'three'
import { EdgesGeometry, Sphere } from 'three'
import { BaseModel } from './BaseModel'

export type WireframeColors = {
    face: string
    edge: string
    dashEdge: string
}

type Props = {
    geometry: BufferGeometry
    colors: WireframeColors
    boundingSphere?: Sphere
}

export function WireframeModel({ geometry, boundingSphere, colors }: Props) {
    const groupRef = useRef<any>()
    const edgeThresholdAngle = 10
    const edges = useMemo(
        () => new EdgesGeometry(geometry, edgeThresholdAngle),
        [geometry]
    )

    return (
        <BaseModel boundingSphere={boundingSphere || geometry.boundingSphere}>
            <group ref={groupRef}>
                <mesh
                    castShadow={true}
                    receiveShadow={true}
                    geometry={geometry}
                >
                    <meshPhongMaterial
                        color={colors.face}
                        side={DoubleSide}
                        depthTest={true}
                    />
                </mesh>
                <lineSegments
                    geometry={edges}
                    renderOrder={100}
                    onUpdate={line => line.computeLineDistances()}
                >
                    <lineDashedMaterial
                        color={colors.dashEdge}
                        dashSize={5}
                        gapSize={4}
                        scale={40}
                        depthTest={false}
                    />
                </lineSegments>
                <lineSegments geometry={edges} renderOrder={100}>
                    <lineBasicMaterial color={colors.edge} depthTest={true} />
                </lineSegments>
            </group>
        </BaseModel>
    )
}
