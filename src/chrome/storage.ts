enum TokenKeys {
    Github = "gtk",
    Kittycad = "ktk",
}

function setStorage(key: TokenKeys, value: string): Promise<void> {
    return chrome.storage.local.set({ [key]: value })
}

function getStorage(key: TokenKeys): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (result && result[key]) {
                resolve(result[key])
            } else {
                reject("Empty token")
            }
        })
    })
}

export function setStorageGithubToken(token: string): Promise<void> {
    return setStorage(TokenKeys.Github, token)
}

export function getStorageGithubToken(): Promise<string> {
    return getStorage(TokenKeys.Github)
}

export function setStorageKittycadToken(token: string): Promise<void> {
    return setStorage(TokenKeys.Kittycad, token)
}

export function getStorageKittycadToken(): Promise<string> {
    return getStorage(TokenKeys.Kittycad)
}
