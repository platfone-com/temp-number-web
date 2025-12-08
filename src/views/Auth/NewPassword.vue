<script lang="ts" setup>
  import Header from '@/components/Auth/Shared/Header.vue'
  import SubHeader from '@/components/Auth/Shared/SubHeader.vue'
  import NewPasswordForm from '@/components/Auth/NewPassword/Form.vue'
</script>

<template>
  <Header :text="$t('web_set_new_password')" />
  <SubHeader>{{ $t('web_please_enter_new_password') }}</SubHeader>

  <NewPasswordForm />
</template>
