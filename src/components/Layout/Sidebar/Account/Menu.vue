<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import config from '@/config'
  import { useAuthStore } from '@/stores/auth'
  import { useAuth } from '@/composables/useAuth'
  import { useModalStore } from '@/stores/modal'
  import { useWlHelper } from '@/composables/wl/useWlHelper'

  import ResendEmailConfirmIcon from '@/assets/images/icons/menu/resend-email-confirm.svg'
  import EmailIcon from '@/assets/images/icons/menu/email.svg'
  import PasswordIcon from '@/assets/images/icons/menu/password.svg'
  import DeleteAccountIcon from '@/assets/images/icons/menu/remove.svg'
  import ButtonSpinner from '@/components/Shared/Spinners/ButtonSpinner.vue'
  import DeleteAccountModal from '@/components/Modals/DeleteAccount.vue'

  const emit = defineEmits(['closeSidebar'])

  const { resendEmailConfirmation } = useAuth()
  const { wlHelperSignInUrl } = useWlHelper()
  const modalStore = useModalStore()
  const wlStore = { customerEmail: '' }

  const { isAuthenticated, isAuthPasswordProvider, isEmailVerified } = storeToRefs(useAuthStore())
  const loading = ref(false)

  const wlCustomerEmailParam = computed(() => {
    const email = wlStore.customerEmail || ''
    return email ? `&email=${encodeURIComponent(email)}` : ''
  })

  const linkClasses =
    'tn:tracking-tightest tn:hover:text-primary-900 tn:flex tn:text-xl tn:min-h-11 tn:cursor-pointer tn:flex tn:items-center tn:gap-4.5'

  const resend = async () => {
    loading.value = true
    const isSent = await resendEmailConfirmation()
    if (isSent) emit('closeSidebar')
    loading.value = false
  }
</script>

<template>
  <ul class="tn:my-8 tn:flex tn:flex-col tn:gap-2 tn:sm:gap-4">
    <li v-if="isAuthenticated && isAuthPasswordProvider && !isEmailVerified" @click="resend">
      <button :class="[linkClasses, 'tn:disabled:opacity-60']" :disabled="loading">
        <span class="tn:flex tn:h-6 tn:w-6 tn:items-center">
          <ButtonSpinner v-if="loading" size="tn:h-5.25 tn:w-5.25" color="tn:border-primary-900" />
          <ResendEmailConfirmIcon v-else class="tn:text-primary-900 tn:h-6 tn:w-6" />
        </span>
        <span>{{ $t('web_menu_item_retry_email_confirmation') }}</span>
      </button>
    </li>
    <li v-if="isAuthPasswordProvider">
      <component
        :is="config.wlWidgetMode ? 'a' : 'router-link'"
        :href="config.wlWidgetMode ? `${wlHelperSignInUrl}${wlCustomerEmailParam}&wl_action=changeEmail` : undefined"
        :to="!config.wlWidgetMode ? { name: 'ChangeEmail' } : undefined"
        :class="linkClasses"
        @click="$emit('closeSidebar')"
      >
        <EmailIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
        <span>{{ $t('web_menu_item_change_email') }}</span>
      </component>
    </li>
    <li v-if="isAuthPasswordProvider">
      <component
        :is="config.wlWidgetMode ? 'a' : 'router-link'"
        :href="config.wlWidgetMode ? `${wlHelperSignInUrl}${wlCustomerEmailParam}&wl_action=changePassword` : undefined"
        :to="!config.wlWidgetMode ? { name: 'ChangePassword' } : undefined"
        :class="linkClasses"
        @click="$emit('closeSidebar')"
      >
        <PasswordIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
        <span>{{ $t('web_change_password') }}</span>
      </component>
    </li>
    <li @click="modalStore.deleteAccountModal = true">
      <button :class="[linkClasses, 'tn:!text-tn-red-500 tn:hover:!text-red-500']">
        <DeleteAccountIcon class="tn:h-6 tn:w-6" />
        <span>{{ $t('web_menu_item_delete_account') }}</span>
      </button>
    </li>
  </ul>
  <DeleteAccountModal @closeSidebar="$emit('closeSidebar')" />
</template>
