import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, useTheme, Text, TabNav, StyledOcticon } from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { BufferAttribute, BufferGeometry, Mesh } from 'three'
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
    return geometry
}

function Loader3DUnified({ before, after }: { before: string; after: string }) {
    const [showUnchanged, setShowUnchanged] = useState(true)
    const [showAdditions, setShowAdditions] = useState(true)
    const [showDeletions, setShowDeletions] = useState(true)
    const cameraRef = useRef<any>()
    const [beforeGeometry, setBeforeGeometry] = useState<BufferGeometry>()
    const [afterGeometry, setAfterGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        setBeforeGeometry(loadGeometry(before, true))
    }, [before])
    useEffect(() => {
        setAfterGeometry(loadGeometry(after, true))
    }, [after])
    return beforeGeometry && afterGeometry ? (
        <>
            <Viewer3D cameraRef={cameraRef} geometry={beforeGeometry}>
                <UnifiedModel
                    beforeGeometry={beforeGeometry}
                    afterGeometry={afterGeometry}
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
    ) : (
        <Box p={3}>
            <Text>Sorry, the rich diff can't be displayed for this file.</Text>
        </Box>
    )
}

function Loader3D({ file, colors }: { file: string; colors: WireframeColors }) {
    const cameraRef = useRef<any>()
    const [geometry, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        setGeometry(loadGeometry(file))
    }, [file])
    return geometry ? (
        <Viewer3D cameraRef={cameraRef} geometry={geometry}>
            <WireframeModel
                geometry={geometry}
                cameraRef={cameraRef}
                colors={colors}
            />
        </Viewer3D>
    ) : (
        <Box p={3}>
            <Text>Sorry, the rich diff can't be displayed for this file.</Text>
        </Box>
    )
}

export function CadDiff({ before, after }: FileDiff): React.ReactElement {
    const canShowUnified = before && after
    let [showUnified, setShowUnified] = useState(false)
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
            <Box
                display="flex"
                height={300}
                overflow="hidden"
                minWidth={0}
                position="relative"
            >
                {canShowUnified && showUnified && (
                    <Loader3DUnified before={before} after={after} />
                )}
                {!showUnified && (
                    <>
                        {before && (
                            <Box
                                flexGrow={1}
                                minWidth={0}
                                backgroundColor="danger.subtle"
                            >
                                <Loader3D file={before} colors={beforeColors} />
                            </Box>
                        )}
                        {after && (
                            <Box
                                flexGrow={1}
                                minWidth={0}
                                backgroundColor="success.subtle"
                                borderLeftWidth={1}
                                borderLeftColor="border.default"
                                borderLeftStyle="solid"
                            >
                                <Loader3D file={after} colors={afterColors} />
                            </Box>
                        )}
                        {!before && !after && (
                            <Box p={3}>
                                <Text>
                                    Sorry, the rich diff can't be displayed for
                                    this file.
                                </Text>
                            </Box>
                        )}
                    </>
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
