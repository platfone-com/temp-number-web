export interface IErrorResponseData {
  errorName?: string
  errorMessage?: string
  suggestedPrice?: number
  orderId?: string
}

export interface ISuccessResponse {
  result: 'success'
}

export interface IPagination {
  page: number
  limit: number
  pages: number
  total: number
}
