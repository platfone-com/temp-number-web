import type { RouteLocationRaw } from 'vue-router'
import { defineStore } from 'pinia'
import type { ModalState } from '@/types/stores/modal'
import type { Segment } from '@/utils/translate'

export const useModalStore = defineStore('modal', {
  state: (): ModalState => {
    return {
      notification: {
        status: false,
        title: '',
        text: '',
        buttonText: '',
        buttonRouteName: '',
        buttonRoute: null,
        buttonHref: '',
        buttonAction: '',
        successIcon: false
      },
      forceEmailConfirmationModal: false,
      deleteAccountModal: false,
      confirmPasswordModal: false,
      accountOnHoldModal: false,
      activationPriceChangedModal: false,
      numberReadyModal: {
        status: false,
        activation: null
      },
      copyNumberModal: {
        status: false,
        activation: null
      },
      copyNumberMessageModal: {
        status: false,
        activation: null
      },
      cancelNumberModal: {
        status: false,
        activation: null,
        numberCanceled: false
      },
      finalizeNumberModal: {
        status: false,
        activationId: null
      },
      retryNumberModal: {
        status: false,
        activationId: null
      },
      reportHowItWorksModal: false,
      reportDetailsModal: {
        status: false,
        report: null
      },
      reportIssueModal: {
        status: false,
        activationId: null,
        availableReasons: null
      },
      paymentInReviewModal: false,
      stripePaymentModal: {
        status: false,
        publicKey: '',
        clientSecret: ''
      },
      paypalPaymentModal: {
        status: false,
        amount: 0
      },
      tooManyRequestsModal: {
        status: false,
        finishTimestamp: 0
      },
      reportCreationDeadlinePassedModal: false
    }
  },
  actions: {
    setNotification(
      status: boolean,
      options: {
        title?: string
        text?: Segment[] | string
        buttonText?: string
        buttonRouteName?: string
        buttonRoute?: RouteLocationRaw | null
        buttonHref?: string
        buttonAction?: string
        successIcon?: boolean
      } = {}
    ) {
      this.notification.status = status
      this.notification.title = options.title || ''
      this.notification.text = options.text || ''
      this.notification.buttonText = options.buttonText || ''
      this.notification.buttonRouteName = options.buttonRouteName || ''
      this.notification.buttonRoute = options.buttonRoute || null
      this.notification.buttonHref = options.buttonHref || ''
      this.notification.buttonAction = options.buttonAction || ''
      this.notification.successIcon = options.successIcon || false
    }
  }
})
