<script lang="ts" setup>
  import { ref, computed, type PropType } from 'vue'
  import { useClipboard } from '@/composables/useClipboard'
  import type { IActivation } from '@/types/api/activation'
  import NumberBlock from '@/components/Activation/PhoneNumber/NumberBlock.vue'
  import CopyIcon from '@/assets/images/icons/copy.svg'
  import ImageWithFallback from '@/components/Order/Shared/ImageWithFallback.vue'

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation | null>,
      required: true
    }
  })

  const { copyToClipboard } = useClipboard()

  const phoneRef = ref()
  const code = computed(() => {
    if (!props.activation) return ''
    const phoneParts = props.activation.formatted.split(' ')
    return phoneParts[0].replace('+', '')
  })
  const phoneCp = computed(() => {
    if (!props.activation || !code.value) return ''
    return props.activation.formatted.replace(`+${code.value}`, '')
  })
</script>

<template>
  <NumberBlock
    v-if="activation"
    @click.prevent="copyToClipboard(activation?.phone.replace(`${code}`, ''), phoneRef ?? undefined, 1500)"
    class="tn:cursor-pointer"
  >
    <div class="tn:flex tn:items-center tn:gap-1.5">
      <ImageWithFallback
        image-type="countries"
        size="tn:h-5 tn:w-5"
        :image-id="activation.country_id"
        rounded="tn:rounded-sm"
        class="tn:opacity-20"
      />
      <div dir="ltr">
        <span class="tn:opacity-20">+{{ code }}</span> <span ref="phoneRef">{{ phoneCp }}</span>
      </div>
    </div>
    <CopyIcon class="tn:text-primary-900 tn:h-6 tn:w-6 tn:fill-current" />
  </NumberBlock>
</template>
