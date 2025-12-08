<script setup lang="ts">
  import Countdown from '@/components/Shared/Countdown.vue'

  const emit = defineEmits(['updateActiveNumber'])
  defineProps({
    endTime: {
      type: Number,
      required: true
    }
  })

  const handleFinished = () => {
    setTimeout(() => {
      emit('updateActiveNumber')
    }, 1500)
  }
</script>

<template>
  <div
    :class="[
      'tn:text-xxs tn:flex tn:min-w-10 tn:items-center tn:justify-center tn:rounded-lg tn:px-1.75 tn:py-0.75 tn:font-light tn:bg-tn-yellow'
    ]"
  >
    <Countdown :end-time="endTime" @finished="handleFinished" />
  </div>
</template>
