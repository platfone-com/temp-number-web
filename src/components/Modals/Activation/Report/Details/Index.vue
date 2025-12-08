<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import ReportInfo from '@/components/Modals/Activation/Report/Details/ReportInfo.vue'
  import ActivationInfo from '@/components/Modals/Activation/Report/Details/ActivationInfo.vue'
  import Statuses from '@/components/Modals/Activation/Report/Details/Statuses.vue'

  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses } = useSharedCss()

  const classes = {
    block: 'tn:bg-tn-black-50 tn:flex tn:flex-col tn:rounded-xl tn:px-3',
    item: 'tn:border-tn-black-80 tn:flex tn:items-center tn:justify-between tn:border-b tn:py-3 tn:gap-1',
    itemTitle: 'tn:text-xs tn:font-medium tn:opacity-50 tn:lg:min-w-30 tn:text-start',
    itemValue: 'tn:text-xs tn:font-medium tn:text-end'
  }

  const modalStatus = computed({
    get: () => modalStore.reportDetailsModal.status,
    set: (newValue: boolean) => {
      modalStore.reportDetailsModal.status = newValue
    }
  })
  const report = computed(() => modalStore.reportDetailsModal.report)

  const close = () => {
    modalStore.reportDetailsModal = { status: false, report: null }
  }

  watch(
    () => modalStatus.value,
    (newValue) => {
      if (!newValue) close()
    }
  )
</script>

<template>
  <Modal v-model="modalStatus" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div :class="adaptiveModalHeaderClasses()">
        {{ $t('web_title_report_details') }}
      </div>

      <div class="tn:w-full">
        <div v-if="report" class="tn:flex tn:w-full tn:flex-col tn:gap-4">
          <ReportInfo :report="report" :classes="classes" />
          <ActivationInfo :report="report" :classes="classes" />
          <Statuses :report="report" :classes="classes" />
        </div>
      </div>

      <Button @click="close" fill block>{{ $t('web_ok_button') }}</Button>
    </div>
  </Modal>
</template>
