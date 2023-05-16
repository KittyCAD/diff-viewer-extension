import { User_type } from '@kittycad/lib/dist/types/src/models'
import { components } from '@octokit/openapi-types'

// kittycad

export type KittycadUser = User_type

// octokit

export type DiffEntry = components['schemas']['diff-entry']
export type ContentFile = components['schemas']['content-file']
export type User = components['schemas']['simple-user']
export type Pull = components['schemas']['pull-request']
export type Commit = components['schemas']['commit']

// chrome extension

export type FileDiff = {
    before?: string
    after?: string
}

export enum MessageIds {
    GetGithubPullFiles = 'GetPullFiles',
    GetGithubUser = 'GetGitHubUser',
    SaveGithubToken = 'SaveGitHubToken',
    SaveKittycadToken = 'SaveKittyCadToken',
    GetKittycadUser = 'GetKittyCadUser',
    GetFileDiff = 'GetFileDiff',
    GetGithubPull = 'GetGithubPull',
    GetGithubCommit = 'GetGithubCommit',
}

export type MessageGetGithubPullFilesData = {
    owner: string
    repo: string
    pull: number
}

export type MessageGetGithubCommitData = {
    owner: string
    repo: string
    sha: string
}

export type MessageGetFileDiff = {
    owner: string
    repo: string
    sha: string
    parentSha: string
    file: DiffEntry
}

export type MessageSaveToken = {
    token: string
}

export type MessageError = {
    error: Error
}

export type Message = {
    id: MessageIds
    data?:
        | MessageGetGithubPullFilesData
        | MessageGetGithubCommitData
        | MessageSaveToken
        | MessageGetFileDiff
}

export type MessageResponse =
    | DiffEntry[]
    | Pull
    | Commit
    | User
    | KittycadUser
    | MessageSaveToken
    | FileDiff
    | MessageError
    | void
