<script lang="ts" setup>
  import config from '@/config'
  import CloseSidebarIcon from '@/assets/images/icons/close.svg'
</script>

<template>
  <button
    class="tn:border-tn-black-100 tn:flex tn:h-12 tn:w-12 tn:cursor-pointer tn:items-center tn:justify-center tn:rounded-full tn:border"
  >
    <CloseSidebarIcon
      :class="['tn:h-2.5 tn:w-2.5', config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#000000]']"
    />
  </button>
</template>
