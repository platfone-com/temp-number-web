<script lang="ts" setup>
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import HelpTabs from '@/components/Shared/PageTabs.vue'

  const { wlHelperContactUsUrl } = useWlHelper()
</script>

<template>
  <HelpTabs
    :tabs="[
      { id: 'Help', label: $t('web_tab_faq') },
      { id: 'Reports', label: $t('web_tab_reports') },
      { id: 'ContactUs', label: $t('web_tab_contact_us'), link: config.wlWidgetMode ? wlHelperContactUsUrl : '' }
    ]"
  />
</template>
