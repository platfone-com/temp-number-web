<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import { useActivation } from '@/composables/api/useActivation'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const modalStore = useModalStore()
  const { retryActivation } = useActivation()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const loading = ref(false)

  const retryNumberModalStatus = computed({
    get: () => modalStore.retryNumberModal.status,
    set: (newValue: boolean) => {
      modalStore.retryNumberModal.status = newValue
    }
  })
  const activationId = computed(() => modalStore.retryNumberModal.activationId)

  const close = () => {
    modalStore.retryNumberModal = { status: false, activationId: null }
    loading.value = false
  }

  const retry = async () => {
    if (!activationId.value) return
    loading.value = true
    const data = await retryActivation(activationId.value)
    loading.value = false
    if (data) close()
  }

  watch(
    () => retryNumberModalStatus.value,
    (newValue) => {
      if (!newValue) close()
    }
  )
</script>

<template>
  <Modal v-model="retryNumberModalStatus" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ $t('web_title_get_another_message') }}
        </div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{
            $t(
              'web_subtitle_you_can_try_to_receive_an_additional_sms_but_delivery_isn_t_guaranteed_a_new_message_will_replace_the_previous_one'
            )
          }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button @click="retry" fill block :loading="loading">{{ $t('web_retry_now_button') }}</Button>
        <Button @click="close" fill block color="secondary">{{ $t('web_no_thanks_button') }}</Button>
      </div>
    </div>
  </Modal>
</template>
