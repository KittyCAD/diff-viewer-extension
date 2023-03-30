import { Octokit } from '@octokit/rest'
import { Client, file } from '@kittycad/lib'
import { ContentFile, DiffEntry, FileDiff } from './types'
import {
    FileExportFormat_type,
    FileImportFormat_type,
} from '@kittycad/lib/dist/types/src/models'

export const extensionToSrcFormat: {
    [extension: string]: FileImportFormat_type
} = {
    'dae': 'dae',
    'dxf': 'dxf',
    'fbx': 'fbx',
    'obj': 'obj',
    'stp': 'step',
    'step': 'step',
    'svg': 'svg',
    // stl  disabled for now as there's some GitHub support for them already, see #40
}

export function isFilenameSupported(filename: string): boolean{
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
    outputFormat = 'stl'
) {
    // TODO: think about the best output format for visual diff injection, now defaults to STL
    const response = await file.create_file_conversion({
        client,
        body,
        src_format: extensionToSrcFormat[extension],
        output_format: outputFormat as FileExportFormat_type,
    })
    if ('error_code' in response) throw response
    const { status, id, output } = response
    console.log(`File conversion id: ${id}`)
    console.log(`File conversion status: ${status}`)
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
            `Unsupported extension. Given ${extension}, was expecting ${Object.keys(extensionToSrcFormat)}`
        )
    }

    if (status === 'modified') {
        const beforeBlob = await downloadFile(
            github,
            owner,
            repo,
            sha,
            filename
        )
        const before = await convert(kittycad, beforeBlob, extension)
        const afterBlob = await downloadFile(
            github,
            owner,
            repo,
            parentSha,
            filename
        )
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
