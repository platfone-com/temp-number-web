<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import type { RouteLocationRaw } from 'vue-router'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { getAuth, confirmPasswordReset } from 'firebase/auth'
  import { useAuthStore } from '@/stores/auth'
  import { useToastStore } from '@/stores/toast'
  import { useModalStore } from '@/stores/modal'
  import { useHelper } from '@/composables/useHelper'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { parseTranslation } from '@/utils/translate'
  import type { FirebaseError } from '@/types/error'

  import Input from '@/components/Shared/Input.vue'
  import Button from '@/components/Shared/Button.vue'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToastStore()
  const modalStore = useModalStore()
  const authStore = useAuthStore()
  const { showSomethingWrongModal } = useHelper()
  const { isWlHelperUrl } = useWlHelper()

  const { authLoading } = storeToRefs(authStore)
  const continueUrl = ref('')
  const code = ref('')

  onMounted(() => {
    if (route.query.mode && route.query.oobCode && route.query.mode === 'resetPassword') {
      code.value = route.query.oobCode.toString()
      continueUrl.value = route.query.continueUrl?.toString() || ''
    }
  })

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

  const { handleSubmit, resetForm } = useForm({
    validationSchema: schema
  })

  const { value: password, errorMessage: passwordError } = useField<string>('password')
  const { value: repeatPassword, errorMessage: repeatPasswordError } = useField<string>('repeatPassword')

  const setNewPassword = handleSubmit(async (values) => {
    authStore.authLoading = true
    try {
      const auth = getAuth()
      await confirmPasswordReset(auth, code.value, values.password)
      resetForm()
      if (continueUrl.value) {
        location.href = continueUrl.value
      } else {
        let buttonRoute: RouteLocationRaw = { name: 'SignIn' }
        if (isWlHelperUrl()) {
          const query = { ...route.query }
          delete query.oobCode
          delete query.mode
          await router.replace({ query })
          buttonRoute = { name: 'WLSignIn', query }
        }
        modalStore.setNotification(true, {
          title: t('notifications_password_changed'),
          text: parseTranslation(t('notifications_please_login_now_with_the_new_password')),
          buttonText: t('web_login'),
          buttonRoute
        })
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        let alert = ''
        switch (error.code) {
          case 'auth/expired-action-code':
            alert = t('notifications_the_password_reset_code_has_been_expired_try_reset_password_again')
            break
          case 'auth/invalid-action-code':
          case 'auth/user-not-found':
            alert = t('notifications_the_password_reset_code_is_invalid_try_reset_password_again')
            break
          case 'auth/weak-password':
            alert = t('notifications_new_password_should_have_at_least_6_characters')
            break
        }

        if (alert) {
          toast.add({
            id: 'set_new_password_error',
            text: alert,
            timeout: 4000
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
  <form @submit.prevent="setNewPassword" class="tn:mt-10 tn:flex tn:flex-col tn:gap-4">
    <Input v-model="password" :placeholder="$t('web_new_password')" :error-message="passwordError" type="password" />
    <Input
      v-model="repeatPassword"
      :placeholder="$t('web_confirm_new_password')"
      :error-message="repeatPasswordError"
      type="password"
    />
    <Button type="submit" fill :loading="authLoading">{{ $t('web_set_new_password') }}</Button>
  </form>
</template>
