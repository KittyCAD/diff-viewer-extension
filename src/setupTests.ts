// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// From https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/utils/test-helpers.tsx#L12
global.CSS = {
    escape: vi.fn(),
    supports: vi.fn().mockImplementation(() => {
        return false
    }),
}

// TODO: improve/replace chrome mocks
global.chrome = {
    runtime: {
        sendMessage: vi.fn(),
    },
    storage: {
        local: {
            set: vi.fn(),
            get: vi.fn(),
        },
    },
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup()
})
