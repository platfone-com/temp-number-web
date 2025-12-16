<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/stores/app'
  import { useRecaptcha } from '@/composables/useRecaptcha'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useFunds } from '@/composables/api/useFunds'
  import { useFundsHelper } from '@/composables/useFundsHelper'
  import Button from '@/components/Shared/Button.vue'

  const appStore = useAppStore()
  const { getRecaptchaToken } = useRecaptcha()
  const { isWlHelperUrl } = useWlHelper()
  const { createAlipayQqWechatPayment } = useFunds()
  const { handleSuccessPayment, handlePaymentError, getMobilePaymentFullReturnUrl } = useFundsHelper()

  const storeUrl = import.meta.env.VITE_ALIPAY_QQ_WECHAT_STORE_URL || ''
  const loading = storeToRefs(appStore).fundsLoading
  const coupon = ref('')
  const isPayButtonDisabled = computed(() => {
    const couponValue = coupon.value.trim()
    return loading.value || !couponValue || couponValue.length !== 24
  })

  const applyCoupon = async () => {
    appStore.fundsLoading = true
    const recaptchaToken = await getRecaptchaToken(`alipay_qq_wechat_payment`)
    let result: 'success' | 'error' | null = null
    if (isWlHelperUrl()) {
      // result = await createWLAlipayQqWechatPayment(amountValue.value, recaptchaToken.value)
    } else {
      result = await createAlipayQqWechatPayment(coupon.value, recaptchaToken)
    }
    coupon.value = ''
    if (result) handlePaymentStatus(result)
    appStore.fundsLoading = false
  }

  const handlePaymentStatus = (paymentResult: 'success' | 'error') => {
    const mobilePaymentReturnUrl = localStorage.getItem('mobilePaymentReturnUrl')
    if (paymentResult === 'success') {
      if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'success')
      else handleSuccessPayment()
    } else if (paymentResult === 'error') {
      if (mobilePaymentReturnUrl) location.href = getMobilePaymentFullReturnUrl(mobilePaymentReturnUrl, 'error')
      else handlePaymentError()
    }
  }
</script>

<template>
  <div class="tn:flex tn:flex-col tn:gap-2 tn:mt-3.5">
    <div class="tn:text-sm tn:font-medium">
      1. Simply click the link below, select the amount, and complete your payment:
    </div>
    <Button :href="storeUrl" target="_blank" class="tn:!py-3.75 tn:!text-sm">Pay via AliPay, QQ, WeChat</Button>
  </div>
  <div class="tn:flex tn:flex-col tn:gap-2 tn:mt-2">
    <div class="tn:text-sm tn:font-medium">2. Enter the paid coupon to top up your balance:</div>
    <input
      v-model="coupon"
      placeholder="Enter coupon"
      :class="[
        'tn:bg-tn-black-50 tn:border-tn-black-50 tn:focus:border-primary-900 tn:rounded-2xl tn:border tn:px-5 tn:py-3.75 tn:text-sm tn:outline-none'
      ]"
    />
  </div>
  <Button @click="applyCoupon" fill :loading="loading" :disabled="isPayButtonDisabled">Apply Coupon</Button>
</template>
