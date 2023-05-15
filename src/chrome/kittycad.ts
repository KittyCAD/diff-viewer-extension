// Functions from kittycad.ts but without node-fetch
import {
    FileConversion_type,
    Error_type,
    FileExportFormat_type,
    FileImportFormat_type,
    User_type,
} from '@kittycad/lib/dist/types/src/models'
import { Client } from '@kittycad/lib'

interface Get_user_self_params {
    client?: Client
}

type Get_user_self_return = User_type | Error_type

async function get_user_self({
    client,
}: Get_user_self_params = {}): Promise<Get_user_self_return> {
    const url = `/user`
    const urlBase = 'https://api.kittycad.io'
    const fullUrl = urlBase + url
    const kittycadToken = client?.token
    const headers = {
        Authorization: `Bearer ${kittycadToken}`,
    }
    const fetchOptions = {
        method: 'GET',
        headers,
    }
    const response = await fetch(fullUrl, fetchOptions)
    const result = (await response.json()) as Get_user_self_return
    return result
}

export const users = { get_user_self }

interface Create_file_conversion_params {
    client?: Client
    output_format: FileExportFormat_type
    src_format: FileImportFormat_type
    body: string
}

type Create_file_conversion_return = FileConversion_type | Error_type

export default async function create_file_conversion({
    client,
    output_format,
    src_format,
    body,
}: Create_file_conversion_params): Promise<Create_file_conversion_return> {
    const url = `/file/conversion/${src_format}/${output_format}`
    const urlBase = process?.env?.BASE_URL || 'https://api.kittycad.io'
    const fullUrl = urlBase + url
    const kittycadToken = client
        ? client.token
        : process.env.KITTYCAD_TOKEN || ''
    const headers = {
        Authorization: `Bearer ${kittycadToken}`,
    }
    const fetchOptions = {
        method: 'POST',
        headers,
        body,
    }
    const response = await fetch(fullUrl, fetchOptions)
    const result = (await response.json()) as Create_file_conversion_return
    return result
}

export const file = { create_file_conversion }
