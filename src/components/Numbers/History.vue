<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { useActivation } from '@/composables/api/useActivation'
  import { useOrderStore } from '@/stores/order'
  import { useCatalog } from '@/composables/api/useCatalog'
  import type { IActivation } from '@/types/api/activation'
  import OrderSkeleton from '@/components/Shared/Skeletons/OrderSkeleton.vue'
  import Activation from '@/components/Activation/Index.vue'
  import Pagination from '@/components/Shared/Pagination.vue'
  import CopyNumberMessageModal from '@/components/Modals/Activation/CopyNumberMessage.vue'
  import CopyNumberModal from '@/components/Modals/Activation/CopyNumber.vue'
  import ReportHowItWorksModal from '@/components/Modals/Activation/Report/HowItWorks.vue'
  import ReportDetailsModal from '@/components/Modals/Activation/Report/Details/Index.vue'
  import ReportCreationDeadlinePassedModal from '@/components/Modals/Activation/Report/CreationDeadlinePassed.vue'
  import ReportIssueModal from '@/components/Modals/Activation/Report/Issue/Index.vue'
  import EmptyScreen from '@/components/Numbers/EmptyScreen.vue'

  const route = useRoute()
  const { getActivationsHistory } = useActivation()
  const { getServices, getCountries } = useCatalog()
  const orderStore = useOrderStore()

  const loading = ref(true)
  const page = ref(1)
  const pages = ref(1)
  const activations = ref<IActivation[]>([])
  const { servicesMap, countriesMap } = storeToRefs(orderStore)

  const loadHistory = async (withLoading: boolean = true) => {
    if (withLoading) loading.value = true
    const historyData = await getActivationsHistory(page.value)
    loading.value = false
    if (historyData) {
      activations.value = historyData.activations
      pages.value = historyData.pages
    }
  }

  const openPage = (newPage: number) => {
    page.value = newPage
    loadHistory()
  }

  const reloadHistory = async () => {
    await loadHistory(false)
  }

  onMounted(() => {
    page.value = Number(route.query.page) || 1
    if (servicesMap.value.size === 0) getServices()
    if (countriesMap.value.size === 0) getCountries()
    loadHistory()
  })
</script>

<template>
  <Transition name="fade" mode="out-in">
    <OrderSkeleton v-if="loading || servicesMap.size === 0" :with-padding="false" :show-top-block="false" />
    <div v-else class="tn:mx-auto">
      <EmptyScreen v-if="activations.length === 0" />
      <div v-else>
        <div class="tn:flex tn:flex-col tn:gap-4">
          <Activation
            v-for="activation of activations"
            :activation="activation"
            :key="activation.activation_id"
            :show-warning="false"
          />
        </div>
        <Pagination :current-page="page" :total-pages="pages" @pageChange="openPage" />
      </div>
    </div>
  </Transition>
  <CopyNumberModal />
  <CopyNumberMessageModal />
  <ReportHowItWorksModal />
  <ReportDetailsModal />
  <ReportCreationDeadlinePassedModal />
  <ReportIssueModal @reloadNumbers="reloadHistory" />
</template>

<style scoped>
  @import '@/assets/css/transitions/fade.css';
</style>
