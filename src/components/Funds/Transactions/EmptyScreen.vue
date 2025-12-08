<script lang="ts" setup>
  import { useOrderListHeight } from '@/composables/useOrderListHeight'
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import EmptyTransactionsIcon from '@/assets/images/icons/empty/transactions.svg'
  import Button from '@/components/Shared/Button.vue'

  const { height } = useOrderListHeight()
  const { wlHelperFundsUrl } = useWlHelper()
</script>

<template>
  <div :style="{ height: `${height}px` }" class="tn:flex tn:items-center tn:justify-center">
    <div class="tn:flex tn:flex-col tn:items-center tn:gap-4 tn:text-center">
      <EmptyTransactionsIcon class="tn:h-16 tn:w-16" />
      <div class="tn:flex tn:flex-col tn:gap-1">
        <h3 class="tn:text-2xl tn:leading-[1.625rem] tn:font-medium">
          {{ $t('web_funds_empty_no_transactions') }}
        </h3>
        <p class="tn:text-sm tn:leading-[160%] tn:opacity-60">
          {{ $t('web_funds_empty_add_funds_to_get_started') }}
        </p>
      </div>
      <Button v-bind="config.wlWidgetMode ? { href: wlHelperFundsUrl } : { to: 'Funds' }" fill>
        {{ $t('web_empty_add_funds_cta_button') }}
      </Button>
    </div>
  </div>
</template>
