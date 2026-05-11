<script lang="ts" setup>
  import { watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useModalStore } from '@/stores/modal'
  import { useOrderStore } from '@/stores/order'
  import { useActivation } from '@/composables/api/useActivation'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const { createActivation } = useActivation()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const modalStore = useModalStore()
  const orderStore = useOrderStore()
  const { activationTimeoutModal } = storeToRefs(modalStore)
  const { orderLoading } = storeToRefs(orderStore)

  let isRetrying = false

  const handleRetry = async () => {
    isRetrying = true
    activationTimeoutModal.value = false
    await createActivation()
  }

  const handleCancel = () => {
    activationTimeoutModal.value = false
  }

  watch(activationTimeoutModal, (newValue) => {
    if (!newValue && !isRetrying) {
      orderStore.orderId = ''
    }
    isRetrying = false
  })
</script>

<template>
  <Modal v-model="activationTimeoutModal" :close-btn="true">
    <div data-testid="activation-timeout-modal" :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">{{ $t('notifications_request_timeout') }}</div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{ $t('notifications_activation_request_timed_out_please_try_again') }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button data-testid="activation-timeout-retry" @click="handleRetry" fill block :loading="orderLoading">
          {{ $t('text_order_timeout_proceed') }}
        </Button>
        <Button data-testid="activation-timeout-cancel" @click="handleCancel" fill block color="secondary">
          {{ $t('notifications_close') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
