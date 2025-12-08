<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useOrderStore } from '@/stores/order'
  import useSharedCss from '@/composables/useSharedCss'
  import Countdown from '@/components/Shared/Countdown.vue'
  import Button from '@/components/Shared/Button.vue'

  defineEmits(['closeModal', 'countdownFinished'])
  defineProps({
    endTime: {
      type: Number,
      required: true
    }
  })

  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const { cancelNumberLoading } = storeToRefs(useOrderStore())
</script>

<template>
  <div :class="adaptiveModalWrapperClasses()">
    <Countdown @finished="$emit('countdownFinished')" :end-time="endTime" :with-circle="true" />
    <div>
      <div :class="adaptiveModalHeaderClasses()">
        {{ $t('web_title_please_wait') }}
      </div>
      <div :class="adaptiveModalSubheaderClasses()">
        {{ $t('web_subtitle_cancellation_and_refund_will_be_avallable_after_this_time_if_no_sms_is_received') }}
      </div>
    </div>

    <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
      <Button @click="$emit('closeModal')" :loading="cancelNumberLoading" fill block>{{ $t('web_ok_button') }}</Button>
    </div>
  </div>
</template>
