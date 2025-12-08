import { ref } from 'vue'
export function useWlHelper() {
  const wlHelperAuthUrl = ref('')
  const wlHelperSignInUrl = ref('')
  const wlHelperFundsUrl = ref('')
  const wlHelperContactUsUrl = ref('')
  const isWlHelperUrl = () => false
  const isWlAuthUrl = () => false
  const isWlPaymentUrl = () => false
  const handleSuccessWlAuth = async () => {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUnauthorizedWlAction = async (action: string) => {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWlActionRedirect = (action: string, status: string = 'success', actionStatusMessage?: string) => {}
  const getWlScriptDataParams = (): { locale?: string } => ({})
  const storeWlDesignParams = () => {}
  const getWlCustomBackgroundStyle = () => ({})
  const clearWlQueryParams = () => {}

  return {
    wlHelperAuthUrl,
    wlHelperSignInUrl,
    wlHelperFundsUrl,
    wlHelperContactUsUrl,
    isWlHelperUrl,
    isWlAuthUrl,
    isWlPaymentUrl,
    handleSuccessWlAuth,
    handleUnauthorizedWlAction,
    handleWlActionRedirect,
    getWlScriptDataParams,
    storeWlDesignParams,
    getWlCustomBackgroundStyle,
    clearWlQueryParams
  }
}
