<script lang="ts" setup>
  import LogoutButton from '@/components/Layout/Sidebar/Account/LogoutButton.vue'
  import UserInfo from '@/components/Layout/Sidebar/Account/UserInfo.vue'
  import Menu from '@/components/Layout/Sidebar/Account/Menu.vue'
  import BackButton from '@/components/Shared/BackButton.vue'

  defineEmits(['hideAccountMode', 'closeSidebar'])
</script>

<template>
  <div>
    <BackButton @click="$emit('hideAccountMode')" />

    <nav>
      <div class="tn:tracking-tightest tn:mb-6 tn:text-2xl tn:leading-8 tn:font-semibold">
        {{ $t('web_menu_item_account') }}
      </div>

      <UserInfo />

      <Menu @close-sidebar="$emit('closeSidebar')" />
    </nav>
  </div>

  <LogoutButton @closeSidebar="$emit('closeSidebar')" />
</template>
