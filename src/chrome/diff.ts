import { Octokit } from "@octokit/rest"
import { ContentFile } from "./types"


// TODO: check if we could get that from the library
export const supportedSrcFormats = new Set(["dae", "dxf", "fbx", "obj", "obj_nomtl", "step", "stl", "svg"])

export async function downloadFile(octokit: Octokit, owner: string, repo: string, ref: string, path: string) {
    // First get some info on the blob with the Contents api
    const content = await octokit.rest.repos.getContent({ owner, repo, path, ref })
    const contentFile = content.data as ContentFile

    if (!contentFile.download_url) {
        throw Error(`No download URL associated with ${path} at ${ref}`)
    }

    // Then actually use the download_url (that supports LFS files and has a direct download token) to write the file
    console.log(`Downloading ${contentFile.download_url}...`)
    const response = await fetch(contentFile.download_url)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    console.log(response.body)
}
