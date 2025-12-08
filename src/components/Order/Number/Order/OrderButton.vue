<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useOrderStore } from '@/stores/order'
  import { useActivation } from '@/composables/api/useActivation'
  import Button from '@/components/Shared/Button.vue'

  const { createActivation } = useActivation()
  const orderStore = useOrderStore()
  const { orderLoading } = storeToRefs(orderStore)
</script>

<template>
  <Button fill class="tn:mt-6" block :loading="orderLoading" @click="() => createActivation()">
    {{ $t('web_order_number_cta_button') }}
  </Button>
</template>
