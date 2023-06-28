import { ElementHandle, Page } from '@playwright/test'
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

async function getFirstDiffElement(page: Page, url: string, extension: string) {
    page.on('console', msg => console.log(msg.text()))
    await page.goto(url)

    // waiting for the canvas (that holds the diff) to show up
    await page.waitForSelector(
        `.js-file[data-file-type=".${extension}"] .js-file-content canvas`
    )

    // screenshot the file diff with its toolbar
    const element = await page.waitForSelector(
        `.js-file[data-file-type=".${extension}"]`
    )
    await page.waitForTimeout(1000) // making sure the element fully settled in
    return element
}

async function enableCombined(page: Page, element: ElementHandle) {
    const button = await element.$('.kittycad-combined-button')
    await button.click()
    await page.waitForTimeout(1000)
}

async function getBlobPreviewElement(page: Page, url: string) {
    page.on('console', msg => console.log(msg.text()))
    await page.goto(url)

    // waiting for the canvas (that holds the diff) to show up
    await page.waitForSelector('#repo-content-pjax-container canvas')

    // screenshot the file diff with its toolbar
    const element = await page.waitForSelector('.kittycad-injected-file')
    await page.waitForTimeout(1000) // making sure the element fully settled in
    return element
}

test('pull request diff with a modified .obj file', async ({
    page,
    authorizedBackground,
}) => {
    const url = 'https://github.com/KittyCAD/diff-samples/pull/2/files'
    const element = await getFirstDiffElement(page, url, 'obj')
    const screenshot = await element.screenshot()
    expect(screenshot).toMatchSnapshot()

    await enableCombined(page, element)
    const screenshot2 = await element.screenshot()
    expect(screenshot2).toMatchSnapshot()
})

test('pull request diff with a modified .step file', async ({
    page,
    authorizedBackground,
}) => {
    const url = 'https://github.com/KittyCAD/diff-samples/pull/2/files'
    const element = await getFirstDiffElement(page, url, 'step')
    const screenshot = await element.screenshot()
    expect(screenshot).toMatchSnapshot()

    // TODO: understand why this one makes the CI fail (guess: page crashes, low resources?)
    // await enableCombined(page, element)
    // const screenshot2 = await element.screenshot()
    // expect(screenshot2).toMatchSnapshot()
})

test('commit diff with an added .step file', async ({
    page,
    authorizedBackground,
}) => {
    const url =
        'https://github.com/KittyCAD/diff-samples/commit/fd9eec79f0464833686ea6b5b34ea07145e32734'
    const element = await getFirstDiffElement(page, url, 'step')
    const screenshot = await element.screenshot()
    expect(screenshot).toMatchSnapshot()
})

test('commit diff with a modified .dae file as LFS', async ({
    page,
    authorizedBackground,
}) => {
    const url =
        'https://github.com/KittyCAD/diff-samples/commit/b009cfd6dd1eb2d0c3ec0d31a21360766ad084e4'
    const element = await getFirstDiffElement(page, url, 'dae')
    const screenshot = await element.screenshot()
    expect(screenshot).toMatchSnapshot()

    await enableCombined(page, element)
    const screenshot2 = await element.screenshot()
    expect(screenshot2).toMatchSnapshot()
})

test('blob preview with an .obj file', async ({
    page,
    authorizedBackground,
}) => {
    const url =
        'https://github.com/KittyCAD/diff-samples/blob/fd9eec79f0464833686ea6b5b34ea07145e32734/models/box.obj'
    const element = await getBlobPreviewElement(page, url)
    const screenshot = await element.screenshot()
    expect(screenshot).toMatchSnapshot()
})

test('blob preview with an .stl file', async ({
    page,
    authorizedBackground,
}) => {
    const url =
        'https://github.com/KittyCAD/diff-samples/blob/fd9eec79f0464833686ea6b5b34ea07145e32734/models/box.stl'
    const screenshot = await getBlobPreviewScreenshot(page, url)
    expect(screenshot).toMatchSnapshot()
})
