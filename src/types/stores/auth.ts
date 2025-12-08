export default interface AuthState {
  isAuthenticated: boolean
  isAuthPasswordProvider: boolean
  isEmailVerified: boolean | null
  authLoading: boolean
}
