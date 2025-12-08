import { useWlHelper } from '@/composables/wl/useWlHelper'

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
    }
  }
}

export function useRecaptcha() {
  const { isWlHelperUrl } = useWlHelper()
  const isRecaptchaEnabled = (import.meta.env.VITE_RECAPTCHA_ENTERPRISE_ENABLED || '0') === '1'
  const enterpriseSiteKey = isWlHelperUrl()
    ? import.meta.env.VITE_WL_RECAPTCHA_ENTERPRISE_SITE_KEY || ''
    : import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY || ''

  const loadRecaptchaEnterprise = (): Promise<void> => {
    if (!isRecaptchaEnabled) return Promise.resolve()

    return new Promise((resolve, reject) => {
      const scriptId = 'recaptcha-script'

      if (window.grecaptcha?.enterprise) {
        resolve()
        return
      }

      if (document.getElementById(scriptId)) {
        const interval = setInterval(() => {
          if (window.grecaptcha?.enterprise) {
            clearInterval(interval)
            resolve()
          }
        }, 50)
        return
      }

      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${enterpriseSiteKey}`
      script.async = true
      script.onload = () => {
        const interval = setInterval(() => {
          if (window.grecaptcha?.enterprise) {
            clearInterval(interval)
            resolve()
          }
        }, 50)
      }
      script.onerror = reject

      document.head.appendChild(script)
    })
  }

  const getRecaptchaToken = async (action: string): Promise<string> => {
    if (!isRecaptchaEnabled) return ''

    try {
      await loadRecaptchaEnterprise()
      return await window.grecaptcha.enterprise.execute(enterpriseSiteKey, { action })
    } catch (e) {
      return ''
    }
  }

  return { loadRecaptchaEnterprise, getRecaptchaToken }
}
