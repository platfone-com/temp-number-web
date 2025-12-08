<script lang="ts" setup>
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import GoBackIcon from '@/assets/images/icons/go-back.svg'

  const { isWlHelperUrl } = useWlHelper()
</script>

<template>
  <div class="tn:mb-6 tn:flex tn:justify-between tn:sm:mb-8">
    <button
      class="tn:border-tn-black-100 tn:flex tn:h-12 tn:w-12 tn:items-center tn:justify-center tn:rounded-full tn:border tn:rtl:rotate-180"
    >
      <GoBackIcon
        :class="[
          'tn:h-4 tn:w-4',
          isWlHelperUrl() || config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#161616]'
        ]"
      />
    </button>
  </div>
</template>
