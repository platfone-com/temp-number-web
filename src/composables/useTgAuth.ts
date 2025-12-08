import { getAuth, signInWithCustomToken } from 'firebase/auth'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useApi } from '@/composables/api/useApi'
import { useHelper } from '@/composables/useHelper'
import { useWlHelper } from '@/composables/wl/useWlHelper'
import { useAuth } from '@/composables/useAuth'
import { useDevice } from '@/composables/useDevice'
import type { ITelegramTokenResponse } from '@/types/api/auth'

export function useTgAuth() {
  const route = useRoute()
  const { t, locale } = useI18n()
  const api = useApi()
  const authStore = useAuthStore()
  const toast = useToastStore()
  const { showSomethingWrongModal } = useHelper()
  const { isWlHelperUrl } = useWlHelper()
  const { handleSuccessAuth } = useAuth()
  const { isIOSMobile } = useDevice()

  const botId = import.meta.env.VITE_TELEGRAM_BOT_ID
  const telegramAuthUrl = 'https://oauth.telegram.org/auth'

  const tgLogin = async (isMobileAppAuth: boolean = false): Promise<string | void> => {
    const callbackUrl = window.location.href
    const authUrl = `${telegramAuthUrl}?bot_id=${botId}&origin=${encodeURIComponent(callbackUrl)}&lang=${locale.value}`

    // For iOS mobile browsers, redirect directly instead of using popup
    if (isIOSMobile()) {
      sessionStorage.setItem('tg_auth_with_redirect', 'true')
      sessionStorage.setItem('tg_auth_mobile_mode', isMobileAppAuth.toString())

      window.location.href = authUrl
      return
    }

    // For desktop and Android browsers, use popup approach
    return new Promise((resolve, reject) => {
      const width = 550
      const height = 500
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2

      const authWindow = window.open(
        authUrl,
        '_blank',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      )

      if (!authWindow) {
        const errorMessage = t('notifications_please_allow_pop_ups_in_your_browser_settings_and_try_again')
        toast.add({
          id: 'blocked_popups_error_web',
          text: errorMessage
        })
        return reject(new Error(errorMessage))
      }

      const checkPopupClosed = setInterval(async () => {
        if (authWindow.closed) {
          clearInterval(checkPopupClosed)
          const token = await signInByTelegram(isMobileAppAuth)
          if (token) resolve(token)
        }
      }, 500)
    })
  }

  const signInByTelegram = async (
    isMobileAppAuth: boolean = false,
    userData?: Record<string, string | number>
  ): Promise<string | void> => {
    // If userData is provided (iOS redirect flow), use it directly
    // Otherwise fetch it from Telegram (popup flow)
    const user = userData || (await getTelegramUserData())
    if (!user) return
    if (!isMobileAppAuth) authStore.authLoading = true

    let token: string | undefined = ''
    let error
    if (isWlHelperUrl()) {
      /* WL authentication flow no provided */
    } else {
      const res = await api.post<ITelegramTokenResponse>('telegram-createAuthToken', user)
      token = res.data?.token
      error = res.error
    }

    if (!token) {
      if (!isMobileAppAuth) {
        if (error) showSomethingWrongModal(error)
        authStore.authLoading = false
      }
      return
    }

    if (isMobileAppAuth) {
      if (isIOSMobile()) {
        if (route.query?.returnUrl) {
          const returnUrl = route.query.returnUrl as string
          const connector = returnUrl.includes('?') ? '&' : '?'
          if (token) location.href = `${returnUrl}${connector}status=success&token=${encodeURIComponent(token)}`
          else
            location.href = `${returnUrl}${connector}status=error&errorMessage=${encodeURIComponent('Token is empty')}`
        }
        return
      } else {
        return token
      }
    }

    const auth = getAuth()
    const result = await signInWithCustomToken(auth, token)
    if (result?.user) await handleSuccessAuth()

    authStore.authLoading = false
  }

  const getTelegramUserData = async (): Promise<Record<string, string | number> | null> => {
    authStore.authLoading = true
    try {
      const response = await axios.post(`${telegramAuthUrl}/get`, null, {
        params: { bot_id: botId },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      })

      return response.data?.user || null
    } catch (e: unknown) {
      return null
    } finally {
      authStore.authLoading = false
    }
  }

  const handleTelegramCallback = async (isMobileAppAuth: boolean = false): Promise<void> => {
    const hash = window.location.hash
    const tgAuthMatch = hash.match(/#tgAuthResult=(.+)/)

    if (tgAuthMatch && tgAuthMatch[1]) {
      try {
        const userData = JSON.parse(atob(tgAuthMatch[1]))
        await signInByTelegram(isMobileAppAuth, userData)
      } catch (e) {
        authStore.authLoading = false
        showSomethingWrongModal()
      }
      return
    }
  }

  const isPopupBlocked = (): boolean => {
    try {
      if (isIOSMobile()) {
        return false
      }

      const testPopup = window.open('', '', 'width=1,height=1')
      if (!testPopup) {
        return true
      }
      testPopup.close()
      return false
    } catch (e) {
      return true
    }
  }

  return { tgLogin, isPopupBlocked, handleTelegramCallback }
}
