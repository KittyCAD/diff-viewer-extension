import { DiffEntry } from './types'
import {
    getElementFilename,
    getGithubCommitUrlParams,
    getGithubPullUrlParams,
    mapInjectableDiffElements,
    getSupportedWebDiffElements,
} from './web'

const githubPullHtmlSnippet = `
<div class="file js-file js-details-container js-targetable-element show-inline-notes" data-file-type=".json" data-file-deleted="false" data-tagsearch-path="samples/file_center_of_mass/output.json" data-tagsearch-lang="JSON" data-targets="diff-file-filter.diffEntries">
  <div class="file-header d-flex flex-md-row flex-column flex-md-items-center file-header--expandable js-file-header js-skip-tagsearch " data-path="samples/file_center_of_mass/output.json" data-short-path="d89089c" data-anchor="diff-d89089cdcbd5a582129d743fc2075f581b836b24449a9121741fb0cf3a0d2d6a" data-file-type=".json" data-file-deleted="false">
    <div class="file-info flex-auto min-width-0 mb-md-0 mb-2">
      <span class="Truncate">
        <a title="samples/file_center_of_mass/output.json" class="Link--primary Truncate-text" href="#diff-d89089cdcbd5a582129d743fc2075f581b836b24449a9121741fb0cf3a0d2d6a">samples/file_center_of_mass/output.json</a>
      </span>
    </div>
  <div class="js-file-content Details-content--hidden position-relative" data-hydro-view="{&quot;event_type&quot;:&quot;pull_request.select_diff_range&quot;,&quot;payload&quot;:{&quot;actor_id&quot;:10795683,&quot;pull_request_id&quot;:null,&quot;repository_id&quot;:null,&quot;diff_type&quot;:&quot;UNIFIED&quot;,&quot;whitespace_ignored&quot;:false,&quot;originating_url&quot;:&quot;https://github.com/KittyCAD/litterbox/commit/4ddf899550addf41d6bf1b790ce79e46501411b3&quot;,&quot;user_id&quot;:10795683}}" data-hydro-view-hmac="b6535795e68e5dd0e53ae9bd5b04079139f4936d41dd643d1aefcf398e9a685e">
    <div class="data highlight js-blob-wrapper" style="">
        text diff
    </div>
  </div>
</div>

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

<div class="file js-file js-details-container js-targetable-element show-inline-notes" data-file-type=".obj" data-file-deleted="false" data-tagsearch-path="seesaw.obj" data-tagsearch-lang="Wavefront Object" data-targets="diff-file-filter.diffEntries">
  <div class="file-header d-flex flex-md-row flex-column flex-md-items-center file-header--expandable js-file-header js-skip-tagsearch  sticky-file-header js-position-sticky js-position-sticky-stacked" data-path="seesaw.obj" data-short-path="30a5515" data-anchor="diff-30a55156d01e06636625268d21e631c64adbfb6f4943a36279f622b6547aea67" data-file-type=".obj" data-file-deleted="false" data-original-top="60px" style="top: 60px !important;">
    <div class="file-info flex-auto min-width-0 mb-md-0 mb-2">
      <span class="Truncate">
        <a title="seesaw.obj" class="Link--primary Truncate-text" href="#diff-30a55156d01e06636625268d21e631c64adbfb6f4943a36279f622b6547aea67">seesaw.obj</a>
      </span>
    </div>
  <div class="js-file-content Details-content--hidden position-relative">
    <div class="data highlight empty">
      Git LFS file not shown
    </div>
  </div>
</div>
` // from https://github.com/KittyCAD/litterbox/pull/95/files
const parser = new DOMParser()
const githubPullHtmlDocument = parser.parseFromString(
    githubPullHtmlSnippet,
    'text/html'
)

const githubPullFilesSample: DiffEntry[] = [
    {
        sha: 'c24ca35738a99e6bf834e0ee141db27c62fce499',
        filename: 'samples/file_center_of_mass/output.json',
        status: 'modified',
        additions: 3,
        deletions: 3,
        changes: 6,
        blob_url:
            'https://github.com/KittyCAD/litterbox/blob/11510a02d8294cac5943b8ebdc416170f5b738b5/samples%2Ffile_center_of_mass%2Foutput.json',
        raw_url:
            'https://github.com/KittyCAD/litterbox/raw/11510a02d8294cac5943b8ebdc416170f5b738b5/samples%2Ffile_center_of_mass%2Foutput.json',
        contents_url:
            'https://api.github.com/repos/KittyCAD/litterbox/contents/samples%2Ffile_center_of_mass%2Foutput.json?ref=11510a02d8294cac5943b8ebdc416170f5b738b5',
        patch: '@@ -1,8 +1,8 @@\n {\n     "title": "output.json",\n     "center_of_mass": [\n-        -1.7249649e-08,\n-        2.96097,\n-        -0.36378\n+        -0.12732863,\n+        1.0363415,\n+        -9.5138624e-08\n     ]\n }\n\\ No newline at end of file',
    },
    {
        sha: '2f35d962a711bea7a8bf57481b8717f7dedbe1c5',
        filename: 'samples/file_center_of_mass/output.obj',
        status: 'modified',
        additions: 2,
        deletions: 2,
        changes: 4,
        blob_url:
            'https://github.com/KittyCAD/litterbox/blob/11510a02d8294cac5943b8ebdc416170f5b738b5/samples%2Ffile_center_of_mass%2Foutput.obj',
        raw_url:
            'https://github.com/KittyCAD/litterbox/raw/11510a02d8294cac5943b8ebdc416170f5b738b5/samples%2Ffile_center_of_mass%2Foutput.obj',
        contents_url:
            'https://api.github.com/repos/KittyCAD/litterbox/contents/samples%2Ffile_center_of_mass%2Foutput.obj?ref=11510a02d8294cac5943b8ebdc416170f5b738b5',
        patch: '@@ -1,3 +1,3 @@\n version https://git-lfs.github.com/spec/v1\n-oid sha256:2a07f53add3eee88b80a0bbe0412cf91df3d3bd9d45934ce849e0440eff90ee1\n-size 62122\n+oid sha256:0c0eb961e7e0589d83693335408b90d3b8adae9f4054c3e396c6eedbc5ed16ec\n+size 62545',
    },
    {
        sha: '2f35d962a711bea7a8bf57481b8717f7dedbe1c5',
        filename: 'seesaw.obj',
        status: 'modified',
        additions: 2,
        deletions: 2,
        changes: 4,
        blob_url:
            'https://github.com/KittyCAD/litterbox/blob/11510a02d8294cac5943b8ebdc416170f5b738b5/seesaw.obj',
        raw_url:
            'https://github.com/KittyCAD/litterbox/raw/11510a02d8294cac5943b8ebdc416170f5b738b5/seesaw.obj',
        contents_url:
            'https://api.github.com/repos/KittyCAD/litterbox/contents/seesaw.obj?ref=11510a02d8294cac5943b8ebdc416170f5b738b5',
        patch: '@@ -1,3 +1,3 @@\n version https://git-lfs.github.com/spec/v1\n-oid sha256:2a07f53add3eee88b80a0bbe0412cf91df3d3bd9d45934ce849e0440eff90ee1\n-size 62122\n+oid sha256:0c0eb961e7e0589d83693335408b90d3b8adae9f4054c3e396c6eedbc5ed16ec\n+size 62545',
    },
]

describe('Function getGithubPullUrlParams', () => {
    it('gets params out of a valid github pull request link', () => {
        const url = 'https://github.com/KittyCAD/kittycad.ts/pull/67/files'
        const params = getGithubPullUrlParams(url)
        expect(params).toBeDefined()
        const { owner, repo, pull } = params!
        expect(owner).toEqual('KittyCAD')
        expect(repo).toEqual('kittycad.ts')
        expect(pull).toEqual(67)
    })

    it("doesn't match other URLs", () => {
        expect(getGithubPullUrlParams('http://google.com')).toBeUndefined()
        expect(
            getGithubPullUrlParams('https://github.com/KittyCAD/litterbox')
        ).toBeUndefined()
    })
})

describe('Function getGithubCommitUrlParams', () => {
    it('gets params out of a valid github commit link', () => {
        const url =
            'https://github.com/KittyCAD/litterbox/commit/4ddf899550addf41d6bf1b790ce79e46501411b3'
        const params = getGithubCommitUrlParams(url)
        expect(params).toBeDefined()
        const { owner, repo, sha } = params!
        expect(owner).toEqual('KittyCAD')
        expect(repo).toEqual('litterbox')
        expect(sha).toEqual('4ddf899550addf41d6bf1b790ce79e46501411b3')
    })

    it("doesn't match other URLs", () => {
        expect(getGithubPullUrlParams('http://google.com')).toBeUndefined()
        expect(
            getGithubPullUrlParams('https://github.com/KittyCAD/litterbox')
        ).toBeUndefined()
    })
})

it('finds web elements for supported files', () => {
    const elements = getSupportedWebDiffElements(githubPullHtmlDocument)
    expect(elements).toHaveLength(2)
})

it('finds the filename of a supported file element', () => {
    const elements = getSupportedWebDiffElements(githubPullHtmlDocument)
    const filename = getElementFilename(elements[0])
    expect(filename).toEqual('samples/file_center_of_mass/output.obj')
})

it('finds injectable elements from html and api results', () => {
    const injectableElements = mapInjectableDiffElements(
        githubPullHtmlDocument,
        githubPullFilesSample
    )
    expect(injectableElements).toHaveLength(2)
    const { element, file } = injectableElements[0]
    expect(element).toBeDefined()
    expect(file).toBeDefined()
})
