<script lang="ts" setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { parseTranslation, type Segment } from '@/utils/translate'

  import Header from '@/components/Auth/Shared/Header.vue'
  import SubHeader from '@/components/Auth/Shared/SubHeader.vue'
  import FooterText from '@/components/Auth/Shared/FooterText.vue'
  import TranslationText from '@/components/Shared/TranslationText.vue'
  import SignUpForm from '@/components/Auth/EmailSignUp/Form.vue'

  const { t } = useI18n()

  const subHeaderTextSegments = computed<Segment[]>(() => {
    return parseTranslation(t('web_by_signing_up_you_agree_to_our_terms_of_service'), [{ name: 'Terms' }])
  })
  const footerTextSegments = computed<Segment[]>(() => {
    return parseTranslation(t('web_already_have_an_account_login'), [{ name: 'SignIn' }])
  })
</script>

<template>
  <Header :text="$t('web_sign_up')" />
  <SubHeader>
    <TranslationText :segments="subHeaderTextSegments" link-font-weight="tn:font-base" />
  </SubHeader>

  <SignUpForm />

  <FooterText data-testid="auth-signup-footer">
    <TranslationText :segments="footerTextSegments" />
  </FooterText>
</template>
