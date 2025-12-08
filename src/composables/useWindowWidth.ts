import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowWidth() {
  const windowWidth = ref(window.innerWidth)
  const lgBreakpoint = 1024

  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateWindowWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
  })

  return { windowWidth, lgBreakpoint }
}
