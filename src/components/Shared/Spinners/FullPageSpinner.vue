<script setup lang="ts">
  const cdnUrl = import.meta.env.VITE_CDN_BASE_URL
</script>

<template>
  <div class="tn:mx-auto tn:w-60">
    <img :src="`${cdnUrl}/images/loader.gif`" alt="loader" class="tn:w-full" />
  </div>
</template>
