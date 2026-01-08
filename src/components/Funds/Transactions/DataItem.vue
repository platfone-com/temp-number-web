<script lang="ts" setup>
  import { format } from 'date-fns'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { capitalizeFirstLetter } from '@/utils'
  import { useClipboard } from '@/composables/useClipboard'
  import type { ITransaction } from '@/types/api/funds'
  import CopyIcon from '@/assets/images/icons/copy.svg'

  const { t } = useI18n()
  const { copyToClipboard } = useClipboard()

  const props = defineProps<{
    transaction: ITransaction
    widthClasses: Record<string, string>
  }>()

  const headerSharedClasses = 'tn:px-1.5 tn:xs:px-3 tn:py-3.75 tn:text-sm tn:leading-4'

  const detailsText = computed(() => {
    const gateway = props.transaction.gateway || ''

    if (['manage', 'support'].includes(gateway)) {
      return t('web_funds_added')
    }

    if (['dailyReward', 'wheelOfLuck', 'slot'].includes(gateway)) {
      return t('web_funds_detaiils_free_reward')
    }

    const gatewayMap: Record<string, string> = {
      'stripe': t('gw_mapping_credit_cards'),
      'paypal': t('gw_mapping__paypal'),
      'cryptomus': t('gw_mapping__crypto'),
      'anypay': t('gw_mapping__anypay'),
      'appstore': t('gw_mapping__apple_i_tunes'),
      'gplay': t('gw_mapping__google_play'),
      'payeer': t('gw_mapping__payeer'),
      '0xprocessing': t('gw_mapping__crypto'),
      'binance': t('gw_mapping__crypto'),
      'mivion': t('gw_mapping__mivion'),
      'alipay_qq_wechat': t('web_alipay_qq_we_chat'),
      'wenjishou': t('web_alipay_qq_we_chat'),
      'perfectMoney': t('gw_mapping__perfect_money'),
      'anypayCard': t('gw_mapping__anypay')
    }
    const gatewayText = gatewayMap[gateway] || capitalizeFirstLetter(gateway)

    const stringKey = props.transaction.amount < 0 ? 'web_funds_detaiils_refunded' : 'web_funds_detaiils_funds_added'
    return t(stringKey).replace('__0__', gatewayText)
  })
</script>

<template>
  <div class="tn:border-tn-black-87 tn:mb-2 tn:flex tn:items-center tn:rounded-xl tn:border">
    <div
      :class="[headerSharedClasses, widthClasses.idWidthClasses, 'tn:flex tn:justify-start tn:ltr:pl-3 tn:rtl:pr-3']"
    >
      <CopyIcon
        @click="copyToClipboard(transaction.transaction_id)"
        class="tn:text-primary-900 tn:h-4 tn:w-4 tn:min-w-4 tn:cursor-pointer tn:fill-current"
      />
    </div>
    <div :class="[headerSharedClasses, widthClasses.dateWidthClasses]">
      {{ format(new Date(Number(transaction.created_at) * 1000), 'dd.MM.yy') }}
    </div>
    <div :class="[headerSharedClasses, widthClasses.gatewayWidthClasses, 'truncate']" :title="detailsText">
      {{ detailsText }}
    </div>
    <div
      :class="[
        headerSharedClasses,
        transaction.amount < 0 ? 'tn:text-primary-900' : 'tn:text-tn-green-500',
        widthClasses.amountWidthClasses,
        'tn:text-end tn:whitespace-nowrap tn:ltr:pr-3 tn:rtl:pl-3'
      ]"
    >
      <span dir="ltr">
        {{ transaction.amount < 0 ? '-' : '+' }}
        ${{ transaction.amount < 0 ? (transaction.amount * -1) / 100 : transaction.amount / 100 }}
      </span>
    </div>
  </div>
</template>
