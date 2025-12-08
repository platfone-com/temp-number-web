<script lang="ts" setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { addBreakLinesToText, parseTranslation, type Segment } from '@/utils/translate'

  import Header from '@/components/Auth/Shared/Header.vue'
  import SubHeader from '@/components/Auth/Shared/SubHeader.vue'
  import FooterText from '@/components/Auth/Shared/FooterText.vue'
  import TranslationText from '@/components/Shared/TranslationText.vue'
  import Socials from '@/components/Auth/Socials/Index.vue'
  import Button from '@/components/Shared/Button.vue'

  const { t } = useI18n()

  const footerTextSegments = computed<Segment[]>(() => {
    return parseTranslation(t('web_by_signing_up_you_agree_to_our_terms_of_service'), [{ name: 'Terms' }])
  })
</script>

<template>
  <Header :text="$t('web_create_account')" font-class="tn:text-2xl tn:leading-7.5 tn:tracking-tightest" />
  <SubHeader font-class="tn:text-sm tn:leading-6">
    <span v-html="addBreakLinesToText($t('web_it_will_allow_saving_history_and_sync_with_another_device_easily'))" />
  </SubHeader>

  <Socials />

  <Button fill to="SignUp">
    {{ $t('web_continue_with_email') }}
  </Button>

  <FooterText>
    <TranslationText :segments="footerTextSegments" link-font-weight="tn:font-base" />
  </FooterText>
</template>
