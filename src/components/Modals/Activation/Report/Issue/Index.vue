<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import type { IReportReason, IReportResult } from '@/types/api/report'
  import Modal from '@/components/Shared/Modal.vue'
  import Reasons from '@/components/Modals/Activation/Report/Issue/Reasons.vue'
  import Details from '@/components/Modals/Activation/Report/Issue/Details.vue'
  import ReportSent from '@/components/Modals/Activation/Report/Issue/ReportSent.vue'

  const emit = defineEmits(['reloadNumbers'])

  const modalStore = useModalStore()

  const selectedReason = ref<IReportReason | null>(null)
  const reportSentResult = ref<IReportResult | null>(null)

  const modalStatus = computed({
    get: () => modalStore.reportIssueModal.status,
    set: (newValue: boolean) => {
      modalStore.reportIssueModal.status = newValue
    }
  })
  const activationId = computed(() => modalStore.reportIssueModal.activationId || '')

  const close = () => {
    modalStore.reportIssueModal = { status: false, activationId: null, availableReasons: null }
    reportSentResult.value = null
    selectedReason.value = null
  }

  const handleSelectReason = (reason: IReportReason) => {
    selectedReason.value = reason
  }

  const handleSentReport = (result: IReportResult) => {
    reportSentResult.value = result
    if (result.status === 'accepted') {
      emit('reloadNumbers')
    }
  }

  watch(
    () => modalStatus.value,
    async (newValue) => {
      if (!newValue) close()
      else {
        selectedReason.value = null
        reportSentResult.value = null
      }
    }
  )
</script>

<template>
  <Modal v-model="modalStatus" :close-btn="true">
    <Reasons v-if="!selectedReason && !reportSentResult" @close="close" @selectReason="handleSelectReason" />
    <Details
      v-else-if="selectedReason && !reportSentResult"
      @handleSentReport="handleSentReport"
      :selected-reason="selectedReason"
      :activation-id="activationId"
    />
    <ReportSent v-else-if="reportSentResult" :result="reportSentResult" :activation-id="activationId" @close="close" />
  </Modal>
</template>
