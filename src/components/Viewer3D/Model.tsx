import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { BufferGeometry } from 'three'
import { EdgesGeometry, MathUtils, Vector3 } from 'three'
import { calculateFovFactor } from './OrthoPerspectiveCamera'

interface Props {
    cameraRef: MutableRefObject<any>
    geometry: BufferGeometry
    metadata: any
}

export default function Model({ geometry, cameraRef, metadata }: Props) {
    const groupRef = useRef<any>()
    const rotation = useRef(0)
    const camera = useThree(state => state.camera)
    const canvasHeight = useThree(state => state.size.height)
    const { isOrthoCamera, prefersReducedMotion } = {
        isOrthoCamera: true,
        prefersReducedMotion: false,
    }
    const { edgeThresholdAngle, initialZoomOffset, triggerAnimation } = {
        edgeThresholdAngle: 10,
        initialZoomOffset: 7.5,
        triggerAnimation: true,
    }
    const ThemedComponent = Default
    useEffect(() => {
        if (!prefersReducedMotion)
            rotation.current = groupRef.current.rotation.y + Math.PI * 2
    }, [geometry, triggerAnimation]) // eslint-disable-line react-hooks/exhaustive-deps
    useFrame((_, delta) => {
        groupRef.current.rotation.y = MathUtils.lerp(
            groupRef.current.rotation.y,
            rotation.current,
            4 * delta
        )
    })
    useEffect(() => {
        if (geometry && cameraRef.current) {
            geometry.computeBoundingSphere()
            geometry.center()

            //move the camera away so the object fits in the view
            const { radius } = geometry.boundingSphere || { radius: 1 }
            if (!camera.position.length()) {
                const arbitraryNonZeroStartPosition = new Vector3(0.5, 0.5, 1)
                camera.position.copy(arbitraryNonZeroStartPosition)
            }
            camera.position.setLength(radius * initialZoomOffset)

            if (isOrthoCamera) {
                // set zoom for orthographic Camera
                const fov = 15 // TODO fov shouldn't be hardcoded
                const fovFactor = calculateFovFactor(fov, canvasHeight)
                camera.zoom = fovFactor / camera.position.length()
            }
            camera.updateProjectionMatrix()
        }
    }, [geometry, camera, cameraRef, initialZoomOffset, canvasHeight]) // eslint-disable-line react-hooks/exhaustive-deps
    const edges = useMemo(
        () => new EdgesGeometry(geometry.center(), edgeThresholdAngle),
        [geometry, edgeThresholdAngle]
    )
    return (
        <Suspense fallback={null}>
            <group ref={groupRef}>
                <ThemedComponent edges={edges} objGeo={geometry}>
                    {metadata && (
                        <Html
                            distanceFactor={isOrthoCamera ? 0.007 : 5} // TODO: should probably scale with the geometry (bounding sphere)
                            center
                            style={{ pointerEvents: 'none' }}
                        >
                            <pre className="bg-codeblock text-gray-300 pointer-events-none whitespace-pre text-lg">
                                {JSON.stringify(metadata, null, 2)}
                            </pre>
                        </Html>
                    )}
                </ThemedComponent>
            </group>
        </Suspense>
    )
}

interface ThemeProps {
    objGeo: BufferGeometry
    edges: EdgesGeometry
    children: React.ReactNode
}

const useHover = (children: React.ReactNode) => {
    const [isHovered, setIsHovered] = useState(false)
    const onPointerOver = () => setIsHovered(true)
    const onPointerOut = () => setIsHovered(false)
    return { isHovered: isHovered && children, onPointerOver, onPointerOut }
}

function Default({ objGeo, edges, children }: ThemeProps) {
    const {
        modelColor,
        emitColor,
        edgeColor,
        phongVsPhysical,
        enableShadow,
        edgeOpacity,
    } = {
        modelColor: '#7b507b',
        emitColor: '#572256',
        edgeColor: '#344090',
        edgeOpacity: 0.4,
        phongVsPhysical: true,
        enableShadow: true,
    }
    const { isHovered, ...onPointerOverOut } = useHover(children)
    return (
        <>
            <mesh
                castShadow={enableShadow}
                receiveShadow={enableShadow}
                geometry={objGeo}
                {...onPointerOverOut}
            >
                {isHovered && children}
                {phongVsPhysical ? (
                    <meshPhongMaterial
                        color={isHovered ? emitColor : modelColor}
                        emissive={emitColor}
                    />
                ) : (
                    <meshPhysicalMaterial
                        roughness={0.1}
                        metalness={0.5}
                        color={isHovered ? emitColor : modelColor}
                        emissive={emitColor}
                    />
                )}
            </mesh>
            <lineSegments geometry={edges} renderOrder={100}>
                <lineBasicMaterial
                    color={edgeColor}
                    transparent
                    opacity={edgeOpacity}
                />
            </lineSegments>
        </>
    )
}

// function Wireframe({ objGeo, edges, children }: ThemeProps) {
//     const { edgeColor, dashEdgeColor } = useControls('Wireframe theme', {
//         edgeColor: '#000000',
//         dashEdgeColor: '#009c99',
//     })
//     const { isHovered, ...onPointerOverOut } = useHover(children)
//     return (
//         <>
//             <mesh
//                 castShadow={true}
//                 receiveShadow={true}
//                 geometry={objGeo}
//                 {...onPointerOverOut}
//             >
//                 {isHovered && children}
//                 <meshBasicMaterial
//                     color={isHovered ? '#84cceb' : '#efefe2'}
//                     side={DoubleSide}
//                     depthTest={true}
//                 />
//             </mesh>
//             <lineSegments
//                 geometry={edges}
//                 renderOrder={100}
//                 onUpdate={line => line.computeLineDistances()}
//             >
//                 <lineDashedMaterial
//                     color={dashEdgeColor}
//                     dashSize={5}
//                     gapSize={4}
//                     scale={40}
//                     depthTest={false}
//                 />
//             </lineSegments>
//             <lineSegments geometry={edges} renderOrder={100}>
//                 <lineBasicMaterial color={edgeColor} depthTest={true} />
//             </lineSegments>
//         </>
//     )
// }
