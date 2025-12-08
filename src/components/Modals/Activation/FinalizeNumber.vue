<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import { useActivation } from '@/composables/api/useActivation'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const modalStore = useModalStore()
  const { finalizeActivation } = useActivation()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const loading = ref(false)

  const finalizeNumberModalStatus = computed({
    get: () => modalStore.finalizeNumberModal.status,
    set: (newValue: boolean) => {
      modalStore.finalizeNumberModal.status = newValue
    }
  })
  const activationId = computed(() => modalStore.finalizeNumberModal.activationId)

  const close = () => {
    modalStore.finalizeNumberModal = { status: false, activationId: null }
    loading.value = false
  }

  const finalize = async () => {
    if (!activationId.value) return
    loading.value = true
    const data = await finalizeActivation(activationId.value)
    loading.value = false
    if (data) close()
  }

  watch(
    () => finalizeNumberModalStatus.value,
    (newValue) => {
      if (!newValue) close()
    }
  )
</script>

<template>
  <Modal v-model="finalizeNumberModalStatus" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ $t('web_title_cancel_number') }}
        </div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{
            $t(
              'web_subtitle_sms_has_been_received_so_a_refund_is_not_possible_if_you_had_issues_try_getting_another_sms_or_report_this_number'
            )
          }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button @click="finalize" fill block :loading="loading">{{ $t('web_cancel_now_button') }}</Button>
        <Button @click="close" fill block color="secondary">{{ $t('web_no_keep_it_button') }}</Button>
      </div>
    </div>
  </Modal>
</template>
