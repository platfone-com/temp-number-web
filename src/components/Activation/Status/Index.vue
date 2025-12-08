<script lang="ts" setup>
  import { ref, type PropType } from 'vue'
  import { useActivationHelper } from '@/composables/useActivationHelper'
  import { type IActivation } from '@/types/api/activation'
  import Waiting from '@/components/Activation/Status/Waiting.vue'
  import SmsReceivedAndActive from '@/components/Activation/Status/SmsReceivedAndActive.vue'
  import Expired from '@/components/Activation/Status/Expired.vue'
  import StatusTopText from '@/components/Activation/Status/StatusTopText.vue'
  import SmsReceivedAndExpired from '@/components/Activation/Status/SmsReceivedAndExpired.vue'

  defineProps({
    activation: {
      type: Object as PropType<IActivation>,
      required: true
    }
  })

  const { isWaitingStatus, isExpiredStatus, isCanceledStatus, isReceivedAndActiveStatus, isReceivedAndExpiredStatus } =
    useActivationHelper()

  const topTextRef = ref()

  const copyFullMessage = () => {
    topTextRef.value.copyFullMessage()
  }
</script>

<template>
  <div class="tn:-mt-1 tn:flex tn:flex-col tn:gap-3.5">
    <StatusTopText ref="topTextRef" :activation="activation" />

    <Expired v-if="isExpiredStatus(activation) || isCanceledStatus(activation)" />
    <Waiting v-else-if="isWaitingStatus(activation)" :sms-status="activation.sms_status" />
    <SmsReceivedAndActive
      v-else-if="isReceivedAndActiveStatus(activation)"
      @copyFullMessage="copyFullMessage"
      :activation="activation"
    />
    <SmsReceivedAndExpired v-else-if="isReceivedAndExpiredStatus(activation)" :activation="activation" />
  </div>
</template>
