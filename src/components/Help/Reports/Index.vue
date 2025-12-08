<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { useReport } from '@/composables/api/useReport'
  import { useOrderStore } from '@/stores/order'
  import { useCatalog } from '@/composables/api/useCatalog'
  import type { IReport } from '@/types/api/report'
  import OrderSkeleton from '@/components/Shared/Skeletons/OrderSkeleton.vue'
  import Pagination from '@/components/Shared/Pagination.vue'
  import EmptyScreen from '@/components/Help/Reports/EmptyScreen.vue'
  import ReportsData from '@/components/Help/Reports/Data.vue'
  import ReportMoreLink from '@/components/Help/Reports/ReportMoreLink.vue'
  import ReportHowItWorksModal from '@/components/Modals/Activation/Report/HowItWorks.vue'
  import ReportDetailsModal from '@/components/Modals/Activation/Report/Details/Index.vue'
  import ReportCreationDeadlinePassedModal from '@/components/Modals/Activation/Report/CreationDeadlinePassed.vue'

  const route = useRoute()
  const { getReports } = useReport()
  const { getServices, getCountries } = useCatalog()
  const { servicesMap, countriesMap } = storeToRefs(useOrderStore())

  const loading = ref(true)
  const page = ref(1)
  const pages = ref(1)
  const reports = ref<IReport[]>([])

  const loadReports = async () => {
    loading.value = true
    const reportsData = await getReports(page.value)
    loading.value = false
    if (reportsData) {
      reports.value = reportsData.reports
      pages.value = reportsData.pages
    }
  }

  const openPage = (newPage: number) => {
    page.value = newPage
    loadReports()
  }

  onMounted(() => {
    page.value = Number(route.query.page) || 1
    if (servicesMap.value.size === 0) getServices()
    if (countriesMap.value.size === 0) getCountries()
    loadReports()
  })
</script>

<template>
  <Transition name="fade" mode="out-in">
    <OrderSkeleton v-if="loading || servicesMap.size === 0" :with-padding="false" :show-top-block="false" />
    <div v-else class="tn:mx-auto">
      <EmptyScreen v-if="reports.length === 0" />
      <div v-else>
        <div class="tn:flex tn:flex-col tn:gap-4 tn:lg:gap-6">
          <ReportMoreLink />
          <ReportsData :reports="reports" />
        </div>
        <Pagination :current-page="page" :total-pages="pages" @pageChange="openPage" />
      </div>
    </div>
  </Transition>
  <ReportHowItWorksModal />
  <ReportDetailsModal />
  <ReportCreationDeadlinePassedModal />
</template>

<style scoped>
  @import '@/assets/css/transitions/fade.css';
</style>
