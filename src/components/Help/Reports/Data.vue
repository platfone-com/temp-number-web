<script lang="ts" setup>
  import type { IReport } from '@/types/api/report'
  import DataItem from '@/components/Help/Reports/DataItem.vue'

  defineProps<{
    reports: IReport[]
  }>()
</script>

<template>
  <div class="tn:flex tn:flex-col tn:gap-2">
    <div class="tn:text-sm tn:font-medium">{{ $t('web_your_last_100_numbers_reported') }}</div>

    <DataItem v-for="(report, index) in reports" :key="index" :report="report" />
  </div>
</template>
