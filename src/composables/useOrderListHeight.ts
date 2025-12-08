import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWindowWidth } from '@/composables/useWindowWidth'
import { useAppStore } from '@/stores/app'

export function useOrderListHeight() {
  const { windowWidth } = useWindowWidth()
  const { isMobileHeaderHidden } = storeToRefs(useAppStore())

  const height = ref(0)
  const orderListHeight = ref(0)
  const itemHeight = computed(() => (windowWidth.value <= 640 ? 54 : 60)) // with gap

  const calculateHeight = () => {
    let fullHeight = window.innerHeight * 0.6
    let fullOrderListHeight = window.innerHeight * 0.6

    if (isMobileHeaderHidden.value) {
      // Calculate height for hidden mobile header
      fullHeight = window.innerHeight
      fullOrderListHeight = window.innerHeight - 68
    } else if (windowWidth.value < 640) {
      fullHeight = window.innerHeight - 280
      fullOrderListHeight = window.innerHeight - 187
    } else if (windowWidth.value >= 640 && windowWidth.value < 1024) {
      fullOrderListHeight = window.innerHeight - 210
    } else if (windowWidth.value >= 1024) {
      fullHeight = window.innerHeight - 380
      fullOrderListHeight = window.innerHeight - 380
    }
    const items = Math.floor(fullHeight / itemHeight.value)
    const orderListItems = Math.floor(fullOrderListHeight / itemHeight.value)
    height.value = items * itemHeight.value
    orderListHeight.value = windowWidth.value < 1024 ? fullOrderListHeight : orderListItems * itemHeight.value
  }

  onMounted(() => {
    calculateHeight()
    window.addEventListener('resize', calculateHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateHeight)
  })

  watch(
    () => [isMobileHeaderHidden.value],
    () => calculateHeight()
  )

  return { height, orderListHeight, itemHeight }
}
