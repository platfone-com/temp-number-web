<script lang="ts" setup>
  import { ref, computed, watch, nextTick } from 'vue'
  import { getAuth } from 'firebase/auth'
  import { useFunds } from '@/composables/api/useFunds'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import type { IAnypayPaymentData } from '@/types/api/funds'

  const emit = defineEmits(['clearAnypay'])
  const props = defineProps({
    anypayPayment: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      required: true
    }
  })

  const { createAnypayPayment } = useFunds()
  const { isWlHelperUrl } = useWlHelper()

  const auth = getAuth()
  const baseAppUrl = import.meta.env.VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL ?? ''
  const mobilePaymentReturnUrl = localStorage.getItem('mobilePaymentReturnUrl')

  const anypayFormRef = ref()
  const anypayFormData = ref<IAnypayPaymentData | null>(null)

  const successUrl = computed(() => {
    if (isWlHelperUrl()) {
      return `${location.href}&status=success`
    } else if (mobilePaymentReturnUrl) {
      return `${baseAppUrl}/payment/mobile?status=success`
    }
    return `${baseAppUrl}/funds?status=success`
  })
  const failUrl = computed(() => {
    if (isWlHelperUrl()) {
      return `${location.href}&status=error`
    } else if (mobilePaymentReturnUrl) {
      return `${baseAppUrl}/payment/mobile?status=error`
    }
    return `${baseAppUrl}/funds?status=error`
  })

  watch(
    () => props.anypayPayment,
    (val: boolean) => {
      if (val) addAnypayFunds()
    }
  )

  const getFormData = async () => {
    const res = await createAnypayPayment(props.amount)
    if (res) anypayFormData.value = res
  }

  const addAnypayFunds = async () => {
    await getFormData()
    if (!anypayFormData.value?.pay_id) {
      emit('clearAnypay')
      return
    }

    await nextTick(() => {
      anypayFormRef.value.submit()
    })
  }
</script>

<template>
  <form ref="anypayFormRef" method="post" action="https://anypay.io/merchant">
    <template v-if="anypayFormData">
      <input type="hidden" name="merchant_id" :value="anypayFormData.merchant_id" />
      <input type="hidden" name="amount" :value="anypayFormData.amount" />
      <input type="hidden" name="currency" :value="anypayFormData.currency" />
      <input type="hidden" name="pay_id" :value="anypayFormData.pay_id" />
      <input v-if="anypayFormData.method" type="hidden" name="method" :value="anypayFormData.method" />
      <input name="success_url" type="hidden" :value="`${successUrl}`" />
      <input name="fail_url" type="hidden" :value="`${failUrl}`" />
      <input type="hidden" name="email" :value="auth.currentUser?.email || ''" />
      <input type="hidden" name="sign" :value="anypayFormData.sign" />
      <input type="submit" value="send" class="tn:hidden" />
    </template>
  </form>
</template>
