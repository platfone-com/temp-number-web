import { getAuth, sendEmailVerification, sendPasswordResetEmail, type User } from 'firebase/auth'
import { type LocationQuery, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToastStore } from '@/stores/toast'
import { useModalStore } from '@/stores/modal'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import { useHelper } from '@/composables/useHelper'
import { useWlHelper } from '@/composables/wl/useWlHelper'
import config from '@/config'
import type { FirebaseError } from '@/types/error'
import type { ActionCodeSettings } from '@firebase/auth'

export function useAuth() {
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToastStore()
  const modalStore = useModalStore()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const orderStore = useOrderStore()
  const { showSomethingWrongModal } = useHelper()
  const { isWlHelperUrl, handleSuccessWlAuth } = useWlHelper()

  const logout = async (redirectRouteName = '', showLogoutAlert = true, query?: LocationQuery): Promise<void> => {
    if (!redirectRouteName) {
      redirectRouteName = config.wlWidgetMode ? 'Home' : 'CreateAccount'
    }

    try {
      if (config.wlWidgetMode) {
        localStorage.removeItem('wlAuthToken')
        authStore.isAuthenticated = false
      } else {
        const auth = getAuth()
        await auth.signOut()
      }
      userStore.setBalance(null)
      authStore.isAuthPasswordProvider = false
      authStore.isEmailVerified = null
      toast.remove('confirm_email')
      orderStore.clearOrder()
      orderStore.activeNumbers = null
      modalStore.forceEmailConfirmationModal = false
      if (showLogoutAlert) {
        toast.add({
          id: 'logout',
          text: t('notifications_logout_successful'),
          type: 'success',
          timeout: 2000
        })
      }
      localStorage.removeItem('lastVisitedPath')
      await router.push({ name: redirectRouteName, query: query || {} })
    } catch (e: unknown) {
      showSomethingWrongModal(e)
    }
  }

  const handleSuccessAuth = async (type: 'login' | 'signup' = 'login'): Promise<void> => {
    if (isWlHelperUrl()) {
      await handleSuccessWlAuth()
    } else {
      toast.add({
        id: 'success_auth',
        text: type === 'login' ? t('notifications_login_successful') : t('notifications_sign_up_completed'),
        type: 'success',
        timeout: 2000
      })
      await router.push({ name: 'Home' })
    }
  }

  const sendCustomizedEmailVerification = async (user: User): Promise<void> => {
    let actionCodeSettings: ActionCodeSettings | null = null
    if (isWlHelperUrl()) {
      actionCodeSettings = {
        url: `${location.href}&emailVerified=true&email=${user.email}`
      }
    }
    await sendEmailVerification(user, actionCodeSettings)
  }

  const resendEmailConfirmation = async (): Promise<boolean> => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return false
    try {
      await sendCustomizedEmailVerification(user)
      toast.add({
        id: 'resend_email_success',
        text: t('notifications_open_your_email_and_follow_the_link'),
        type: 'success'
      })
      return true
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        if (error?.code === 'auth/too-many-requests') {
          toast.add({
            id: 'resend_email_error',
            text: t('notifications_too_many_attempts_try_later')
          })
          return false
        }
      }
      showSomethingWrongModal(e)
      return false
    }
  }

  const sendCustomizedPasswordResetEmail = async (email: string): Promise<void> => {
    let actionCodeSettings: ActionCodeSettings | undefined = undefined
    if (isWlHelperUrl()) {
      actionCodeSettings = {
        url: `${location.href.replace('auth/reset-password', 'auth/new-password')}`
      }
    }
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email, actionCodeSettings)
  }

  return {
    logout,
    handleSuccessAuth,
    sendCustomizedEmailVerification,
    resendEmailConfirmation,
    sendCustomizedPasswordResetEmail
  }
}
