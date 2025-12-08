import { defineStore } from 'pinia'
import type UserState from '@/types/stores/user'
import type { IBalance } from '@/types/api/balance'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    totalBalance: null,
    reservedBalance: null
  }),
  actions: {
    setBalance(balance: IBalance | null) {
      this.totalBalance = balance !== null ? balance.total : null
      this.reservedBalance = balance !== null ? balance.reserved : null
    }
  }
})
