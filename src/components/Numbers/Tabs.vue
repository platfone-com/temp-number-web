<script lang="ts" setup>
  import NumbersTabs from '@/components/Shared/PageTabs.vue'
</script>

<template>
  <NumbersTabs
    :tabs="[
      { id: 'Numbers', label: $t('web_tab_active') },
      { id: 'History', label: $t('web_tab_history') }
    ]"
  />
</template>
