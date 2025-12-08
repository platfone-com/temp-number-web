<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useToastStore } from '@/stores/toast'

  import PageHeader from '@/components/Shared/PageHeader.vue'
  import AddFunds from '@/components/Funds/AddFunds/Index.vue'
  import StripeModal from '@/components/Modals/Funds/Stripe.vue'

  const route = useRoute()
  const toast = useToastStore()

  onMounted(() => {
    if (route.query?.status) return // Skip, because status handle in Funds/Index.vue

    if (route.query?.returnUrl && route.query?.fbToken) {
      localStorage.setItem('mobilePaymentReturnUrl', decodeURIComponent(route.query.returnUrl?.toString() || ''))
      localStorage.setItem('mobilePaymentFbToken', decodeURIComponent(route.query.fbToken?.toString() || ''))
    } else {
      if (route.query.pi_public_key) return // Skip if pi_public_key is present, as it indicates a Stripe payment
      toast.add({
        id: 'payment_mobile_empty_params_error',
        text: 'Empty returnUrl or fbToken parameter. Please try again!',
        timeout: 3000
      })
    }
  })
</script>

<template>
  <main class="narrow-container">
    <div class="tn:mt-10">
      <PageHeader>{{ $t('web_funds_page_title') }}</PageHeader>
      <AddFunds />
    </div>
  </main>
  <StripeModal />
</template>
