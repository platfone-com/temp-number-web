<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useModalStore } from '@/stores/modal'
  import { useAppStore } from '@/stores/app'
  import { useCatalog } from '@/composables/api/useCatalog'
  import { useFunds } from '@/composables/api/useFunds'
  import { useRecaptcha } from '@/composables/useRecaptcha'
  import { useFundsHelper } from '@/composables/useFundsHelper'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'

  const modalStore = useModalStore()
  const { paypalClientId } = storeToRefs(useAppStore())
  const { adaptiveModalWrapperClasses } = useSharedCss()
  const { getPublicKeys } = useCatalog()
  const { getRecaptchaToken } = useRecaptcha()
  const { createPaypalOrder, capturePaypalOrder } = useFunds()
  const { handlePaymentError } = useFundsHelper()

  const loading = ref(false)

  const paypalPaymentModalStatus = computed({
    get: () => modalStore.paypalPaymentModal.status,
    set: (newValue: boolean) => {
      modalStore.paypalPaymentModal.status = newValue
    }
  })
  const amount = computed(() => modalStore.paypalPaymentModal.amount)

  const close = () => {
    modalStore.paypalPaymentModal = { status: false, amount: 0 }
    loading.value = false
  }

  const createOrder = async (): Promise<string | undefined> => {
    const recaptchaToken = await getRecaptchaToken('paypal_payment')
    if (!amount.value || !recaptchaToken) return
    return (await createPaypalOrder(amount.value, recaptchaToken)) || ''
  }

  const onApprove = async (data: { orderID: string }) => {
    const result = await capturePaypalOrder(data.orderID)
    if (result) {
      window.location.href = `${import.meta.env.VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL}/funds?status=success`
    } else {
      handlePaymentError()
    }
    close()
  }

  function onError() {
    handlePaymentError()
  }

  const loadPaypal = async () => {
    if (!paypalClientId.value) await getPublicKeys()
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId.value}&currency=USD&components=buttons&enable-funding=card`
    script.async = true
    script.onload = () => {
      window.paypal.Buttons({ createOrder, onApprove, onError }).render('#paypal-container')
    }
    document.head.appendChild(script)
  }

  watch(
    () => paypalPaymentModalStatus.value,
    (newVal: boolean) => {
      if (newVal) loadPaypal()
    }
  )
</script>

<template>
  <Modal v-model="paypalPaymentModalStatus" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div id="paypal-container" class="tn:mt-5 tn:w-full" />
    </div>
  </Modal>
</template>
