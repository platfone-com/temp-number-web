import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import config from '@/config'
import { useApi } from '@/composables/api/useApi'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import { useModalStore } from '@/stores/modal'
import { useToastStore } from '@/stores/toast'
import { useHelper } from '@/composables/useHelper'
import { parseTranslation } from '@/utils/translate'
import { useBalance } from '@/composables/api/useBalance'
import { useWindowWidth } from '@/composables/useWindowWidth'
import { useForceOrder } from '@/composables/useForceOrder'
import { useRecent } from '@/composables/useRecent'
import { useWlHelper } from '@/composables/wl/useWlHelper'
import type { ISuccessResponse, IErrorResponseData } from '@/types/api'
import type { IActivation, IActivationsHistory } from '@/types/api/activation'

export function useActivation() {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { get, post, put } = useApi()
  const { restartCheckBalance } = useBalance()
  const { showSomethingWrongModal } = useHelper()
  const orderStore = useOrderStore()
  const modalStore = useModalStore()
  const toast = useToastStore()
  const { windowWidth, lgBreakpoint } = useWindowWidth()
  const { setForceOrderData, removeForceOrderData } = useForceOrder()
  const { addRecent } = useRecent()
  const { isWlHelperUrl, wlHelperFundsUrl, wlHelperContactUsUrl } = useWlHelper()

  const { isAuthenticated, isAuthPasswordProvider, isEmailVerified } = storeToRefs(useAuthStore())
  const { selectedService, selectedCountry, orderPrice, orderId } = storeToRefs(orderStore)

  const createActivation = async (): Promise<void> => {
    if (!selectedService.value || !selectedCountry.value || !orderPrice.value) return
    if (!isAuthenticated.value || (isAuthPasswordProvider.value && !isEmailVerified.value)) setForceOrderData()
    orderStore.orderLoading = true
    const apiPathUrl = config.wlWidgetMode ? '/activation' : '/app-createActivation'
    const requestData: {
      service_id: string
      country_id: string
      customer_max_price?: number
      customer_price?: number
      order_id?: string
    } = {
      service_id: selectedService.value.service_id,
      country_id: selectedCountry.value.country_id
    }
    if (config.wlWidgetMode) {
      requestData.customer_price = orderPrice.value
      if (window.emitTnWidgetEvent) {
        window.emitTnWidgetEvent('tn:startOrder', {
          country_id: requestData.country_id,
          service_id: requestData.service_id
        })
      }
    } else requestData.customer_max_price = orderPrice.value

    if (orderId.value) requestData.order_id = orderId.value
    const { data, error } = await post<IActivation>(apiPathUrl, requestData)
    orderStore.orderLoading = false
    if (data) {
      addRecent(selectedService.value)
      addRecent(selectedCountry.value)
      removeForceOrderData()
      orderStore.clearOrder(true)
      const showReadyModal = localStorage.getItem('showNumberReadyModal')
      if (!showReadyModal || showReadyModal !== 'false') {
        modalStore.numberReadyModal = { status: true, activation: data }
      } else {
        toast.add({
          id: 'activation_created',
          text: t('notifications_order_successful'),
          type: 'success'
        })
      }
      if (modalStore.cancelNumberModal.status) {
        modalStore.cancelNumberModal = { status: false, activation: null, numberCanceled: false }
      }
      await restartCheckBalance()

      const updatedQuery = { ...route.query }
      delete updatedQuery.country
      delete updatedQuery.service
      if (config.wlWidgetMode && window.emitTnWidgetEvent)
        window.emitTnWidgetEvent('tn:numberReceived', {
          country_id: data?.country_id,
          service_id: data?.service_id
        })
      await router.replace({ query: updatedQuery })
    }
    if (error) {
      const errorData = error.data as IErrorResponseData
      switch (error.status) {
        case 402:
          setForceOrderData()
          const modalOptions: {
            title: string
            text: string
            buttonText: string
            buttonRouteName?: string
            buttonHref?: string
          } = {
            title: t('notifications_not_enough_funds'),
            text: t('notifications_top_up_your_balance_to_proceed'),
            buttonText: t('web_add_funds_button_on_desktop')
          }
          if (config.wlWidgetMode) modalOptions.buttonHref = wlHelperFundsUrl.value
          else modalOptions.buttonRouteName = 'Funds'
          modalStore.setNotification(true, modalOptions)
          break
        case 404:
          const contactUsLink =
            config.wlWidgetMode || isWlHelperUrl() ? wlHelperContactUsUrl.value : { name: 'ContactUs' }
          if (errorData?.errorMessage === 'Order not found' && orderStore.orderId) {
            orderStore.orderId = ''
          }
          modalStore.setNotification(true, {
            title: t('notifications_try_another_number'),
            text: parseTranslation(
              t(
                'notifications_temporary_we_have_no_numbers_available_for_this_service_country_try_again_later_or_contact_support'
              ),
              [contactUsLink]
            ),
            buttonText: t('web_ok_button')
          })
          break
        case 409:
          const newPrice = errorData?.suggestedPrice
          if (newPrice) {
            orderStore.orderPrice = newPrice
            if (errorData?.orderId) orderStore.orderId = errorData.orderId
            modalStore.activationPriceChangedModal = true
          }
          break
        case 429:
          const errorName = errorData?.errorName || ''
          if (errorName === 'LowSuccessRateException') {
            modalStore.setNotification(true, {
              title: t('notifications_sorry'),
              text: t(
                'notifications_you_have_too_many_numbers_for_this_service_country_with_no_messages_please_change_country_or_try_again_in_24_hours'
              ),
              buttonText: t('notifications_ok')
            })
          } else if (errorName === 'TooManyActivationsException') {
            modalStore.setNotification(true, {
              title: t('notifications_too_many_activations'),
              text: t(
                'notifications_some_numbers_are_still_active_and_can_receive_messages_please_wait_until_they_expire_or_add_more_funds'
              ),
              buttonText: t('notifications_ok')
            })
          }
          break
        default:
          showSomethingWrongModal()
      }
    }
  }

  const getActivation = async (id: string): Promise<IActivation | null> => {
    if (!id) return null
    const apiPathUrl = config.wlWidgetMode ? `/activation/${id}` : '/app-getActivation'
    const { data } = await get<IActivation>(apiPathUrl, { activation_id: id })
    return data ?? null
  }

  const getActiveActivations = async (showLoading: boolean = true): Promise<void> => {
    if (!isAuthenticated.value) {
      if (windowWidth.value < lgBreakpoint) orderStore.oneBlockOrder = true
      return
    }
    if (showLoading) orderStore.activeNumbersLoading = true
    const apiPathUrl = config.wlWidgetMode ? `/activations` : '/app-getActiveActivations'
    const { data } = await get<IActivation[]>(apiPathUrl, { with_data: true })
    orderStore.activeNumbersLoading = false
    if (!data) return
    if (data && data.length) {
      orderStore.activeNumbers = data
      return
    }
    if (orderStore.activeNumbers === null && windowWidth.value < lgBreakpoint) {
      orderStore.oneBlockOrder = true
    }
    orderStore.activeNumbers = []
  }

  const getActivationsHistory = async (page: number = 1): Promise<IActivationsHistory> => {
    const limit = 10
    const apiPathUrl = config.wlWidgetMode ? `/activation/history` : '/app-getActivationHistory'
    const { data } = await get<IActivationsHistory>(apiPathUrl, { exclude_active: true, page, limit })
    if (data) return data
    return { activations: [], page, limit, pages: 1, total: 0 }
  }

  const finalizeActivation = async (activationId: string): Promise<boolean> => {
    const apiPathUrl = config.wlWidgetMode ? `/activation/${activationId}/finalize` : '/app-finalizeActivation'
    const { data, error } = await put<ISuccessResponse>(apiPathUrl, {
      activation_id: activationId
    })
    if (data && data.result === 'success') {
      await getActiveActivations(false)
      return true
    }
    if (error) {
      showSomethingWrongModal()
    }
    return false
  }

  const retryActivation = async (activationId: string): Promise<boolean> => {
    const apiPathUrl = config.wlWidgetMode ? `/activation/${activationId}/retry` : '/app-retryActivation'
    const { data, error } = await put<ISuccessResponse>(apiPathUrl, {
      activation_id: activationId
    })
    if (data && data.result === 'success') {
      await getActiveActivations(false)
      return true
    }
    if (error) {
      showSomethingWrongModal()
    }
    return false
  }

  const cancelActivation = async (activation: IActivation): Promise<void> => {
    orderStore.cancelNumberLoading = true
    const apiPathUrl = config.wlWidgetMode ? `/activation/${activation.activation_id}/cancel` : '/app-cancelActivation'
    const { data, error } = await put<ISuccessResponse>(apiPathUrl, {
      activation_id: activation.activation_id
    })
    orderStore.cancelNumberLoading = false
    if (data && data.result === 'success') {
      modalStore.cancelNumberModal = { status: true, activation: activation, numberCanceled: true }
      if (config.wlWidgetMode && window.emitTnWidgetEvent) {
        window.emitTnWidgetEvent('tn:numberCancelled', {
          country_id: activation.country_id,
          service_id: activation.service_id
        })
      }
      await getActiveActivations(false)
      await restartCheckBalance()
    }
    if (error) {
      showSomethingWrongModal()
    }
  }

  return {
    createActivation,
    getActivation,
    getActiveActivations,
    getActivationsHistory,
    finalizeActivation,
    retryActivation,
    cancelActivation
  }
}
