<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { OtherGateway, OtherGatewayName, type IOtherGatewayOption } from '@/types/api/funds'
  import { useWlHelper } from '@/composables/wl/useWlHelper'
  import Select from '@/components/Shared/Select.vue'

  const ALL_OPTIONS: IOtherGatewayOption[] = [
    {
      id: OtherGateway.payssion_test,
      name: OtherGatewayName[OtherGateway.payssion_test],
      provider: 'payssion',
      pm_id: 'payssion_test'
    },
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
      id: OtherGateway.qris_id,
      name: OtherGatewayName[OtherGateway.qris_id],
      provider: 'payssion',
      pm_id: 'qris_id'
    },
    {
      id: OtherGateway.dana_id,
      name: OtherGatewayName[OtherGateway.dana_id],
      provider: 'payssion',
      pm_id: 'dana_id'
    },
    {
      id: OtherGateway.ovo_id,
      name: OtherGatewayName[OtherGateway.ovo_id],
      provider: 'payssion',
      pm_id: 'ovo_id'
    },
    {
      id: OtherGateway.gcash_ph,
      name: OtherGatewayName[OtherGateway.gcash_ph],
      provider: 'payssion',
      pm_id: 'gcash_ph'
    },
    {
      id: OtherGateway.grabpay_ph,
      name: OtherGatewayName[OtherGateway.grabpay_ph],
      provider: 'payssion',
      pm_id: 'grabpay_ph'
    },
    {
      id: OtherGateway.vietqr_vn,
      name: OtherGatewayName[OtherGateway.vietqr_vn],
      provider: 'payssion',
      pm_id: 'vietqr_vn'
    },
    {
      id: OtherGateway.truemoney_th,
      name: OtherGatewayName[OtherGateway.truemoney_th],
      provider: 'payssion',
      pm_id: 'truemoney_th'
    },
    {
      id: OtherGateway.promptpay_th,
      name: OtherGatewayName[OtherGateway.promptpay_th],
      provider: 'payssion',
      pm_id: 'promptpay_th'
    },
    {
      id: OtherGateway.boleto_br,
      name: OtherGatewayName[OtherGateway.boleto_br],
      provider: 'payssion',
      pm_id: 'boleto_br'
    },
    {
      id: OtherGateway.efecty_co,
      name: OtherGatewayName[OtherGateway.efecty_co],
      provider: 'payssion',
      pm_id: 'efecty_co'
    },
    {
      id: OtherGateway.oxxo_mx,
      name: OtherGatewayName[OtherGateway.oxxo_mx],
      provider: 'payssion',
      pm_id: 'oxxo_mx'
    },
    {
      id: OtherGateway.mercadopago_br,
      name: OtherGatewayName[OtherGateway.mercadopago_br],
      provider: 'payssion',
      pm_id: 'mercadopago_br'
    },
    {
      id: OtherGateway.nequi_co,
      name: OtherGatewayName[OtherGateway.nequi_co],
      provider: 'payssion',
      pm_id: 'nequi_co'
    },
    {
      id: OtherGateway.fpx_my,
      name: OtherGatewayName[OtherGateway.fpx_my],
      provider: 'payssion',
      pm_id: 'fpx_my'
    },
    {
      id: OtherGateway.spei_mx,
      name: OtherGatewayName[OtherGateway.spei_mx],
      provider: 'payssion',
      pm_id: 'spei_mx'
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
      :max-visible-items="5"
      searchable
      @select-item="selectOption"
    />
  </div>
</template>
