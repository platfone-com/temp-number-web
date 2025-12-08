import { createI18n } from 'vue-i18n'

const currentLocale = localStorage.getItem('locale') || 'en'

const index = createI18n({
  legacy: false,
  locale: currentLocale,
  fallbackLocale: 'en',
  messages: {}
})

export default index
