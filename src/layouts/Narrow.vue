<script setup lang="ts">
  import { onMounted } from 'vue'
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'

  import Header from '@/components/Layout/Header/Index.vue'
  import MobileMenu from '@/components/Layout/MobileMenu/Index.vue'
  import AccountOnHoldModal from '@/components/Modals/AccountOnHold.vue'
  import ForceEmailConfirmationModal from '@/components/Modals/ForceEmailConfirmation.vue'
  import TooManyRequestsModal from '@/components/Modals/TooManyRequests.vue'

  const { clearWlQueryParams } = useWlHelper()

  onMounted(() => {
    if (config.wlWidgetMode) clearWlQueryParams()
  })
</script>

<template>
  <Header />
  <main class="narrow-container">
    <slot />
  </main>
  <MobileMenu />
  <ForceEmailConfirmationModal v-if="!config.wlWidgetMode" />
  <AccountOnHoldModal />
  <TooManyRequestsModal />
</template>
