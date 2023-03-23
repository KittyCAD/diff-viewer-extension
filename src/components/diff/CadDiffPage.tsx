import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import {
    Box,
    ButtonGroup,
    IconButton,
    ThemeProvider,
    Tooltip,
} from '@primer/react'
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
    const [richDiff, setRichDiff] = useState<FileDiff>()
    const [richSelected, setRichSelected] = useState(true)
    const [toolbarContainer, setToolbarContainer] = useState<HTMLElement>()
    const [diffContainer, setDiffContainer] = useState<HTMLElement>()
    const [sourceElements, setSourceElements] = useState<HTMLElement[]>([])

    useEffect(() => {
        const toolbar = element.querySelector<HTMLElement>('.file-info')
        if (toolbar != null) {
            setToolbarContainer(toolbar)
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
            const response = await chrome.runtime.sendMessage({
                id: MessageIds.GetFileDiff,
                data: { owner, repo, sha, parentSha, file },
            })
            if ('error' in response) {
                console.log(response.error)
            } else {
                setRichDiff(response as FileDiff)
            }
        })()
    }, [file, owner, repo, sha, parentSha])

    return (
        <>
            {toolbarContainer &&
                createPortal(
                    <ButtonGroup sx={{ float: 'right', mr: '-8px' }}>
                        <Tooltip
                            aria-label="Display the source diff"
                            direction="w"
                            sx={{ height: '32px' }}
                        >
                            <IconButton
                                aria-label="Display the source diff"
                                icon={CodeIcon}
                                disabled={!richDiff}
                                onClick={() => {
                                    sourceElements.map(
                                        n => (n.style.display = 'block')
                                    )
                                    setRichSelected(false)
                                }}
                                sx={{
                                    bg: !richSelected
                                        ? 'transparent'
                                        : 'neutral.subtle',
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderRight: 'none',
                                    color: 'fg.subtle',
                                    width: '40px',
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            aria-label="Display the rich diff"
                            direction="w"
                            sx={{ height: '32px' }}
                        >
                            <IconButton
                                aria-label="Display the rich diff"
                                icon={PackageIcon}
                                disabled={!richDiff}
                                onClick={() => {
                                    sourceElements.map(
                                        n => (n.style.display = 'none')
                                    )
                                    setRichSelected(true)
                                }}
                                sx={{
                                    bg: richSelected
                                        ? 'transparent'
                                        : 'neutral.subtle',
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    color: 'fg.subtle',
                                    width: '40px',
                                }}
                            />
                        </Tooltip>
                    </ButtonGroup>,
                    toolbarContainer
                )}
            {diffContainer &&
                createPortal(
                    <Box sx={{ display: richSelected ? 'block' : 'none' }}>
                        {richDiff ? (
                            <CadDiff
                                before={richDiff.before}
                                after={richDiff.after}
                            />
                        ) : (
                            <Loading />
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
