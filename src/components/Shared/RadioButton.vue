<script lang="ts" setup>
  defineProps({
    text: String,
    isActive: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <button
    type="button"
    class="tn:border-tn-black-87 tn:flex tn:items-center tn:gap-2.5 tn:rounded-2xl tn:border tn:px-5 tn:py-4"
  >
    <span
      :class="[
        'tn:h-6 tn:w-6 tn:min-w-6 tn:rounded-full',
        isActive ? 'tn:border-primary-900 tn:border-6' : 'tn:bg-tn-black-95'
      ]"
    />
    <span class="tn:text-start tn:text-sm tn:font-medium">{{ text }}</span>
  </button>
</template>
