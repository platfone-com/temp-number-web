<script setup lang="ts">
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useAppStore } from '@/stores/app'

  import Header from '@/components/Layout/Header/Index.vue'
  import AccountOnHoldModal from '@/components/Modals/AccountOnHold.vue'
  import ActivationPriceChangedModal from '@/components/Modals/Activation/PriceChanged.vue'
  import ForceEmailConfirmationModal from '@/components/Modals/ForceEmailConfirmation.vue'
  import TooManyRequestsModal from '@/components/Modals/TooManyRequests.vue'
  import MobileMenu from '@/components/Layout/MobileMenu/Index.vue'

  const { clearWlQueryParams } = useWlHelper()
  const { isMobileHeaderHidden } = storeToRefs(useAppStore())

  onMounted(() => {
    if (config.wlWidgetMode) clearWlQueryParams()
  })
</script>

<template>
  <transition name="slide-header">
    <Header v-show="!isMobileHeaderHidden" />
  </transition>
  <main class="wide-container tn:mt-4 tn:mb-0 tn:lg:my-12">
    <slot />
  </main>
  <MobileMenu />
  <ForceEmailConfirmationModal v-if="!config.wlWidgetMode" />
  <AccountOnHoldModal />
  <ActivationPriceChangedModal />
  <TooManyRequestsModal />
</template>

<style scoped>
  @import '@/assets/css/transitions/slide-header.css';
</style>
