import React from 'react'
import { CadDiffPage } from '../components/diff/CadDiffPage'
import { Commit, DiffEntry, MessageIds, Pull } from './types'
import {
    getGithubPullUrlParams,
    mapInjectableDiffElements,
    getGithubCommitUrlParams,
    createReactRoot,
    getGithubBlobUrlParams,
} from './web'
import gitHubInjection from 'github-injection'
import { CadBlobPage } from '../components/diff/CadBlobPage'

const root = createReactRoot(document)

async function injectDiff(
    owner: string,
    repo: string,
    sha: string,
    parentSha: string,
    files: DiffEntry[],
    document: Document
) {
    const map = mapInjectableDiffElements(document, files)
    const cadDiffPage = React.createElement(CadDiffPage, {
        owner,
        repo,
        sha,
        parentSha,
        map,
    })
    root.render(cadDiffPage)
}

async function injectBlob(
    owner: string,
    repo: string,
    sha: string,
    filename: string,
    document: Document
) {
    // React UI
    let classicUI = false
    const child = document.querySelector<HTMLElement>('.react-blob-view-header-sticky')
    let element = child?.parentElement
    if (!element) {
        // Old UI
        const child = document.querySelector<HTMLElement>('.js-blob-header')
        element = child?.parentElement
        classicUI = true
    }

    if (!element) {
        throw Error("Couldn't find blob html element to inject")
    }

    element.classList.add('kittycad-injected-file')
    const cadBlobPage = React.createElement(CadBlobPage, {
        element,
        owner,
        repo,
        sha,
        filename,
        classicUI,
    })
    root.render(cadBlobPage)
}

async function injectPullDiff(
    owner: string,
    repo: string,
    pull: number,
    document: Document
) {
    const filesResponse = await chrome.runtime.sendMessage({
        id: MessageIds.GetGithubPullFiles,
        data: { owner, repo, pull },
    })
    if ('error' in filesResponse) throw filesResponse.error
    const files = filesResponse as DiffEntry[]
    const pullDataResponse = await chrome.runtime.sendMessage({
        id: MessageIds.GetGithubPull,
        data: { owner, repo, pull },
    })
    if ('error' in pullDataResponse) throw pullDataResponse.error
    const pullData = pullDataResponse as Pull
    const sha = pullData.head.sha
    const parentSha = pullData.base.sha
    await injectDiff(owner, repo, sha, parentSha, files, document)
}

async function injectCommitDiff(
    owner: string,
    repo: string,
    sha: string,
    document: Document
) {
    const response = await chrome.runtime.sendMessage({
        id: MessageIds.GetGithubCommit,
        data: { owner, repo, sha },
    })
    if ('error' in response) throw response.error
    const commit = response as Commit
    if (!commit.files) throw Error('Found no file changes in commit')
    if (!commit.parents.length) throw Error('Found no commit parent')
    const parentSha = commit.parents[0].sha
    await injectDiff(owner, repo, sha, parentSha, commit.files, document)
}

async function run() {
    const url = window.location.href
    const pullParams = getGithubPullUrlParams(url)
    if (pullParams) {
        const { owner, repo, pull } = pullParams
        console.log('Found PR diff: ', owner, repo, pull)
        await injectPullDiff(owner, repo, pull, window.document)
        return
    }

    const commitParams = getGithubCommitUrlParams(url)
    if (commitParams) {
        const { owner, repo, sha } = commitParams
        console.log('Found commit diff: ', owner, repo, sha)
        await injectCommitDiff(owner, repo, sha, window.document)
        return
    }

    const blobParams = getGithubBlobUrlParams(url)
    if (blobParams) {
        const { owner, repo, sha, filename } = blobParams
        console.log('Found blob diff: ', owner, repo, sha, filename)
        await injectBlob(owner, repo, sha, filename, window.document)
        return
    }
}

function waitForLateDiffNodes(callback: () => void) {
    // Containers holding diff nodes, in which new nodes might be added
    // Inspired from https://github.com/OctoLinker/OctoLinker/blob/55e1efdad91453846b83db1192a157694ee3438c/packages/core/app.js#L57-L109
    const elements = [
        ...document.getElementsByClassName('js-diff-load-container'),
        ...document.getElementsByClassName('js-diff-progressive-container'),
        ...document.getElementsByClassName('react-code-size-details-banner'),
    ]
    const observer = new MutationObserver(records => {
        records.forEach(record => {
            if (record.addedNodes.length > 0) {
                console.log('Re-running, as new nodes were added')
                callback()
            }
        })
    })
    elements.forEach(element => {
        observer.observe(element, {
            childList: true,
        })
    })
}

gitHubInjection(() => {
    run()
    waitForLateDiffNodes(() => run())
})
