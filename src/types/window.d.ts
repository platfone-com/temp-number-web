import type { TnWidgetEventDetail, TnWidgetEventName } from '@/types/tnWidgetEvent'

export {}

declare global {
  interface Window {
    emitTnWidgetEvent?: (name: TnWidgetEventName, detail?: TnWidgetEventDetail = {}) => void
    grecaptcha: {
      enterprise: {
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
    }
    paypal: {
      Buttons: (options: {
        createOrder: () => Promise<string | undefined>
        onApprove: (data: { orderID: string }) => Promise<void>
        onError?: () => void
      }) => {
        render: (selector: string) => void
      }
    }
    $crisp?: Array<[string, string, ...unknown[]]>
    CRISP_WEBSITE_ID?: string
    CRISP_RUNTIME_CONFIG?: { locale: string }
  }
}
