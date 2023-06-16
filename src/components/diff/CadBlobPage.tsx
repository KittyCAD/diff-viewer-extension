import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, ThemeProvider } from '@primer/react'
import { DiffEntry, FileBlob, FileDiff, MessageIds } from '../../chrome/types'
import { createPortal } from 'react-dom'
import { Loading } from '../Loading'
import { CadDiff } from './CadDiff'
import { SourceRichToggle } from './SourceRichToggle'
import { CadBlob } from './CadBlob'

function CadBlobPortal({
    element,
    owner,
    repo,
    sha,
    filename,
}: {
    element: HTMLElement
    owner: string
    repo: string
    sha: string
    filename: string
}): React.ReactElement {
    const [richBlob, setRichBlob] = useState<FileBlob>()
    // const [richSelected, setRichSelected] = useState(true)
    // const [toolbarContainer, setToolbarContainer] = useState<HTMLElement>()
    const [blobContainer, setBlobContainer] = useState<HTMLElement>()
    const [sourceElements, setSourceElements] = useState<HTMLElement[]>([])

    useEffect(() => {
        // const toolbar = element.querySelector<HTMLElement>('.file-info')
        // if (toolbar != null) {
        //     setToolbarContainer(toolbar)
        //     // STL files might have a toggle already
        //     const existingToggle = element.querySelector<HTMLElement>(
        //         '.js-prose-diff-toggle-form'
        //     )
        //     if (existingToggle) {
        //         existingToggle.style.display = 'none'
        //     }
        // }
        const blob = element.querySelector<HTMLElement>('div')
        console.log(element, blob)
        if (blob != null) {
            setBlobContainer(blob)
            const sourceElements = Array.from(blob.children) as HTMLElement[]
            sourceElements.map(n => (n.style.display = 'none'))
            setSourceElements(sourceElements)
        }
    }, [element])

    useEffect(() => {
        ;(async () => {
            const response = await chrome.runtime.sendMessage({
                id: MessageIds.GetFileBlob,
                data: { owner, repo, sha, filename },
            })
            console.log(response)
            if ('error' in response) {
                console.log(response.error)
            } else {
                setRichBlob(response as FileBlob)
            }
        })()
    }, [owner, repo, sha, filename])

    return (
        <>
            {/* {toolbarContainer &&
                createPortal(
                    <SourceRichToggle
                        disabled={!richBlob}
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
                )} */}
            {blobContainer &&
                createPortal(
                    <Box
                    // sx={{ display: richSelected ? 'block' : 'none' }}
                    >
                        {richBlob ? (
                            <CadBlob blob={richBlob.blob} />
                        ) : (
                            <Loading />
                        )}
                    </Box>,
                    blobContainer
                )}
        </>
    )
}

export type CadBlobPageProps = {
    element: HTMLElement
    owner: string
    repo: string
    sha: string
    filename: string
}

export function CadBlobPage({
    element,
    owner,
    repo,
    sha,
    filename,
}: CadBlobPageProps): React.ReactElement {
    return (
        <ThemeProvider colorMode="auto">
            <CadBlobPortal
                element={element}
                owner={owner}
                repo={repo}
                sha={sha}
                filename={filename}
            />
        </ThemeProvider>
    )
}
