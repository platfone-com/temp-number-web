import type { IServiceData, ICountryData, IFullCountryPriceData, IFullServicePriceData } from '@/types/api/catalog'
import type { IActivation } from '@/types/api/activation'

export enum CatalogBlock {
  SERVICE = 'service',
  COUNTRY = 'country'
}

export interface OrderState {
  catalogBlock: CatalogBlock
  servicesLoading: boolean
  countriesLoading: boolean
  servicesMap: Map<string, IServiceData>
  countriesMap: Map<string, ICountryData>
  servicesCatalog: IServiceData[]
  popularServicesCatalog: IServiceData[]
  countriesCatalog: ICountryData[]
  selectedService: IServiceData | null
  selectedCountry: ICountryData | null
  services: IFullServicePriceData[]
  countries: IFullCountryPriceData[]
  serviceSearchStr: string
  countrySearchStr: string
  orderPrice: number
  orderId: string
  orderLoading: boolean
  oneBlockOrder: boolean
  activeNumbers: IActivation[] | null
  activeNumbersLoading: boolean | null
  cancelNumberLoading: boolean
  isSearchFocused: boolean
}
