import { supportedSrcFormats } from './diff'
import { DiffEntry } from './types'

export type GithubPullUrlParams = {
    owner: string
    repo: string
    pull: number
}

export function getGithubPullUrlParams(url: string): GithubPullUrlParams {
    const pullRe =
        /https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/pull\/(\d+)\/files/
    const result = pullRe.exec(url)
    if (!result) {
        throw Error('URL is not a supported Github Pull Request URL')
    }

    const [, owner, repo, pull] = result
    return { owner, repo, pull: parseInt(pull) }
}

export type GithubCommitUrlParams = {
    owner: string
    repo: string
    sha: string
}

export function getGithubCommitUrlParams(url: string): GithubCommitUrlParams {
    const pullRe =
        /https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/commit\/(\w+)/
    const result = pullRe.exec(url)
    if (!result) {
        throw Error('URL is not a supported Github Commit URL')
    }

    const [, owner, repo, sha] = result
    return { owner, repo, sha }
}

export function getWebPullElements(document: Document): HTMLElement[] {
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

export function getInjectablePullElements(
    elements: HTMLElement[],
    files: DiffEntry[]
) {
    if (elements.length !== files.length) {
        throw Error(
            `elements and files have different length. Got ${elements.length} and ${files.length}`
        )
    }

    const injectableElements = []
    for (const [index, element] of elements.entries()) {
        const apiFile = files[index]
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
