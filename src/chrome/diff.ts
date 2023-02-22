import { Octokit } from "@octokit/rest"
import { Client, file } from '@kittycad/lib'
import { ContentFile } from "./types"
import { FileExportFormat_type, FileImportFormat_type } from "@kittycad/lib/dist/types/src/models"

// TODO: check if we could get that from the library
export const supportedSrcFormats = new Set(["dae", "dxf", "fbx", "obj", "obj_nomtl", "step", "stl", "svg"])

export async function downloadFile(octokit: Octokit, owner: string, repo: string,
    ref: string, path: string): Promise<string> {
    // First get some info on the blob with the Contents api
    // TODO: remove no-cache for prod, this is to make sure back to back query work as the download_url token is short-lived
    const content = await octokit.rest.repos.getContent({
        owner, repo, path, ref,
        request: { cache: "reload" }
    })
    const contentFile = content.data as ContentFile

    if (!contentFile.download_url) {
        throw Error(`No download URL associated with ${path} at ${ref}`)
    }

    // Then actually use the download_url (that supports LFS files and has a direct download token) to write the file
    console.log(`Downloading ${contentFile.download_url}...`)
    const response = await fetch(contentFile.download_url)
    if (!response.ok) throw response
    return await response.text()
}

export async function convert(client: Client, body: string, srcFormat: string, outputFormat = "stl") {
    const response = await file.create_file_conversion({
        client, body,
        src_format: srcFormat as FileImportFormat_type,
        output_format: outputFormat as FileExportFormat_type,
    })
    if ("error_code" in response) throw response
    const { status, id, output } = response
    console.log(`File conversion id: ${id}`)
    console.log(`File conversion status: ${status}`)
    return output
}
