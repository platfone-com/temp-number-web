<script lang="ts" setup>
  import config from '@/config'
  import { useOrderStore } from '@/stores/order'
  import GoBackIcon from '@/assets/images/icons/go-back.svg'
  import TogglerIcon from '@/assets/images/icons/toggler.svg'

  const { changeCatalogBlock } = useOrderStore()
</script>

<template>
  <button
    @click="() => changeCatalogBlock()"
    :class="[
      'tn:h-7.5 tn:items-center tn:justify-center',
      'tn:bg-tn-black-80 tn:w-7.5 tn:rounded-full tn:lg:w-auto tn:lg:rounded-none tn:lg:bg-transparent'
    ]"
  >
    <GoBackIcon
      :class="[
        'tn:hidden tn:h-4 tn:w-4 tn:opacity-50 tn:lg:block tn:rtl:rotate-180',
        config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#161616]'
      ]"
    />
    <TogglerIcon
      :class="[
        'tn:block tn:h-4 tn:w-4 tn:lg:hidden',
        config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#5F6368]'
      ]"
    />
  </button>
</template>
