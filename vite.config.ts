import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  server: {
    port: 3300
  },
  base: '/app/',
  plugins: [
    vue(),
    tailwindcss(),
    svgLoader({
      svgo: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@wl': fileURLToPath(new URL('./src/white-label', import.meta.url))
    }
  }
})
