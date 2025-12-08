<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import { useDevice } from '@/composables/useDevice'
  import { useOrderStore } from '@/stores/order'
  import config from '@/config'
  import LogoIcon from '@/assets/images/logo/logo.svg'

  const route = useRoute()
  const router = useRouter()
  const { getWlScriptDataParams } = useWlHelper()
  const { isMobile } = useDevice()

  const orderStore = useOrderStore()

  let wlScriptDataParams: Record<string, string> = {}
  if (config.wlWidgetMode) {
    wlScriptDataParams = getWlScriptDataParams()
  }

  const handleClick = async () => {
    if (route.query.continue_url && route.name === 'Funds') {
      return
    }

    if (isMobile.value) {
      orderStore.oneBlockOrder = true
    }

    await router.push({ name: 'Home' })
  }
</script>

<template>
  <div
    @click="handleClick"
    class="tn:flex tn:cursor-pointer tn:items-center tn:gap-2 tn:py-1.25 tn:lg:py-2 tn:ltr:mr-2 tn:rtl:mr-2"
  >
    <img
      v-if="config.wlWidgetMode && wlScriptDataParams?.logo"
      :src="wlScriptDataParams?.logo"
      width="40px"
      height="40px"
      alt="logo"
    />
    <LogoIcon v-else class="tn:h-8 tn:w-8 tn:sm:h-10 tn:sm:w-10" />
    <div class="tn:text-tn-black-900 tn:text-lg tn:leading-4 tn:font-medium tn:sm:text-2xl">
      <span v-if="config.wlWidgetMode && wlScriptDataParams?.name">{{ wlScriptDataParams.name }}</span>
      <span v-else>Temp Number</span>
    </div>
  </div>
</template>
