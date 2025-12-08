import type { RouteLocationRaw } from 'vue-router'
import type { Segment } from '@/utils/translate'
import type { IActivation } from '@/types/api/activation'
import type { IReport, IReportReason } from '@/types/api/report'

export interface ModalState {
  notification: {
    status: boolean
    title: string
    text: Segment[] | string
    buttonText?: string
    buttonRouteName?: string
    buttonRoute?: RouteLocationRaw | null
    buttonHref?: string
    buttonAction?: string
    successIcon?: boolean
  }
  forceEmailConfirmationModal: boolean
  deleteAccountModal: boolean
  confirmPasswordModal: boolean
  accountOnHoldModal: boolean
  activationPriceChangedModal: boolean
  numberReadyModal: {
    status: boolean
    activation: IActivation | null
  }
  copyNumberModal: {
    status: boolean
    activation: IActivation | null
  }
  copyNumberMessageModal: {
    status: boolean
    activation: IActivation | null
  }
  cancelNumberModal: {
    status: boolean
    activation: IActivation | null
    numberCanceled: boolean
  }
  finalizeNumberModal: {
    status: boolean
    activationId: string | null
  }
  retryNumberModal: {
    status: boolean
    activationId: string | null
  }
  reportHowItWorksModal: boolean
  reportDetailsModal: {
    status: boolean
    report: IReport | null
  }
  reportIssueModal: {
    status: boolean
    activationId: string | null
    availableReasons: IReportReason[] | null
  }
  paymentInReviewModal: boolean
  stripePaymentModal: {
    status: boolean
    publicKey: string
    clientSecret: string
  }
  paypalPaymentModal: {
    status: boolean
    amount: number
  }
  tooManyRequestsModal: {
    status: boolean
    finishTimestamp: number
  }
  reportCreationDeadlinePassedModal: boolean
}
