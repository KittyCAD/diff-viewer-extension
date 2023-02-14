import { components } from "@octokit/openapi-types";

// octokit

export type DiffEntry = components["schemas"]["diff-entry"]
export type User = components["schemas"]["simple-user"];


export enum MessageIds {
    GetPullFiles = "GetPullFiles",
    GetGitHubUser = "GetGitHubUser"
}


// chrome

export type MessageGetPullFilesData = {
    owner: string
    repo: string
    pull: number
}

export type Message = {
    id: MessageIds
    data?: MessageGetPullFilesData
}

export type MessageResponse = DiffEntry[] | User
