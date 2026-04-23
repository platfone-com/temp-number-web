<script lang="ts" setup>
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { useI18n } from 'vue-i18n'
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
  import { useAuthStore } from '@/stores/auth'
  import { useToastStore } from '@/stores/toast'
  import { useHelper } from '@/composables/useHelper'
  import { useAuth } from '@/composables/useAuth'
  import type { FirebaseError } from '@/types/error'

  import Input from '@/components/Shared/Input.vue'
  import Button from '@/components/Shared/Button.vue'
  import { storeToRefs } from 'pinia'

  const { t } = useI18n()
  const toast = useToastStore()
  const authStore = useAuthStore()
  const { showSomethingWrongModal } = useHelper()
  const { handleSuccessAuth, sendCustomizedEmailVerification } = useAuth()

  const { authLoading } = storeToRefs(authStore)

  const schema = yup.object({
    email: yup
      .string()
      .required(t('notifications_enter_email_address'))
      .email(t('web_this_email_address_isn_t_correct')),
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

  const { value: email, errorMessage: emailError } = useField<string>('email')
  const { value: password, errorMessage: passwordError } = useField<string>('password')
  const { value: repeatPassword, errorMessage: repeatPasswordError } = useField<string>('repeatPassword')

  const createAccount = handleSubmit(async (values) => {
    authStore.authLoading = true
    try {
      const auth = getAuth()
      const result = await createUserWithEmailAndPassword(auth, values.email, values.password)
      if (result && result.user) {
        await handleSuccessAuth('signup')
        await sendCustomizedEmailVerification(result.user)
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        if (
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
    } finally {
      authStore.authLoading = false
    }
  })
</script>

<template>
  <form data-testid="auth-signup-form" @submit.prevent="createAccount" class="tn:mt-10 tn:flex tn:flex-col tn:gap-4">
    <Input
      data-testid="auth-signup-email"
      v-model="email"
      :placeholder="$t('web_email_address')"
      :error-message="emailError"
      type="email"
    />
    <Input
      data-testid="auth-signup-password"
      v-model="password"
      :placeholder="$t('web_password')"
      :error-message="passwordError"
      type="password"
    />
    <Input
      data-testid="auth-signup-confirm-password"
      v-model="repeatPassword"
      :placeholder="$t('web_confirm_password')"
      :error-message="repeatPasswordError"
      type="password"
    />
    <Button data-testid="auth-signup-submit" type="submit" fill :loading="authLoading">{{ $t('web_sign_up') }}</Button>
  </form>
</template>
