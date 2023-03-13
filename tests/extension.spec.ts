import { test, expect } from './fixtures'

test('signed-out popup page', async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`)
    await expect(page.locator('body')).toContainText('Enter a GitHub token')
    await expect(page.locator('body')).toContainText('Enter a KittyCAD token')
})

test('pull request diff with an .obj file', async ({ page, background }) => {
    page.on('console', msg => console.log(msg.text()))

    // Load the env tokens in storage for auth 
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

    // Wait for background auth
    await page.waitForTimeout(1000)

    // Check the diff
    await page.goto('https://github.com/KittyCAD/kittycad.ts/pull/3/files')
    await page.waitForSelector('.js-file-content canvas')
})
