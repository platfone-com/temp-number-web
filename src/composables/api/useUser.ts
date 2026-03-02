import { useI18n } from 'vue-i18n'
import { useApi } from '@/composables/api/useApi'
import { useAuth } from '@/composables/useAuth'
import { useToastStore } from '@/stores/toast'
import { useModalStore } from '@/stores/modal'
import config from '@/config'
import type { ISuccessResponse } from '@/types/api'
import type { ICustomer, INotificationSettings, IWLCustomer } from '@/types/api/user'

export function useUser() {
  const { t } = useI18n()
  const { get, put, post, del } = useApi()
  const { logout } = useAuth()

  const toast = useToastStore()
  const modalStore = useModalStore()

  const getCustomer = async (): Promise<ICustomer | IWLCustomer | null> => {
    const apiPathUrl = config.wlWidgetMode ? `/customer` : '/app-getCustomer'
    const { data } = await get<ICustomer>(apiPathUrl)
    if (data) return data
    return null
  }

  const deleteCustomer = async (): Promise<void> => {
    const apiPathUrl = config.wlWidgetMode ? `/customer` : '/app-deleteCustomer'
    const { data } = await del<ISuccessResponse>(apiPathUrl)
    if (data && data.result === 'success') {
      modalStore.deleteAccountModal = false
      toast.add({
        id: 'customer_deleted',
        text: t('notifications_account_deleted'),
        type: 'success'
      })
      await logout(config.wlWidgetMode ? 'Home' : 'CreateAccount', false)
    }
  }

  const getNotificationSettings = async (): Promise<INotificationSettings | null> => {
    const { data } = await get<INotificationSettings>('/app-getNotificationSettings')
    return data || null
  }

  const setNotificationSettings = async (email: boolean, push: boolean): Promise<boolean> => {
    const { data } = await put<ISuccessResponse>('/app-setNotificationSettings', {
      email_enabled: email,
      push_enabled: push
    })
    return (data && data.result === 'success') || false
  }

  const sendContactUsEmail = async (
    email: string,
    subject: string,
    message: string,
    recaptchaToken: string
  ): Promise<boolean> => {
    const { data } = await post<ISuccessResponse>('/app-sendContactUsEmail', {
      email,
      subject,
      message,
      recaptcha_token: recaptchaToken,
      platform: 'web'
    })
    return (data && data.result === 'success') || false
  }

  const getWlCustomer = async (): Promise<IWLCustomer | null> => {
    const { data } = await get<IWLCustomer>('/customer')
    return data || null
  }

  return {
    getCustomer,
    deleteCustomer,
    getNotificationSettings,
    setNotificationSettings,
    sendContactUsEmail,
    getWlCustomer
  }
}
