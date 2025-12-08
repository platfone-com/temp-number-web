export type ToastType = 'success' | 'error' | 'warning'

export default interface ToastState {
  id: string
  text: string
  type?: ToastType
  timeout?: number
  permanent?: boolean
}
