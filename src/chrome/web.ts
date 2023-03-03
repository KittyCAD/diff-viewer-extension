import { isFilenameSupported, supportedSrcFormats } from './diff'
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

export function getSupportedWebDiffElements(document: Document): HTMLElement[] {
    const fileTypeSelectors = Array.from(supportedSrcFormats).map(
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
            `elements and files have different length. Got ${supportedElements.length} and ${files.length}`
        )
    }

    const injectableElements: { element: HTMLElement; file: DiffEntry }[] = []
    for (const [index, element] of supportedElements.entries()) {
        const apiFile = supportedFiles[index]
        const filename = getElementFilename(element)
        if (filename !== apiFile.filename) {
            throw Error(
                "Couldn't match API file with a diff element on the page. Aborting."
            )
        }
        const diffElement = element.querySelector(
            '.js-file-content'
        ) as HTMLElement
        injectableElements.push({ element: diffElement, file: apiFile })
    }

    return injectableElements
}
