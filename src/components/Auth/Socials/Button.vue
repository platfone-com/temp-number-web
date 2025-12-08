<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'

  const { authLoading } = storeToRefs(useAuthStore())
</script>

<template>
  <button
    :disabled="authLoading"
    type="button"
    class="tn:border-tn-black-100 tn:hover:bg-primary-900/5 tn:duration-300 tn:flex tn:w-full tn:cursor-pointer tn:items-center tn:justify-center tn:gap-2 tn:rounded-xl tn:border tn:px-6 tn:py-4 tn:text-center tn:transition-colors"
  >
    <slot />
  </button>
</template>
