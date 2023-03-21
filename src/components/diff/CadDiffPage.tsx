import React, { useCallback, useEffect, useState } from 'react'
import '@react-three/fiber'
import { ButtonGroup, IconButton, ThemeProvider } from '@primer/react'
import { PackageIcon, CodeIcon } from '@primer/octicons-react'
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
    const [richSelected, setRichSelected] = useState(false)
    const [diffElement, setDiffElement] = useState<HTMLElement>()
    const [toolbarElement, setToolbarElement] = useState<HTMLElement>()
    const [sourceNodes, setSourceNodes] = useState<Element[]>()

    function collectSourceNodes(element: HTMLElement) {
        const nodes = []
        for (const n of element.children) {
            nodes.push(n)
        }
        setSourceNodes(nodes)
    }

    const hideSourceNodes = useCallback(() => {
        if (!sourceNodes) return
        for (const n of sourceNodes) {
            ;(n as HTMLElement).style.display = 'none'
        }
    }, [sourceNodes])

    const showSourceNodes = useCallback(() => {
        if (!sourceNodes) return
        for (const n of sourceNodes) {
            ;(n as HTMLElement).style.display = 'block'
        }
    }, [sourceNodes])

    function selectSourceDiff() {
        showSourceNodes()
        setRichSelected(true)
    }

    function selectRichDiff() {
        hideSourceNodes()
        setRichSelected(false)
    }

    useEffect(() => {
        const diffElement = element.querySelector(
            '.js-file-content'
        ) as HTMLElement
        setDiffElement(diffElement)
        const toolbarElement = element.querySelector(
            '.file-info'
        ) as HTMLElement
        setToolbarElement(toolbarElement)

        collectSourceNodes(diffElement)
        hideSourceNodes()
    }, [element, diffElement, hideSourceNodes])

    useEffect(() => {
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
    }, [file, owner, repo, sha, parentSha])

    return (
        <>
            {diffElement &&
                !richSelected &&
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
                    <ButtonGroup sx={{ float: 'right' }}>
                        <IconButton
                            aria-label="Show original diff"
                            icon={CodeIcon}
                            disabled={!diff}
                            onClick={selectSourceDiff}
                            sx={{ bg: richSelected ? 'transparent' : 'neutral.muted' }}
                        />
                        <IconButton
                            aria-label="Show KittyCAD 3D diff"
                            icon={PackageIcon}
                            disabled={!diff}
                            onClick={selectRichDiff}
                            sx={{ bg: !richSelected ? 'transparent' : 'neutral.muted' }}
                        />
                    </ButtonGroup>,
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
