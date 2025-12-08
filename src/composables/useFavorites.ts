import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUser } from '@/composables/api/useUser'
import { useAppStore } from '@/stores/app'
import type { Favorites } from '@/types/order'
import type { IFullCountryPriceData, IFullServicePriceData } from '@/types/api/catalog'

type Favorite = { service_id: string } | { country_id: string }

export function useFavorites() {
  const FAVORITES_KEY = 'favorites'

  const { t } = useI18n()
  const { getCustomer } = useUser()
  const appStore = useAppStore()

  const { favorites } = storeToRefs(appStore)

  const loadFavorites = () => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY)
      if (!raw) return { services: [], countries: [] }
      const parsed = JSON.parse(raw)
      appStore.favorites = {
        services: (parsed?.services ?? []).map(String),
        countries: (parsed?.countries ?? []).map(String)
      }
    } catch {}
  }

  const saveFavorite = (favorites: Favorites, item: Favorite, placement: 'start' | 'end' = 'end') => {
    const kind = 'service_id' in item ? 'services' : 'countries'
    const id = 'service_id' in item ? item.service_id : item.country_id
    const idStr = String(id)
    const i = favorites[kind].indexOf(idStr)
    if (i >= 0) favorites[kind].splice(i, 1)
    else {
      if (placement === 'start') favorites[kind].unshift(idStr)
      else favorites[kind].push(idStr)
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    loadFavorites()
  }

  const isFavorite = (favorites: string[], item: Favorite) => {
    return 'service_id' in item
      ? favorites.includes(String(item.service_id))
      : favorites.includes(String(item.country_id))
  }

  const setUserCountryToFavorites = async (): Promise<void> => {
    const USER_COUNTRY_FAVORITE_INITIALIZED = 'userCountryFavoriteInitialized'
    const userCountryFavoriteInitialized = localStorage.getItem(USER_COUNTRY_FAVORITE_INITIALIZED)
    if (userCountryFavoriteInitialized) return

    const customer = await getCustomer()
    if (customer?.regCountry) {
      const customerCountry = customer?.regCountry.toLowerCase()
      if (customerCountry === 'xx') return
      loadFavorites()
      if (!isFavorite(favorites.value.countries, { country_id: customerCountry })) {
        saveFavorite(favorites.value, { country_id: customerCountry }, 'start')
        localStorage.setItem(USER_COUNTRY_FAVORITE_INITIALIZED, '1')
      }
    }
  }

  const formFavoritesCountries = (
    favorites: Favorites,
    countriesData: IFullCountryPriceData[]
  ): (IFullCountryPriceData | { type: string; label: string })[] => {
    const items = []
    if (favorites.countries && favorites.countries.length > 0) {
      const countriesMap = new Map(countriesData?.map((c) => [String(c.country_id), c]))
      const favoriteCountriesArr = favorites.countries
        .map((id) => countriesMap.get(String(id)))
        .filter(Boolean) as IFullCountryPriceData[]
      if (favoriteCountriesArr && favoriteCountriesArr.length > 0) {
        items.push({ type: 'delimiter', label: t('web_favorites') })
        items.push(...favoriteCountriesArr)
      }
    }
    return items
  }

  const formFavoritesServices = (
    favorites: Favorites,
    servicesData: IFullServicePriceData[]
  ): (IFullServicePriceData | { type: string; label: string })[] => {
    const items = []
    if (favorites.services && favorites.services.length > 0) {
      const servicesMap = new Map(servicesData?.map((s) => [String(s.service_id), s]))
      const favoriteServicesArray = favorites.services
        .map((id) => servicesMap.get(String(id)))
        .filter(Boolean) as IFullServicePriceData[]
      if (favoriteServicesArray && favoriteServicesArray.length > 0) {
        items.push({ type: 'delimiter', label: t('web_favorites') })
        items.push(...favoriteServicesArray)
      }
    }
    return items
  }

  return {
    loadFavorites,
    saveFavorite,
    isFavorite,
    setUserCountryToFavorites,
    formFavoritesCountries,
    formFavoritesServices
  }
}
