<script lang="ts" setup>
  import Switch from '@/components/Shared/Switch.vue'
  import ButtonSpinner from '@/components/Shared/Spinners/ButtonSpinner.vue'

  const isActive = defineModel({ type: Boolean, required: true })

  defineProps({
    header: {
      type: String,
      required: true
    },
    subheader: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div class="tn:flex tn:items-start tn:justify-between tn:gap-6">
    <div class="web_alerts_email">
      <div class="tn:mb-1 tn:leading-5 tn:font-semibold">{{ header }}</div>
      <div class="tn:text-sm">{{ subheader }}</div>
    </div>
    <div class="tn:flex tn:w-10.5 tn:min-w-10.5 tn:justify-center">
      <ButtonSpinner v-if="loading" color="tn:border-primary-900" />
      <Switch v-else v-model="isActive" />
    </div>
  </div>
</template>
