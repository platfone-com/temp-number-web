<script lang="ts" setup>
  defineProps({
    size: {
      type: String,
      default: 'tn:w-5.5 tn:h-5.5'
    },
    color: {
      type: String,
      default: 'tn:border-primary-white'
    },
    weight: {
      type: String,
      default: 'tn:border-3'
    }
  })
</script>

<template>
  <div :class="['loader tn:rounded-full tn:border-t-transparent', size, color, weight]" />
</template>

<style scoped>
  @layer utilities {
    .loader {
      --_m: conic-gradient(#0000 10%, #000), linear-gradient(to bottom, #000 0%, #000 100%) content-box;
      -webkit-mask: var(--_m);
      mask: var(--_m);
      -webkit-mask-composite: source-out;
      mask-composite: subtract;
      animation: spin 1s infinite linear;
    }

    @keyframes spin {
      to {
        transform: rotate(1turn);
      }
    }
  }
</style>
