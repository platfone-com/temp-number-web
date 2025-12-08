import type { IActivation } from '@/types/api/activation'
import { ActivationStatus, BillingStatus, SmsStatus } from '@/types/api/activation'

export function useActivationHelper() {
  const isExpiredStatus = (activation: IActivation) => {
    return (
      activation.sms_status === SmsStatus.smsRequested &&
      activation.activation_status === ActivationStatus.expired &&
      activation.billing_status === BillingStatus.released
    )
  }

  const isWaitingStatus = (activation: IActivation) => {
    return (
      [SmsStatus.smsRequested, SmsStatus.retryRequested].includes(activation.sms_status) &&
      activation.activation_status === ActivationStatus.active
    )
  }

  const isReceivedAndActiveStatus = (activation: IActivation) => {
    return (
      [SmsStatus.smsReceived, SmsStatus.retryReceived].includes(activation.sms_status) &&
      activation.activation_status === ActivationStatus.active
    )
  }

  const isReceivedAndExpiredStatus = (activation: IActivation) => {
    return (
      [SmsStatus.smsReceived, SmsStatus.retryRequested, SmsStatus.retryReceived].includes(activation.sms_status) &&
      [ActivationStatus.expired, ActivationStatus.finalized].includes(activation.activation_status) &&
      [BillingStatus.billed, BillingStatus.refunded].includes(activation.billing_status)
    )
  }

  const isRefundedStatus = (activation: IActivation) => {
    return activation.billing_status === BillingStatus.refunded
  }

  const isCanceledStatus = (activation: IActivation) => {
    return activation.activation_status === ActivationStatus.canceled
  }

  const activateActivationsRefreshTimeout = (activationsList: IActivation[] | null): number => {
    // If there are no activations, set the refresh timeout to 60 seconds
    return !activationsList || activationsList.length === 0 ? 60000 : 5000
  }

  return {
    isExpiredStatus,
    isWaitingStatus,
    isReceivedAndActiveStatus,
    isReceivedAndExpiredStatus,
    isRefundedStatus,
    isCanceledStatus,
    activateActivationsRefreshTimeout
  }
}
