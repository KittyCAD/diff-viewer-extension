import { createRoot, Root } from 'react-dom/client'
import { isFilenameSupported, extensionToSrcFormat } from './diff'
import { DiffEntry } from './types'

export type GithubPullUrlParams = {
    owner: string
    repo: string
    pull: number
}

export function getGithubPullUrlParams(
    url: string
): GithubPullUrlParams | undefined {
    const pullRe =
        /https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/pull\/(\d+)\/files/
    const result = pullRe.exec(url)
    if (!result) {
        return undefined
    }

    const [, owner, repo, pull] = result
    console.log('Found a supported Github Pull Request URL:', owner, repo, pull)
    return { owner, repo, pull: parseInt(pull) }
}

export type GithubCommitUrlParams = {
    owner: string
    repo: string
    sha: string
}

export function getGithubCommitUrlParams(
    url: string
): GithubCommitUrlParams | undefined {
    const pullRe =
        /https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/commit\/(\w+)/
    const result = pullRe.exec(url)
    if (!result) {
        return undefined
    }

    const [, owner, repo, sha] = result
    console.log('Found a supported Github Commit URL:', owner, repo, sha)
    return { owner, repo, sha }
}

export type GithubBlobUrlParams = {
    owner: string
    repo: string
    sha: string
    filename: string
}

export function getGithubBlobUrlParams(
    url: string
): GithubBlobUrlParams | undefined {
    const blobRe =
        /https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/blob\/(\w+)\/([^\0]+)/
    const result = blobRe.exec(url)
    if (!result) {
        return undefined
    }

    const [, owner, repo, sha, filename] = result
    console.log(
        'Found a supported Github Blob URL:',
        owner,
        repo,
        sha,
        filename
    )
    return { owner, repo, sha, filename }
}

export function getSupportedWebDiffElements(document: Document): HTMLElement[] {
    const fileTypeSelectors = Object.keys(extensionToSrcFormat).map(
        t => `.file[data-file-type=".${t}"]`
    )
    const selector = fileTypeSelectors.join(', ')
    return [...document.querySelectorAll(selector)].map(n => n as HTMLElement)
}

export function getElementFilename(element: HTMLElement) {
    const titleElement = element.querySelector(
        '.file-info a[title]'
    ) as HTMLElement
    return titleElement.getAttribute('title')
}

export function mapInjectableDiffElements(
    document: Document,
    files: DiffEntry[]
) {
    const supportedFiles = files.filter(f => isFilenameSupported(f.filename))
    console.log(`Found ${supportedFiles.length} supported files with the API`)

    const supportedElements = getSupportedWebDiffElements(document)
    console.log(`Found ${supportedElements.length} elements in the web page`)

    if (supportedElements.length !== supportedFiles.length) {
        throw Error(
            `elements and files have different length. Got ${supportedElements.length} and ${supportedFiles.length}`
        )
    }

    const injectableElements: { element: HTMLElement; file: DiffEntry }[] = []
    for (const [index, element] of supportedElements.entries()) {
        const file = supportedFiles[index]
        const filename = getElementFilename(element)
        if (filename !== file.filename) {
            throw Error(
                "Couldn't match API file with a diff element on the page. Aborting."
            )
        }
        injectableElements.push({ element, file })
    }

    return injectableElements
}

export function createReactRoot(
    document: Document,
    id: string = 'kittycad-root'
): Root {
    // TODO: there's probably a better way than this to create a root?
    const node = document.createElement('div')
    node.id = id
    document.body.appendChild(node)
    return createRoot(node)
}
