<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useActivation } from '@/composables/api/useActivation'
  import { useActivationHelper } from '@/composables/useActivationHelper'
  import { useOrderListHeight } from '@/composables/useOrderListHeight'
  import { useWindowWidth } from '@/composables/useWindowWidth'
  import { useOrderStore } from '@/stores/order'
  import config from '@/config'
  import Header from '@/components/Order/Number/Header.vue'
  import RefreshIcon from '@/assets/images/icons/refresh.svg'
  import Activation from '@/components/Activation/Index.vue'
  import OrderSkeleton from '@/components/Shared/Skeletons/OrderSkeleton.vue'
  import CopyNumberModal from '@/components/Modals/Activation/CopyNumber.vue'
  import RetryNumberModal from '@/components/Modals/Activation/RetryNumber.vue'
  import FinalizeNumberModal from '@/components/Modals/Activation/FinalizeNumber.vue'
  import CancelNumberModal from '@/components/Modals/Activation/CancelNumber/Index.vue'
  import ReportHowItWorksModal from '@/components/Modals/Activation/Report/HowItWorks.vue'
  import ReportDetailsModal from '@/components/Modals/Activation/Report/Details/Index.vue'
  import ReportIssueModal from '@/components/Modals/Activation/Report/Issue/Index.vue'
  import ReportCreationDeadlinePassedModal from '@/components/Modals/Activation/Report/CreationDeadlinePassed.vue'

  const { getActiveActivations } = useActivation()
  const { activateActivationsRefreshTimeout } = useActivationHelper()
  const { height } = useOrderListHeight()
  const { windowWidth, lgBreakpoint } = useWindowWidth()
  const orderStore = useOrderStore()

  const { activeNumbersLoading, activeNumbers, orderPrice, servicesMap } = storeToRefs(orderStore)
  const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

  const loadActiveNumbers = async (showLoading: boolean = true) => {
    await getActiveActivations(showLoading)
    if (!activeNumbers.value) {
      clearTimeout(Number(timeoutId.value))
      return
    }
    startPolling()
  }

  const startPolling = () => {
    const timeout = activateActivationsRefreshTimeout(activeNumbers.value)
    clearTimeout(Number(timeoutId.value))
    timeoutId.value = setTimeout(async () => {
      await loadActiveNumbers(false)
    }, timeout)
  }

  const refreshActivations = async () => {
    await loadActiveNumbers()
  }

  const reloadActiveNumbers = async () => {
    await loadActiveNumbers(false)
  }

  onMounted(() => {
    loadActiveNumbers()
  })

  onUnmounted(() => {
    clearTimeout(Number(timeoutId.value))
  })

  defineExpose({ loadActiveNumbers })
</script>

<template>
  <Transition name="fade" mode="out-in">
    <OrderSkeleton
      v-if="
        activeNumbersLoading === null ||
        servicesMap.size === 0 ||
        ((!activeNumbers || activeNumbers.length === 0) && !orderPrice)
      "
    />
    <div v-else class="tn:mx-auto">
      <Header class="tn:hidden tn:lg:mx-6 tn:lg:flex">
        <h3>{{ $t('web_active_numbers') }}</h3>
        <RefreshIcon
          @click="refreshActivations"
          :class="[
            'tn:h-6 tn:w-6 tn:cursor-pointer',
            activeNumbersLoading && 'tn:animate-spin',
            config.wlWidgetMode ? 'tn:text-tn-black-900' : 'tn:text-[#5F6368]'
          ]"
        />
      </Header>
      <div
        :style="windowWidth >= lgBreakpoint && { height: height - 24 + 'px' }"
        class="scrollbar-thin tn:overflow-y-auto tn:ltr:lg:pr-4 tn:ltr:lg:pl-6 tn:rtl:lg:pr-6 tn:rtl:lg:pl-4"
      >
        <div class="tn:flex tn:flex-col tn:gap-4 tn:lg:gap-6">
          <Activation
            v-for="activation of activeNumbers"
            :activation="activation"
            :key="activation.activation_id"
            @updateActiveNumber="loadActiveNumbers"
          />
        </div>
      </div>
    </div>
  </Transition>
  <CopyNumberModal />
  <RetryNumberModal />
  <FinalizeNumberModal />
  <CancelNumberModal />
  <ReportHowItWorksModal />
  <ReportDetailsModal />
  <ReportCreationDeadlinePassedModal />
  <ReportIssueModal @reloadNumbers="reloadActiveNumbers" />
</template>

<style scoped>
  @import '@/assets/css/transitions/fade.css';

  @media (min-width: 1024px) {
    .scrollbar-thin {
      scrollbar-gutter: stable;
    }
  }
</style>
