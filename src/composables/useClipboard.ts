import { useI18n } from 'vue-i18n'
import { useToastStore } from '@/stores/toast'
import selectText from '@/utils/selectText'

export function useClipboard() {
  const { t } = useI18n()
  const toast = useToastStore()

  const copyToClipboard = async (
    data: string,
    element: HTMLElement | undefined = undefined,
    timeout: number = 3000
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(data)
      const id = 'success_copied'
      const text = t('notifications_copied_to_clipboard')
      if (element) selectText(element, timeout)
      requestAnimationFrame(() => {
        toast.add({ id, text, timeout, type: 'success' })
      })
    } catch (err) {}
  }

  return { copyToClipboard }
}
