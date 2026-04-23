<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { OtherGateway, OtherGatewayName, type IOtherGatewayOption } from '@/types/api/funds'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import Select from '@/components/Shared/Select.vue'

  const ALL_OPTIONS: IOtherGatewayOption[] = [
    {
      id: OtherGateway.pix_br,
      name: OtherGatewayName[OtherGateway.pix_br],
      provider: 'payssion',
      pm_id: 'pix_br'
    },
    {
      id: OtherGateway.alipay_cn,
      name: OtherGatewayName[OtherGateway.alipay_cn],
      provider: 'payssion',
      pm_id: 'alipay_cn'
    },
    {
      id: OtherGateway.unionpay_cn,
      name: OtherGatewayName[OtherGateway.unionpay_cn],
      provider: 'payssion',
      pm_id: 'unionpay_cn'
    },
    {
      id: OtherGateway.kakaopay_kr,
      name: OtherGatewayName[OtherGateway.kakaopay_kr],
      provider: 'payssion',
      pm_id: 'kakaopay_kr'
    },
    {
      id: OtherGateway.toss_kr,
      name: OtherGatewayName[OtherGateway.toss_kr],
      provider: 'payssion',
      pm_id: 'toss_kr'
    },
    {
      id: OtherGateway.payssion_test,
      name: OtherGatewayName[OtherGateway.payssion_test],
      provider: 'payssion',
      pm_id: 'payssion_test'
    }
  ]

  const emit = defineEmits<{
    (e: 'selectOtherGateway', data: { provider: string; pm_id: string }): void
  }>()

  const { isWlHelperUrl } = useWlHelper()

  const activeOtherGatewaysStr = isWlHelperUrl()
    ? import.meta.env.VITE_WL_ACTIVE_OTHER_PAY_GATEWAYS || '[]'
    : import.meta.env.VITE_ACTIVE_OTHER_PAY_GATEWAYS || '[]'
  const activeOtherGateways: string[] = JSON.parse(activeOtherGatewaysStr)

  const availableOptions =
    activeOtherGateways.length > 0 ? ALL_OPTIONS.filter((item) => activeOtherGateways.includes(item.id)) : []

  const selectedOptionId = ref<OtherGateway | null>(null)

  const selectItems = computed(() => availableOptions.map((opt) => ({ id: opt.id, text: opt.name })))

  const selectOption = (id: OtherGateway) => {
    selectedOptionId.value = id
    const option = availableOptions.find((opt) => opt.id === id)
    if (option) {
      emit('selectOtherGateway', { provider: option.provider, pm_id: option.pm_id })
    }
  }
</script>

<template>
  <div class="tn:flex tn:flex-col tn:gap-2">
    <div class="tn:text-sm tn:font-medium">{{ $t('web_other_gateway_label') }}</div>
    <Select
      :selected="selectedOptionId"
      :items="selectItems"
      :placeholder="$t('web_other_gateway_placeholder')"
      @select-item="selectOption"
    />
  </div>
</template>
