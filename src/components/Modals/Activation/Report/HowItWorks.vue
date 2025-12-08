<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import ReportIcon from '@/assets/images/icons/report/hiw/report.svg'
  import InReviewIcon from '@/assets/images/icons/report/hiw/in-review.svg'
  import DeclinedIcon from '@/assets/images/icons/report/hiw/declined.svg'
  import ApprovedIcon from '@/assets/images/icons/report/hiw/approved.svg'
  import DecisionIcon from '@/assets/images/icons/report/hiw/decision.svg'
  import WarningIcon from '@/assets/images/icons/report/hiw/warning.svg'

  const { t } = useI18n()
  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses } = useSharedCss()

  const modalStatus = computed({
    get: () => modalStore.reportHowItWorksModal,
    set: (value: boolean) => {
      modalStore.reportHowItWorksModal = value
    }
  })

  const infoList = computed(() => [
    {
      image: ReportIcon,
      header: t('web_report_a_bad_number'),
      subheader: t('web_we_check_it_and_you_get_a_refund_if_the_issue_is_confirmed')
    },
    {
      image: InReviewIcon,
      header: t('web_status_in_review'),
      subheader: t('web_manual_process_that_may_take_up_to_7_days')
    },
    {
      image: DeclinedIcon,
      header: t('web_status_declined'),
      subheader: t('web_no_refund_if_the_issue_is_not_confirmed_or_there_is_not_enough_evidences')
    },
    {
      image: ApprovedIcon,
      header: t('web_status_approved'),
      subheader: t('web_full_refund_issued_if_the_issue_is_confirmed')
    },
    {
      image: DecisionIcon,
      header: t('web_decision_is_final'),
      subheader: t('web_a_report_can_be_sent_only_once')
    },
    {
      image: WarningIcon,
      header: t('web_false_reports'),
      subheader: t('web_may_lead_to_account_block')
    }
  ])

  const close = () => {
    modalStore.reportHowItWorksModal = false
  }

  watch(
    () => modalStatus.value,
    (newValue) => {
      if (!newValue) close()
    }
  )
</script>

<template>
  <Modal v-model="modalStatus" :close-btn="true" :z-index="520000">
    <div :class="adaptiveModalWrapperClasses()">
      <div :class="adaptiveModalHeaderClasses()">
        {{ $t('web_reports_how_it_works') }}
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2">
        <div
          v-for="item in infoList"
          :key="item.header"
          class="tn:bg-tn-black-50 tn:flex tn:gap-2 tn:rounded-xl tn:p-3"
        >
          <component :is="item.image" class="tn:text-tn-black-700 tn:h-6 tn:w-6 tn:min-w-6" />
          <div class="tn:flex tn:flex-col tn:gap-1 tn:text-start">
            <div class="tn:leading-5 tn:font-semibold">{{ item.header }}</div>
            <div class="tn:text-sm tn:leading-4.5 tn:font-medium tn:opacity-50">{{ item.subheader }}</div>
          </div>
        </div>
      </div>

      <Button @click="close" fill block>{{ $t('web_ok_button') }}</Button>
    </div>
  </Modal>
</template>
