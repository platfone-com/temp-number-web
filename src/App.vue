<script setup lang="ts">
  import LayoutWrapper from '@/components/Layout/Wrapper.vue'
  import Toast from '@/components/Shared/Toast.vue'
  import NotificationModal from '@/components/Modals/Notification.vue'
</script>

<template>
  <LayoutWrapper>
    <RouterView />
  </LayoutWrapper>
  <Toast />
  <NotificationModal />
</template>
