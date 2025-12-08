import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useOrderStore } from '@/stores/order'
import { useDevice } from '@/composables/useDevice'

export function useMobileHeaderVisibility() {
  const appStore = useAppStore()
  const { isMobile } = useDevice()
  const { selectedCountry, selectedService, oneBlockOrder, isSearchFocused } = storeToRefs(useOrderStore())

  const lastScrollTop = ref(0)

  const HIDE_THRESHOLD = 24

  const toggleMobileHeader = (container?: HTMLElement) => {
    if (container && isMobile.value) {
      const current = container.scrollTop

      if (
        current > lastScrollTop.value &&
        current > HIDE_THRESHOLD &&
        !appStore.isMobileHeaderHidden &&
        oneBlockOrder.value &&
        (!selectedCountry.value || !selectedService.value)
      ) {
        appStore.isMobileHeaderHidden = true
      } else if (current === 0 && appStore.isMobileHeaderHidden && !isSearchFocused.value) {
        appStore.isMobileHeaderHidden = false
      }

      lastScrollTop.value = current
    } else {
      appStore.isMobileHeaderHidden = false
    }
  }

  watch(
    () => [isMobile.value, oneBlockOrder.value, selectedCountry.value, selectedService.value],
    () => toggleMobileHeader()
  )

  return { toggleMobileHeader }
}
