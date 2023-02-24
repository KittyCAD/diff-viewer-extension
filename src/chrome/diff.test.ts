import { Octokit } from "@octokit/rest"
import { downloadFile, isFilenameSupported } from "./diff"

it("checks if the filename has a supported extension", () => {
  expect(isFilenameSupported("noextension")).toBe(false)
  expect(isFilenameSupported("unsupported.txt")).toBe(false)
  expect(isFilenameSupported("supported.obj")).toBe(true)
})

it("downloads a public regular github file", async () => {
  const github = new Octokit()
  // https://github.com/KittyCAD/kittycad.ts/blob/0c61ffe45d8b2c72b3d98600e9c50a8a404226b9/example.obj
  const response = await downloadFile(github, "KittyCAD", "kittycad.ts", "0c61ffe45d8b2c72b3d98600e9c50a8a404226b9", "example.obj")
  expect(response).toHaveLength(37077)
})

// TODO: add test for LFS file download
