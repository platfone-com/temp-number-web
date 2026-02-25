import { loadEnv, type PluginOption } from 'vite'
import csp from 'vite-plugin-csp-guard'

function toOrigin(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    const { origin } = new URL(url)
    return origin
  } catch {
    return undefined
  }
}

export function cspPlugin(): PluginOption {
  const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'VITE_')

  if (env.VITE_CSP_ENABLED !== '1') {
    return null
  }

  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    'https://js.stripe.com',
    'https://*.js.stripe.com',
    'https://maps.googleapis.com',
    'https://*.google.com',
    'https://www.gstatic.com',
    'https://*.recaptcha.net',
    'https://www.paypal.com',
    'https://www.paypalobjects.com',
    'https://client.crisp.chat',
    'https://oauth.telegram.org',
    'https://*.cloudflareinsights.com'
  ]

  return csp({
    dev: {
      run: false
    },
    build: {
      sri: true
    },
    override: true,
    policy: {
      'default-src': ["'self'"],
      'script-src': scriptSources,
      'script-src-elem': scriptSources,
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
        'https://*.cloudflareinsights.com',
        toOrigin(env.VITE_TEMP_NUMBER_BACKEND_API_BASE_PATH),
        toOrigin(env.VITE_WL_API_BASE_PATH)
      ].filter((v): v is string => Boolean(v)),
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
}
