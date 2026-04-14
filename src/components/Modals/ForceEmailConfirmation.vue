<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { getAuth } from 'firebase/auth'
  import { useModalStore } from '@/stores/modal'
  import { useAuth } from '@/composables/useAuth'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useWlAuth } from '@/composables/wl/useWlAuth'
  import useSharedCss from '@/composables/useSharedCss'
  import { addBreakLinesToText } from '@/utils/translate'

  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const auth = getAuth()
  const { logout, resendEmailConfirmation } = useAuth()
  const { wlLogout } = useWlAuth()
  const { isWlHelperUrl } = useWlHelper()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const { forceEmailConfirmationModal } = storeToRefs(useModalStore())
  const loading = ref(false)
  const isWlPage = computed(() => isWlHelperUrl())
  const modalText = computed(() => {
    const email = auth.currentUser && auth.currentUser.email ? auth.currentUser.email : ''
    return addBreakLinesToText(
      t('notifications_please_click_on_the_verification_link_we_have_sent_to_your_email_b_0_b')
    ).replace('__0__', `<strong>${email}</strong>`)
  })

  const signOut = async () => {
    if (isWlPage.value) {
      await wlLogout()
    } else {
      await logout()
    }
  }

  const sendAgain = async () => {
    loading.value = true
    await resendEmailConfirmation()
    loading.value = false
  }
</script>

<template>
  <Modal v-model="forceEmailConfirmationModal" :persistent="true" :z-index="510000">
    <div data-testid="auth-verify-email-modal" :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">{{ $t('notifications_verify_your_email') }}</div>
        <div :class="adaptiveModalSubheaderClasses()">
          <div v-html="modalText" />
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2">
        <Button @click="sendAgain" :loading="loading" fill color="secondary" class="tn:h-14">
          {{ $t('notifications_send_again') }}
        </Button>
        <Button
          @click="router.push({ name: isWlPage ? 'WLChangeEmail' : 'ChangeEmail', query: route.query })"
          :disabled="loading"
          fill
          color="secondary"
          class="tn:h-14"
        >
          {{ $t('notifications_change_email') }}
        </Button>
        <Button fill @click="signOut" :disabled="loading">
          {{ $t('notifications_logout') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
