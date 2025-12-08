<script lang="ts" setup>
  import config from '@/config'
  import PageHeader from '@/components/Shared/PageHeader.vue'
  import FundsTabs from '@/components/Funds/Tabs.vue'
  import Transactions from '@/components/Funds/Transactions/Index.vue'
</script>

<template>
  <div>
    <PageHeader>{{ $t('web_funds_page_title') }}</PageHeader>
    <FundsTabs v-if="!config.wlWidgetMode" />
    <Transactions />
  </div>
</template>
