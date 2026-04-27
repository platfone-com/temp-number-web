import { type IPagination } from './index'

export enum Gateway {
  stripe = 'stripe',
  paypal = 'paypal',
  crypto = 'crypto',
  alipay_qq_wechat = 'alipay_qq_wechat',
  other = 'other'
}

export enum OtherGateway {
  payssion_test = 'payssion_test',
  pix_br = 'pix_br',
  kakaopay_kr = 'kakaopay_kr',
  alipay_cn = 'alipay_cn',
  unionpay_cn = 'unionpay_cn',
  toss_kr = 'toss_kr',
  qris_id = 'qris_id',
  dana_id = 'dana_id',
  ovo_id = 'ovo_id',
  gcash_ph = 'gcash_ph',
  grabpay_ph = 'grabpay_ph',
  vietqr_vn = 'vietqr_vn',
  truemoney_th = 'truemoney_th',
  promptpay_th = 'promptpay_th',
  boleto_br = 'boleto_br',
  efecty_co = 'efecty_co',
  oxxo_mx = 'oxxo_mx',
  mercadopago_br = 'mercadopago_br',
  nequi_co = 'nequi_co',
  fpx_my = 'fpx_my',
  spei_mx = 'spei_mx'
}

export const OtherGatewayName: Record<OtherGateway, string> = {
  [OtherGateway.payssion_test]: 'Payssion Test',
  [OtherGateway.pix_br]: 'Pix',
  [OtherGateway.alipay_cn]: 'AliPay',
  [OtherGateway.unionpay_cn]: 'UnionPay',
  [OtherGateway.kakaopay_kr]: 'KakaoPay',
  [OtherGateway.toss_kr]: 'Toss',
  [OtherGateway.qris_id]: 'QRIS',
  [OtherGateway.dana_id]: 'Dana',
  [OtherGateway.ovo_id]: 'OVO',
  [OtherGateway.gcash_ph]: 'Gcash',
  [OtherGateway.grabpay_ph]: 'GrabPay',
  [OtherGateway.vietqr_vn]: 'VietQR',
  [OtherGateway.truemoney_th]: 'TrueMoney',
  [OtherGateway.promptpay_th]: 'PromptPay',
  [OtherGateway.boleto_br]: 'Boleto',
  [OtherGateway.efecty_co]: 'Efecty',
  [OtherGateway.oxxo_mx]: 'OXXO',
  [OtherGateway.mercadopago_br]: 'Mercado Pago',
  [OtherGateway.nequi_co]: 'Nequi',
  [OtherGateway.fpx_my]: 'FPX',
  [OtherGateway.spei_mx]: 'SPEI'
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
