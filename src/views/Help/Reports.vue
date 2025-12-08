<script lang="ts" setup>
  import PageHeader from '@/components/Shared/PageHeader.vue'
  import HelpTabs from '@/components/Help/Tabs.vue'
  import Reports from '@/components/Help/Reports/Index.vue'
</script>

<template>
  <div>
    <PageHeader>{{ $t('web_help_page_title') }}</PageHeader>
    <HelpTabs />
    <Reports />
  </div>
</template>
