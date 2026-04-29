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
  picpay_br = 'picpay_br',
  pagbank_br = 'pagbank_br',
  kakaopay_kr = 'kakaopay_kr',
  alipay_cn = 'alipay_cn',
  unionpay_cn = 'unionpay_cn',
  qris_id = 'qris_id',
  ovo_id = 'ovo_id',
  gcash_ph = 'gcash_ph',
  grabpay_ph = 'grabpay_ph',
  vietqr_vn = 'vietqr_vn',
  boleto_br = 'boleto_br',
  efecty_co = 'efecty_co',
  pse_co = 'pse_co',
  oxxo_mx = 'oxxo_mx',
  fpx_my = 'fpx_my',
  spei_mx = 'spei_mx'
}

export const OtherGatewayName: Record<OtherGateway, string> = {
  [OtherGateway.payssion_test]: 'Payssion Test',
  [OtherGateway.pix_br]: 'Pix',
  [OtherGateway.picpay_br]: 'PicPay',
  [OtherGateway.pagbank_br]: 'PagBank',
  [OtherGateway.alipay_cn]: 'AliPay',
  [OtherGateway.unionpay_cn]: 'UnionPay',
  [OtherGateway.kakaopay_kr]: 'KakaoPay',
  [OtherGateway.qris_id]: 'QRIS',
  [OtherGateway.ovo_id]: 'OVO',
  [OtherGateway.gcash_ph]: 'GCash',
  [OtherGateway.grabpay_ph]: 'GrabPay',
  [OtherGateway.vietqr_vn]: 'VietQR',
  [OtherGateway.boleto_br]: 'Boleto',
  [OtherGateway.efecty_co]: 'Efecty',
  [OtherGateway.pse_co]: 'PSE',
  [OtherGateway.oxxo_mx]: 'OXXO',
  [OtherGateway.fpx_my]: 'FPX',
  [OtherGateway.spei_mx]: 'SPEI'
}

export enum PayssionPaymentStatus {
  paid = 'paid',
  unpaid = 'unpaid',
  review = 'review',
  refunded = 'refunded'
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
