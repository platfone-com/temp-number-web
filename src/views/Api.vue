<script lang="ts" setup>
  import { onMounted } from 'vue'
  import router from '@/router'
  import config from '@/config'
  import { useCrisp } from '@/composables/useCrisp'
  import Button from '@/components/Shared/Button.vue'

  const { openChat } = useCrisp()

  onMounted(() => {
    if (config.wlWidgetMode) {
      router.push({ name: 'Home' })
    }
  })
</script>

<template>
  <div class="content-page tm-container">
    <h1 style="text-align: center">Temp Number API</h1>
    <p class="tn:text-center">{{ $t('web_api_access_available_for_developers_resellers_businesses') }}</p>

    <div class="tn:flex tn:justify-center tn:my-3">
      <Button @click="openChat" fill>
        {{ $t('web_contact_us_to_request_access') }}
      </Button>
    </div>
  </div>
</template>
