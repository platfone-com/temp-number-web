export interface IServiceData {
  service_id: string
  name: string
  alt_name: string
  has_description: boolean
  has_warning: boolean
  prohibited: boolean
}

export interface ICountryData {
  country_id: string
  name: string
  alt_name: string
  codes: string[]
}

export interface IPriceData {
  price?: {
    min: number
    max: number
    suggested: number
  }
  quality?: {
    avg: number
  }
  count?: number
}

export interface ICountryPriceData extends IPriceData {
  country_id: string
}

export interface IServicePriceData extends IPriceData {
  service_id: string
}

export interface IFullCountryPriceData extends ICountryData, IPriceData {}

export interface IFullServicePriceData extends IServiceData, IPriceData {}

export interface IPricesByService {
  service_id: string
  countries: ICountryPriceData[]
}

export interface IPricesByCountry {
  country_id: string
  services: IServicePriceData[]
}

export type SortDirection = 'asc' | 'desc' | null

export interface IPublicKeys {
  stripePublishableKey: string
  paypalClientId: string
  cryptomusMerchantId: string
}
