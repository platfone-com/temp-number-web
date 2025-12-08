<script lang="ts" setup>
  defineProps({
    fontClass: {
      type: String,
      default: 'tn:text-[0.9375rem]'
    }
  })
</script>

<template>
  <h2 class="tn:text-tn-black-300 tn:my-2 tn:flex tn:justify-center tn:text-center" :class="fontClass">
    <slot />
  </h2>
</template>
