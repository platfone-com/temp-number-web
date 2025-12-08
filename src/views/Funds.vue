<script lang="ts" setup>
  import PageHeader from '@/components/Shared/PageHeader.vue'
  import FundsTabs from '@/components/Funds/Tabs.vue'
  import AddFunds from '@/components/Funds/AddFunds/Index.vue'
  import PaymentInReviewModal from '@/components/Modals/Funds/PaymentInReview.vue'
  import StripeModal from '@/components/Modals/Funds/Stripe.vue'
  import PaypalModal from '@/components/Modals/Funds/Paypal.vue'
</script>

<template>
  <div>
    <PageHeader>{{ $t('web_funds_page_title') }}</PageHeader>
    <FundsTabs />
    <AddFunds />
  </div>
  <PaymentInReviewModal />
  <StripeModal />
  <PaypalModal />
</template>
