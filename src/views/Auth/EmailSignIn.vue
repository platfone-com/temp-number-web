<script lang="ts" setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { parseTranslation, type Segment } from '@/utils/translate'

  import Header from '@/components/Auth/Shared/Header.vue'
  import SubHeader from '@/components/Auth/Shared/SubHeader.vue'
  import FooterText from '@/components/Auth/Shared/FooterText.vue'
  import TranslationText from '@/components/Shared/TranslationText.vue'
  import SignInForm from '@/components/Auth/EmailSignIn/Form.vue'

  const { t } = useI18n()

  const footerTextSegments = computed<Segment[]>(() => {
    return parseTranslation(t('web_don_t_have_an_account_sign_up'), [{ name: 'SignUp' }])
  })
</script>

<template>
  <Header :text="$t('web_welcome')" />
  <SubHeader>{{ $t('web_please_login_to_continue') }}</SubHeader>

  <SignInForm />

  <FooterText data-testid="auth-signin-footer">
    <TranslationText :segments="footerTextSegments" />
  </FooterText>
</template>
