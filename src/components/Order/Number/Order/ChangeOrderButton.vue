<script lang="ts" setup></script>

<template>
  <button
    :class="[
      'tn:text-primary-900 tn:text-xxs tn:rounded-2xl tn:border-none tn:px-2 tn:py-0.5 tn:text-center tn:leading-3.5 tn:font-medium tn:lg:px-3 tn:lg:py-2 tn:lg:text-xs',
      'tn:bg-primary-900/10 tn:hover:bg-primary-900/15 tn:transition-colors tn:duration-300'
    ]"
  >
    {{ $t('web_order_change_tooltip') }}
  </button>
</template>
