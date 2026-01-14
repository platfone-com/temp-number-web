export type TnWidgetEventName =
  | 'tn:widgetLoaded'
  | 'tn:serviceSelected'
  | 'tn:countrySelected'
  | 'tn:startOrder'
  | 'tn:orderFailed'
  | 'tn:numberReceived'
  | 'tn:numberCancelled'
  | 'tn:reportSent'
  | 'tn:addFundsStarted'
  | 'tn:balanceAdded'

export type TnEventPrimitive = string | number | boolean | null

export type TnEventJson = TnEventPrimitive | { [key: string]: TnEventJson } | TnEventJson[]

export type TnWidgetEventDetail = TnEventJson
