import { Octokit } from '@octokit/rest'
import { downloadFile, isFilenameSupported } from './diff'

it('checks if the filename has a supported extension', () => {
    expect(isFilenameSupported('noextension')).toBe(false)
    expect(isFilenameSupported('unsupported.txt')).toBe(false)
    expect(isFilenameSupported('supported.obj')).toBe(true)
    expect(isFilenameSupported('supported.stp')).toBe(true)
    expect(isFilenameSupported('supported.step')).toBe(true)
})

describe('Function downloadFile', () => {
    it('downloads a public regular github file', async () => {
        const github = new Octokit()
        // https://github.com/KittyCAD/kittycad.ts/blob/0c61ffe45d8b2c72b3d98600e9c50a8a404226b9/example.obj
        const response = await downloadFile(
            github,
            'KittyCAD',
            'kittycad.ts',
            '0c61ffe45d8b2c72b3d98600e9c50a8a404226b9',
            'example.obj'
        )
        // TODO: add hash validation or something like that
        expect(response).toHaveLength(37077)
    })

    it('downloads a public LFS github file', async () => {
        const github = new Octokit()
        // https://github.com/pierremtb/SwGitExample/be3e3897450f28b4166fa1039db06e7d0351dc9b/main/Part1.SLDPRT
        const response = await downloadFile(
            github,
            'pierremtb',
            'SwGitExample',
            'be3e3897450f28b4166fa1039db06e7d0351dc9b',
            'Part1.SLDPRT'
        )
        // TODO: add hash validation or something like that
        expect(response).toHaveLength(70702)
    })
})
