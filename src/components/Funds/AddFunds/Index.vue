<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useFunds } from '@/composables/api/useFunds'
  import { useWlApiPayments } from '@/composables/wl/api/useWlApiPayments'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { addBreakLinesToText } from '@/utils/translate'
  import { useRecaptcha } from '@/composables/useRecaptcha'
  import { useToastStore } from '@/stores/toast'
  import { useModalStore } from '@/stores/modal'
  import { useAppStore } from '@/stores/app'
  import { useFundsHelper } from '@/composables/useFundsHelper'
  import { Gateway } from '@/types/api/funds'
  import Select from '@/components/Shared/Select.vue'
  import RadioButton from '@/components/Shared/RadioButton.vue'
  import Button from '@/components/Shared/Button.vue'
  import AnypayForm from '@/components/Funds/AddFunds/Form/Anypay.vue'
  import PayeerForm from '@/components/Funds/AddFunds/Form/Payeer.vue'

  const route = useRoute()
  const { t } = useI18n()
  const { enabledGateways, enabledMobilePaymentGateways, createStripePaymentIntent, createCryptomusPayment } =
    useFunds()
  const { enabledWLGateways, createWLStripePaymentIntent, createWlCryptomusPayment } = useWlApiPayments()
  const { isWlHelperUrl } = useWlHelper()
  const { loadRecaptchaEnterprise, getRecaptchaToken } = useRecaptcha()
  const {
    handleSuccessPayment,
    handleSuccessCryptoPayment,
    handlePaymentError,
    removeMobilePaymentData,
    getMobilePaymentFullReturnUrl
  } = useFundsHelper()
  const toast = useToastStore()
  const modalStore = useModalStore()
  const appStore = useAppStore()

  const amounts = [5, 25, 50]
  const minAmount = 5
  const maxAmount = 1000

  const loading = storeToRefs(appStore).fundsLoading
  const isMobilePayment = computed(() => route.name === 'MobilePayment')
  const gatewaysList = computed(() => {
    if (isWlHelperUrl()) {
      return enabledWLGateways.value
    }
    if (isMobilePayment.value) {
      return enabledMobilePaymentGateways.value
    }
    return enabledGateways.value
  })
  const isPayButtonDisabled = computed(() => {
    if (isMobilePayment.value) {
      const { returnUrl, fbToken } = route.query
      if (!returnUrl || !fbToken) return true
    }
    return loading.value || !selectedGateway.value || !amount.value
  })

  const amountValue = ref(0)
  const selectedGateway = ref<Gateway | null>(gatewaysList.value[0].id)
  const selectedAmount = ref(0)
  const customAmount = ref<number | null>(null)
  const anypayPayment = ref(false)
  const payeerPayment = ref(false)
  const recaptchaToken = ref('')

  const amount = computed(() => selectedAmount.value || customAmount.value)

  const selectItem = (itemId: Gateway) => {
    selectedGateway.value = itemId
  }

  const buyCredits = async () => {
    if (!selectedGateway.value || !amount.value) return
    if (amount.value < minAmount || amount.value > maxAmount) {
      toast.add({
        id: 'add_funds_amount_error',
        text: t('notifications_the_amount_must_be_between_0_and_1')
          .replace('__0__', `$${minAmount}`)
          .replace('__1__', `$${maxAmount}`),
        type: 'warning'
      })
      return
    }
    appStore.fundsLoading = true
    if ([Gateway.paypal, Gateway.stripe].includes(selectedGateway.value)) {
      recaptchaToken.value = await getRecaptchaToken(`${selectedGateway.value}_payment`)
    }
    amountValue.value = Math.ceil(amount.value * 100)
    switch (selectedGateway.value) {
      case Gateway.stripe:
        let result = null
        if (isWlHelperUrl()) {
          result = await createWLStripePaymentIntent(amountValue.value, recaptchaToken.value)
        } else {
          result = await createStripePaymentIntent(amountValue.value, recaptchaToken.value)
        }
        if (result && result.clientSecret && result.publicKey) {
          modalStore.stripePaymentModal = {
            status: true,
            publicKey: result.publicKey,
            clientSecret: result.clientSecret
          }
        }
        break
      case Gateway.paypal:
        modalStore.paypalPaymentModal = { status: true, amount: amountValue.value }
        break
      case Gateway.crypto:
        if (isWlHelperUrl()) {
          await createWlCryptomusPayment(amountValue.value)
        } else {
          await createCryptomusPayment(amountValue.value)
        }
        break
      case Gateway.anypay:
        anypayPayment.value = true
        break
      case Gateway.payeer:
        payeerPayment.value = true
        break
    }
    appStore.fundsLoading = false
  }

  const handlePaymentStatus = () => {
    const { status, type, pi_public_key } = route.query
    const mobilePaymentReturnUrl = localStorage.getItem('mobilePaymentReturnUrl')

    if (!pi_public_key) removeMobilePaymentData()
    if (!status) return

    if (status === 'success') {
      if (type === 'crypto') {
        if (mobilePaymentReturnUrl)
          location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'success', 'crypto')
        else handleSuccessCryptoPayment()
      } else {
        if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'success')
        else handleSuccessPayment()
      }
    } else if (status === 'error') {
      if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'error')
      else handlePaymentError()
    } else if (status === 'return') {
      if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl)
    }
  }

  const blockDecimalInput = (event: KeyboardEvent): void => {
    const invalidKeys = ['.', ',', 'e', '+', '-']
    if (invalidKeys.includes(event.key)) {
      event.preventDefault()
    }
  }

  onMounted(() => {
    loadRecaptchaEnterprise()
    handlePaymentStatus()
  })
</script>

<template>
  <div class="tn:flex tn:flex-col tn:gap-4 tn:lg:gap-6">
    <div class="tn:flex tn:flex-col tn:gap-2">
      <div class="tn:text-sm tn:font-medium">{{ $t('web_funds_payment_method') }}</div>
      <Select :selected="selectedGateway" :items="gatewaysList" @select-item="selectItem" />
    </div>

    <div class="tn:flex tn:flex-col tn:gap-2">
      <div class="tn:text-sm tn:font-medium">{{ $t('web_add_funds_payment_amount') }}</div>
      <RadioButton
        v-for="amountItem in amounts"
        @click="selectedAmount = amountItem"
        :key="amountItem"
        :text="$t('web_add_funds_buy_0_credits').replace('__0__', amountItem.toString())"
        :is-active="selectedAmount === amountItem"
      />
      <input
        v-model="customAmount"
        @focus="selectedAmount = 0"
        @keydown="blockDecimalInput"
        :placeholder="$t('web_add_funds_enter_custom_amount')"
        type="number"
        :min="minAmount"
        :max="maxAmount"
        :class="[
          'tn:bg-tn-black-50 tn:border-tn-black-50 tn:focus:border-primary-900 tn:rounded-2xl tn:border tn:px-5 tn:py-3.75 tn:text-sm tn:outline-none',
          customAmount && !selectedAmount && 'tn:!border-primary-900'
        ]"
      />
    </div>

    <div
      v-html="addBreakLinesToText($t('web_add_funds_notict_balance_in_usd_1_credit_1_usd'))"
      class="tn:text-center tn:text-sm tn:leading-5.5 tn:opacity-60"
    />

    <Button @click="buyCredits" fill :loading="loading" :disabled="isPayButtonDisabled">
      {{ $t('web_add_funds_cta_button_buy_credits') }}
    </Button>
  </div>

  <AnypayForm :anypay-payment="anypayPayment" :amount="amountValue" @clear-anypay="anypayPayment = false" />
  <PayeerForm :payeer-payment="payeerPayment" :amount="amountValue" @clear-payeer="payeerPayment = false" />
</template>
