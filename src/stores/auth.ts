import { defineStore } from 'pinia'
import i18n from '@/services/i18n'
import { type User } from 'firebase/auth'
import type AuthState from '@/types/stores/auth'
import { useAppStore } from '@/stores/app'
import { useModalStore } from '@/stores/modal'
import { useToastStore } from '@/stores/toast'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    isAuthPasswordProvider: false,
    isEmailVerified: null,
    authLoading: false
  }),
  actions: {
    setUserData(user: User | null) {
      const appStore = useAppStore()
      const modalStore = useModalStore()
      const toast = useToastStore()
      this.isAuthenticated = !!user

      if (user) {
        const providerData = user.providerData || []
        this.isAuthPasswordProvider = providerData.some((p) => p.providerId === 'password')
        this.isEmailVerified = user.emailVerified

        if (this.isAuthPasswordProvider && !this.isEmailVerified) {
          const forceEmailConfirmation = appStore.forceEmailConfirmation
          if (forceEmailConfirmation) {
            modalStore.forceEmailConfirmationModal = true
          } else {
            toast.add({
              id: 'confirm_email',
              text: i18n.global.t('notifications_confirm_email_address'),
              type: 'warning',
              permanent: true
            })
          }
        }
      }
    }
  }
})
