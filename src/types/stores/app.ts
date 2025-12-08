import type { Favorites, Recent } from '@/types/order'

export default interface AppState {
  forceEmailConfirmation: boolean
  copiedRangeTimeoutId: number | undefined
  balanceTimeoutId: ReturnType<typeof setTimeout> | null
  paypalClientId: string
  showMobileMenu: boolean
  isMobileHeaderHidden: boolean
  favorites: Favorites
  recent: Recent
  fundsLoading: boolean
}
