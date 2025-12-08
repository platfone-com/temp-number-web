<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import config from '@/config'
  import { useOrderStore } from '@/stores/order'
  import GoBackIcon from '@/assets/images/icons/go-back.svg'

  const orderStore = useOrderStore()
  const { orderPrice } = storeToRefs(orderStore)

  const handleNewOrder = () => {
    orderStore.clearOrder()
    orderStore.oneBlockOrder = true
  }
</script>

<template>
  <button
    v-if="!orderPrice"
    @click="handleNewOrder"
    :class="['tn:block tn:lg:hidden', 'tn:h-7.5 tn:items-center tn:justify-center', 'tn:w-auto']"
  >
    <GoBackIcon
      :class="[
        'tn:h-4 tn:w-4 tn:opacity-50 tn:rtl:rotate-180',
        config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#161616]'
      ]"
    />
  </button>
</template>
