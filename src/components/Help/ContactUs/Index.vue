<script lang="ts" setup>
  import { getAuth } from 'firebase/auth'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useUser } from '@/composables/api/useUser'
  import { useRecaptcha } from '@/composables/useRecaptcha'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useWlApiUser } from '@/composables/wl/api/useWlApiUser'
  import { useModalStore } from '@/stores/modal'
  import { addBreakLinesToText } from '@/utils/translate'
  import Info from '@/components/Help/ContactUs/Info.vue'
  import RadioButton from '@/components/Shared/RadioButton.vue'
  import Input from '@/components/Shared/Input.vue'
  import Button from '@/components/Shared/Button.vue'
  import Checkbox from '@/components/Shared/Checkbox.vue'
  import Textarea from '@/components/Shared/Textarea.vue'

  const props = defineProps<{
    customerEmail?: string
  }>()

  const { t } = useI18n()
  const { sendContactUsEmail } = useUser()
  const { loadRecaptchaEnterprise, getRecaptchaToken } = useRecaptcha()
  const { isWlHelperUrl, handleWlActionRedirect } = useWlHelper()
  const { sendWLContactUsEmail } = useWlApiUser()
  const modalStore = useModalStore()

  const reasons = computed(() => [
    {
      id: 'Payments / Refunds',
      text: t('web_form_reason_payments_refunds')
    },
    {
      id: 'Bug Report / Feedback',
      text: t('web_form_reason_bug_report_feedback')
    },
    {
      id: 'Account Suspensions',
      text: t('web_form_reason_account_suspensions')
    },
    {
      id: 'Other',
      text: t('web_form_reason_other')
    }
  ])

  const auth = getAuth()
  const loading = ref(false)
  const selectedReason = ref<string | null>(null)
  const isChecked = ref(false)

  const currentEmail = computed(() => {
    return props.customerEmail || auth.currentUser?.email
  })

  const schema = yup.object({
    email: yup.string().when([], {
      is: () => !currentEmail.value,
      then: (schema) =>
        schema.required(t('notifications_enter_email_address')).email(t('web_this_email_address_isn_t_correct')),
      otherwise: (schema) => schema.optional()
    }),
    message: yup.string().min(20, t('web_validation_text_too_short_min_500_characters'))
  })

  const { handleSubmit, meta, resetForm } = useForm({
    validationSchema: schema
  })

  const { value: email, errorMessage: emailError } = useField<string>('email')
  const { value: message, errorMessage: messageError } = useField<string>('message')

  const clearData = () => {
    selectedReason.value = null
    isChecked.value = false
    resetForm()
  }

  const send = handleSubmit(async (values) => {
    const email = currentEmail.value || values.email
    if (!isChecked.value || !selectedReason.value || !email || !message.value || !meta.value.valid) return
    const fullMessage = message.value
    loading.value = true
    const recaptchaToken = await getRecaptchaToken('contact_us')
    if (isWlHelperUrl()) {
      const isSent = await sendWLContactUsEmail(email, selectedReason.value, fullMessage, recaptchaToken)
      if (isSent) {
        clearData()
        handleWlActionRedirect('contact_us')
      }
    } else {
      const isSent = await sendContactUsEmail(email, selectedReason.value, fullMessage, recaptchaToken)
      if (isSent) {
        modalStore.setNotification(true, {
          title: t('web_title_message_sent'),
          text: addBreakLinesToText(
            t(
              'web_subtitle_we_ll_review_your_request_within_72_hours_please_don_t_send_duplicate_messages_to_avoid_delays'
            )
          ),
          successIcon: true
        })
        clearData()
      }
    }
    loading.value = false
  })

  onMounted(() => {
    loadRecaptchaEnterprise()
  })
</script>

<template>
  <div class="tn:flex tn:flex-col tn:gap-4">
    <Info />

    <form @submit.prevent="send" class="tn:flex tn:flex-col tn:gap-2">
      <RadioButton
        v-for="reason in reasons"
        @click="selectedReason = reason.id"
        :key="reason.id"
        :text="reason.text"
        :is-active="selectedReason === reason.id"
      />

      <Input
        v-if="!currentEmail"
        v-model="email"
        :placeholder="$t('web_email_address')"
        :error-message="emailError"
        type="email"
      />

      <Textarea
        v-model="message"
        :placeholder="$t('web_form_type_your_message_here')"
        :error-message="messageError"
        :center-error="true"
      />

      <div class="tn:my-4">
        <Checkbox
          v-model="isChecked"
          :label="$t('web_form_i_confirm_this_request_is_not_related_to_a_specific_phone_number')"
          id="contact_us_confirm"
        />
      </div>

      <Button
        type="submit"
        fill
        :loading="loading"
        :disabled="loading || !isChecked || !selectedReason || !meta.valid || !message"
      >
        {{ $t('web_form_send_button_cta') }}
      </Button>
    </form>
  </div>
</template>
