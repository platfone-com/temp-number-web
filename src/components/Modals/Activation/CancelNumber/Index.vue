<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import { useOrderStore } from '@/stores/order'
  import { useActivation } from '@/composables/api/useActivation'
  import Modal from '@/components/Shared/Modal.vue'
  import CancelAfter from '@/components/Modals/Activation/CancelNumber/CancelAfter.vue'
  import CancelAndRefund from '@/components/Modals/Activation/CancelNumber/CancelAndRefund.vue'
  import NumberCanceled from '@/components/Modals/Activation/CancelNumber/NumberCanceled.vue'

  const modalStore = useModalStore()
  const orderStore = useOrderStore()
  const { cancelActivation } = useActivation()

  const countdownFinished = ref(false)
  const activation = computed(() => modalStore.cancelNumberModal.activation)
  const numberCanceled = computed(() => modalStore.cancelNumberModal.numberCanceled)

  const cancelNumberModalStatus = computed({
    get: () => modalStore.cancelNumberModal.status,
    set: (newValue: boolean) => {
      modalStore.cancelNumberModal.status = newValue
    }
  })
  const showCancelAfter = computed(() => {
    if (countdownFinished.value) return false
    return activation.value?.cancelable_after && activation.value.cancelable_after * 1000 > Date.now()
  })

  const close = () => {
    modalStore.cancelNumberModal = { status: false, activation: null, numberCanceled: false }
    countdownFinished.value = false
    orderStore.selectedService = null
    orderStore.selectedCountry = null
    orderStore.orderPrice = 0
    orderStore.orderId = ''
  }

  const handleCountdownFinished = async () => {
    const showCancelModal = localStorage.getItem('showCancelNumberModal')
    if (!showCancelModal || showCancelModal !== 'false') {
      countdownFinished.value = true
    } else {
      if (activation.value) {
        await cancelActivation(activation.value)
        countdownFinished.value = true
      }
    }
  }

  watch(
    () => cancelNumberModalStatus.value,
    (newValue) => {
      if (!newValue) close()
    }
  )
</script>

<template>
  <Modal v-model="cancelNumberModalStatus" :close-btn="true">
    <CancelAfter
      v-if="showCancelAfter && activation?.cancelable_after"
      @closeModal="close"
      @countdownFinished="handleCountdownFinished"
      :end-time="activation?.cancelable_after"
    />
    <CancelAndRefund v-else-if="!showCancelAfter && !numberCanceled" />
    <NumberCanceled v-else-if="numberCanceled" @closeModal="close" />
  </Modal>
</template>
