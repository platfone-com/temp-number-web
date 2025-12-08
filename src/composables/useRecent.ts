import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import type { Recent } from '@/types/order'
import type { IFullCountryPriceData, IFullServicePriceData } from '@/types/api/catalog'

type RecentItem = { service_id: string } | { country_id: string }

export function useRecent() {
  const RECENT_KEY = 'recent'

  const { t } = useI18n()
  const appStore = useAppStore()

  const loadRecent = (): Recent => {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return { services: [], countries: [] }
    const parsed = JSON.parse(raw)
    const recentItems: Recent = {
      services: (parsed?.services ?? []).map(String),
      countries: (parsed?.countries ?? []).map(String)
    }
    appStore.recent = recentItems
    return recentItems
  }

  const addRecent = (item: RecentItem) => {
    const kind = 'service_id' in item ? 'services' : 'countries'
    const id = 'service_id' in item ? item.service_id : item.country_id
    const idStr = String(id)
    const recentItems = loadRecent()
    if (recentItems[kind].length === 0 || !recentItems[kind].includes(idStr)) {
      recentItems[kind].unshift(idStr)
      if (recentItems[kind].length > 3) recentItems[kind].pop()
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentItems))
      appStore.recent = recentItems
    }
  }

  const isInRecent = (recent: string[], item: RecentItem) => {
    return 'service_id' in item ? recent.includes(String(item.service_id)) : recent.includes(String(item.country_id))
  }

  const formRecentCountries = (
    recent: Recent,
    countriesData: IFullCountryPriceData[]
  ): (IFullCountryPriceData | { type: string; label: string })[] => {
    const items = []
    if (recent.countries && recent.countries.length > 0) {
      const countriesMap = new Map(countriesData?.map((c) => [String(c.country_id), c]))
      const recentCountriesArr = recent.countries
        .map((id) => countriesMap.get(String(id)))
        .filter(Boolean) as IFullCountryPriceData[]
      if (recentCountriesArr && recentCountriesArr.length > 0) {
        items.push({ type: 'delimiter', label: t('web_recent') })
        items.push(...recentCountriesArr)
      }
    }
    return items
  }

  const formRecentServices = (
    recent: Recent,
    servicesData: IFullServicePriceData[]
  ): (IFullServicePriceData | { type: string; label: string })[] => {
    const items = []
    if (recent.services && recent.services.length > 0) {
      const servicesMap = new Map(servicesData?.map((s) => [String(s.service_id), s]))
      const recentServicesArr = recent.services
        .map((id) => servicesMap.get(String(id)))
        .filter(Boolean) as IFullServicePriceData[]
      if (recentServicesArr && recentServicesArr.length > 0) {
        items.push({ type: 'delimiter', label: t('web_recent') })
        items.push(...recentServicesArr)
      }
    }
    return items
  }

  return { loadRecent, addRecent, isInRecent, formRecentCountries, formRecentServices }
}
