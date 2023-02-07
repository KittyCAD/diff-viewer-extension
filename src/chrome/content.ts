const gitHubInjection = require("github-injection") // no ts support

const supportedFileTypes = [".obj"]

function getElements(): HTMLElement[] {
    const reference = document
    const elements = []
    for (const type of supportedFileTypes) {
        const selector = `[data-file-type="${type}"] .js-file-content`
        const nodes = [...reference.querySelectorAll(selector)]
        elements.push(...nodes.map(n => n as HTMLElement))
    }
    return elements
}

gitHubInjection(() => {
    const elements = getElements()
    console.log(`Found ${elements.length} elements`)
    for (const element of elements) {
        element.innerHTML = "kittycad material"
    }
    console.log("HTML updated")
})

export {}
