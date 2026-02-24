import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useApi } from '@/composables/api/useApi'
import { useAuthStore } from '@/stores/auth'
import config from '@/config'
import {
  type ITransactionsData,
  Gateway,
  type IStipePaymentIntentData,
  type IPaypalOrderData,
  type ICryptomusPaymentData,
  type IStipePaymentIntentStatus
} from '@/types/api/funds'
import type { ISuccessResponse } from '@/types/api'

export function useFunds() {
  const { t } = useI18n()
  const { get, post } = useApi()

  const { isAuthenticated } = storeToRefs(useAuthStore())

  const gateways = computed(() => [
    {
      id: Gateway.stripe,
      text: t('web_method_dropdown_credit_cards')
    },
    {
      id: Gateway.crypto,
      text: t('web_method_dropdown_cryptocurrency')
    },
    {
      id: Gateway.paypal,
      text: t('web_method_dropdown_paypal')
    },
    {
      id: Gateway.alipay_qq_wechat,
      text: t('web_alipay_qq_we_chat')
    }
  ])

  const enabledGateways = computed(() => {
    const enabledGatewaysStr = import.meta.env.VITE_TEMP_NUMBER_WEB_ENABLED_PAYMENT_GATEWAYS || '[]'
    const enabledGateways = JSON.parse(enabledGatewaysStr) as Gateway[]
    return gateways.value.filter((gateway) => enabledGateways.includes(gateway.id))
  })

  const enabledMobilePaymentGateways = computed(() => {
    const enabledMobileGatewaysStr = import.meta.env.VITE_MOBILE_PAYMENT_GATEWAYS || '[]'
    const enabledMobileGateways = JSON.parse(enabledMobileGatewaysStr) as Gateway[]
    return gateways.value.filter((gateway) => enabledMobileGateways.includes(gateway.id))
  })

  const getTransactions = async (page: number = 1): Promise<ITransactionsData> => {
    const apiPathUrl = config.wlWidgetMode ? '/transactions' : '/app-getTransactions'
    if (!isAuthenticated.value) return { transactions: [], page, limit: 10, pages: 1, total: 0 }
    const limit = 10
    const { data } = await get<ITransactionsData>(apiPathUrl, { page, limit })
    if (data) return data
    return { transactions: [], page, limit, pages: 1, total: 0 }
  }

  const createStripePaymentIntent = async (
    amount: number,
    recaptchaToken: string
  ): Promise<IStipePaymentIntentData | void> => {
    const { data } = await post<IStipePaymentIntentData>('/stripe-getPaymentIntent', {
      amount,
      recaptcha_token: recaptchaToken,
      platform: 'web'
    })
    if (data) return data
  }

  const createPaypalOrder = async (amount: number, recaptchaToken: string): Promise<string | undefined> => {
    const { data } = await post<IPaypalOrderData>('/paypal-createOrder', {
      amount,
      recaptcha_token: recaptchaToken
    })
    if (data && data.id) return data.id
  }

  const capturePaypalOrder = async (orderId: string): Promise<boolean> => {
    const { data } = await post<ISuccessResponse>('/paypal-captureOrder', {
      order_id: orderId
    })
    return data?.result === 'success'
  }

  const createCryptomusPayment = async (amount: number): Promise<void> => {
    const baseAppUrl = `${import.meta.env.VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL ?? ''}`
    let returnUrl = `${baseAppUrl}/funds`
    let successUrl = `${returnUrl}?status=success&type=crypto`

    const mobilePaymentReturnUrl = localStorage.getItem('mobilePaymentReturnUrl')
    if (mobilePaymentReturnUrl) {
      const paymentMobilePath = 'payment/mobile'
      returnUrl = `${baseAppUrl}/${paymentMobilePath}?status=return&type=crypto`
      successUrl = `${baseAppUrl}/${paymentMobilePath}?status=success&type=crypto`
    }

    const { data } = await post<ICryptomusPaymentData>('/cryptomus-createPayment', {
      amount,
      url_return: returnUrl,
      url_success: successUrl
    })
    if (data && data.url) {
      window.location.href = data.url
    }
  }

  const getStripePaymentIntentStatus = async (id: string, recaptchaToken: string): Promise<string> => {
    const { data } = await post<IStipePaymentIntentStatus>('/stripe-getPaymentIntentStatus', {
      payment_intent_id: id,
      recaptcha_token: recaptchaToken,
      platform: 'web'
    })
    return data?.status || ''
  }

  const createAlipayQqWechatPayment = async (
    coupon: string,
    recaptchaToken: string
  ): Promise<'success' | 'error' | null> => {
    const { data, error } = await post<ISuccessResponse>('/alipayQqWechat-createPayment', {
      coupon,
      recaptcha_token: recaptchaToken,
      platform: 'web'
    })
    if (data?.result === 'success') return 'success'
    if (error && error.status) return 'error'
    return null
  }

  return {
    gateways,
    enabledGateways,
    enabledMobilePaymentGateways,
    getTransactions,
    createStripePaymentIntent,
    createPaypalOrder,
    capturePaypalOrder,
    createCryptomusPayment,
    getStripePaymentIntentStatus,
    createAlipayQqWechatPayment
  }
}
