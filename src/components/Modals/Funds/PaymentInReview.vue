<script lang="ts" setup>
  import { watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const { paymentInReviewModal } = storeToRefs(useModalStore())

  const close = () => {
    modalStore.paymentInReviewModal = false
  }

  watch(
    () => paymentInReviewModal.value,
    (newValue) => {
      if (!newValue) close()
    }
  )
</script>

<template>
  <Modal v-model="paymentInReviewModal" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ $t('notifications_manual_review_needed') }}
        </div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{
            $t(
              'notifications_the_order_has_been_flagged_for_manual_approval_usually_it_takes_1_2_hours_and_you_will_be_informed_by_email'
            )
          }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button @click="close" fill block>{{ $t('notifications_ok') }}</Button>
      </div>
    </div>
  </Modal>
</template>
