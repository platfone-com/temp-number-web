<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import * as yup from 'yup'
  import { useField, useForm } from 'vee-validate'
  import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
  import { addBreakLinesToText } from '@/utils/translate'
  import { useModalStore } from '@/stores/modal'
  import { useToastStore } from '@/stores/toast'
  import { useHelper } from '@/composables/useHelper'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'
  import Input from '@/components/Shared/Input.vue'
  import type { FirebaseError } from '@/types/error'

  const emit = defineEmits(['reAuthenticated'])

  const { t } = useI18n()
  const toast = useToastStore()
  const modalStore = useModalStore()
  const { showSomethingWrongModal } = useHelper()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const { confirmPasswordModal } = storeToRefs(modalStore)
  const loading = ref(false)

  const schema = yup.object({
    password: yup
      .string()
      .required(t('notifications_enter_password'))
      .min(6, t('notifications_strong_passwords_have_at_least_6_characters'))
  })

  const { handleSubmit, resetField } = useForm({
    validationSchema: schema
  })

  const { value: password, errorMessage: passwordError } = useField<string>('password')

  watch(confirmPasswordModal, (newVal: boolean) => {
    if (!newVal) resetField('password')
  })

  const reAuthenticate = handleSubmit(async (values) => {
    loading.value = true
    try {
      const auth = getAuth()
      if (!auth.currentUser?.email) return
      const credential = EmailAuthProvider.credential(auth.currentUser.email, values.password)
      await reauthenticateWithCredential(auth.currentUser, credential)
      modalStore.confirmPasswordModal = false
      emit('reAuthenticated')
    } catch (e) {
      resetField('password')
      if (e && typeof e === 'object' && 'code' in e) {
        const error = e as FirebaseError
        if (['auth/invalid-credential', 'auth/invalid-password'].includes(error.code)) {
          toast.add({
            id: 'invalid-login-credentials',
            text: t('notifications_password_is_wrong')
          })
          return
        } else if (error.code === 'auth/too-many-requests') {
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
        }
      }
      modalStore.confirmPasswordModal = false
      showSomethingWrongModal()
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <Modal v-model="confirmPasswordModal" :close-btn="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">{{ $t('web_confirm_password_title') }}</div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{ $t('web_please_confirm_your_current_password') }}
        </div>
      </div>

      <form @submit.prevent="reAuthenticate" class="tn:flex tn:w-full tn:flex-col tn:gap-5">
        <Input v-model="password" :placeholder="$t('web_password')" :error-message="passwordError" type="password" />

        <Button type="submit" fill block :loading="loading">
          {{ $t('web_confirm_password_button_2') }}
        </Button>
      </form>
    </div>
  </Modal>
</template>
