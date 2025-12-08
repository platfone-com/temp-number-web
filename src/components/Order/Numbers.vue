<script lang="ts" setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOrderStore } from '@/stores/order'
  import Card from '@/components/Order/Shared/Card.vue'
  import OrderNumber from '@/components/Order/Number/Order/Index.vue'
  import ActiveNumbers from '@/components/Order/Number/Active/Index.vue'
  import RefreshMobButton from '@/components/Order/Number/Active/RefreshMobButton.vue'
  import MobileBackButton from '@/components/Order/Shared/MobileBackButton.vue'
  import MobileNewOrderButton from '@/components/Order/Shared/MobileNewOrderButton.vue'
  import NumberReadyModal from '@/components/Modals/Activation/NumberReady.vue'

  const { orderPrice, oneBlockOrder, activeNumbers } = storeToRefs(useOrderStore())
  const activeNumbersRef = ref()

  const refreshActiveActivations = async () => {
    if (activeNumbersRef.value) {
      await activeNumbersRef.value.loadActiveNumbers()
    }
  }
</script>

<template>
  <Card
    :class="[
      'tn:mx-auto tn:w-full tn:max-w-135 tn:lg:w-[40%]',
      orderPrice || !oneBlockOrder ? 'tn:block' : 'tn:hidden tn:lg:block'
    ]"
  >
    <template #header>
      <div class="tn:h-7.5 tn:w-full">
        <div
          :class="[
            'tn:flex tn:w-full tn:items-center tn:justify-between tn:gap-3',
            activeNumbers === null && 'tn:hidden tn:lg:block'
          ]"
        >
          <div class="tn:flex tn:items-center tn:gap-3">
            <MobileBackButton />
            <MobileNewOrderButton />
            <h3 class="tn:text-2xl tn:leading-7.5 tn:font-semibold">{{ $t('web_title_number') }}</h3>
          </div>
          <RefreshMobButton v-if="!orderPrice" @click="refreshActiveActivations" />
        </div>
      </div>
    </template>
    <OrderNumber v-if="orderPrice" />
    <ActiveNumbers v-else ref="activeNumbersRef" />
  </Card>
  <NumberReadyModal />
</template>
