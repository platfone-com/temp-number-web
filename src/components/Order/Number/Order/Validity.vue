<script lang="ts" setup>
  import ValidityIcon from '@/assets/images/icons/order/validity.svg'
</script>

<template>
  <div
    class="tn:border-b-tn-black-90 tn:mt-2 tn:mb-2 tn:flex tn:items-center tn:justify-between tn:border-b tn:border-dashed tn:pt-2 tn:pb-4"
  >
    <div class="tn:flex tn:items-center tn:gap-2.5">
      <div class="tn:px-1">
        <ValidityIcon class="tn:text-tn-black-900 tn:h-5.5 tn:w-5.5" />
      </div>
      <span class="tn:text-sm tn:lg:text-base">{{ $t('web_order_validity') }}</span>
    </div>
    <div class="tn:text-primary-900 tn:text-xxs tn:lg:text-sm">{{ $t('web_order_up_to_20_minutes') }}</div>
  </div>
</template>
