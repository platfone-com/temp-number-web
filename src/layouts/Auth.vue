<script setup lang="ts">
  import Header from '@/components/Layout/Header/Index.vue'
</script>

<template>
  <Header />
  <main class="auth-container">
    <div class="tn:min-w-full tn:sm:px-6">
      <slot />
    </div>
  </main>
</template>
