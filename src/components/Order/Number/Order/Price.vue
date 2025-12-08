<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useOrderStore } from '@/stores/order'
  import PriceIcon from '@/assets/images/icons/order/price.svg'

  const { orderPrice } = storeToRefs(useOrderStore())
</script>

<template>
  <div class="tn:mt-2 tn:mb-0 tn:flex tn:items-center tn:justify-between tn:py-2 tn:lg:my-2">
    <div class="tn:flex tn:items-center tn:gap-2.5">
      <div class="tn:px-1.25">
        <PriceIcon class="tn:text-tn-black-900 tn:h-5 tn:w-5" />
      </div>
      <span class="tn:text-sm tn:lg:text-base">{{ $t('web_order_price') }}</span>
    </div>
    <div
      class="tn:bg-primary-900 tn:rounded-lg tn:px-1.5 tn:py-0.5 tn:text-center tn:text-sm tn:font-semibold tn:text-white"
    >
      ${{ orderPrice / 100 }}
    </div>
  </div>
</template>
