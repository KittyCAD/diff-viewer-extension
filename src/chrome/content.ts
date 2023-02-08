// https://github.com/OctoLinker/injection
// maintained by octolinker, makes sure pages that are loaded through pjax are available for injection
// no ts support
const gitHubInjection = require("github-injection")

const supportedFileTypes = [".obj"]

function getElements(document: Document): HTMLElement[] {
    const fileTypeSelectors = supportedFileTypes.map(t => `[data-file-type="${t}"]`)
    const selector = `:is(${fileTypeSelectors.join(",")}) .js-file-content`
    return [...document.querySelectorAll(selector)].map(n => n as HTMLElement)
}

gitHubInjection(() => {
    const elements = getElements(window.document)
    console.log(`Found ${elements.length} elements`)
    for (const element of elements) {
        element.innerHTML = "kittycad material"
    }
    console.log("HTML updated")
})

export {}
