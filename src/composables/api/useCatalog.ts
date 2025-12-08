import config from '@/config'
import { useApi } from '@/composables/api/useApi'
import { useOrderStore } from '@/stores/order'
import { useAppStore } from '@/stores/app'
import type {
  IServiceData,
  ICountryData,
  IPricesByCountry,
  IServicePriceData,
  IFullServicePriceData,
  IFullCountryPriceData,
  SortDirection,
  IPricesByService,
  ICountryPriceData,
  IPriceData,
  IPublicKeys
} from '@/types/api/catalog'
import { CatalogBlock } from '@/types/stores/order'

export function useCatalog() {
  const { get } = useApi()
  const orderStore = useOrderStore()
  const appStore = useAppStore()

  const getServices = async (withPopular: boolean = false): Promise<void> => {
    const apiPathUrl = config.wlWidgetMode ? '/activation/services' : '/app-getServices'
    orderStore.servicesLoading = true
    if (withPopular) {
      await getPopularServices()
    }
    const cachedServices = localStorage.getItem('services') || ''
    const etag = (cachedServices && localStorage.getItem('servicesEtag')) || ''
    const { data, error, headers } = await get<IServiceData[]>(apiPathUrl, null, { 'If-None-Match': etag })
    if (data) {
      setServicesCatalog(data)
      const etagHeader = headers?.['x-etag']
      if (etagHeader) {
        saveServicesToLocalStorage(data, etagHeader)
      }
    }
    if (error && error.status === 304) {
      if (cachedServices) {
        const data: IServiceData[] = JSON.parse(cachedServices)
        setServicesCatalog(data)
      }
    }
    if (orderStore.catalogBlock === CatalogBlock.SERVICE) orderStore.servicesLoading = false
  }

  const getCountries = async (): Promise<void> => {
    const apiPathUrl = config.wlWidgetMode ? '/activation/countries' : '/app-getCountries'
    const cachedCountries = localStorage.getItem('countries') || ''
    const etag = (cachedCountries && localStorage.getItem('countriesEtag')) || ''
    const { data, error, headers } = await get<ICountryData[]>(apiPathUrl, null, { 'If-None-Match': etag })
    if (data && data?.length) {
      const updatedCountriesAltNames: ICountryData[] = data.map((country: ICountryData) => {
        const codesStr = (country.codes ?? []).map((code) => `+${code}`).join('|')
        return {
          ...country,
          alt_name: codesStr ? `${codesStr}|${country.alt_name}` : country.alt_name
        }
      })
      setCountriesCatalog(updatedCountriesAltNames)
      const etagHeader = headers?.['x-etag']
      if (etagHeader) {
        saveCountriesToLocalStorage(updatedCountriesAltNames, etagHeader)
      }
    }
    if (error && error.status === 304) {
      if (cachedCountries) {
        const data: ICountryData[] = JSON.parse(cachedCountries)
        setCountriesCatalog(data)
      }
    }
    if (orderStore.catalogBlock === CatalogBlock.COUNTRY) orderStore.countriesLoading = false
  }

  const getPopularServices = async (): Promise<void> => {
    const apiPathUrl = config.wlWidgetMode ? '/activation/services/popular' : '/app-getPopularServices'
    const cachedPopularServices = localStorage.getItem('popularServices') || ''
    const etag = (cachedPopularServices && localStorage.getItem('popularServicesEtag')) || ''
    const { data, error, headers } = await get<IServiceData[]>(apiPathUrl, null, {
      'If-None-Match': etag
    })
    if (data) {
      orderStore.popularServicesCatalog = data
      const etagHeader = headers?.['x-etag']
      if (etagHeader) {
        localStorage.setItem('popularServices', JSON.stringify(data))
        localStorage.setItem('popularServicesEtag', etagHeader)
      }
    }
    if (error && error.status === 304) {
      if (cachedPopularServices) {
        orderStore.popularServicesCatalog = JSON.parse(cachedPopularServices)
      }
    }
  }

  const getServicesPricesByCountry = async (countryId: string): Promise<IServicePriceData[] | null> => {
    const apiPathUrl = config.wlWidgetMode ? '/activation/prices/countries' : '/app-getPricesByCountry'
    const { data } = await get<IPricesByCountry[]>(apiPathUrl, { country_id: countryId })
    if (data) return data[0]?.services || []
    return null
  }

  const getCountriesPricesByService = async (serviceId: string): Promise<ICountryPriceData[] | null> => {
    const apiPathUrl = config.wlWidgetMode ? '/activation/prices/services' : '/app-getPricesByService'
    const { data } = await get<IPricesByService[]>(apiPathUrl, { service_id: serviceId })
    if (data) return data[0]?.countries || []
    return null
  }

  const getServiceCountryPrice = async (serviceId: string, countryId: string): Promise<IPriceData | null> => {
    const apiPathUrl = config.wlWidgetMode
      ? `/activation/prices/services/${serviceId}/countries/${countryId}`
      : '/app-getPricesForServiceInCountry'
    const { data } = await get<IPriceData>(apiPathUrl, {
      service_id: serviceId,
      country_id: countryId
    })
    if (data) return data
    return null
  }

  const setServicesCatalog = (servicesData: IServiceData[]): void => {
    const servicesMap = new Map(servicesData.map((service: IServiceData) => [service.service_id, service]))
    orderStore.servicesCatalog = servicesData
    orderStore.services = servicesData
    orderStore.servicesMap = servicesMap
  }

  const saveServicesToLocalStorage = (data: IServiceData[], etag: string): void => {
    localStorage.setItem('services', JSON.stringify(data))
    localStorage.setItem('servicesEtag', etag)
  }

  const setCountriesCatalog = (countriesData: ICountryData[]): void => {
    const countriesMap = new Map(countriesData.map((country: ICountryData) => [country.country_id, country]))
    orderStore.countriesCatalog = countriesData
    orderStore.countries = countriesData
    orderStore.countriesMap = countriesMap
  }

  const saveCountriesToLocalStorage = (data: ICountryData[], etag: string): void => {
    localStorage.setItem('countries', JSON.stringify(data))
    localStorage.setItem('countriesEtag', etag)
  }

  const sortCatalogByPrice = (
    items: IFullServicePriceData[] | IFullCountryPriceData[],
    direction: 'asc' | 'desc' | null
  ) => {
    let sortedItems: IFullServicePriceData[] | IFullCountryPriceData[] = []
    if (direction === 'asc') {
      sortedItems = items.sort((a, b) => {
        return (a.price?.suggested ?? 0) - (b.price?.suggested ?? 0)
      })
    } else if (direction === 'desc') {
      sortedItems = items.sort((a, b) => {
        return (b.price?.suggested ?? 0) - (a.price?.suggested ?? 0)
      })
    } else {
      sortedItems = items
    }
    return sortedItems
  }

  const getNewSortDirection = (direction: SortDirection): SortDirection => {
    if (direction === 'asc') return 'desc'
    if (direction === null) return 'asc'
    return null
  }

  const getPublicKeys = async (): Promise<void> => {
    const { data } = await get<IPublicKeys>(`/app-getPublicKeys`)
    if (data && data.paypalClientId) {
      appStore.paypalClientId = data.paypalClientId
    }
  }

  return {
    getServices,
    getCountries,
    getServicesPricesByCountry,
    getCountriesPricesByService,
    getServiceCountryPrice,
    sortCatalogByPrice,
    getNewSortDirection,
    getPublicKeys
  }
}
