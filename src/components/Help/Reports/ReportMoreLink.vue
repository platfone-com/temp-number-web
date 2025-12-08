<script lang="ts" setup>
  import config from '@/config'
  import InfoIcon from '@/assets/images/icons/info.svg'
  import GoBackIcon from '@/assets/images/icons/go-back.svg'
</script>

<template>
  <router-link
    :to="{ name: 'Numbers' }"
    class="tn:bg-tn-black-50 tn:flex tn:items-center tn:justify-between tn:gap-2 tn:rounded-xl tn:p-3"
  >
    <div class="tn:flex tn:items-center tn:gap-2">
      <InfoIcon class="tn:text-tn-black-900 tn:h-6 tn:w-6 tn:min-w-6" />
      <span class="tn:text-xs tn:font-medium tn:opacity-50">{{ $t('web_report_more_number_issues_here') }}</span>
    </div>
    <GoBackIcon
      :class="[
        'tn:h-4 tn:w-4 tn:min-w-4 tn:opacity-30 tn:ltr:rotate-180 tn:rtl:rotate-0',
        config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#161616]'
      ]"
    />
  </router-link>
</template>
