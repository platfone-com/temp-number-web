<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import { useClipboard } from '@/composables/useClipboard'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import CopyIcon from '@/assets/images/icons/copy.svg'

  const modalStore = useModalStore()
  const { copyToClipboard } = useClipboard()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const activationMessageRef = ref()
  const numberMessageModalStatus = computed({
    get: () => modalStore.copyNumberMessageModal.status,
    set: (newValue: boolean) => {
      modalStore.copyNumberMessageModal.status = newValue
    }
  })
  const activation = computed(() => modalStore.copyNumberMessageModal.activation)
  const smsText = computed(() => String(activation.value?.sms_text || ''))
  const smsCode = computed(() => String(activation.value?.sms_code || ''))

  const copy = () => {
    const messageCode = smsCode.value ? '\n' + smsCode.value : ''
    copyToClipboard(smsText.value + messageCode, activationMessageRef.value)
  }

  watch(
    () => numberMessageModalStatus.value,
    (newValue) => {
      if (!newValue) {
        modalStore.copyNumberMessageModal = { status: false, activation: null }
      }
    }
  )
</script>

<template>
  <Modal v-model="numberMessageModalStatus" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ $t('web_title_popup_received_message') }}
        </div>
        <div ref="activationMessageRef" :class="[adaptiveModalSubheaderClasses(), 'tn:flex tn:flex-col tn:gap-1']">
          <div v-if="smsText" v-linkify="smsText" />
          <div v-if="smsCode">{{ smsCode }}</div>
        </div>
      </div>
      <Button @click="copy" fill block gap="tn:gap-2">
        <span>{{ $t('web_copy_button') }}</span>
        <CopyIcon class="tn:h-4.5 tn:w-4.5 tn:fill-current tn:text-white" />
      </Button>
    </div>
  </Modal>
</template>
