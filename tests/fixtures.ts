// From https://playwright.dev/docs/chrome-extensions#testing
import {
    test as base,
    chromium,
    Worker,
    type BrowserContext,
} from '@playwright/test'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()

export const test = base.extend<{
    context: BrowserContext
    extensionId: string
    background: Worker
}>({
    context: async ({}, use) => {
        const pathToExtension = path.join(__dirname, '..', 'build')
        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--headless=new`, // the new headless arg for chrome v109+. Use '--headless=chrome' as arg for browsers v94-108.
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

        await new Promise(resolve => setTimeout(resolve, 100))
        const githubToken = process.env.GITHUB_TOKEN
        const kittycadToken = process.env.KITTYCAD_TOKEN
        await background.evaluate(
            async ([githubToken, kittycadToken]) => {
                await chrome.storage.local.set({
                    ktk: kittycadToken,
                    gtk: githubToken,
                })
            },
            [githubToken, kittycadToken]
        )
        await use(background)
    },
    extensionId: async ({ background }, use) => {
        const extensionId = background.url().split('/')[2]
        await use(extensionId)
    },
})
export const expect = test.expect
