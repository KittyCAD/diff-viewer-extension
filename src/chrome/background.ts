// Will be needed for CORS to api.kittycad.io
import { Client, users } from "@kittycad/lib"
import { User_type } from "@kittycad/lib/dist/types/src/models";
import { Octokit } from "@octokit/rest";
import { DiffEntry, Message, MessageGetGithubPullFilesData, MessageIds, MessageResponse, MessageSaveGithubToken as MessageSaveToken, User } from "./types";
import { getStorageGithubToken, getStorageKittycadToken, setStorageGithubToken, setStorageKittycadToken } from "./storage";

let kittycad: Client;
let github: Octokit;

function checkClient(client: Client | Octokit) {
    if (!client) {
        throw Error("Uninitialized API client")
    }
}

async function initKittycadApi() {
    try {
        kittycad = new Client(await getStorageKittycadToken())
        const kittycadResponse = await users.get_user_self({ client: kittycad })
        console.log(`Logged in on kittycad.io as ${(kittycadResponse as User_type).email}`)
    } catch (e) {
        console.error("Couldn't initiate the kittycad api client")
    }
}

async function initGithubApi() {
    try {
        github = new Octokit({ auth: await getStorageGithubToken() })
        const octokitResponse = await github.rest.users.getAuthenticated()
        console.log(`Logged in on github.com as ${octokitResponse.data.login}`)
    } catch (e) {
        console.error("Couldn't initiate the github api client")
    }
}

async function getGithubPullFiles(owner: string, repo: string, pull: number): Promise<DiffEntry[]> {
    checkClient(github)
    const response = await github.rest.pulls.listFiles({ owner, repo, pull_number: pull })
    return response.data
}

async function getGithubUser(): Promise<User> {
    checkClient(github)
    const reponse = await github.rest.users.getAuthenticated()
    return reponse.data
}

async function getKittycadUser(): Promise<User_type> {
    checkClient(kittycad)
    const response = await users.get_user_self({ client: kittycad })
    return response as User_type
}

async function saveGithubToken(token: string): Promise<void> {
    await setStorageGithubToken(token)
    await initGithubApi()
}

async function saveKittycadToken(token: string): Promise<void> {
    await setStorageKittycadToken(token)
    await initKittycadApi()
}

(async () => {
    await initGithubApi()
    await initKittycadApi()
})()

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender,
                                      sendResponse: (response: MessageResponse) => void) => {
    console.log(`Received ${message.id} from ${sender.id}`)
    if (message.id === MessageIds.GetGithubPullFiles) {
        const { owner, repo, pull } = message.data as MessageGetGithubPullFilesData 
        getGithubPullFiles(owner, repo, pull).then(r => sendResponse(r)).catch(e => sendResponse(e))
        return true
    }

    if (message.id === MessageIds.GetGithubUser) {
        getGithubUser().then(r => sendResponse(r)).catch(e => sendResponse(e))
        return true
    }

    if (message.id === MessageIds.GetKittycadUser) {
        getKittycadUser().then(r => sendResponse(r)).catch(e => sendResponse(e))
        return true
    }

    if (message.id === MessageIds.SaveGithubToken) {
        const { token } = message.data as MessageSaveToken
        saveGithubToken(token).then(() => sendResponse({ token })).catch(e => sendResponse(e))
        return true
    }

    if (message.id === MessageIds.SaveKittycadToken) {
        const { token } = message.data as MessageSaveToken
        saveKittycadToken(token).then(() => sendResponse({ token })).catch(e => sendResponse(e))
        return true
    }
})
