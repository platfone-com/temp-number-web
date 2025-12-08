<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useAuth } from '@/composables/useAuth'

  import Header from '@/components/Auth/Shared/Header.vue'
  import SubHeader from '@/components/Auth/Shared/SubHeader.vue'
  import ChangeEmailForm from '@/components/Auth/ChangeEmail/Form.vue'

  const route = useRoute()
  const { isWlHelperUrl } = useWlHelper()
  const { logout } = useAuth()

  onMounted(async () => {
    if (isWlHelperUrl() && route.query?.emailVerified === 'true') {
      const query = { ...route.query }
      delete query.emailVerified
      await logout('WLSignIn', false, query)
    }
  })
</script>

<template>
  <Header :text="$t('web_change_email')" />
  <SubHeader>{{ $t('web_enter_your_new_email_address') }}</SubHeader>

  <ChangeEmailForm />
</template>
