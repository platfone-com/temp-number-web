import { defineStore } from 'pinia'
import { type OrderState, CatalogBlock } from '@/types/stores/order'
import type { ICountryData, IServiceData } from '@/types/api/catalog'

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    catalogBlock: (localStorage.getItem('catalogBlock') as CatalogBlock) || CatalogBlock.SERVICE,
    servicesLoading: true,
    countriesLoading: true,
    servicesMap: new Map<string, IServiceData>(),
    countriesMap: new Map<string, ICountryData>(),
    servicesCatalog: [],
    popularServicesCatalog: [],
    countriesCatalog: [],
    selectedService: null,
    selectedCountry: null,
    services: [],
    countries: [],
    serviceSearchStr: '',
    countrySearchStr: '',
    orderPrice: 0,
    orderId: '',
    orderLoading: false,
    oneBlockOrder: false,
    activeNumbers: null,
    activeNumbersLoading: null,
    cancelNumberLoading: false,
    isSearchFocused: false
  }),
  actions: {
    changeCatalogBlock(disableLoading: boolean = true) {
      this.catalogBlock = this.catalogBlock === CatalogBlock.SERVICE ? CatalogBlock.COUNTRY : CatalogBlock.SERVICE
      if (this.catalogBlock === CatalogBlock.SERVICE) {
        localStorage.removeItem('catalogBlock')
        if (disableLoading) this.servicesLoading = false
      } else {
        localStorage.setItem('catalogBlock', CatalogBlock.COUNTRY)
        if (disableLoading) this.countriesLoading = false
      }

      this.clearOrder()
    },
    clearOrder(clearOneBlockOrder: boolean = false) {
      this.services = this.servicesCatalog
      this.countries = this.countriesCatalog
      this.selectedCountry = null
      this.selectedService = null
      this.serviceSearchStr = ''
      this.countrySearchStr = ''
      this.activeNumbersLoading = null
      this.orderPrice = 0
      this.orderId = ''
      if (clearOneBlockOrder) {
        this.oneBlockOrder = false
      }
    }
  }
})
