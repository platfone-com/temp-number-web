<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useToastStore } from '@/stores/toast'
  import { useTgAuth } from '@/composables/useTgAuth'
  import { useDevice } from '@/composables/useDevice'
  import FullPageSpinner from '@/components/Shared/Spinners/FullPageSpinner.vue'
  import Telegram from '@/components/Auth/Socials/Telegram.vue'

  const route = useRoute()
  const toast = useToastStore()
  const { tgLogin, isPopupBlocked, handleTelegramCallback } = useTgAuth()
  const { isIOSMobile } = useDevice()

  const showAuthButton = ref(false)
  const returnUrl = ref('')
  const connector = computed(() => (returnUrl.value.includes('?') ? '&' : '?'))

  const returnError = (errorMessage: string) => {
    location.href = `${returnUrl.value}${connector.value}status=error&errorMessage=${encodeURIComponent(errorMessage)}`
  }

  const handleTgAuth = async () => {
    try {
      if (isIOSMobile()) {
        await tgLogin(true)
      } else {
        const token = await tgLogin(true)
        if (!token) {
          returnError('Token is empty')
          return
        }
        location.href = `${returnUrl.value}${connector.value}status=success&token=${encodeURIComponent(token)}`
      }
    } catch (e) {
      const errorMessage = (e as Error).message ?? 'Unknown Telegram auth error'
      returnError(errorMessage)
    }
  }

  onMounted(async () => {
    const needHandleTelegramAuthCallback = sessionStorage.getItem('tg_auth_with_redirect')
    if (needHandleTelegramAuthCallback) {
      const isMobileAuth = sessionStorage.getItem('tg_auth_mobile_mode') === 'true'
      sessionStorage.removeItem('tg_auth_with_redirect')
      sessionStorage.removeItem('tg_auth_mobile_mode')
      await handleTelegramCallback(isMobileAuth)
      return
    }

    if (route.query?.returnUrl) {
      returnUrl.value = route.query.returnUrl as string
      if (isPopupBlocked()) {
        showAuthButton.value = true
      } else {
        await handleTgAuth()
      }
    } else {
      toast.add({
        id: 'tg_mobile_empty_return_url_error',
        text: 'Empty return URL parameter. Please try again!',
        timeout: 3000
      })
    }
  })
</script>

<template>
  <div class="tn:flex tn:h-screen tn:items-center tn:justify-center">
    <div class="tn:flex tn:w-67.5 tn:flex-col tn:items-center tn:justify-center">
      <Telegram v-if="showAuthButton" @click="() => handleTgAuth()" />
      <FullPageSpinner v-else />
    </div>
  </div>
</template>
