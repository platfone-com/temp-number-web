<script lang="ts" setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useUserStore } from '@/stores/user'
  import { useOrderStore } from '@/stores/order'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import config from '@/config'

  import ServicesIcon from '@/assets/images/icons/menu/services.svg'
  import NumbersIcon from '@/assets/images/icons/menu/numbers.svg'
  import FundsIcon from '@/assets/images/icons/menu/funds.svg'
  import TransactionsWlIcon from '@/assets/images/icons/menu/transactions-wl.svg'
  import HelpIcon from '@/assets/images/icons/menu/help.svg'
  import NotificationIcon from '@/assets/images/icons/menu/notification.svg'

  const emit = defineEmits(['closeSidebar', 'openNotificationsMode'])

  const { wlHelperFundsUrl } = useWlHelper()

  const { isAuthenticated } = storeToRefs(useAuthStore())
  const { activeNumbers } = storeToRefs(useOrderStore())
  const { totalBalance } = storeToRefs(useUserStore())

  const activeNumbersCount = computed(() => (activeNumbers.value && activeNumbers.value.length) || 0)

  const cdnUrl = import.meta.env.VITE_CDN_BASE_URL
  const linkClasses = 'tn:tracking-tightest tn:hover:text-primary-900 tn:flex tn:text-xl tn:min-h-11 tn:cursor-pointer'

  const newOrder = () => {
    emit('closeSidebar')
  }

  const handleFundsClick = () => {
    emit('closeSidebar')
    if (config.wlWidgetMode && window.emitTnWidgetEvent) {
      window.emitTnWidgetEvent('tn:addFundsStarted')
    }
  }
</script>

<template>
  <nav>
    <div class="tn:tracking-tightest tn:text-2xl tn:leading-8 tn:font-semibold">
      {{ $t('web_menu_title') }}
    </div>
    <ul class="tn:my-6 tn:flex tn:flex-col tn:gap-2 tn:sm:gap-4">
      <li>
        <router-link @click="newOrder" :to="{ name: 'Home' }" :class="linkClasses">
          <div class="tn:flex tn:items-center tn:gap-4.5">
            <ServicesIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
            <span>{{ $t('web_menu_item_services') }}</span>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          data-testid="layout-menu-numbers"
          @click="emit('closeSidebar')"
          :to="{ name: 'Numbers' }"
          :class="linkClasses"
        >
          <div class="tn:flex tn:w-full tn:items-center tn:justify-between">
            <div class="tn:flex tn:items-center tn:gap-4.5">
              <NumbersIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
              <span>{{ $t('web_menu_item_numbers') }}</span>
            </div>
            <div
              v-if="isAuthenticated && activeNumbersCount"
              class="tn:bg-primary-900 tn:flex tn:h-5 tn:w-5 tn:items-center tn:justify-center tn:rounded-full tn:text-xs tn:!text-white"
            >
              {{ activeNumbersCount }}
            </div>
          </div>
        </router-link>
      </li>
      <li>
        <component
          data-testid="layout-menu-funds"
          :is="config.wlWidgetMode ? 'a' : 'router-link'"
          :href="config.wlWidgetMode ? wlHelperFundsUrl : undefined"
          :to="!config.wlWidgetMode ? { name: 'Funds' } : undefined"
          :class="linkClasses"
          @click="handleFundsClick"
        >
          <div class="tn:flex tn:w-full tn:items-center tn:justify-between">
            <div class="tn:flex tn:items-center tn:gap-4.5">
              <FundsIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
              <span>{{ $t('web_menu_item_funds') }}</span>
            </div>
            <div
              v-if="isAuthenticated && totalBalance !== null"
              class="tn:bg-tn-black-50 tn:!text-tn-black-900 tn:tracking-tightest tn:flex tn:items-center tn:justify-center tn:gap-2 tn:rounded-lg tn:px-3.5 tn:py-1.5"
            >
              <img :src="`${cdnUrl}/images/money-bag.png`" alt="Balance Icon" class="tn:h-4 tn:w-4 tn:min-w-4" />
              <div class="tn:text-base">${{ totalBalance / 100 }}</div>
            </div>
          </div>
        </component>
      </li>
      <li v-if="config.wlWidgetMode">
        <router-link
          data-testid="layout-menu-transactions"
          @click="$emit('closeSidebar')"
          :to="{ name: 'Transactions' }"
          :class="linkClasses"
        >
          <div class="tn:flex tn:w-full tn:items-center tn:justify-between">
            <div class="tn:flex tn:items-center tn:gap-4.5">
              <TransactionsWlIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
              <span>{{ $t('web_transactions_menu_item_wl') }}</span>
            </div>
          </div>
        </router-link>
      </li>
      <li>
        <router-link @click="$emit('closeSidebar')" :to="{ name: 'Help' }" :class="linkClasses">
          <div class="tn:flex tn:w-full tn:items-center tn:justify-between">
            <div class="tn:flex tn:items-center tn:gap-4.5">
              <HelpIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
              <span>{{ $t('web_menu_item_help') }}</span>
            </div>
          </div>
        </router-link>
      </li>
      <li v-if="isAuthenticated && !config.wlWidgetMode">
        <div @click="$emit('openNotificationsMode')" :class="linkClasses">
          <div class="tn:flex tn:w-full tn:items-center tn:justify-between">
            <div class="tn:flex tn:items-center tn:gap-4.5">
              <NotificationIcon class="tn:text-primary-900 tn:h-6 tn:w-6" />
              <span>{{ $t('web_menu_item_notifications') }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </nav>
</template>
