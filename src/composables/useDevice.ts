import { ref, onMounted, onUnmounted } from 'vue'

export function useDevice() {
  const isMobile = ref(false)

  const updateIsMobile = () => {
    isMobile.value = window.matchMedia('(max-width: 767px)').matches
  }

  const isIOSMobile = (): boolean => {
    const userAgent = navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(userAgent)
  }

  onMounted(() => {
    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateIsMobile)
  })

  return { isMobile, isIOSMobile }
}
