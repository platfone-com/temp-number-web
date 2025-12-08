<script lang="ts" setup>
  import { type PropType } from 'vue'
  import type { VSDelimiter } from '@/types/order'
  import OrderDefaultSortIcon from '@/assets/images/icons/order-price-sort.svg'
  import OrderSortIcon from '@/assets/images/icons/order-price-arrow.svg'

  defineEmits(['sortByPrice'])

  defineProps({
    item: {
      type: Object as PropType<VSDelimiter>,
      required: true
    },
    sortDirection: {
      type: String as PropType<'asc' | 'desc' | null>,
      default: null
    },
    showScrollbar: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div
    :class="[
      'tn:flex tn:h-12 tn:items-center tn:justify-between tn:pt-5 tn:font-medium',
      showScrollbar ? 'tn:lg:ltr:pr-4 tn:lg:ltr:pl-6 tn:lg:rtl:pr-6 tn:lg:rtl:pl-4' : 'tn:lg:px-6'
    ]"
  >
    {{ item.label }}
    <button
      v-if="item.showSort"
      @click="$emit('sortByPrice')"
      class="tn:flex tn:items-center tn:gap-1.5 tn:border-none tn:bg-transparent"
    >
      <span class="tn:text-tn-black-900 tn:text-sm tn:font-medium tn:opacity-60">
        {{ $t('web_price_items_sorting') }}
      </span>
      <OrderDefaultSortIcon v-if="!sortDirection" class="tn:text-tn-black-900 tn:h-4 tn:w-4" />
      <OrderSortIcon v-else class="tn:h-4 tn:w-4" :class="[sortDirection === 'asc' ? 'tn:rotate-180' : '']" />
    </button>
  </div>
</template>
