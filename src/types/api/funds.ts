import { type IPagination } from './index'

export enum Gateway {
  stripe = 'stripe',
  paypal = 'paypal',
  crypto = 'crypto',
  anypay = 'anypay',
  payeer = 'payeer',
  alipay_qq_wechat = 'alipay_qq_wechat'
}

export interface IBalanceData {
  total: number
  reserved: number
}

export interface IStipePaymentIntentData {
  id: string
  clientSecret: string
  publicKey: string
}

export interface IStipePaymentIntentStatus {
  status: 'paid' | 'unpaid' | 'review' | 'refunded'
}

interface IPaypalOrderLink {
  href: string
  rel: string
  method: string
}

export interface IPaypalOrderData {
  id: string
  status: string
  links: IPaypalOrderLink[]
}

export interface IPaypalCaptureOrderData {
  result: string
}

export interface ICryptomusPaymentData {
  url: string
}

export interface ITransaction {
  customer_id: string
  transaction_id: string
  gateway: string
  amount: number
  created_at: number
}

export interface ITransactionsData extends IPagination {
  transactions: ITransaction[]
}

export interface IPublicKeys {
  stripePublishableKey: string
  paypalClientId: string
  cryptomusMerchantId: string
}

export interface IAnypayPaymentData {
  merchant_id: number
  pay_id: string
  amount: number
  currency: 'USD'
  method: string
  customer_id: string
  sign: string
}

export interface IPayeerPaymentData {
  m_shop: string
  m_orderid: string
  m_amount: string
  m_curr: string
  m_desc: string
  m_sign: string
  m_params: string
  m_cipher_method: string
}
