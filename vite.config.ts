import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import csp from 'vite-plugin-csp-guard'

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
    }),
    csp({
      dev: {
        run: false,
        outlierSupport: ['tailwind', 'vue']
      },
      build: {
        sri: true
      },
      override: true,
      policy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          'https://js.stripe.com',
          'https://*.js.stripe.com',
          'https://maps.googleapis.com',
          'https://*.google.com',
          'https://www.gstatic.com',
          'https://*.recaptcha.net',
          'https://www.paypal.com',
          'https://www.paypalobjects.com',
          'https://client.crisp.chat',
          'https://oauth.telegram.org'
        ],
        'script-src-elem': [
          "'self'",
          'https://js.stripe.com',
          'https://*.js.stripe.com',
          'https://maps.googleapis.com',
          'https://*.google.com',
          'https://www.gstatic.com',
          'https://*.recaptcha.net',
          'https://www.paypal.com',
          'https://www.paypalobjects.com',
          'https://client.crisp.chat',
          'https://oauth.telegram.org'
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://widget.wl.platfone.com', 'https://client.crisp.chat'],
        'style-src-attr': ["'unsafe-inline'"],
        'frame-src': [
          "'self'",
          'https://*.paypal.com',
          'https://*.firebaseapp.com',
          'https://js.stripe.com',
          'https://*.js.stripe.com',
          'https://hooks.stripe.com',
          'https://*.google.com',
          'https://*.recaptcha.net',
          'https://oauth.telegram.org'
        ],
        'connect-src': [
          "'self'",
          'https://*.paypal.com',
          'https://pay.google.com',
          'https://api.stripe.com',
          'https://q.stripe.com',
          'https://maps.googleapis.com',
          'https://widget.wl.platfone.com',
          'https://*.firebaseio.com',
          'https://*.firebaseapp.com',
          'https://*.googleapis.com',
          'https://*.google.com',
          'https://oauth.telegram.org',
          'https://*.crisp.chat',
          'wss://*.crisp.chat',
          'https://develop-sms.temp-number-nodejs-backend.act.dtests.com',
          'https://develop.act-api.act.dtests.com'
        ],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://www.paypalobjects.com',
          'https://www.google.com',
          'https://www.gstatic.com',
          'https://storage.crisp.chat',
          'https://*.crisp.chat',
          'https://widget.wl.platfone.com'
        ],
        'font-src': ["'self'", 'https://widget.wl.platfone.com', 'https://client.crisp.chat'],
        'worker-src': ["'self'", 'blob:'],
        'manifest-src': ["'self'", 'https://pay.google.com'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@wl': fileURLToPath(new URL('./src/white-label', import.meta.url))
    }
  }
})
