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
                `--headless=new`, // the new headless arg for chrome v109+
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
    extensionId: async ({ background }, use) => {
        const extensionId = background.url().split('/')[2]
        await use(extensionId)
    },
})
export const expect = test.expect
