import { isFilenameSupported } from "./diff"

it("checks if the filename has a supported extension", () => {
  expect(isFilenameSupported("noextension")).toBe(false)
  expect(isFilenameSupported("unsupported.txt")).toBe(false)
  expect(isFilenameSupported("supported.obj")).toBe(true)
})
