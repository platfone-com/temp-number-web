<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useActivation } from '@/composables/api/useActivation'
  import { useActivationHelper } from '@/composables/useActivationHelper'
  import { useOrderStore } from '@/stores/order'
  import { useCatalog } from '@/composables/api/useCatalog'
  import Activation from '@/components/Activation/Index.vue'
  import OrderSkeleton from '@/components/Shared/Skeletons/OrderSkeleton.vue'
  import CopyNumberModal from '@/components/Modals/Activation/CopyNumber.vue'
  import RetryNumberModal from '@/components/Modals/Activation/RetryNumber.vue'
  import FinalizeNumberModal from '@/components/Modals/Activation/FinalizeNumber.vue'
  import CancelNumberModal from '@/components/Modals/Activation/CancelNumber/Index.vue'
  import ReportHowItWorksModal from '@/components/Modals/Activation/Report/HowItWorks.vue'
  import ReportDetailsModal from '@/components/Modals/Activation/Report/Details/Index.vue'
  import ReportCreationDeadlinePassedModal from '@/components/Modals/Activation/Report/CreationDeadlinePassed.vue'
  import ReportIssueModal from '@/components/Modals/Activation/Report/Issue/Index.vue'
  import EmptyScreen from '@/components/Numbers/EmptyScreen.vue'

  const { getActiveActivations } = useActivation()
  const { activateActivationsRefreshTimeout } = useActivationHelper()
  const { getServices, getCountries } = useCatalog()
  const orderStore = useOrderStore()

  const { activeNumbersLoading, activeNumbers, servicesMap, countriesMap } = storeToRefs(orderStore)
  const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

  const loadActiveNumbers = async (showLoading: boolean = true) => {
    await getActiveActivations(showLoading)
    startPolling()
  }

  const startPolling = () => {
    const timeout = activateActivationsRefreshTimeout(activeNumbers.value)
    clearTimeout(Number(timeoutId.value))
    timeoutId.value = setTimeout(async () => {
      await loadActiveNumbers(false)
    }, timeout)
  }

  onMounted(() => {
    if (servicesMap.value.size === 0) getServices()
    if (countriesMap.value.size === 0) getCountries()
    loadActiveNumbers()
  })

  onUnmounted(() => {
    clearTimeout(Number(timeoutId.value))
  })
</script>

<template>
  <Transition name="fade" mode="out-in">
    <OrderSkeleton
      v-if="activeNumbersLoading === null || servicesMap.size === 0"
      :with-padding="false"
      :show-top-block="false"
    />
    <div v-else class="tn:mx-auto">
      <EmptyScreen v-if="!activeNumbers || activeNumbers.length === 0" />
      <div v-else class="tn:flex tn:flex-col tn:gap-4">
        <Activation
          v-for="activation of activeNumbers"
          :activation="activation"
          :key="activation.activation_id"
          @updateActiveNumber="loadActiveNumbers"
        />
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
  <ReportIssueModal @reloadNumbers="loadActiveNumbers" />
</template>

<style scoped>
  @import '@/assets/css/transitions/fade.css';
</style>
