<script lang="ts" setup>
  import { addBreakLinesToText } from '@/utils/translate'
</script>

<template>
  <div
    v-html="addBreakLinesToText($t('web_order_only_successful_activations_are_paid_no_message_no_payment'))"
    class="tn:text-tn-black-300 tn:mt-6 tn:text-center tn:text-sm tn:leading-5.5"
  />
</template>
