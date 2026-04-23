<script lang="ts" setup>
  import { ref, inject } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useBalance } from '@/composables/api/useBalance'
  import { useActivation } from '@/composables/api/useActivation'
  import SidebarIcon from '@/assets/images/icons/sidebar.svg'
  import AccountMode from '@/components/Layout/Sidebar/Account/Index.vue'
  import NotificationsMode from '@/components/Layout/Sidebar/Notifications/Index.vue'
  import LocaleSwitcher from '@/components/Layout/Sidebar/LocaleSwitcher.vue'
  import CloseButton from '@/components/Layout/Sidebar/CloseButton.vue'
  import MainMenu from '@/components/Layout/Sidebar/MainMenu.vue'
  import SubMenu from '@/components/Layout/Sidebar/SubMenu.vue'
  import AccountButton from '@/components/Layout/Sidebar/AccountButton.vue'

  const { getBalance } = useBalance()
  const { getActiveActivations } = useActivation()
  const { isAuthenticated } = storeToRefs(useAuthStore())

  const modalTarget = inject<Element | string>('tnModalTarget', 'body')

  const drawerOpen = ref(false)
  const accountMode = ref(false)
  const notificationsMode = ref(false)

  const openDrawer = () => {
    accountMode.value = false
    notificationsMode.value = false
    drawerOpen.value = true
    if (isAuthenticated.value) {
      // Update active activations count and balance
      getActiveActivations()
      getBalance()
    }
  }

  const closeDrawer = () => {
    drawerOpen.value = false
  }
</script>

<template>
  <div>
    <button
      data-testid="layout-sidebar-toggle"
      @click="openDrawer"
      class="tn:flex tn:cursor-pointer tn:items-center tn:py-2.5"
    >
      <SidebarIcon class="tn:text-tn-black-950 tn:h-4 tn:w-6 tn:sm:h-5 tn:sm:w-7.5 tn:rtl:rotate-180" />
    </button>

    <Teleport :to="modalTarget">
      <Transition name="backdrop">
        <div
          v-if="drawerOpen"
          @click="closeDrawer"
          class="tn:fixed tn:inset-0 tn:z-[400000] tn:bg-black/50 tn:backdrop-blur-md"
        />
      </Transition>

      <div
        data-testid="layout-sidebar-drawer"
        :class="[
          'tn:fixed tn:top-0 tn:bottom-0 tn:z-[420000] tn:flex tn:h-full tn:w-81 tn:transform tn:flex-col tn:justify-between tn:sm:w-100 tn:ltr:right-0 tn:rtl:left-0',
          'tn:bg-tn-bg tn:shadow-lg tn:transition-transform tn:duration-300 tn:ease-in-out tn:overflow-y-auto',
          'tn:p-6 tn:sm:p-12.5',
          drawerOpen ? 'tn:translate-x-0' : 'tn:ltr:translate-x-full tn:rtl:-translate-x-full'
        ]"
      >
        <AccountMode v-if="accountMode" @hideAccountMode="accountMode = false" @closeSidebar="closeDrawer" />
        <NotificationsMode
          v-else-if="notificationsMode"
          @hideNotificationsMode="notificationsMode = false"
          @closeSidebar="closeDrawer"
        />
        <template v-else>
          <div>
            <div class="tn:mb-6 tn:flex tn:justify-between tn:sm:mb-8">
              <CloseButton @click="closeDrawer" />
              <LocaleSwitcher @closeSidebar="closeDrawer" />
            </div>

            <MainMenu @closeSidebar="closeDrawer" @openNotificationsMode="notificationsMode = true" />
          </div>

          <div>
            <SubMenu @closeSidebar="closeDrawer" />
            <AccountButton @showAccountMode="accountMode = true" @closeSidebar="closeDrawer" />
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
  @import '@/assets/css/transitions/backdrop.css';
</style>
