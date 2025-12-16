/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_WEB_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_TEMP_NUMBER_BACKEND_API_BASE_PATH: string
  readonly VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL: string
  readonly VITE_TEMP_NUMBER_WEB_ENABLED_PAYMENT_GATEWAYS: string
  readonly VITE_CDN_BASE_URL: string
  readonly VITE_TELEGRAM_BOT_ID: string
  readonly VITE_RECAPTCHA_ENTERPRISE_ENABLED?: '1' | '0'
  readonly VITE_RECAPTCHA_ENTERPRISE_SITE_KEY?: string
  readonly VITE_ALIPAY_QQ_WECHAT_STORE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
