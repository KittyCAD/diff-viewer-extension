import React from "react"

function ModelView({ file }: { file: string }): React.ReactElement {
    return <p>
        {atob(file || "").slice(0, 200)}
    </p>
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
