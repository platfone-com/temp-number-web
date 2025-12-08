import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useOrderStore } from '@/stores/order'

export function useMobileMenuVisibility() {
  const appStore = useAppStore()

  const lastScrollTop = ref(0)

  const { isSearchFocused } = storeToRefs(useOrderStore())

  const toggleMobileMenu = (container: HTMLElement) => {
    if (container) {
      const current = container.scrollTop

      if (current > lastScrollTop.value && appStore.showMobileMenu) {
        appStore.showMobileMenu = false
      } else if (current < lastScrollTop.value && !appStore.showMobileMenu && !isSearchFocused.value) {
        appStore.showMobileMenu = true
      }

      lastScrollTop.value = current
    }
  }

  return { toggleMobileMenu }
}
