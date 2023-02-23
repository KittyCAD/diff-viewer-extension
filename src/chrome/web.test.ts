import { DiffEntry } from "./types";
import { getElementFilename, getGithubUrlParams, getInjectablePullElements, getWebPullElements } from "./web"

const githubPullHtmlSnippet = `
<div class="file js-file js-details-container js-targetable-element show-inline-notes Details Details--on open js-tagsearch-file" data-file-type=".obj">
  <div class="file-header d-flex flex-md-row flex-column flex-md-items-center file-header--expandable js-file-header js-skip-tagsearch sticky-file-header js-position-sticky js-position-sticky-stacked">
    <div class="file-info flex-auto min-width-0 mb-md-0 mb-2">
      <span class="Truncate">
        <a title="samples/file_center_of_mass/output.obj" class="Link--primary Truncate-text" href="#diff-5f8df244900f6383db3354c02b8a984a044b272e6bfe4cacc1ec8d4892ad3e21">samples/file_center_of_mass/output.obj</a>
      </span>
    </div>
  </div>

  <div class="js-file-content Details-content--hidden position-relative">
    <div class="data highlight empty">
      Git LFS file not shown
    </div>
  </div>
</div>
`  // from https://github.com/KittyCAD/litterbox/pull/95/files
const parser = new DOMParser();
const githubPullHtmlDocument = parser.parseFromString(githubPullHtmlSnippet, "text/html");

const githubPullFilesSample: DiffEntry[] = [
  {
    "sha": "2f35d962a711bea7a8bf57481b8717f7dedbe1c5",
    "filename": "samples/file_center_of_mass/output.obj",
    "status": "modified",
    "additions": 2,
    "deletions": 2,
    "changes": 4,
    "blob_url": "https://github.com/KittyCAD/litterbox/blob/11510a02d8294cac5943b8ebdc416170f5b738b5/samples%2Ffile_center_of_mass%2Foutput.obj",
    "raw_url": "https://github.com/KittyCAD/litterbox/raw/11510a02d8294cac5943b8ebdc416170f5b738b5/samples%2Ffile_center_of_mass%2Foutput.obj",
    "contents_url": "https://api.github.com/repos/KittyCAD/litterbox/contents/samples%2Ffile_center_of_mass%2Foutput.obj?ref=11510a02d8294cac5943b8ebdc416170f5b738b5",
    "patch": "@@ -1,3 +1,3 @@\n version https://git-lfs.github.com/spec/v1\n-oid sha256:2a07f53add3eee88b80a0bbe0412cf91df3d3bd9d45934ce849e0440eff90ee1\n-size 62122\n+oid sha256:0c0eb961e7e0589d83693335408b90d3b8adae9f4054c3e396c6eedbc5ed16ec\n+size 62545"
  },
]

it("gets params out of a github pull request link", () => {
  expect(getGithubUrlParams("http://google.com")).toBeUndefined()
  expect(getGithubUrlParams("https://github.com/KittyCAD/litterbox")).toBeUndefined()

  const pullUrl = "https://github.com/KittyCAD/litterbox/pull/95/files"
  const params = getGithubUrlParams(pullUrl)
  expect(params).toBeDefined()
  const { owner, repo, pull } = params!
  expect(owner).toEqual("KittyCAD")
  expect(repo).toEqual("litterbox")
  expect(pull).toEqual(95)
})

it("finds web elements for supported files", () => {
  const elements = getWebPullElements(githubPullHtmlDocument)
  expect(elements).toHaveLength(1)
})

it("finds the filename of a supported file element", () => {
  const elements = getWebPullElements(githubPullHtmlDocument)
  const filename = getElementFilename(elements[0])
  expect(filename).toEqual("samples/file_center_of_mass/output.obj")
})

it("finds injectable elements from html and api results", () => {
  const elements = getWebPullElements(githubPullHtmlDocument)
  const injectableElements = getInjectablePullElements(elements, githubPullFilesSample)
  expect(injectableElements).toHaveLength(1)
  const { element, file } = injectableElements[0]
  expect(element).toBeDefined()
  expect(file).toBeDefined()
})
