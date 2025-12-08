export interface ICustomer {
  accountOnHold: boolean
  regCountry: string
}

export interface INotificationSettings {
  email_enabled: boolean
  push_enabled: boolean
}

export interface IWLCustomer {
  user_customer_id: string
  email: string | null
  email_verified: boolean
  is_password_provider?: boolean
}
