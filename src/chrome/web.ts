import { supportedSrcFormats } from "./diff"
import { DiffEntry } from "./types"

export type GithubUrlParams = {
   owner: string
   repo: string
   pull: number 
} | undefined

export function getGithubUrlParams(url: string): GithubUrlParams {
    // TODO: support commit diff
    const pullRe = /https:\/\/github\.com\/(\w+)\/(\w+)\/pull\/(\d+)\/files/
    const result = pullRe.exec(url)
    if (!result) {
        return undefined
    }

    const [, owner, repo, pull] = result
    return { owner, repo, pull: parseInt(pull) }
}

export function getWebPullElements(document: Document): HTMLElement[] {
    const fileTypeSelectors = Array.from(supportedSrcFormats).map(t => `.file[data-file-type=".${t}"]`)
    const selector = fileTypeSelectors.join(", ")
    return [...document.querySelectorAll(selector)].map(n => n as HTMLElement)
}

export function getElementFilename(element: HTMLElement) {
    const titleElement = element.querySelector(".file-info a[title]") as HTMLElement
    return titleElement.getAttribute("title")
}

export function getInjectablePullElements(elements: HTMLElement[], files: DiffEntry[]) {
    if (elements.length !== files.length) {
        throw Error(`elements and files have different lendth. Got ${elements.length} and ${files.length}`)
    }

    const injectableElements = []
    for (const [index, element] of elements.entries()) {
        const apiFile = files[index]
        const filename = getElementFilename(element)
        if (filename !== apiFile.filename) {
            throw Error("Couldn't match API file with a diff element on the page. Aborting.")
        }
        const diffElement = element.querySelector(".js-file-content") as HTMLElement
        injectableElements.push({ element: diffElement, file: apiFile })
    }

    return injectableElements
}
