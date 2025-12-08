<script lang="ts" setup>
  import { ref, computed, type PropType, watch } from 'vue'
  import useSharedCss from '@/composables/useSharedCss'
  import { useReport } from '@/composables/api/useReport'
  import type { IReportReason } from '@/types/api/report'
  import Button from '@/components/Shared/Button.vue'
  import AttachIcon from '@/assets/images/icons/report/attach.svg'
  import DeleteIcon from '@/assets/images/icons/report/delete.svg'
  import FileIcon from '@/assets/images/icons/report/file.svg'
  import Textarea from '@/components/Shared/Textarea.vue'

  const emit = defineEmits(['handleSentReport'])
  const props = defineProps({
    activationId: {
      type: String
    },
    selectedReason: {
      type: Object as PropType<IReportReason>,
      required: true
    }
  })

  const { reportActivation } = useReport()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses } = useSharedCss()

  const loading = ref(false)
  const message = ref('')
  const evidence = ref<File | null>(null)
  const evidenceInputRef = ref()
  const evidenceError = ref<boolean>(false)
  const messageError = ref<boolean>(false)

  const evidenceIsRequired = computed(() => {
    return props.selectedReason.evidence_required ?? false
  })

  const errorClasses = 'tn:text-tn-red-500 tn:w-full tn:text-start tn:text-sm tn:leading-[160%]'
  const MESSAGE_MAX_LENGTH = 1000
  const MAX_EVIDENCE_SIZE_MB = 5
  const ALLOWED_EVIDENCE_MIME_TYPES = [
    'image/jpeg', // JPG
    'image/png', // PNG
    'image/webp', // WebP
    'application/zip', // ZIP
    'application/pdf', // PDF
    'video/mp4' // MP4
  ]

  const sendReport = async () => {
    if (
      !props.activationId ||
      !props.selectedReason ||
      (evidenceIsRequired.value && (!message.value || !evidence.value))
    )
      return
    loading.value = true
    const result = await reportActivation(
      props.activationId,
      props.selectedReason.reason_id,
      message.value,
      evidence.value
    )
    loading.value = false
    if (result) emit('handleSentReport', result)
  }

  const handleEvidenceChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      if (file) {
        evidence.value = file
        if (file.size > MAX_EVIDENCE_SIZE_MB * 1000 * 1000 || !ALLOWED_EVIDENCE_MIME_TYPES.includes(file.type)) {
          evidenceError.value = true
          return
        }
        evidenceError.value = false
      }
    }
  }

  const triggerEvidenceInput = () => {
    evidenceInputRef.value?.click()
  }

  const removeEvidenceFile = () => {
    evidence.value = null
    evidenceError.value = false
    if (evidenceInputRef.value) {
      evidenceInputRef.value.value = ''
    }
  }

  watch(
    () => message.value,
    (message: string) => {
      messageError.value = message.length > MESSAGE_MAX_LENGTH
    }
  )
</script>

<template>
  <div :class="adaptiveModalWrapperClasses()">
    <div :class="adaptiveModalHeaderClasses()">
      {{ selectedReason.reason_name }}
    </div>

    <div class="tn:flex tn:w-full tn:flex-col tn:items-center tn:gap-3">
      <Textarea
        v-model="message"
        :placeholder="$t('web_report_add_details_to_increase_chances_for_refunds')"
        :error-message="messageError ? $t('web_report_validation_text_too_long_max_1000_characters') : ''"
      />

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2">
        <input ref="evidenceInputRef" type="file" class="tn:hidden" @change="handleEvidenceChange" />
        <Button @click="triggerEvidenceInput" block gap="tn:gap-2">
          <AttachIcon class="tn:text-primary-900 tn:h-4.5 tn:w-4.5 tn:min-w-4.5" />
          <span>{{ $t('web_report_attach_evidences') }}</span>
        </Button>
        <div v-if="evidence" class="tn:flex tn:items-center tn:justify-between tn:gap-2">
          <div class="tn:flex tn:min-w-0 tn:items-center tn:gap-2">
            <div
              class="tn:bg-tn-black-900/5 tn:flex tn:h-8 tn:w-8 tn:min-w-8 tn:items-center tn:justify-center tn:rounded-full"
            >
              <FileIcon class="tn:text-tn-black-900 tn:h-4.5 tn:w-4.5 tn:min-w-4.5" />
            </div>
            <div class="tn:flex tn:min-w-0 tn:flex-col tn:gap-0.25 tn:text-start tn:text-xs">
              <div class="tn:max-w-50 tn:truncate tn:overflow-hidden tn:font-medium tn:lg:max-w-80">
                {{ evidence.name }}
              </div>
              <div class="tn:opacity-50">
                {{
                  evidence.size > 1000 * 1000
                    ? (evidence.size / (1000 * 1000)).toFixed(2) + ' mb'
                    : (evidence.size / 1000).toFixed(2) + ' kb'
                }}
              </div>
            </div>
          </div>
          <button @click="removeEvidenceFile">
            <DeleteIcon class="tn:text-tn-black-900 tn:h-4.5 tn:w-4.5 tn:min-w-4.5" />
          </button>
        </div>
      </div>

      <div v-if="evidenceError" :class="errorClasses">
        {{ $t('web_report_validation_invalid_file_max_size_5_mb_allowed_types_jpg_png_webp_zip_pdf_mp_4') }}
      </div>

      <div class="tn:text-center tn:text-sm tn:leading-[160%] tn:opacity-60">
        {{ $t('web_report_provide_more_information_and_details_here_to_increases_chances_for_refunds') }}
      </div>
    </div>

    <Button
      @click="sendReport"
      fill
      block
      :loading="loading"
      :disabled="(evidenceIsRequired && (!message || !evidence)) || messageError || evidenceError"
    >
      {{ $t('web_send_report_button') }}
    </Button>
  </div>
</template>
