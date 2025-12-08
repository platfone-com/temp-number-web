<script lang="ts" setup>
  import config from '@/config'
  import { useOrderStore } from '@/stores/order'
  import { useForceOrder } from '@/composables/useForceOrder'
  import ClearOrderIcon from '@/assets/images/icons/clear-order.svg'
  import Header from '@/components/Order/Number/Header.vue'

  const { removeForceOrderData } = useForceOrder()
  const orderStore = useOrderStore()

  const clearOrder = () => {
    orderStore.clearOrder()
    removeForceOrderData()
  }
</script>

<template>
  <Header class="tn:lg:mx-6">
    <h3>{{ $t('web_order_number_order_title') }}</h3>
    <ClearOrderIcon
      @click="clearOrder"
      :class="['tn:h-6 tn:w-6 tn:cursor-pointer', config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#5F6368]']"
    />
  </Header>
</template>
