<script lang="ts" setup>
  import { addBreakLinesToText } from '@/utils/translate'
  import InfoIcon from '@/assets/images/icons/info.svg'
</script>

<template>
  <router-link :to="{ name: 'Numbers' }" class="tn:bg-tn-black-50 tn:rounded-xl tn:p-3">
    <div class="tn:flex tn:items-center tn:gap-2">
      <InfoIcon class="tn:text-tn-black-900 tn:h-6 tn:w-6 tn:min-w-6" />
      <span class="tn:text-xs tn:font-medium tn:opacity-50">{{
        addBreakLinesToText(
          $t(
            'web_this_form_is_not_for_reporting_problems_with_specific_numbers_requests_are_usually_answered_within_72_hours'
          )
        )
      }}</span>
    </div>
  </router-link>
</template>
