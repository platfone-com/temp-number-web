import { type Locale } from '@/types/locale'
import locales from '@/services/i18n/locales'

export function useLocale() {
  const setLocaleParams = (locale: Locale | null = null): void => {
    if (!locale) {
      const storedLocale = localStorage.getItem('locale') as Locale | null
      locale = storedLocale && locales.includes(storedLocale) ? storedLocale : 'en'
    }
    const curLocale: string = locale

    let direction: 'ltr' | 'rtl' = 'ltr'
    if (['ar', 'he'].includes(curLocale)) {
      direction = 'rtl'
    }

    const html = document.querySelector('html')
    if (html) {
      html.setAttribute('lang', curLocale)
      html.setAttribute('dir', direction)
    }
  }

  return { setLocaleParams }
}
