export function useWlApiUser() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendWLContactUsEmail = async (email: string, reason: string, message: string, recaptchaToken: string) => false
  const getWlCustomer = async () => null
  return { sendWLContactUsEmail, getWlCustomer }
}
