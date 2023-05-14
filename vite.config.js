import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [
            react(),
            crx({ manifest }),
            nodePolyfills({
                // To exclude specific polyfills, add them to this list.
                exclude: [
                    'fs', // Excludes the polyfill for `fs` and `node:fs`.
                ],
                // Whether to polyfill `node:` protocol imports.
                protocolImports: true,
            }),
        ],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: 'src/setupTests.ts',
            exclude: [...configDefaults.exclude, 'tests/*'],
        },
    }
})
