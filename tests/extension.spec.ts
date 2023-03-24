import { Page } from '@playwright/test'
import { test, expect } from './fixtures'

test('popup page', async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`)
    await expect(page.locator('body')).toContainText('Enter a GitHub token')
    await expect(page.locator('body')).toContainText('Enter a KittyCAD token')
})

test('authorized popup page', async ({
    page,
    extensionId,
    authorizedBackground,
}) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`)
    await page.waitForSelector('button')
    await expect(page.locator('body')).toContainText('Sign out')
    await expect(page.locator('button')).toHaveCount(2)
})

async function getFirstDiffScreenshot(page: Page, url: string) {
    page.on('console', msg => console.log(msg.text()))
    await page.goto(url)

    // waiting for the canvas (that holds the diff) to show up
    await page.waitForSelector(
        '.js-file[data-file-type=".obj"] .js-file-content canvas'
    )

    // screenshot the file diff with its toolbar
    const element = await page.waitForSelector(
        '.js-file[data-file-type=".obj"]'
    )
    await page.waitForTimeout(1000) // making sure the element fully settled in
    return await element.screenshot()
}

test('pull request diff with an .obj file', async ({
    page,
    authorizedBackground,
}) => {
    const url = 'https://github.com/KittyCAD/kittycad.ts/pull/3/files'
    const screenshot = await getFirstDiffScreenshot(page, url)
    expect(screenshot).toMatchSnapshot()
})

test('commit diff with an .obj file', async ({
    page,
    authorizedBackground,
}) => {
    const url =
        'https://github.com/KittyCAD/kittycad.ts/commit/08b50ee5a23b3ae7dd7b19383f14bbd520079cc1'
    const screenshot = await getFirstDiffScreenshot(page, url)
    expect(screenshot).toMatchSnapshot()
})
