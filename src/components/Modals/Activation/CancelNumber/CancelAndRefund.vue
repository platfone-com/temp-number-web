<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useModalStore } from '@/stores/modal'
  import { useOrderStore } from '@/stores/order'
  import useSharedCss from '@/composables/useSharedCss'
  import { useActivation } from '@/composables/api/useActivation'
  import Checkbox from '@/components/Shared/Checkbox.vue'
  import Button from '@/components/Shared/Button.vue'

  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()
  const { cancelActivation } = useActivation()

  const isChecked = ref(false)
  const { cancelNumberLoading } = storeToRefs(useOrderStore())
  const activation = computed(() => modalStore.cancelNumberModal.activation)

  const cancel = () => {
    if (activation.value) {
      cancelActivation(activation.value)
    }
  }

  watch(
    () => isChecked.value,
    (newVal: boolean) => {
      if (newVal) localStorage.setItem('showCancelNumberModal', 'false')
      else localStorage.removeItem('showCancelNumberModal')
    }
  )
</script>

<template>
  <div :class="adaptiveModalWrapperClasses()">
    <div>
      <div :class="adaptiveModalHeaderClasses()">
        {{ $t('web_title_cancel_and_refund') }}
      </div>
      <div :class="adaptiveModalSubheaderClasses()">
        {{ $t('web_subtitle_this_number_will_be_canceled_and_you_ll_receive_a_refund') }}
      </div>
    </div>

    <Button @click="cancel" fill block :loading="cancelNumberLoading">{{ $t('web_cancel_now') }}</Button>

    <Checkbox v-model="isChecked" :label="$t('web_don_t_show_again_checkbox')" id="cancel_number_modal_show" />
  </div>
</template>
