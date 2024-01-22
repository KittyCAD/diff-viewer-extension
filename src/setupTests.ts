import { cleanup } from '@testing-library/react'
import { vi, expect } from 'vitest'
import * as matchers from 'vitest-dom/matchers'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// From https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/utils/test-helpers.tsx#L12
global.CSS = {
    escape: vi.fn(),
    supports: vi.fn().mockImplementation(() => {
        return false
    }),
}

// For jest-canvas-mock in tests, from https://github.com/hustcc/jest-canvas-mock/issues/88
global.jest = vi

// TODO: improve/replace chrome mocks
global.chrome = {
    runtime: {
        // @ts-ignore TS2322
        sendMessage: vi.fn(),
    },
    storage: {
        local: {
            // @ts-ignore TS2322
            set: vi.fn(),
            // @ts-ignore TS2322
            get: vi.fn(),
        },
    },
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup()
})
