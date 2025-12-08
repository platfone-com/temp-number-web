<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal'
  import useSharedCss from '@/composables/useSharedCss'
  import type { Segment } from '@/utils/translate'

  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import TranslationText from '@/components/Shared/TranslationText.vue'
  import CheckCircleIcon from '@/assets/images/icons/modal/check-circle.svg'

  const router = useRouter()
  const modalStore = useModalStore()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const notification = computed({
    get: () => modalStore.notification.status,
    set: (newValue: boolean) => {
      modalStore.notification.status = newValue
    }
  })
  const title = computed(() => modalStore.notification.title)
  const text = computed<Segment[] | string>(() => modalStore.notification.text)
  const buttonText = computed(() => modalStore.notification.buttonText)
  const buttonRouteName = computed(() => modalStore.notification.buttonRouteName)
  const buttonRoute = computed(() => modalStore.notification.buttonRoute)
  const buttonHref = computed(() => modalStore.notification.buttonHref)
  const successIcon = computed(() => modalStore.notification.successIcon)

  watch(
    () => notification.value,
    (newValue) => {
      if (!newValue) modalStore.setNotification(false)
    }
  )

  const close = () => {
    notification.value = false
  }

  const handleBtnClick = async () => {
    if (buttonRouteName.value) {
      await router.push({ name: buttonRouteName.value })
    } else if (buttonRoute.value) {
      await router.push(buttonRoute.value)
    } else if (buttonHref.value) {
      location.href = buttonHref.value
    }
    close()
  }
</script>

<template>
  <Modal v-model="notification" :z-index="600000" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <CheckCircleIcon v-if="successIcon" class="tn:h-18 tn:w-18" />
      <div>
        <div :class="adaptiveModalHeaderClasses()">
          {{ title }}
        </div>
        <div :class="adaptiveModalSubheaderClasses()">
          <div v-if="typeof text === 'string'" v-html="text" />
          <TranslationText v-else @click="close" :segments="text" link-font-weight="tn:font-normal" />
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button @click="handleBtnClick" fill block>
          {{ buttonText || $t('web_ok_button') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
