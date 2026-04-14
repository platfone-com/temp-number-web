<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useAuth } from '@/composables/useAuth'
  import { useForceOrder } from '@/composables/useForceOrder'

  import SignOutIcon from '@/assets/images/icons/sign-out.svg'

  const emit = defineEmits(['closeSidebar'])

  const authStore = useAuthStore()
  const { logout } = useAuth()
  const { removeForceOrderData } = useForceOrder()

  const { isAuthenticated } = storeToRefs(authStore)

  const signOut = async () => {
    await logout()
    removeForceOrderData()
    emit('closeSidebar')
  }
</script>

<template>
  <div class="tn:border-tn-black-100 tn:border-t tn:pt-6 tn:text-lg">
    <button
      v-if="isAuthenticated"
      data-testid="layout-sidebar-logout"
      @click.prevent="signOut"
      class="tn:hover:text-primary-900 tn:flex tn:w-full tn:items-center tn:gap-2.5"
    >
      <SignOutIcon class="tn:rtl:rotate-180" />
      <span>{{ $t('web_menu_item_logout') }}</span>
    </button>
  </div>
</template>
