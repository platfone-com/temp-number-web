<script lang="ts" setup>
  import { ref, computed, watch, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { useFunds } from '@/composables/api/useFunds'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useWlApiPayments } from '@/composables/wl/api/useWlApiPayments'
  import type { IPayeerPaymentData } from '@/types/api/funds'

  const emit = defineEmits(['clearPayeer'])
  const props = defineProps({
    payeerPayment: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      required: true
    }
  })

  const route = useRoute()
  const { createPayeerPayment } = useFunds()
  const { isWlHelperUrl } = useWlHelper()
  const { createWlPayeerPayment } = useWlApiPayments()

  const baseAppUrl = import.meta.env.VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL ?? ''
  const mobilePaymentReturnUrl = localStorage.getItem('mobilePaymentReturnUrl')

  const payeerFormRef = ref()
  const payeerFormData = ref<IPayeerPaymentData | null>(null)

  const wlReturnUrl = computed(() => {
    if (route.query.returnUrl) {
      // Redirect without re-auth. Payeer limits URLs to 255 characters; anything longer is truncated
      const returnUrl = decodeURIComponent(route.query.returnUrl.toString())
      const connector = returnUrl.includes('?') ? '&' : '?'
      return `${returnUrl}${connector}wl_src=payment`
    }
    return ''
  })

  const successUrl = computed(() => {
    if (isWlHelperUrl()) {
      return wlReturnUrl.value ? `${wlReturnUrl.value}&wl_status=success` : ''
    } else if (mobilePaymentReturnUrl) {
      return `${baseAppUrl}/payment/mobile?status=success`
    }
    return `${baseAppUrl}/funds?status=success`
  })
  const failUrl = computed(() => {
    if (isWlHelperUrl()) {
      return wlReturnUrl.value ? `${wlReturnUrl.value}&wl_status=error` : ''
    } else if (mobilePaymentReturnUrl) {
      return `${baseAppUrl}/payment/mobile?status=error`
    }
    return `${baseAppUrl}/funds?status=error`
  })

  watch(
    () => props.payeerPayment,
    (val: boolean) => {
      if (val) addPayeerFunds()
    }
  )

  const getFormData = async () => {
    let res
    if (isWlHelperUrl()) {
      res = await createWlPayeerPayment(props.amount, successUrl.value, failUrl.value)
    } else {
      res = await createPayeerPayment(props.amount, successUrl.value, failUrl.value)
    }
    if (res) payeerFormData.value = res
  }

  const addPayeerFunds = async () => {
    await getFormData()
    if (!payeerFormData.value?.m_orderid) {
      emit('clearPayeer')
      return
    }

    await nextTick(() => {
      payeerFormRef.value.submit()
    })
  }
</script>

<template>
  <form ref="payeerFormRef" method="post" action="https://payeer.com/merchant/">
    <template v-if="payeerFormData">
      <input type="hidden" name="m_shop" :value="payeerFormData.m_shop" />
      <input type="hidden" name="m_orderid" :value="payeerFormData.m_orderid" />
      <input type="hidden" name="m_amount" :value="payeerFormData.m_amount" />
      <input type="hidden" name="m_curr" :value="payeerFormData.m_curr" />
      <input type="hidden" name="m_desc" :value="payeerFormData.m_desc" />
      <input type="hidden" name="m_sign" :value="payeerFormData.m_sign" />
      <input type="hidden" name="m_params" :value="payeerFormData.m_params" />
      <input type="hidden" name="m_cipher_method" :value="payeerFormData.m_cipher_method" />
      <input type="submit" name="m_process" value="send" class="tn:hidden" />
    </template>
  </form>
</template>
