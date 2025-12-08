import { useI18n } from 'vue-i18n'
import config from '@/config'
import { useModalStore } from '@/stores/modal'
import { parseTranslation } from '@/utils/translate'

export function useHelper() {
  const { t } = useI18n()
  const modalStore = useModalStore()

  const showSomethingWrongModal = (error?: unknown) => {
    const status = error && (error as { status?: number | string })?.status
    const title = t('notifications_something_wrong')
    const textString = t('notifications_please_try_again_later_or_contact_support_0')
    const textWithStatus = status ? textString.replace('__0__', status.toString()) : textString.replace(' (__0__)', '')
    const text =
      location.pathname.includes('/wl/') || config.wlWidgetMode
        ? textWithStatus.replace(/\*\*/g, '')
        : parseTranslation(textWithStatus, [{ name: 'ContactUs' }])
    modalStore.setNotification(true, { title, text })
  }

  return { showSomethingWrongModal }
}
