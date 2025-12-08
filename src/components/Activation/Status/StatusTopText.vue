<script lang="ts" setup>
  import { ref, computed, type PropType } from 'vue'
  import { useActivationHelper } from '@/composables/useActivationHelper'
  import { useClipboard } from '@/composables/useClipboard'
  import { type IActivation, SmsStatus } from '@/types/api/activation'

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const { copyToClipboard } = useClipboard()
  const {
    isWaitingStatus,
    isExpiredStatus,
    isReceivedAndActiveStatus,
    isReceivedAndExpiredStatus,
    isCanceledStatus,
    isRefundedStatus
  } = useActivationHelper()

  const msgRef = ref()
  const smsText = computed(() => String(props.activation.sms_text || ''))

  const copyFullMessage = () => {
    if (smsText.value) {
      copyToClipboard(smsText.value, msgRef.value)
    }
  }

  defineExpose({ copyFullMessage })
</script>

<template>
  <div class="tn:px-2 tn:text-xs">
    <span v-if="isRefundedStatus(activation)">
      {{
        $t('web_sms_received_but_we_made_1_10_refund_according_to_your_confirmed_report').replace(
          '__0__',
          ((activation.customer_price || 0) / 100).toString()
        )
      }}
    </span>
    <span v-else-if="isExpiredStatus(activation) || isCanceledStatus(activation)">
      {{ $t('web_this_number_is_not_active_anymore_payment_has_been_cancelled') }}
    </span>
    <template v-else-if="isWaitingStatus(activation)">
      <span v-if="activation.sms_status === SmsStatus.smsRequested">
        {{ $t('web_please_send_message_to_this_number_and_sms_will_appear_here') }}
      </span>
      <span v-else-if="activation.sms_status === SmsStatus.retryRequested">
        {{ $t('web_please_send_additional_message_to_this_number_and_sms_will_appear_here') }}
      </span>
    </template>
    <div v-else-if="isReceivedAndActiveStatus(activation)">
      <div
        v-if="smsText"
        @click="copyToClipboard(smsText, msgRef)"
        v-linkify="smsText"
        ref="msgRef"
        class="tn:cursor-copy"
      />
    </div>
    <span v-else-if="isReceivedAndExpiredStatus(activation)">
      {{ $t('web_sms_received_and_activation_successfully_billed_full_price') }}
    </span>
  </div>
</template>
