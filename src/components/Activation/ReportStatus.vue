<script lang="ts" setup>
  import { ref, type PropType } from 'vue'
  import config from '@/config'
  import type { IActivation } from '@/types/api/activation'
  import { type IReportReason, ReportStatus } from '@/types/api/report'
  import { useModalStore } from '@/stores/modal'
  import { useReport } from '@/composables/api/useReport'
  import ReportIcon from '@/assets/images/icons/order/report/report.svg'
  import ReportInReviewIcon from '@/assets/images/icons/order/report/in-review.svg'
  import ReportDeclinedIcon from '@/assets/images/icons/order/report/declined.svg'
  import ReportApprovedIcon from '@/assets/images/icons/order/report/approved.svg'
  import ButtonSpinner from '@/components/Shared/Spinners/ButtonSpinner.vue'

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const { reasons, getAvailableReasonsByActId, getReport } = useReport()
  const modalStore = useModalStore()

  const loading = ref(false)

  const loadAvailableReasons = async (id: string) => {
    if (!id) return
    loading.value = true
    const reasonsData = await getAvailableReasonsByActId(id)
    loading.value = false
    if (reasonsData && reasonsData.length === 0) return
    reasonsData.map(
      (reason: IReportReason) => (reason.reason_name = reasons.value.get(reason.reason_id) || reason.reason_name)
    )
    return reasonsData
  }

  const loadReport = async (id: string) => {
    if (!id) return
    loading.value = true
    const report = await getReport(id)
    loading.value = false
    return report
  }

  const handleReportClick = async () => {
    if (!props.activation.report_status) {
      const availableReasons = await loadAvailableReasons(props.activation.activation_id)
      if (availableReasons) {
        modalStore.reportIssueModal = { status: true, activationId: props.activation.activation_id, availableReasons }
      }
    } else {
      const report = await loadReport(props.activation.activation_id)
      if (report) {
        modalStore.reportDetailsModal = { status: true, report }
      }
    }
  }

  defineExpose({ handleReportClick })
</script>

<template>
  <button
    @click="handleReportClick"
    :class="[
      'tn:text-xxs tn:h-6 tn:rounded-full tn:px-2 tn:leading-3 tn:font-medium',
      'tn:flex tn:items-center tn:gap-0.5',
      'tn:transition-colors tn:duration-300',
      !activation.report_status && 'tn:bg-tn-black-50 tn:hover:bg-tn-black-70 tn:text-tn-black-900/40',
      activation.report_status === ReportStatus.inReview &&
        'tn:bg-primary-900/10 tn:hover:bg-primary-900/15 tn:text-primary-900',
      activation.report_status === ReportStatus.declined &&
        'tn:bg-tn-red-500/12 tn:hover:bg-tn-red-500/20 tn:text-tn-red-500',
      activation.report_status === ReportStatus.approved &&
        'tn:bg-tn-green-500/10 tn:hover:bg-tn-green-500/12 tn:text-tn-green-500'
    ]"
    :disabled="loading"
  >
    <template v-if="!activation.report_status">
      <div>
        <ButtonSpinner v-if="loading" size="tn:h-3 tn:w-3" color="tn:border-tn-black-900/40" weight="tn:border-2" />
        <ReportIcon
          v-else
          :class="['tn:h-3 tn:w-3', config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#334155]']"
        />
      </div>
      <span>{{ $t('web_report_button') }}</span>
    </template>
    <template v-if="activation.report_status === ReportStatus.inReview">
      <div>
        <ButtonSpinner v-if="loading" size="tn:h-3 tn:w-3" color="tn:border-primary-900" weight="tn:border-2" />
        <ReportInReviewIcon v-else class="tn:text-primary-900 tn:h-3 tn:w-3" />
      </div>
      <div class="tn:whitespace-nowrap">{{ $t('web_report_in_review_button') }}</div>
    </template>
    <template v-if="activation.report_status === ReportStatus.declined">
      <div>
        <ButtonSpinner v-if="loading" size="tn:h-3 tn:w-3" color="tn:border-tn-red-500" weight="tn:border-2" />
        <ReportDeclinedIcon v-else class="tn:-mt-0.5 tn:h-3 tn:w-3" />
      </div>
      <span>{{ $t('web_report_declined_button') }}</span>
    </template>
    <template v-if="activation.report_status === ReportStatus.approved">
      <div>
        <ButtonSpinner v-if="loading" size="tn:h-3 tn:w-3" color="tn:border-tn-green-500" weight="tn:border-2" />
        <ReportApprovedIcon v-else class="tn:h-3 tn:w-3" />
      </div>
      <span>{{ $t('web_report_approved_button') }}</span>
    </template>
  </button>
</template>
