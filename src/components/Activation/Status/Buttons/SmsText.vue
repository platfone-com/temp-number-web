<script lang="ts" setup>
  import { type PropType, ref, computed } from 'vue'
  import { useClipboard } from '@/composables/useClipboard'
  import type { IActivation } from '@/types/api/activation'
  import CopyIcon from '@/assets/images/icons/copy.svg'
  import Button from '@/components/Shared/Button.vue'

  const emit = defineEmits(['copyFullMessage'])
  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const { copyToClipboard } = useClipboard()

  const smsCodeRef = ref()
  const smsCode = computed(() => String(props.activation.sms_code || ''))

  const copy = () => {
    if (smsCode.value) {
      copyToClipboard(smsCode.value, smsCodeRef.value)
    } else {
      emit('copyFullMessage')
    }
  }
</script>

<template>
  <Button @click="copy" fill block gap="tn:gap-2" class="tn:border-none tn:py-4.5">
    <div ref="smsCodeRef" class="tn:min-w-0 tn:truncate tn:text-sm tn:font-medium">
      <span v-if="smsCode">{{ smsCode }}</span>
      <span v-else>{{ $t('web_copy_button') }}</span>
    </div>
    <CopyIcon class="tn:h-4.5 tn:w-4.5 tn:min-w-4.5 tn:fill-current tn:text-white" />
  </Button>
</template>
