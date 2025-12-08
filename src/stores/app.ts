import { defineStore } from 'pinia'
import type AppState from '@/types/stores/app'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    forceEmailConfirmation: true,
    copiedRangeTimeoutId: undefined,
    balanceTimeoutId: null,
    paypalClientId: '',
    showMobileMenu: true,
    isMobileHeaderHidden: false,
    favorites: { services: [], countries: [] },
    recent: { services: [], countries: [] },
    fundsLoading: false
  }),
  actions: {
    setCopiedRangeTimeoutId(val: undefined | number = undefined) {
      clearTimeout(this.copiedRangeTimeoutId)
      this.copiedRangeTimeoutId = val
    }
  }
})
