import { supportedSrcFormats } from "./diff"
import { DiffEntry, FileDiff, Message, MessageIds, Pull } from "./types"

// https://github.com/OctoLinker/injection
// maintained by octolinker, makes sure pages that are loaded through pjax are available for injection
// no ts support
const gitHubInjection = require("github-injection")

function getWebPullElements(document: Document): HTMLElement[] {
    const fileTypeSelectors = Array.from(supportedSrcFormats).map(t => `.file[data-file-type=".${t}"]`)
    const selector = fileTypeSelectors.join(", ")
    return [...document.querySelectorAll(selector)].map(n => n as HTMLElement)
}

async function getApiPull(owner: string, repo: string, pull: number) {
    const message: Message = {
        id: MessageIds.GetGithubPull,
        data: { owner, repo, pull },
    }
    return await chrome.runtime.sendMessage<Message, Pull>(message)
}

async function getApiPullFiles(owner: string, repo: string, pull: number) {
    const message: Message = {
        id: MessageIds.GetGithubPullFiles,
        data: { owner, repo, pull },
    }
    return await chrome.runtime.sendMessage<Message, DiffEntry[]>(message)
}

async function getFileDiff(owner: string, repo: string, sha: string, parentSha: string, file: DiffEntry) {
    const message: Message = {
        id: MessageIds.GetFileDiff,
        data: { owner, repo, sha, parentSha, file },
    }
    return await chrome.runtime.sendMessage<Message, FileDiff>(message)
}

async function injectPullDiff(owner: string, repo: string, pull: number, document: Document) {
    const pullData = await getApiPull(owner, repo, pull)
    const sha = pullData.head.sha
    const parentSha = pullData.base.sha
    const allApiFiles = await getApiPullFiles(owner, repo, pull)
    const apiFiles = allApiFiles.filter(f => supportedSrcFormats.has(f.filename.split(".").pop() || ""))
    console.log(`Found ${apiFiles.length} supported files with the API`)

    const elements = getWebPullElements(document)
    console.log(`Found ${elements.length} elements in the web page`)
    
    // match and diff injection
    for (const [index, element] of elements.entries()) {
        const apiFile = apiFiles[index]
        const titleElement = element.querySelector(".file-info a[title]") as HTMLElement
        const filename = titleElement.getAttribute("title")
        if (filename !== apiFile.filename) {
            console.error("Couldn't match API file with a diff element on the page. Aborting.", element, apiFile)
            return
        }
        const diffElement = element.querySelector(".js-file-content") as HTMLElement
        const fileDiff = await getFileDiff(owner, repo, sha, parentSha, apiFile)
        // TODO: inject threejs scenes!
        diffElement.innerHTML = `Before STL: ${atob(fileDiff.before || "").slice(0, 200)}... <br><br> After STL: ${atob(fileDiff.after || "").slice(0, 200)}...`
    }
}

gitHubInjection(async () => {
    const url = window.location.href
    // TODO: support commit diff
    const pullRe = /https:\/\/github\.com\/(\w+)\/(\w+)\/pull\/(\d+)/
    const result = pullRe.exec(url)
    if (!result) {
        console.log("URL doesn't match pull request pattern.")
        return
    }
    const [, owner, repo, pull] = result
    console.log("Found pull request", owner,  repo, pull)
    injectPullDiff(owner, repo, parseInt(pull), window.document)
})
