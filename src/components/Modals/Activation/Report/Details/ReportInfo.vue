<script lang="ts" setup>
  import { ref, type PropType } from 'vue'
  import { format } from 'date-fns'
  import { useModalStore } from '@/stores/modal'
  import { useReport } from '@/composables/api/useReport'
  import { type IReport, ReportStatus } from '@/types/api/report'
  import { useSlideDownTransition } from '@/composables/useSlideDownTransition'
  import HelpIcon from '@/assets/images/icons/report/details/help.svg'
  import ReportInReviewIcon from '@/assets/images/icons/order/report/in-review.svg'
  import ReportDeclinedIcon from '@/assets/images/icons/order/report/declined.svg'
  import ReportApprovedIcon from '@/assets/images/icons/order/report/approved.svg'
  import ViewIcon from '@/assets/images/icons/report/details/view.svg'
  import NotProvidedIcon from '@/assets/images/icons/report/details/not-provided.svg'
  import ArrowIcon from '@/assets/images/icons/report/details/arrow.svg'

  const props = defineProps({
    report: {
      type: Object as PropType<IReport>,
      required: true
    },
    classes: {
      type: Object as PropType<Record<string, string>>,
      required: true
    }
  })

  const { beforeEnter, enter, leave } = useSlideDownTransition()
  const { reasons } = useReport()
  const modalStore = useModalStore()

  const buttonClasses =
    'tn:text-xxs tn:flex tn:cursor-default tn:items-center tn:gap-1 tn:px-2 tn:py-1.5 tn:leading-2 tn:font-medium tn:bg-tn-black-87 tn:rounded-[70px]'
  const isDetailsOpen = ref(false)

  const downloadEvidence = () => {
    if (!props.report.evidence_url) return
    window.open(props.report.evidence_url, '_blank')
  }

  const toggleReportMessage = () => {
    if (!props.report.message) return
    isDetailsOpen.value = !isDetailsOpen.value
  }
</script>

<template>
  <div :class="classes.block">
    <div :class="classes.item">
      <div class="tn:text-start">
        <div :class="classes.itemTitle">{{ $t('web_report_button') }}</div>
        <div
          @click="modalStore.reportHowItWorksModal = true"
          class="tn:flex tn:cursor-pointer tn:items-center tn:gap-0.5 tn:text-sm tn:leading-4.5 tn:font-medium tn:opacity-100"
        >
          {{ $t('web_status') }}
          <HelpIcon class="tn:text-tn-black-900 tn:h-4 tn:w-4 tn:min-w-4" />
        </div>
      </div>
      <div :class="classes.itemValue">
        <div
          :class="[
            'tn:text-xxs tn:flex tn:h-6 tn:items-center tn:gap-0.5 tn:rounded-full tn:px-2 tn:leading-3 tn:font-medium',
            report.activation.report_status === ReportStatus.inReview && 'tn:bg-primary-900/10 tn:text-primary-900',
            report.activation.report_status === ReportStatus.declined && 'tn:bg-tn-red-500/12 tn:text-tn-red-500',
            report.activation.report_status === ReportStatus.approved && 'tn:bg-tn-green-500/10 tn:text-tn-green-500'
          ]"
        >
          <template v-if="report.activation.report_status === ReportStatus.inReview">
            <ReportInReviewIcon class="tn:text-primary-900 tn:-mt-0.5 tn:h-3 tn:w-3" />
            <span>{{ $t('web_report_in_review_button') }}</span>
          </template>
          <template v-if="report.activation.report_status === ReportStatus.declined">
            <ReportDeclinedIcon class="tn:-mt-0.5 tn:h-3 tn:w-3" />
            <span>{{ $t('web_report_declined_button') }}</span>
          </template>
          <template v-if="report.activation.report_status === ReportStatus.approved">
            <ReportApprovedIcon class="tn:-mt-0.5 tn:h-3 tn:w-3" />
            <span>{{ $t('web_report_approved_button') }}</span>
          </template>
        </div>
      </div>
    </div>
    <div :class="classes.item">
      <div :class="classes.itemTitle">{{ $t('web_created_at') }}</div>
      <div :class="classes.itemValue">
        {{ format(new Date(Number(report.created_at) * 1000), 'hh:mm a, d MMM yyyy') }}
      </div>
    </div>
    <div :class="classes.item">
      <div :class="classes.itemTitle">{{ $t('web_report_reason') }}</div>
      <div :class="classes.itemValue">{{ reasons.get(report.reason_id) }}</div>
    </div>
    <div :class="[classes.item, 'tn:flex-col tn:gap-1.5 tn:!py-2', report.message && 'tn:cursor-pointer']">
      <div @click="toggleReportMessage" class="tn:flex tn:w-full tn:items-center tn:justify-between tn:select-none">
        <div :class="[classes.itemTitle]">{{ $t('web_details') }}</div>
        <div :class="classes.itemValue">
          <ArrowIcon
            v-if="report.message"
            :class="[
              'tn:text-tn-black-900 tn:h-6 tn:w-6 tn:transition-transform tn:duration-300',
              !isDetailsOpen && 'tn:ltr:rotate-90 tn:rtl:-rotate-90'
            ]"
          />
          <div v-else :class="buttonClasses">
            <NotProvidedIcon class="tn:text-tn-black-900 tn:h-3 tn:w-3" />
            {{ $t('web_evidence_not_provided') }}
          </div>
        </div>
      </div>
      <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div
          v-show="isDetailsOpen"
          :class="['tn:w-full tn:overflow-hidden tn:pt-0 tn:text-start tn:text-xs tn:font-medium']"
        >
          {{ report.message }}
        </div>
      </transition>
    </div>
    <div :class="[classes.item, 'tn:border-b-0 tn:!pt-2']">
      <div :class="classes.itemTitle">{{ $t('web_evidence_submitted') }}</div>
      <div :class="classes.itemValue">
        <button
          @click="downloadEvidence"
          :class="[
            buttonClasses,
            'tn:transition-colors tn:duration-300',
            report.evidence_url && 'tn:hover:bg-tn-black-90 tn:cursor-pointer'
          ]"
        >
          <template v-if="report.evidence_url">
            <ViewIcon class="tn:text-tn-black-900 tn:h-3 tn:w-3" />
            {{ $t('web_evidence_view_button') }}
          </template>
          <template v-else>
            <NotProvidedIcon class="tn:text-tn-black-900 tn:h-3 tn:w-3" />
            {{ $t('web_evidence_not_provided') }}
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
