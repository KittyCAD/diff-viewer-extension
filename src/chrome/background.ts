import { Client, users } from '@kittycad/lib'
import { Octokit } from '@octokit/rest'
import {
    KittycadUser,
    Message,
    MessageGetFileDiff,
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

let github: Octokit
let kittycad: Client

async function initGithubApi() {
    try {
        github = new Octokit({ auth: await getStorageGithubToken() })
        const octokitResponse = await github.rest.users.getAuthenticated()
        console.log(`Logged in on github.com as ${octokitResponse.data.login}`)
    } catch (e) {
        console.log('Couldnt initiate the github api client')
    }
}

async function initKittycadApi() {
    try {
        kittycad = new Client(await getStorageKittycadToken())
        const kittycadResponse = await users.get_user_self({ client: kittycad })
        console.log(
            `Logged in on kittycad.io as ${
                (kittycadResponse as KittycadUser).email
            }`
        )
    } catch (e) {
        console.log("Couldn't initiate the kittycad api client")
    }
}

async function saveGithubTokenAndReload(token: string): Promise<void> {
    await setStorageGithubToken(token)
    await initGithubApi()
}

async function saveKittycadTokenAndReload(token: string): Promise<void> {
    await setStorageKittycadToken(token)
    await initKittycadApi()
}

;(async () => {
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
            const { owner, repo, pull } =
                message.data as MessageGetGithubPullFilesData
            github.rest.pulls
                .listFiles({ owner, repo, pull_number: pull })
                .then(r => sendResponse(r.data))
                .catch(e => sendResponse(e))
            return true
        }

        if (message.id === MessageIds.GetGithubPull) {
            const { owner, repo, pull } =
                message.data as MessageGetGithubPullFilesData
            github.rest.pulls
                .get({ owner, repo, pull_number: pull })
                .then(r => sendResponse(r.data))
                .catch(e => sendResponse(e))
            return true
        }

        if (message.id === MessageIds.GetGithubUser) {
            github.rest.users
                .getAuthenticated()
                .then(r => sendResponse(r.data))
                .catch(e => sendResponse(e))
            return true
        }

        if (message.id === MessageIds.GetKittycadUser) {
            users
                .get_user_self({ client: kittycad })
                .then(r => sendResponse(r as KittycadUser))
                .catch(e => sendResponse(e))
            return true
        }

        if (message.id === MessageIds.SaveGithubToken) {
            const { token } = message.data as MessageSaveToken
            saveGithubTokenAndReload(token)
                .then(() => sendResponse({ token }))
                .catch(e => sendResponse(e))
            return true
        }

        if (message.id === MessageIds.SaveKittycadToken) {
            const { token } = message.data as MessageSaveToken
            saveKittycadTokenAndReload(token)
                .then(() => sendResponse({ token }))
                .catch(e => sendResponse(e))
            return true
        }

        if (message.id === MessageIds.GetFileDiff) {
            const { owner, repo, sha, parentSha, file } =
                message.data as MessageGetFileDiff
            getFileDiff(github, kittycad, owner, repo, sha, parentSha, file)
                .then(r => sendResponse(r))
                .catch(e => sendResponse(e))
            return true
        }
    }
)
