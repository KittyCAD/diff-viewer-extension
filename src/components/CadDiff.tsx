import React, { useEffect, useState } from "react"
import "@react-three/fiber"
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { BufferGeometry } from "three"
import { Canvas } from "@react-three/fiber";

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
        <div>
            {before &&
            <div>
                <h1>Before</h1>
                <ModelView file={before} />
            </div>
            }
            {after &&
            <div>
                <h1>After</h1>
                <ModelView file={after} />
            </div>
            }
        </div>
    )
}
