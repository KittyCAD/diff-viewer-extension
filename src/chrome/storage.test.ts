import { getStorageGithubToken, getStorageKittycadToken, setStorageGithubToken, setStorageKittycadToken }  from "./storage"

it("saves github token to storage", async () => {
  await setStorageGithubToken("token") 
  expect(chrome.storage.local.set).toHaveBeenCalledWith({ "gtk": "token" })
})

it("reads github token from storage", () => {
  getStorageGithubToken()
  expect(chrome.storage.local.get).toHaveBeenCalled()
  // TODO: improve
})

it("saves kittycad token to storage", async () => {
  await setStorageKittycadToken("token") 
  expect(chrome.storage.local.set).toHaveBeenCalledWith({ "ktk": "token" })
})

it("reads kittycad token from storage", () => {
  getStorageKittycadToken()
  expect(chrome.storage.local.get).toHaveBeenCalled()
  // TODO: improve
})
