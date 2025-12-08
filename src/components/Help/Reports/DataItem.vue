<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { format } from 'date-fns'
  import { useI18n } from 'vue-i18n'
  import { useOrderStore } from '@/stores/order'
  import type { IReport } from '@/types/api/report'
  import { BillingStatus } from '@/types/api/activation'
  import ReportStatus from '@/components/Activation/ReportStatus.vue'

  const { t } = useI18n()
  const { servicesMap } = useOrderStore()

  const props = defineProps<{
    report: IReport
  }>()

  const reportStatusRef = ref<InstanceType<typeof ReportStatus> | null>(null)

  const serviceName = computed(() => {
    const serviceId = props.report.activation.service_id
    return serviceId === 'other' ? t('web_any_other_item') : servicesMap.get(serviceId)?.name
  })
  const price = computed(() => {
    if (!props.report.activation.customer_price) return 0
    return props.report.activation.customer_price / 100
  })

  const handleReportOpen = () => {
    reportStatusRef.value?.handleReportClick()
  }
</script>

<template>
  <div
    @click="handleReportOpen"
    class="tn:border-tn-black-87 tn:flex tn:cursor-pointer tn:items-center tn:justify-between tn:gap-2.5 tn:rounded-2xl tn:border tn:p-3"
  >
    <div class="tn:flex tn:flex-col tn:gap-1">
      <div class="tn:text-xs tn:leading-3.75 tn:font-medium tn:opacity-50">
        {{ format(new Date(Number(report.created_at) * 1000), 'hh:mm a, d MMM yyyy') }}
      </div>
      <div class="tn:flex tn:items-center tn:gap-1.5 tn:text-sm tn:leading-4.5 tn:font-medium">
        <div class="tn:flex tn:items-center tn:gap-1.5">
          <div class="tn:xs:max-w-50 tn:max-w-24 tn:truncate">{{ serviceName }}</div>
          <div v-if="serviceName">|</div>
          <div>{{ report.activation.country_id.toUpperCase() }}</div>
          <div v-if="report.activation.billing_status === BillingStatus.refunded" class="tn:text-tn-green-500">
            {{ $t('web_refunded_status') }}
          </div>
          <div v-else class="tn:text-primary-900">${{ price }}</div>
        </div>
      </div>
    </div>
    <ReportStatus ref="reportStatusRef" :activation="report.activation" />
  </div>
</template>
