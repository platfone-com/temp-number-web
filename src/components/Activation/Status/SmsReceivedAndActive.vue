<script lang="ts" setup>
  import { type PropType } from 'vue'
  import { type IActivation } from '@/types/api/activation'
  import SmsTextButton from '@/components/Activation/Status/Buttons/SmsText.vue'
  import RetryButton from '@/components/Activation/Status/Buttons/Retry.vue'

  defineEmits(['copyFullMessage'])
  defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })
</script>

<template>
  <div class="tn:flex tn:items-center tn:gap-1">
    <SmsTextButton @copyFullMessage="$emit('copyFullMessage')" :activation="activation" class="tn:min-w-0" />
    <RetryButton :activation="activation" />
  </div>
</template>
