<script lang="ts" setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useModalStore } from '@/stores/modal'
  import { useOrderStore } from '@/stores/order'
  import { useActivation } from '@/composables/api/useActivation'
  import { addBreakLinesToText } from '@/utils/translate'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const { t } = useI18n()
  const { createActivation } = useActivation()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const { activationPriceChangedModal } = storeToRefs(useModalStore())
  const { orderLoading, orderPrice } = storeToRefs(useOrderStore())

  const modalText = computed(() => {
    const priceText = (orderPrice.value / 100).toString()
    return addBreakLinesToText(
      t('notifications_the_new_price_for_activation_is_0_do_you_want_to_proceed').replace(
        '__0__',
        `<strong>${priceText}</strong>`
      )
    )
  })

  const createActivationWithNewPrice = async () => {
    activationPriceChangedModal.value = false
    await createActivation()
  }
</script>

<template>
  <Modal v-model="activationPriceChangedModal" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">{{ $t('notifications_price_change') }}</div>
        <div v-html="modalText" :class="adaptiveModalSubheaderClasses()" />
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button @click="createActivationWithNewPrice" fill block :loading="orderLoading">
          {{ $t('notifications_yes') }}
        </Button>
        <Button @click="activationPriceChangedModal = false" fill block color="secondary">
          {{ $t('notifications_no') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
