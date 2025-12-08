import axios, { AxiosError, type AxiosResponse, isAxiosError, type Method } from 'axios'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { getAuth, type Auth } from 'firebase/auth'
import { useAuth } from '@/composables/useAuth'
import { useHelper } from '@/composables/useHelper'
import { useToastStore } from '@/stores/toast'
import { useModalStore } from '@/stores/modal'
import { useAuthStore } from '@/stores/auth'
import { useWlHelper } from '@/composables/wl/useWlHelper'
import type { IErrorResponseData } from '@/types/api'
import appConfig from '@/config'

interface CustomAxiosError extends AxiosError {
  handleByInterceptor: boolean
}

export function useApi() {
  let fbAuth: Auth | null = null
  if (!appConfig.wlWidgetMode) fbAuth = getAuth()
  const route = useRoute()
  const { t } = useI18n()
  const { logout } = useAuth()
  const { showSomethingWrongModal } = useHelper()
  const { wlHelperAuthUrl } = useWlHelper()
  const toast = useToastStore()
  const modalStore = useModalStore()

  const { isAuthPasswordProvider, isEmailVerified } = storeToRefs(useAuthStore())

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_TEMP_NUMBER_BACKEND_API_BASE_PATH + '/',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Block requests if the user email is not verified
  apiClient.interceptors.request.use(async (config) => {
    if (appConfig.wlWidgetMode) return config
    const allowedEndpoints = [
      '/app-getCountries',
      '/app-getServices',
      '/app-getPopularServices',
      '/app-getPricesByCountry',
      '/app-getPricesByService',
      '/app-getPricesForServiceInCountry'
    ]
    const user = fbAuth?.currentUser
    if (user && isAuthPasswordProvider.value && !isEmailVerified.value) {
      if (allowedEndpoints.includes(config.url || '')) {
        delete config.headers.Authorization
      } else {
        return Promise.reject({
          isBlockedByInterceptor: true
        })
      }
    }
    return config
  })

  apiClient.interceptors.request.use(async (config) => {
    let token = ''
    if (appConfig.wlWidgetMode) {
      token = localStorage.getItem('wlAuthToken') || ''
    } else {
      if (route.name === 'MobilePayment') {
        token = localStorage.getItem('mobilePaymentFbToken') || ''
      } else if (fbAuth?.currentUser) {
        token = await fbAuth.currentUser.getIdToken()
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    async (err: CustomAxiosError) => {
      let handledByInterceptor = false
      if (err.response) {
        const status = err.response.status
        const errorData = err.response?.data as IErrorResponseData
        switch (status) {
          case 400:
            handledByInterceptor = true
            showSomethingWrongModal(err.response)
            break
          case 401:
            handledByInterceptor = true
            toast.add({
              id: 'unauthorized_error',
              text: t('notifications_please_sign_up_or_login'),
              type: 'warning'
            })
            if (appConfig.wlWidgetMode) {
              localStorage.removeItem('wlAuthToken')
              location.href = wlHelperAuthUrl.value
            } else if (route.name === 'MobilePayment') {
              const returnUrl = localStorage.getItem('mobilePaymentReturnUrl')
              localStorage.removeItem('mobilePaymentFbToken')
              localStorage.removeItem('mobilePaymentReturnUrl')
              setTimeout(() => {
                if (returnUrl) location.href = `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}status=error`
              }, 2000)
            } else {
              await logout('CreateAccount', false)
            }
            break
          case 403:
            handledByInterceptor = true
            if (errorData?.errorName === 'EmailNotVerifiedException') {
              toast.add({
                id: 'confirm_email',
                text: t('notifications_confirm_email_address'),
                type: 'warning',
                permanent: true
              })
            } else {
              modalStore.accountOnHoldModal = true
            }
            break
          case 404:
          case 409:
            if (
              err.response?.config?.url &&
              !['/app-createActivation', '/activation'].includes(err.response?.config?.url)
            ) {
              handledByInterceptor = true
              if (errorData?.errorName === 'ReportCreationDeadlinePassed') {
                modalStore.reportCreationDeadlinePassedModal = true
              } else {
                showSomethingWrongModal(err.response)
              }
            }
            break
          case 429:
            if (errorData?.errorName === 'TooManyRequestsException') {
              handledByInterceptor = true
              const endTimestamp = err.response?.headers['x-ratelimit-reset'] || null
              if (endTimestamp) {
                if (!modalStore.tooManyRequestsModal.status) {
                  modalStore.tooManyRequestsModal = {
                    status: true,
                    finishTimestamp: Number(endTimestamp)
                  }
                }
              } else {
                toast.add({
                  id: 'too_many_requests_error',
                  text: t('notifications_too_many_attempts_try_later'),
                  type: 'warning'
                })
              }
            }
            break
        }
      }
      err.handleByInterceptor = handledByInterceptor
      return Promise.reject(err)
    }
  )

  async function request<T>(
    method: Method,
    url: string,
    options?: {
      params?: Record<string, unknown>
      data?: FormData | Record<string, unknown>
      headers?: Record<string, string>
    }
  ) {
    let error: AxiosResponse | undefined = undefined
    let responseData: T | null = null
    let responseHeaders: Record<string, string> | null = null

    try {
      const response = await apiClient.request<T>({
        method,
        url,
        params: options?.params,
        data: options?.data,
        headers: options?.headers
      })

      responseData = response.data
      responseHeaders = response.headers as Record<string, string>
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        if (!(e as CustomAxiosError).handleByInterceptor) {
          error = e.response
        }
      } else {
        if (!(typeof e === 'object' && e !== null && 'isBlockedByInterceptor' in e && e.isBlockedByInterceptor)) {
          showSomethingWrongModal(e)
        }
      }
    }

    return { data: responseData, error, headers: responseHeaders }
  }

  function get<T>(url: string, params?: Record<string, unknown> | null, headers?: Record<string, string>) {
    return request<T>('GET', url, { params: params ?? undefined, headers })
  }

  function post<T>(url: string, data?: FormData | Record<string, unknown> | null, headers?: Record<string, string>) {
    return request<T>('POST', url, { data: data ?? undefined, headers })
  }

  function put<T>(url: string, data?: Record<string, unknown> | null, headers?: Record<string, string>) {
    return request<T>('PUT', url, { data: data ?? undefined, headers })
  }

  function del<T>(url: string, headers?: Record<string, string>) {
    return request<T>('DELETE', url, { headers })
  }

  return { request, get, post, put, del }
}
