import React from 'react'
import { createRoot } from 'react-dom/client'
import { CadDiff } from '../components/CadDiff'
import { Loading } from '../components/Loading'
import { isFilenameSupported } from './diff'
import { DiffEntry, FileDiff, Message, MessageIds, Pull } from './types'
import {
    getGithubUrlParams,
    getWebPullElements,
    getInjectablePullElements,
} from './web'

// https://github.com/OctoLinker/injection
// maintained by octolinker, makes sure pages that are loaded through pjax are available for injection
// no ts support
const gitHubInjection = require('github-injection')

async function injectPullDiff(
    owner: string,
    repo: string,
    pull: number,
    document: Document
) {
    const allApiFiles = await chrome.runtime.sendMessage<Message, DiffEntry[]>({
        id: MessageIds.GetGithubPullFiles,
        data: { owner, repo, pull },
    })
    const apiFiles = allApiFiles.filter(f => isFilenameSupported(f.filename))
    console.log(`Found ${apiFiles.length} supported files with the API`)

    const elements = getWebPullElements(document)
    console.log(`Found ${elements.length} elements in the web page`)

    const injectableElements = getInjectablePullElements(elements, apiFiles)
    for (const { element } of injectableElements) {
        createRoot(element).render(React.createElement(Loading))
    }

    const pullData = await chrome.runtime.sendMessage<Message, Pull>({
        id: MessageIds.GetGithubPull,
        data: { owner, repo, pull },
    })
    const sha = pullData.head.sha
    const parentSha = pullData.base.sha
    for (const { element, file } of injectableElements) {
        const fileDiff = await chrome.runtime.sendMessage<Message, FileDiff>({
            id: MessageIds.GetFileDiff,
            data: { owner, repo, sha, parentSha, file },
        })
        createRoot(element).render(React.createElement(CadDiff, fileDiff))
    }
}

gitHubInjection(async () => {
    const params = getGithubUrlParams(window.location.href)
    if (!params) {
        console.log("URL doesn't match pull request pattern.")
        return
    }
    const { owner, repo, pull } = params
    console.log('Found pull request diff URL', owner, repo, pull)
    try {
        await injectPullDiff(owner, repo, pull, window.document)
    } catch (e) {
        console.error(e)
    }
})
