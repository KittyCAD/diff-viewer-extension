import { Client, users } from '@kittycad/lib'
import { Octokit } from '@octokit/rest'
import {
    KittycadUser,
    Message,
    MessageGetFileDiff,
    MessageGetGithubCommitData,
    MessageGetGithubPullFilesData,
    MessageIds,
    MessageResponse,
    MessageSaveToken,
} from './types'
import {
    getStorageGithubToken,
    getStorageKittycadToken,
    setStorageGithubToken,
    setStorageKittycadToken,
} from './storage'
import { getFileDiff } from './diff'

let github: Octokit | undefined
let kittycad: Client | undefined

async function initGithubApi() {
    try {
        github = new Octokit({ auth: await getStorageGithubToken() })
        const octokitResponse = await github.rest.users.getAuthenticated()
        console.log(`Logged in on github.com as ${octokitResponse.data.login}`)
    } catch (e) {
        console.log('Couldnt initiate the github api client')
        github = undefined
    }
}

async function initKittycadApi() {
    try {
        kittycad = new Client(await getStorageKittycadToken())
        const response = await users.get_user_self({ client: kittycad })
        if ('error_code' in response) throw response
        const { email } = response
        if (!email) throw Error('Empty user, token is probably wrong')
        console.log(`Logged in on kittycad.io as ${email}`)
    } catch (e) {
        console.log("Couldn't initiate the kittycad api client")
        kittycad = undefined
    }
}

async function saveGithubTokenAndReload(token: string): Promise<void> {
    github = undefined
    await setStorageGithubToken(token)
    await initGithubApi()
}

async function saveKittycadTokenAndReload(token: string): Promise<void> {
    kittycad = undefined
    await setStorageKittycadToken(token)
    await initKittycadApi()
}

export function checkClientAndReject(
    client: Octokit | Client | undefined,
    callback: (response: MessageResponse) => void
) {
    if (!client) {
        callback({ error: "Client wasn't initialized" })
        return true
    }

    return false
}

;(async () => {
    // Helps for e2e tests
    await new Promise(resolve => setTimeout(resolve, 1000))
    await initKittycadApi()
    await initGithubApi()
})()

chrome.runtime.onMessage.addListener(
    (
        message: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
    ) => {
        console.log(`Received ${message.id} from ${sender.id}`)
        if (message.id === MessageIds.GetGithubPullFiles) {
            if (checkClientAndReject(github, sendResponse)) return false
            const { owner, repo, pull } =
                message.data as MessageGetGithubPullFilesData
            github!.rest.pulls
                .listFiles({ owner, repo, pull_number: pull })
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetGithubPull) {
            if (checkClientAndReject(github, sendResponse)) return false
            const { owner, repo, pull } =
                message.data as MessageGetGithubPullFilesData
            github!.rest.pulls
                .get({ owner, repo, pull_number: pull })
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetGithubCommit) {
            if (checkClientAndReject(github, sendResponse)) return false
            const { owner, repo, sha } =
                message.data as MessageGetGithubCommitData
            github!.rest.repos
                .getCommit({ owner, repo, ref: sha })
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetGithubUser) {
            if (checkClientAndReject(github, sendResponse)) return false
            github!.rest.users
                .getAuthenticated()
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetKittycadUser) {
            if (checkClientAndReject(kittycad, sendResponse)) return false
            users
                .get_user_self({ client: kittycad })
                .then(r => sendResponse(r as KittycadUser))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.SaveGithubToken) {
            const { token } = message.data as MessageSaveToken
            saveGithubTokenAndReload(token)
                .then(() => sendResponse({ token }))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.SaveKittycadToken) {
            const { token } = message.data as MessageSaveToken
            saveKittycadTokenAndReload(token)
                .then(() => sendResponse({ token }))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetFileDiff) {
            if (checkClientAndReject(github, sendResponse)) return false
            if (checkClientAndReject(kittycad, sendResponse)) return false
            const { owner, repo, sha, parentSha, file } =
                message.data as MessageGetFileDiff
            getFileDiff(github!, kittycad!, owner, repo, sha, parentSha, file)
                .then(r => sendResponse(r))
                .catch(error => sendResponse({ error }))
            return true
        }
    }
)
