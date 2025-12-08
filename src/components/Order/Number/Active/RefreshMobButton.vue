<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import config from '@/config'
  import { useOrderStore } from '@/stores/order'
  import RefreshIcon from '@/assets/images/icons/refresh.svg'

  const { activeNumbersLoading } = storeToRefs(useOrderStore())
</script>

<template>
  <button
    :class="[
      'tn:flex tn:h-7.5 tn:w-7.5 tn:items-center tn:justify-center tn:rounded-full tn:lg:hidden',
      'tn:bg-tn-black-80'
    ]"
  >
    <RefreshIcon
      :class="[
        'tn:h-4 tn:w-4',
        activeNumbersLoading && 'tn:animate-spin',
        config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#5F6368]'
      ]"
    />
  </button>
</template>
