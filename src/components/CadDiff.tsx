import React, { useEffect, useState } from "react"
import "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { BufferGeometry } from "three"
import { Canvas } from "@react-three/fiber"
import { Box, ThemeProvider } from "@primer/react"

function ModelView({ file }: { file: string }): React.ReactElement {
    const [geometry, setGeometry] = useState<BufferGeometry>()
    useEffect(() => {
        const loader = new STLLoader()
        const geometry = loader.parse(atob(file))
        console.log(`Model ${geometry.id} loaded`)
        setGeometry(geometry)
    }, [file])
    return (
        <Canvas>
           <ambientLight />
           <mesh geometry={geometry}>
             <meshStandardMaterial color="lightgray" />
           </mesh>
            <OrbitControls />
         </Canvas>
    )
}

export type CadDiffProps = {
    before?: string
    after?: string
}

export function CadDiff({ before, after }: CadDiffProps): React.ReactElement {
    return (
        <ThemeProvider>
            <Box display="flex">
                <Box flexGrow={1}>
                    {before &&
                        <ModelView file={before} />
                    }
                </Box>
                <Box flexGrow={1} borderLeftWidth={1} borderLeftColor="border.default" borderLeftStyle="solid">
                    {after &&
                        <ModelView file={after} />
                    }
                </Box>
            </Box>
        </ThemeProvider>
    )
}
