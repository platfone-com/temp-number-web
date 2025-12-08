<script lang="ts" setup>
  import { ref, computed, type PropType } from 'vue'
  import { format } from 'date-fns'
  import { useI18n } from 'vue-i18n'
  import { useOrderStore } from '@/stores/order'
  import { useClipboard } from '@/composables/useClipboard'
  import { type IReport } from '@/types/api/report'
  import CopyIcon from '@/assets/images/icons/copy.svg'

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
  const { copyToClipboard } = useClipboard()
  const { servicesMap, countriesMap } = useOrderStore()

  const activationIdRef = ref()
  const phoneRef = ref()

  const serviceName = computed(() => {
    const serviceId = props.report.activation.service_id
    return serviceId === 'other' ? t('web_any_other_item') : servicesMap.get(serviceId)?.name
  })
  const price = computed(() => {
    if (!props.report.activation.customer_price) return 0
    return props.report.activation.customer_price / 100
  })
</script>

<template>
  <div :class="classes.block">
    <div :class="classes.item">
      <div class="tn:text-sm tn:leading-4.5 tn:font-medium">{{ $t('web_activation_details') }}</div>
    </div>
    <div :class="classes.item">
      <div :class="classes.itemTitle">{{ $t('web_activation_id') }}</div>
      <div :class="[classes.itemValue, 'tn:flex tn:items-center tn:gap-1']">
        <span ref="activationIdRef">{{ report.activation.activation_id }}</span>
        <CopyIcon
          @click="copyToClipboard(report.activation.activation_id, activationIdRef)"
          class="tn:text-primary-900 tn:h-3.5 tn:w-3.5 tn:min-w-3.5 tn:cursor-pointer tn:fill-current"
        />
      </div>
    </div>
    <div :class="classes.item">
      <div :class="classes.itemTitle">{{ $t('web_created_at') }}</div>
      <div :class="classes.itemValue">
        {{ format(new Date(Number(report.activation.created_at) * 1000), 'hh:mm a, d MMM yyyy') }}
      </div>
    </div>
    <div :class="classes.item">
      <div :class="classes.itemTitle">{{ $t('web_phone_number') }}</div>
      <div :class="[classes.itemValue, 'tn:flex tn:items-center tn:gap-1']">
        <span dir="ltr">
          +<span ref="phoneRef">{{ report.activation.phone }}</span>
        </span>
        <CopyIcon
          @click="copyToClipboard(report.activation.phone, phoneRef)"
          class="tn:text-primary-900 tn:h-3.5 tn:w-3.5 tn:min-w-3.5 tn:cursor-pointer tn:fill-current"
        />
      </div>
    </div>
    <div :class="classes.item">
      <div :class="classes.itemTitle">{{ $t('web_title_service') }}</div>
      <div :class="classes.itemValue">{{ serviceName }}</div>
    </div>
    <div :class="classes.item">
      <div :class="classes.itemTitle">{{ $t('web_service_country') }}</div>
      <div :class="classes.itemValue">{{ countriesMap.get(report.activation.country_id)?.name }}</div>
    </div>
    <div :class="[classes.item, 'tn:border-b-0']">
      <div :class="classes.itemTitle">{{ $t('web_price_items_sorting') }}</div>
      <div :class="classes.itemValue">${{ price }}</div>
    </div>
  </div>
</template>
