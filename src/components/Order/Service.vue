<script lang="ts" setup>
  import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useOrderStore } from '@/stores/order'
  import { useAppStore } from '@/stores/app'
  import { useCatalog } from '@/composables/api/useCatalog'
  import { useForceOrder } from '@/composables/useForceOrder'
  import { useFavorites } from '@/composables/useFavorites'
  import { useRecent } from '@/composables/useRecent'
  import { CatalogBlock } from '@/types/stores/order'
  import type { IFullCountryPriceData, IFullServicePriceData, IServiceData, SortDirection } from '@/types/api/catalog'
  import type { VirtualScrollItem } from '@/types/order'
  import Card from '@/components/Order/Shared/Card.vue'
  import OrderSkeleton from '@/components/Shared/Skeletons/OrderSkeleton.vue'
  import Search from '@/components/Order/Shared/Search.vue'
  import VirtualScroller from '@/components/Order/Shared/VirtualScroller.vue'
  import CardTooltip from '@/components/Order/Shared/CardTooltip.vue'
  import ChangeMainBlockButton from '@/components/Order/Shared/ChangeMainBlockButton.vue'
  import Delimiter from '@/components/Order/Shared/Item/Delimiter.vue'
  import Item from '@/components/Order/Shared/Item/Item.vue'
  import MobileBackButton from '@/components/Order/Shared/MobileBackButton.vue'
  import EmptyItemsScreen from '@/components/Order/Shared/EmptyItemsScreen.vue'

  const route = useRoute()
  const { t, locale } = useI18n()
  const { getServicesPricesByCountry, sortCatalogByPrice, getNewSortDirection } = useCatalog()
  const { isForceOrderData, removeForceOrderData } = useForceOrder()
  const { loadFavorites, saveFavorite, formFavoritesServices } = useFavorites()
  const { loadRecent, formRecentServices } = useRecent()
  const orderStore = useOrderStore()

  const {
    servicesLoading,
    countriesLoading,
    serviceSearchStr,
    catalogBlock,
    selectedCountry,
    servicesCatalog,
    countriesCatalog,
    servicesMap,
    popularServicesCatalog,
    services,
    selectedService,
    oneBlockOrder
  } = storeToRefs(orderStore)
  const { isMobileHeaderHidden, favorites, recent } = storeToRefs(useAppStore())

  const virtualScroller = ref()
  const servicesItems = ref<VirtualScrollItem[]>([])
  const sortDirection = ref<SortDirection>(null)
  const preloadCountriesTimeout = ref<number | null>(null)

  const showServicesOnMobile = computed(() => {
    if (oneBlockOrder.value) {
      return (
        (catalogBlock.value === CatalogBlock.SERVICE && !selectedService.value) ||
        (catalogBlock.value === CatalogBlock.COUNTRY && selectedCountry.value && !selectedService.value)
      )
    }
    return false
  })

  const selectService = (service: IFullServicePriceData) => {
    if (service?.count === 0 || service.prohibited) return
    orderStore.selectedService = service
    orderStore.orderPrice = 0
    orderStore.orderId = ''
    if (service?.price?.suggested) {
      orderStore.orderPrice = service.price.suggested
    }
  }

  const formPopular = (withPrice?: boolean, services?: IFullServicePriceData[]) => {
    let popularServices = []
    const recentSet = new Set(recent.value.services)
    const favoritesSet = new Set(favorites.value.services)
    popularServices = popularServicesCatalog.value.filter((s) => !recentSet.has(s.service_id))
    popularServices = popularServices.filter((s) => !favoritesSet.has(s.service_id))
    if (withPrice && services?.length) {
      const servicesMap = new Map(services.map((s) => [s.service_id, s]))
      popularServices = popularServices
        .map((s) => servicesMap.get(s.service_id))
        .filter(Boolean) as IFullServicePriceData[]
    }

    return popularServices.length > 0
      ? [{ type: 'delimiter', label: t('web_popular_item_title') }, ...popularServices]
      : []
  }

  const formServicesPricesItems = (services: IFullServicePriceData[]) => {
    const recentServices = formRecentServices(recent.value, services)
    const favoritesServices = formFavoritesServices(favorites.value, services)
    const popularServices = formPopular(true, services)
    const emptyPrices = services.every((s) => s.count === 0)
    servicesItems.value = [
      ...recentServices,
      ...favoritesServices,
      ...popularServices,
      { type: 'delimiter', label: t('web_all_services_item_title'), showSort: !emptyPrices },
      ...services
    ]
  }

  const searchServices = () => {
    servicesItems.value = services.value.filter((service: IFullServicePriceData) =>
      service.alt_name?.toLowerCase().includes(serviceSearchStr.value.trim().toLowerCase())
    )
    if (servicesItems.value.length > 0) {
      if ('price' in servicesItems.value[0] && sortDirection.value) {
        servicesItems.value = sortCatalogByPrice(servicesItems.value as IFullServicePriceData[], sortDirection.value)
      }
    } else {
      servicesItems.value = services.value.filter((service: IFullServicePriceData) => service.service_id === 'other')
    }
  }

  const formServicesItems = () => {
    if (servicesLoading.value) return
    if (serviceSearchStr.value) {
      searchServices()
    } else if (services.value.length > 0 && 'price' in services.value[0]) {
      let servicesData = [...services.value] as IFullServicePriceData[]
      if (sortDirection.value) {
        servicesData = sortCatalogByPrice(servicesData, sortDirection.value) as IFullServicePriceData[]
      }
      formServicesPricesItems(servicesData)
    } else if (services.value.length === 0) {
      servicesItems.value = []
    } else {
      const recentServices = formRecentServices(recent.value, servicesCatalog.value)
      const favoritesServices = formFavoritesServices(favorites.value, servicesCatalog.value)
      const popularServicesArr = formPopular()
      servicesItems.value = [
        ...recentServices,
        ...favoritesServices,
        ...popularServicesArr,
        { type: 'delimiter', label: t('web_all_services_item_title') },
        ...servicesCatalog.value
      ]
    }
  }

  const getPricesByCountry = async () => {
    if (!selectedCountry.value) return
    if (!isForceOrderData()) {
      orderStore.selectedService = null
    }
    orderStore.servicesLoading = true
    const servicesPrices = await getServicesPricesByCountry(selectedCountry.value.country_id)
    if (servicesPrices) {
      services.value = servicesPrices.map((servicePrice) => {
        const serviceData = servicesMap.value.get(servicePrice.service_id)
        return {
          ...servicePrice,
          name: serviceData?.name,
          alt_name: serviceData?.alt_name,
          prohibited: serviceData?.prohibited,
          has_warning: serviceData?.has_warning
        }
      }) as IFullServicePriceData[]
    }
    orderStore.servicesLoading = false
    formServicesItems()
  }

  const sortByPrice = () => {
    sortDirection.value = getNewSortDirection(sortDirection.value)
    const sortedItems = sortCatalogByPrice([...services.value], sortDirection.value)
    formServicesPricesItems(sortedItems as IFullServicePriceData[])
  }

  const clearPreloadCountriesTimeout = () => {
    if (preloadCountriesTimeout.value) {
      clearTimeout(preloadCountriesTimeout.value)
      preloadCountriesTimeout.value = null
    }
  }

  const selectServiceFromQuery = async (items: VirtualScrollItem[]) => {
    clearPreloadCountriesTimeout()

    if (countriesLoading.value && countriesCatalog.value.length === 0) {
      setTimeout(() => selectServiceFromQuery(items), 100)
      return
    }
    if (items.length === 0) return
    const serviceId = route.query.service
    const service = servicesItems.value.find(
      (serviceItem: VirtualScrollItem) => (serviceItem as IServiceData).service_id === serviceId
    )
    if (!service) return
    selectService(service as IFullServicePriceData)

    await nextTick()

    if (virtualScroller.value) {
      const activeIndex = servicesItems.value.findIndex((item) => (item as IServiceData).service_id === serviceId)
      await virtualScroller.value.scrollToActive(activeIndex ?? 0)
    }
  }

  const updateFavorites = (item: IFullServicePriceData | IFullCountryPriceData) => {
    saveFavorite(favorites.value, item)
    formServicesItems()
  }

  watch(
    () => [popularServicesCatalog.value, servicesCatalog.value, locale.value],
    () => formServicesItems()
  )

  watch(
    () => serviceSearchStr.value,
    () => {
      formServicesItems()
      // Scroll to active item when search string is empty
      if (virtualScroller.value && !serviceSearchStr.value && selectedService.value) {
        const activeIndex = servicesItems.value.findIndex(
          (item) => (item as IServiceData).service_id === selectedService.value?.service_id
        )
        virtualScroller.value.scrollToActive(activeIndex ?? 0)
      }
    }
  )

  watch(
    () => selectedService.value,
    (newVal: IServiceData | null, oldVal: IServiceData | null) => {
      // Scroll to top on clear selected service
      if (virtualScroller.value && !selectedService.value) {
        virtualScroller.value.scrollToActive(0)
      }
      if (oldVal && newVal && oldVal.service_id !== newVal.service_id) {
        removeForceOrderData()
      }
    }
  )

  watch(
    () => [selectedCountry.value],
    () => {
      if (catalogBlock.value === CatalogBlock.COUNTRY && selectedCountry.value) {
        sortDirection.value = null
        serviceSearchStr.value = ''
        getPricesByCountry()
      }
    }
  )

  watch(
    () => servicesItems.value,
    async (items) => {
      if (route.query.service) {
        await selectServiceFromQuery(items)
      }
    }
  )

  watch(
    () => [favorites.value, recent.value],
    () => {
      formServicesItems()
    }
  )

  onMounted(() => {
    loadRecent()
    loadFavorites()
    formServicesItems()
  })

  onBeforeUnmount(() => {
    clearPreloadCountriesTimeout()
  })
</script>

<template>
  <Card
    :class="[
      'tn:mx-auto tn:w-full tn:max-w-135 tn:lg:block tn:lg:w-[30%]',
      showServicesOnMobile ? 'tn:block' : 'tn:hidden'
    ]"
  >
    <template #header>
      <div class="tn:flex tn:items-center tn:gap-3">
        <ChangeMainBlockButton v-if="catalogBlock === CatalogBlock.COUNTRY" class="tn:hidden tn:lg:flex" />
        <MobileBackButton />
        <h3 class="tn:text-2xl tn:leading-7.5 tn:font-semibold">{{ $t('web_title_service') }}</h3>
      </div>
      <ChangeMainBlockButton v-if="catalogBlock === CatalogBlock.SERVICE" class="tn:flex tn:lg:hidden" />
    </template>
    <OrderSkeleton v-if="servicesLoading || (catalogBlock === CatalogBlock.COUNTRY && !selectedCountry)" />
    <template v-else>
      <div :class="{ 'tn:flex tn:items-center tn:justify-between tn:gap-4': isMobileHeaderHidden }">
        <MobileBackButton v-if="isMobileHeaderHidden" />
        <Search />
        <ChangeMainBlockButton
          v-if="catalogBlock === CatalogBlock.SERVICE && isMobileHeaderHidden"
          class="tn:flex tn:lg:hidden"
        />
      </div>
      <EmptyItemsScreen v-if="servicesItems.length === 0 && !serviceSearchStr" entity="service" />
      <VirtualScroller v-else ref="virtualScroller" :items="servicesItems">
        <template #default="{ item, index, showScrollbar }">
          <Delimiter
            v-if="'type' in item && item.type === 'delimiter'"
            @sortByPrice="sortByPrice"
            :key="index + 'delimiter'"
            :item="item"
            :sort-direction="sortDirection"
            :show-scrollbar="showScrollbar"
          />
          <Item
            v-else-if="'service_id' in item"
            @click.prevent="selectService(item)"
            @update-favorites="updateFavorites"
            :key="index"
            :item="item"
            :show-scrollbar="showScrollbar"
            :selected-item-class="
              selectedService?.service_id === item.service_id ? 'tn:bg-tn-black-50' : 'tn:bg-inherit'
            "
            :favorites="favorites.services"
          />
        </template>
      </VirtualScroller>
      <CardTooltip v-if="!selectedService && servicesItems?.length > 0">
        {{ $t('web_select_service_tooltip') }}
      </CardTooltip>
    </template>
  </Card>
</template>
