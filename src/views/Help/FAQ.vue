<script lang="ts" setup>
  import PageHeader from '@/components/Shared/PageHeader.vue'
  import HelpTabs from '@/components/Help/Tabs.vue'
  import FAQ from '@/components/Help/FAQ/Index.vue'
</script>

<template>
  <div>
    <PageHeader>{{ $t('web_help_page_title') }}</PageHeader>
    <HelpTabs />
    <FAQ />
  </div>
</template>
