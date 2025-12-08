<script lang="ts" setup>
  import { ref, type PropType } from 'vue'
  import { useClipboard } from '@/composables/useClipboard'
  import type { IActivation } from '@/types/api/activation'
  import NumberBlock from '@/components/Activation/PhoneNumber/NumberBlock.vue'
  import CopyIcon from '@/assets/images/icons/copy.svg'
  import ImageWithFallback from '@/components/Order/Shared/ImageWithFallback.vue'

  defineProps({
    activation: {
      type: Object as PropType<IActivation | null>,
      required: true
    }
  })

  const { copyToClipboard } = useClipboard()

  const phoneRef = ref()
</script>

<template>
  <NumberBlock
    v-if="activation"
    @click.prevent="copyToClipboard(activation?.phone, phoneRef ?? undefined, 1500)"
    class="tn:cursor-pointer"
  >
    <div class="tn:flex tn:items-center tn:gap-1.5">
      <ImageWithFallback
        image-type="countries"
        size="tn:h-5 tn:w-5"
        :image-id="activation.country_id"
        rounded="tn:rounded-sm"
      />
      <div dir="ltr">
        +<span ref="phoneRef">{{ activation.formatted.replace('+', '') }}</span>
      </div>
    </div>
    <CopyIcon class="tn:text-primary-900 tn:h-6 tn:w-6 tn:fill-current" />
  </NumberBlock>
</template>
