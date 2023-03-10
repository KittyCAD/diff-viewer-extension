import { test, expect } from './fixtures'

test('popup page', async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`)
    await expect(page.locator('body')).toContainText('Enter a GitHub token')
    await expect(page.locator('body')).toContainText('Enter a KittyCAD token')
})

test('content script', async ({ page, background }) => {
    console.log(`Background script loaded: ${background.url()}`)
    page.on('console', msg => console.log(msg.text()))
    await page.goto('https://github.com/KittyCAD/kittycad.ts/pull/3/files')
    await page.waitForTimeout(10000)
})
