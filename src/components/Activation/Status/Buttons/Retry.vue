<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import { ActivationStatus, BillingStatus, type IActivation, SmsStatus } from '@/types/api/activation'
  import RetryIcon from '@/assets/images/icons/order/retry.svg'

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const modalStore = useModalStore()

  const showRetryBtn = computed(
    () =>
      props.activation.expire_at * 1000 - Date.now() >= 0 &&
      props.activation.is_retriable &&
      [SmsStatus.smsReceived, SmsStatus.retryReceived].includes(props.activation.sms_status) &&
      props.activation.billing_status === BillingStatus.billed &&
      props.activation.activation_status === ActivationStatus.active
  )

  const retry = () => {
    modalStore.retryNumberModal = { status: true, activationId: props.activation.activation_id }
  }
</script>

<template>
  <button
    v-if="showRetryBtn"
    @click="retry"
    :class="[
      'tn:flex tn:items-center tn:gap-2 tn:rounded-xl tn:px-6 tn:py-4.5',
      'tn:bg-tn-black-60 tn:hover:bg-tn-black-70 tn:active:bg-tn-black-100 tn:transition-colors tn:duration-300',
      'tn:text-primary-900 tn:text-sm tn:font-medium'
    ]"
  >
    <RetryIcon class="tn:text-primary-900 tn:h-4.5 tn:w-4.5 tn:min-w-4.5" />
    <span>{{ $t('web_retry_button') }}</span>
  </button>
</template>
