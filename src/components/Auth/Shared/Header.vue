<script lang="ts" setup>
  defineProps({
    text: String,
    fontClass: {
      type: String,
      default: 'tn:text-[2.125rem] tn:leading-[2.6875rem] tn:-tracking-[0.0625rem]'
    }
  })
</script>

<template>
  <h1 class="tn:text-tn-black-950 tn:my-2 tn:flex tn:justify-center tn:font-semibold" :class="fontClass">
    {{ text }}
  </h1>
</template>
