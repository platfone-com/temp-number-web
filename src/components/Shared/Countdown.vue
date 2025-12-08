<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

  const emit = defineEmits(['finished'])
  const props = defineProps({
    endTime: {
      type: Number,
      required: true
    },
    withCircle: {
      type: Boolean,
      default: false
    }
  })

  const remainingTime = ref(0)
  let interval: ReturnType<typeof setInterval> | null = null

  const radius = 45
  const circumference = 2 * Math.PI * radius

  const updateRemainingTime = () => {
    const currentTime = Math.floor(Date.now() / 1000)
    remainingTime.value = Math.max(props.endTime - currentTime, 0)
  }

  const totalTime = computed(() => Math.floor(Date.now() / 1000) - props.endTime)
  const strokeOffset = computed(() => {
    return circumference * (1 - remainingTime.value / totalTime.value)
  })

  onMounted(() => {
    updateRemainingTime()

    interval = setInterval(() => {
      updateRemainingTime()

      if (remainingTime.value <= 0) {
        clearInterval(Number(interval))
        emit('finished')
      }
    }, 1000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  watch(
    () => props.endTime,
    () => {
      updateRemainingTime()
    }
  )

  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (remainingTime.value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  })
</script>

<template>
  <template v-if="!withCircle">{{ formattedTime }}</template>
  <div v-else class="tn:relative">
    <svg class="tn:text-primary-900 tn:h-28 tn:w-28 tn:transform tn:lg:h-35 tn:lg:w-35" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke-width="5" class="tn:text-tn-black-87 tn:stroke-current" />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="square"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeOffset"
      />
    </svg>
    <div
      class="tn:text-primary-900 tn:absolute tn:top-1/2 tn:left-1/2 tn:-translate-x-1/2 tn:-translate-y-1/2 tn:fill-current tn:text-lg tn:font-medium tn:lg:text-2xl"
    >
      {{ formattedTime }}
    </div>
  </div>
</template>
