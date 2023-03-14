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

test('pull request diff with an .obj file', async ({
    page,
    authorizedBackground,
}) => {
    page.on('console', msg => console.log(msg.text()))

    await page.goto('https://github.com/KittyCAD/kittycad.ts/pull/3/files')
    const element = await page.waitForSelector('.js-file-content canvas')
    await page.waitForTimeout(1000) // making sure the element fully settled in
    const screenshot = await element.screenshot()
    expect(screenshot).toMatchSnapshot()
})

test('commit diff with an .obj file', async ({
    page,
    authorizedBackground,
}) => {
    page.on('console', msg => console.log(msg.text()))

    await page.goto(
        'https://github.com/KittyCAD/kittycad.ts/commit/08b50ee5a23b3ae7dd7b19383f14bbd520079cc1'
    )
    const element = await page.waitForSelector('.js-file-content canvas')
    await page.waitForTimeout(1000) // making sure the element fully settled in
    const screenshot = await element.screenshot()
    expect(screenshot).toMatchSnapshot()
})
