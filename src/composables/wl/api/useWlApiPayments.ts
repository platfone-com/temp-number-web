import { ref } from 'vue'
export function useWlApiPayments() {
  const enabledWLGateways = ref([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createWLStripePaymentIntent = async (amount: number, recaptchaToken: string) => undefined
  const getWLStripePaymentIntentStatus = async () => ''
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createWlCryptomusPayment = async (amount: number) => {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createWLAlipayQqWechatPayment = async (coupon: string, recaptchaToken: string) => null
  return {
    enabledWLGateways,
    createWLStripePaymentIntent,
    getWLStripePaymentIntentStatus,
    createWlCryptomusPayment,
    createWLAlipayQqWechatPayment
  }
}
