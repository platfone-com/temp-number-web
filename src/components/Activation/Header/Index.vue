<script lang="ts" setup>
  import { ref, type PropType } from 'vue'
  import config from '@/config'
  import { type IActivation } from '@/types/api/activation'
  import { useClipboard } from '@/composables/useClipboard'
  import { useModalStore } from '@/stores/modal'
  import { useActivationHelper } from '@/composables/useActivationHelper'
  import ImageWithFallback from '@/components/Order/Shared/ImageWithFallback.vue'
  import CopyIcon from '@/assets/images/icons/copy.svg'
  import CancelButton from '@/components/Activation/Header/Buttons/Cancel.vue'
  import FinalizeButton from '@/components/Activation/Header/Buttons/Finalize.vue'
  import Countdown from '@/components/Activation/Header/Countdown.vue'

  defineEmits(['updateActiveNumber'])

  const props = defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const {
    isWaitingStatus,
    isExpiredStatus,
    isCanceledStatus,
    isReceivedAndActiveStatus,
    isReceivedAndExpiredStatus,
    isRefundedStatus
  } = useActivationHelper()
  const modalStore = useModalStore()
  const designParams = { primaryColor900: '', tnLabelTextColor: '' }
  const { copyToClipboard } = useClipboard()

  const phoneRef = ref()
  const statusBlockClasses =
    'tn:text-xxs tn:flex tn:items-center tn:justify-center tn:rounded-lg tn:px-1.75 tn:py-0.75 tn:font-light'

  const handleCopy = () => {
    const showCopyNumberModal = localStorage.getItem('showCopyNumberModal')
    if (props.activation.formatted && (!showCopyNumberModal || showCopyNumberModal !== 'false')) {
      modalStore.copyNumberModal = { status: true, activation: props.activation }
    } else {
      copyToClipboard(props.activation.phone, phoneRef.value, 1500)
    }
  }
</script>

<template>
  <div class="tn:bg-tn-black-50 tn:flex tn:items-center tn:justify-between tn:gap-4 tn:rounded-xl tn:p-2">
    <div
      data-testid="activation-copy-number-trigger"
      @click="handleCopy"
      class="tn:gap tn:flex tn:cursor-pointer tn:items-center tn:gap-3"
    >
      <div class="tn:flex tn:items-center tn:gap-1.5">
        <ImageWithFallback
          image-type="countries"
          size="tn:h-4 tn:w-4"
          :image-id="activation.country_id"
          rounded="tn:rounded-sm"
        />
        <div class="tn:text-sm" dir="ltr">
          +<span ref="phoneRef">
            {{ activation.formatted ? activation.formatted.replace('+', '') : activation.phone }}
          </span>
        </div>
      </div>
      <CopyIcon class="tn:text-primary-900 tn:h-4.5 tn:w-4.5 tn:fill-current" />
    </div>
    <div class="tn:gap tn:flex tn:items-center tn:gap-3">
      <div v-if="isRefundedStatus(activation)" :class="[statusBlockClasses, 'tn:bg-tn-green-500 tn:text-white']">
        {{ $t('web_refunded_status') }}
      </div>
      <div
        v-else-if="isExpiredStatus(activation) || isCanceledStatus(activation)"
        :class="[statusBlockClasses, 'tn:bg-tn-black-87']"
      >
        {{ $t('web_not_paid_status') }}
      </div>
      <div
        v-else-if="isReceivedAndExpiredStatus(activation)"
        :class="[
          statusBlockClasses,
          config.wlWidgetMode && designParams.primaryColor900 ? 'tn:bg-primary-900' : 'tn:bg-tn-yellow',
          config.wlWidgetMode && designParams.tnLabelTextColor ? 'tn:text-tn-label-text-color' : ''
        ]"
      >
        {{ $t('web_paid_status') }}
      </div>
      <template v-else-if="isWaitingStatus(activation) || isReceivedAndActiveStatus(activation)">
        <Countdown :end-time="activation.expire_at" @updateActiveNumber="$emit('updateActiveNumber')" />
        <CancelButton :activation="activation" />
        <FinalizeButton :activation="activation" />
      </template>
    </div>
  </div>
</template>
