<script lang="ts" setup>
  import Header from '@/components/Auth/Shared/Header.vue'
  import SubHeader from '@/components/Auth/Shared/SubHeader.vue'
  import ChangePasswordForm from '@/components/Auth/ChangePassword/Form.vue'
</script>

<template>
  <Header :text="$t('web_change_password')" />
  <SubHeader>{{ $t('web_enter_your_old_and_new_password') }}</SubHeader>

  <ChangePasswordForm />
</template>
