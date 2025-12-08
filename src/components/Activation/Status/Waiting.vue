<script lang="ts" setup>
  import type { PropType } from 'vue'
  import { SmsStatus } from '@/types/api/activation'
  import ButtonSpinner from '@/components/Shared/Spinners/ButtonSpinner.vue'

  defineProps({
    smsStatus: {
      type: String as PropType<SmsStatus>,
      required: true
    }
  })
</script>

<template>
  <div
    class="tn:border-primary-900 tn:flex tn:h-14 tn:items-center tn:justify-center tn:gap-2 tn:rounded-xl tn:border tn:px-8 tn:py-2.5"
  >
    <ButtonSpinner color="tn:border-primary-900" size="tn:h-4.5 tn:w-4.5" weight="tn:border-2" />
    <span class="tn:text-primary-900 tn:text-sm tn:font-medium">
      {{ smsStatus === SmsStatus.smsRequested ? $t('web_waiting_for_sms') : $t('web_waiting_for_additional_sms') }}
    </span>
  </div>
</template>
