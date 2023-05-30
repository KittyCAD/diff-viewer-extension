import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, useTheme, Text, TabNav, StyledOcticon } from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import {
    Box3,
    BufferGeometry,
    BufferAttribute,
    Group,
    Mesh,
    MeshBasicMaterial,
    Sphere,
    Vector3,
} from 'three'
import { WireframeColors, WireframeModel } from './WireframeModel'
import { Buffer } from 'buffer'
import { useRef } from 'react'
import { UnifiedModel } from './UnifiedModel'
import { BeakerIcon } from '@primer/octicons-react'
import { LegendBox, LegendLabel } from './Legend'

function loadGeometry(file: string, checkUV = false): BufferGeometry {
    const loader = new OBJLoader()
    const buffer = Buffer.from(file, 'base64').toString()
    const group = loader.parse(buffer)
    console.log(`Model ${group.id} loaded`)
    const geometry = (group.children[0] as Mesh)?.geometry
    if (checkUV && !geometry.attributes.uv) {
        // UV is needed for @react-three/csg
        // see: github.com/KittyCAD/diff-viewer-extension/issues/73
        geometry.setAttribute(
            'uv',
            new BufferAttribute(new Float32Array([]), 1)
        )
    }
    geometry.computeBoundingSphere() // will be used for auto-centering
    return geometry
}

export function getCommonSphere(
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

function Viewer3DUnified({
    beforeGeometry,
    afterGeometry,
    boundingSphere,
}: {
    beforeGeometry: BufferGeometry
    afterGeometry: BufferGeometry
    boundingSphere: Sphere
}) {
    const cameraRef = useRef<any>()
    const [showUnchanged, setShowUnchanged] = useState(true)
    const [showAdditions, setShowAdditions] = useState(true)
    const [showDeletions, setShowDeletions] = useState(true)
    return (
        <>
            <Viewer3D
                cameraRef={cameraRef}
                geometry={beforeGeometry}
                boundingSphere={boundingSphere}
            >
                <UnifiedModel
                    beforeGeometry={beforeGeometry}
                    afterGeometry={afterGeometry}
                    boundingSphere={boundingSphere}
                    cameraRef={cameraRef}
                    showUnchanged={showUnchanged}
                    showAdditions={showAdditions}
                    showDeletions={showDeletions}
                />
            </Viewer3D>
            <LegendBox>
                <LegendLabel
                    text="Unchanged"
                    color="neutral"
                    enabled={showUnchanged}
                    onChange={enabled => setShowUnchanged(enabled)}
                />
                <LegendLabel
                    text="Additions"
                    color="success"
                    enabled={showAdditions}
                    onChange={enabled => setShowAdditions(enabled)}
                />
                <LegendLabel
                    text="Deletions"
                    color="danger"
                    enabled={showDeletions}
                    onChange={enabled => setShowDeletions(enabled)}
                />
            </LegendBox>
        </>
    )
}

function Viewer3DSplit({
    beforeGeometry,
    afterGeometry,
    boundingSphere,
}: {
    beforeGeometry?: BufferGeometry
    afterGeometry?: BufferGeometry
    boundingSphere?: Sphere
}) {
    const cameraRef = useRef<any>()
    const { theme } = useTheme()
    const beforeColors: WireframeColors = {
        face: theme?.colors.fg.default,
        edge: theme?.colors.danger.muted,
        dashEdge: theme?.colors.danger.subtle,
    }
    const afterColors: WireframeColors = {
        face: theme?.colors.fg.default,
        edge: theme?.colors.success.muted,
        dashEdge: theme?.colors.success.subtle,
    }
    return (
        <>
            {beforeGeometry && (
                <Box flexGrow={1} minWidth={0} backgroundColor="danger.subtle">
                    <Viewer3D
                        cameraRef={cameraRef}
                        geometry={beforeGeometry}
                        boundingSphere={boundingSphere}
                    >
                        <WireframeModel
                            geometry={beforeGeometry}
                            boundingSphere={boundingSphere}
                            cameraRef={cameraRef}
                            colors={beforeColors}
                        />
                    </Viewer3D>
                </Box>
            )}
            {afterGeometry && (
                <Box
                    flexGrow={1}
                    minWidth={0}
                    backgroundColor="success.subtle"
                    borderLeftWidth={1}
                    borderLeftColor="border.default"
                    borderLeftStyle="solid"
                >
                    <Viewer3D
                        cameraRef={cameraRef}
                        geometry={afterGeometry}
                        boundingSphere={boundingSphere}
                    >
                        <WireframeModel
                            geometry={afterGeometry}
                            boundingSphere={boundingSphere}
                            cameraRef={cameraRef}
                            colors={afterColors}
                        />
                    </Viewer3D>
                </Box>
            )}
        </>
    )
}

export function CadDiff({ before, after }: FileDiff): React.ReactElement {
    const canShowUnified = before && after
    let [showUnified, setShowUnified] = useState(false)
    const [beforeGeometry, setBeforeGeometry] = useState<BufferGeometry>()
    const [afterGeometry, setAfterGeometry] = useState<BufferGeometry>()
    const [boundingSphere, setBoundingSphere] = useState<Sphere>()
    useEffect(() => {
        let beforeGeometry: BufferGeometry | undefined = undefined
        let afterGeometry: BufferGeometry | undefined = undefined
        if (before) {
            beforeGeometry = loadGeometry(before, true)
            setBeforeGeometry(beforeGeometry)
        }
        if (after) {
            afterGeometry = loadGeometry(after, true)
            setAfterGeometry(afterGeometry)
        }
        if (beforeGeometry && afterGeometry) {
            const boundingSphere = getCommonSphere(
                beforeGeometry,
                afterGeometry
            )
            setBoundingSphere(boundingSphere)
            console.log('common compute', boundingSphere)
        }
    }, [before, after])
    return (
        <>
            <Box
                display="flex"
                height={300}
                overflow="hidden"
                minWidth={0}
                position="relative"
            >
                {beforeGeometry &&
                    afterGeometry &&
                    boundingSphere &&
                    showUnified && (
                        <Viewer3DUnified
                            beforeGeometry={beforeGeometry}
                            afterGeometry={afterGeometry}
                            boundingSphere={boundingSphere}
                        />
                    )}
                {!showUnified && (
                    <Viewer3DSplit
                        beforeGeometry={beforeGeometry}
                        afterGeometry={afterGeometry}
                        boundingSphere={boundingSphere}
                    />
                )}
            </Box>
            {canShowUnified && (
                <Box
                    pt={2}
                    backgroundColor="canvas.default"
                    borderTopWidth={1}
                    borderTopColor="border.default"
                    borderTopStyle="solid"
                    borderBottomLeftRadius={6}
                    borderBottomRightRadius={6}
                    overflow="hidden"
                >
                    <TabNav
                        aria-label="Rich diff types"
                        sx={{
                            display: 'block',
                            marginX: 'auto',
                            marginBottom: '-1px',
                            width: 'fit-content',
                        }}
                    >
                        <TabNav.Link
                            selected={!showUnified}
                            onClick={() => setShowUnified(false)}
                            sx={{ cursor: 'pointer' }}
                        >
                            Side-by-side
                        </TabNav.Link>
                        <TabNav.Link
                            selected={showUnified}
                            onClick={() => setShowUnified(true)}
                            sx={{ cursor: 'pointer' }}
                        >
                            Unified
                            <StyledOcticon
                                icon={BeakerIcon}
                                color="fg.muted"
                                sx={{ pl: 1 }}
                                aria-label="Experimental"
                            />
                        </TabNav.Link>
                    </TabNav>
                </Box>
            )}
        </>
    )
}
