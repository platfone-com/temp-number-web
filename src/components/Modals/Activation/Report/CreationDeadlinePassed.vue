<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import { addBreakLinesToText } from '@/utils/translate'

  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import ReportTimePassedIcon from '@/assets/images/icons/report/report-creation-deadline-passed.svg'

  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const modalStatus = computed({
    get: () => modalStore.reportCreationDeadlinePassedModal,
    set: (value: boolean) => {
      modalStore.reportCreationDeadlinePassedModal = value
    }
  })

  const close = () => {
    modalStore.reportCreationDeadlinePassedModal = false
  }

  watch(
    () => modalStatus.value,
    (newValue) => {
      if (!newValue) close()
    }
  )
</script>

<template>
  <Modal v-model="modalStatus" :z-index="510000" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <ReportTimePassedIcon class="tn:h-25 tn:w-25" />
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ $t('web_times_up') }}
        </div>
        <div :class="adaptiveModalSubheaderClasses()">
          <div
            v-html="addBreakLinesToText($t('web_you_can_report_a_number_only_in_the_first_hour_the_time_has_passed'))"
          />
        </div>
      </div>

      <Button @click="close" fill block>{{ $t('web_ok_button') }}</Button>
    </div>
  </Modal>
</template>
