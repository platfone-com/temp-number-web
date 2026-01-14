<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useUserStore } from '@/stores/user'
  import { useBalance } from '@/composables/api/useBalance'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import config from '@/config'
  import ReservedIcon from '@/assets/images/icons/reserved.svg'

  const authStore = useAuthStore()
  const userStore = useUserStore()
  const { restartCheckBalance } = useBalance()
  const { wlHelperFundsUrl } = useWlHelper()

  const { isAuthenticated } = storeToRefs(authStore)
  const { totalBalance, reservedBalance } = storeToRefs(userStore)

  const cdnUrl = import.meta.env.VITE_CDN_BASE_URL
  const linkClass = [
    'tn:flex tn:h-10.5 tn:min-w-20 tn:items-center tn:justify-center tn:gap-2 tn:sm:h-12 tn:sm:gap-3',
    'tn:bg-tn-black-50   tn:rounded-lg tn:px-2 tn:py-3 tn:sm:px-3 tn:sm:py-2',
    'tn:tracking-tightest tn:text-sm tn:font-medium tn:sm:text-base',
    'tn:cursor-pointer'
  ]

  const handleFundsClick = () => {
    if (config.wlWidgetMode && window.emitTnWidgetEvent) {
      window.emitTnWidgetEvent('tn:addFundsStarted')
    }
  }

  onMounted(() => {
    if (isAuthenticated.value) {
      restartCheckBalance()
    }
  })
</script>

<template>
  <div v-if="isAuthenticated && totalBalance !== null">
    <component
      :is="config.wlWidgetMode ? 'a' : 'router-link'"
      :href="config.wlWidgetMode ? wlHelperFundsUrl : undefined"
      :to="!config.wlWidgetMode ? { name: 'Funds' } : undefined"
      :class="linkClass"
      @click="handleFundsClick"
    >
      <div v-if="!totalBalance && !reservedBalance" class="tn:flex tn:items-center tn:gap-2">
        <img :src="`${cdnUrl}/images/money-bag.png`" alt="Balance Icon" class="tn:hidden tn:h-5 tn:w-5 tn:sm:block" />
        <span class="tn:text-tn-black-900 tn:sm:text-primary-900">
          {{ $t('web_add_funds_button_on_desktop') }}
        </span>
      </div>
      <template v-else>
        <div class="tn:flex tn:items-center tn:gap-2">
          <img :src="`${cdnUrl}/images/money-bag.png`" alt="Balance Icon" class="tn:hidden tn:h-5 tn:w-5 tn:sm:block" />
          <span>${{ totalBalance / 100 }}</span>
        </div>
        <div v-if="reservedBalance" class="tn:flex tn:items-center tn:gap-0 tn:sm:gap-1.5">
          <ReservedIcon class="tn:h-5 tn:w-5 tn:sm:h-5.5 tn:sm:w-5.5" />
          <span>${{ reservedBalance / 100 }}</span>
        </div>
      </template>
    </component>
  </div>
</template>
