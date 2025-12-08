import type { ICountryData, IServiceData } from '@/types/api/catalog'

export interface VSDelimiter {
  type: string
  label: string
  showSort?: boolean
}

export type VirtualScrollItem = IServiceData | ICountryData | VSDelimiter

export type Favorites = { services: string[]; countries: string[] }

export type Recent = { services: string[]; countries: string[] }
