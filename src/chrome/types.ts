import { User_type } from "@kittycad/lib/dist/types/src/models";
import { components } from "@octokit/openapi-types";

// octokit

export type DiffEntry = components["schemas"]["diff-entry"]
export type User = components["schemas"]["simple-user"];


export enum MessageIds {
    GetGithubPullFiles = "GetPullFiles",
    GetGithubUser = "GetGitHubUser",
    SaveGithubToken = "SaveGitHubToken",
    SaveKittycadToken = "SaveKittyCadToken",
    GetKittycadUser = "GetKittyCadUser"
}


// chrome

export type MessageGetGithubPullFilesData = {
    owner: string
    repo: string
    pull: number
}

export type MessageSaveGithubToken = {
    token: string
}

export type Message = {
    id: MessageIds
    data?: MessageGetGithubPullFilesData | MessageSaveGithubToken
}

export type MessageResponse = DiffEntry[] | User | User_type | MessageSaveGithubToken | Error
