import { type IPagination } from './index'
import { ReportStatus } from './report'

export enum ActivationStatus {
  active = 'active',
  finalized = 'finalized',
  expired = 'expired',
  canceled = 'canceled'
}

export enum SmsStatus {
  smsRequested = 'smsRequested',
  smsReceived = 'smsReceived',
  retryRequested = 'retryRequested',
  retryReceived = 'retryReceived'
}

export enum BillingStatus {
  reserved = 'reserved',
  released = 'released',
  billed = 'billed',
  refunded = 'refunded'
}

export interface IActivation {
  activation_id: string
  phone: string
  formatted: string
  country_id: string
  country_name?: string
  service_id: string
  service_name?: string
  sms_status: SmsStatus
  activation_status: ActivationStatus
  billing_status: BillingStatus
  report_status: ReportStatus | null
  sms_code: string | null
  sms_text: string | null
  price: number
  customer_price?: number
  expire_at: number
  updated_at: number
  created_at: number
  is_retriable: boolean
  cancelable_after: number | null
}

export interface IActivationsHistory extends IPagination {
  activations: IActivation[]
}

export enum ActivationUpdateAction {
  retry = 'retry',
  cancel = 'cancel',
  finalize = 'finalize'
}
