<script lang="ts" setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import config from '@/config'
  import { useOrderStore } from '@/stores/order'
  import GoBackIcon from '@/assets/images/icons/go-back.svg'
  import { CatalogBlock } from '@/types/stores/order'

  const orderStore = useOrderStore()
  const { orderPrice, catalogBlock, oneBlockOrder, selectedService, selectedCountry } = storeToRefs(orderStore)

  const isShowButton = computed(() => {
    return (
      oneBlockOrder.value &&
      ((catalogBlock.value === CatalogBlock.SERVICE && selectedService.value) ||
        (catalogBlock.value === CatalogBlock.COUNTRY && selectedCountry.value) ||
        (selectedService.value && selectedCountry.value))
    )
  })

  const handleGoBack = () => {
    if (orderPrice.value) {
      if (catalogBlock.value === CatalogBlock.SERVICE) orderStore.selectedCountry = null
      else orderStore.selectedService = null
      orderPrice.value = 0
    } else if (catalogBlock.value === CatalogBlock.SERVICE && selectedService.value) {
      orderStore.selectedService = null
    } else if (catalogBlock.value === CatalogBlock.COUNTRY && selectedCountry.value) {
      selectedCountry.value = null
    }
  }
</script>

<template>
  <button
    v-if="isShowButton"
    @click="handleGoBack"
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
