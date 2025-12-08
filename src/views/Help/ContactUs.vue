<script lang="ts" setup>
  import PageHeader from '@/components/Shared/PageHeader.vue'
  import HelpTabs from '@/components/Help/Tabs.vue'
  import ContactUs from '@/components/Help/ContactUs/Index.vue'
</script>

<template>
  <div>
    <PageHeader>{{ $t('web_help_page_title') }}</PageHeader>
    <HelpTabs />
    <ContactUs />
  </div>
</template>
