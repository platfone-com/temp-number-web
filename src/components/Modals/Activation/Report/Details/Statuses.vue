<script lang="ts" setup>
  import { ref, computed, type PropType } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { capitalizeFirstLetter } from '@/utils'
  import { type IReport } from '@/types/api/report'
  import { useSlideDownTransition } from '@/composables/useSlideDownTransition'
  import ArrowIcon from '@/assets/images/icons/report/details/arrow.svg'

  const props = defineProps({
    report: {
      type: Object as PropType<IReport>,
      required: true
    },
    classes: {
      type: Object as PropType<Record<string, string>>,
      required: true
    }
  })

  const { t } = useI18n()
  const { beforeEnter, enter, leave } = useSlideDownTransition()

  const tabs = computed(() => [
    { id: 'current', label: t('web_report_tab_current_status') },
    { id: 'reported', label: t('web_report_tab_reported_status') }
  ])
  const actState = computed(() => props.report.activation)
  const reportedActState = computed(() => JSON.parse(props.report.activation_state_snapshot))
  const actStateSmsText = computed(() => String(actState.value.sms_text || ''))
  const reportedActStateSmsText = computed(() => String(reportedActState.value.sms_text || ''))
  const actStateSmsCode = computed(() => String(actState.value.sms_code || ''))
  const reportedActStateSmsCode = computed(() => String(reportedActState.value.sms_code || ''))

  const activeTab = ref('current')
  const isMessageOpen = ref(false)
</script>

<template>
  <div>
    <div class="tn:bg-tn-tab-bg tn:mb-2 tn:flex tn:w-full tn:rounded-xl tn:p-1">
      <button
        v-for="tab in tabs"
        @click="activeTab = tab.id"
        :key="tab.id"
        class="tn:tracking-tightest tn:flex tn:w-1/2 tn:justify-center tn:px-4 tn:py-2 tn:text-xs tn:leading-[120%] tn:font-medium tn:transition-all tn:duration-200"
        :class="{
          'tn:bg-tn-bg tn:rounded-xl tn:shadow': activeTab === tab.id,
          'tn:opacity-40 tn:hover:opacity-60': activeTab !== tab.id
        }"
      >
        {{ tab.label }}
      </button>
    </div>
    <div :class="classes.block">
      <div :class="classes.item">
        <div :class="classes.itemTitle">{{ $t('web_activation_status') }}</div>
        <div :class="classes.itemValue">
          {{
            activeTab === 'current'
              ? capitalizeFirstLetter(actState.activation_status)
              : capitalizeFirstLetter(reportedActState.activation_status)
          }}
        </div>
      </div>
      <div :class="classes.item">
        <div :class="classes.itemTitle">{{ $t('web_billing_status') }}</div>
        <div :class="classes.itemValue">
          {{
            activeTab === 'current'
              ? capitalizeFirstLetter(actState.billing_status)
              : capitalizeFirstLetter(reportedActState.billing_status)
          }}
        </div>
      </div>
      <div :class="classes.item">
        <div :class="classes.itemTitle">{{ $t('web_sms_status') }}</div>
        <div :class="classes.itemValue">
          {{
            activeTab === 'current'
              ? capitalizeFirstLetter(actState.sms_status)
              : capitalizeFirstLetter(reportedActState.sms_status)
          }}
        </div>
      </div>
      <div :class="classes.item">
        <div :class="classes.itemTitle">{{ $t('web_sms_code') }}</div>
        <div :class="classes.itemValue">
          {{
            activeTab === 'current'
              ? actStateSmsCode || $t('notifications_not_available')
              : reportedActStateSmsCode || $t('notifications_not_available')
          }}
        </div>
      </div>
      <div :class="[classes.item, 'tn:cursor-pointer tn:flex-col tn:gap-1.5 tn:border-b-0 tn:!py-2']">
        <div
          @click="isMessageOpen = !isMessageOpen"
          class="tn:flex tn:w-full tn:items-center tn:justify-between tn:select-none"
        >
          <div :class="[classes.itemTitle]">{{ $t('web_full_message') }}</div>
          <div :class="classes.itemValue">
            <ArrowIcon
              :class="[
                'tn:text-tn-black-900 tn:h-6 tn:w-6 tn:transition-transform tn:duration-300',
                !isMessageOpen && 'tn:ltr:rotate-90 tn:rtl:-rotate-90'
              ]"
            />
          </div>
        </div>
        <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <div
            v-show="isMessageOpen"
            v-linkify="
              activeTab === 'current'
                ? actStateSmsText || $t('notifications_not_available')
                : reportedActStateSmsText || $t('notifications_not_available')
            "
            :class="['tn:w-full tn:overflow-hidden tn:pt-0 tn:text-start tn:text-xs tn:font-medium']"
          />
        </transition>
      </div>
    </div>
  </div>
</template>
