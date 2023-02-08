import { Octokit } from "@octokit/rest"
import { supportedSrcFormats } from "./diff"

// https://github.com/OctoLinker/injection
// maintained by octolinker, makes sure pages that are loaded through pjax are available for injection
// no ts support
const gitHubInjection = require("github-injection")

const GITHUB_TOKEN = ""

function getElements(document: Document): HTMLElement[] {
    const fileTypeSelectors = Array.from(supportedSrcFormats).map(t => `[data-file-type=".${t}"]`)
    const selector = `:is(${fileTypeSelectors.join(",")}) .js-file-content`
    return [...document.querySelectorAll(selector)].map(n => n as HTMLElement)
}

async function getPullData(octokit: Octokit, owner: string, repo: string, pull: number) {
    const files = (await octokit.rest.pulls.listFiles({ owner, repo, pull_number: pull })).data
    return files.filter(f => supportedSrcFormats.has(f.filename.split(".").pop() || ""))
}


async function injectPullDiff(owner: string, repo: string, pull: number, document: Document) {
    const octokit = new Octokit({ auth: GITHUB_TOKEN })
    const supportedFiles = await getPullData(octokit, owner, repo, pull)
    console.log(`Found ${supportedFiles.length} supported files with the API`)

    const elements = getElements(window.document)
    console.log(`Found ${elements.length} elements in the web page`)
    
    // fake diff injection
    for (const element of elements) {
        element.innerHTML = "kittycad material"
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
