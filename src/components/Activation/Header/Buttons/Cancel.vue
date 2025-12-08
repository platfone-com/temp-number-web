<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useModalStore } from '@/stores/modal'
  import { useOrderStore } from '@/stores/order'
  import { useActivation } from '@/composables/api/useActivation'
  import { type IActivation, ActivationStatus, BillingStatus, SmsStatus } from '@/types/api/activation'
  import TrashButton from '@/components/Activation/Header/Buttons/Trash.vue'
  import ButtonSpinner from '@/components/Shared/Spinners/ButtonSpinner.vue'

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const { cancelActivation } = useActivation()

  const modalStore = useModalStore()
  const { cancelNumberLoading } = storeToRefs(useOrderStore())

  const showCancelBtn = computed(
    () =>
      props.activation.expire_at * 1000 - Date.now() >= 0 &&
      props.activation.cancelable_after &&
      props.activation.activation_status === ActivationStatus.active &&
      props.activation.billing_status === BillingStatus.reserved &&
      props.activation.sms_status === SmsStatus.smsRequested
  )

  const cancel = async () => {
    if (!props.activation?.cancelable_after) return
    const showCancelModal = localStorage.getItem('showCancelNumberModal')
    if (!showCancelModal || showCancelModal !== 'false' || props.activation.cancelable_after * 1000 > Date.now()) {
      modalStore.cancelNumberModal = { status: true, activation: props.activation, numberCanceled: false }
    } else {
      await cancelActivation(props.activation)
    }
  }
</script>

<template>
  <template v-if="showCancelBtn">
    <div v-if="cancelNumberLoading" class="tn:flex tn:h-5 tn:w-5 tn:items-center tn:justify-center">
      <ButtonSpinner color="tn:border-primary-900" size="tn:h-4 tn:w-4" weight="tn:border-2" />
    </div>
    <TrashButton v-else @click="cancel" :disabled="cancelNumberLoading" />
  </template>
</template>
