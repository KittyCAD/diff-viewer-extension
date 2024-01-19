import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

const viteManifestHackIssue846: Plugin & { renderCrxManifest: (manifest: any, bundle: any) => void } = {
    // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
    name: 'manifestHackIssue846',
    renderCrxManifest(_manifest, bundle) {
        bundle['manifest.json'] = bundle['.vite/manifest.json']
        bundle['manifest.json'].fileName = 'manifest.json'
        delete bundle['.vite/manifest.json']
    },
}

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [react(), viteManifestHackIssue846, crx({ manifest }), nodePolyfills()],
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
