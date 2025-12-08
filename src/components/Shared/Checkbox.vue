<script setup lang="ts">
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import CheckboxIcon from '@/assets/images/icons/checkbox/checkbox.svg'
  import CheckboxActiveIcon from '@/assets/images/icons/checkbox/checkbox-active.svg'

  const isChecked = defineModel({ type: Boolean, default: false })

  defineProps({
    label: String,
    id: String
  })

  const { isWlHelperUrl } = useWlHelper()
</script>

<template>
  <label class="tn:flex tn:cursor-pointer tn:gap-1.5">
    <input v-model="isChecked" type="checkbox" :id="id" class="tn:hidden" />

    <span class="tn:flex tn:h-6 tn:w-6 tn:items-center tn:justify-center tn:transition-all tn:duration-300">
      <transition name="fade" mode="out-in">
        <component
          :is="isChecked ? CheckboxActiveIcon : CheckboxIcon"
          :class="[
            'tn:absolute tn:h-6 tn:w-6',
            config.wlWidgetMode || isWlHelperUrl()
              ? 'tn:text-tn-black-900'
              : isChecked
                ? 'tn:text-[#5F6368]'
                : 'tn:text-tn-black-900'
          ]"
        />
      </transition>
    </span>

    <span class="tn:text-tn-black-300 tn:pt-0.5 tn:text-sm">
      {{ label }}
    </span>
  </label>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.1s ease-in-out,
      transform 0.1s ease-in-out;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
