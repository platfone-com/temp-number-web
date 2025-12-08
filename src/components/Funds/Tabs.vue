<script lang="ts" setup>
  import FundsTabs from '@/components/Shared/PageTabs.vue'
</script>

<template>
  <FundsTabs
    :tabs="[
      { id: 'Funds', label: $t('web_tab_add_funds') },
      { id: 'Transactions', label: $t('web_tab_funds_history') }
    ]"
  />
</template>
