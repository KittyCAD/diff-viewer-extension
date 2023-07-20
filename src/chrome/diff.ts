import { Octokit } from '@octokit/rest'
import { api_calls, Client, file } from '@kittycad/lib'
import { ContentFile, DiffEntry, FileBlob, FileDiff } from './types'
import {
    FileExportFormat_type,
    FileImportFormat_type,
} from '@kittycad/lib/dist/types/src/models'
import { Buffer } from 'buffer'

export const extensionToSrcFormat: {
    [extension: string]: FileImportFormat_type
} = {
    dae: 'dae',
    dxf: 'dxf',
    fbx: 'fbx',
    obj: 'obj',
    stl: 'stl',
    stp: 'step',
    step: 'step',
    svg: 'svg',
}

export function isFilenameSupported(filename: string): boolean {
    const extension = filename.split('.').pop()
    return !!(extension && extensionToSrcFormat[extension])
}

export async function downloadFile(
    octokit: Octokit,
    owner: string,
    repo: string,
    ref: string,
    path: string
): Promise<string> {
    // First get some info on the blob with the Contents api
    const content = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
        request: { cache: 'reload' }, // download_url provides a token that seems very short-lived
    })
    const contentFile = content.data as ContentFile

    if (!contentFile.download_url) {
        throw Error(`No download URL associated with ${path} at ${ref}`)
    }

    // Then actually use the download_url (that supports LFS files and has a token) to write the file
    console.log(`Downloading ${contentFile.download_url}...`)
    const response = await fetch(contentFile.download_url)
    if (!response.ok) throw response
    return await response.text()
}

async function convert(
    client: Client,
    body: string,
    extension: string,
    outputFormat = 'obj'
) {
    if (extension === outputFormat) {
        console.log(
            'Skipping conversion, as extension is equal to outputFormat'
        )
        return Buffer.from(body).toString('base64')
    }
    const response = await file.create_file_conversion({
        client,
        body,
        src_format: extensionToSrcFormat[extension],
        output_format: outputFormat as FileExportFormat_type,
    })
    if ('error_code' in response) throw response
    const { id } = response
    let { status, output } = response
    console.log(`File conversion id: ${id}`)
    console.log(`File conversion status: ${status}`)
    let retries = 0
    while (status !== 'Completed') {
        if (retries >= 60) {
            console.log('Async conversion took too long, aborting.')
            break
        }
        retries++
        await new Promise(resolve => setTimeout(resolve, 1000))
        const response = await api_calls.get_async_operation({ client, id })
        if ('error_code' in response) throw response
        status = response.status
        console.log(`File conversion status: ${status} (retry #${retries})`)
        if ('output' in response) {
            output = response.output
        }
    }
    return output
}

export async function getFileDiff(
    github: Octokit,
    kittycad: Client,
    owner: string,
    repo: string,

    sha: string,
    parentSha: string,
    file: DiffEntry
): Promise<FileDiff> {
    const { filename, status } = file
    const extension = filename.split('.').pop()
    if (!extension || !extensionToSrcFormat[extension]) {
        throw Error(
            `Unsupported extension. Given ${extension}, was expecting ${Object.keys(
                extensionToSrcFormat
            )}`
        )
    }

    if (status === 'modified') {
        const beforeBlob = await downloadFile(
            github,
            owner,
            repo,
            parentSha,
            filename
        )
        const before = await convert(kittycad, beforeBlob, extension)
        const afterBlob = await downloadFile(github, owner, repo, sha, filename)
        const after = await convert(kittycad, afterBlob, extension)
        return { before, after }
    }

    if (status === 'added') {
        const blob = await downloadFile(github, owner, repo, sha, filename)
        const after = await convert(kittycad, blob, extension)
        return { after }
    }

    if (status === 'removed') {
        const blob = await downloadFile(
            github,
            owner,
            repo,
            parentSha,
            filename
        )
        const before = await convert(kittycad, blob, extension)
        return { before }
    }

    throw Error(`Unsupported status: ${status}`)
}

export async function getFileBlob(
    github: Octokit,
    kittycad: Client,
    owner: string,
    repo: string,
    sha: string,
    filename: string
): Promise<FileBlob> {
    const extension = filename.split('.').pop()
    if (!extension || !extensionToSrcFormat[extension]) {
        throw Error(
            `Unsupported extension. Given ${extension}, was expecting ${Object.keys(
                extensionToSrcFormat
            )}`
        )
    }

    const rawBlob = await downloadFile(github, owner, repo, sha, filename)
    const blob = await convert(kittycad, rawBlob, extension)
    return { blob }
}
