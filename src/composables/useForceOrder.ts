import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/order'
import type { ICountryData, IServiceData } from '@/types/api/catalog'

export function useForceOrder() {
  const { selectedService, selectedCountry, orderPrice } = storeToRefs(useOrderStore())

  const forceOrderKey = 'forceOrderData'

  const setForceOrderData = (orderData?: { service: IServiceData; country: ICountryData; price: number }): void => {
    sessionStorage.setItem(
      forceOrderKey,
      JSON.stringify({
        service: orderData?.service || selectedService.value,
        country: orderData?.country || selectedCountry.value,
        price: orderData?.price || orderPrice.value
      })
    )
  }

  const isForceOrderData = (): boolean => {
    return !!sessionStorage.getItem(forceOrderKey)
  }

  const getForceOrderData = (): { service: IServiceData; country: ICountryData; price: number } | null => {
    try {
      const data = JSON.parse(sessionStorage.getItem(forceOrderKey) || '')
      return data?.service && data?.country && data?.price ? data : null
    } catch {
      return null
    }
  }

  const removeForceOrderData = (): void => {
    sessionStorage.removeItem(forceOrderKey)
  }

  return { setForceOrderData, getForceOrderData, isForceOrderData, removeForceOrderData }
}
