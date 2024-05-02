import { Client, users } from '@kittycad/lib'
import { Octokit } from '@octokit/rest'
import {
    KittycadUser,
    Message,
    MessageGetFileBlob,
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
import { getFileBlob, getFileDiff } from './diff'
import init from '../wasm-lib/pkg/wasm_lib'

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

async function initialiseWasm() {
    try {
        const fullUrl = '/wasm_lib_bg.wasm'
        const input = await fetch(fullUrl)
        const buffer = await input.arrayBuffer()
        return await init(buffer)
    } catch (e) {
        console.log('Error initialising WASM', e)
        throw e
    }
}

; (async () => {
    // Delay to allow for external storage sets before auth, like in e2e
    await new Promise(resolve => setTimeout(resolve, 1000))
    await initKittycadApi()
    await initGithubApi()
    await initialiseWasm()
})()

const noClientError = new Error('API client is undefined')

chrome.runtime.onMessage.addListener(
    (
        message: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
    ) => {
        console.log(`Received ${message.id} from ${sender.id}`)
        if (message.id === MessageIds.GetGithubPullFiles) {
            if (!github) {
                sendResponse({ error: noClientError })
                return false
            }
            const { owner, repo, pull } =
                message.data as MessageGetGithubPullFilesData
            github.rest.pulls
                .listFiles({ owner, repo, pull_number: pull })
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetGithubPull) {
            if (!github) {
                sendResponse({ error: noClientError })
                return false
            }
            const { owner, repo, pull } =
                message.data as MessageGetGithubPullFilesData
            github.rest.pulls
                .get({ owner, repo, pull_number: pull })
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetGithubCommit) {
            if (!github) {
                sendResponse({ error: noClientError })
                return false
            }
            const { owner, repo, sha } =
                message.data as MessageGetGithubCommitData
            github.rest.repos
                .getCommit({ owner, repo, ref: sha })
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetGithubUser) {
            if (!github) {
                sendResponse({ error: noClientError })
                return false
            }
            github.rest.users
                .getAuthenticated()
                .then(r => sendResponse(r.data))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetKittycadUser) {
            if (!kittycad) {
                sendResponse({ error: noClientError })
                return false
            }
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
            if (!kittycad || !github) {
                sendResponse({ error: noClientError })
                return false
            }
            const { owner, repo, sha, parentSha, file } =
                message.data as MessageGetFileDiff
            getFileDiff(github, kittycad, owner, repo, sha, parentSha, file)
                .then(r => sendResponse(r))
                .catch(error => sendResponse({ error }))
            return true
        }

        if (message.id === MessageIds.GetFileBlob) {
            if (!kittycad || !github) {
                sendResponse({ error: noClientError })
                return false
            }
            const { owner, repo, sha, filename } =
                message.data as MessageGetFileBlob
            getFileBlob(github, kittycad, owner, repo, sha, filename)
                .then(r => sendResponse(r))
                .catch(error => sendResponse({ error }))
            return true
        }
    }
)
