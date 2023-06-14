import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import {
    Box,
    Text,
    useTheme,
    TabNav,
    StyledOcticon,
    Button,
} from '@primer/react'
import { FileDiff } from '../../chrome/types'
import { Viewer3D } from './Viewer3D'
import { BufferGeometry, Sphere } from 'three'
import { WireframeColors, WireframeModel } from './WireframeModel'
import { useRef } from 'react'
import { CombinedModel } from './CombinedModel'
import { BeakerIcon } from '@primer/octicons-react'
import { LegendBox, LegendLabel } from './Legend'
import { getCommonSphere, loadGeometry } from '../../utils/three'
import { OrbitControls } from 'three-stdlib'

function Viewer3D2Up({
    beforeGeometry,
    afterGeometry,
    boundingSphere,
}: {
    beforeGeometry?: BufferGeometry
    afterGeometry?: BufferGeometry
    boundingSphere?: Sphere
}) {
    const beforeControlsRef = useRef<OrbitControls | null>(null)
    const afterControlsRef = useRef<OrbitControls | null>(null)
    const [controlsAltered, setControlsAltered] = useState(false)
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
                        geometry={beforeGeometry}
                        boundingSphere={boundingSphere}
                        controlsRef={beforeControlsRef}
                        onControlsAltered={() =>
                            !controlsAltered && setControlsAltered(true)
                        }
                    >
                        <WireframeModel
                            geometry={beforeGeometry}
                            boundingSphere={boundingSphere}
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
                        geometry={afterGeometry}
                        boundingSphere={boundingSphere}
                        controlsRef={afterControlsRef}
                        onControlsAltered={() =>
                            !controlsAltered && setControlsAltered(true)
                        }
                    >
                        <WireframeModel
                            geometry={afterGeometry}
                            boundingSphere={boundingSphere}
                            colors={afterColors}
                        />
                    </Viewer3D>
                </Box>
            )}
            {controlsAltered && (
                <Box top={2} right={2} position="absolute">
                    <Button
                        onClick={() => {
                            afterControlsRef.current?.reset()
                            beforeControlsRef.current?.reset()
                            setControlsAltered(false)
                        }}
                    >
                        Recenter
                    </Button>
                </Box>
            )}
        </>
    )
}

function Viewer3DCombined({
    beforeGeometry,
    afterGeometry,
    boundingSphere,
}: {
    beforeGeometry: BufferGeometry
    afterGeometry: BufferGeometry
    boundingSphere: Sphere
}) {
    const controlsRef = useRef<OrbitControls | null>(null)
    const [controlsAltered, setControlsAltered] = useState(false)
    const [showUnchanged, setShowUnchanged] = useState(true)
    const [showAdditions, setShowAdditions] = useState(true)
    const [showDeletions, setShowDeletions] = useState(true)
    return (
        <>
            <Viewer3D
                geometry={beforeGeometry}
                boundingSphere={boundingSphere}
                controlsRef={controlsRef}
                onControlsAltered={() =>
                    !controlsAltered && setControlsAltered(true)
                }
            >
                <CombinedModel
                    beforeGeometry={beforeGeometry}
                    afterGeometry={afterGeometry}
                    boundingSphere={boundingSphere}
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
            {controlsAltered && (
                <Box top={2} right={2} position="absolute">
                    <Button
                        onClick={() => {
                            controlsRef.current?.reset()
                            setControlsAltered(false)
                        }}
                    >
                        Recenter
                    </Button>
                </Box>
            )}
        </>
    )
}

export function CadDiff({ before, after }: FileDiff): React.ReactElement {
    let [showCombined, setShowCombined] = useState(false)
    const [beforeGeometry, setBeforeGeometry] = useState<BufferGeometry>()
    const [afterGeometry, setAfterGeometry] = useState<BufferGeometry>()
    const [boundingSphere, setBoundingSphere] = useState<Sphere>()
    useEffect(() => {
        let beforeGeometry: BufferGeometry | undefined = undefined
        let afterGeometry: BufferGeometry | undefined = undefined
        if (before) {
            beforeGeometry = loadGeometry(before)
            setBeforeGeometry(beforeGeometry)
        }
        if (after) {
            afterGeometry = loadGeometry(after)
            setAfterGeometry(afterGeometry)
        }
        if (beforeGeometry && afterGeometry) {
            const boundingSphere = getCommonSphere(
                beforeGeometry,
                afterGeometry
            )
            setBoundingSphere(boundingSphere)
        } else if (beforeGeometry && beforeGeometry.boundingSphere) {
            const boundingSphere = getCommonSphere(
                beforeGeometry,
                beforeGeometry
            )
            setBoundingSphere(boundingSphere)
        } else if (afterGeometry && afterGeometry.boundingSphere) {
            const boundingSphere = getCommonSphere(afterGeometry, afterGeometry)
            setBoundingSphere(boundingSphere)
        }
    }, [before, after])
    return (
        <>
            {(beforeGeometry || afterGeometry) && (
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
                        showCombined && (
                            <Viewer3DCombined
                                beforeGeometry={beforeGeometry}
                                afterGeometry={afterGeometry}
                                boundingSphere={boundingSphere}
                            />
                        )}
                    {!showCombined && (
                        <Viewer3D2Up
                            beforeGeometry={beforeGeometry}
                            afterGeometry={afterGeometry}
                            boundingSphere={boundingSphere}
                        />
                    )}
                </Box>
            )}
            {beforeGeometry && afterGeometry && boundingSphere && (
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
                            selected={!showCombined}
                            onClick={() => setShowCombined(false)}
                            sx={{ cursor: 'pointer' }}
                        >
                            2-up
                        </TabNav.Link>
                        <TabNav.Link
                            selected={showCombined}
                            onClick={() => setShowCombined(true)}
                            sx={{ cursor: 'pointer' }}
                        >
                            Combined
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
            {!beforeGeometry && !afterGeometry && (
                <Box p={3}>
                    <Text>
                        Sorry, the rich diff can't be displayed for this file.
                    </Text>
                </Box>
            )}
        </>
    )
}
