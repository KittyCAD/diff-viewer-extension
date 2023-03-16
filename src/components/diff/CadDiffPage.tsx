import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { ThemeProvider } from '@primer/react'
import { DiffEntry, FileDiff, MessageIds } from '../../chrome/types'
import { createPortal } from 'react-dom'
import { Loading } from '../Loading'
import { CadDiff } from './CadDiff'

function CadDiffPortal({
    element,
    file,
    owner,
    repo,
    sha,
    parentSha,
}: {
    element: HTMLElement
    file: DiffEntry
    owner: string
    repo: string
    sha: string
    parentSha: string
}): React.ReactElement {
    const [diff, setDiff] = useState<FileDiff>()
    const [firstRun, setFirstRun] = useState(true)
    useEffect(() => {
        if (firstRun) {
            for (const e of element.childNodes) {
                e.remove()
            }
            setFirstRun(false)
        }
        ;(async () => {
            const response = await chrome.runtime.sendMessage({
                id: MessageIds.GetFileDiff,
                data: { owner, repo, sha, parentSha, file },
            })
            if ('error' in response) {
                console.log(response.error)
            } else {
                setDiff(response as FileDiff)
            }
        })()
    }, [firstRun, element, file, owner, repo, sha, parentSha])
    return (
        <>
            {createPortal(
                diff ? (
                    <CadDiff before={diff.before} after={diff.after} />
                ) : (
                    <Loading />
                ),
                element
            )}
        </>
    )
}

export type CadDiffPageProps = {
    map: { element: HTMLElement; file: DiffEntry }[]
    owner: string
    repo: string
    sha: string
    parentSha: string
}

export function CadDiffPage({
    map,
    owner,
    repo,
    sha,
    parentSha,
}: CadDiffPageProps): React.ReactElement {
    return (
        <ThemeProvider colorMode="auto">
            {map.map(m => (
                <CadDiffPortal
                    key={m.file.filename}
                    element={m.element}
                    file={m.file}
                    owner={owner}
                    repo={repo}
                    sha={sha}
                    parentSha={parentSha}
                />
            ))}
        </ThemeProvider>
    )
}
