// Will be needed for CORS to api.kittycad.io
import { Client, users } from "@kittycad/lib"
import { User_type } from "@kittycad/lib/dist/types/src/models";
import { Octokit } from "@octokit/rest";
import { MessageIds } from "./messages";
import { getStorageToken } from "./storage";

let kittycad: Client;
let octokit: Octokit;

async function initAPIs() {
    kittycad = new Client("c2703952-ad53-470e-a51a-71fafad1a16d");
    const kittycadResponse = await users.get_user_self({ client: kittycad })
    console.log(`Logged in on kittycad.io as ${(kittycadResponse as User_type).email}`)

    octokit = new Octokit({ auth: await getStorageToken() })
    const octokitResponse = await octokit.rest.users.getAuthenticated()
    console.log(`Logged in on github.com as ${octokitResponse.data.login}`)
}

async function getPullFiles(owner: string, repo: string, pull: number) {
    if (!octokit) {
        throw Error("Octokit client undefined")
    }
    const response = await octokit.rest.pulls.listFiles({ owner, repo, pull_number: pull })
    return response.data
}

initAPIs()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`Received ${message.id} from ${sender.id}`)
    if (message.id === MessageIds.GetPullFiles) {
        const { owner, repo, pull } = message
        getPullFiles(owner, repo, pull).then(r => sendResponse(r))
        return true
    }
})
