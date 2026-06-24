import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import { cspPlugin } from './csp.config'

export default defineConfig({
  cacheDir: 'node_modules/.vite-site',
  server: { port: 3300, allowedHosts: ['localhost', 'act-web3.10min.org'] },
  base: '/app/',
  plugins: [vue(), tailwindcss(), svgLoader({ svgo: false }), cspPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@wl': fileURLToPath(new URL('./src/white-label', import.meta.url))
    }
  }
})
