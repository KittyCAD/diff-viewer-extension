// Will be needed for CORS to api.kittycad.io
import { Client, users } from "@kittycad/lib"
import { User_type } from "@kittycad/lib/dist/types/src/models";
import { Octokit } from "@octokit/rest";
import { DiffEntry, Message, MessageGetPullFilesData, MessageIds, MessageResponse, User } from "./types";
import { getStorageToken } from "./storage";

let kittycad: Client;
let octokit: Octokit;

async function initAPIs() {
    try {
        kittycad = new Client("<REVOKEDTOKEN>")
        const kittycadResponse = await users.get_user_self({ client: kittycad })
        console.log(`Logged in on kittycad.io as ${(kittycadResponse as User_type).email}`)
    } catch (e) {
        console.error("Couldn't initiate the kittycad api client")
    }

    try {
        octokit = new Octokit({ auth: await getStorageToken() })
        const octokitResponse = await octokit.rest.users.getAuthenticated()
        console.log(`Logged in on github.com as ${octokitResponse.data.login}`)
    } catch (e) {
        console.error("Couldn't initiate the github api client")
    }
}

async function getGitHubPullFiles(owner: string, repo: string, pull: number): Promise<DiffEntry[]> {
    if (!octokit) {
        throw Error("Octokit client undefined")
    }
    const response = await octokit.rest.pulls.listFiles({ owner, repo, pull_number: pull })
    return response.data
}

async function getGitHubUser(): Promise<User> {
    if (!octokit) {
        throw Error("Octokit client undefined")
    }
    const reponse = await octokit.rest.users.getAuthenticated()
    return reponse.data
}

initAPIs()

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender,
                                      sendResponse: (response: MessageResponse) => void) => {
    console.log(`Received ${message.id} from ${sender.id}`)
    if (message.id === MessageIds.GetPullFiles) {
        const { owner, repo, pull } = message.data as MessageGetPullFilesData
        getGitHubPullFiles(owner, repo, pull).then(r => sendResponse(r))
        return true
    }

    if (message.id === MessageIds.GetGitHubUser) {
        getGitHubUser().then(r => sendResponse(r))
        return true
    }
})
