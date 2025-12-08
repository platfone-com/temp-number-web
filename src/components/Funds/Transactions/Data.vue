<script lang="ts" setup>
  import { type ITransaction } from '@/types/api/funds'
  import DataItem from '@/components/Funds/Transactions/DataItem.vue'

  defineProps<{
    transactions: ITransaction[]
  }>()

  const headerSharedClasses = 'tn:py-3 tn:px-1.5 tn:xs:p-3 tn:text-sm tn:leading-4'
  const idWidthClasses = 'tn:w-[10%] tn:sm:w-[10%]'
  const dateWidthClasses = 'tn:w-[21%] tn:sm:w-[20%]'
  const gatewayWidthClasses = 'tn:w-[45%] tn:sm:w-[50%]'
  const amountWidthClasses = 'tn:w-[24%] tn:sm:w-[20%]'
</script>

<template>
  <div class="tn:overflow-x-auto">
    <div class="tn:bg-tn-black-50 tn:mb-4 tn:flex tn:rounded-md">
      <div :class="[headerSharedClasses, idWidthClasses, 'tn:flex tn:justify-start tn:ltr:pl-3 tn:rtl:pr-3']">
        {{ $t('web_funds_table_id_do_not_translate') }}
      </div>
      <div :class="[headerSharedClasses, dateWidthClasses]">{{ $t('web_funds_table_date') }}</div>
      <div :class="[headerSharedClasses, gatewayWidthClasses]">{{ $t('web_funds_table_details') }}</div>
      <div :class="[headerSharedClasses, amountWidthClasses, 'tn:text-end tn:ltr:pr-3 tn:rtl:pl-3']">
        {{ $t('web_funds_table_amount_in_usd') }}
      </div>
    </div>

    <DataItem
      v-for="(transaction, index) in transactions"
      :key="index"
      :transaction="transaction"
      :width-classes="{ idWidthClasses, dateWidthClasses, gatewayWidthClasses, amountWidthClasses }"
    />
  </div>
</template>
