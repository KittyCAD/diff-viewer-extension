import { Octokit } from "@octokit/rest"
import { supportedSrcFormats } from "./diff"
import { getStorageToken } from "./storage"

// https://github.com/OctoLinker/injection
// maintained by octolinker, makes sure pages that are loaded through pjax are available for injection
// no ts support
const gitHubInjection = require("github-injection")

function getElements(document: Document): HTMLElement[] {
    const fileTypeSelectors = Array.from(supportedSrcFormats).map(t => `.file[data-file-type=".${t}"]`)
    const selector = fileTypeSelectors.join(", ")
    return [...document.querySelectorAll(selector)].map(n => n as HTMLElement)
}

async function getPullData(octokit: Octokit, owner: string, repo: string, pull: number) {
    const files = (await octokit.rest.pulls.listFiles({ owner, repo, pull_number: pull })).data
    return files.filter(f => supportedSrcFormats.has(f.filename.split(".").pop() || ""))
}


async function injectPullDiff(owner: string, repo: string, pull: number, document: Document) {
    const octokit = new Octokit({ auth: await getStorageToken() })
    const apiFiles = await getPullData(octokit, owner, repo, pull)
    console.log(`Found ${apiFiles.length} supported files with the API`)

    const elements = getElements(document)
    console.log(`Found ${elements.length} elements in the web page`)
    
    // match and diff injection
    for (const [index, element] of elements.entries()) {
        const apiFile = apiFiles[index]
        const titleElement = element.querySelector(".file-info a[title]") as HTMLElement
        const filename = titleElement.getAttribute("title")
        if (filename !== apiFile.filename) {
            console.log(element, apiFile)
            console.error("Couldn't match API file with a diff element on the page. Aborting.")
            return
        }
        const diffElement = element.querySelector(".js-file-content") as HTMLElement
        diffElement.innerHTML = `TODO: insert diff here for ${filename}]`
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

export {}
