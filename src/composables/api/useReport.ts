import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '@/composables/api/useApi'
import config from '@/config'
import type { IReport, IReportReason, IReportResult, IReportsData } from '@/types/api/report'

export function useReport() {
  const { t } = useI18n()
  const { get, post } = useApi()

  const reasons = computed(
    () =>
      new Map([
        [1, t('web_reason_sms_is_not_coming')],
        [2, t('web_reason_wrong_sms_received')],
        [3, t('web_reason_number_not_accepted')],
        [4, t('web_reason_number_has_been_used_before')],
        [5, t('web_reason_blocked_after_activation')],
        [6, t('web_reason_sms_received_too_late')],
        [7, t('web_reason_other_reason')]
      ])
  )

  const getReport = async (id: string): Promise<IReport | null> => {
    const apiPathUrl = config.wlWidgetMode ? `/activation/${id}/report` : '/app-getReport'
    const { data } = await get<IReport>(apiPathUrl, { activation_id: id })
    return data ?? null
  }

  const getAvailableReasonsByActId = async (id: string): Promise<IReportReason[]> => {
    const apiPathUrl = config.wlWidgetMode ? `/activation/${id}/report/reasons` : '/app-getActivationReportReasons'
    const { data } = await get<IReportReason[]>(apiPathUrl, { activation_id: id })
    return data ?? []
  }

  const reportActivation = async (
    activationId: string,
    reasonId: number,
    message: string = '',
    evidence?: File | null
  ): Promise<IReportResult | null> => {
    let requestData: FormData | { activation_id: string; reason_id: number; message?: string; evidence?: string }
    let headers: Record<string, string> = {}

    if (config.wlWidgetMode) {
      requestData = new FormData()
      requestData.append('reason_id', reasonId.toString())
      if (message) requestData.append('message', message)
      if (evidence) requestData.append('evidence', evidence)
      headers = { 'Content-Type': 'multipart/form-data' }
    } else {
      requestData = {
        activation_id: activationId,
        reason_id: reasonId
      }
      if (message) requestData.message = message
      if (evidence) {
        const reader = new FileReader()
        requestData.evidence = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(evidence)
        })
      }
    }

    const apiPathUrl = config.wlWidgetMode ? `/activation/${activationId}/report` : '/app-reportActivation'
    const { data } = await post<IReportResult>(apiPathUrl, requestData, headers)
    if (data?.status === 'accepted' && config.wlWidgetMode && window.emitTnWidgetEvent) {
      window.emitTnWidgetEvent('tn:reportSent')
    }
    return data || null
  }

  const getReports = async (page: number = 1): Promise<IReportsData> => {
    const limit = 10
    const apiPathUrl = config.wlWidgetMode ? '/activation/reports' : '/app-getReports'
    const { data } = await get<IReportsData>(apiPathUrl, { page, limit })
    if (data) return data
    return { reports: [], page, limit, pages: 1, total: 0 }
  }

  return { reasons, getReport, getAvailableReasonsByActId, reportActivation, getReports }
}
