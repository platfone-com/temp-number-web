<script lang="ts" setup>
  import { type PropType } from 'vue'
  import type { IReportReason } from '@/types/api/report'
  import ArrowIcon from '@/assets/images/icons/report/details/arrow.svg'

  defineEmits(['selectReason'])
  defineProps({
    reason: {
      type: Object as PropType<IReportReason>,
      required: true
    }
  })
</script>

<template>
  <button
    @click="$emit('selectReason', reason)"
    :class="[
      'tn:flex tn:items-center tn:justify-between tn:gap-2 tn:rounded-xl',
      'tn:py-4.75 tn:ltr:pr-5 tn:ltr:pl-6 tn:rtl:pr-6 tn:rtl:pl-5',
      'tn:bg-tn-black-50 tn:hover:bg-tn-black-100',
      'tn:transition-colors tn:duration-300'
    ]"
  >
    <span class="tn:text-start tn:leading-5 tn:font-medium tn:opacity-50">{{ reason.reason_name }}</span>
    <ArrowIcon class="tn:text-tn-black-900 tn:h-6 tn:w-6 tn:min-w-6 tn:rotate-90 tn:opacity-20 tn:rtl:rotate-270" />
  </button>
</template>
