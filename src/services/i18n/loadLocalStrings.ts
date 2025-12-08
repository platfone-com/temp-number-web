import i18n from '@/services/i18n'
import { type Locale } from '@/types/locale'
import locales from '@/services/i18n/locales'

export async function loadLocaleStrings(locale: Locale | null = null) {
  if (!locale) {
    const storedLocale = localStorage.getItem('locale') as Locale | null
    locale = storedLocale && locales.includes(storedLocale) ? storedLocale : 'en'
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_CDN_BASE_URL}/locales/${locale}.json`)
    if (!response.ok) return
    const messages = await response.json()

    if (messages) {
      i18n.global.setLocaleMessage(locale, messages)
    }
  } catch (error) {}
}
