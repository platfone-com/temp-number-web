<script lang="ts" setup>
  import { onMounted, ref, watch, computed, nextTick, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useOrderStore } from '@/stores/order'
  import { useCatalog } from '@/composables/api/useCatalog'
  import { useForceOrder } from '@/composables/useForceOrder'
  import { useFavorites } from '@/composables/useFavorites'
  import { useRecent } from '@/composables/useRecent'
  import { useAppStore } from '@/stores/app'
  import { CatalogBlock } from '@/types/stores/order'
  import type { VirtualScrollItem } from '@/types/order'
  import type { ICountryData, IFullCountryPriceData, IFullServicePriceData, SortDirection } from '@/types/api/catalog'
  import Card from '@/components/Order/Shared/Card.vue'
  import OrderSkeleton from '@/components/Shared/Skeletons/OrderSkeleton.vue'
  import Search from '@/components/Order/Shared/Search.vue'
  import ChangeMainBlockButton from '@/components/Order/Shared/ChangeMainBlockButton.vue'
  import CardTooltip from '@/components/Order/Shared/CardTooltip.vue'
  import VirtualScroller from '@/components/Order/Shared/VirtualScroller.vue'
  import Delimiter from '@/components/Order/Shared/Item/Delimiter.vue'
  import Item from '@/components/Order/Shared/Item/Item.vue'
  import MobileBackButton from '@/components/Order/Shared/MobileBackButton.vue'
  import EmptyItemsScreen from '@/components/Order/Shared/EmptyItemsScreen.vue'

  const route = useRoute()
  const { t, locale } = useI18n()
  const { getCountriesPricesByService, sortCatalogByPrice, getNewSortDirection } = useCatalog()
  const { isForceOrderData, removeForceOrderData } = useForceOrder()
  const { loadFavorites, saveFavorite, formFavoritesCountries } = useFavorites()
  const { loadRecent, formRecentCountries } = useRecent()
  const orderStore = useOrderStore()

  const {
    servicesLoading,
    countriesLoading,
    catalogBlock,
    selectedService,
    selectedCountry,
    countrySearchStr,
    servicesCatalog,
    countriesCatalog,
    countries,
    countriesMap,
    oneBlockOrder
  } = storeToRefs(useOrderStore())
  const { isMobileHeaderHidden, favorites, recent } = storeToRefs(useAppStore())

  const virtualScroller = ref()
  const sortDirection = ref<SortDirection>(null)
  const countriesItems = ref<VirtualScrollItem[]>([])
  const preloadServicesTimeout = ref<number | null>(null)

  const showCountriesOnMobile = computed(() => {
    if (oneBlockOrder.value) {
      return (
        (catalogBlock.value === CatalogBlock.COUNTRY && !selectedCountry.value) ||
        (catalogBlock.value === CatalogBlock.SERVICE && !selectedCountry.value && selectedService.value)
      )
    }
    return false
  })

  const selectCountry = (country: IFullCountryPriceData) => {
    if (country?.count === 0) return
    orderStore.selectedCountry = country
    orderStore.orderPrice = 0
    orderStore.orderId = ''
    if (country?.price?.suggested) {
      orderStore.orderPrice = country.price.suggested
    }
  }

  const formCountriesPricesItems = (countries: IFullCountryPriceData[]) => {
    const emptyPrices = countries.every((c) => c.count === 0)
    countriesItems.value = [
      ...formRecentCountries(recent.value, countries),
      ...formFavoritesCountries(favorites.value, countries),
      { type: 'delimiter', label: t('web_all_countries_item_title'), showSort: !emptyPrices },
      ...countries
    ]
  }

  const searchCountries = () => {
    countriesItems.value = countries.value.filter((country: IFullCountryPriceData) =>
      country.alt_name?.toLowerCase().includes(countrySearchStr.value.trim().toLowerCase())
    )
    if (countriesItems.value.length > 0 && 'price' in countriesItems.value[0] && sortDirection.value) {
      countriesItems.value = sortCatalogByPrice(countriesItems.value as IFullCountryPriceData[], sortDirection.value)
    }
  }

  const formCountriesItems = () => {
    if (countriesLoading.value) return
    if (countrySearchStr.value) {
      searchCountries()
    } else if (countries.value.length > 0 && 'price' in countries.value[0]) {
      let countriesData = [...countries.value] as IFullCountryPriceData[]
      if (sortDirection.value) {
        countriesData = sortCatalogByPrice(countriesData, sortDirection.value) as IFullCountryPriceData[]
      }
      formCountriesPricesItems(countriesData)
    } else if (countries.value.length === 0) {
      countriesItems.value = []
    } else {
      const items = []
      items.push(...formRecentCountries(recent.value, countriesCatalog.value))
      items.push(...formFavoritesCountries(favorites.value, countriesCatalog.value))
      items.push({ type: 'delimiter', label: t('web_all_countries_item_title') })
      items.push(...countriesCatalog.value)
      countriesItems.value = items
    }
  }

  const getPricesByService = async () => {
    if (!selectedService.value) return
    if (!isForceOrderData()) {
      orderStore.selectedCountry = null
    }
    orderStore.countriesLoading = true
    const countriesPrices = await getCountriesPricesByService(selectedService.value.service_id)
    if (countriesPrices) {
      countries.value = countriesPrices.map((countryPrice) => {
        const countryData = countriesMap.value.get(countryPrice.country_id)
        return { ...countryPrice, name: countryData?.name, alt_name: countryData?.alt_name, codes: countryData?.codes }
      }) as IFullCountryPriceData[]
    }
    orderStore.countriesLoading = false
    formCountriesItems()
  }

  const sortByPrice = () => {
    sortDirection.value = getNewSortDirection(sortDirection.value)
    const sortedItems = sortCatalogByPrice([...countries.value], sortDirection.value)
    formCountriesPricesItems(sortedItems as IFullCountryPriceData[])
  }

  const clearPreloadServicesTimeout = () => {
    if (preloadServicesTimeout.value) {
      clearTimeout(preloadServicesTimeout.value)
      preloadServicesTimeout.value = null
    }
  }

  const selectCountryFromQuery = async (items: VirtualScrollItem[]) => {
    clearPreloadServicesTimeout()

    if (servicesLoading.value && servicesCatalog.value.length === 0) {
      setTimeout(() => selectCountryFromQuery(items), 100)
      return
    }
    if (items.length === 0) return
    const countryId = route.query.country
    const country = countriesItems.value.find(
      (countryItem: VirtualScrollItem) => (countryItem as ICountryData).country_id === countryId
    )
    if (!country) return
    selectCountry(country as IFullCountryPriceData)

    await nextTick()

    if (virtualScroller.value) {
      const activeIndex = countriesItems.value.findIndex((item) => (item as ICountryData).country_id === countryId)
      await virtualScroller.value.scrollToActive(activeIndex ?? 0)
    }
  }

  const updateFavorites = (item: IFullServicePriceData | IFullCountryPriceData) => {
    saveFavorite(favorites.value, item)
    formCountriesItems()
  }

  watch(
    () => [countriesCatalog.value, locale.value],
    () => formCountriesItems()
  )

  watch(
    () => countrySearchStr.value,
    () => {
      formCountriesItems()
      // Scroll to active item when search string is empty
      if (virtualScroller.value && !countrySearchStr.value && selectedCountry.value) {
        const activeIndex = countriesItems.value.findIndex(
          (item) => (item as ICountryData).country_id === selectedCountry.value?.country_id
        )
        virtualScroller.value.scrollToActive(activeIndex ?? 0)
      }
    }
  )

  watch(
    () => selectedCountry.value,
    (newVal: ICountryData | null, oldVal: ICountryData | null) => {
      // Scroll to top on clear selected service
      if (virtualScroller.value && !selectedCountry.value) {
        virtualScroller.value.scrollToActive(0)
      }
      if (oldVal && newVal && oldVal.country_id !== newVal.country_id) {
        removeForceOrderData()
      }
    }
  )

  watch(
    () => [selectedService.value],
    () => {
      if (catalogBlock.value === CatalogBlock.SERVICE && selectedService.value) {
        sortDirection.value = null
        countrySearchStr.value = ''
        getPricesByService()
      }
    }
  )

  watch(
    () => countriesItems.value,
    async (items) => {
      if (route.query.country) {
        await selectCountryFromQuery(items)
      }
    }
  )

  watch(
    () => [favorites.value, recent.value],
    () => {
      formCountriesItems()
    }
  )

  onMounted(() => {
    loadRecent()
    loadFavorites()
    formCountriesItems()
  })

  onBeforeUnmount(() => {
    clearPreloadServicesTimeout()
  })
</script>

<template>
  <Card
    :class="[
      'tn:mx-auto tn:w-full tn:max-w-135 tn:lg:block tn:lg:w-[30%]',
      showCountriesOnMobile ? 'tn:block' : 'tn:hidden'
    ]"
  >
    <template #header>
      <div class="tn:flex tn:items-center tn:gap-3">
        <ChangeMainBlockButton v-if="catalogBlock === CatalogBlock.SERVICE" class="tn:hidden tn:lg:flex" />
        <MobileBackButton />
        <h3 class="tn:text-2xl tn:leading-7.5 tn:font-semibold">{{ $t('web_title_country') }}</h3>
      </div>
      <ChangeMainBlockButton v-if="catalogBlock === CatalogBlock.COUNTRY" class="tn:flex tn:lg:hidden" />
    </template>
    <OrderSkeleton v-if="countriesLoading || (catalogBlock === CatalogBlock.SERVICE && !selectedService)" />
    <template v-else>
      <div :class="{ 'tn:flex tn:items-center tn:justify-between tn:gap-4': isMobileHeaderHidden }">
        <MobileBackButton v-if="isMobileHeaderHidden" />
        <Search search-type="country" />
        <ChangeMainBlockButton
          v-if="catalogBlock === CatalogBlock.COUNTRY && isMobileHeaderHidden"
          class="tn:flex tn:lg:hidden"
        />
      </div>
      <EmptyItemsScreen v-if="countriesItems.length === 0 && !countrySearchStr" entity="country" />
      <VirtualScroller v-else ref="virtualScroller" :items="countriesItems">
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
            v-else-if="'country_id' in item"
            @click.prevent="selectCountry(item)"
            @update-favorites="updateFavorites"
            :key="index"
            :item="item"
            :show-scrollbar="showScrollbar"
            :selected-item-class="
              selectedCountry?.country_id === item.country_id ? 'tn:bg-tn-black-50' : 'tn:bg-inherit'
            "
            :favorites="favorites.countries"
          />
        </template>
      </VirtualScroller>
      <CardTooltip v-if="!selectedCountry && countriesItems?.length > 0">
        {{ $t('web_select_country_tooltip') }}
      </CardTooltip>
    </template>
  </Card>
</template>
