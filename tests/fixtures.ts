// From https://playwright.dev/docs/chrome-extensions#testing
import {
    test as base,
    chromium,
    Worker,
    type BrowserContext,
} from '@playwright/test'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv'
dotenv.config()

export const test = base.extend<{
    context: BrowserContext
    extensionId: string
    background: Worker
    authorizedBackground: Worker
}>({
    context: async ({}, use) => {
        // Due to change to type: module, https://stackoverflow.com/a/50052194
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const pathToExtension = path.join(__dirname, '..', 'build')
        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--headless=new`, // headless mode that allows for extensions
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        })
        await use(context)
        await context.close()
    },
    background: async ({ context }, use) => {
        let [background] = context.serviceWorkers()
        if (!background)
            background = await context.waitForEvent('serviceworker')

        // Wait for the chrome object to be available
        await new Promise(resolve => setTimeout(resolve, 100))
        await use(background)
    },
    authorizedBackground: async ({ background }, use) => {
        // Load the env tokens in storage for auth
        const githubToken = process.env.GITHUB_TOKEN
        const kittycadToken = process.env.KITTYCAD_TOKEN
        await background.evaluate(
            async ([githubToken, kittycadToken]) => {
                await chrome.storage.local.set({
                    ktk: kittycadToken, // from src/chrome/storage.ts
                    gtk: githubToken, // from src/chrome/storage.ts
                })
            },
            [githubToken, kittycadToken]
        )

        // Wait for background auth
        await new Promise(resolve => setTimeout(resolve, 2000))
        await use(background)
    },
    extensionId: async ({ background }, use) => {
        const extensionId = background.url().split('/')[2]
        await use(extensionId)
    },
})
export const expect = test.expect
