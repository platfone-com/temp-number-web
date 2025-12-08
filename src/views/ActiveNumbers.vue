<script lang="ts" setup>
  import PageHeader from '@/components/Shared/PageHeader.vue'
  import NumbersTabs from '@/components/Numbers/Tabs.vue'
  import ActiveNumbers from '@/components/Numbers/Active.vue'
</script>

<template>
  <div>
    <PageHeader>{{ $t('web_numbers_page_title') }}</PageHeader>
    <NumbersTabs />
    <ActiveNumbers />
  </div>
</template>
