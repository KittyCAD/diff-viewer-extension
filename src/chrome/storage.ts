export function setStorageToken(token: string): Promise<void> {
    return chrome.storage.local.set({ token })
}

export function getStorageToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        chrome.storage.local.get(["token"], (result) => {
            if (result && result.token) {
                resolve(result.token)
            } else {
                reject("Empty token")
            }
        })
    })
}
