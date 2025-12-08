<script lang="ts" setup>
  import TrashIcon from '@/assets/images/icons/order/trash.svg'

  defineProps({
    disabled: Boolean
  })
</script>

<template>
  <button :disabled="disabled"><TrashIcon class="tn:text-primary-900 tn:h-5 tn:w-5" /></button>
</template>
