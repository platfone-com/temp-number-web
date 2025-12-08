import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import { useActivation } from '@/composables/api/useActivation'
import { useForceOrder } from '@/composables/useForceOrder'

export function useForceOrderHandler() {
  const router = useRouter()
  const route = useRoute()
  const orderStore = useOrderStore()
  const { createActivation } = useActivation()
  const { getForceOrderData } = useForceOrder()

  const { isAuthenticated, isAuthPasswordProvider, isEmailVerified } = storeToRefs(useAuthStore())
  const { totalBalance } = storeToRefs(useUserStore())

  const handleForceOrder = async () => {
    const forceOrderData = getForceOrderData()
    if (!forceOrderData || !isAuthenticated.value || (isAuthPasswordProvider.value && !isEmailVerified.value)) return
    const { service, country, price } = forceOrderData
    if (!service || !country || !price) return

    orderStore.selectedService = service
    orderStore.selectedCountry = country
    orderStore.orderPrice = Number(price)

    if (route.name !== 'Home') {
      await router.push({ name: 'Home' })
    }
    if (totalBalance.value === null) {
      setTimeout(() => handleForceOrder(), 1500)
    } else if (totalBalance.value && totalBalance.value >= price) {
      await createActivation()
    }
  }

  return { handleForceOrder }
}
