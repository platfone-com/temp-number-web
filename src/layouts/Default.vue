<script setup lang="ts">
  import { onMounted, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import config from '@/config'
  import Header from '@/components/Layout/Header/Index.vue'
  import MobileMenu from '@/components/Layout/MobileMenu/Index.vue'
  import ForceEmailConfirmationModal from '@/components/Modals/ForceEmailConfirmation.vue'
  import AccountOnHoldModal from '@/components/Modals/AccountOnHold.vue'
  import TooManyRequestsModal from '@/components/Modals/TooManyRequests.vue'

  const route = useRoute()
  const { isAuthenticated, isAuthPasswordProvider, isEmailVerified } = storeToRefs(useAuthStore())

  const saveLastVisitedPath = () => {
    if (isAuthenticated.value && isAuthPasswordProvider.value && !isEmailVerified.value) {
      if (route.path !== '/') {
        localStorage.setItem('lastVisitedPath', route.path)
      } else {
        localStorage.removeItem('lastVisitedPath')
      }
    }
  }

  watch(
    () => route.path,
    () => {
      saveLastVisitedPath()
    }
  )

  onMounted(() => {
    saveLastVisitedPath()
  })
</script>

<template>
  <Header />
  <main class="default-container">
    <slot />
  </main>
  <MobileMenu />
  <ForceEmailConfirmationModal v-if="!config.wlWidgetMode" />
  <AccountOnHoldModal />
  <TooManyRequestsModal />
</template>
