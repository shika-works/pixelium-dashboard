import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base is set for GitHub Pages project-site deployment:
// https://shika-works.github.io/pixelium-dashboard/
// Change (or remove) this when deploying elsewhere, e.g. a custom domain.
const base = '/pixelium-dashboard/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    dedupe: ['vue', 'vue-router'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
