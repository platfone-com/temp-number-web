<script lang="ts" setup>
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import i18n from '@/services/i18n'
  import { getAuth, verifyBeforeUpdateEmail } from 'firebase/auth'
  import { useAuthStore } from '@/stores/auth'
  import { useToastStore } from '@/stores/toast'
  import { useModalStore } from '@/stores/modal'
  import { useHelper } from '@/composables/useHelper'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { addBreakLinesToText } from '@/utils/translate'
  import type { FirebaseError } from '@/types/error'

  import Input from '@/components/Shared/Input.vue'
  import Button from '@/components/Shared/Button.vue'
  import ConfirmPasswordModal from '@/components/Modals/ConfirmPassword.vue'
  import type { ActionCodeSettings } from '@firebase/auth'

  const router = useRouter()
  const { t } = useI18n()
  const toast = useToastStore()
  const authStore = useAuthStore()
  const modalStore = useModalStore()
  const { showSomethingWrongModal } = useHelper()
  const { isWlHelperUrl, handleWlActionRedirect } = useWlHelper()

  const { authLoading } = storeToRefs(authStore)

  const schema = yup.object({
    email: yup
      .string()
      .required(t('notifications_enter_email_address'))
      .email(t('web_this_email_address_isn_t_correct')),
    repeatEmail: yup
      .string()
      .oneOf([yup.ref('email')], t('notifications_email_addresses_not_matching'))
      .test('required-if-email', t('notifications_email_addresses_not_matching'), (value, context) => {
        if (context.parent.email) return !!value
        return true
      })
  })

  const { handleSubmit } = useForm({
    validationSchema: schema
  })

  const { value: email, errorMessage: emailError } = useField<string>('email')
  const { value: repeatEmail, errorMessage: repeatEmailError } = useField<string>('repeatEmail')

  const changeEmail = handleSubmit(async (values) => {
    authStore.authLoading = true
    try {
      const auth = getAuth()
      if (!auth.currentUser) return
      let actionCodeSettings: ActionCodeSettings | null = null
      if (isWlHelperUrl()) {
        const url = new URL(location.href)
        url.searchParams.delete('token')
        url.searchParams.delete('wl_reauth')

        url.searchParams.set('emailVerified', 'true')
        url.searchParams.set('email', values.email)

        actionCodeSettings = {
          url: url.toString()
        }
      }
      await verifyBeforeUpdateEmail(auth.currentUser, values.email, actionCodeSettings)
      const notificationText = `${t('notifications_email_successfully_changed')}! ${t('notifications_please_click_on_the_verification_link_we_have_sent_to_your_email_b_0_b').replace('<b>__0__</b>', values.email)}`
      if (isWlHelperUrl()) {
        handleWlActionRedirect('changeEmail', 'success', notificationText)
      } else {
        toast.add({
          id: 'email_changed',
          text: notificationText,
          type: 'success',
          timeout: 6000
        })
        await router.push({ name: 'Home' })
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        if (error.code === 'auth/requires-recent-login') {
          modalStore.confirmPasswordModal = true
          return
        } else if (error.code === 'auth/too-many-requests') {
          modalStore.setNotification(true, {
            title: t('notifications_access_disabled'),
            text: addBreakLinesToText(
              i18n.global.t(
                'notifications_access_to_your_account_has_been_temporary_disabled_due_to_many_failed_login_attempts_restore_your_password_or_try_again_later'
              )
            ),
            buttonText: t('web_ok_button')
          })
          return
        }
      }
      showSomethingWrongModal()
    } finally {
      authStore.authLoading = false
    }
  })
</script>

<template>
  <form @submit.prevent="changeEmail" class="tn:mt-10 tn:flex tn:flex-col tn:gap-4">
    <Input v-model="email" :placeholder="$t('web_email_address')" :error-message="emailError" type="email" />
    <Input
      v-model="repeatEmail"
      :placeholder="$t('web_confirm_new_email_address')"
      :error-message="repeatEmailError"
      type="email"
    />
    <Button type="submit" fill :loading="authLoading">{{ $t('web_change_email') }}</Button>
  </form>

  <ConfirmPasswordModal @reAuthenticated="changeEmail" />
</template>
