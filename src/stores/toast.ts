import { defineStore } from 'pinia'
import type ToastState from '@/types/stores/toast'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastState[],
    timeouts: {} as Record<string, ReturnType<typeof setTimeout>>
  }),
  actions: {
    add(toast: ToastState) {
      if (this.timeouts[toast.id]) {
        this.remove(toast.id)
      }

      if (!toast.type) toast.type = 'error'

      if (!this.toasts.some((t) => t.id === toast.id)) {
        this.toasts.push(toast)

        if (!toast.permanent) {
          this.timeouts[toast.id] = setTimeout(() => {
            this.remove(toast.id)
          }, toast.timeout || 3000)
        }
      }
    },
    remove(id: string) {
      if (this.timeouts[id]) {
        clearTimeout(Number(this.timeouts[id]))
        delete this.timeouts[id]
      }
      this.toasts = this.toasts.filter((t) => t.id !== id)
    }
  }
})
