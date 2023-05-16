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
        plugins: [react(), crx({ manifest }), nodePolyfills()],
        resolve: {
            alias: {
                // Need to replace node-fetch in kittycad.ts
                'node-fetch': 'isomorphic-fetch',
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: 'src/setupTests.ts',
            exclude: [...configDefaults.exclude, 'tests/*'],
        },
    }
})
