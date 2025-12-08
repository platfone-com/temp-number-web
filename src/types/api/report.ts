import { type IPagination } from './index'
import type { IActivation } from './activation'

export enum ReportStatus {
  inReview = 'inReview',
  approved = 'approved',
  declined = 'declined'
}

export interface IReportFormData {
  reasonId: number | undefined
  message: string
  evidence: File | undefined
  agreeCheckbox: boolean
}

export interface IReportRequestData {
  activation_id: string
  reason_id: number
  message?: string
  evidence?: string
}

export interface IReportReason {
  reason_id: number
  reason_name: string
  evidence_required: boolean
}

export interface IReportResult {
  status: 'accepted' | 'declined'
  decline_id: number | null
}

export interface IReport {
  reason_id: number
  reason_name: string
  message: string
  evidence_url: string
  activation_state_snapshot: string
  updated_at: number
  created_at: number
  activation: IActivation
}

export interface IReportsData extends IPagination {
  reports: IReport[]
}
