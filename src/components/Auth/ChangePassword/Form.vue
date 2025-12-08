<script lang="ts" setup>
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { getAuth, updatePassword } from 'firebase/auth'
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

  const router = useRouter()
  const { t } = useI18n()
  const toast = useToastStore()
  const modalStore = useModalStore()
  const authStore = useAuthStore()
  const { showSomethingWrongModal } = useHelper()
  const { isWlHelperUrl, handleWlActionRedirect } = useWlHelper()

  const { authLoading } = storeToRefs(authStore)

  const schema = yup.object({
    password: yup
      .string()
      .required(t('notifications_enter_password'))
      .min(6, t('notifications_strong_passwords_have_at_least_6_characters')),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('notifications_passwords_didn_t_match'))
      .test('required-if-password', t('notifications_passwords_didn_t_match'), (value, context) => {
        if (context.parent.password) return !!value
        return true
      })
  })

  const { handleSubmit } = useForm({
    validationSchema: schema
  })

  const { value: password, errorMessage: passwordError } = useField<string>('password')
  const { value: repeatPassword, errorMessage: repeatPasswordError } = useField<string>('repeatPassword')

  const changePassword = handleSubmit(async (values) => {
    authStore.authLoading = true
    try {
      const auth = getAuth()
      if (!auth.currentUser) return
      await updatePassword(auth.currentUser, values.password)
      const notificationText = `${t('notifications_password_successfully_changed')}`
      if (isWlHelperUrl()) {
        handleWlActionRedirect('changePassword', 'success', notificationText)
      } else {
        toast.add({
          id: 'password_changed',
          text: notificationText,
          type: 'success'
        })
        await router.push({ name: 'Home' })
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        if (error.code === 'auth/requires-recent-login') {
          modalStore.confirmPasswordModal = true
          return
        } else if (e.code === 'auth/too-many-requests') {
          modalStore.setNotification(true, {
            title: t('notifications_access_disabled'),
            text: addBreakLinesToText(
              t(
                'notifications_access_to_your_account_has_been_temporary_disabled_due_to_many_failed_login_attempts_restore_your_password_or_try_again_later'
              )
            ),
            buttonText: t('web_ok_button')
          })
          return
        } else if (error.code === 'auth/weak-password') {
          toast.add({
            id: 'new_psw_not_strong_validation',
            text: t('notifications_new_password_should_have_at_least_6_characters')
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
  <form @submit.prevent="changePassword" class="tn:mt-10 tn:flex tn:flex-col tn:gap-4">
    <Input v-model="password" :placeholder="$t('web_new_password')" :error-message="passwordError" type="password" />
    <Input
      v-model="repeatPassword"
      :placeholder="$t('web_confirm_new_password')"
      :error-message="repeatPasswordError"
      type="password"
    />
    <Button type="submit" fill :loading="authLoading">{{ $t('web_change_password_button') }}</Button>
  </form>

  <ConfirmPasswordModal @reAuthenticated="changePassword" />
</template>
