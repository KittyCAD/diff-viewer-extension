import React, { useEffect, useState } from 'react'
import '@react-three/fiber'
import { Box, SegmentedControl, ThemeProvider } from '@primer/react'
import { FileBlob, MessageIds } from '../../chrome/types'
import { createPortal } from 'react-dom'
import { Loading } from '../Loading'
import { CadBlob } from './CadBlob'
import { ColorModeWithAuto } from '@primer/react/lib/ThemeProvider'

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
    const [richSelected, setRichSelected] = useState(true)
    const [toolbarContainer, setToolbarContainer] = useState<HTMLElement>()
    const [blobContainer, setBlobContainer] = useState<HTMLElement>()
    const [sourceElements, setSourceElements] = useState<HTMLElement[]>([])

    useEffect(() => {
        const existingToggle = element.querySelector<HTMLElement>(
            'ul[class*=SegmentedControl]'
        )
        const toolbar = existingToggle?.parentElement
        let blob: HTMLElement | undefined | null =
            element.querySelector<HTMLElement>(
                'section[aria-labelledby*=file-name-id]'
            )
        const isPreviewAlreadyEnabled =
            existingToggle && existingToggle.childElementCount > 2 // Preview, Code, Blame
        if (isPreviewAlreadyEnabled) {
            const existingPreview = element.querySelector<HTMLElement>('iframe')
            blob = existingPreview?.parentElement
            if (blob && blob.parentElement) {
                setBlobContainer(blob.parentElement)
                blob.style.display = 'none'
            }
            // No toolbar, no sourceElements. Only a replacement of the existing (STL) preview
            return
        }

        if (toolbar != null) {
            setToolbarContainer(toolbar)
            if (existingToggle) {
                existingToggle.style.display = 'none'
            }
        }

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
            if ('error' in response) {
                console.log(response.error)
            } else {
                setRichBlob(response as FileBlob)
            }
        })()
    }, [owner, repo, sha, filename])

    return (
        <>
            {toolbarContainer &&
                createPortal(
                    <SegmentedControl
                        sx={{ mr: 0, order: -1 }} // prepend in flex
                        aria-label="File view"
                        onChange={(index: number) => {
                            if (index < 2) {
                                setRichSelected(index === 0)
                                sourceElements.map(
                                    n =>
                                        (n.style.display =
                                            index === 0 ? 'none' : 'block')
                                )
                                return
                            }
                            window.location.href = `https://github.com/${owner}/${repo}/blame/${sha}/${filename}`
                        }}
                    >
                        <SegmentedControl.Button selected={richSelected}>
                            Preview
                        </SegmentedControl.Button>
                        <SegmentedControl.Button selected={!richSelected}>
                            Code
                        </SegmentedControl.Button>
                        <SegmentedControl.Button>Blame</SegmentedControl.Button>
                    </SegmentedControl>,
                    toolbarContainer
                )}
            {blobContainer &&
                createPortal(
                    <Box
                        sx={{
                            display: richSelected ? 'block' : 'none',
                            width: '100%',
                        }}
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
    colorMode: ColorModeWithAuto
}

export function CadBlobPage({
    element,
    owner,
    repo,
    sha,
    filename,
    colorMode,
}: CadBlobPageProps): React.ReactElement {
    return (
        <ThemeProvider colorMode={colorMode}>
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
