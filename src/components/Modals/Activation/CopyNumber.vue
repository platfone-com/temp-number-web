<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Checkbox from '@/components/Shared/Checkbox.vue'
  import NumberWithoutCode from '@/components/Activation/PhoneNumber/NumberWithoutCode.vue'
  import NumberWithCode from '@/components/Activation/PhoneNumber/NumberWithCode.vue'

  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const isChecked = ref(false)
  const copyNumberModalStatus = computed({
    get: () => modalStore.copyNumberModal.status,
    set: (newValue: boolean) => {
      modalStore.copyNumberModal.status = newValue
    }
  })
  const activation = computed(() => modalStore.copyNumberModal.activation)

  const close = () => {
    modalStore.copyNumberModal = { status: false, activation: null }
  }

  watch(
    () => copyNumberModalStatus.value,
    (newValue) => {
      if (!newValue) close()
      else isChecked.value = false
    }
  )

  watch(
    () => isChecked.value,
    (newVal: boolean) => {
      if (newVal) localStorage.setItem('showCopyNumberModal', 'false')
      else localStorage.removeItem('showCopyNumberModal')
    }
  )
</script>

<template>
  <Modal v-model="copyNumberModalStatus" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ $t('web_title_copy_number') }}
        </div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{ $t('web_subtitle_with_or_without_the_country_code') }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-3">
        <NumberWithCode :activation="activation" />
        <NumberWithoutCode :activation="activation" />
      </div>

      <Checkbox v-model="isChecked" :label="$t('web_don_t_show_again_checkbox')" id="copy_number_modal_show" />
    </div>
  </Modal>
</template>
