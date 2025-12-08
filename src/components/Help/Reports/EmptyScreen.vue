<script lang="ts" setup>
  import config from '@/config'
  import { useOrderListHeight } from '@/composables/useOrderListHeight'
  import Button from '@/components/Shared/Button.vue'
  import EmptyReportsIcon from '@/assets/images/icons/empty/reports.svg'

  const { height } = useOrderListHeight()
</script>

<template>
  <div :style="{ height: `${height}px` }" class="tn:flex tn:items-center tn:justify-center">
    <div class="tn:flex tn:flex-col tn:items-center tn:gap-4 tn:text-center">
      <EmptyReportsIcon
        :class="['tn:h-16 tn:w-16', config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#334155]']"
      />
      <div class="tn:flex tn:flex-col tn:gap-1">
        <h3 class="tn:text-2xl tn:leading-[1.625rem] tn:font-medium">{{ $t('web_problem_with_a_number') }}</h3>
        <p class="tn:text-sm tn:leading-[160%] tn:opacity-60">{{ $t('web_send_us_a_report_for_review') }}</p>
      </div>
      <Button to="Numbers" fill>{{ $t('web_mob_footer_tab_numbers') }}</Button>
    </div>
  </div>
</template>
