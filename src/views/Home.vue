<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useCatalog } from '@/composables/api/useCatalog'
  import { useForceOrder } from '@/composables/useForceOrder'
  import { useForceOrderHandler } from '@/composables/useForceOrderHandler'
  import { useFavorites } from '@/composables/useFavorites'
  import { useOrderStore } from '@/stores/order'
  import { useAuthStore } from '@/stores/auth'
  import { CatalogBlock } from '@/types/stores/order'
  import Service from '@/components/Order/Service.vue'
  import Country from '@/components/Order/Country.vue'
  import Numbers from '@/components/Order/Numbers.vue'
  import PaymentInReviewModal from '@/components/Modals/Funds/PaymentInReview.vue'

  const route = useRoute()
  const { setUserCountryToFavorites } = useFavorites()
  const { getServices, getCountries } = useCatalog()
  const { handleForceOrder } = useForceOrderHandler()
  const { isForceOrderData } = useForceOrder()

  const orderStore = useOrderStore()

  const { isAuthenticated } = storeToRefs(useAuthStore())
  const { catalogBlock, servicesCatalog, countriesCatalog, popularServicesCatalog, orderPrice, oneBlockOrder } =
    storeToRefs(orderStore)

  const syncCatalogBlockWithQueryParams = () => {
    const { service, country } = route.query

    if (catalogBlock?.value === CatalogBlock.SERVICE && country && !service) {
      orderStore.changeCatalogBlock(false)
    }

    if (catalogBlock?.value === CatalogBlock.COUNTRY && service && !country) {
      orderStore.changeCatalogBlock(false)
    }
  }

  const initHomePageData = async () => {
    if (isAuthenticated.value) await setUserCountryToFavorites()

    if (!servicesCatalog.value.length || !popularServicesCatalog.value.length) {
      await getServices(true)
    }
    if (!countriesCatalog.value.length) {
      await getCountries()
    }
    if (isForceOrderData()) await handleForceOrder()
  }

  onMounted(() => {
    syncCatalogBlockWithQueryParams()
    initHomePageData()
  })
</script>

<template>
  <div
    data-testid="home-catalog-page"
    :class="['tn:flex tn:lg:gap-3 tn:lg:pb-0', orderPrice || !oneBlockOrder ? 'tn:pb-22' : 'tn:pb-0']"
  >
    <Service v-if="catalogBlock === CatalogBlock.SERVICE" />
    <Country v-else />
    <Country v-if="catalogBlock === CatalogBlock.SERVICE" />
    <Service v-else />
    <Numbers />
  </div>
  <PaymentInReviewModal />
</template>
