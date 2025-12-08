<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import config from '@/config'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import { useWlHelper } from '@/composables/wl/useWlHelper'

  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import Countdown from '@/components/Shared/Countdown.vue'

  const router = useRouter()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()
  const { isWlHelperUrl, wlHelperContactUsUrl } = useWlHelper()

  const modalStore = useModalStore()

  const tooManyRequestsModalStatus = computed({
    get: () => modalStore.tooManyRequestsModal.status,
    set: (newValue: boolean) => {
      modalStore.tooManyRequestsModal.status = newValue
    }
  })
  const finishTimestamp = computed(() => modalStore.tooManyRequestsModal.finishTimestamp)

  const close = () => {
    modalStore.tooManyRequestsModal = { status: false, finishTimestamp: 0 }
  }

  const contactUs = () => {
    if (config.wlWidgetMode || isWlHelperUrl()) {
      location.href = wlHelperContactUsUrl.value
    } else {
      router.push({ name: 'ContactUs' })
    }
    close()
  }
</script>

<template>
  <Modal v-model="tooManyRequestsModalStatus" :z-index="530000" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <Countdown @finished="close" :end-time="finishTimestamp" :with-circle="true" />
      <div>
        <div :class="adaptiveModalHeaderClasses()">{{ $t('notifications_too_many_requests') }}</div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{ $t('notifications_please_wait_or_contact_us_if_this_happens_often') }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button @click="close" fill block>
          {{ $t('web_ok_button') }}
        </Button>
        <Button @click="contactUs" block fill color="secondary">
          {{ $t('notifications_contact_us') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
