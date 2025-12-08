<script lang="ts" setup>
  import { computed } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import type { IReportReason } from '@/types/api/report'
  import HelpIcon from '@/assets/images/icons/report/details/help.svg'
  import ReasonItem from '@/components/Modals/Activation/Report/Issue/ReasonItem.vue'

  const emit = defineEmits(['selectReason', 'close'])

  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses } = useSharedCss()

  const availableReasons = computed(() => modalStore.reportIssueModal.availableReasons || [])

  const handleSelectReason = (reason: IReportReason) => {
    emit('selectReason', reason)
  }
</script>

<template>
  <div :class="adaptiveModalWrapperClasses()">
    <div :class="adaptiveModalHeaderClasses()">
      {{ $t('web_title_report_issue') }}
    </div>

    <div class="tn:w-full">
      <div class="tn:flex tn:w-full tn:flex-col tn:gap-4">
        <ReasonItem
          v-for="reason of availableReasons"
          :key="reason.reason_id"
          :reason="reason"
          @selectReason="handleSelectReason"
        />
      </div>
    </div>

    <div class="tn:flex tn:justify-center">
      <button
        @click="modalStore.reportHowItWorksModal = true"
        class="tn:text-tn-black-300 tn:flex tn:items-center tn:gap-1.5"
      >
        <HelpIcon class="tn:text-tn-black-900 tn:h-4 tn:w-4" />
        <span>{{ $t('web_reports_how_it_works') }}</span>
      </button>
    </div>
  </div>
</template>
