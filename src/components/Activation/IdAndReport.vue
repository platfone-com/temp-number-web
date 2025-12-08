<script lang="ts" setup>
  import { type PropType, ref } from 'vue'
  import type { IActivation } from '@/types/api/activation'
  import { useClipboard } from '@/composables/useClipboard'
  import ReportStatus from '@/components/Activation/ReportStatus.vue'

  defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const { copyToClipboard } = useClipboard()

  const idRef = ref()
</script>

<template>
  <div class="tn:bg-tn-black-50 tn:flex tn:h-10 tn:items-center tn:justify-between tn:gap-2 tn:rounded-xl tn:px-2">
    <div
      @click="copyToClipboard(activation.activation_id, idRef, 1500)"
      :class="[
        'tn:text-xxs tn:cursor-pointer tn:font-medium',
        'tn:opacity-40 tn:transition-opacity tn:duration-300 tn:hover:opacity-60'
      ]"
    >
      #<span ref="idRef">{{ activation.activation_id }}</span>
    </div>
    <ReportStatus :activation="activation" />
  </div>
</template>
