<script lang="ts" setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import AccountIcon from '@/assets/images/icons/account.svg'
  import SignInIcon from '@/assets/images/icons/sign-in.svg'

  const emit = defineEmits(['closeSidebar', 'showAccountMode'])

  const { wlHelperAuthUrl } = useWlHelper()
  const authStore = useAuthStore()

  const { isAuthenticated } = storeToRefs(authStore)
  const unauthedComponent = computed(() => (isAuthenticated.value ? null : config.wlWidgetMode ? 'a' : 'router-link'))
</script>

<template>
  <div class="tn:border-tn-black-100 tn:border-t tn:pt-6 tn:text-lg">
    <button
      v-if="isAuthenticated"
      data-testid="layout-sidebar-account"
      @click.prevent="emit('showAccountMode')"
      class="tn:hover:text-primary-900 tn:flex tn:w-full tn:items-center tn:gap-2.5"
    >
      <AccountIcon class="tn:text-primary-900" />
      <span>{{ $t('web_menu_item_account') }}</span>
    </button>
    <component
      v-else
      data-testid="layout-sidebar-login-signup"
      :is="unauthedComponent"
      :href="unauthedComponent === 'a' ? wlHelperAuthUrl : undefined"
      :to="unauthedComponent === 'router-link' ? { name: 'CreateAccount' } : undefined"
      @click="unauthedComponent === 'router-link' ? emit('closeSidebar') : undefined"
      class="tn:hover:text-primary-900 tn:flex tn:cursor-pointer tn:items-center tn:gap-2.5"
    >
      <SignInIcon class="tn:rtl:rotate-180" />
      <span>{{ $t('web_menu_item_login_sign_up') }}</span>
    </component>
  </div>
</template>
