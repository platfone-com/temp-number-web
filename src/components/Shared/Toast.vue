<script lang="ts" setup>
  import { useToastStore } from '@/stores/toast'
  import { storeToRefs } from 'pinia'

  const toastStore = useToastStore()

  const { toasts } = storeToRefs(toastStore)

  const ltrStyles = 'tn:ltr:right-6 tn:ltr:xl:left-[calc(50%+396px)]'
  const rtlStyles = 'tn:rtl:left-6 tn:rtl:xl:right-[calc(50%+396px)]'
</script>

<template>
  <div
    :class="[
      'tn:fixed tn:top-18 tn:z-[1000000] tn:flex tn:w-[calc(100%-3rem)] tn:flex-col tn:gap-4 tn:transition-all tn:sm:top-38 tn:sm:w-72 tn:sm:gap-5',
      ltrStyles,
      rtlStyles
    ]"
  >
    <TransitionGroup name="fade">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'tn:relative tn:flex tn:w-full tn:items-center tn:rounded-lg tn:py-3 tn:text-white tn:shadow-lg tn:ltr:pr-10 tn:ltr:pl-4 tn:rtl:pr-4 tn:rtl:pl-10',
          toast.type === 'success' ? 'tn:bg-green-500' : '',
          toast.type === 'error' ? 'tn:bg-red-500' : '',
          toast.type === 'warning' ? 'tn:bg-orange-500' : ''
        ]"
      >
        {{ toast.text }}
        <button
          class="tn:absolute tn:top-2.5 tn:h-6 tn:w-6 tn:cursor-pointer tn:text-xl tn:ltr:right-2 tn:rtl:left-2"
          @click="toastStore.remove(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  @import '@/assets/css/transitions/toast-fade.css';
</style>
