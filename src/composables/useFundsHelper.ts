import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useToastStore } from '@/stores/toast'
import { useBalance } from '@/composables/api/useBalance'
import { parseTranslation } from '@/utils/translate'
import { useForceOrder } from '@/composables/useForceOrder'
import { useForceOrderHandler } from '@/composables/useForceOrderHandler'
import { useWlHelper } from '@/composables/wl/useWlHelper'

export function useFundsHelper() {
  const router = useRouter()
  const { t } = useI18n()
  const modalStore = useModalStore()
  const toast = useToastStore()
  const { restartCheckBalance } = useBalance()
  const { isForceOrderData } = useForceOrder()
  const { handleForceOrder } = useForceOrderHandler()
  const { isWlHelperUrl, handleWlActionRedirect } = useWlHelper()

  const handleCommonSuccessPayment = () => {
    if (isWlHelperUrl()) {
      handleWlActionRedirect('payment')
    } else {
      router.replace({ query: undefined })
      restartCheckBalance()
      if (isForceOrderData()) {
        handleForceOrder()
      }
    }
  }

  const handleSuccessPayment = () => {
    toast.add({
      id: 'success_payment',
      text: t('web_button_status_payment_success'),
      type: 'success'
    })
    handleCommonSuccessPayment()
  }

  const handleSuccessCryptoPayment = () => {
    modalStore.setNotification(true, {
      title: t('notifications_payment_detected'),
      text: t(
        'notifications_the_balance_will_be_updated_after_transaction_confirmation_on_the_blockchain_usually_it_takes_10_30_minutes'
      )
    })
    handleCommonSuccessPayment()
  }

  const handleReviewPayment = async () => {
    if (isWlHelperUrl()) {
      handleWlActionRedirect('payment', 'review')
    } else {
      modalStore.paymentInReviewModal = true
      await router.replace({ query: undefined })
    }
  }

  const handlePaymentError = async () => {
    if (isWlHelperUrl()) {
      handleWlActionRedirect('payment', 'error')
    } else {
      const contactUsLink = { name: 'ContactUs' }
      modalStore.setNotification(true, {
        title: t('notifications_payment_error'),
        text: parseTranslation(
          t(
            'notifications_please_check_your_payment_account_and_try_again_if_you_still_experience_problems_contact_support'
          ),
          [contactUsLink]
        )
      })
      await router.replace({ query: undefined })
    }
  }

  const getMobilePaymentFullReturnUrl = (baseUrl: string, status?: 'success' | 'review' | 'error', type?: string) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (type) params.set('type', type)
    const connector = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${connector}${params.toString()}`
  }

  const removeMobilePaymentData = () => {
    localStorage.removeItem('mobilePaymentReturnUrl')
    localStorage.removeItem('mobilePaymentFbToken')
  }

  return {
    handleSuccessPayment,
    handleSuccessCryptoPayment,
    handleReviewPayment,
    handlePaymentError,
    getMobilePaymentFullReturnUrl,
    removeMobilePaymentData
  }
}
