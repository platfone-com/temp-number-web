<script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { useOrderListHeight } from '@/composables/useOrderListHeight'
  import { useWindowWidth } from '@/composables/useWindowWidth'
  import { useMobileMenuVisibility } from '@/composables/useMobileMenuVisibility'
  import { useMobileHeaderVisibility } from '@/composables/useMobileHeaderVisibility'
  import type { VirtualScrollItem } from '@/types/order'

  const props = defineProps<{
    items: VirtualScrollItem[]
  }>()

  const { orderListHeight } = useOrderListHeight()
  const { windowWidth } = useWindowWidth()
  const { toggleMobileMenu } = useMobileMenuVisibility()
  const { toggleMobileHeader } = useMobileHeaderVisibility()

  const buffer = 3
  const itemHeight = 48
  const delimiterHeight = 48
  const gap = computed(() => (windowWidth.value > 640 ? 12 : 6))

  const containerHeight = computed(() => {
    return orderListHeight.value - gap.value
  })

  const getItemHeight = (item: VirtualScrollItem) =>
    'type' in item && item.type === 'delimiter' ? delimiterHeight : itemHeight

  const cumulativeHeightsData = computed(() => {
    const cum: number[] = []
    let total = 0
    const len = props.items.length
    props.items.forEach((item, i) => {
      cum.push(total)
      total += getItemHeight(item) + (i < len - 1 ? gap.value : 0)
    })
    return { cum, total }
  })

  const totalHeight = computed(() => cumulativeHeightsData.value.total)
  const cumulativeHeights = computed(() => cumulativeHeightsData.value.cum)

  const container = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)

  const startIndex = computed(() => {
    const { cum } = cumulativeHeightsData.value
    let idx = 0
    while (idx < cum.length && cum[idx] < scrollTop.value) {
      idx++
    }
    return Math.max(0, idx - buffer)
  })

  const visibleItemCount = computed(() => {
    let count = 0
    const { cum } = cumulativeHeightsData.value
    const viewportBottom = scrollTop.value + containerHeight.value
    for (let i = startIndex.value; i < props.items.length; i++) {
      if (cum[i] < viewportBottom) {
        count++
      } else {
        break
      }
    }
    return count + buffer
  })

  const endIndex = computed(() => Math.min(props.items.length, startIndex.value + visibleItemCount.value))
  const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value))
  const offsetY = computed(() => cumulativeHeightsData.value.cum[startIndex.value] || 0)

  const onScroll = () => {
    if (container.value) {
      scrollTop.value = container.value.scrollTop

      toggleMobileMenu(container.value)
      toggleMobileHeader(container.value)
    }
  }

  const scrollToActive = async (index: number) => {
    await nextTick()
    if (!container.value) return
    const targetPosition = cumulativeHeights.value[index] || 0
    container.value?.scrollTo({
      top: targetPosition - offsetY.value,
      behavior: 'smooth'
    })
  }

  defineExpose({
    scrollToActive
  })

  onMounted(() => {
    container.value?.addEventListener('scroll', onScroll)
  })

  onUnmounted(() => {
    container.value?.removeEventListener('scroll', onScroll)
  })
</script>

<template>
  <div
    ref="container"
    class="scrollbar-thin tn:relative tn:overflow-y-auto"
    :style="{ height: containerHeight + 'px' }"
  >
    <div class="tn:relative tn:w-full" :style="{ height: totalHeight + 'px' }" />
    <div class="tn:absolute tn:top-0 tn:right-0 tn:left-0" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="(item, localIndex) in visibleItems"
        :key="localIndex"
        class="tn:absolute tn:right-0 tn:left-0"
        :style="{
          top: cumulativeHeights[startIndex + localIndex] - offsetY + 'px',
          height: getItemHeight(item) + 'px',
          marginBottom: startIndex + localIndex === props.items.length - 1 ? '0px' : gap + 'px'
        }"
      >
        <slot :item="item" :index="startIndex + localIndex" :show-scrollbar="totalHeight > containerHeight" />
      </div>
    </div>
  </div>
</template>
