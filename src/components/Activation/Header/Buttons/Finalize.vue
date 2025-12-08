<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import { ActivationStatus, BillingStatus, type IActivation, SmsStatus } from '@/types/api/activation'
  import TrashButton from '@/components/Activation/Header/Buttons/Trash.vue'

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const modalStore = useModalStore()

  const showFinalizeBtn = computed(
    () =>
      props.activation.expire_at * 1000 - Date.now() >= 0 &&
      [SmsStatus.smsReceived, SmsStatus.retryRequested, SmsStatus.retryReceived].includes(
        props.activation.sms_status
      ) &&
      props.activation.billing_status === BillingStatus.billed &&
      props.activation.activation_status === ActivationStatus.active
  )

  const finalize = () => {
    modalStore.finalizeNumberModal = { status: true, activationId: props.activation.activation_id }
  }
</script>

<template>
  <TrashButton v-if="showFinalizeBtn" @click="finalize" />
</template>
