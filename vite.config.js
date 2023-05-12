import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [react(), crx({ manifest })],
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis
                define: {
                    global: 'globalThis',
                },
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
