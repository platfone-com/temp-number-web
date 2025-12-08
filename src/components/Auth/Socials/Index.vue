<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
  import { useToastStore } from '@/stores/toast'
  import { useAuthStore } from '@/stores/auth'
  import { useHelper } from '@/composables/useHelper'
  import { useAuth } from '@/composables/useAuth'
  import { useTgAuth } from '@/composables/useTgAuth'
  import type { FirebaseError } from '@/types/error'

  import AppleIcon from '@/assets/images/socials/apple.svg'
  import FacebookIcon from '@/assets/images/socials/facebook.svg'
  import GoogleIcon from '@/assets/images/socials/google.svg'
  import Button from '@/components/Auth/Socials/Button.vue'
  import Telegram from '@/components/Auth/Socials/Telegram.vue'
  import ArrowDownIcon from '@/assets/images/icons/arrow-down.svg'

  const { t } = useI18n()
  const toast = useToastStore()
  const { tgLogin, handleTelegramCallback } = useTgAuth()
  const { showSomethingWrongModal } = useHelper()
  const { handleSuccessAuth } = useAuth()
  const authStore = useAuthStore()

  const showFacebookButton = ref(false)
  const socialAuthProviders = computed(() => [
    {
      id: 0,
      text: t('web_continue_with_apple'),
      provider: 'apple.com'
    },
    {
      id: 1,
      text: t('web_continue_with_google'),
      provider: 'google.com'
    }
  ])

  const login = async (providerName: string) => {
    const auth = getAuth()
    const provider = getProviderByName(providerName)
    if (!provider) return

    authStore.authLoading = true
    try {
      const result = await signInWithPopup(auth, provider)
      if (result && result.user) await handleSuccessAuth()
    } catch (e: unknown) {
      handleLoginError(e)
    } finally {
      authStore.authLoading = false
    }
  }

  const handleLoginError = (e: unknown) => {
    if (e && typeof e === 'object' && 'code' in e) {
      const error = e as FirebaseError
      if (error.code === 'auth/popup-closed-by-user') return
      if (error.code === 'auth/popup-blocked') {
        toast.add({
          id: 'blocked_popups_error_web',
          text: t('notifications_please_allow_pop_ups_in_your_browser_settings_and_try_again')
        })
        return
      } else if (
        [
          'auth/email-already-in-use',
          'auth/credential-already-in-use',
          'auth/account-exists-with-different-credential'
        ].includes(error.code)
      ) {
        toast.add({
          id: 'email_already_registered_validation',
          text: t('notifications_email_address_already_registered')
        })
        return
      }
    }
    showSomethingWrongModal()
  }

  const getProviderByName = (name: string) => {
    let provider = null
    switch (name) {
      case 'facebook.com':
        provider = new FacebookAuthProvider()
        break
      case 'google.com':
        provider = new GoogleAuthProvider()
        break
      case 'apple.com':
        provider = new OAuthProvider('apple.com')
        break
    }
    return provider
  }

  const getSocialIcon = (provider: string) => {
    switch (provider) {
      case 'google.com':
        return GoogleIcon
      case 'apple.com':
        return AppleIcon
    }
  }

  onMounted(async () => {
    const needHandleTelegramAuthCallback = sessionStorage.getItem('tg_auth_with_redirect')
    if (needHandleTelegramAuthCallback) {
      sessionStorage.removeItem('tg_auth_with_redirect')
      await handleTelegramCallback()
    }
  })
</script>

<template>
  <div class="tn:mt-8 tn:mb-4 tn:flex tn:flex-col">
    <div class="tn:flex tn:w-full tn:flex-col tn:items-center tn:gap-3">
      <Button v-for="item of socialAuthProviders" :key="item.id" @click="login(item.provider)">
        <component :is="getSocialIcon(item.provider)" class="tn:h-6 tn:w-6" />
        {{ item.text }}
      </Button>
      <Telegram @click="() => tgLogin()" />

      <Transition name="fade-slide" mode="out-in">
        <Button v-if="showFacebookButton" @click="login('facebook.com')">
          <FacebookIcon class="tn:h-6 tn:w-6" />
          {{ t('web_continue_with_facebook') }}
        </Button>
        <button v-else @click="showFacebookButton = true" class="tn:px-5 tn:py-1">
          <ArrowDownIcon class="tn:text-tn-black-500 tn:h-4 tn:w-4 tn:min-w-4" />
        </button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 200ms ease,
      transform 200ms ease;
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
</style>
