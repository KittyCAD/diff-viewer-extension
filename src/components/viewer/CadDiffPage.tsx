import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, ThemeProvider } from '@primer/react'
import { DiffEntry, FileDiff, MessageIds } from '../../chrome/types'
import { createPortal } from 'react-dom'
import { Loading } from '../Loading'
import { CadDiff } from './CadDiff'
import { SourceRichToggle } from './SourceRichToggle'
import { ColorModeWithAuto } from '@primer/react/lib/ThemeProvider'
import { ErrorMessage } from './ErrorMessage'

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
    const [loading, setLoading] = useState(true)
    const [richDiff, setRichDiff] = useState<FileDiff>()
    const [richSelected, setRichSelected] = useState(true)
    const [toolbarContainer, setToolbarContainer] = useState<HTMLElement>()
    const [diffContainer, setDiffContainer] = useState<HTMLElement>()
    const [sourceElements, setSourceElements] = useState<HTMLElement[]>([])

    useEffect(() => {
        const toolbar = element.querySelector<HTMLElement>('.file-info')
        if (toolbar != null) {
            setToolbarContainer(toolbar)

            // STL files might have a toggle already
            const existingToggle = element.querySelector<HTMLElement>(
                '.js-prose-diff-toggle-form'
            )
            if (existingToggle) {
                existingToggle.style.display = 'none'
            }
        }

        const diff = element.querySelector<HTMLElement>('.js-file-content')
        if (diff != null) {
            setDiffContainer(diff)
            const sourceElements = Array.from(diff.children) as HTMLElement[]
            sourceElements.map(n => (n.style.display = 'none'))
            setSourceElements(sourceElements)
        }
    }, [element])

    useEffect(() => {
        ;(async () => {
            setLoading(true)
            const response = await chrome.runtime.sendMessage({
                id: MessageIds.GetFileDiff,
                data: { owner, repo, sha, parentSha, file },
            })
            if ('error' in response) {
                console.log(response.error)
                setLoading(false)
            } else {
                setRichDiff(response as FileDiff)
                setLoading(false)
            }
        })()
    }, [file, owner, repo, sha, parentSha])

    return (
        <>
            {toolbarContainer &&
                createPortal(
                    <SourceRichToggle
                        disabled={!richDiff}
                        richSelected={richSelected}
                        onSourceSelected={() => {
                            sourceElements.map(n => (n.style.display = 'block'))
                            setRichSelected(false)
                        }}
                        onRichSelected={() => {
                            sourceElements.map(n => (n.style.display = 'none'))
                            setRichSelected(true)
                        }}
                    />,
                    toolbarContainer
                )}
            {diffContainer &&
                createPortal(
                    <Box sx={{ display: richSelected ? 'block' : 'none' }}>
                        {loading ? (
                            <Loading />
                        ) : (
                            <>
                                {richDiff ? (
                                    <CadDiff
                                        before={richDiff.before}
                                        after={richDiff.after}
                                    />
                                ) : (
                                    <ErrorMessage />
                                )}
                            </>
                        )}
                    </Box>,
                    diffContainer
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
    colorMode: ColorModeWithAuto
}

export function CadDiffPage({
    map,
    owner,
    repo,
    sha,
    parentSha,
    colorMode,
}: CadDiffPageProps): React.ReactElement {
    return (
        <ThemeProvider colorMode={colorMode}>
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
