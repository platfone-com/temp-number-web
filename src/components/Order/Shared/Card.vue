<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/stores/app'

  const { isMobileHeaderHidden } = storeToRefs(useAppStore())
</script>

<template>
  <div>
    <transition name="slide-header">
      <div
        v-show="!isMobileHeaderHidden"
        class="tn:mb-6 tn:flex tn:justify-between tn:text-xl tn:font-semibold tn:lg:mb-3"
      >
        <div class="tn:flex tn:w-full tn:items-center tn:justify-between tn:gap-3">
          <slot name="header" />
        </div>
      </div>
    </transition>
    <div class="tn:relative tn:rounded-2xl tn:lg:border tn:lg:border-slate-200 tn:lg:py-6">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  @import '@/assets/css/transitions/slide-header.css';
</style>
