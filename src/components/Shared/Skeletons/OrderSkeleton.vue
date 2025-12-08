<script lang="ts" setup>
  import { computed } from 'vue'
  import { useOrderListHeight } from '@/composables/useOrderListHeight'

  const props = defineProps({
    withPadding: {
      type: Boolean,
      default: true
    },
    showTopBlock: {
      type: Boolean,
      default: true
    },
    defaultItemsCount: {
      type: Number,
      default: 0
    }
  })

  const { height, itemHeight } = useOrderListHeight()

  const itemsCount = computed(() => {
    if (props.defaultItemsCount) return props.defaultItemsCount
    else return Math.floor(height.value / itemHeight.value)
  })
</script>

<template>
  <div :class="['tn:flex tn:w-full tn:flex-col tn:gap-3', withPadding && 'tn:lg:px-6']">
    <div v-if="showTopBlock" class="tn:flex tn:animate-pulse">
      <div class="tn:bg-tn-black-70 tn:h-14.5 tn:w-full tn:rounded-2xl" />
    </div>
    <div v-for="item in itemsCount" :key="item" class="tn:flex tn:animate-pulse tn:items-center tn:space-x-3 tn:py-2">
      <div class="tn:bg-tn-black-70 tn:h-8 tn:w-8 tn:rounded-xl"></div>
      <div class="tn:flex-1 tn:py-1">
        <div class="tn:bg-tn-black-70 tn:h-2.5 tn:w-full tn:rounded-md"></div>
      </div>
    </div>
  </div>
</template>
