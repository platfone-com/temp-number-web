<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import config from '@/config'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import { useWlHelper } from '@/composables/wl/useWlHelper'

  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const router = useRouter()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()
  const { isWlHelperUrl, wlHelperContactUsUrl } = useWlHelper()

  const { accountOnHoldModal } = storeToRefs(useModalStore())

  const contactUs = () => {
    accountOnHoldModal.value = false
    if (config.wlWidgetMode || isWlHelperUrl()) {
      location.href = wlHelperContactUsUrl.value
      return
    }
    router.push({ name: 'ContactUs' })
  }
</script>

<template>
  <Modal v-model="accountOnHoldModal" :z-index="540000" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">{{ $t('notifications_account_on_hold') }}</div>

        <div :class="adaptiveModalSubheaderClasses()">
          {{ $t('notifications_please_contact_us_for_more_information') }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button @click="contactUs" fill block>
          {{ $t('notifications_contact_us') }}
        </Button>
        <Button @click="accountOnHoldModal = false" block fill color="secondary">
          {{ $t('notifications_not_now') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
