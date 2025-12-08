<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import CheckCircleIcon from '@/assets/images/icons/modal/check-circle.svg'
  import Checkbox from '@/components/Shared/Checkbox.vue'
  import NumberWithoutCode from '@/components/Activation/PhoneNumber/NumberWithoutCode.vue'
  import NumberWithCode from '@/components/Activation/PhoneNumber/NumberWithCode.vue'

  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const isChecked = ref(false)
  const numberReadyStatus = computed({
    get: () => modalStore.numberReadyModal.status,
    set: (newValue: boolean) => {
      modalStore.numberReadyModal.status = newValue
    }
  })
  const activation = computed(() => modalStore.numberReadyModal.activation)

  const close = () => {
    modalStore.numberReadyModal = { status: false, activation: null }
  }

  watch(
    () => numberReadyStatus.value,
    (newValue) => {
      if (!newValue) close()
      else isChecked.value = false
    }
  )

  watch(
    () => isChecked.value,
    (newVal: boolean) => {
      if (newVal) localStorage.setItem('showNumberReadyModal', 'false')
      else localStorage.removeItem('showNumberReadyModal')
    }
  )
</script>

<template>
  <Modal v-model="numberReadyStatus" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <CheckCircleIcon class="tn:h-18 tn:w-18" />
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ $t('web_title_number_ready') }}
        </div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{ $t('web_subtitle_copy_with_or_without_country_code') }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-3">
        <NumberWithCode :activation="activation" />
        <NumberWithoutCode :activation="activation" />
      </div>

      <Button @click="close" fill block>{{ $t('web_ok_button') }}</Button>

      <Checkbox v-model="isChecked" :label="$t('web_don_t_show_again_checkbox')" id="number_ready_modal_show" />
    </div>
  </Modal>
</template>
