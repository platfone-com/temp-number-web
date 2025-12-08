<script lang="ts" setup>
  import { loadStripe, type Stripe, type StripeElementLocale, type StripeElements } from '@stripe/stripe-js'
  import { ref, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useModalStore } from '@/stores/modal'
  import { useToastStore } from '@/stores/toast'
  import useSharedCss from '@/composables/useSharedCss'
  import { useFunds } from '@/composables/api/useFunds'
  import { useRecaptcha } from '@/composables/useRecaptcha'
  import { useFundsHelper } from '@/composables/useFundsHelper'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const route = useRoute()
  const { locale } = useI18n()
  const modalStore = useModalStore()
  const toast = useToastStore()
  const { adaptiveModalWrapperClasses } = useSharedCss()
  const { getStripePaymentIntentStatus } = useFunds()
  const { getRecaptchaToken } = useRecaptcha()
  const {
    handleSuccessPayment,
    handleReviewPayment,
    handlePaymentError,
    removeMobilePaymentData,
    getMobilePaymentFullReturnUrl
  } = useFundsHelper()

  let elements: StripeElements

  const loading = ref(false)
  const stripeInst = ref<Stripe | null>(null)

  const stripePaymentModalStatus = computed({
    get: () => modalStore.stripePaymentModal.status,
    set: (newValue: boolean) => {
      modalStore.stripePaymentModal.status = newValue
    }
  })
  const publicKey = computed({
    get: () => modalStore.stripePaymentModal.publicKey,
    set: (newValue: string) => {
      modalStore.stripePaymentModal.publicKey = newValue
    }
  })
  const clientSecret = computed({
    get: () => modalStore.stripePaymentModal.clientSecret,
    set: (newValue: string) => {
      modalStore.stripePaymentModal.clientSecret = newValue
    }
  })

  const close = () => {
    modalStore.stripePaymentModal = { status: false, publicKey: '', clientSecret: '' }
    loading.value = false
  }

  const createStripeInstance = async () => {
    if (!stripeInst.value) {
      stripeInst.value = await loadStripe(publicKey.value)
    }
  }

  const loadStripePayment = async () => {
    await createStripeInstance()
    if (stripeInst.value) {
      elements = stripeInst.value.elements({
        clientSecret: clientSecret.value,
        locale: locale.value as StripeElementLocale
      })
      const paymentElement = elements.create('payment')
      paymentElement.mount('#payment-element')
    }
  }

  watch(
    () => stripePaymentModalStatus.value,
    (newValue) => {
      if (newValue && publicKey.value && clientSecret.value) {
        loadStripePayment()
      }
      if (!newValue) close()
    }
  )

  const handlePayment = async () => {
    if (!stripeInst.value) return
    loading.value = true
    let returnUrl = `${import.meta.env.VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL ?? ''}/funds?`
    if (route.name === 'MobilePayment') {
      returnUrl = `${import.meta.env.VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL ?? ''}/payment/mobile?`
    }
    const { error } = await stripeInst.value.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${returnUrl}pi_public_key=${publicKey.value}`
      }
    })

    if ((error.type === 'card_error' || error.type === 'validation_error') && error.message) {
      toast.add({
        id: 'payment_error_by_type',
        text: error.message,
        timeout: 6000
      })
    } else {
      await handlePaymentError()
    }
    loading.value = false
  }

  const checkPaymentStatus = async () => {
    const paymentIntentId = (route.query.payment_intent as string) || ''
    clientSecret.value = (route.query.payment_intent_client_secret as string) || ''
    publicKey.value = (route.query.pi_public_key as string) || ''

    if (!clientSecret.value || !publicKey.value) return
    await createStripeInstance()
    if (!stripeInst.value || !paymentIntentId) return

    const recaptchaToken = await getRecaptchaToken('stripe_payment')
    const paymentIntentStatus = await getStripePaymentIntentStatus(paymentIntentId, recaptchaToken)
    if (!paymentIntentStatus) return

    const mobilePaymentReturnUrl = localStorage.getItem('mobilePaymentReturnUrl')
    removeMobilePaymentData()

    switch (paymentIntentStatus) {
      case 'paid':
        if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'success')
        else handleSuccessPayment()
        break
      case 'review':
        if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'review')
        else await handleReviewPayment()
        break
      default:
        if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'error')
        else await handlePaymentError()
    }
  }

  onMounted(async () => {
    await checkPaymentStatus()
  })
</script>

<template>
  <Modal v-model="stripePaymentModalStatus" size="adaptive-sm" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <form id="payment-form" class="tn:w-full">
        <div id="payment-element" class="tn:min-h-55">
          <!--Stripe.js injects the Payment Element-->
        </div>

        <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
          <Button @click="handlePayment" fill block :loading="loading" class="tn:mt-5">
            {{ $t('web_add_funds_cta_button_buy_credits') }}
          </Button>
        </div>
      </form>
    </div>
  </Modal>
</template>
