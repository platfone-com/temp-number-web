<script lang="ts" setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOrderStore } from '@/stores/order'
  import { useOrderListHeight } from '@/composables/useOrderListHeight'
  import { useWindowWidth } from '@/composables/useWindowWidth'
  import { useForceOrder } from '@/composables/useForceOrder'
  import { CatalogBlock } from '@/types/stores/order'
  import OrderHeader from '@/components/Order/Number/Order/Header.vue'
  import ImageWithFallback from '@/components/Order/Shared/ImageWithFallback.vue'
  import ChangeOrderButton from '@/components/Order/Number/Order/ChangeOrderButton.vue'
  import Validity from '@/components/Order/Number/Order/Validity.vue'
  import Price from '@/components/Order/Number/Order/Price.vue'
  import Warning from '@/components/Activation/Warning.vue'
  import ExplanationText from '@/components/Order/Number/Order/ExplanationText.vue'
  import OrderButton from '@/components/Order/Number/Order/OrderButton.vue'

  const { height } = useOrderListHeight()
  const { windowWidth, lgBreakpoint } = useWindowWidth()
  const { removeForceOrderData } = useForceOrder()
  const orderStore = useOrderStore()
  const { catalogBlock, selectedService, selectedCountry } = storeToRefs(orderStore)

  const isAnyOtherService = computed(() => {
    return (
      selectedService.value && 'service_id' in selectedService.value && selectedService.value.service_id === 'other'
    )
  })

  const changeService = () => {
    if (catalogBlock.value === CatalogBlock.SERVICE) {
      orderStore.clearOrder()
    } else {
      orderStore.selectedService = null
      orderStore.orderPrice = 0
      orderStore.orderId = ''
    }
    removeForceOrderData()
  }

  const changeCountry = () => {
    if (catalogBlock.value === CatalogBlock.COUNTRY) {
      orderStore.clearOrder()
    } else {
      orderStore.selectedCountry = null
      orderStore.orderPrice = 0
      orderStore.orderId = ''
    }
    removeForceOrderData()
  }
</script>

<template>
  <div>
    <OrderHeader class="tn:hidden tn:lg:mx-6 tn:lg:flex" />
    <div
      :style="windowWidth >= lgBreakpoint && { height: height - 24 + 'px' }"
      class="scrollbar-thin tn:overflow-y-auto tn:ltr:lg:pr-4 tn:ltr:lg:pl-6 tn:rtl:lg:pr-6 tn:rtl:lg:pl-4"
    >
      <div class="tn:border-tn-black-950/12 tn:rounded-3xl tn:border tn:p-4 tn:lg:border-none tn:lg:p-0">
        <OrderHeader class="tn:!mb-4 tn:flex tn:lg:mx-6 tn:lg:hidden" />
        <div class="tn:flex tn:flex-col tn:gap-2">
          <div
            :class="[
              'tn:flex tn:items-center tn:justify-between tn:gap-4 tn:py-1 tn:lg:py-2',
              catalogBlock === CatalogBlock.COUNTRY ? 'tn:order-2' : 'tn:order-1'
            ]"
          >
            <div class="tn:flex tn:min-w-0 tn:items-center tn:gap-2.5">
              <ImageWithFallback
                :key="selectedService?.service_id"
                image-type="services"
                :image-id="selectedService?.service_id || ''"
              />
              <div class="tn:truncate tn:text-sm tn:lg:text-base">
                {{ isAnyOtherService ? $t('web_any_other_item') : selectedService?.name }}
              </div>
            </div>
            <ChangeOrderButton @click="changeService" />
          </div>
          <div
            :class="[
              'tn:flex tn:items-center tn:justify-between tn:gap-4 tn:py-1 tn:lg:py-2',
              catalogBlock === CatalogBlock.SERVICE ? 'tn:order-2' : ''
            ]"
          >
            <div class="tn:flex tn:min-w-0 tn:items-center tn:gap-2.5">
              <ImageWithFallback
                :key="selectedCountry?.country_id"
                image-type="countries"
                :image-id="selectedCountry?.country_id || ''"
              />
              <div class="tn:truncate tn:text-sm tn:lg:text-base">{{ selectedCountry?.name }}</div>
              <div class="tn:mt-0.5 tn:hidden tn:truncate tn:text-xs tn:opacity-40 tn:lg:block" dir="ltr">
                +{{ selectedCountry?.codes?.join(', +') }}
              </div>
            </div>
            <ChangeOrderButton @click="changeCountry" />
          </div>
        </div>
        <Validity />
        <Price />
      </div>
      <div class="tn:mt-6">
        <Warning v-if="selectedService && selectedService.has_warning" :service-id="selectedService.service_id" />
      </div>
      <OrderButton />
      <ExplanationText />
    </div>
  </div>
</template>

<style scoped>
  @media (min-width: 1024px) {
    .scrollbar-thin {
      scrollbar-gutter: stable;
    }
  }
</style>
