import { type IPagination } from './index'

export enum Gateway {
  stripe = 'stripe',
  paypal = 'paypal',
  crypto = 'crypto',
  alipay_qq_wechat = 'alipay_qq_wechat',
  other = 'other'
}

export enum OtherGateway {
  pix_br = 'pix_br',
  kakaopay_kr = 'kakaopay_kr',
  alipay_cn = 'alipay_cn',
  unionpay_cn = 'unionpay_cn',
  toss_kr = 'toss_kr',
  payssion_test = 'payssion_test'
}

export const OtherGatewayName: Record<OtherGateway, string> = {
  [OtherGateway.pix_br]: 'Pix',
  [OtherGateway.alipay_cn]: 'AliPay',
  [OtherGateway.unionpay_cn]: 'UnionPay',
  [OtherGateway.kakaopay_kr]: 'KakaoPay',
  [OtherGateway.toss_kr]: 'Toss',
  [OtherGateway.payssion_test]: 'Payssion Test'
}

export enum PayssionPaymentStatus {
  paid = 'paid',
  unpaid = 'unpaid',
  review = 'review',
  refunded = 'refunded'
}

export interface IPayssionPaymentRequest {
  amount: number
  pm_id: string
  description?: string
  return_url?: string
  os?: string
}

export interface IPayssionPaymentResponse {
  redirect_url: string
}

export interface IPayssionPaymentStatusResponse {
  status: PayssionPaymentStatus
}

export interface IOtherGatewayOption {
  id: OtherGateway
  name: string
  provider: string
  pm_id: string
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
