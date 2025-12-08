<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useOrderStore } from '@/stores/order'
  import { useAuthStore } from '@/stores/auth'
  import { useAppStore } from '@/stores/app'
  import { useActivation } from '@/composables/api/useActivation'
  import config from '@/config'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import ServicesIcon from '@/assets/images/icons/mobile_menu/services.svg'
  import NumbersIcon from '@/assets/images/icons/mobile_menu/numbers.svg'
  import FundsIcon from '@/assets/images/icons/mobile_menu/funds.svg'

  const btnClasses =
    'tn:flex tn:items-center tn:justify-center tn:gap-0.5 tn:h-12 tn:rounded-full tn:font-medium tn:text-[0.8125rem] tn:px-3'
  const btnActiveClasses = 'tn:bg-primary-900 tn:text-white'

  const route = useRoute()
  const router = useRouter()
  const orderStore = useOrderStore()
  const appStore = useAppStore()
  const { getActiveActivations } = useActivation()
  const { wlHelperFundsUrl } = useWlHelper()

  const { oneBlockOrder, activeNumbers, activeNumbersLoading, selectedService, selectedCountry, catalogBlock } =
    storeToRefs(orderStore)
  const { showMobileMenu } = storeToRefs(appStore)
  const { isAuthenticated } = storeToRefs(useAuthStore())
  const isActiveServices = computed(() => {
    return route.name === 'Home' && oneBlockOrder.value
  })
  const isActiveNumbers = computed(() => {
    return (
      route.name === 'Numbers' ||
      route.name === 'History' ||
      (route.name === 'Home' && !oneBlockOrder.value && !activeNumbersLoading.value)
    )
  })
  const isActiveFunds = computed(() => {
    return route.name === 'Funds' || route.name === 'Transactions'
  })

  const openServices = async () => {
    orderStore.oneBlockOrder = true
    await router.push({ name: 'Home' })
  }

  const openNumbers = async () => {
    if (activeNumbers.value && activeNumbers.value.length > 0) {
      orderStore.clearOrder(true)
      getActiveActivations(false)
      await router.push({ name: 'Home' })
    } else {
      await router.push({ name: 'Numbers' })
    }
  }

  watch(
    () => [selectedService.value, selectedCountry.value, catalogBlock.value, oneBlockOrder.value],
    () => {
      appStore.showMobileMenu = true
    }
  )
</script>

<template>
  <transition name="slide-up">
    <div
      v-if="isAuthenticated && showMobileMenu"
      :class="[
        'tn:fixed tn:bottom-0 tn:flex tn:w-full tn:items-center tn:justify-around tn:gap-0.5 tn:lg:hidden',
        'tn:px-6 tn:py-3',
        'tn:bg-tn-bg tn:rounded-t-3xl tn:shadow-[0px_-5px_34px_0px_rgba(227,231,234,0.60)]'
      ]"
    >
      <div @click="openServices" :class="[btnClasses, isActiveServices && btnActiveClasses]">
        <ServicesIcon class="tn:h-6 tn:w-6 tn:fill-current" />
        <span>{{ $t('web_mob_footer_tab_services') }}</span>
      </div>
      <div @click="openNumbers" :class="[btnClasses, isActiveNumbers && btnActiveClasses]">
        <NumbersIcon class="tn:h-6 tn:w-6 tn:fill-current" />
        <span>{{ $t('web_mob_footer_tab_numbers') }}</span>
      </div>
      <component
        :is="config.wlWidgetMode ? 'a' : 'router-link'"
        :href="config.wlWidgetMode ? wlHelperFundsUrl : undefined"
        :to="!config.wlWidgetMode ? { name: 'Funds' } : undefined"
        :class="[btnClasses, isActiveFunds && btnActiveClasses]"
      >
        <FundsIcon class="tn:h-6 tn:w-6 tn:fill-current" />
        <span>{{ $t('web_mob_footer_tab_funds') }}</span>
      </component>
    </div>
  </transition>
</template>

<style scoped>
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  .slide-up-enter-to,
  .slide-up-leave-from {
    transform: translateY(0%);
    opacity: 1;
  }
</style>
