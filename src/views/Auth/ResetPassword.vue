<script lang="ts" setup>
  import Header from '@/components/Auth/Shared/Header.vue'
  import SubHeader from '@/components/Auth/Shared/SubHeader.vue'
  import ResetPasswordForm from '@/components/Auth/ResetPassword/Form.vue'
</script>

<template>
  <Header :text="$t('web_reset_password')" />
  <SubHeader>{{ $t('web_enter_email_address_to_reset_password') }}</SubHeader>

  <ResetPasswordForm />
</template>
