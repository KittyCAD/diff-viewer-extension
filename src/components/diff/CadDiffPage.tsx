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
    const [diffElement, setDiffElement] = useState<HTMLElement>()
    const [toolbarElement, setToolbarElement] = useState<HTMLElement>()
    useEffect(() => {
        const diffElement = element.querySelector(
            '.js-file-content'
        ) as HTMLElement
        setDiffElement(diffElement)
        const toolbarElement = element.querySelector(
            '.file-info'
        ) as HTMLElement
        setToolbarElement(toolbarElement)
        // TODO: don't clean up once the rich/source toggle is added
        for (const e of diffElement.childNodes) {
            e.remove()
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
    }, [element, diffElement, file, owner, repo, sha, parentSha])
    return (
        <>
            {diffElement &&
                createPortal(
                    diff ? (
                        <CadDiff before={diff.before} after={diff.after} />
                    ) : (
                        <Loading />
                    ),
                    diffElement
                )}
            {toolbarElement &&
                createPortal(
                    "test",
                    toolbarElement
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
