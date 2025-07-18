import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config.js'

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [
            react(),
            crx({ manifest }),
            nodePolyfills(),
        ],
        server: {
            cors: {
            origin: [
                /chrome-extension:\/\//,
            ],
            },
        },
        resolve: {
            alias: {
                // Replaces node-fetch in kittycad.ts, cross-fetch wouldn't work
                'node-fetch': 'isomorphic-fetch',
            },
        },
        test: {
            globals: true,
            environment: 'happy-dom',
            setupFiles: 'src/setupTests.ts',
            exclude: [...configDefaults.exclude, 'tests/*'],
        },
    }
})
