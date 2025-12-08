import { storeToRefs } from 'pinia'
import { useApi } from '@/composables/api/useApi'
import type { IBalance } from '@/types/api/balance'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import config from '@/config'

export function useBalance() {
  const { get } = useApi()
  const userStore = useUserStore()
  const appStore = useAppStore()
  const { totalBalance, reservedBalance } = storeToRefs(userStore)
  const { isAuthenticated } = storeToRefs(useAuthStore())
  const { balanceTimeoutId } = storeToRefs(appStore)

  const timeoutExpStartValue = 0.6
  const timeoutStep = 0.2
  let timeoutExpValue: number = timeoutExpStartValue

  const getBalance = async (): Promise<IBalance | null> => {
    if (!isAuthenticated.value) return null
    const apiPathUrl = config.wlWidgetMode ? '/balance' : '/app-getBalance'
    const { data } = await get<IBalance>(apiPathUrl)
    return data || null
  }

  const checkBalance = async () => {
    if (!isAuthenticated.value) {
      stopCheckBalance()
      return
    }
    const balanceData = await getBalance()
    if (balanceData) {
      if (totalBalance.value !== balanceData.total || reservedBalance.value !== balanceData.reserved) {
        userStore.setBalance(balanceData)
      }
    }

    const timeout = Math.round(Math.exp(timeoutExpValue))
    appStore.balanceTimeoutId = setTimeout(() => {
      checkBalance()
    }, timeout * 1000)
    timeoutExpValue += timeoutStep
  }

  const restartCheckBalance = async () => {
    stopCheckBalance()
    timeoutExpValue = timeoutExpStartValue

    await checkBalance()
  }

  const stopCheckBalance = () => {
    if (balanceTimeoutId.value) {
      clearTimeout(Number(balanceTimeoutId.value))
      appStore.balanceTimeoutId = null
    }
  }

  return { getBalance, restartCheckBalance }
}
