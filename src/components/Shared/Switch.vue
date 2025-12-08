<script lang="ts" setup>
  const isActive = defineModel({ type: Boolean, required: true })

  const change = () => {
    isActive.value = !isActive.value
  }
</script>

<template>
  <div
    class="tn:h-6 tn:w-10.5 tn:min-w-10.5 tn:cursor-pointer tn:rounded-full tn:p-0.75 tn:transition-colors tn:duration-200 tn:select-none"
    :class="isActive ? 'tn:bg-tn-green-500' : 'tn:bg-tn-black-60'"
    @click="change"
  >
    <div
      class="tn:bg-tn-bg tn:h-4.5 tn:w-4.5 tn:rounded-full tn:transition-transform tn:duration-200"
      :class="isActive ? 'tn:ltr:translate-x-4.5 tn:rtl:-translate-x-4.5' : 'tn:translate-x-0'"
    />
  </div>
</template>
