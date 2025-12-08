<script lang="ts" setup>
  import { computed, type PropType, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import useSharedCss from '@/composables/useSharedCss'
  import { useActivation } from '@/composables/api/useActivation'
  import type { IReportResult } from '@/types/api/report'
  import CheckCircleIcon from '@/assets/images/icons/modal/check-circle.svg'
  import RetryIcon from '@/assets/images/icons/report/retry.svg'
  import Button from '@/components/Shared/Button.vue'
  import { ActivationStatus, SmsStatus } from '@/types/api/activation'

  const { t } = useI18n()
  const { getActivation, retryActivation } = useActivation()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const emit = defineEmits(['close'])
  const props = defineProps({
    result: {
      type: Object as PropType<IReportResult>,
      required: true
    },
    activationId: {
      type: String,
      required: true
    }
  })

  const loading = ref(false)

  const showCheckCircleIcon = computed(() => {
    return props.result.status === 'accepted' || (props.result.status === 'declined' && props.result.decline_id === 1)
  })
  const showRetry = computed(() => props.result.status === 'declined' && props.result.decline_id === 2)
  const headerText = computed(() => {
    if (props.result.status === 'accepted') {
      return t('web_report_accepted')
    } else if (props.result.status === 'declined') {
      return props.result.decline_id === 1
        ? t('web_report_error_title_it_s_all_good')
        : t('web_report_error_title_please_retry')
    }
    return ''
  })
  const subHeaderText = computed(() => {
    if (props.result.status === 'accepted') {
      return t('web_we_ll_review_it_and_you_get_the_answer')
    } else if (props.result.status === 'declined') {
      return props.result.decline_id === 1
        ? t(
            'web_report_error_subtitle_no_sms_received_so_this_number_isn_t_paid_cancel_it_or_wait_then_try_another_for_free'
          )
        : t('web_report_error_subtitle_this_number_is_still_active_send_an_sms_then_tap_retry_to_receive_it')
    }
    return ''
  })

  const retry = async () => {
    if (!props.activationId) return
    loading.value = true
    const activation = await getActivation(props.activationId)
    if (
      activation &&
      activation.activation_status === ActivationStatus.active &&
      [SmsStatus.smsReceived, SmsStatus.retryReceived].includes(activation.sms_status)
    ) {
      await retryActivation(props.activationId)
    }
    loading.value = false
    emit('close')
  }
</script>

<template>
  <div :class="adaptiveModalWrapperClasses()">
    <CheckCircleIcon v-if="showCheckCircleIcon" class="tn:h-18 tn:w-18" />
    <RetryIcon v-if="showRetry" class="tn:text-primary-900 tn:h-18 tn:w-18 tn:fill-current" />

    <div>
      <div :class="adaptiveModalHeaderClasses()">
        {{ headerText }}
      </div>
      <div :class="adaptiveModalSubheaderClasses()">
        {{ subHeaderText }}
      </div>
    </div>

    <Button v-if="showRetry" @click="retry" fill block :loading="loading" gap="tn:gap-2">
      <RetryIcon v-if="showRetry" class="tn:h-4.5 tn:w-4.5 tn:min-w-4.5 tn:fill-current tn:text-white" />
      {{ $t('web_retry_button') }}
    </Button>
    <Button v-else @click="$emit('close')" fill block>{{ $t('web_ok_button') }}</Button>
  </div>
</template>
