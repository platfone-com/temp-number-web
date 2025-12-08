<script lang="ts" setup>
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { useI18n } from 'vue-i18n'
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
  const { sendCustomizedPasswordResetEmail } = useAuth()

  const { authLoading } = storeToRefs(authStore)

  const schema = yup.object({
    email: yup
      .string()
      .required(t('notifications_enter_email_address'))
      .email(t('web_this_email_address_isn_t_correct'))
  })

  const { handleSubmit, resetForm } = useForm({
    validationSchema: schema
  })

  const { value: email, errorMessage: emailError } = useField<string>('email')

  const resetPassword = handleSubmit(async (values) => {
    authStore.authLoading = true
    try {
      await sendCustomizedPasswordResetEmail(values.email)
      resetForm()
      toast.add({
        id: 'check_link_psw_reset_notification',
        text: t('notifications_open_your_email_and_follow_the_link'),
        type: 'success'
      })
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        if (error.code === 'auth/user-not-found') {
          toast.add({
            id: 'email_user_not_found_notification',
            text: t('notifications_no_user_found_for_this_email')
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
  <form @submit.prevent="resetPassword" class="tn:mt-10 tn:flex tn:flex-col tn:gap-4">
    <Input v-model="email" :placeholder="$t('web_email_address')" :error-message="emailError" type="email" />
    <Button type="submit" fill :loading="authLoading">{{ $t('web_reset_password') }}</Button>
  </form>
</template>
