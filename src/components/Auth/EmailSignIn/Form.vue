<script lang="ts" setup>
  import { type PropType, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { type LocationQuery, useRoute } from 'vue-router'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { useI18n } from 'vue-i18n'
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
  import { useAuthStore } from '@/stores/auth'
  import { useToastStore } from '@/stores/toast'
  import { useModalStore } from '@/stores/modal'
  import { useHelper } from '@/composables/useHelper'
  import { useAuth } from '@/composables/useAuth'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import type { FirebaseError } from '@/types/error'

  import Input from '@/components/Shared/Input.vue'
  import Button from '@/components/Shared/Button.vue'

  const { t } = useI18n()
  const route = useRoute()
  const toast = useToastStore()
  const authStore = useAuthStore()
  const modalStore = useModalStore()
  const { showSomethingWrongModal } = useHelper()
  const { handleSuccessAuth } = useAuth()
  const { isWlHelperUrl } = useWlHelper()

  defineProps({
    forgotPasswordHref: {
      type: Object as PropType<{ name: string; query?: LocationQuery }>,
      default: () => {
        return { name: 'ResetPassword' }
      }
    }
  })

  const { authLoading } = storeToRefs(authStore)

  const schema = yup.object({
    email: yup
      .string()
      .required(t('notifications_enter_email_address'))
      .email(t('web_this_email_address_isn_t_correct')),
    password: yup
      .string()
      .required(t('notifications_enter_password'))
      .min(6, t('notifications_strong_passwords_have_at_least_6_characters'))
  })

  const { handleSubmit } = useForm({
    validationSchema: schema
  })

  const { value: email, errorMessage: emailError } = useField<string>('email')
  const { value: password, errorMessage: passwordError } = useField<string>('password')

  const signIn = handleSubmit(async (values) => {
    authStore.authLoading = true
    try {
      const auth = getAuth()
      const result = await signInWithEmailAndPassword(auth, values.email, values.password)
      if (result && result.user) {
        await handleSuccessAuth()
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        if (
          ['auth/user-not-found', 'auth/invalid-credential', 'auth/invalid-email', 'auth/invalid-password'].includes(
            error.code
          )
        ) {
          toast.add({
            id: 'no_match_email_psw_validation',
            text: t('notifications_email_address_and_password_don_t_match')
          })
          return
        }
        if (error.code === 'auth/too-many-requests') {
          modalStore.setNotification(true, {
            title: t('notifications_access_disabled'),
            text: t(
              'notifications_access_to_your_account_has_been_temporary_disabled_due_to_many_failed_login_attempts_restore_your_password_or_try_again_later'
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

  onMounted(() => {
    if (isWlHelperUrl() && route.query?.email) {
      email.value = route.query.email.toString()
    }
  })
</script>

<template>
  <form @submit.prevent="signIn" class="tn:mt-10 tn:flex tn:flex-col tn:gap-4">
    <Input v-model="email" :placeholder="$t('web_email_address')" :error-message="emailError" type="email" />
    <Input v-model="password" :placeholder="$t('web_password')" :error-message="passwordError" type="password" />
    <div class="tn:my-1 tn:flex tn:justify-end">
      <router-link
        :to="forgotPasswordHref"
        class="tn:text-tn-black-300 tn:hover:text-primary-900 tn:tracking-tightest tn:text-[0.8125rem] tn:opacity-80"
      >
        {{ $t('web_forgot_password') }}
      </router-link>
    </div>
    <Button type="submit" fill :loading="authLoading">{{ $t('web_login') }}</Button>
  </form>
</template>
